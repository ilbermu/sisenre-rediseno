import FieldLabel from "@/components/ui/FieldLabel";

// Par etiqueta/valor de solo lectura.
//   "box" (default) → etiqueta heading-xs uppercase + valor en una caja
//                     fill-muted de alto --control-sm (grillas densas, ej.
//                     datos de la interrupción).
//   "plain"         → dato fijo dentro de un formulario: FieldLabel (igual
//                     que los campos vecinos) y el valor en text-body text,
//                     sin caja ni borde, centrado en el alto --control-md de
//                     un control para que la fila quede alineada. Nunca un
//                     control deshabilitado (ver "Modal de edición de
//                     registro").
export default function ReadOnlyField({
  label,
  value,
  variant = "box",
}: {
  label: string;
  value: string;
  variant?: "box" | "plain";
}) {
  if (variant === "plain") {
    return (
      <div className="min-w-0">
        <FieldLabel>{label}</FieldLabel>
        <div className="h-(--control-md) flex items-center text-body text-text truncate">
          {value || " "}
        </div>
      </div>
    );
  }
  return (
    <div className="min-w-0">
      <p className="text-heading-xs uppercase text-text-muted mb-1 truncate">{label}</p>
      <div className="h-(--control-sm) px-2 flex items-center text-body-sm bg-fill-muted border border-border rounded-sm text-text truncate">
        {value || " "}
      </div>
    </div>
  );
}
