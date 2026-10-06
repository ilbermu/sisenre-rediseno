import { createContext, useContext, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { dropdownAnchorStyle } from "@/components/ui/dropdown";

// true dentro del body/header/footer de un Modal (lo provee Modal). Los
// paneles flotantes lo leen para saber si tienen que salir del modal.
export const DentroDeModalContext = createContext(false);

export function useDentroDeModal() {
  return useContext(DentroDeModalContext);
}

// Panel flotante de un dropdown/popover (ValuePicker, DateTimeField…).
//   Fuera de un modal → como siempre: `absolute` junto al trigger, en
//     --z-dropdown, con la dirección de useDropdownDirection.
//   Dentro de un modal → en un portal a document.body, `position: fixed`
//     calculada desde el rect del trigger (arriba o abajo según
//     `direction`), en --z-modal-popover: así el overflow del body del modal
//     (y el transform del panel, que vuelve relativo cualquier `fixed`
//     descendiente) no lo recorta. Se recalcula con scroll y resize.
// `panelRef` va siempre al panel: quien lo usa tiene que contarlo como
// "adentro" en su cierre por clic afuera (con el portal ya no es
// descendiente del trigger en el DOM).
// `className` lleva solo el aspecto (fondo, borde, sombra, padding…), nunca
// el posicionamiento: `align` (borde izquierdo o derecho del trigger) y
// `matchWidth` (mismo ancho que el trigger) lo resuelven acá.
export default function FloatingPanel({
  anchorRef,
  panelRef,
  open,
  direction,
  gap,
  align = "left",
  matchWidth = false,
  className = "",
  style,
  children,
}: {
  anchorRef: React.RefObject<HTMLElement | null>;
  panelRef?: React.RefObject<HTMLDivElement | null>;
  open: boolean;
  direction: "down" | "up";
  gap: number;
  align?: "left" | "right";
  matchWidth?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const enModal = useDentroDeModal();
  const [pos, setPos] = useState<React.CSSProperties | null>(null);

  useLayoutEffect(() => {
    if (!enModal || !open) return;
    const actualizar = () => {
      const r = anchorRef.current?.getBoundingClientRect();
      if (!r) return;
      setPos({
        position: "fixed",
        ...(align === "right" ? { right: window.innerWidth - r.right } : { left: r.left }),
        ...(matchWidth ? { width: r.width } : null),
        ...(direction === "up" ? { bottom: window.innerHeight - r.top + gap } : { top: r.bottom + gap }),
      });
    };
    actualizar();
    window.addEventListener("resize", actualizar);
    window.addEventListener("scroll", actualizar, true);
    return () => {
      window.removeEventListener("resize", actualizar);
      window.removeEventListener("scroll", actualizar, true);
    };
  }, [enModal, open, direction, gap, align, matchWidth, anchorRef]);

  if (!open) return null;

  if (!enModal) {
    const alineacion = `${align === "right" ? "right-0" : "left-0"} ${matchWidth ? "w-full" : ""}`;
    return (
      <div
        ref={panelRef}
        className={`absolute ${alineacion} z-(--z-dropdown) ${className}`}
        style={{ ...dropdownAnchorStyle(direction, gap), ...style }}
      >
        {children}
      </div>
    );
  }

  if (!pos) return null;
  return createPortal(
    <div ref={panelRef} className={`z-(--z-modal-popover) ${className}`} style={{ ...pos, ...style }}>
      {children}
    </div>,
    document.body
  );
}
