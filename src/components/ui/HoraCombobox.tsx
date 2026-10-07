import { useEffect, useId, useRef, useState } from "react";
import { MOD_FIELD_CLS } from "@/components/ui/tokens";
import { ceros } from "@/lib/format";

// Opciones de la lista: 00:00 … 23:45, en pasos de 15 minutos.
const HORAS = Array.from({ length: 96 }, (_, i) => `${ceros(Math.floor(i / 4), 2)}:${ceros((i % 4) * 15, 2)}`);

// Máscara hh:mm: solo dígitos (máx. 4), ":" después del segundo.
function enmascarar(texto: string): string {
  const d = texto.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}:${d.slice(2)}` : d;
}

// Texto a medio escribir → "hh:mm" válido, "" (vacío) o null (inválido).
// "9" → 09:00, "930" → 09:30, "1745" → 17:45.
function normalizar(texto: string): string | null {
  const d = texto.replace(/\D/g, "");
  if (!d) return "";
  const [hh, mm] = d.length <= 2 ? [d, "0"] : d.length === 3 ? [d.slice(0, 1), d.slice(1)] : [d.slice(0, 2), d.slice(2)];
  const h = Number(hh);
  const m = Number(mm);
  if (h > 23 || m > 59) return null;
  return `${ceros(h, 2)}:${ceros(m, 2)}`;
}

// Combobox de hora (24 h): input de texto con máscara hh:mm + lista
// desplegable de pasos de 15 minutos que se filtra al escribir. Vacío = sin
// hora. Mismo alto, borde y foco que el resto de los campos (MOD_FIELD_CLS).
// La lista se abre debajo del input, dentro del contenedor (sin portal: vive
// dentro del popover que lo contiene). Escape con la lista abierta la cierra
// sin cerrar el popover (data-escape-local, ver AnchoredPopover).
export default function HoraCombobox({
  value,
  onChange,
  id,
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  id?: string;
  ariaLabel?: string;
}) {
  const [texto, setTexto] = useState(value);
  const [abierta, setAbierta] = useState(false);
  const [activo, setActivo] = useState(0);
  const listaId = useId();
  const listaRef = useRef<HTMLDivElement>(null);
  useEffect(() => setTexto(value), [value]);

  const filtradas = texto ? HORAS.filter((h) => h.startsWith(texto) || h.startsWith(`0${texto}`)) : HORAS;

  useEffect(() => {
    if (!abierta) return;
    listaRef.current?.querySelector<HTMLElement>(`[data-indice="${activo}"]`)?.scrollIntoView({ block: "nearest" });
  }, [abierta, activo]);

  function elegir(h: string) {
    setTexto(h);
    setAbierta(false);
    onChange(h);
  }
  function confirmar() {
    const n = normalizar(texto);
    if (n === null) setTexto(value);
    else {
      setTexto(n);
      if (n !== value) onChange(n);
    }
    setAbierta(false);
  }

  return (
    <div className="relative" data-escape-local={abierta ? "" : undefined}>
      <input
        id={id}
        role="combobox"
        aria-label={ariaLabel}
        aria-expanded={abierta}
        aria-controls={listaId}
        aria-autocomplete="list"
        aria-activedescendant={abierta && filtradas[activo] ? `${listaId}-${activo}` : undefined}
        inputMode="numeric"
        placeholder="hh:mm"
        value={texto}
        onFocus={() => setAbierta(true)}
        onClick={() => setAbierta(true)}
        onBlur={confirmar}
        onChange={(e) => {
          setTexto(enmascarar(e.target.value));
          setActivo(0);
          setAbierta(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            setAbierta(true);
            setActivo((i) => Math.max(0, Math.min(filtradas.length - 1, i + (e.key === "ArrowDown" ? 1 : -1))));
          } else if (e.key === "Enter") {
            e.preventDefault();
            if (abierta && filtradas[activo]) elegir(filtradas[activo]);
            else confirmar();
          } else if (e.key === "Escape" && abierta) {
            setAbierta(false);
          }
        }}
        className={MOD_FIELD_CLS + " tabular-nums"}
      />
      {abierta && filtradas.length > 0 && (
        <div
          ref={listaRef}
          id={listaId}
          role="listbox"
          className="shadow-md absolute left-0 right-0 z-(--z-dropdown) bg-surface rounded-md border border-border p-1.5 flex flex-col gap-0.5 overflow-y-auto"
          style={{ top: "calc(100% + 4px)", maxHeight: 192 }}
        >
          {filtradas.map((h, i) => (
            <button
              key={h}
              id={`${listaId}-${i}`}
              data-indice={i}
              type="button"
              role="option"
              tabIndex={-1}
              aria-selected={h === value}
              // mousedown: elegir antes del blur del input.
              onMouseDown={(e) => {
                e.preventDefault();
                elegir(h);
              }}
              className={`w-full px-2.5 py-1.5 rounded-sm border text-left text-body-sm tabular-nums transition-colors ${
                h === value
                  ? "bg-primary-tint border-primary text-secondary"
                  : i === activo
                    ? "bg-fill-muted border-transparent text-text"
                    : "border-transparent text-text hover:bg-fill-muted"
              }`}
            >
              {h}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
