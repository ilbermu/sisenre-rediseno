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

// Trigger compartido por las dos variantes (y por los chips de
// ChipFilterBar). Reposo: sin borde ni fondo, hover = hover secundario de la
// app (el de actionBtnCls). Abierto: seleccionado persistente. Con filtro
// (`aplicado`): siempre pintado, "{label}: {aplicado}" + ×, la × como botón
// HERMANO del principal dentro de un contenedor con el estilo de pill (nunca
// un botón dentro de otro).
//   size          "sm" (toolbar de tabla, default) | "md" (fila con controles md)
//   maxWidth      ancho máximo del chip; el valor trunca con "…" y el texto
//                 completo va en `title`
//   valorDestacado valor en semibold
//   chevronConValor false → con valor, texto + × sin chevron (ChipFilterBar:
//                 chip vacío = texto + chevron; con valor = texto + ×). La ×
//                 tiene su propio espacio y el texto trunca antes de ella.
//   etiqueta      texto visible corto (ChipFilterBar: chipLabel); `label`
//                 sigue siendo el nombre completo, el de title / aria-label
//   soloValor     con valor muestra solo el valor, sin etiqueta
export function FilterTriggerButton({
  label,
  aplicado,
  open,
  onToggle,
  onClear,
  disabled = false,
  size = "sm",
  maxWidth,
  valorDestacado = false,
  chevronConValor = true,
  etiqueta,
  soloValor = false,
  buttonRef,
  haspopup = "dialog",
}: {
  label: string;
  aplicado: string | null;
  open: boolean;
  onToggle: () => void;
  onClear: () => void;
  disabled?: boolean;
  size?: "sm" | "md";
  maxWidth?: number;
  valorDestacado?: boolean;
  chevronConValor?: boolean;
  etiqueta?: string;
  soloValor?: boolean;
  buttonRef?: React.Ref<HTMLButtonElement>;
  haspopup?: "dialog" | "listbox" | "menu";
}) {
  const chevron = open ? <ChevronUp size={ICON.xs} strokeWidth={1.5} /> : <ChevronDown size={ICON.xs} strokeWidth={1.5} />;
  const altoCls = size === "md" ? "h-(--control-md)" : "h-(--control-sm)";
  // title y aria-label siempre con el nombre completo, aunque el chip
  // muestre la etiqueta corta o solo el valor.
  const textoCompleto = aplicado !== null ? `${label}: ${aplicado}` : undefined;
  const visible = etiqueta ?? label;
  if (aplicado === null) {
    return (
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup={haspopup}
        aria-expanded={open}
        aria-label={visible !== label ? label : undefined}
        disabled={disabled}
        onClick={onToggle}
        className={`${altoCls} shrink-0 px-2.5 rounded-sm text-label border inline-flex items-center gap-1.5 whitespace-nowrap transition-colors disabled:text-text-faint disabled:cursor-not-allowed disabled:pointer-events-none ${FOCUS_RING} ${
          open
            ? "bg-primary-tint border-primary text-secondary"
            : "border-transparent bg-transparent text-text hover:bg-primary-tint hover:border-primary hover:text-secondary"
        }`}
      >
        {visible}
        {chevron}
      </button>
    );
  }
  return (
    <div
      title={textoCompleto}
      className={`${altoCls} min-w-0 rounded-sm text-label border inline-flex items-center bg-primary-tint border-primary text-secondary`}
      style={maxWidth ? { maxWidth } : undefined}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup={haspopup}
        aria-expanded={open}
        aria-label={textoCompleto}
        disabled={disabled}
        onClick={onToggle}
        className={`h-full min-w-0 pl-2.5 pr-1 rounded-sm inline-flex items-center gap-1.5 whitespace-nowrap disabled:cursor-not-allowed ${FOCUS_RING}`}
      >
        {!soloValor && <span className="shrink-0">{visible}:</span>}
        <span className={`min-w-0 truncate tabular-nums ${valorDestacado ? "font-semibold" : ""}`}>{aplicado}</span>
        {chevronConValor && <span className="shrink-0 inline-flex">{chevron}</span>}
      </button>
      <button
        type="button"
        aria-label={`Quitar filtro ${label}`}
        disabled={disabled}
        onClick={onClear}
        className={`h-full shrink-0 ${chevronConValor ? "px-1.5" : "pl-1 pr-2"} rounded-sm inline-flex items-center disabled:cursor-not-allowed ${FOCUS_RING}`}
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

// Rango de fecha como texto de los inputs nativos: fecha "aaaa-mm-dd",
// hora "hh:mm" o "" (sin hora = día completo: desde 00:00, hasta 23:59).
export type RangoTexto = { desdeFecha: string; desdeHora: string; hastaFecha: string; hastaHora: string };

export const RANGO_TEXTO_VACIO: RangoTexto = { desdeFecha: "", desdeHora: "", hastaFecha: "", hastaHora: "" };

const aFechaInput = (d: Date) => `${d.getFullYear()}-${ceros(d.getMonth() + 1, 2)}-${ceros(d.getDate(), 2)}`;

// Extremo del rango → Date. Hora vacía con fecha cargada: desde → 00:00,
// hasta → 23:59.
export function fechaDeExtremo(fecha: string, hora: string, finDeDia: boolean): Date | null {
  if (!fecha) return null;
  const [y, m, d] = fecha.split("-").map(Number);
  const [hh, mm] = (hora || (finDeDia ? "23:59" : "00:00")).split(":").map(Number);
  return new Date(y, m - 1, d, hh, mm);
}

// Atajo del editor de rango: completa los campos, no aplica.
export type AtajoRango = { label: string; rango: () => RangoTexto };

const ATAJOS_FILTER_TRIGGER: AtajoRango[] = [
  {
    label: "Hoy",
    rango: () => {
      const f = aFechaInput(new Date());
      return { desdeFecha: f, desdeHora: "00:00", hastaFecha: f, hastaHora: "23:59" };
    },
  },
  {
    label: "Últimas 24 h",
    rango: () => {
      const n = new Date();
      const d = new Date(n.getTime() - 24 * 3600_000);
      return { desdeFecha: aFechaInput(d), desdeHora: formatHora(d), hastaFecha: aFechaInput(n), hastaHora: formatHora(n) };
    },
  },
  {
    label: "Últimos 7 días",
    rango: () => {
      const n = new Date();
      const d = new Date(n.getTime() - 7 * 24 * 3600_000);
      return { desdeFecha: aFechaInput(d), desdeHora: formatHora(d), hastaFecha: aFechaInput(n), hastaHora: formatHora(n) };
    },
  },
];

// Panel de la variante date-range: el editor posicionado junto al trigger.
// Convierte entre RangoFecha (Date) y el texto de los inputs.
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
  const inicial: RangoTexto = {
    desdeFecha: value?.desde ? aFechaInput(value.desde) : "",
    desdeHora: value?.desde ? formatHora(value.desde) : "",
    hastaFecha: value?.hasta ? aFechaInput(value.hasta) : "",
    hastaHora: value?.hasta ? formatHora(value.hasta) : "",
  };
  return (
    <div
      className="shadow-md absolute left-0 bg-surface rounded-md border border-border z-(--z-dropdown)"
      style={{ ...dropdownAnchorStyle(direction, 5) }}
    >
      <RangoFechaEditor
        label={label}
        inicial={inicial}
        atajos={ATAJOS_FILTER_TRIGGER}
        onApply={(r) => {
          if (!r) return onApply(null);
          const desde = fechaDeExtremo(r.desdeFecha, r.desdeHora, false);
          const hasta = fechaDeExtremo(r.hastaFecha, r.hastaHora, true);
          onApply(desde || hasta ? { desde, hasta } : null);
        }}
      />
    </div>
  );
}

// Editor de rango de fecha (contenido del popover, sin posicionamiento):
// atajos, Desde y Hasta (fecha + hora opcional) y pie Limpiar + Aplicar.
// Borrador local (se inicializa de `inicial` al montarse, o sea al abrir):
// los atajos y los inputs COMPLETAN el borrador, solo "Aplicar" lo aplica —
// el único editor de filtro con botón, porque un rango se arma en dos pasos.
// Inputs nativos date/time con MOD_FIELD_CLS — DateTimeField no sirve acá:
// junta fecha y hora en un solo campo, fuerza 00:00 con la hora vacía (el
// "hasta" necesita 23:59) y trae su propio Aplicar relleno. Lo usan
// FilterTrigger (date-range) y ChipFilterBar.
export function RangoFechaEditor({
  label,
  inicial,
  atajos,
  onApply,
}: {
  label: string;
  inicial: RangoTexto;
  atajos: AtajoRango[];
  // null = sin filtro (Limpiar, o Aplicar con los dos extremos vacíos).
  onApply: (value: RangoTexto | null) => void;
}) {
  const [desdeFecha, setDesdeFecha] = useState(inicial.desdeFecha);
  const [desdeHora, setDesdeHora] = useState(inicial.desdeHora);
  const [hastaFecha, setHastaFecha] = useState(inicial.hastaFecha);
  const [hastaHora, setHastaHora] = useState(inicial.hastaHora);

  const desde = fechaDeExtremo(desdeFecha, desdeHora, false);
  const hasta = fechaDeExtremo(hastaFecha, hastaHora, true);
  const invalido = desde !== null && hasta !== null && desde > hasta;

  function completar(r: RangoTexto) {
    setDesdeFecha(r.desdeFecha); setDesdeHora(r.desdeHora);
    setHastaFecha(r.hastaFecha); setHastaHora(r.hastaHora);
  }

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
    <div role="dialog" aria-label={`Filtrar por ${label.toLowerCase()}`} className="p-3" style={{ width: 300 }}>
      {/* Atajos — clases de chip de ButtonSelectGroup (reposo). Completan
          los campos, no aplican. */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {atajos.map((a) => (
          <button
            key={a.label}
            type="button"
            onClick={() => completar(a.rango())}
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
          onClick={() => onApply(desdeFecha || hastaFecha ? { desdeFecha, desdeHora, hastaFecha, hastaHora } : null)}
          className={actionBtnCls("neutral") + " disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"}
        >
          Aplicar
        </button>
      </div>
    </div>
  );
}
