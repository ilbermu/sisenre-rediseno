import { useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { CardHeader, ICON } from "@/components/ui";
import { ReclamosInterrupcion } from "@/data/types";
import { resumirReclamos } from "@/features/consultas-interrupcion/ReclamosTimeline";
import { fmtDuracion, formatFecha, formatHora, formatNumero, VALOR_VACIO } from "@/lib/format";

// Resumen de reclamos (card Interrupciones de Modificar interrupción,
// debajo de la tabla de Interrupciones) — sin gráfico. Sección clickeable
// que abre "Datos de la interrupción" (ahí está el gráfico completo,
// ReclamosTimeline): patrón stretched button (ver el JSX), con hover
// primary-tint + texto navy sobre toda la sección y foco con --color-focus.
// Sin estilos propios: todo copiado de elementos del mismo panel —
//   contenedor → sección de la card (border-t), sin borde, radio ni fondo;
//   header     → CardHeader, como toda card: título + subtítulo
//                "Interrupción <ref>" (mismo patrón que Reposiciones, solo
//                con selección) + ChevronRight decorativo en `actions`
//                como señal de que la sección se abre;
//   etiquetas  → las etiquetas de RelacionadaChip ("TABLA 3"…);
//   valores    → los valores de RelacionadaChip en estado con contenido.
// De los chips se copia la tipografía (tamaño, leading, tracking, peso,
// color), no su `whitespace-nowrap`: el chip toma su ancho de la etiqueta,
// acá las columnas tienen ancho fijo y el texto tiene que poder partir.
// Los spans de texto van `block` (en el chip son ítems flex, que se
// comportan igual): inline heredarían el line-height de la celda.
// Cuatro columnas de ancho parejo (grid-cols-4 = minmax(0,1fr)) con divisor
// hairline: RECLAMOS / INICIO INTERRUPCIÓN / FIN INTERRUPCIÓN / DURACIÓN
// TOTAL. Fechas completas dd/mm/aaaa hh:mm; si la columna es angosta parten
// entre fecha y hora, nunca a mitad de la fecha.
export default function ReclamosResumenCompacto({
  datos,
  referencia,
  onClick,
}: {
  // null = sin interrupción seleccionada (bloque deshabilitado).
  datos: ReclamosInterrupcion | null;
  // Referencia de la interrupción, para el subtítulo del header; null = sin selección.
  referencia: string | null;
  onClick: () => void;
}) {
  const resumen = useMemo(() => (datos ? resumirReclamos(datos) : null), [datos]);
  const fecha = (d: Date) => (
    <>
      <span className="whitespace-nowrap">{formatFecha(d)}</span>{" "}
      <span className="whitespace-nowrap">{formatHora(d)}</span>
    </>
  );
  const columnas: { etiqueta: string; valor: React.ReactNode }[] = [
    { etiqueta: "RECLAMOS", valor: resumen ? formatNumero(resumen.total) : VALOR_VACIO },
    { etiqueta: "INICIO INTERRUPCIÓN", valor: datos ? fecha(datos.inicio) : VALOR_VACIO },
    { etiqueta: "FIN INTERRUPCIÓN", valor: datos ? fecha(datos.fin) : VALOR_VACIO },
    { etiqueta: "DURACIÓN TOTAL", valor: resumen ? fmtDuracion(resumen.duracionMin) : VALOR_VACIO },
  ];

  const habilitada = datos !== null;
  return (
    // Sección de la card Interrupciones (no una card anidada): sin borde,
    // radio ni fondo propios, separada de la tabla por border-t.
    // Stretched button: la sección NO es un <button> (CardHeader adentro de
    // un botón sería HTML inválido). El botón vive en `right` del header y
    // su ::after (absolute inset-0) cubre toda la sección, que es `relative`.
    // Hover (con datos): fondo primary-tint sobre TODA la sección, también
    // en el header (CardHeader es transparente) + textos del cuerpo a
    // secondary. Foco: el focus-visible del botón se pinta en la sección
    // entera (has-[:focus-visible], outline hacia adentro para que no lo
    // recorte la card).
    <div
      data-habilitada={habilitada || undefined}
      className="group relative shrink-0 rounded-b-md border-t border-border transition-colors data-[habilitada]:hover:bg-primary-tint has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-focus has-[:focus-visible]:-outline-offset-2"
    >
      <CardHeader
        title="Reclamos durante la interrupción"
        level="section"
        chrome
        reserveSubtitle
        subtitle={habilitada && referencia ? <>Interrupción <span className="text-code font-mono tabular-nums">{referencia}</span></> : undefined}
        actions={
          <button
            type="button"
            disabled={!habilitada}
            onClick={onClick}
            aria-label="Abrir datos de la interrupción"
            title={habilitada ? "Ver datos de la interrupción" : "Seleccioná una interrupción"}
            className="flex items-center text-icon cursor-pointer disabled:cursor-not-allowed focus-visible:outline-none after:absolute after:inset-0"
          >
            <ChevronRight size={ICON.sm} strokeWidth={1.5} aria-hidden />
          </button>
        }
      />
      {/* Etiquetas en la fila 1 y valores en la fila 2 de la misma grilla:
          si una etiqueta parte en dos líneas (card angosta), los valores
          siguen alineados. El divisor va en ambas celdas de cada columna,
          así la línea es continua. */}
      <div className="grid grid-cols-4 px-(--card-px) pt-1 pb-(--card-section-py)">
        {columnas.map((c, i) => (
          <span key={`l-${c.etiqueta}`} className={`min-w-0 self-end pb-1.5 ${i === 0 ? "pr-3" : "px-3 border-l border-border"}`}>
            <span className="block text-caption caps text-text-muted group-data-[habilitada]:group-hover:text-secondary">{c.etiqueta}</span>
          </span>
        ))}
        {columnas.map((c, i) => (
          <span key={`v-${c.etiqueta}`} className={`min-w-0 self-end ${i === 0 ? "pr-3" : "px-3 border-l border-border"}`}>
            <span className="block text-body-lg font-medium text-secondary">{c.valor}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
