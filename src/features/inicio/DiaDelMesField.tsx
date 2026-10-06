import { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { es } from "date-fns/locale";
import { Calendar } from "lucide-react";
import {
  DateTimeCaptionLabel,
  DateTimeChevron,
  DAY_PICKER_CLASSNAMES,
  dropdownAnchorStyle,
  ICON,
  useDropdownDirection,
} from "@/components/ui";

// ─── Welcome screen content ───────────────────────────────────────────────────

// Selector de día acotado al mes de entrega — mismo mecanismo/estilos que
// DateTimeField (DayPicker/es/DateTimeChevron/DateTimeCaptionLabel/
// DAY_PICKER_CLASSNAMES/Calendar), pero sin hora y sin navegación de mes:
// startMonth === endMonth, así que las flechas del calendario quedan sin
// efecto y clickear un día aplica y cierra al toque (no hay hora que
// confirmar aparte, no hace falta botón "Aplicar").
export default function DiaDelMesField({ value, onChange, anio, mes }: { value: number; onChange: (d: number) => void; anio: number; mes: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  const direction = useDropdownDirection(ref, open, 340);
  const mesFijo = new Date(anio, mes, 1);
  return (
    <div ref={ref} style={{ position: "relative" }} className="shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-(--control-md) px-2.5 flex items-center gap-1.5 border border-border-strong rounded-sm bg-surface text-label text-text hover:border-primary hover:text-secondary transition-colors"
      >
        {value}
        <span className="text-icon"><Calendar size={ICON.md} strokeWidth={1.5} /></span>
      </button>
      {open && (
        <div
          className="shadow-md absolute z-(--z-dropdown) bg-surface border border-border rounded-md p-3"
          style={{ ...dropdownAnchorStyle(direction, 6), right: 0, width: "max-content" }}
        >
          <DayPicker
            mode="single"
            navLayout="around"
            locale={es}
            defaultMonth={mesFijo}
            startMonth={mesFijo}
            endMonth={mesFijo}
            selected={new Date(anio, mes, value)}
            onSelect={(d) => { if (d) { onChange(d.getDate()); setOpen(false); } }}
            components={{ Chevron: DateTimeChevron, CaptionLabel: DateTimeCaptionLabel }}
            classNames={DAY_PICKER_CLASSNAMES}
          />
        </div>
      )}
    </div>
  );
}
