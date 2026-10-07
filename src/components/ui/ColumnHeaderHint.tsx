import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

// Demora al aparecer (hover o foco); al salir, ninguna.
const DEMORA_MS = 300;
// Alto del tag y separación con el título.
const TAG_ALTO = 20;
const SEPARACION = 4;

// Props que el disparador (el título de la columna, un elemento enfocable)
// tiene que llevar.
export type HintTriggerProps = {
  "aria-describedby"?: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
};

type Posicion = { left: number } & ({ bottom: number } | { top: number });

// Pista sobre el título de una columna (ver DESIGN_SYSTEM.md,
// "ColumnHeaderHint"): con hover o foco aparece, ARRIBA del título (4px de
// separación, alineado a la izquierda con su texto), un tag chico con
// `hint` — el nombre real de la columna en la base (ej. REF, F). Solo si no
// hay lugar arriba (borde superior del viewport) se abre abajo. El título no
// lleva decoración: quien lo renderiza lo pinta en text-secondary con hover
// o foco cuando hay pista (SortableHeaderCell). No es el Tooltip general de
// la app, pero puede evolucionar hacia él. Sin `hint`: nada (sin tag, sin
// envoltorio).
// Render-prop: `children` recibe las props del disparador, así el título
// sigue siendo su propio elemento enfocable (ej. el botón de orden de
// SortableHeaderCell) y el tag se le asocia con aria-describedby. El tag
// visible va en un portal a document.body (position: fixed, --z-tooltip):
// el contenedor con scroll de la tabla lo recortaría si estuviera adentro.
// Escape lo cierra.
export default function ColumnHeaderHint({
  hint,
  children,
}: {
  hint?: string;
  children: (trigger: HintTriggerProps) => React.ReactNode;
}) {
  const id = useId();
  const ref = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState<Posicion | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const ocultar = () => {
    if (timer.current) clearTimeout(timer.current);
    setPos(null);
  };
  const mostrar = () => {
    if (!hint) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const hayLugarArriba = r.top >= TAG_ALTO + SEPARACION;
      setPos(hayLugarArriba ? { left: r.left, bottom: window.innerHeight - r.top + SEPARACION } : { left: r.left, top: r.bottom + SEPARACION });
    }, DEMORA_MS);
  };

  // Visible: Escape lo cierra (en captura y cortando la propagación, para no
  // deseleccionar la fila de la tabla); scroll o resize también lo cierran
  // (el tag es fixed y quedaría desalineado).
  const visible = pos !== null;
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      ocultar();
    };
    document.addEventListener("keydown", onKey, true);
    window.addEventListener("scroll", ocultar, true);
    window.addEventListener("resize", ocultar);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      window.removeEventListener("scroll", ocultar, true);
      window.removeEventListener("resize", ocultar);
    };
  }, [visible]);

  const trigger: HintTriggerProps = {
    "aria-describedby": hint ? id : undefined,
    onMouseEnter: mostrar,
    onMouseLeave: ocultar,
    onFocus: mostrar,
    onBlur: ocultar,
  };
  // Sin hint: el disparador tal cual, sin envoltorio (no cambia el layout
  // de quien lo usa).
  if (!hint) return <>{children(trigger)}</>;

  return (
    <span ref={ref} className="inline-flex min-w-0">
      {children(trigger)}
      {/* Descripción para lectores de pantalla: siempre en el DOM
          (aria-describedby apunta a un elemento que existe). */}
      <span id={id} className="sr-only">{hint}</span>
      {pos &&
        createPortal(
          <span
            aria-hidden
            className="fixed z-(--z-tooltip) h-5 px-1.5 inline-flex items-center rounded-sm border border-chip-border bg-primary-tint text-caption font-semibold caps text-secondary whitespace-nowrap pointer-events-none"
            style={pos}
          >
            {hint}
          </span>,
          document.body,
        )}
    </span>
  );
}
