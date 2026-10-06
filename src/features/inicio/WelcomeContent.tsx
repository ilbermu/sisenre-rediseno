import { Zap } from "lucide-react";
import { ICON } from "@/components/ui";
import { AbmTableKey } from "@/data/types";
import { CronogramaEnre } from "@/features/inicio/CronogramaEnre";

export function WelcomeContent({ onIrATabla }: { onIrATabla: (k: AbmTableKey) => void }) {
  const quickLinks: { code: string; tableKey: AbmTableKey; label: string; desc: string; icon: React.ReactNode }[] = [
    { code: "CDS2", tableKey: "cds2", label: "Interrupciones", desc: "Consulta y gestión de interrupciones computadas", icon: <Zap size={ICON.md} strokeWidth={1.5} /> },
    { code: "CDS3", tableKey: "cds3", label: "Interrupciones no computables", desc: "Registro de interrupciones no imputables", icon: <Zap size={ICON.md} strokeWidth={1.5} /> },
    { code: "CDS4", tableKey: "cds4", label: "Reposiciones", desc: "Seguimiento de reposiciones de servicio", icon: <Zap size={ICON.md} strokeWidth={1.5} /> },
    { code: "CDS8", tableKey: "cds8", label: "Reclamos", desc: "Gestión de reclamos de calidad de servicio", icon: <Zap size={ICON.md} strokeWidth={1.5} /> },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-10 py-10">
      {/* Greeting */}
      <div className="mb-8">
        <p className="text-heading-xs uppercase tracking-widest text-text-muted mb-1">SISENRE 2.0 · Agosto 2026</p>
        <h2 className="text-heading-lg text-text">Buenos días, Rdellamagiora</h2>
        <p className="text-body-lg text-text-muted mt-1">Seleccioná una sección del menú o usá los accesos rápidos para comenzar.</p>
      </div>

      {/* Quick access */}
      <p className="text-heading-xs uppercase text-text-muted mb-3">Accesos frecuentes</p>
      <div className="grid grid-cols-2 gap-4 mb-8" style={{ maxWidth: 760 }}>
        {quickLinks.map((item) => (
          <div
            key={item.code}
            onClick={() => onIrATabla(item.tableKey)}
            className="group bg-surface rounded-lg border border-border px-5 py-4 cursor-pointer shadow-sm transition-[color,background-color,border-color,box-shadow] duration-(--duration-base) hover:bg-primary-tint hover:border-primary hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-primary shrink-0">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-heading-md text-text group-hover:text-secondary transition-colors">{item.label}</p>
                  <span
                    className="text-caption font-mono px-1.5 py-0.5 rounded-xs border border-border-strong text-text-muted"
                  >
                    {item.code}
                  </span>
                </div>
                <p className="text-body-sm text-text-muted">{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cronograma ENRE */}
      <p className="text-heading-xs uppercase text-text-muted mb-3">Cronograma ENRE</p>
      <CronogramaEnre />
    </div>
  );
}
