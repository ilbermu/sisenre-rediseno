import { useState, useEffect } from "react";

// ─── Dropdown/popover "smart" direction ────────────────────────────────────────
// Mecanismo único reusado por TODO panel flotante de la app (ValuePicker,
// AbmTableSelector, PeriodSelector, DateTimeField, MiniCaptionDropdown,
// DiaDelMesField, UserMenu, el dropdown "Acciones" de PersistentActionsBar)
// en vez de que cada uno hardcodee su propia dirección (algunos abrían
// siempre hacia abajo, otros siempre hacia arriba, sin criterio común).
// Abre hacia abajo por default; flipea hacia arriba solo cuando el panel no
// entra completo entre el trigger y el borde inferior del viewport. Mide
// recién al abrirse (no en cada render, no todo el tiempo) usando el mismo
// `ref` que cada componente ya tiene para su listener de click-outside.
export function useDropdownDirection(
  triggerRef: React.RefObject<HTMLElement | null>,
  open: boolean,
  panelHeight: number
): "down" | "up" {
  const [direction, setDirection] = useState<"down" | "up">("down");
  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const espacioAbajo = window.innerHeight - rect.bottom;
    const espacioArriba = rect.top;
    setDirection(espacioAbajo < panelHeight && espacioArriba > espacioAbajo ? "up" : "down");
  }, [open, triggerRef, panelHeight]);
  return direction;
}

// Ancla vertical del panel según la dirección resuelta — spread dentro del
// `style` del panel junto a lo que cada dropdown ya tenga (width, transform,
// etc.). `gapPx` es la separación entre trigger y panel (cada dropdown ya
// tenía su propio valor de 4-6px, se mantiene).
export function dropdownAnchorStyle(direction: "down" | "up", gapPx: number): React.CSSProperties {
  return direction === "up" ? { bottom: `calc(100% + ${gapPx}px)` } : { top: `calc(100% + ${gapPx}px)` };
}
