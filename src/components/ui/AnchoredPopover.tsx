import { useLayoutEffect, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const GAP = 5;
const MARGEN_VIEWPORT = 8;

// Popover anclado a SU disparador (ver DESIGN_SYSTEM.md, "Barra de filtros
// híbrida": un popover se ancla a su disparador, nunca al borde de la barra
// que lo contiene). En un portal a document.body, `position: fixed`, en
// --z-dropdown, con el chrome de los dropdowns del sistema (radio md, borde,
// sombra md).
//   Horizontal: alineado al borde izquierdo del disparador; si no entra a la
//     derecha del viewport, al borde derecho del disparador.
//   Vertical: debajo del disparador; arriba solo si abajo no entra y arriba
//     hay más lugar.
// Se recalcula con scroll, resize y cambios de tamaño del propio panel.
// Clic afuera (fuera del panel y del disparador) cierra. Escape cierra, corta
// la propagación (no cierra un Modal ni deselecciona nada detrás) y
// devuelve el foco al disparador.
export default function AnchoredPopover({
  anchorRef,
  open,
  onClose,
  children,
  className = "",
  style,
  ariaLabel,
  role,
}: {
  anchorRef: React.RefObject<HTMLElement | null>;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
  // Sin role, la semántica la pone el contenido (ej. un editor con su
  // propio listbox o dialog).
  role?: "dialog" | "menu" | "listbox";
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<React.CSSProperties | null>(null);
  // onClose cambia en cada render del padre; los listeners leen el último.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    const actualizar = () => {
      const a = anchorRef.current?.getBoundingClientRect();
      const p = panelRef.current?.getBoundingClientRect();
      if (!a) return;
      const ancho = p?.width ?? 0;
      const alto = p?.height ?? 0;
      const entraDerecha = a.left + ancho <= window.innerWidth - MARGEN_VIEWPORT;
      const abajo = window.innerHeight - a.bottom;
      const arriba = a.top;
      const haciaArriba = alto > 0 && abajo < alto + GAP && arriba > abajo;
      setPos({
        position: "fixed",
        ...(entraDerecha ? { left: a.left } : { left: Math.max(MARGEN_VIEWPORT, a.right - ancho) }),
        ...(haciaArriba ? { bottom: window.innerHeight - a.top + GAP } : { top: a.bottom + GAP }),
      });
    };
    actualizar();
    const ro = new ResizeObserver(actualizar);
    if (panelRef.current) ro.observe(panelRef.current);
    window.addEventListener("resize", actualizar);
    window.addEventListener("scroll", actualizar, true);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", actualizar);
      window.removeEventListener("scroll", actualizar, true);
    };
  }, [open, anchorRef]);

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || anchorRef.current?.contains(t)) return;
      onCloseRef.current();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      onCloseRef.current();
      anchorRef.current?.focus();
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [open, anchorRef]);

  if (!open) return null;
  return createPortal(
    <div
      ref={panelRef}
      role={role}
      aria-label={ariaLabel}
      className={`shadow-md bg-surface rounded-md border border-border z-(--z-dropdown) ${className}`}
      // Primer cuadro sin posición: invisible hasta medir el panel.
      style={{ ...(pos ?? { position: "fixed", top: 0, left: 0, visibility: "hidden" }), ...style }}
    >
      {children}
    </div>,
    document.body,
  );
}
