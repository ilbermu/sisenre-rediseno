import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { ICON } from "@/components/ui";

// ─── Select screen ────────────────────────────────────────────────────────────

export function SelectScreen({ onSelect }: { onSelect: (v: "clasico" | "nuevo") => void }) {
  const [hovered, setHovered] = useState<string | null>(null);

  const options = [
    {
      id: "clasico",
      title: "SISENRE clásico",
      desc: "El SISENRE de siempre, el que ya conocías.",
      disabled: true,
    },
    {
      id: "nuevo",
      title: "SISENRE 2.0",
      desc: "Nuevo SISENRE, nuevo motor de datos y framework moderno.",
      disabled: false,
    },
  ] as const;

  return (
    <div
      className="w-full h-screen flex items-center justify-center font-sans"
      style={{ backgroundColor: "var(--color-bg-app)" }}
    >
      <div className="w-full max-w-[520px] px-6">
        {/* Header */}
        <div className="mb-6 pb-5 border-b border-border">
          <h1 className="text-heading-lg text-text mb-1">Bienvenido a SISENRE</h1>
          <p className="text-body-lg text-text-muted">Seleccioná con qué herramienta comenzarás a trabajar</p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3">
          {options.map((opt) => {
            const isHov = hovered === opt.id && !opt.disabled;
            return (
              <button
                key={opt.id}
                disabled={opt.disabled}
                onClick={() => !opt.disabled && onSelect(opt.id)}
                onMouseEnter={() => setHovered(opt.id)}
                onMouseLeave={() => setHovered(null)}
                className="group w-full text-left px-5 py-4 rounded-lg border border-border bg-surface shadow-sm transition-[color,background-color,border-color,box-shadow] duration-(--duration-base) enabled:hover:bg-primary-tint enabled:hover:border-primary enabled:hover:shadow-md"
                style={{
                  cursor: opt.disabled ? "not-allowed" : "pointer",
                  opacity: opt.disabled ? 0.55 : 1,
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-heading-md text-text group-enabled:group-hover:text-secondary transition-colors mb-0.5">{opt.title}</p>
                    <p className="text-body text-text-muted">{opt.desc}</p>
                  </div>
                  {!opt.disabled && (
                    <span
                      className="shrink-0 ml-4 text-icon group-enabled:group-hover:text-secondary transition-[color,transform] duration-(--duration-base)"
                      style={{ transform: isHov ? "translateX(3px)" : "none" }}
                    >
                      <ChevronRight size={ICON.md} strokeWidth={1.5} />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-center text-caption text-text-muted mt-8">© Desarrollos propios 2026</p>
      </div>
    </div>
  );
}
