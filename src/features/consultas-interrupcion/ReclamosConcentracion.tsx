import { useEffect, useId, useMemo, useRef, useState } from "react";
import { CircleCheck } from "lucide-react";
import { FOCUS_RING } from "@/components/ui";
import { FaseReposicion, ReclamosInterrupcion } from "@/data/types";
import { fmtHoraCorta, formatHora, formatNumero, parseFechaHora } from "@/lib/format";

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
// Dos tamaños (prop `size`): "compact" (la hoja; área de 84px) y "expanded"
// (modal "Reclamos de la interrupción"; área de 170px, líneas guía cada 30
// min, rótulos "F2 · 07:04", una marca por reclamo bajo la base —rug— y los
// Nro. de reclamo cercanos en el tooltip; eje cada 1 h, o cada 30 min si dura
// menos de 2 h). Las marcas de reposición se dibujan siempre; los rótulos van
// de izquierda a derecha y uno que quede a menos de 24px del anterior no se
// dibuja (expanded: ancho real del rótulo + 8px); el de la fase seleccionada
// se dibuja siempre y, si choca, se oculta el del vecino.
// El SVG usa el ancho real medido (ResizeObserver): sin preserveAspectRatio
// "none", nada se deforma.
// Sin reclamos: una línea con ícono y "No hubo reclamos durante la
// interrupción." (sin gráfico).
const PUNTOS = 72;
const ALTO_ROTULOS = 16;
const ALTO_RUG = 16;
const GAP_ROTULOS_COMPACT = 24;
const GAP_ROTULOS_EXPANDED = 8;
const PASOS_EJE = [30, 60, 120, 180, 360, 720, 1440];

// Ancho real de un rótulo de fase (10.5px semibold), medido con canvas; sin
// canvas, una estimación por caracteres.
let ctxMedir: CanvasRenderingContext2D | null | undefined;
function anchoRotulo(texto: string) {
  if (ctxMedir === undefined) ctxMedir = typeof document !== "undefined" ? document.createElement("canvas").getContext("2d") : null;
  if (!ctxMedir) return texto.length * 6.4;
  ctxMedir.font = `600 10.5px ${getComputedStyle(document.body).fontFamily}`;
  return ctxMedir.measureText(texto).width;
}

// Minuto (desde el inicio) del pico de la curva de densidad: el mismo que
// dibuja el gráfico. Lo usa la franja de cifras del modal.
export function minutoDelPico(minutos: number[], duracion: number) {
  const h = Math.max(duracion / 14, 6);
  let mejor = 0;
  let idx = 0;
  for (let i = 0; i < PUNTOS; i++) {
    const v = densidad(minutos, (i / (PUNTOS - 1)) * duracion, h);
    if (v > mejor) {
      mejor = v;
      idx = i;
    }
  }
  return Math.round((idx / (PUNTOS - 1)) * duracion);
}

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
  size = "compact",
  resaltados,
  onResaltar,
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
  size?: "compact" | "expanded";
  // expanded: Nro. de reclamo (REC) resaltados —marca del rug—, compartidos
  // con quien lo aloja; el hover sobre el gráfico los informa por onResaltar.
  resaltados?: string[];
  onResaltar?: (ids: string[]) => void;
}) {
  const expanded = size === "expanded";
  const ALTO_AREA = expanded ? 170 : 84;
  const BASE_Y = ALTO_ROTULOS + ALTO_AREA;
  const ALTO_SVG = BASE_Y + 1 + (expanded ? ALTO_RUG : 0);
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

  // Rótulos de fase visibles (de izquierda a derecha; ver el comentario de
  // arriba). La marca se dibuja siempre, el rótulo solo si no choca.
  const marcas = fasesMin
    .filter((f): f is { nro: number; min: number } => f.min !== null)
    .map((f) => {
      const x = xDe(Math.min(duracion, Math.max(0, f.min)));
      const aLaIzq = W > 0 && x / W > 0.92;
      const texto = expanded ? `F${f.nro} · ${hora(Math.round(f.min))}` : `F${f.nro}`;
      const w = expanded ? anchoRotulo(texto) : 0;
      return { nro: f.nro, x, aLaIzq, texto, desde: aLaIzq ? x - 4 - w : x + 4, hasta: aLaIzq ? x - 4 : x + 4 + w };
    })
    .sort((a, b) => a.x - b.x);
  const chocan = (a: (typeof marcas)[number], b: (typeof marcas)[number]) =>
    expanded ? Math.max(a.desde, b.desde) - Math.min(a.hasta, b.hasta) < GAP_ROTULOS_EXPANDED : Math.abs(a.x - b.x) < GAP_ROTULOS_COMPACT;
  const conRotulo: typeof marcas = [];
  const sel = marcas.find((m) => m.nro === faseSeleccionada);
  if (sel) conRotulo.push(sel);
  for (const m of marcas) if (m !== sel && !conRotulo.some((o) => chocan(m, o))) conRotulo.push(m);

  // Eje compact: horas en punto entre el 14% y el 86% del ancho; si hay muchas, de a
  // varias horas (alineadas al reloj) para que no se amontonen.
  const horasEje = expanded ? [] : (() => {
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

  // Eje expanded: horas cada 1 h (cada 30 min si dura menos de 2 h), alineadas
  // al reloj; si no entran, el paso sube (1 h → 2 h → 3 h…). Compact: las
  // horas en punto de arriba.
  const etiquetasEje: { min: number; texto: string }[] = expanded
    ? (() => {
        const base = duracion < 120 ? 30 : 60;
        const ancho = conDia ? 96 : 54;
        const paso = PASOS_EJE.find((p) => p >= base && W / (duracion / p) >= ancho) ?? 1440;
        const enDia = inicio.getHours() * 60 + inicio.getMinutes();
        const margen = conDia ? 96 : 70; // lugar para "Inicio hh:mm" / "Fin hh:mm"
        const res: { min: number; texto: string }[] = [];
        for (let m = Math.ceil((enDia + 0.001) / paso) * paso - enDia; m < duracion; m += paso) {
          const x = xDe(m);
          if (x >= margen && x <= W - margen) res.push({ min: m, texto: fmtHoraCorta(new Date(inicio.getTime() + m * 60000), conDia) });
        }
        return res;
      })()
    : horasEje.map((h) => ({ min: h.min, texto: `${String(h.h).padStart(2, "0")}:00` }));
  // Líneas guía (expanded): cada 30 min alineadas al reloj (más espaciadas
  // si la interrupción es muy larga: máx. ~40).
  const guias: number[] = [];
  if (expanded) {
    const paso = PASOS_EJE.find((p) => duracion / p <= 40) ?? 1440;
    const enDia = inicio.getHours() * 60 + inicio.getMinutes();
    for (let m = Math.ceil((enDia + 0.001) / paso) * paso - enDia; m < duracion; m += paso) guias.push(m);
  }

  // Hover: minuto bajo el cursor y lo que había pasado hasta ahí.
  const tHover = hoverX !== null && W > 0 ? (hoverX / W) * duracion : null;
  const cercanos = expanded && tHover !== null ? datos.detalle.filter((r) => Math.abs(r.minuto - tHover) <= duracion / 30) : [];
  const hasta = tHover !== null ? minutos.filter((m) => m <= tHover).length : 0;
  const repuestas = tHover !== null ? fasesMin.filter((f) => f.min !== null && f.min <= tHover).length : 0;

  const resumen = `${formatNumero(total)} ${total === 1 ? "reclamo" : "reclamos"} entre ${hora(0)} y ${hora(duracion)}, mayor concentración cerca de ${hora(Math.round((curva.pico / (PUNTOS - 1)) * duracion))}`;

  // Mueve la línea de hover y, en expanded, informa los reclamos cercanos
  // (±duración/30) para que el modal resalte sus filas.
  function moverHover(x: number | null) {
    setHoverX(x);
    if (!expanded || !onResaltar) return;
    const t = x !== null && W > 0 ? (x / W) * duracion : null;
    onResaltar(t === null ? [] : datos.detalle.filter((r) => Math.abs(r.minuto - t) <= duracion / 30).map((r) => r.rec));
  }
  function onMouseMove(e: React.MouseEvent) {
    const r = cajaRef.current?.getBoundingClientRect();
    if (r) moverHover(Math.min(W, Math.max(0, e.clientX - r.left)));
  }
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape" && hoverX !== null) {
      e.stopPropagation();
      moverHover(null);
    } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const paso = W * 0.05 * (e.key === "ArrowRight" ? 1 : -1);
      moverHover(Math.min(W, Math.max(0, (hoverX ?? (paso > 0 ? 0 : W)) + paso)));
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
        onMouseLeave={() => moverHover(null)}
        onKeyDown={onKeyDown}
        onBlur={() => moverHover(null)}
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

            {/* Líneas guía (expanded): cada 30 min, detrás de la curva. */}
            {guias.map((m) => (
              <rect key={m} x={Math.round(xDe(m))} y={ALTO_ROTULOS} width={1} height={ALTO_AREA} style={{ fill: "var(--color-fill-muted)" }} />
            ))}

            {/* Marcas de reposición: siempre; el rótulo, si no choca. */}
            {marcas.map((f) => {
              const sel = f.nro === faseSeleccionada;
              return (
                <g key={f.nro}>
                  <line x1={f.x} x2={f.x} y1={0} y2={BASE_Y} strokeWidth={1} strokeDasharray="2 3" className={sel ? "stroke-secondary" : "stroke-neutral-300"} />
                  {conRotulo.includes(f) && (
                    <text
                      x={f.aLaIzq ? f.x - 4 : f.x + 4}
                      y={11}
                      textAnchor={f.aLaIzq ? "end" : "start"}
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
                      {f.texto}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Base, área y curva */}
            <rect x={0} y={BASE_Y} width={W} height={1} style={{ fill: "var(--color-border)" }} />
            <path d={area} fill={`url(#${idBase}-area)`} />
            <path d={linea} fill="none" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" style={{ stroke: "var(--color-primary)" }} />

            {/* Rug (expanded): una marca por reclamo bajo la base. */}
            {expanded &&
              datos.detalle.map((r) => {
                const hl = resaltados?.includes(r.rec) ?? false;
                const w = hl ? 3 : 2;
                return (
                  <rect
                    key={r.rec}
                    x={xDe(Math.min(duracion, r.minuto)) - w / 2}
                    y={BASE_Y + 3}
                    width={w}
                    height={hl ? 12 : 10}
                    rx={1}
                    style={{ fill: "var(--color-secondary)", opacity: hl ? 1 : 0.55 }}
                  />
                );
              })}

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
            {cercanos.length > 0 && (
              <p className="tabular-nums">
                Nro. reclamo: {cercanos.slice(0, 3).map((r) => r.rec).join(", ")}
                {cercanos.length > 3 ? ` y ${cercanos.length - 3} más` : ""}
              </p>
            )}
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
        {etiquetasEje.map((h) => (
          <span key={h.min} className="absolute top-0 -translate-x-1/2 whitespace-nowrap text-neutral-500" style={{ left: `${(h.min / duracion) * 100}%` }}>
            {h.texto}
          </span>
        ))}
        <span className="absolute right-0 top-0 whitespace-nowrap">
          <span className="text-neutral-500">Fin</span> <span className="font-medium text-neutral-700">{horaConDia(duracion)}</span>
        </span>
      </div>
    </div>
  );
}
