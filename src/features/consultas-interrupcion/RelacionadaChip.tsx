import { FOCUS_RING } from "@/components/ui";
import { formatNumero, VALOR_VACIO } from "@/lib/format";

// Chip de "Tablas relacionadas" (Modificar interrupción) — etiqueta arriba,
// valor abajo. `raw` es el valor tal cual sale de generarTablasRelacionadas
// ("SI"/"NO" para la booleana, conteo como string para el resto);
// undefined = sin interrupción seleccionada ("—").
// En reposo NUNCA lleva tint ni borde celeste: el azul relleno queda
// reservado para la fila seleccionada de ReposicionesLista, justo arriba.
// Con contenido (conteo > 0 o "Sí"): <button> blanco + borde de card +
// valor navy, abre el modal en ese tab; el azul aparece solo en hover
// (tint + borde primary) y foco. Sin contenido (0, "No" o sin selección):
// <div> NO interactivo (fuera del orden de tabulación), borde punteado
// border, sin fondo ni hover, label y valor text-muted — nunca opacidad
// reducida: el valor es información (ver DESIGN_SYSTEM.md, regla 6).
// El ancho lo fija la etiqueta: el valor tiene w-0 + min-w-full, así no
// aporta al ancho intrínseco y los chips quedan parejos entre sí.
export default function RelacionadaChip({
  label,
  raw,
  booleana,
  onClick,
}: {
  label: string;
  raw: string | undefined;
  booleana: boolean;
  onClick: () => void;
}) {
  let valor = VALOR_VACIO;
  let conContenido = false;
  if (raw !== undefined) {
    if (booleana) {
      conContenido = raw === "SI";
      valor = conContenido ? "Sí" : "No";
    } else {
      const n = Number(raw);
      conContenido = n > 0;
      valor = formatNumero(n);
    }
  }
  const baseCls = "inline-flex flex-col items-start px-[14px] py-[6px] rounded-sm border text-left";
  const etiqueta = (
    <span className="text-caption caps whitespace-nowrap text-text-muted">{label}</span>
  );
  if (!conContenido) {
    return (
      <div className={`${baseCls} border-dashed border-border bg-transparent cursor-default`}>
        {etiqueta}
        <span className="w-0 min-w-full text-body-lg whitespace-nowrap text-text-muted">{valor}</span>
      </div>
    );
  }
  // "TABLA 5" → "Tabla 5"
  const nombre = label.charAt(0) + label.slice(1).toLowerCase();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={booleana ? `${nombre}: ${valor}, abrir` : `${nombre}: ${valor} registros, abrir`}
      className={`${baseCls} bg-surface border-border hover:bg-primary-tint hover:border-primary active:bg-chip-border-hover transition-[background-color,border-color] duration-(--duration-fast) ${FOCUS_RING}`}
    >
      {etiqueta}
      <span className="w-0 min-w-full text-body-lg whitespace-nowrap font-medium text-secondary">{valor}</span>
    </button>
  );
}
