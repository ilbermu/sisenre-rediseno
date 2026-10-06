import { Copy, Check } from "lucide-react";
import { ICON, ICON_BTN_SM } from "@/components/ui/tokens";
import { useCopiar } from "@/components/ui/useCopiar";

// Botón ícono para copiar un valor al portapapeles — mismo tratamiento visual
// que el botón cerrar de Modal (text-icon, hover bg-fill-muted + texto
// text), mismo tamaño/strokeWidth de ícono. La copia (Clipboard API con
// fallback) y el estado `copied` salen de useCopiar, compartido con
// CopyChip. Sin toasts: el feedback es el ícono cambiando a Check (color
// success) ~1.5s y volviendo solo. `label` identifica QUÉ se copia (minúscula, sin artículo) para
// armar aria-label/title/aria-live ("Copiar interrupción" / "Interrupción
// copiada").
export default function CopyButton({ value, label }: { value: string; label: string }) {
  const { copied, copiar: handleCopy } = useCopiar(value);

  const labelCapitalizado = label.charAt(0).toUpperCase() + label.slice(1);

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copiar ${label}`}
        title={copied ? "Copiada" : `Copiar ${label}`}
        className={`${ICON_BTN_SM} flex items-center justify-center rounded-sm text-icon hover:bg-fill-muted hover:text-text transition-colors shrink-0`}
      >
        {copied ? <Check size={ICON.sm} strokeWidth={1.5} className="text-success-text-strong" /> : <Copy size={ICON.sm} strokeWidth={1.5} />}
      </button>
      <span className="sr-only" aria-live="polite">{copied ? `${labelCapitalizado} copiada` : ""}</span>
    </>
  );
}
