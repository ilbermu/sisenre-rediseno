import { Search } from "lucide-react";
import { actionBtnCls, FIELD_FOCUS, ICON } from "@/components/ui/tokens";

// Barra de herramientas de tabla — buscador cliente-side a la izquierda,
// Exportar a la derecha. Va FUERA del contenedor de la tabla, sin fondo
// propio y sin línea divisoria con la tabla: se vincula a ella por
// proximidad (px-4 py-3, alineada con el borde del contenedor de la tabla,
// mx-4) — ver DESIGN_SYSTEM.md, "Patrones de contenedor y tabla". Se le
// pueden agregar mas botones a la derecha de Exportar pasandolos como
// children, sin reestructurar nada. El aria-label del buscador es el
// placeholder sin los puntos suspensivos.
export default function TableToolbar({
  search,
  onSearchChange,
  onExport,
  hideExport = false,
  searchPlaceholder = "Buscar en la tabla…",
  children,
  bare = false,
  disabled = false,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  onExport?: () => void;
  // El motor ABM mueve "Exportar" a la cabecera del panel (junto a
  // + Insertar) y deja esta fila solo con el buscador — ver AbmScreen.
  hideExport?: boolean;
  searchPlaceholder?: string;
  children?: React.ReactNode;
  // true: sin el contenedor propio (px-4 py-2.5 border-b,
  // flex justify-between) — solo el buscador, para vivir dentro de una
  // fila que ya arma su propio layout (ej. los toolbars con filtros de
  // Interrupciones y del modal "Tablas relacionadas"). Ignora onExport/children
  // (un buscador "bare" con botones al lado no tiene sentido — para eso
  // está el modo normal). El ancho lo controla quien lo envuelve. Default
  // false — ningún llamado existente cambia.
  bare?: boolean;
  // Buscador deshabilitado (estado disabled del sistema: fill-muted + text-faint).
  disabled?: boolean;
}) {
  const searchBox = (
    <div className="relative flex-1 max-w-[320px]">
      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-icon">
        <Search size={ICON.md} strokeWidth={1.5} />
      </span>
      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={searchPlaceholder}
        aria-label={searchPlaceholder.replace(/…$/, "")}
        disabled={disabled}
        className={`w-full h-(--control-sm) pl-8 pr-2.5 text-body bg-surface border border-border-strong rounded-sm text-text placeholder:text-text-muted ${FIELD_FOCUS} transition-[border-color,box-shadow,background-color] duration-(--duration-base) disabled:bg-fill-muted disabled:text-text-faint disabled:placeholder:text-text-faint disabled:cursor-not-allowed`}
      />
    </div>
  );

  if (bare) return searchBox;

  return (
    <div className="px-4 py-3 shrink-0 flex items-center justify-between gap-3">
      {searchBox}
      {(!hideExport || children) && (
        <div className="flex items-center gap-2 shrink-0">
          {!hideExport && onExport && (
            <button type="button" onClick={onExport} className={actionBtnCls("neutral")}>
              Exportar
            </button>
          )}
          {children}
        </div>
      )}
    </div>
  );
}
