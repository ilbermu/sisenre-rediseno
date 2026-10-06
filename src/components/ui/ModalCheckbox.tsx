import { useState } from "react";
import { PEER_FOCUS_RING } from "@/components/ui/tokens";

// Checkbox custom (no accent-color nativo) — mismo lenguaje que el resto de
// la app: borde var(--color-border-strong) en reposo (primary en hover), relleno var(--color-primary-strong) + check blanco al marcar.
// El <input> real queda oculto (sr-only) para mantener accesibilidad/teclado;
// el estado visual lo maneja React, nunca CSS nativo del navegador.
// Sin "checked"/"onChange" queda no-controlado (estado propio, como en
// Desarmes/Alta clientes); pasando ambos queda controlado por el padre
// (necesario cuando otra parte de la UI, como los botones Copiar/Mover en
// Intercambio, necesita leer que filas estan tildadas).
export default function ModalCheckbox({
  label,
  defaultChecked = false,
  checked: checkedProp,
  onChange,
}: {
  label: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const checked = checkedProp !== undefined ? checkedProp : internalChecked;
  const setChecked = (v: boolean) => {
    if (checkedProp === undefined) setInternalChecked(v);
    onChange?.(v);
  };
  return (
    <label className="inline-flex items-center gap-2 text-body text-text cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        className="peer sr-only"
      />
      <span
        className={`w-4 h-4 rounded-xs border flex items-center justify-center shrink-0 transition-colors duration-(--duration-base) ${PEER_FOCUS_RING} ${
          checked ? "bg-primary-strong border-primary-strong" : "bg-surface border-border-strong hover:border-primary"
        }`}
      >
        {checked && (
          <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
            <path d="M1.5 5.2l2.4 2.4L8.5 2.3" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {label}
    </label>
  );
}
