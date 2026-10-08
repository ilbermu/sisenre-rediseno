import { useState, useRef, useEffect, useMemo, useId } from "react";
import { ReclamosInterrupcion } from "@/data/types";
import {
  fmtDelta,
  fmtDuracion,
  fmtHoraCorta,
  formatFechaHora,
  formatNumero,
  partesDuracion,
  VALOR_VACIO,
} from "@/lib/format";

// ── Reclamos durante la interrupción ─────────────────────────────────
// Dos piezas: el gráfico completo (ReclamosTimeline) en el modal "Datos de
// la Interrupción" — un solo patrón para todos los volúmenes: línea de la
// interrupción con un hito por reclamo, con marcas de hora sobre el eje — y
// un resumen compacto de una línea, sin gráfico, en la card Interrupciones
// de Modificar interrupción, debajo de su tabla (ReclamosResumenCompacto),
// que abre ese modal.
//
// Estructura: header + chip DURACIÓN → KPIs → pista → INICIO/FIN. Colores
// por token:
//   textos → text-muted · borde de la card → border
//   pista → viz-track · hito dentro del 80% → viz-milestone · fuera →
//   viz-milestone-muted · marcas de hora → viz-tick (geometría del gráfico:
//   tokens --color-viz-* de index.css, sobre la escala neutral)
//   primer reclamo y valores → secondary · banda de densidad → primary
//   chip de duración → primary-tint / chip-border
//   rótulos del chip y de la banda → color-mix sobre secondary / primary.
// La X no sale de un viewBox fijo: el viewBox usa el ancho real medido, la
// pista va de x=8 a ancho−8 y cada reclamo se ubica proporcional a su
// tiempo desde el inicio — así la separación mínima de 5px es en px reales.
//
// Qué se dibuja en la pista:
//   1 reclamo  → pista base + hito del primer reclamo.
//   2+         → banda del 80% (del primer reclamo al percentil 80), pista
//                base y un hito por reclamo (más oscuro y alto dentro de la
//                banda).
//   saturado   → cuando los hitos ya no entran separados (desplazamientos en
//                cadena o se pasan del final), la pista sube de alto y se tiñe
//                con un degradé cuyos stops salen de la densidad real por tramo.
// El primer reclamo (barra 3×N + círculo blanco con borde navy) es siempre
// igual y es lo único navy de la pista; el celeste queda solo para la banda
// (y hover/foco del bloque).

type GeometriaTimeline = {
  alto: number;
  pistaY: number; pistaH: number;
  satY: number; satH: number;
  bandaY: number; bandaH: number; rotuloY: number;
  dentroY: number; dentroH: number;
  fueraY: number; fueraH: number;
  hitoW: number;
  primeroY: number; primeroH: number; circuloY: number; circuloR: number;
  ejeY: number | null; // y de las marcas de hora (solo modal)
};

// Geometría del modal: la composición de la referencia (SVG de 52px: pista
// y=33 h=5, banda y=14 h=24, hitos 14/12, primer reclamo 3×20 + r 3.5)
// ampliada — pista e hitos más altos, todo apoyado en la misma base — más
// marcas de hora debajo de la pista.
const TIMELINE_MODAL: GeometriaTimeline = {
  alto: 78,
  pistaY: 50, pistaH: 7,
  satY: 39, satH: 18,
  bandaY: 21, bandaH: 36, rotuloY: 16,
  dentroY: 35, dentroH: 22,
  fueraY: 39, fueraH: 18,
  hitoW: 3,
  primeroY: 27, primeroH: 30, circuloY: 24, circuloR: 4.5,
  ejeY: 73,
};

const TIMELINE_X0 = 8;
const TIMELINE_SEP_MIN = 5; // px mínimos entre hitos consecutivos
const TIMELINE_CADENA_SATURADA = 3; // desplazamientos seguidos → modo saturado

// Ancho en px de un elemento, en vivo (ResizeObserver).
function useAncho<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [ancho, setAncho] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setAncho(Math.floor(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, ancho] as const;
}

type ResumenReclamos = {
  duracionMin: number;
  ordenados: number[]; // minutos desde el inicio, ascendente
  total: number;
  primero: number;
  p80: number; // minuto del reclamo en el percentil 80 (nearest-rank)
};

export function resumirReclamos(datos: ReclamosInterrupcion): ResumenReclamos {
  const duracionMin = Math.max(1, Math.round((datos.fin.getTime() - datos.inicio.getTime()) / 60000));
  const ordenados = [...datos.minutos].sort((a, b) => a - b);
  const total = ordenados.length;
  const primero = ordenados[0] ?? 0;
  const p80 = total > 0 ? ordenados[Math.ceil(0.8 * total) - 1] : 0;
  return { duracionMin, ordenados, total, primero, p80 };
}

// Posiciones X de los hitos (centro), con la separación mínima forzada, y
// si la pista pasa a modo saturado.
function layoutHitos(ordenados: number[], duracionMin: number, x0: number, x1: number) {
  const xs: number[] = [];
  let cadena = 0;
  let saturado = false;
  for (const m of ordenados) {
    const natural = x0 + (m / duracionMin) * (x1 - x0);
    const previo = xs[xs.length - 1];
    if (previo !== undefined && natural < previo + TIMELINE_SEP_MIN) {
      xs.push(previo + TIMELINE_SEP_MIN);
      if (++cadena >= TIMELINE_CADENA_SATURADA) saturado = true;
    } else {
      xs.push(natural);
      cadena = 0;
    }
  }
  if (xs.length && xs[xs.length - 1] > x1) saturado = true;
  return { xs, saturado };
}

// Stops del degradé de densidad (modo saturado): la pista se parte en
// tramos (~1 cada 48px, entre 6 y 14), se cuentan los reclamos de cada uno,
// se suaviza con dos pasadas de [1,2,1] (sin eso el degradé queda rayado
// tipo código de barras) y cada stop mezcla navy con el gris de la pista
// según la densidad relativa (más reclamos = más oscuro).
function stopsDensidad(ordenados: number[], duracionMin: number, anchoPista: number) {
  const tramos = Math.max(6, Math.min(14, Math.floor(anchoPista / 48)));
  let cuentas = new Array<number>(tramos).fill(0);
  for (const m of ordenados) cuentas[Math.min(tramos - 1, Math.floor((m / duracionMin) * tramos))]++;
  for (let pasada = 0; pasada < 2; pasada++) {
    cuentas = cuentas.map((c, i) => (cuentas[Math.max(0, i - 1)] + 2 * c + cuentas[Math.min(tramos - 1, i + 1)]) / 4);
  }
  const max = Math.max(...cuentas, 1);
  const color = (c: number) => `color-mix(in srgb, var(--color-secondary) ${Math.round((c / max) * 100)}%, var(--color-viz-track))`;
  // Extremos en 0% y 100% con el valor del primer/último tramo.
  return [
    { offset: "0%", color: color(cuentas[0]) },
    ...cuentas.map((c, i) => ({ offset: `${((i + 0.5) / tramos) * 100}%`, color: color(c) })),
    { offset: "100%", color: color(cuentas[tramos - 1]) },
  ];
}

// Marcas de hora intermedias (solo modal): el paso "redondo" más chico que
// deja ≤5 marcas, alineadas al reloj; se saltean las pegadas a los bordes.
const TIMELINE_PASOS_MIN = [5, 10, 15, 30, 60, 120, 180, 360, 720, 1440, 2880];
function marcasHora(inicio: Date, duracionMin: number, px: (m: number) => number, x0: number, x1: number) {
  const paso = TIMELINE_PASOS_MIN.find((p) => duracionMin / p <= 5) ?? 10080;
  const inicioMin = inicio.getHours() * 60 + inicio.getMinutes();
  const marcas: number[] = [];
  for (let t = paso - (inicioMin % paso); t < duracionMin; t += paso) {
    if (px(t) - x0 > 36 && x1 - px(t) > 36) marcas.push(t);
  }
  return marcas;
}

// `variant`: "modal" (default) es el gráfico completo de siempre, en su
// contenedor tipo card con header, chip DURACIÓN y pie INICIO / FIN.
// "embebido" es para dentro de una sección de la hoja de Consulta de
// interrupciones: sin card (sin borde, radio, fondo ni padding), sin header
// (el título lo pone la sección), sin chip DURACIÓN ni pie con fecha completa
// (ya están en la franja de cifras y en la línea de tiempo), KPIs más chicos
// con los mismos valores, la misma pista a todo el ancho y, debajo, solo las
// horas de los extremos.
export default function ReclamosTimeline({
  datos,
  variant = "modal",
}: {
  datos: ReclamosInterrupcion | null;
  variant?: "modal" | "embebido";
}) {
  const embebido = variant === "embebido";
  const g = TIMELINE_MODAL;
  const [pistaRef, ancho] = useAncho<HTMLDivElement>();
  const idBase = useId().replace(/:/g, "");
  const resumen = useMemo(() => (datos ? resumirReclamos(datos) : null), [datos]);

  const total = resumen?.total ?? 0;
  const conDia = !!resumen && resumen.duracionMin > 1440;
  const x0 = TIMELINE_X0;
  const x1 = Math.max(x0, ancho - TIMELINE_X0);
  const px = (m: number) => x0 + (m / (resumen?.duracionMin ?? 1)) * (x1 - x0);
  const { xs, saturado } = useMemo(
    () => (resumen && ancho > 0 ? layoutHitos(resumen.ordenados, resumen.duracionMin, x0, x1) : { xs: [], saturado: false }),
    [resumen, ancho, x0, x1],
  );
  const hayBanda = total >= 2;
  // Banda: 4px antes del primer hito hasta 4px después del hito del p80.
  const indiceP80 = Math.ceil(0.8 * total) - 1;
  const bandaX = xs.length ? Math.max(x0, xs[0] - 4) : x0;
  const bandaFin = xs.length ? Math.min(x1, (saturado ? px(resumen!.p80) : xs[indiceP80]) + g.hitoW / 2 + 4) : x0;
  const rotuloX = Math.min(bandaX + 6, x1 - 112);

  const kLabel = "block text-caption caps text-text-muted mb-[3px]";
  const kValor = embebido ? "text-body font-semibold text-secondary tabular-nums" : "text-heading-md text-secondary tabular-nums";
  const kSufijo = "text-caption text-text-muted";

  const contenido = (
    <>
      {/* Header: label + chip DURACIÓN */}
      {!embebido && (
        <div className="flex items-center justify-between gap-[12px] mb-[14px]">
          <span className="text-caption caps text-text-muted">RECLAMOS DURANTE LA INTERRUPCIÓN</span>
          {resumen && <ChipDuracion minutos={resumen.duracionMin} />}
        </div>
      )}

      {/* KPIs: TOTAL + RECLAMO (1) · TOTAL + PRIMER RECLAMO + 80% LLEGÓ EN (2+) */}
      <div className="flex gap-[26px] mb-[14px]">
        <div>
          <span className={kLabel}>TOTAL</span>
          <span className={kValor}>{resumen ? formatNumero(total) : VALOR_VACIO}</span>
        </div>
        {resumen && total >= 1 && (
          <div>
            <span className={kLabel}>{total === 1 ? "RECLAMO" : "PRIMER RECLAMO"}</span>
            <span className={kValor}>
              {fmtHoraCorta(new Date(datos!.inicio.getTime() + resumen.primero * 60000), conDia)}{" "}
              <span className={kSufijo}>{fmtDelta(resumen.primero)}</span>
            </span>
          </div>
        )}
        {resumen && total >= 2 && (() => {
          const [num, unidad] = partesDuracion(resumen.p80 - resumen.primero);
          return (
            <div>
              <span className={kLabel}>80% LLEGÓ EN</span>
              <span className={kValor}>
                {num} <span className={kSufijo}>{unidad}</span>
              </span>
            </div>
          );
        })()}
      </div>

      {/* Pista */}
      <div ref={pistaRef} style={{ height: g.alto }}>
        {resumen && total > 0 && ancho > 0 ? (
          <svg viewBox={`0 0 ${ancho} ${g.alto}`} width="100%" height={g.alto} role="img" className="block overflow-visible">
            <title>{`${formatNumero(total)} ${total === 1 ? "reclamo" : "reclamos"} sobre la línea de la interrupción`}</title>
            <defs>
              <linearGradient id={`${idBase}-banda`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" style={{ stopColor: "var(--color-primary)", stopOpacity: 0.14 }} />
                <stop offset="100%" style={{ stopColor: "var(--color-primary)", stopOpacity: 0 }} />
              </linearGradient>
              {saturado && (
                <linearGradient id={`${idBase}-densidad`} x1="0" y1="0" x2="1" y2="0">
                  {stopsDensidad(resumen.ordenados, resumen.duracionMin, x1 - x0).map((s, i) => (
                    <stop key={i} offset={s.offset} style={{ stopColor: s.color }} />
                  ))}
                </linearGradient>
              )}
            </defs>

            {/* Banda de concentración (2+ reclamos) */}
            {hayBanda && (
              <>
                <rect x={bandaX} y={g.bandaY} width={Math.max(0, bandaFin - bandaX)} height={g.bandaH} rx={4} fill={`url(#${idBase}-banda)`} />
                <text x={rotuloX} y={g.rotuloY} letterSpacing="0.06em" className="text-caption fill-text-muted">
                  80% DE LOS RECLAMOS
                </text>
              </>
            )}

            {/* Pista: base (con hitos) o teñida por densidad (saturada) */}
            {saturado ? (
              <rect x={x0} y={g.satY} width={x1 - x0} height={g.satH} rx={g.satH / 2} fill={`url(#${idBase}-densidad)`} />
            ) : (
              <>
                <rect x={x0} y={g.pistaY} width={x1 - x0} height={g.pistaH} rx={g.pistaH / 2} className="fill-viz-track" />
                {xs.slice(1).map((x, j) => {
                  const dentro = j + 1 <= indiceP80;
                  return (
                    <rect
                      key={j}
                      x={x - g.hitoW / 2}
                      y={dentro ? g.dentroY : g.fueraY}
                      width={g.hitoW}
                      height={dentro ? g.dentroH : g.fueraH}
                      rx={g.hitoW / 2}
                      className={dentro ? "fill-viz-milestone" : "fill-viz-milestone-muted"}
                    />
                  );
                })}
              </>
            )}

            {/* Hito del primer reclamo — siempre igual */}
            <rect x={xs[0] - 1.5} y={g.primeroY} width={3} height={g.primeroH} rx={1.5} className="fill-secondary" />
            <circle cx={xs[0]} cy={g.circuloY} r={g.circuloR} strokeWidth={2} className="fill-surface stroke-secondary" />

            {/* Marcas de hora (modal) */}
            {g.ejeY !== null &&
              marcasHora(datos!.inicio, resumen.duracionMin, px, x0, x1).map((t) => (
                <g key={t}>
                  <line x1={px(t)} x2={px(t)} y1={g.pistaY + g.pistaH + 2} y2={g.pistaY + g.pistaH + 6} strokeWidth={1} className="stroke-viz-tick" />
                  <text x={px(t)} y={g.ejeY!} textAnchor="middle" className="text-caption fill-text-muted tabular-nums">
                    {fmtHoraCorta(new Date(datos!.inicio.getTime() + t * 60000), conDia)}
                  </text>
                </g>
              ))}
          </svg>
        ) : (
          <div className="h-full flex items-center text-body-sm text-text-muted">
            {!datos ? "Seleccioná una interrupción" : resumen && total === 0 ? "Sin reclamos registrados" : ""}
          </div>
        )}
      </div>

      {/* Footer: solo las horas de los extremos (embebido) */}
      {embebido ? (
        datos && (
          <div className="flex justify-between text-caption text-text-muted mt-[7px] tabular-nums">
            <span>{fmtHoraCorta(datos.inicio, conDia)}</span>
            <span>{fmtHoraCorta(datos.fin, conDia)}</span>
          </div>
        )
      ) : (
      /* Footer: INICIO / FIN */
      <div className="flex justify-between text-caption text-text mt-[7px] tabular-nums">
        <span>
          <span className="block text-caption caps text-text-muted mb-[1px]">INICIO</span>
          {datos ? formatFechaHora(datos.inicio) : VALOR_VACIO}
        </span>
        <span className="text-right">
          <span className="block text-caption caps text-text-muted mb-[1px]">FIN</span>
          {datos ? formatFechaHora(datos.fin) : VALOR_VACIO}
        </span>
      </div>
      )}
    </>
  );

  if (embebido) return <div className="w-full text-left">{contenido}</div>;
  return (
    <section className="block w-full text-left bg-surface border border-border rounded-md px-[18px] py-[16px]">
      {contenido}
    </section>
  );
}

// Chip DURACIÓN del gráfico del modal (en el resumen compacto de la card
// la duración es una columna más, sin chip).
function ChipDuracion({ minutos }: { minutos: number }) {
  return (
    <span className="inline-flex items-center gap-[6px] bg-primary-tint border border-chip-border rounded-full px-[12px] py-[4px] whitespace-nowrap">
      <span className="text-caption caps" style={{ color: "color-mix(in srgb, var(--color-secondary) 70%, white)" }}>DURACIÓN</span>
      <span className="text-body font-medium text-secondary">{fmtDuracion(minutos)}</span>
    </span>
  );
}
