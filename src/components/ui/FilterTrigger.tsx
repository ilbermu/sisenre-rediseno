import { useState, useRef, useEffect } from "react";
import { ChevronDown, X, ChevronUp } from "lucide-react";
import { dropdownAnchorStyle, useDropdownDirection } from "@/components/ui/dropdown";
import { actionBtnCls, BTN_SM, FOCUS_RING, ICON, MOD_FIELD_CLS } from "@/components/ui/tokens";
import { ceros, fmtDiaHora, formatHora } from "@/lib/format";

// ─── Filter trigger ───────────────────────────────────────────────────────────
// Trigger de filtro por columna para el toolbar de una tabla (Interrupciones,
// modal "Tablas relacionadas"). Uno de los botones sin borde en reposo (junto con los ghost y los de ícono), y
// solo como trigger de filtro — ver DESIGN_SYSTEM.md, "Patrones de contenedor
// y tabla". Dos variantes con el MISMO trigger (FilterTriggerButton):
//   list       → lista de valores con conteo, selección única;
//   date-range → rango desde/hasta (FilterDateRangePanel), la única con botón
//                Aplicar, porque un rango se arma en dos pasos.
// Dropdown con el mismo mecanismo que PeriodSelector (ref + click afuera,
// useDropdownDirection/dropdownAnchorStyle, panel e ítem seleccionado con las
// mismas clases) + Escape, que corta la propagación para cerrar solo el panel
// y no el Modal que lo contiene (Modal escucha Escape en document).

export type RangoFecha = { desde: Date | null; hasta: Date | null };

type FilterTriggerProps =
  ({
      variant?: "list";
      label: string;
      options: { value: string; count: number }[];
      value: string | null;
      onChange: (value: string | null) => void;
    }
  | {
      variant: "date-range";
      label: string;
      value: RangoFecha | null;
      onChange: (value: RangoFecha | null) => void;
    }) & {
  // Estado deshabilitado: sin hover ni apertura (ej. toolbar sin resultados).
  disabled?: boolean;
};

function textoRangoFecha(r: RangoFecha): string {
  if (r.desde && r.hasta) return `${fmtDiaHora(r.desde)} – ${fmtDiaHora(r.hasta)}`;
  if (r.desde) return `desde ${fmtDiaHora(r.desde)}`;
  return r.hasta ? `hasta ${fmtDiaHora(r.hasta)}` : "";
}

// Trigger compartido por las dos variantes. Reposo: sin borde ni fondo,
// hover = hover secundario de la app (el de actionBtnCls). Abierto:
// seleccionado persistente. Con filtro (`aplicado`): siempre pintado,
// "{label}: {aplicado}" + ×, la × como botón HERMANO del principal dentro de
// un contenedor con el estilo de pill (nunca un botón dentro de otro).
function FilterTriggerButton({
  label,
  aplicado,
  open,
  onToggle,
  onClear,
  disabled = false,
}: {
  label: string;
  aplicado: string | null;
  open: boolean;
  onToggle: () => void;
  onClear: () => void;
  disabled?: boolean;
}) {
  const chevron = open ? <ChevronUp size={ICON.xs} strokeWidth={1.5} /> : <ChevronDown size={ICON.xs} strokeWidth={1.5} />;
  if (aplicado === null) {
    return (
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        disabled={disabled}
        onClick={onToggle}
        className={`h-(--control-sm) px-2.5 rounded-sm text-label border inline-flex items-center gap-1.5 transition-colors disabled:text-text-faint disabled:cursor-not-allowed disabled:pointer-events-none ${FOCUS_RING} ${
          open
            ? "bg-primary-tint border-primary text-secondary"
            : "border-transparent bg-transparent text-text hover:bg-primary-tint hover:border-primary hover:text-secondary"
        }`}
      >
        {label}
        {chevron}
      </button>
    );
  }
  return (
    <div className="h-(--control-sm) rounded-sm text-label border inline-flex items-center bg-primary-tint border-primary text-secondary">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        disabled={disabled}
        onClick={onToggle}
        className={`h-full pl-2.5 pr-1 rounded-sm inline-flex items-center gap-1.5 whitespace-nowrap disabled:cursor-not-allowed ${FOCUS_RING}`}
      >
        {label}: <span className="tabular-nums">{aplicado}</span>
        {chevron}
      </button>
      <button
        type="button"
        aria-label={`Quitar filtro ${label}`}
        disabled={disabled}
        onClick={onClear}
        className={`h-full px-1.5 rounded-sm inline-flex items-center disabled:cursor-not-allowed ${FOCUS_RING}`}
      >
        <X size={ICON.xs} strokeWidth={1.5} />
      </button>
    </div>
  );
}

export default function FilterTrigger(props: FilterTriggerProps) {
  const { label } = props;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  const direction = useDropdownDirection(ref, open, props.variant === "date-range" ? 340 : 260);

  const aplicado =
    props.variant === "date-range"
      ? props.value ? textoRangoFecha(props.value) : null
      : props.value;

  return (
    <div
      ref={ref}
      style={{ position: "relative" }}
      className="shrink-0"
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          setOpen(false);
        }
      }}
    >
      <FilterTriggerButton
        label={label}
        aplicado={aplicado}
        open={open}
        onToggle={() => setOpen((v) => !v)}
        onClear={() => props.onChange(null)}
        disabled={props.disabled}
      />
      {open && (
        props.variant === "date-range" ? (
          <FilterDateRangePanel
            label={label}
            direction={direction}
            value={props.value}
            onApply={(v) => { props.onChange(v); setOpen(false); }}
          />
        ) : (
          <div
            role="listbox"
            aria-label={label}
            className="shadow-md absolute left-0 min-w-48 bg-surface rounded-md border border-border z-(--z-dropdown) overflow-hidden"
            style={{ ...dropdownAnchorStyle(direction, 5) }}
          >
            <div className="p-1.5 flex flex-col gap-0.5 overflow-y-auto" style={{ maxHeight: 260 }}>
              {[{ value: null as string | null, count: null as number | null }, ...props.options].map((o) => {
                const sel = o.value === props.value;
                return (
                  <button
                    key={o.value ?? "__todas"}
                    type="button"
                    role="option"
                    aria-selected={sel}
                    onClick={() => { props.onChange(o.value); setOpen(false); }}
                    className={`w-full px-2.5 py-2 rounded-sm border text-left text-body transition-colors flex items-center justify-between gap-4 whitespace-nowrap
                      ${sel ? "bg-primary-tint border-primary text-secondary" : "border-transparent text-text hover:bg-fill-muted"}`}
                  >
                    <span>{o.value ?? "Todas"}</span>
                    {o.count !== null && <span className="text-caption text-text-muted tabular-nums">{o.count}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )
      )}
    </div>
  );
}

// Panel de la variante date-range. Borrador local (se inicializa del valor
// aplicado cada vez que se abre, porque se monta al abrir): los atajos y los
// inputs COMPLETAN el borrador, solo "Aplicar" lo aplica. Inputs nativos
// date/time con MOD_FIELD_CLS — DateTimeField no sirve acá: junta fecha y hora
// en un solo campo, fuerza 00:00 con la hora vacía (el "hasta" necesita 23:59)
// y trae su propio Aplicar relleno.
function FilterDateRangePanel({
  label,
  direction,
  value,
  onApply,
}: {
  label: string;
  direction: "down" | "up";
  value: RangoFecha | null;
  onApply: (value: RangoFecha | null) => void;
}) {
  const aFecha = (d: Date | null | undefined) => (d ? `${d.getFullYear()}-${ceros(d.getMonth() + 1, 2)}-${ceros(d.getDate(), 2)}` : "");
  const aHora = (d: Date | null | undefined) => (d ? formatHora(d) : "");
  const [desdeFecha, setDesdeFecha] = useState(aFecha(value?.desde));
  const [desdeHora, setDesdeHora] = useState(aHora(value?.desde));
  const [hastaFecha, setHastaFecha] = useState(aFecha(value?.hasta));
  const [hastaHora, setHastaHora] = useState(aHora(value?.hasta));

  // Hora vacía con fecha cargada: desde → 00:00, hasta → 23:59.
  const armar = (fecha: string, hora: string, finDeDia: boolean): Date | null => {
    if (!fecha) return null;
    const [y, m, d] = fecha.split("-").map(Number);
    const [hh, mm] = (hora || (finDeDia ? "23:59" : "00:00")).split(":").map(Number);
    return new Date(y, m - 1, d, hh, mm);
  };
  const desde = armar(desdeFecha, desdeHora, false);
  const hasta = armar(hastaFecha, hastaHora, true);
  const invalido = desde !== null && hasta !== null && desde > hasta;

  function completar(d: Date, h: Date) {
    setDesdeFecha(aFecha(d)); setDesdeHora(aHora(d));
    setHastaFecha(aFecha(h)); setHastaHora(aHora(h));
  }
  const atajos: { label: string; rango: () => [Date, Date] }[] = [
    {
      label: "Hoy",
      rango: () => {
        const n = new Date();
        return [new Date(n.getFullYear(), n.getMonth(), n.getDate(), 0, 0), new Date(n.getFullYear(), n.getMonth(), n.getDate(), 23, 59)];
      },
    },
    { label: "Últimas 24 h", rango: () => { const n = new Date(); return [new Date(n.getTime() - 24 * 3600_000), n]; } },
    { label: "Últimos 7 días", rango: () => { const n = new Date(); return [new Date(n.getTime() - 7 * 24 * 3600_000), n]; } },
  ];

  const rotuloCls = "block mb-1 text-heading-xs uppercase text-text-muted";
  const extremo = (nombre: "Desde" | "Hasta", fecha: string, setFecha: (v: string) => void, hora: string, setHora: (v: string) => void) => (
    <div>
      <span className={rotuloCls}>{nombre}</span>
      <div className="flex gap-2">
        <div className="flex-1 min-w-0">
          <input type="date" aria-label={`Fecha ${nombre.toLowerCase()}`} value={fecha} onChange={(e) => setFecha(e.target.value)} className={MOD_FIELD_CLS} />
        </div>
        <div className="w-24 shrink-0">
          <input type="time" aria-label={`Hora ${nombre.toLowerCase()}`} value={hora} onChange={(e) => setHora(e.target.value)} className={MOD_FIELD_CLS} />
        </div>
      </div>
    </div>
  );

  return (
    <div
      role="dialog"
      aria-label={`Filtrar por ${label.toLowerCase()}`}
      className="shadow-md absolute left-0 bg-surface rounded-md border border-border z-(--z-dropdown) p-3"
      style={{ ...dropdownAnchorStyle(direction, 5), width: 300 }}
    >
      {/* Atajos — clases de chip de ButtonSelectGroup (reposo). Completan
          los campos, no aplican. */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {atajos.map((a) => (
          <button
            key={a.label}
            type="button"
            onClick={() => completar(...a.rango())}
            className={`${BTN_SM} border transition-[color,background-color,border-color,transform] duration-(--duration-base) shrink-0 bg-surface border-border-strong text-text hover:border-primary hover:bg-primary-tint hover:text-secondary active:scale-[0.98]`}
          >
            {a.label}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {extremo("Desde", desdeFecha, setDesdeFecha, desdeHora, setDesdeHora)}
        {extremo("Hasta", hastaFecha, setHastaFecha, hastaHora, setHastaHora)}
      </div>
      {invalido && (
        <p className="mt-2 text-caption text-error">La fecha desde no puede ser posterior a la fecha hasta</p>
      )}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <button
          type="button"
          onClick={() => onApply(null)}
          className="text-label text-secondary hover:underline"
        >
          Limpiar
        </button>
        <button
          type="button"
          disabled={invalido}
          onClick={() => onApply(desde || hasta ? { desde, hasta } : null)}
          className={actionBtnCls("neutral") + " disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"}
        >
          Aplicar
        </button>
      </div>
    </div>
  );
}
