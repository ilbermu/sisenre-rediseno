import { useState, useRef, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { ICON, ICON_BTN_SM } from "@/components/ui/tokens";

// Botón ícono para copiar un valor al portapapeles — mismo tratamiento visual
// que el botón cerrar de Modal (text-icon, hover bg-fill-muted + texto
// text), mismo tamaño/strokeWidth de ícono. navigator.clipboard es la vía
// principal; si la Clipboard API no existe o falla (contexto no seguro,
// permiso denegado, etc.) cae a un <textarea> temporal fuera de pantalla +
// document.execCommand("copy"). Sin toasts: el feedback es el ícono
// cambiando a Check (color success) ~1.5s y volviendo solo — el timeout se
// limpia al desmontar para no setear estado sobre un componente ya
// desmontado. `label` identifica QUÉ se copia (minúscula, sin artículo) para
// armar aria-label/title/aria-live ("Copiar interrupción" / "Interrupción
// copiada").
export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  async function handleCopy() {
    let ok = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        ok = true;
      }
    } catch {
      ok = false;
    }
    if (!ok) {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        ok = document.execCommand("copy");
        document.body.removeChild(textarea);
      } catch {
        ok = false;
      }
    }
    if (!ok) return;
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 1500);
  }

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
