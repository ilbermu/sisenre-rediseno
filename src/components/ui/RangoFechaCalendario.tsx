import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { es } from "date-fns/locale";
import { DAY_PICKER_CLASSNAMES, DateTimeCaptionLabel, DateTimeChevron, MESES_ES } from "@/components/ui/DateTimeField";
import FieldLabel from "@/components/ui/FieldLabel";
import { fechaDeExtremo, RANGO_TEXTO_VACIO, RangoTexto } from "@/components/ui/FilterTrigger";
import HoraCombobox from "@/components/ui/HoraCombobox";
import { actionBtnCls, FOCUS_RING } from "@/components/ui/tokens";
import { ceros } from "@/lib/format";

const aFechaInput = (d: Date) => `${d.getFullYear()}-${ceros(d.getMonth() + 1, 2)}-${ceros(d.getDate(), 2)}`;
const deFechaInput = (f: string) => {
  const [y, m, d] = f.split("-").map(Number);
  return new Date(y, m - 1, d);
};

// Período del PeriodSelector ("Agosto 2026") → rango del mes completo, sin
// hora (= 01/08/2026 00:00 – 31/08/2026 23:59). null si no parsea.
export function rangoDePeriodo(periodo: string): RangoTexto | null {
  const [mes, anio] = periodo.toLowerCase().split(" ");
  const m = MESES_ES.indexOf(mes);
  const y = Number(anio);
  if (m < 0 || !y) return null;
  return { desdeFecha: aFechaInput(new Date(y, m, 1)), desdeHora: "", hastaFecha: aFechaInput(new Date(y, m + 1, 0)), hastaHora: "" };
}

// Día del rango con el tint del sistema: extremos con el círculo de
// "selected" de DateTimeField; los intermedios, banda tint sin borde.
const CLASES_RANGO = {
  ...DAY_PICKER_CLASSNAMES,
  range_middle: "!rounded-none !border-transparent bg-primary-tint text-secondary",
};

// Editor de rango de fecha de ChipFilterBar: atajos a la izquierda (Hoy,
// Ayer, Últimos 7 días, Período completo), calendario en modo rango (el skin
// de DateTimeField: react-day-picker, locale es, selector de mes/año
// propio) y, debajo, Hora desde / Hora hasta (HoraCombobox; vacío = día
// completo). Pie: Limpiar (link) y Aplicar. Borrador local: los atajos, el
// calendario y las horas COMPLETAN el borrador; solo Aplicar lo aplica.
// Todo se abre dentro del popover del chip (sin popovers propios afuera).
export default function RangoFechaCalendario({
  label,
  inicial,
  inicialPeriodo,
  periodo,
  onApply,
}: {
  label: string;
  inicial: RangoTexto;
  // El valor aplicado vino del atajo "Período completo".
  inicialPeriodo: boolean;
  // Período elegido en el PeriodSelector de la pantalla (ej. "Agosto 2026").
  periodo?: string;
  // null = sin filtro. `esPeriodo`: el rango es "Período completo" (la barra
  // lo sigue al cambiar de período).
  onApply: (value: RangoTexto | null, esPeriodo: boolean) => void;
}) {
  const [rango, setRango] = useState<RangoTexto>(inicial);
  const [esPeriodo, setEsPeriodo] = useState(inicialPeriodo);
  const cambiar = (r: Partial<RangoTexto>) => {
    setRango((prev) => ({ ...prev, ...r }));
    setEsPeriodo(false);
  };
  // Atajo: completa el borrador y lleva el calendario al mes del "desde".
  const completar = (r: RangoTexto, periodoCompleto = false) => {
    setRango(r);
    setEsPeriodo(periodoCompleto);
    if (r.desdeFecha) setMes(deFechaInput(r.desdeFecha));
  };

  const hoy = new Date();
  const rangoPeriodo = periodo ? rangoDePeriodo(periodo) : null;
  // Mes visible del calendario: el del "desde", o el del período, o hoy.
  const [mes, setMes] = useState(() =>
    inicial.desdeFecha ? deFechaInput(inicial.desdeFecha) : rangoPeriodo ? deFechaInput(rangoPeriodo.desdeFecha) : hoy,
  );
  const desde = rango.desdeFecha ? deFechaInput(rango.desdeFecha) : undefined;
  const hasta = rango.hastaFecha ? deFechaInput(rango.hastaFecha) : undefined;
  const dDesde = fechaDeExtremo(rango.desdeFecha, rango.desdeHora, false);
  const dHasta = fechaDeExtremo(rango.hastaFecha, rango.hastaHora, true);
  const invalido = dDesde !== null && dHasta !== null && dDesde > dHasta;

  // Primer clic = desde, segundo = hasta (si es anterior al desde, se
  // invierten); con el rango completo, un clic empieza uno nuevo.
  function elegirDia(dia: Date) {
    const f = aFechaInput(dia);
    if (!desde || hasta) cambiar({ desdeFecha: f, hastaFecha: "" });
    else if (dia < desde) cambiar({ desdeFecha: f, hastaFecha: rango.desdeFecha });
    else cambiar({ hastaFecha: f });
  }

  const atajos: { label: string; aplicar: () => void }[] = [
    { label: "Hoy", aplicar: () => completar({ ...RANGO_TEXTO_VACIO, desdeFecha: aFechaInput(hoy), hastaFecha: aFechaInput(hoy) }) },
    {
      label: "Ayer",
      aplicar: () => {
        const f = aFechaInput(new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - 1));
        completar({ ...RANGO_TEXTO_VACIO, desdeFecha: f, hastaFecha: f });
      },
    },
    {
      label: "Últimos 7 días",
      aplicar: () =>
        completar({ ...RANGO_TEXTO_VACIO, desdeFecha: aFechaInput(new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - 6)), hastaFecha: aFechaInput(hoy) }),
    },
    {
      label: "Período completo",
      aplicar: () => completar(rangoPeriodo ?? RANGO_TEXTO_VACIO, true),
    },
  ];

  return (
    <div role="dialog" aria-label={`Filtrar por ${label.toLowerCase()}`} className="flex flex-col">
      <div className="flex">
        {/* Atajos — completan el borrador, no aplican. */}
        <div className="w-36 shrink-0 p-1.5 border-r border-border-subtle flex flex-col gap-0.5">
          {atajos.map((a) => {
            const activo = a.label === "Período completo" && esPeriodo;
            return (
              <button
                key={a.label}
                type="button"
                onClick={a.aplicar}
                aria-pressed={activo}
                className={`w-full px-2.5 py-2 rounded-sm border text-left text-body-sm whitespace-nowrap transition-colors ${FOCUS_RING} ${
                  activo ? "bg-primary-tint border-primary text-secondary" : "border-transparent text-text hover:bg-fill-muted"
                }`}
              >
                {a.label}
              </button>
            );
          })}
        </div>
        <div className="p-3">
          <DayPicker
            mode="range"
            navLayout="around"
            locale={es}
            startMonth={new Date(2018, 0)}
            endMonth={new Date(hoy.getFullYear(), 11)}
            month={mes}
            onMonthChange={setMes}
            selected={desde ? { from: desde, to: hasta } : undefined}
            onSelect={(_, dia) => elegirDia(dia)}
            components={{ Chevron: DateTimeChevron, CaptionLabel: DateTimeCaptionLabel }}
            classNames={CLASES_RANGO}
          />
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div>
              <FieldLabel htmlFor="rango-hora-desde">Hora desde</FieldLabel>
              <HoraCombobox id="rango-hora-desde" value={rango.desdeHora} onChange={(v) => cambiar({ desdeHora: v })} />
            </div>
            <div>
              <FieldLabel htmlFor="rango-hora-hasta">Hora hasta</FieldLabel>
              <HoraCombobox id="rango-hora-hasta" value={rango.hastaHora} onChange={(v) => cambiar({ hastaHora: v })} />
            </div>
          </div>
          {invalido && <p className="mt-2 text-caption text-error">La fecha desde no puede ser posterior a la fecha hasta</p>}
        </div>
      </div>
      <div className="flex items-center justify-between px-3 py-2.5 border-t border-border">
        <button type="button" onClick={() => onApply(null, false)} className="text-label text-secondary hover:underline">
          Limpiar
        </button>
        <button
          type="button"
          disabled={invalido}
          onClick={() => onApply(rango.desdeFecha || rango.hastaFecha ? rango : null, esPeriodo)}
          className={actionBtnCls("neutral") + " disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"}
        >
          Aplicar
        </button>
      </div>
    </div>
  );
}
