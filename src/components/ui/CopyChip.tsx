import { Copy, Check } from "lucide-react";
import { FOCUS_RING, ICON } from "@/components/ui/tokens";
import { useCopiar } from "@/components/ui/useCopiar";

// Chip con un identificador (ej. la referencia de una interrupción) que lo
// copia al portapapeles al hacer clic — para el identificador de un registro
// en la línea del título de un modal (ver DESIGN_SYSTEM.md, "CopyChip" y
// "Modal de edición de registro"). Misma lógica y feedback que CopyButton
// (useCopiar): el ícono pasa a Check ~1.5s SOLO si la copia ocurrió, con
// aviso sr-only "<Label> copiada". `label` identifica QUÉ se copia
// (minúscula, sin artículo): arma el aria-label "Copiar <label> <valor>".
// No se achica (shrink-0): si no entra al lado del título, trunca el título.
export default function CopyChip({ value, label }: { value: string; label: string }) {
  const { copied, copiar } = useCopiar(value);
  const labelCapitalizado = label.charAt(0).toUpperCase() + label.slice(1);
  return (
    <>
      <button
        type="button"
        onClick={copiar}
        aria-label={`Copiar ${label} ${value}`}
        title={copied ? `${labelCapitalizado} copiada` : `Copiar ${label}`}
        className={`group h-(--control-xs) px-2 shrink-0 inline-flex items-center gap-1.5 whitespace-nowrap rounded-sm border border-border bg-fill-muted text-code font-mono tabular-nums text-text hover:border-primary hover:bg-primary-tint hover:text-secondary transition-colors ${FOCUS_RING}`}
      >
        {value}
        {copied ? (
          <Check size={ICON.xs} strokeWidth={1.5} className="text-success-text-strong" aria-hidden />
        ) : (
          <Copy size={ICON.xs} strokeWidth={1.5} className="text-icon group-hover:text-secondary" aria-hidden />
        )}
      </button>
      <span className="sr-only" aria-live="polite">{copied ? `${labelCapitalizado} copiada` : ""}</span>
    </>
  );
}
