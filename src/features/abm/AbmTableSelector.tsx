import { useState, useRef, useEffect } from "react";
import { ChevronDown, Pencil } from "lucide-react";
import { dropdownAnchorStyle, ICON, useDropdownDirection } from "@/components/ui";
import { ABM_TABLE_CONFIGS, ABM_TABLE_ORDER } from "@/data/abmTables";
import { AbmTableKey } from "@/data/types";

// ─── ABM engine: componentes de UI ─────────────────────────────────────────

// Selector de tabla ABM — trigger + panel flotante tokenizado (mismo
// mecanismo que PeriodSelector), pero el trigger hace las veces de título
// del panel (ícono + nombre + badge de código) ya que el masthead no lleva
// nada más. Lee/escribe el mismo estado `screen` que ya maneja el sidebar,
// asi que ambos quedan sincronizados automaticamente sin estado global
// adicional. Cada opción del panel replica la riqueza visual del sidebar
// (ícono + nombre + badge), activa resaltada con bg-primary-tint +
// border-primary + text-secondary.
export function AbmTableSelector({ value, onChange }: { value: AbmTableKey; onChange: (k: AbmTableKey) => void }) {
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
        onClick={() => setOpen((v) => !v)}
        className="group flex items-center gap-2 h-(--control-md) pl-1.5 pr-2 -ml-1.5 rounded-sm min-w-0 transition-colors duration-(--duration-base) hover:bg-fill-muted"
      >
        {/* Lápiz fijo — no el ícono por tabla: el masthead del panel de
            trabajo siempre representa "estás en la herramienta de ABM",
            no una tabla en particular (esa distinción vive en el badge). */}
        <span className="shrink-0 text-icon group-hover:text-secondary transition-colors"><Pencil size={ICON.md} strokeWidth={1.5} /></span>
        <span className="text-heading-md text-text truncate">{current.titulo}</span>
        <span
          className="px-1.5 py-0.5 text-caption font-mono rounded-xs border border-border-strong text-focus shrink-0"
          style={{ backgroundColor: "var(--color-fill-muted)" }}
        >
          {current.code}
        </span>
        <span className={`shrink-0 text-icon transition-transform duration-(--duration-base) ${open ? "rotate-180" : ""}`}>
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
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-sm border text-left transition-colors ${
                    isSel
                      ? "bg-primary-tint border-primary text-secondary"
                      : "border-transparent text-text hover:bg-fill-muted"
                  }`}
                >
                  <span className="flex-1 min-w-0 truncate text-body">{c.titulo}</span>
                  <span
                    className={`text-caption font-mono shrink-0 tabular-nums ${isSel ? "text-secondary" : "text-text-muted"}`}
                  >
                    {c.code}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
