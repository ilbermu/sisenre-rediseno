import { Copy, Check } from "lucide-react";
import { ICON, ICON_BTN_SM, ICON_BTN_XS } from "@/components/ui/tokens";
import { useCopiar } from "@/components/ui/useCopiar";

// Botón ícono para copiar un valor al portapapeles — mismo tratamiento visual
// que el botón cerrar de Modal (text-icon, hover bg-fill-muted + texto
// text), mismo tamaño/strokeWidth de ícono. La copia (Clipboard API con
// fallback) y el estado `copied` salen de useCopiar. Sin toasts: el feedback es el ícono cambiando a Check (color
// secondary) ~1.5s y volviendo solo. `label` identifica QUÉ se copia (minúscula, sin artículo) para
// armar aria-label/title/aria-live ("Copiar interrupción" / "Interrupción
// copiada").
// `size`: "sm" (default, ICON_BTN_SM) o "xs" (ICON_BTN_XS + ícono ICON.xs),
// para ir junto a un texto chico — ej. el label de contexto de un modal.
export default function CopyButton({
  value,
  label,
  size = "sm",
  tooltip,
  mensaje,
}: {
  value: string;
  label: string;
  size?: "xs" | "sm";
  // Tooltip nativo y anuncio aria-live; por defecto se arman con `label`.
  tooltip?: string;
  mensaje?: string;
}) {
  const { copied, copiar: handleCopy } = useCopiar(value);

  const labelCapitalizado = label.charAt(0).toUpperCase() + label.slice(1);

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleCopy();
        }}
        aria-label={`Copiar ${label}`}
        title={copied ? "Copiado" : (tooltip ?? `Copiar ${label}`)}
        className={`${size === "xs" ? ICON_BTN_XS : ICON_BTN_SM} flex items-center justify-center rounded-sm text-icon hover:bg-fill-muted hover:text-text transition-colors shrink-0`}
      >
        {copied ? <Check size={size === "xs" ? ICON.xs : ICON.sm} strokeWidth={1.5} className="text-secondary" /> : <Copy size={size === "xs" ? ICON.xs : ICON.sm} strokeWidth={1.5} />}
      </button>
      <span className="sr-only" aria-live="polite">{copied ? (mensaje ?? `${labelCapitalizado} copiada`) : ""}</span>
    </>
  );
}
