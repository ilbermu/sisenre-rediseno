import { Search, Zap } from "lucide-react";
import { ICON, TablaChip } from "@/components/ui";
import { ABM_TABLE_CONFIGS } from "@/data/abmTables";
import { AbmTableKey } from "@/data/types";
import CronogramaEnre from "@/features/inicio/CronogramaEnre";

export default function WelcomeContent({ onIrATabla, onIrAConsultas }: { onIrATabla: (k: AbmTableKey) => void; onIrAConsultas: () => void }) {
  const quickLinks: { tableKey: AbmTableKey; label: string; desc: string; icon: React.ReactNode }[] = [
    { tableKey: "cds2", label: "Interrupciones", desc: "Consulta y gestión de interrupciones computadas", icon: <Zap size={ICON.md} strokeWidth={1.5} /> },
    { tableKey: "cds3", label: "Interrupciones no computables", desc: "Registro de interrupciones no imputables", icon: <Zap size={ICON.md} strokeWidth={1.5} /> },
    { tableKey: "cds4", label: "Reposiciones", desc: "Seguimiento de reposiciones de servicio", icon: <Zap size={ICON.md} strokeWidth={1.5} /> },
    { tableKey: "cds8", label: "Reclamos", desc: "Gestión de reclamos de calidad de servicio", icon: <Zap size={ICON.md} strokeWidth={1.5} /> },
  ];

  // Card de acceso: ícono a la izquierda y chip de tabla a la derecha en la
  // misma fila (items-start); título y descripción debajo, a todo el ancho de
  // la card. El título puede ocupar dos líneas sin mover el chip.
  const cardCls =
    "group bg-surface rounded-lg border border-border px-5 py-4 cursor-pointer shadow-sm transition-[color,background-color,border-color,box-shadow] duration-(--duration-base) hover:bg-primary-tint hover:border-primary hover:shadow-md outline-none focus-visible:ring-2 focus-visible:ring-primary";
  const contenidoCard = (icon: React.ReactNode, label: string, desc: string, chip?: React.ReactNode) => (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="text-primary shrink-0">{icon}</span>
        {chip}
      </div>
      <p className="mt-2 text-heading-md text-text group-hover:text-secondary transition-colors">{label}</p>
      <p className="mt-0.5 text-body-sm text-text-muted">{desc}</p>
    </>
  );

  return (
    <div className="flex-1 overflow-y-auto px-10 py-10">
      {/* Greeting */}
      <div className="mb-8">
        <p className="text-heading-xs uppercase text-text-muted mb-1">SISENRE 2.0 · Agosto 2026</p>
        <h2 className="text-heading-lg text-text">Buenos días, Rdellamagiora</h2>
        <p className="text-body-lg text-text-muted mt-1">Seleccioná una sección del menú o usá los accesos rápidos para comenzar.</p>
      </div>

      {/* Quick access */}
      <p className="text-heading-xs uppercase text-text-muted mb-3">Accesos frecuentes</p>
      <div className="grid grid-cols-2 gap-4 mb-8" style={{ maxWidth: 760 }}>
        {/* Destacado: ocupa las dos columnas, sin chip de tabla (la pantalla
            cruza varias tablas). Mismo ícono que en el menú lateral. */}
        <div
          role="link"
          tabIndex={0}
          onClick={onIrAConsultas}
          onKeyDown={(e) => {
            if (e.key === "Enter") onIrAConsultas();
          }}
          className={`${cardCls} col-span-2`}
        >
          {contenidoCard(
            <Search size={ICON.md} strokeWidth={1.5} />,
            "Consulta de interrupciones",
            "Buscá una interrupción y revisá sus reposiciones, tablas relacionadas y reclamos",
          )}
        </div>
        {quickLinks.map((item) => (
          <div
            key={item.tableKey}
            role="link"
            tabIndex={0}
            onClick={() => onIrATabla(item.tableKey)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onIrATabla(item.tableKey);
            }}
            className={cardCls}
          >
            {contenidoCard(
              item.icon,
              item.label,
              item.desc,
              <span title={item.tableKey.toUpperCase()}>
                <TablaChip nombre={ABM_TABLE_CONFIGS[item.tableKey].nombre} />
              </span>,
            )}
          </div>
        ))}
      </div>

      {/* Cronograma ENRE */}
      <p className="text-heading-xs uppercase text-text-muted mb-3">Cronograma ENRE</p>
      <CronogramaEnre />
    </div>
  );
}
