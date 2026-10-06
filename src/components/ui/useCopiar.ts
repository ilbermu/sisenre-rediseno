import { useState, useRef, useEffect } from "react";

// Copia un valor al portapapeles con feedback real — la lógica de
// CopyButton, separada para poder reusarla. navigator.clipboard es la vía principal; si la
// Clipboard API no existe o falla (contexto no seguro, permiso denegado,
// etc.) cae a un <textarea> temporal fuera de pantalla +
// document.execCommand("copy"). `copied` pasa a true ~1.5s SOLO si la copia
// realmente ocurrió (nunca se simula el éxito); el timeout se limpia al
// desmontar para no setear estado sobre un componente ya desmontado.
export function useCopiar(value: string) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  async function copiar() {
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

  return { copied, copiar };
}
