import { useState, useRef, useEffect } from "react";
import { DayPicker, useDayPicker, type ChevronProps } from "react-day-picker";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import FieldLabel from "@/components/ui/FieldLabel";
import FloatingPanel from "@/components/ui/FloatingPanel";
import { dropdownAnchorStyle, useDropdownDirection } from "@/components/ui/dropdown";
import { BTN_MD, ICON, ICON_BTN_XS, MOD_FIELD_CLS, MOD_SELECT_CLS } from "@/components/ui/tokens";
import { formatFecha } from "@/lib/format";

// ─── Date/time field ──────────────────────────────────────────────────────────
// Mismo patrón de dropdown que PeriodSelector (ref + click-outside), pero el
// popover aloja un DayPicker + input de hora en vez de una lista. La interfaz
// pública es la de un input de texto (value/onChange de "dd/mm/aaaa hh:mm")
// para no tocar el tipo FlyoutFilters ni la lógica de chips/badge existente.

export function parseDateTimeStr(v: string): { date: Date | undefined; time: string } {
  const [datePart, timePart] = v.split(" ");
  const [dd, mm, yyyy] = (datePart ?? "").split("/").map(Number);
  const date = dd && mm && yyyy ? new Date(yyyy, mm - 1, dd) : undefined;
  return { date, time: timePart ?? "" };
}

function formatDateTimeStr(date: Date | undefined, time: string): string {
  if (!date) return "";
  return `${formatFecha(date)} ${time || "00:00"}`;
}

export function DateTimeChevron({ orientation }: ChevronProps) {
  return orientation === "right" ? <ChevronRight size={ICON.md} strokeWidth={1.5} /> : <ChevronLeft size={ICON.md} strokeWidth={1.5} />;
}

export const DAY_PICKER_CLASSNAMES = {
  month: "relative flex flex-col",
  month_caption: "flex items-center justify-center h-6 mb-2",
  button_previous: `absolute left-0 top-0 ${ICON_BTN_XS} flex items-center justify-center rounded-sm text-icon hover:bg-fill-muted hover:text-text transition-colors`,
  button_next: `absolute right-0 top-0 ${ICON_BTN_XS} flex items-center justify-center rounded-sm text-icon hover:bg-fill-muted hover:text-text transition-colors`,
  month_grid: "w-full border-collapse",
  weekdays: "",
  weekday: "text-heading-xs uppercase text-text-muted pb-1",
  day: "p-0.5 text-center",
  day_button: "w-8 h-8 rounded-full bg-transparent flex items-center justify-center text-label text-text transition-colors hover:bg-primary-tint hover:text-secondary",
  selected: "rounded-full bg-primary-tint border border-primary text-secondary",
  today: "text-secondary",
  outside: "text-text-faint",
};

const MESES_ES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function MiniCaptionDropdown({
  label,
  options,
  onSelect,
}: {
  label: string;
  options: { value: number; label: string; selected: boolean }[];
  onSelect: (value: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  const direction = useDropdownDirection(ref, open, 224);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-(--control-xs) px-1.5 rounded-sm text-heading-sm text-text hover:bg-primary-tint hover:text-secondary transition-colors"
      >
        {label}
      </button>
      {open && (
        <div
          className="shadow-md absolute left-1/2 z-(--z-dropdown) bg-surface border border-border rounded-md p-1.5 flex flex-col gap-0.5 overflow-y-auto"
          style={{ ...dropdownAnchorStyle(direction, 4), transform: "translateX(-50%)", minWidth: 96, maxHeight: 224 }}
        >
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => { onSelect(o.value); setOpen(false); }}
              className={`w-full text-left px-2.5 py-2 rounded-sm border text-body-sm transition-colors ${
                o.selected ? "bg-primary-tint border-primary text-secondary" : "border-transparent text-text hover:bg-primary-tint hover:text-secondary"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function DateTimeCaptionLabel(props: React.HTMLAttributes<HTMLSpanElement>) {
  const { months, goToMonth, dayPickerProps } = useDayPicker();
  const current = months[0].date;
  const startYear = dayPickerProps.startMonth?.getFullYear() ?? 2018;
  const endYear = dayPickerProps.endMonth?.getFullYear() ?? new Date().getFullYear();
  const years: number[] = [];
  for (let y = endYear; y >= startYear; y--) years.push(y);

  return (
    <span {...props} className="flex items-center gap-1">
      <MiniCaptionDropdown
        label={MESES_ES[current.getMonth()]}
        options={MESES_ES.map((m, i) => ({ value: i, label: m, selected: i === current.getMonth() }))}
        onSelect={(m) => goToMonth(new Date(current.getFullYear(), m, 1))}
      />
      <MiniCaptionDropdown
        label={String(current.getFullYear())}
        options={years.map((y) => ({ value: y, label: String(y), selected: y === current.getFullYear() }))}
        onSelect={(y) => goToMonth(new Date(y, current.getMonth(), 1))}
      />
    </span>
  );
}

export default function DateTimeField({
  value,
  onChange,
  disabled,
  muted = disabled,
  fullWidth = false,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  // No editable (abre/cierra el popover solo si es false).
  disabled?: boolean;
  // Look "disabled clásico" (atenuado/muted) vs. "placeholder" (dato real
  // de una fila seleccionada, legible, sin atenuar) — ambos son no
  // editables (disabled=true), pero se ven distinto. Por defecto sigue a
  // `disabled` (comportamiento previo) para no romper otros usos.
  muted?: boolean;
  // Ancho fijo de 170px (comportamiento históric) vs. 100% de la columna
  // que ocupe — los formularios ABM (grid 1fr/1fr) necesitan fullWidth
  // para no quedar más angostos que el input vecino en su misma fila; la
  // barra de filtros compacta de Consultas de interrupción sigue usando el
  // ancho fijo (default), que ahí es intencional.
  fullWidth?: boolean;
  // Extra classes sumadas al trigger — ej. un override de ancho con `!`
  // (important) para un breakpoint puntual, ya que el ancho fijo de acá
  // arriba se aplica vía `style` inline y le gana a una clase normal.
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [hora, setHora] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  // Dentro de un Modal el popover va en un portal (FloatingPanel): el clic
  // afuera cuenta también el panel como "adentro".
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      const t = e.target as Node;
      if (ref.current && !ref.current.contains(t) && !panelRef.current?.contains(t)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  const direction = useDropdownDirection(ref, open, 400);

  // Sincroniza selectedDate/hora cada vez que cambia `value`, sin importar
  // si el popover está abierto — antes solo sincronizaba al abrir, así que
  // un cambio programático de `value` (ej. autocompletar el formulario al
  // seleccionar una fila en Resultados) mientras el campo estaba cerrado
  // dejaba `hora` desactualizada la primera vez que se abría el popover.
  useEffect(() => {
    const { date, time } = parseDateTimeStr(value);
    setSelectedDate(date);
    setHora(time);
  }, [value]);

  function aplicar() {
    onChange(formatDateTimeStr(selectedDate, hora));
    setOpen(false);
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={
          MOD_SELECT_CLS +
          " w-full flex items-center justify-between gap-2 text-left" +
          // `!` (important): MOD_SELECT_CLS ya trae bg-surface/text-text, que en
          // el CSS compilado ganan igual sin importar el orden en que se
          // concatenan los strings acá (ver mismo fix en AbmCampo/disabledCls).
          (muted ? " !bg-fill-muted !text-text-muted" : disabled ? " !bg-fill-subtle !text-text" : "") +
          (className ? ` ${className}` : "")
        }
        style={fullWidth ? undefined : { width: 170, flexShrink: 0 }}
      >
        {value ? <span className={muted ? "text-text-muted truncate" : "text-text truncate"}>{value}</span> : <span className="text-text-muted truncate">dd/mm/aaaa hh:mm</span>}
        <span className="shrink-0 text-icon"><Calendar size={ICON.md} strokeWidth={1.5} /></span>
      </button>
      <FloatingPanel
        anchorRef={ref}
        panelRef={panelRef}
        open={!disabled && open}
        direction={direction}
        gap={6}
        className="shadow-md bg-surface border border-border rounded-md p-4"
        style={{ width: "max-content" }}
      >
          <DayPicker
            mode="single"
            navLayout="around"
            locale={es}
            startMonth={new Date(2018, 0)}
            endMonth={new Date()}
            selected={selectedDate}
            onSelect={setSelectedDate}
            components={{ Chevron: DateTimeChevron, CaptionLabel: DateTimeCaptionLabel }}
            classNames={DAY_PICKER_CLASSNAMES}
          />
          <div className="mt-3">
            <FieldLabel>Hora</FieldLabel>
            <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} className={MOD_FIELD_CLS} />
          </div>
          <div className="flex items-center justify-end gap-2.5 mt-4 pt-3 border-t border-border">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className={`${BTN_MD} border border-border-strong bg-surface text-text hover:bg-primary-tint hover:border-primary hover:text-secondary transition-colors`}
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={aplicar}
              className={`${BTN_MD} text-white bg-primary-strong hover:bg-primary-hover transition-colors`}
            >
              Aplicar
            </button>
          </div>
      </FloatingPanel>
    </div>
  );
}
