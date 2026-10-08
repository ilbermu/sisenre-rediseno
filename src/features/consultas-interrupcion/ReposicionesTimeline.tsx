import { FOCUS_RING, Timeline, TIMELINE_CONTENIDO_PY, TimelineItem } from "@/components/ui";
import { STATUS_ITEMS } from "@/data/dominio";
import { FaseReposicion } from "@/data/types";
import RelacionadaChip from "@/features/consultas-interrupcion/RelacionadaChip";
import { fmtHorasMin, formatFecha, formatHora, formatNumero, parseFechaHora } from "@/lib/format";

// Minutos entre dos "dd/mm/aaaa hh:mm" (null si alguno no parsea).
export function minutosEntre(desde: string, hasta: string): number | null {
  const a = parseFechaHora(desde);
  const b = parseFechaHora(hasta);
  return a && b ? Math.round((b.getTime() - a.getTime()) / 60000) : null;
}

const horaDe = (texto: string) => {
  const d = parseFechaHora(texto);
  return d ? formatHora(d) : texto;
};

// Línea de tiempo de las reposiciones (Tabla 4) de la interrupción
// seleccionada, sobre Timeline (ver DESIGN_SYSTEM.md, "Timeline"):
//   - primer ítem fijo, no seleccionable: "Inicio de la interrupción" + hora
//     de FECHA; meta: fecha · nivel · "fase X" (dot "inicio");
//   - un ítem por fase, en orden de FEC: "Fase N" · hh:mm · "+X min" (desde
//     el ítem anterior) · "N clientes repuestos"; debajo, fase eléctrica ·
//     código de equipo · descripción (fuente de texto). Hover: fondo
//     fill-subtle.
//   - Fase seleccionada (dot "activo"): fondo fill-subtle + borde, y se
//     expande para mostrar SOLO los chips de Tablas relacionadas de esa fase
//     (Tabla 3/5/6/8/9, RelacionadaChip: misma lógica de "tiene datos"); un
//     clic en un chip abre el modal de Tablas relacionadas en ese tab.
//   - Cada fase es un botón (Enter o Espacio la seleccionan).
// Sin fases: solo el inicio y "Sin reposiciones registradas".
export default function ReposicionesTimeline({
  inicio,
  fases,
  seleccionada,
  onSeleccionar,
  valoresRelacionadas,
  onAbrirTabla,
}: {
  // Datos de la interrupción: FECHA ("dd/mm/aaaa hh:mm"), nivel de tensión y
  // fase eléctrica.
  inicio: { fecha: string; nivel: string; fase: string };
  // Fases de reposición, ya ordenadas por FEC.
  fases: FaseReposicion[];
  // Número (nro) de la fase seleccionada.
  seleccionada: number | null;
  onSeleccionar: (nro: number) => void;
  // Valores de Tablas relacionadas de la fase seleccionada.
  valoresRelacionadas: Record<string, string> | null;
  onAbrirTabla: (tabKey: string) => void;
}) {
  const fechaInicio = parseFechaHora(inicio.fecha);
  const items: TimelineItem[] = [
    {
      key: "inicio",
      dot: "inicio",
      contenido: (
        <div className={`px-2.5 ${TIMELINE_CONTENIDO_PY} border border-transparent`}>
          <p className="flex items-baseline gap-2">
            <span className="text-body font-semibold text-neutral-900">Inicio de la interrupción</span>
            <span className="text-body tabular-nums text-neutral-700">{horaDe(inicio.fecha)}</span>
          </p>
          <p className="text-body-sm text-neutral-600 tabular-nums">
            {fechaInicio ? formatFecha(fechaInicio) : inicio.fecha} · {inicio.nivel} · fase {inicio.fase}
          </p>
          {fases.length === 0 && <p className="mt-2 text-caption text-neutral-500">Sin reposiciones registradas</p>}
        </div>
      ),
    },
    ...fases.map((f, i): TimelineItem => {
      const sel = f.nro === seleccionada;
      const delta = minutosEntre(i === 0 ? inicio.fecha : fases[i - 1].horaRep, f.horaRep);
      return {
        key: `fase-${f.nro}`,
        dot: sel ? "activo" : "normal",
        contenido: (
          <div
            className={`rounded-lg border transition-colors duration-(--duration-fast) ${
              sel ? "bg-fill-subtle border-border" : "border-transparent hover:bg-fill-subtle"
            }`}
          >
            <button
              type="button"
              aria-expanded={sel}
              onClick={() => onSeleccionar(f.nro)}
              className={`w-full min-w-0 text-left px-2.5 ${TIMELINE_CONTENIDO_PY} rounded-lg ${FOCUS_RING}`}
            >
              <span className="flex items-baseline gap-2 min-w-0">
                <span className="shrink-0 text-body font-semibold text-neutral-900">Fase {f.nro}</span>
                <span className="shrink-0 text-body tabular-nums text-neutral-700">{horaDe(f.horaRep)}</span>
                {delta !== null && <span className="shrink-0 text-body-sm tabular-nums text-neutral-500">+{fmtHorasMin(delta)}</span>}
                <span className="ml-auto shrink-0 text-body-sm text-neutral-600 tabular-nums">
                  <span className="font-semibold text-neutral-900">{formatNumero(f.usuariosBT)}</span>{" "}
                  {f.usuariosBT === 1 ? "cliente repuesto" : "clientes repuestos"}
                </span>
              </span>
              <span className="block mt-0.5 text-body-sm text-neutral-600 truncate">
                Fase eléctrica {f.fase} · {f.equipoCodigo} · {f.equipoDesc}
              </span>
            </button>
            {sel && (
              <div className="mx-2.5 mb-2.5 pt-2.5 border-t border-border">
                <p className="text-caption caps text-neutral-500">Tablas relacionadas de la fase {f.nro}</p>
                <div className="mt-2 flex flex-wrap gap-[6px]">
                  {STATUS_ITEMS.map((item) => (
                    <RelacionadaChip
                      key={item.tabKey}
                      label={item.label}
                      raw={valoresRelacionadas?.[item.tabKey]}
                      booleana={item.tabKey === "tabla3"}
                      onClick={() => onAbrirTabla(item.tabKey)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ),
      };
    }),
  ];
  return <Timeline items={items} ariaLabel="Reposiciones de esta interrupción" />;
}
