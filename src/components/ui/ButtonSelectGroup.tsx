import { BTN_SM } from "@/components/ui/tokens";

// Selector tipo botón (single-select) — usado en el formulario de Modificar
// interrupción para Origen y Tipo. El estado seleccionado se marca con
// borde + relleno claro (mismo lenguaje que el toggle "Filtro" de
// AltaClientesModal), nunca el azul relleno reservado para botones de
// acción primarios.
export default function ButtonSelectGroup({
  options,
  selected,
  onToggle,
  disabled = false,
  sizeCls = BTN_SM,
}: {
  options: string[];
  selected: string[];
  onToggle: (opt: string) => void;
  disabled?: boolean;
  sizeCls?: string;
}) {
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
