// Par etiqueta/valor de solo lectura para grillas densas de datos (ej.
// datos de la interrupción): etiqueta heading-xs uppercase + valor en una
// caja de alto --control-sm con el tratamiento de solo lectura (fill-subtle,
// border, text). Un campo de solo lectura dentro de un formulario usa
// READONLY_FIELD_CLS (ver tokens.ts).
export default function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-heading-xs uppercase text-text-muted mb-1 truncate">{label}</p>
      <div className="h-(--control-sm) px-2 flex items-center text-body-sm bg-fill-subtle border border-border rounded-sm text-text truncate">
        {value || " "}
      </div>
    </div>
  );
}
