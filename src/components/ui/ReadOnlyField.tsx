export function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-heading-xs uppercase text-text-muted mb-1 truncate">{label}</p>
      <div className="h-(--control-sm) px-2 flex items-center text-body-sm bg-fill-muted border border-border rounded-sm text-text truncate">
        {value || " "}
      </div>
    </div>
  );
}
