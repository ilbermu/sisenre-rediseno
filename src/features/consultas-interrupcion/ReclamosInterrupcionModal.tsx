import { useState } from "react";
import { ColumnHeaderHint, Modal } from "@/components/ui";
import { FaseReposicion, ReclamosInterrupcion } from "@/data/types";
import FranjaCifras from "@/features/consultas-interrupcion/FranjaCifras";
import ReclamosConcentracion, { minutoDelPico } from "@/features/consultas-interrupcion/ReclamosConcentracion";
import { minutosEntre } from "@/features/consultas-interrupcion/ReposicionesTimeline";
import { fmtDelta, fmtDuracion, fmtHorasMin, formatFecha, formatHora, formatNumero, parseFechaHora } from "@/lib/format";

// Columnas de la tabla: título y nombre real en la base (ColumnHeaderHint).
const COLUMNAS = [
  { label: "Hora", hint: "FECHA" },
  { label: "Desde el inicio", hint: undefined },
  { label: "Nro. reclamo", hint: "REC" },
  { label: "Nro. cuenta", hint: "POL" },
  { label: "Partido", hint: "PARTIDO" },
  { label: "Código falla", hint: "COD_FALLA" },
];

const tituloSeccion = "text-heading-xs uppercase text-neutral-600";

// Modal "Reclamos de la interrupción" (lo abre "Ver detalle" de la hoja de
// Consulta de interrupciones; ver DESIGN_SYSTEM.md). Sin cards, bloques
// separados por border-b, de arriba hacia abajo:
//   a) la interrupción (código + fecha · inicio → fin · duración, con el
//      mismo fin y duración que la franja de cifras de la hoja);
//   b) franja de cifras de los reclamos (FranjaCifras);
//   c) "Concentración de reclamos": ReclamosConcentracion size="expanded";
//   d) "Reclamos": la tabla, ordenada por hora.
// Estado compartido: `resaltados` (Nro. de reclamo). Hover en una fila →
// resalta su marca en el gráfico; hover en el gráfico → resalta las marcas y
// las filas de los reclamos cercanos al cursor. Solo se abre con ≥ 1 reclamo.
export default function ReclamosInterrupcionModal({
  open,
  onClose,
  referencia,
  fechaInicio,
  fases,
  faseSeleccionada,
  onSeleccionarFase,
  reclamos,
}: {
  open: boolean;
  onClose: () => void;
  referencia: string;
  fechaInicio: string;
  fases: FaseReposicion[];
  faseSeleccionada: number | null;
  onSeleccionarFase: (nro: number) => void;
  reclamos: ReclamosInterrupcion | null;
}) {
  const [resaltados, setResaltados] = useState<string[]>([]);
  const inicio = parseFechaHora(fechaInicio);
  if (!open || !reclamos || reclamos.detalle.length === 0 || !inicio) return null;

  const ultima = fases.length > 0 ? fases[fases.length - 1] : null;
  const fin = (ultima ? parseFechaHora(ultima.horaRep) : null) ?? reclamos.fin;
  // Misma definición que la Duración de la hoja: FEC de la última fase − inicio.
  const duracion = (ultima ? minutosEntre(fechaInicio, ultima.horaRep) : null) ?? Math.round((fin.getTime() - inicio.getTime()) / 60000);
  const detalle = reclamos.detalle;
  const n = detalle.length;
  const primero = detalle[0].minuto;
  const horaDe = (min: number) => formatHora(new Date(inicio.getTime() + min * 60000));

  const delta = (min: number) => <span className="text-[12px] font-medium text-neutral-500"> {fmtDelta(min)}</span>;
  const cifras: { label: string; valor: React.ReactNode }[] =
    n === 1
      ? [
          { label: "Reclamos", valor: formatNumero(n) },
          {
            label: "Reclamo",
            valor: (
              <>
                {horaDe(primero)}
                {delta(primero)}
              </>
            ),
          },
        ]
      : [
          { label: "Reclamos", valor: formatNumero(n) },
          {
            label: "Primer reclamo",
            valor: (
              <>
                {horaDe(primero)}
                {delta(primero)}
              </>
            ),
          },
          { label: "Mayor concentración", valor: horaDe(minutoDelPico(reclamos.minutos, Math.max(1, duracion))) },
          // El 80% de los reclamos: desde el primero hasta el que completa el 80%.
          { label: "80% llegó en", valor: fmtDuracion(detalle[Math.ceil(0.8 * n) - 1].minuto - primero) },
        ];

  return (
    <Modal title="Reclamos de la interrupción" open={open} onClose={onClose} size="detalle" bodyPadding={false}>
      {/* a) La interrupción — mismo estilo que el header de la hoja. */}
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1 pt-[18px] px-[24px] pb-[14px] border-b border-border">
        <div className="min-w-0">
          <p className="text-caption text-neutral-500">Interrupción</p>
          <p className="font-mono text-[18px] leading-[26px] font-medium tabular-nums text-neutral-900 truncate">{referencia}</p>
        </div>
        <p className="text-caption text-neutral-600 tabular-nums">
          {formatFecha(inicio)} · {formatHora(inicio)} → {formatHora(fin)} · {fmtHorasMin(duracion)}
        </p>
      </div>

      {/* b) Franja de cifras de reclamos. */}
      <FranjaCifras cifras={cifras} />

      {/* c) Concentración. */}
      <section aria-label="Concentración de reclamos" className="px-[24px] py-[18px] border-b border-border">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h3 className={tituloSeccion}>Concentración de reclamos</h3>
          <div className="flex items-center gap-4 text-caption text-neutral-600">
            <span className="flex items-center gap-1.5">
              <span aria-hidden className="inline-block w-3.5 h-2 rounded-xs border-t-2 border-primary bg-linear-to-b from-primary/30 to-primary/10" />
              Reclamos
            </span>
            <span className="flex items-center gap-1.5">
              <span aria-hidden className="inline-block h-3 border-l border-dashed border-neutral-400" />
              Reposiciones
            </span>
          </div>
        </div>
        <ReclamosConcentracion
          size="expanded"
          datos={reclamos}
          inicio={inicio}
          fin={fin}
          fases={fases}
          faseSeleccionada={faseSeleccionada}
          onSeleccionarFase={onSeleccionarFase}
          resaltados={resaltados}
          onResaltar={setResaltados}
        />
      </section>

      {/* d) Tabla de reclamos. */}
      <section aria-label="Reclamos" className="px-[24px] py-[18px]">
        <div className="flex items-baseline gap-2 mb-3">
          <h3 className={tituloSeccion}>Reclamos</h3>
          <span className="text-caption text-neutral-500 tabular-nums">{formatNumero(n)}</span>
        </div>
        <div className="border border-border rounded-md overflow-hidden bg-surface">
          <table className="w-full border-separate" style={{ borderSpacing: 0 }}>
            <thead>
              <tr>
                {COLUMNAS.map((c) => (
                  <th key={c.label} className="bg-fill-subtle-solid whitespace-nowrap px-3 py-2 text-left border-b border-border">
                    <ColumnHeaderHint hint={c.hint}>
                      {(trigger) => (
                        <span
                          tabIndex={c.hint ? 0 : undefined}
                          {...trigger}
                          className={`inline-block text-heading-xs uppercase text-text-muted ${c.hint ? "cursor-default hover:text-secondary focus-visible:text-secondary" : ""}`}
                        >
                          {c.label}
                        </span>
                      )}
                    </ColumnHeaderHint>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody onMouseLeave={() => setResaltados([])}>
              {detalle.map((r) => {
                const hl = resaltados.includes(r.rec);
                const celda = "whitespace-nowrap px-3 py-2.5 tabular-nums border-b border-border-subtle text-body";
                return (
                  <tr
                    key={r.rec}
                    onMouseEnter={() => setResaltados([r.rec])}
                    className="transition-colors duration-(--duration-fast)"
                    style={{ backgroundColor: hl ? "var(--color-primary-tint)" : undefined }}
                  >
                    <td className={`${celda} text-text`}>{formatHora(new Date(inicio.getTime() + r.minuto * 60000))}</td>
                    <td className={`${celda} text-neutral-500`}>{fmtDelta(r.minuto)}</td>
                    <td className={`${celda} text-code font-mono text-text`}>{r.rec}</td>
                    <td className={`${celda} text-text`}>{r.pol}</td>
                    <td className={`${celda} text-text`}>{r.partido}</td>
                    <td className={`${celda} text-text`}>{r.codFalla}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </Modal>
  );
}
