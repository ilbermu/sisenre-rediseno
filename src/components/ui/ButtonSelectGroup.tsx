import SegmentadoSoloLectura from "@/components/ui/SegmentadoSoloLectura";
import { BTN_SM } from "@/components/ui/tokens";

// Selector tipo botón (single-select) — usado en el formulario de Modificar
// interrupción para Origen y Tipo. El estado seleccionado se marca con
// borde + relleno claro (mismo lenguaje que el toggle "Filtro" de
// AltaClientesModal), nunca el azul relleno reservado para botones de
// acción primarios.
// `readOnly`: dato fijo, distinto de `disabled` (ver DESIGN_SYSTEM.md,
// "Estados: editable, solo lectura, deshabilitado") — se dibuja como
// SegmentadoSoloLectura (una caja, sin forma de botón). `ariaLabel` nombra el grupo para el lector de pantalla.
// Igual ancho (default): todas las opciones miden lo mismo, el ancho de la
// más larga — contenedor inline-grid grid-flow-col auto-cols-fr, cada botón
// w-full con el texto centrado. `igualAncho={false}` vuelve a la fila con
// wrap: solo para listas largas de opciones que no entran en una línea
// (ej. el Motivo de RevisarCambiosContent).
export default function ButtonSelectGroup({
  options,
  selected,
  onToggle,
  disabled = false,
  sizeCls = BTN_SM,
  readOnly = false,
  ariaLabel,
  igualAncho = true,
}: {
  options: string[];
  selected: string[];
  onToggle: (opt: string) => void;
  disabled?: boolean;
  sizeCls?: string;
  readOnly?: boolean;
  ariaLabel?: string;
  igualAncho?: boolean;
}) {
  const contenedorCls = igualAncho ? "inline-grid grid-flow-col auto-cols-fr gap-1.5" : "flex gap-1.5 flex-wrap";
  const anchoOpcionCls = igualAncho ? "w-full" : "";
  if (readOnly) {
    return (
      <SegmentadoSoloLectura
        opciones={options.map((o) => ({ value: o, label: o }))}
        valor={selected[0] ?? ""}
        ariaLabel={ariaLabel ?? ""}
      />
    );
  }
  return (
    <div className={contenedorCls}>
      {options.map((opt) => {
        const isSel = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            disabled={disabled}
            aria-pressed={isSel}
            onClick={() => onToggle(opt)}
            className={`${sizeCls} ${anchoOpcionCls} border text-center transition-colors duration-(--duration-base) shrink-0 ${
              disabled
                ? isSel
                  ? "bg-primary-tint/60 border-primary/50 text-text-faint cursor-not-allowed"
                  : "bg-fill-muted border-border text-text-faint cursor-not-allowed"
                : isSel
                ? "bg-primary-tint border-primary text-secondary"
                : "bg-surface border-border-strong text-text hover:border-primary hover:bg-primary-tint hover:text-secondary active:scale-[0.98]"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
