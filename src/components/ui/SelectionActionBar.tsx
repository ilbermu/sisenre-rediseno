import { ReactNode } from "react";

// Confirmación visual de qué registro está seleccionado — la línea
// "REGISTRO SELECCIONADO [id]". En el layout "split" del ABM va sin
// acciones: Modificar/Borrar viven en la fila de Resultados, y Auditoría en
// el header del panel (junto a Exportar) — ver AbmScreen.
// `actions` (opcional): slot a la derecha (ml-auto) para las acciones del
// registro — lo usa la barra de herramientas del layout "barra".
// `bare`: sin el padding ni el border-b propios, para vivir dentro de una
// barra que ya arma su propio layout. Sin estas props, el aspecto es el de
// siempre.
export default function SelectionActionBar({
  recordLabel,
  actions,
  bare = false,
}: {
  recordLabel: string;
  actions?: ReactNode;
  bare?: boolean;
}) {
  return (
    <div className={`${bare ? "min-w-0 flex-1" : "px-4 py-3 border-b border-border"} shrink-0 flex items-center gap-2.5`}>
      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
      <span className="text-heading-xs text-secondary uppercase select-none">
        Registro seleccionado
      </span>
      <span
        className="text-code text-text tabular-nums font-mono"
      >
        {recordLabel}
      </span>
      {actions && <div className="ml-auto flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
