import { useRef, useEffect } from "react";
import { X } from "lucide-react";
import { ICON, ICON_BTN_SM } from "@/components/ui/tokens";

// ─── Modal estándar ─────────────────────────────────────────────────────────
// Standard compartido para toda accion de tabla que requiera un dialogo
// (Desarmes, Nivel/Tipo, Replicar, Cambia fases, Alta clientes, Lotes,
// Intercambio, y las que vengan despues). Overlay + panel centrado, header
// con titulo/subtitulo y boton X, body libre por contenido, footer con
// botones alineados a la derecha (mismo lenguaje que Buscar/Limpiar: neutral
// outline para cancelar, azul solido para la accion primaria). Cierra con X,
// click en el overlay o Escape.
export default function Modal({
  title,
  subtitle,
  open,
  onClose,
  size = "lg",
  footer,
  children,
  headerExtra,
  bodyPadding = true,
  bodyOverflow = "auto",
  bodyClassName = "",
  height,
}: {
  title: string;
  subtitle?: string;
  open: boolean;
  onClose: () => void;
  size?: "sm" | "lg" | "xl";
  footer?: React.ReactNode;
  children: React.ReactNode;
  // Slot propio para una segunda línea de header, debajo de título/cerrar
  // pero todavía dentro del bloque con borde inferior del header — ej.
  // contexto adicional con un CopyButton. Ningún modal existente lo pasa,
  // así que su header no cambia. Cuando SÍ viene, el título pasa a
  // pt-3.5/pb-0 (en vez de py-4) — el padding inferior del bloque entero
  // lo aporta esa segunda línea (ver call site), no el título — así el
  // gap entre título y esa línea queda compacto (mt-0.5) en vez de
  // heredar el padding completo que separaba al título del body. Esto
  // solo afecta a modales que pasan headerExtra.
  headerExtra?: React.ReactNode;
  // false: el body pierde su padding p-5 — para modales que arman su
  // propio layout interno (barras, tabs, tablas de borde a borde) en vez
  // de dejar que Modal les imponga el padding estándar. Default true —
  // ningún modal existente cambia.
  bodyPadding?: boolean;
  // "hidden": el body deja de ser la zona que scrollea — para modales de
  // trabajo con cards propias adentro, donde el scroll vive DENTRO de una
  // de esas cards (ver bodyClassName/`p-5 flex flex-col gap-4` típico),
  // nunca en el body entero. Default "auto" (overflow-y-auto, como
  // siempre) — ningún modal existente cambia.
  bodyOverflow?: "auto" | "hidden";
  // Clases extra para el body (ej. "bg-fill-subtle flex flex-col gap-4" para
  // el patrón de modal de trabajo con cards, ver DESIGN_SYSTEM.md).
  // Default "" — ningún modal existente cambia.
  bodyClassName?: string;
  // Alto fijo del panel (CSS length, ej. "min(720px, calc(100vh - 40px))")
  // — por default el modal se ajusta al contenido hasta el tope de
  // maxHeight. Pasarlo cuando el contenido interno gestiona su propia
  // única zona de scroll y el panel no puede saltar de tamaño entre
  // estados (ej. cambiar de tab).
  height?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Foco: al abrir entra al panel (para que Tab siga dentro del modal y un
  // lector de pantalla anuncie el diálogo); al cerrar vuelve al elemento
  // que lo abrió (ej. el gráfico de reclamos de la Card B).
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const previo = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    return () => previo?.focus?.();
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-(--z-overlay) bg-scrim" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="shadow-lg fixed z-(--z-modal) flex flex-col bg-surface rounded-xl overflow-hidden outline-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: size === "sm" ? 480 : size === "xl" ? 1120 : 920,
          maxWidth: "calc(100vw - 40px)",
          maxHeight: "calc(100vh - 40px)",
          height,
        }}
      >
        {/* Header — sin fondo propio (mismo tratamiento que CardHeader:
            transparente, deja ver el radio del contenedor), aplica a los 13 usos de Modal por
            igual, no es una prop opt-in. border-b como divisor con el body
            (bg-surface, sin cambios). título/cerrar siempre; headerExtra (si
            viene) se apila debajo, todavía dentro de este mismo bloque. Con
            headerExtra, el título pasa a pt-3.5/pb-0 (en vez de py-4) — el
            padding inferior del bloque entero lo aporta headerExtra (su
            propio pb-3.5, ver call site), con solo mt-0.5 de gap interno
            entre las dos líneas. */}
        <div className="border-b border-border shrink-0">
          <div className={`px-5 flex items-center justify-between gap-3 ${headerExtra ? "pt-3.5 pb-0" : "py-4"}`}>
            <p className={`min-w-0 truncate text-heading-md text-text`}>
              {title}
              {subtitle && (
                <span
                  className="ml-2 text-code text-text-muted font-mono"
                >
                  {subtitle}
                </span>
              )}
            </p>
            <button
              type="button"
              onClick={onClose}
              className={`shrink-0 ${ICON_BTN_SM} flex items-center justify-center rounded-sm text-icon hover:bg-fill-muted hover:text-text transition-colors`}
            >
              <X size={ICON.sm} strokeWidth={1.5} />
            </button>
          </div>
          {headerExtra}
        </div>

        {/* Body */}
        <div
          className={`flex-1 min-h-0 ${bodyOverflow === "hidden" ? "overflow-hidden" : "overflow-y-auto"} ${bodyPadding ? "p-5" : ""} ${bodyClassName}`}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-5 py-4 border-t border-border shrink-0 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </>
  );
}
