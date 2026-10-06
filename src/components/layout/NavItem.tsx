import { cloneElement } from "react";
import { motion } from "motion/react";

// ─── Sidebar nav item ─────────────────────────────────────────────────────────

export function NavItem({
  label, code, icon, active, collapsed, onClick, boldLabel = false, disabled = false, disabledTitle,
}: {
  // `icon` es opcional: filas hijas sin ícono propio (ej. Tabla 2..Tabla 9
  // NM) simplemente no reservan ese espacio, solo texto indentado.
  label: string; code?: string; icon?: React.ReactNode; active?: boolean; collapsed: boolean; onClick?: () => void;
  // Le da al label más peso visual que el resto de los ítems, siempre —
  // no solo cuando está activo. Uso puntual (ej. "Consultas de interrupción"),
  // el resto del tratamiento (ícono, tamaño de fila) queda igual.
  boldLabel?: boolean;
  // Ítem todavía no disponible (ej. herramientas pendientes de conectar):
  // text-faint, sin hover, fuera de uso. `disabledTitle` explica por qué.
  disabled?: boolean;
  disabledTitle?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={disabled && disabledTitle ? disabledTitle : !collapsed ? label + (code ? ` · ${code}` : "") : undefined}
      style={{ position: "relative" }}
      className={`sidebar-item-btn w-full flex items-center gap-2 rounded-sm border transition-colors duration-(--duration-base) group
        ${collapsed ? "justify-center py-[9px] mx-auto w-9" : "px-[9px] py-[6px]"}
        ${disabled
          ? "border-transparent text-text-faint cursor-not-allowed"
          : active
          ? "border-transparent text-secondary"
          : "border-transparent text-text hover:bg-fill-muted"
        }`}
    >
      {/* Pill de fondo del ítem activo — layoutId compartido entre TODOS los
          NavItem: Motion detecta que "se mudó" de un botón a otro entre
          renders y anima la transición de posición/tamaño sola, sin que
          calculemos nada a mano (mismo mecanismo que el selector deslizable
          de Vaquita). Solo el ítem activo lo renderiza en un momento dado. */}
      {active && (
        <motion.span
          layoutId="nav-active-pill"
          className="absolute inset-0 rounded-sm bg-secondary/10"
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
        />
      )}
      {/* relative z-10: el pill de arriba es absolute (stackea por encima de
          contenido no-posicionado sin importar el orden en el DOM), así que
          todo el contenido real necesita su propio contexto posicionado con
          z-index mayor para quedar arriba, no tapado por el pill. */}
      <span className={`relative z-(--z-sticky) flex items-center gap-2 w-full ${collapsed ? "justify-center" : ""}`}>
        {icon && (
          <span className="shrink-0">
            {cloneElement(icon as React.ReactElement<any>, { fill: active ? "currentColor" : "none" })}
          </span>
        )}
        {!collapsed && (
          <>
            <span className={`flex-1 min-w-0 truncate text-left ${boldLabel ? "text-heading-sm" : "text-body"}`}>{label}</span>
            {code && (
              <span
                className={`text-caption font-mono shrink-0 tabular-nums ${active ? "text-secondary" : "text-text-muted"}`}
              >
                {code}
              </span>
            )}
          </>
        )}
        {collapsed && (
          <span className="sidebar-item-tooltip">
            {label}{code && ` · ${code}`}
          </span>
        )}
      </span>
    </button>
  );
}
