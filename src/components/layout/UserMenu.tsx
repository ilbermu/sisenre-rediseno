import { useState, useRef, useEffect } from "react";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";
import { dropdownAnchorStyle, ICON, useDropdownDirection } from "@/components/ui";

// ─── User menu ────────────────────────────────────────────────────────────────

export default function UserMenu({ collapsed, onLogout }: { collapsed: boolean; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  // Solo aplica al caso no-colapsado (flyout vertical) — el colapsado abre
  // hacia el costado (flyout horizontal), geometría distinta que no entra
  // en el criterio arriba/abajo.
  const direction = useDropdownDirection(ref, open, 170);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-2 rounded-sm px-1.5 py-1.5 transition-colors hover:bg-fill-muted ${open ? "bg-fill-muted" : ""}`}
      >
        <div
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-label text-white bg-brand-gradient"
        >
          R
        </div>
        {!collapsed && (
          <>
            <div className="flex-1 text-left overflow-hidden">
              <p className="text-body font-medium text-text truncate">Rdellamagiora</p>
              <p className="text-caption text-text-muted mt-0.5 truncate">Operador</p>
            </div>
            <span className={`text-icon transition-transform duration-(--duration-base) ${open ? "rotate-180" : ""}`}>
              <ChevronDown size={ICON.md} strokeWidth={1.5} />
            </span>
          </>
        )}
      </button>
      {open && (
        <div
          className={`shadow-md absolute ${collapsed ? "left-[calc(100%+8px)] bottom-0" : "left-0 right-0"} bg-surface rounded-md border border-border py-1 z-(--z-dropdown) min-w-[160px]`}
          style={collapsed ? undefined : dropdownAnchorStyle(direction, 6)}
        >
          <button className="w-full flex items-center gap-2 px-3 py-2 text-body text-text hover:bg-fill-muted transition-colors">
            <User size={ICON.md} strokeWidth={1.5} /> Mi perfil
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-2 text-body text-text hover:bg-fill-muted transition-colors">
            <Settings size={ICON.md} strokeWidth={1.5} /> Configuración
          </button>
          <div className="my-1 border-t border-border" />
          <button
            onClick={() => { setOpen(false); onLogout(); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-body text-error hover:text-error-text-strong hover:bg-error-bg-subtle transition-colors"
          >
            <LogOut size={ICON.md} strokeWidth={1.5} /> Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
