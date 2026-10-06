// Lista con header, reusada dentro de modales para paneles tipo
// "Interrupción/Reclamo" / "Errores".
export function ListBox({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col border border-border rounded-md overflow-hidden" style={{ height: 160 }}>
      <div className="px-3 py-2 border-b border-border bg-fill-subtle rounded-t-md text-heading-xs uppercase text-text-muted shrink-0">
        {title}
      </div>
      <div className="flex-1 overflow-y-auto p-2">{children}</div>
    </div>
  );
}
