import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { dropdownAnchorStyle, FOCUS_RING, ICON, useDropdownDirection } from "@/components/ui";
import { ABM_TABLE_CONFIGS, ABM_TABLE_ORDER } from "@/data/abmTables";
import { AbmTableKey } from "@/data/types";

// ─── ABM engine: componentes de UI ─────────────────────────────────────────

// Chip "Tabla N": mismo idioma que los chips de "Tablas relacionadas"
// (primary-tint + chip-border, texto secondary), en forma de píldora.
// `ancho` (dropdown): ancho mínimo común para que los nombres alineen.
function TablaChip({ nombre, ancho = false }: { nombre: string; ancho?: boolean }) {
  return (
    <span
      className={`inline-flex items-center justify-center h-5.5 px-2 shrink-0 rounded-full border border-chip-border bg-primary-tint text-secondary text-caption font-semibold whitespace-nowrap ${
        ancho ? "min-w-20" : ""
      }`}
    >
      {nombre}
    </span>
  );
}

// Selector de tabla ABM, variante título (ver DESIGN_SYSTEM.md,
// "AbmTableSelector"): nombra la vista y permite cambiarla — es el título
// de la pantalla de ABM, no hay otro. Aspecto de título, no de botón: chip
// "Tabla 2" + nombre ("Interrupciones") en text-heading-md text-neutral-900
// + chevron, todo un único botón, sin borde ni fondo en reposo; hover
// bg-fill-muted sobre el bloque; abierto, el seleccionado persistente de
// siempre (tint + border-primary). Alto mínimo --control-md; -ml-1.5 alinea
// el chip con el borde de la página. El código CDS va solo en el tooltip.
// Panel: mismo mecanismo que PeriodSelector; cada opción repite el formato
// (chip + nombre en text-body). Lee/escribe el mismo estado `screen` que el sidebar, así
// que quedan sincronizados sin estado global adicional.
export default function AbmTableSelector({ value, onChange }: { value: AbmTableKey; onChange: (k: AbmTableKey) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  const direction = useDropdownDirection(ref, open, 450);
  const current = ABM_TABLE_CONFIGS[value];
  return (
    <div ref={ref} style={{ position: "relative" }} className="min-w-0">
      <button
        type="button"
        title={`${current.nombre} · ${current.titulo} (${current.code})`}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 min-h-(--control-md) px-1.5 -ml-1.5 rounded-sm border min-w-0 transition-colors duration-(--duration-base) ${FOCUS_RING} ${
          open ? "bg-primary-tint border-primary" : "border-transparent hover:bg-fill-muted"
        }`}
      >
        <TablaChip nombre={current.nombre} />
        <span className={`text-heading-md truncate ${open ? "text-secondary" : "text-neutral-900"}`}>{current.titulo}</span>
        <span className={`shrink-0 transition-transform duration-(--duration-base) ${open ? "rotate-180 text-secondary" : "text-icon"}`}>
          <ChevronDown size={ICON.md} strokeWidth={1.5} />
        </span>
      </button>
      {open && (
        <div
          className="shadow-md absolute left-0 w-96 bg-surface rounded-md border border-border z-(--z-dropdown) overflow-hidden"
          style={{ ...dropdownAnchorStyle(direction, 5) }}
        >
          <div className="px-3 py-2.5 border-b border-border-subtle">
            <p className="text-heading-xs text-text-muted uppercase select-none">Cambiar de tabla</p>
          </div>
          <div className="p-1.5 flex flex-col gap-0.5 max-h-96 overflow-y-auto">
            {ABM_TABLE_ORDER.map((k) => {
              const c = ABM_TABLE_CONFIGS[k];
              const isSel = k === value;
              return (
                <button
                  key={k}
                  onClick={() => { onChange(k); setOpen(false); }}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-sm border text-left transition-colors ${
                    isSel
                      ? "bg-primary-tint border-primary text-secondary"
                      : "border-transparent text-text hover:bg-fill-muted"
                  }`}
                >
                  <TablaChip nombre={c.nombre} ancho />
                  <span className="flex-1 min-w-0 truncate text-body">{c.titulo}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
