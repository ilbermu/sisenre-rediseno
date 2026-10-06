import { useState, useRef, useEffect } from "react";
import { ChevronDown, Calendar } from "lucide-react";
import { dropdownAnchorStyle, useDropdownDirection } from "@/components/ui/dropdown";
import { BTN_MD, ICON } from "@/components/ui/tokens";
import { PERIODS } from "@/data/dominio";

// ─── Period dropdown ──────────────────────────────────────────────────────────

export function PeriodSelector() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(PERIODS[0]);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  const direction = useDropdownDirection(ref, open, 260);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        className={`${BTN_MD} group flex items-center gap-1.5 border transition-colors duration-(--duration-base)
          ${open ? "bg-primary-tint border-primary text-secondary" : "bg-surface border-border-strong text-text hover:border-primary hover:bg-primary-tint hover:text-secondary"}`}
      >
        <span className={`transition-colors ${open ? "text-secondary" : "text-icon group-hover:text-secondary"}`}><Calendar size={ICON.md} strokeWidth={1.5} /></span>
        <span>{selected}</span>
        <span className={`transition-transform duration-(--duration-base) ${open ? "rotate-180" : ""}`}>
          <ChevronDown size={ICON.md} strokeWidth={1.5} />
        </span>
      </button>
      {open && (
        <div
          className="shadow-md absolute right-0 w-48 bg-surface rounded-md border border-border z-(--z-dropdown) overflow-hidden"
          style={{ ...dropdownAnchorStyle(direction, 5) }}
        >
          <div className="px-3 py-2.5 border-b border-border-subtle">
            <p className="text-heading-xs text-text-muted uppercase select-none">Seleccioná el período</p>
          </div>
          <div className="p-1.5 flex flex-col gap-0.5">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => { setSelected(p); setOpen(false); }}
              className={`w-full px-2.5 py-2 rounded-sm border text-left text-body transition-colors
                ${p === selected ? "bg-primary-tint border-primary text-secondary" : "border-transparent text-text hover:bg-fill-muted"}`}
            >
              {p}
            </button>
          ))}
          </div>
        </div>
      )}
    </div>
  );
}
