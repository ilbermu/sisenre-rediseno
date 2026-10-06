import { BTN_SM, FOCUS_RING } from "@/components/ui/tokens";

// Selector tipo botón (single-select) — usado en el formulario de Modificar
// interrupción para Origen y Tipo. El estado seleccionado se marca con
// borde + relleno claro (mismo lenguaje que el toggle "Filtro" de
// AltaClientesModal), nunca el azul relleno reservado para botones de
// acción primarios.
// `readOnly`: dato fijo, distinto de `disabled` (ver DESIGN_SYSTEM.md,
// "Estados: disabled vs read-only") — seleccionado y no seleccionados a
// contraste completo, sin hover, sin responder a clic ni teclado; el grupo
// es enfocable una sola vez (aria-readonly) y las opciones no son
// tabulables. `ariaLabel` nombra el grupo para el lector de pantalla.
export default function ButtonSelectGroup({
  options,
  selected,
  onToggle,
  disabled = false,
  sizeCls = BTN_SM,
  readOnly = false,
  ariaLabel,
}: {
  options: string[];
  selected: string[];
  onToggle: (opt: string) => void;
  disabled?: boolean;
  sizeCls?: string;
  readOnly?: boolean;
  ariaLabel?: string;
}) {
  if (readOnly) {
    return (
      <div role="radiogroup" aria-readonly="true" aria-label={ariaLabel} tabIndex={0} className={`flex gap-1.5 flex-wrap rounded-sm ${FOCUS_RING}`}>
        {options.map((opt) => {
          const isSel = selected.includes(opt);
          return (
            <span
              key={opt}
              role="radio"
              aria-checked={isSel}
              className={`${sizeCls} border shrink-0 inline-flex items-center justify-center select-none cursor-default ${
                isSel ? "bg-primary-tint border-primary text-secondary" : "bg-surface border-border-strong text-text"
              }`}
            >
              {opt}
            </span>
          );
        })}
      </div>
    );
  }
  return (
    <div className="flex gap-1.5 flex-wrap">
      {options.map((opt) => {
        const isSel = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            disabled={disabled}
            aria-pressed={isSel}
            onClick={() => onToggle(opt)}
            className={`${sizeCls} border transition-colors duration-(--duration-base) shrink-0 ${
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
