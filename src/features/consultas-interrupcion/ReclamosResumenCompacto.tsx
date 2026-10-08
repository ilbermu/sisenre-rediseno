import { useMemo } from "react";
import { ReclamosInterrupcion } from "@/data/types";
import { resumirReclamos } from "@/features/consultas-interrupcion/ReclamosTimeline";
import { fmtDuracion, formatFecha, formatHora, formatNumero, VALOR_VACIO } from "@/lib/format";

// Resumen de reclamos de la interrupción seleccionada, sin gráfico (sección
// "Reclamos durante la interrupción" de la hoja de Consultas de
// interrupción). Solo las cifras: el título de la sección y "Ver detalle"
// (abre "Datos de la interrupción", donde está el gráfico completo,
// ReclamosTimeline) los pone la hoja (InterrupcionHoja).
// Etiquetas y valores con la tipografía de RelacionadaChip ("TABLA 3"… y
// su valor con contenido), sin su `whitespace-nowrap`: acá las columnas
// tienen ancho fijo y el texto tiene que poder partir. Los spans de texto van
// `block`: inline heredarían el line-height de la celda.
// Cuatro columnas de ancho parejo (grid-cols-4 = minmax(0,1fr)) con divisor
// hairline: RECLAMOS / INICIO INTERRUPCIÓN / FIN INTERRUPCIÓN / DURACIÓN
// TOTAL. Fechas completas dd/mm/aaaa hh:mm; si la columna es angosta parten
// entre fecha y hora, nunca a mitad de la fecha.
export default function ReclamosResumenCompacto({ datos }: { datos: ReclamosInterrupcion | null }) {
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

  // Etiquetas en la fila 1 y valores en la fila 2 de la misma grilla: si una
  // etiqueta parte en dos líneas, los valores siguen alineados. El divisor va
  // en ambas celdas de cada columna, así la línea es continua.
  return (
    <div className="grid grid-cols-4">
      {columnas.map((c, i) => (
        <span key={`l-${c.etiqueta}`} className={`min-w-0 self-end pb-1.5 ${i === 0 ? "pr-3" : "px-3 border-l border-border"}`}>
          <span className="block text-caption caps text-text-muted">{c.etiqueta}</span>
        </span>
      ))}
      {columnas.map((c, i) => (
        <span key={`v-${c.etiqueta}`} className={`min-w-0 self-end ${i === 0 ? "pr-3" : "px-3 border-l border-border"}`}>
          <span className="block text-body-lg font-medium text-secondary">{c.valor}</span>
        </span>
      ))}
    </div>
  );
}
