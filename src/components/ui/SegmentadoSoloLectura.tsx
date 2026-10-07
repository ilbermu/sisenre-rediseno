import { Check } from "lucide-react";
import { ICON, READONLY_FIELD_CLS } from "@/components/ui/tokens";

// Toggle en solo lectura como segmentado estático (ver DESIGN_SYSTEM.md,
// "Estados: editable, solo lectura, deshabilitado"): un control que no se
// puede usar no conserva la forma de botón. Una sola caja con
// READONLY_FIELD_CLS (la misma de un campo de solo lectura), ancho
// intrínseco; adentro, las opciones como segmentos de texto del mismo ancho
// (inline-grid auto-cols-fr) separados por divisores de 1px (bg-border, h-4),
// sin borde ni fondo propio. La elegida en text-text font-medium con Check a
// la izquierda; las demás en text-text-faint. Sin hover, cursor-default.
// Accesibilidad: radiogroup con aria-readonly, enfocable una vez, con el
// valor en el aria-label; cada opción es un radio con aria-checked.
export default function SegmentadoSoloLectura({
  opciones,
  valor,
  ariaLabel,
  id,
}: {
  opciones: { value: string; label: string }[];
  valor: string;
  // Nombre del campo; el valor elegido se suma al anunciarlo.
  ariaLabel: string;
  id?: string;
}) {
  const elegida = opciones.find((o) => o.value === valor);
  return (
    <div
      id={id}
      role="radiogroup"
      aria-readonly="true"
      aria-label={`${ariaLabel}: ${elegida?.label ?? "sin valor"}`}
      title="No editable"
      tabIndex={0}
      className={`${READONLY_FIELD_CLS} w-auto! px-0! text-label! inline-grid grid-flow-col auto-cols-fr items-stretch select-none`}
    >
      {opciones.map((o, i) => {
        const activa = o.value === valor;
        return (
          <span
            key={o.value}
            role="radio"
            aria-checked={activa}
            className={`relative px-3 flex items-center justify-center gap-1 whitespace-nowrap ${
              activa ? "text-text font-medium" : "text-text-faint"
            } ${i > 0 ? "before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-4 before:w-px before:bg-border" : ""}`}
          >
            {activa && <Check size={ICON.xs} strokeWidth={1.5} aria-hidden className="shrink-0" />}
            {o.label}
          </span>
        );
      })}
    </div>
  );
}
