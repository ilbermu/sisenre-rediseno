import { useEffect, useId, useMemo, useRef, useState } from "react";
import { CircleCheck } from "lucide-react";
import { FOCUS_RING } from "@/components/ui";
import { FaseReposicion, ReclamosInterrupcion } from "@/data/types";
import { formatHora, formatNumero, parseFechaHora } from "@/lib/format";

// Gráfico de concentración de reclamos (sección "Reclamos durante la
// interrupción" de la hoja de Consulta de interrupciones; ver
// DESIGN_SYSTEM.md, "ReclamosConcentracion"). El eje X es la interrupción
// (del inicio a `fin`, el mismo fin que usa la Duración de la franja de
// cifras) y la curva es la densidad de reclamos: estimación de kernel
// gaussiano (ancho de banda = máx(duración/14, 6 min)), 72 puntos, normalizada
// a su máximo, suavizada con Catmull-Rom → Bézier con los puntos de control
// limitados al rango de cada tramo (la curva nunca baja de la base ni sube
// del pico). Sin KPIs ni frase: la cantidad está en la franja de cifras y el
// "80% llegó en" en el modal de detalle.
//   - Área con degradé vertical de --color-primary (28% → 2%), línea de 2px y
//     base de 1px (--color-border).
//   - Reposiciones: línea vertical punteada (neutral-300) en la hora de cada
//     fase, con su rótulo "F1", "F2"… arriba; la fase seleccionada en la
//     línea de tiempo va en --color-secondary. Clic en un rótulo la selecciona.
//   - Primer reclamo: punto de 9px sobre la curva y "1.º reclamo hh:mm".
//   - Eje en una fila: "Inicio hh:mm" · horas en punto (entre 14% y 86%) ·
//     "Fin hh:mm" (con dd/mm si dura más de un día).
//   - Hover: línea vertical + tooltip oscuro con la hora, "N de M reclamos
//     hasta acá" y las fases repuestas. Es focusable: ←/→ mueven la línea de
//     a 5% del ancho, Escape la oculta.
// El SVG usa el ancho real medido (ResizeObserver): sin preserveAspectRatio
// "none", nada se deforma.
// Sin reclamos: una línea con ícono y "No hubo reclamos durante la
// interrupción." (sin gráfico).
const PUNTOS = 72;
const ALTO_AREA = 84;
const ALTO_ROTULOS = 16;
const ALTO_SVG = ALTO_ROTULOS + ALTO_AREA + 1;
const BASE_Y = ALTO_ROTULOS + ALTO_AREA;

// Densidad gaussiana de los reclamos (minutos) en el minuto t, sin normalizar.
function densidad(minutos: number[], t: number, h: number) {
  let d = 0;
  for (const m of minutos) d += Math.exp(-0.5 * ((t - m) / h) ** 2);
  return d;
}

// Catmull-Rom → Bézier cúbico, con los puntos de control de cada tramo
// limitados al rango vertical del tramo (sin sobreimpulso).
function trazoSuave(pts: { x: number; y: number }[]) {
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const lo = Math.min(p1.y, p2.y);
    const hi = Math.max(p1.y, p2.y);
    const limitar = (y: number) => Math.min(hi, Math.max(lo, y));
    d += ` C${p1.x + (p2.x - p0.x) / 6},${limitar(p1.y + (p2.y - p0.y) / 6)} ${p2.x - (p3.x - p1.x) / 6},${limitar(p2.y - (p3.y - p1.y) / 6)} ${p2.x},${p2.y}`;
  }
  return d;
}

const dd_mm = (d: Date) => `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;

export default function ReclamosConcentracion({
  datos,
  inicio: inicioProp,
  fin: finProp,
  fases,
  faseSeleccionada,
  onSeleccionarFase,
}: {
  datos: ReclamosInterrupcion;
  // Inicio y fin de la interrupción (fin = última reposición, como en la
  // Duración de la hoja). Sin ellos, los de `datos`.
  inicio: Date | null;
  fin: Date | null;
  fases: FaseReposicion[];
  // nro de la fase seleccionada en la línea de tiempo.
  faseSeleccionada: number | null;
  onSeleccionarFase: (nro: number) => void;
}) {
  const inicio = inicioProp ?? datos.inicio;
  const fin = finProp ?? datos.fin;
  const duracion = Math.max(1, Math.round((fin.getTime() - inicio.getTime()) / 60000));
  const conDia = duracion > 1440;
  const minutos = useMemo(() => datos.minutos.map((m) => Math.min(duracion, Math.max(0, m))), [datos, duracion]);
  const total = minutos.length;

  const idBase = useId().replace(/:/g, "");
  const cajaRef = useRef<HTMLDivElement>(null);
  const [ancho, setAncho] = useState(0);
  useEffect(() => {
    const el = cajaRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setAncho(Math.floor(e.contentRect.width)));
    ro.observe(el);
    setAncho(Math.floor(el.getBoundingClientRect().width));
    return () => ro.disconnect();
  }, [total]);
  const [hoverX, setHoverX] = useState<number | null>(null);

  const hora = (min: number) => formatHora(new Date(inicio.getTime() + min * 60000));
  const horaConDia = (min: number) => {
    const d = new Date(inicio.getTime() + min * 60000);
    return conDia ? `${dd_mm(d)} ${formatHora(d)}` : formatHora(d);
  };

  // Curva: 72 muestras de la densidad, normalizadas a su máximo.
  const curva = useMemo(() => {
    if (total === 0) return null;
    const h = Math.max(duracion / 14, 6);
    const valores = Array.from({ length: PUNTOS }, (_, i) => densidad(minutos, (i / (PUNTOS - 1)) * duracion, h));
    const max = Math.max(...valores);
    const norm = valores.map((v) => v / max);
    return { h, max, norm, pico: norm.indexOf(1) };
  }, [minutos, duracion, total]);

  if (total === 0 || !curva) {
    return (
      <p className="flex items-center gap-2 text-body-sm text-neutral-600">
        <CircleCheck size={15} strokeWidth={1.5} className="shrink-0 text-neutral-400" aria-hidden />
        No hubo reclamos durante la interrupción.
      </p>
    );
  }

  const W = ancho;
  const xDe = (min: number) => (min / duracion) * W;
  const yDe = (v: number) => BASE_Y - v * ALTO_AREA;
  const pts = curva.norm.map((v, i) => ({ x: (i / (PUNTOS - 1)) * W, y: yDe(v) }));
  const linea = W > 0 ? trazoSuave(pts) : "";
  const area = W > 0 ? `${linea} L${W},${BASE_Y} L0,${BASE_Y} Z` : "";

  const primero = Math.min(...minutos);
  const primeroX = xDe(primero);
  const primeroY = yDe(densidad(minutos, primero, curva.h) / curva.max);
  const primeroALaIzquierda = W > 0 && primeroX / W > 0.7;

  const fasesMin = fases.map((f) => {
    const t = parseFechaHora(f.horaRep);
    return { nro: f.nro, min: t ? (t.getTime() - inicio.getTime()) / 60000 : null };
  });

  // Eje: horas en punto entre el 14% y el 86% del ancho; si hay muchas, de a
  // varias horas (alineadas al reloj) para que no se amontonen.
  const horasEje = (() => {
    const todas: { min: number; h: number }[] = [];
    const t0 = new Date(inicio);
    t0.setMinutes(0, 0, 0);
    for (let t = t0.getTime() + 3600000; t < fin.getTime(); t += 3600000) {
      const min = (t - inicio.getTime()) / 60000;
      const frac = min / duracion;
      if (frac >= 0.14 && frac <= 0.86) todas.push({ min, h: new Date(t).getHours() });
    }
    const paso = [1, 2, 3, 6, 12, 24].find((p) => todas.filter((x) => x.h % p === 0).length <= 5) ?? 24;
    return todas.filter((x) => x.h % paso === 0);
  })();

  // Hover: minuto bajo el cursor y lo que había pasado hasta ahí.
  const tHover = hoverX !== null && W > 0 ? (hoverX / W) * duracion : null;
  const hasta = tHover !== null ? minutos.filter((m) => m <= tHover).length : 0;
  const repuestas = tHover !== null ? fasesMin.filter((f) => f.min !== null && f.min <= tHover).length : 0;

  const resumen = `${formatNumero(total)} ${total === 1 ? "reclamo" : "reclamos"} entre ${hora(0)} y ${hora(duracion)}, mayor concentración cerca de ${hora(Math.round((curva.pico / (PUNTOS - 1)) * duracion))}`;

  function onMouseMove(e: React.MouseEvent) {
    const r = cajaRef.current?.getBoundingClientRect();
    if (r) setHoverX(Math.min(W, Math.max(0, e.clientX - r.left)));
  }
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape" && hoverX !== null) {
      e.stopPropagation();
      setHoverX(null);
    } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const paso = W * 0.05 * (e.key === "ArrowRight" ? 1 : -1);
      setHoverX((x) => Math.min(W, Math.max(0, (x ?? (paso > 0 ? 0 : W)) + paso)));
    }
  }

  const tooltipALaIzquierda = W > 0 && hoverX !== null && hoverX / W > 0.6;
  return (
    <div>
      <div
        ref={cajaRef}
        tabIndex={0}
        role="group"
        aria-label={resumen}
        onMouseMove={onMouseMove}
        onMouseLeave={() => setHoverX(null)}
        onKeyDown={onKeyDown}
        onBlur={() => setHoverX(null)}
        className={`relative w-full rounded-sm ${FOCUS_RING}`}
        style={{ height: ALTO_SVG }}
      >
        {W > 0 && (
          <svg viewBox={`0 0 ${W} ${ALTO_SVG}`} width={W} height={ALTO_SVG} className="block overflow-visible">
            <defs>
              <linearGradient id={`${idBase}-area`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" style={{ stopColor: "var(--color-primary)", stopOpacity: 0.28 }} />
                <stop offset="100%" style={{ stopColor: "var(--color-primary)", stopOpacity: 0.02 }} />
              </linearGradient>
            </defs>

            {/* Marcas de reposición */}
            {fasesMin.map((f) => {
              if (f.min === null) return null;
              const x = xDe(Math.min(duracion, Math.max(0, f.min)));
              const sel = f.nro === faseSeleccionada;
              const aLaIzq = x / W > 0.92;
              return (
                <g key={f.nro}>
                  <line x1={x} x2={x} y1={0} y2={BASE_Y} strokeWidth={1} strokeDasharray="2 3" className={sel ? "stroke-secondary" : "stroke-neutral-300"} />
                  <text
                    x={aLaIzq ? x - 4 : x + 4}
                    y={11}
                    textAnchor={aLaIzq ? "end" : "start"}
                    role="button"
                    tabIndex={0}
                    aria-label={`Seleccionar la fase ${f.nro}`}
                    onClick={() => onSeleccionarFase(f.nro)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        onSeleccionarFase(f.nro);
                      }
                    }}
                    className={`cursor-pointer select-none text-[10.5px] font-semibold ${sel ? "fill-secondary" : "fill-neutral-500"}`}
                  >
                    F{f.nro}
                  </text>
                </g>
              );
            })}

            {/* Base, área y curva */}
            <rect x={0} y={BASE_Y} width={W} height={1} style={{ fill: "var(--color-border)" }} />
            <path d={area} fill={`url(#${idBase}-area)`} />
            <path d={linea} fill="none" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" style={{ stroke: "var(--color-primary)" }} />

            {/* Primer reclamo */}
            <circle cx={primeroX} cy={primeroY} r={3.5} strokeWidth={2} className="fill-surface stroke-secondary" />
            <text
              x={primeroALaIzquierda ? primeroX - 9 : primeroX + 9}
              y={Math.max(primeroY - 8, ALTO_ROTULOS + 14)}
              textAnchor={primeroALaIzquierda ? "end" : "start"}
              className="fill-secondary text-[11px] font-medium select-none"
            >
              1.º reclamo {hora(primero)}
            </text>

            {/* Línea del hover */}
            {hoverX !== null && <line x1={hoverX} x2={hoverX} y1={ALTO_ROTULOS} y2={BASE_Y} strokeWidth={1} className="stroke-neutral-400" pointerEvents="none" />}
          </svg>
        )}

        {hoverX !== null && tHover !== null && (
          <div
            role="status"
            className="pointer-events-none absolute z-10 rounded-[6px] bg-neutral-900 px-2.5 py-1.5 text-[11.5px] leading-4 text-white shadow-md whitespace-nowrap"
            style={{ top: ALTO_ROTULOS + 4, ...(tooltipALaIzquierda ? { right: W - hoverX + 10 } : { left: hoverX + 10 }) }}
          >
            <p className="font-bold tabular-nums">{horaConDia(tHover)}</p>
            <p className="tabular-nums">
              {formatNumero(hasta)} de {formatNumero(total)} reclamos hasta acá
            </p>
            {fases.length > 0 && (
              <p className="tabular-nums">
                {repuestas > 0 ? `Repuestas ${repuestas} de ${fases.length} ${fases.length === 1 ? "fase" : "fases"}` : "Sin reposiciones todavía"}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Eje */}
      <div className="relative mt-1.5 h-4 text-[11px] leading-4 tabular-nums">
        <span className="absolute left-0 top-0 whitespace-nowrap">
          <span className="text-neutral-500">Inicio</span> <span className="font-medium text-neutral-700">{horaConDia(0)}</span>
        </span>
        {horasEje.map((h) => (
          <span key={h.min} className="absolute top-0 -translate-x-1/2 whitespace-nowrap text-neutral-500" style={{ left: `${(h.min / duracion) * 100}%` }}>
            {String(h.h).padStart(2, "0")}:00
          </span>
        ))}
        <span className="absolute right-0 top-0 whitespace-nowrap">
          <span className="text-neutral-500">Fin</span> <span className="font-medium text-neutral-700">{horaConDia(duracion)}</span>
        </span>
      </div>
    </div>
  );
}
