import { TablaChip } from "@/components/ui";
import { ABM_TABLE_CONFIGS } from "@/data/abmTables";
import { FaseReposicion, ReclamosInterrupcion } from "@/data/types";
import ReclamosTimeline from "@/features/consultas-interrupcion/ReclamosTimeline";
import ReposicionesTimeline, { minutosEntre } from "@/features/consultas-interrupcion/ReposicionesTimeline";
import { fmtHorasMin, formatHora, formatNumero, parseFechaHora, VALOR_VACIO } from "@/lib/format";

const horaDe = (texto: string) => {
  const d = parseFechaHora(texto);
  return d ? formatHora(d) : VALOR_VACIO;
};

// Detalle de Consultas de interrupción — la "hoja" de la interrupción
// seleccionada (ver DESIGN_SYSTEM.md, Patrones → "Maestro-detalle"): columna
// derecha (48%), fondo surface, border-l, alto completo del área, sin
// padding exterior ni radio, sin cards. De arriba abajo:
//   header (fijo): "Interrupción seleccionada" + el código en mono. Nada más:
//     fecha, nivel, fase, origen y tipo ya se ven en la fila seleccionada;
//   franja de cifras (fija): Duración · Reposiciones · Clientes repuestos ·
//     Reclamos, 4 columnas iguales (2×2 si la hoja mide menos de 440px:
//     container query);
//   cuerpo (scroll propio), dos secciones separadas por border-t:
//     a) "Reposiciones de esta interrupción" (chip Tabla 4) con el rango
//        hh:mm → hh:mm y la línea de tiempo (ReposicionesTimeline);
//     b) "Reclamos durante la interrupción" (ReclamosTimeline
//        variant="embebido": el gráfico del modal, sin card ni datos
//        repetidos).
// Al cambiar de interrupción el contenido hace un fade de 140ms (directo
// con prefers-reduced-motion, regla global). Sin interrupción (los filtros
// no dejan ninguna), un estado vacío centrado.
export default function InterrupcionHoja({
  interrupcion,
  fases,
  faseSeleccionada,
  onSeleccionarFase,
  valoresRelacionadas,
  onAbrirTabla,
  reclamos,
}: {
  // null = sin resultados.
  interrupcion: { referencia: string; fecha: string; nivel: string; fase: string } | null;
  // Fases de reposición (Tabla 4) de la interrupción, ordenadas por FEC.
  fases: FaseReposicion[];
  faseSeleccionada: number | null;
  onSeleccionarFase: (nro: number) => void;
  valoresRelacionadas: Record<string, string> | null;
  onAbrirTabla: (tabKey: string) => void;
  reclamos: ReclamosInterrupcion | null;
}) {
  if (!interrupcion) {
    return (
      <section aria-label="Interrupción seleccionada" className="flex-[48_1_0%] min-w-0 min-h-0 flex items-center justify-center p-6 bg-surface border-l border-border">
        <p className="text-body-sm text-neutral-600 text-center">No hay interrupciones con estos filtros</p>
      </section>
    );
  }

  const ultima = fases.length > 0 ? fases[fases.length - 1] : null;
  // TODO validar con negocio: se asume duración = FEC de la última fase −
  // FECHA de inicio, y clientes repuestos = suma de CLI de las fases.
  const duracion = ultima ? minutosEntre(interrupcion.fecha, ultima.horaRep) : null;
  const clientes = fases.reduce((suma, f) => suma + f.usuariosBT, 0);
  const cifras: { label: string; valor: React.ReactNode }[] = [
    { label: "Duración", valor: duracion !== null ? fmtHorasMin(duracion) : VALOR_VACIO },
    {
      label: "Reposiciones",
      valor: (
        <>
          {formatNumero(fases.length)} <span className="text-body-sm font-normal text-neutral-500">{fases.length === 1 ? "fase" : "fases"}</span>
        </>
      ),
    },
    { label: "Clientes repuestos", valor: formatNumero(clientes) },
    { label: "Reclamos", valor: reclamos ? formatNumero(reclamos.minutos.length) : VALOR_VACIO },
  ];

  const tituloSeccion = "text-heading-xs uppercase text-neutral-600";
  return (
    <section aria-label="Interrupción seleccionada" className="@container flex-[48_1_0%] min-w-0 min-h-0 flex flex-col bg-surface border-l border-border">
      {/* key: al cambiar de interrupción el contenido se vuelve a montar y
          hace el fade. */}
      <div key={interrupcion.referencia} className="flex-1 min-h-0 flex flex-col animate-[hoja-fade_140ms_ease-out]">
        {/* Header — fijo. */}
        <div className="shrink-0 pt-[16px] px-[24px] pb-[14px] border-b border-border">
          <p className="text-caption text-neutral-500">Interrupción seleccionada</p>
          <p className="font-mono text-[18px] leading-[26px] font-medium tabular-nums text-neutral-900 truncate">{interrupcion.referencia}</p>
        </div>

        {/* Franja de cifras — fija. */}
        <dl className="shrink-0 grid grid-cols-4 @max-[440px]:grid-cols-2 px-[24px] py-[12px] border-b border-border">
          {cifras.map((c, i) => (
            <div
              key={c.label}
              className={`min-w-0 ${i === 0 ? "pr-4" : "px-4 border-l border-border"} ${
                i === 2 ? "@max-[440px]:pl-0 @max-[440px]:border-l-0" : ""
              } ${i >= 2 ? "@max-[440px]:mt-3" : ""}`}
            >
              <dt className="text-[11px] leading-4 font-medium text-neutral-500 truncate">{c.label}</dt>
              <dd className="text-[17px] leading-6 font-semibold tabular-nums text-neutral-900 whitespace-nowrap">{c.valor}</dd>
            </div>
          ))}
        </dl>

        {/* Cuerpo — scroll propio. */}
        <div className="flex-1 min-h-0 overflow-y-auto pt-[4px] px-[24px] pb-[24px]">
          <section aria-label="Reposiciones de esta interrupción" className="py-4">
            <div className="flex items-center gap-2 mb-2 min-w-0">
              <TablaChip nombre={ABM_TABLE_CONFIGS.cds4.nombre} />
              <h3 className={`${tituloSeccion} truncate`}>Reposiciones de esta interrupción</h3>
              {ultima && (
                <span className="ml-auto shrink-0 text-caption text-neutral-500 tabular-nums">
                  {horaDe(interrupcion.fecha)} → {horaDe(ultima.horaRep)}
                </span>
              )}
            </div>
            <ReposicionesTimeline
              inicio={{ fecha: interrupcion.fecha, nivel: interrupcion.nivel, fase: interrupcion.fase }}
              fases={fases}
              seleccionada={faseSeleccionada}
              onSeleccionar={onSeleccionarFase}
              valoresRelacionadas={valoresRelacionadas}
              onAbrirTabla={onAbrirTabla}
            />
          </section>

          <section aria-label="Reclamos durante la interrupción" className="py-4 border-t border-border">
            <h3 className={`${tituloSeccion} truncate mb-3`}>Reclamos durante la interrupción</h3>
            <ReclamosTimeline datos={reclamos} variant="embebido" />
          </section>
        </div>
      </div>
    </section>
  );
}
