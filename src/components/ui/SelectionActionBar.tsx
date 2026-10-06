// Confirmación visual de qué registro está seleccionado — solo la línea
// "REGISTRO SELECCIONADO [id]", sin acciones debajo: Modificar/Borrar viven
// como íconos en la fila de Resultados, y Auditoría en el header del panel
// (junto a Exportar) — ver AbmScreen.
export default function SelectionActionBar({ recordLabel }: { recordLabel: string }) {
  return (
    <div className="px-4 py-3 border-b border-border shrink-0 flex items-center gap-2.5">
      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
      <span className="text-heading-xs text-secondary uppercase tracking-wide select-none">
        Registro seleccionado
      </span>
      <span
        className="text-code text-text tabular-nums font-mono"
      >
        {recordLabel}
      </span>
    </div>
  );
}
