import { Lock } from "lucide-react";
import { ICON } from "@/components/ui/tokens";

// Fila de un formulario horizontal (patrón de pantallas de configuración,
// ver DESIGN_SYSTEM.md, "FormRow" y "Formulario de edición"): un campo por
// fila, label a la izquierda y control a la derecha.
//   fila    → flex items-center justify-between gap-4, min-h 56px (py-3),
//             border-b border-border-subtle (la última del contenedor, sin
//             borde — last:border-b-0).
//   label   → text-body text-text (no FieldLabel: va al costado, no arriba),
//             asociado al control (htmlFor → id del control; el control
//             puede apuntar a `labelId` con aria-labelledby). Trunca, con
//             title. Read-only: candado (ICON.xs, "No editable") a su
//             derecha.
//   control → alineado al borde derecho. `anchoControl` "fijo": ancho
//             --form-control-w (inputs, fecha, select, combobox — todos
//             iguales); "intrinseco": toggles, a su ancho (su borde derecho
//             coincide con el de los inputs).
export default function FormRow({
  label,
  labelId,
  htmlFor,
  readOnly = false,
  anchoControl = "fijo",
  children,
}: {
  label: string;
  labelId: string;
  htmlFor?: string;
  readOnly?: boolean;
  anchoControl?: "fijo" | "intrinseco";
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[56px] py-3 flex items-center justify-between gap-4 border-b border-border-subtle last:border-b-0">
      <div className="min-w-0 flex items-center gap-1">
        <label id={labelId} htmlFor={htmlFor} title={label} className="min-w-0 truncate text-body text-text">
          {label}
        </label>
        {readOnly && (
          <span role="img" aria-label="No editable" title="No editable" className="shrink-0 inline-flex text-icon">
            <Lock size={ICON.xs} strokeWidth={1.5} aria-hidden />
          </span>
        )}
      </div>
      <div className={anchoControl === "fijo" ? "shrink-0 w-(--form-control-w)" : "shrink-0"}>{children}</div>
    </div>
  );
}
