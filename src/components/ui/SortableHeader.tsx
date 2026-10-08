import { ChevronDown, ChevronUp } from "lucide-react";
import ColumnHeaderHint from "@/components/ui/ColumnHeaderHint";
import { ICON } from "@/components/ui/tokens";
import { SortDir } from "@/components/ui/useTableToolbar";

function SortIndicator({ dir }: { dir: SortDir }) {
  return (
    <span className="text-secondary inline-flex">
      {dir === "asc" ? <ChevronUp size={ICON.xs} strokeWidth={1.5} /> : <ChevronDown size={ICON.xs} strokeWidth={1.5} />}
    </span>
  );
}

// Encabezado clickeable para tablas armadas con divs (flex/grid) — también
// lo usa el <th> de la tabla del ABM. `hint` (opcional): el nombre real de
// la columna en la base, como ColumnHeaderHint (tag arriba del título con
// hover o foco); el botón de orden es el disparador. Con hint, el título
// pasa a text-secondary con hover o foco (para que se note que tiene info,
// sin decoración); sin hint, el hover es el de siempre.
export function SortableHeaderCell({
  label,
  active,
  dir,
  onClick,
  className = "",
  hint,
}: {
  label: string;
  active: boolean;
  dir: SortDir;
  onClick: () => void;
  className?: string;
  hint?: string;
}) {
  return (
    <ColumnHeaderHint hint={hint}>
      {(trigger) => (
        <button
          type="button"
          onClick={onClick}
          {...trigger}
          className={`flex items-center gap-1 text-heading-xs uppercase select-none cursor-pointer transition-colors ${
            hint ? "hover:text-secondary focus-visible:text-secondary" : "hover:text-text"
          } ${active ? "text-secondary" : "text-text-muted"} ${className}`}
        >
          <span className="truncate">{label}</span>
          {active && <SortIndicator dir={dir} />}
        </button>
      )}
    </ColumnHeaderHint>
  );
}

// Encabezado clickeable para tablas armadas con <table>/<th> (tabs de
// "Tablas relacionadas" en Modificar interrupción). sticky/bg/border acá
// (no en el <tr> padre): position:sticky necesita su propio fondo opaco
// por elemento para taparse a sí mismo al scrollear — un fondo puesto solo
// en el <tr> no lo sigue.
export function SortableTh({
  label,
  active,
  dir,
  onClick,
  hint,
}: {
  label: string;
  active: boolean;
  dir: SortDir;
  onClick: () => void;
  // Nombre real de la columna en la base (ColumnHeaderHint).
  hint?: string;
}) {
  return (
    <th className="sticky top-0 z-(--z-sticky) bg-fill-subtle-solid border-b border-border px-4 py-3 text-left text-heading-xs uppercase select-none whitespace-nowrap">
      <ColumnHeaderHint hint={hint}>
        {(trigger) => (
          <button
            type="button"
            onClick={onClick}
            {...trigger}
            className={`flex items-center gap-1 cursor-pointer transition-colors ${hint ? "hover:text-secondary focus-visible:text-secondary" : "hover:text-text"} ${
              active ? "text-secondary" : "text-text-muted"
            }`}
          >
            {label}
            {active && <SortIndicator dir={dir} />}
          </button>
        )}
      </ColumnHeaderHint>
    </th>
  );
}
