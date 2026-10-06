import { PEER_FOCUS_RING } from "@/components/ui/tokens";

// Radio custom, controlado desde el padre (seleccion mutuamente excluyente
// entre varios ModalRadio via checked/onSelect) — mismo motivo que el
// checkbox: nada de estilo nativo del navegador.
// `name`: obligatorio y compartido por todas las opciones del grupo — el
// navegador maneja Tab (entra al grupo una sola vez, en la opción elegida) y
// flechas (mueven y seleccionan).
export function ModalRadio({ name, label, checked, onSelect }: { name: string; label: string; checked: boolean; onSelect: () => void }) {
  return (
    <label className="inline-flex items-center gap-1.5 text-body text-text cursor-pointer select-none">
      <input type="radio" name={name} checked={checked} onChange={onSelect} className="peer sr-only" />
      <span
        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-(--duration-base) ${PEER_FOCUS_RING} ${
          checked ? "border-primary-strong" : "border-border-strong hover:border-primary"
        }`}
      >
        <span className={`w-2 h-2 rounded-full bg-primary-strong transition-transform duration-(--duration-base) ${checked ? "scale-100" : "scale-0"}`} />
      </span>
      {label}
    </label>
  );
}
