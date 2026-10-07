import { useEffect, useId, useRef, useState } from "react";

// Demora al aparecer (hover o foco); al salir, ninguna.
const DEMORA_MS = 300;

// Props que el disparador (el título de la columna, un elemento enfocable)
// tiene que llevar.
export type HintTriggerProps = {
  "aria-describedby"?: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
};

// Pista sobre el título de una columna (patrón "definition tooltip" de
// Carbon, ver DESIGN_SYSTEM.md, "ColumnHeaderHint"): el texto del título
// lleva un subrayado punteado sutil (`subrayadoCls`) y, con hover o foco,
// aparece debajo un tag chico con `hint` — el nombre real de la columna en
// la base (ej. REF, F). No es el Tooltip general de la app, pero puede
// evolucionar hacia él. Sin `hint`: sin subrayado ni tag (el render-prop
// recibe props vacías de aria).
// Render-prop: `children` recibe las props del disparador y la clase del
// subrayado, así el título sigue siendo su propio elemento enfocable (ej. el
// botón de orden de SortableHeaderCell) y el tag se le asocia con
// aria-describedby. Escape lo cierra.
export default function ColumnHeaderHint({
  hint,
  children,
}: {
  hint?: string;
  children: (trigger: HintTriggerProps, subrayadoCls: string) => React.ReactNode;
}) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const mostrar = () => {
    if (!hint) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setVisible(true), DEMORA_MS);
  };
  const ocultar = () => {
    if (timer.current) clearTimeout(timer.current);
    setVisible(false);
  };

  const trigger: HintTriggerProps = {
    "aria-describedby": hint ? id : undefined,
    onMouseEnter: mostrar,
    onMouseLeave: ocultar,
    onFocus: mostrar,
    onBlur: ocultar,
    onKeyDown: (e) => {
      if (e.key === "Escape" && visible) {
        e.stopPropagation();
        ocultar();
      }
    },
  };
  // Sin hint: el disparador tal cual, sin envoltorio (no cambia el layout
  // de quien lo usa).
  if (!hint) return <>{children(trigger, "")}</>;
  const subrayadoCls = "underline decoration-dotted decoration-neutral-400 underline-offset-3";

  return (
    <span className="relative inline-flex min-w-0">
      {children(trigger, subrayadoCls)}
      {/* Siempre en el DOM (aria-describedby apunta a un elemento que
          existe); oculto hasta que corresponde. */}
      <span
        id={id}
        role="tooltip"
        className={`absolute left-0 top-full mt-1 z-(--z-tooltip) px-1.5 py-0.5 rounded-sm border border-border bg-fill-subtle text-caption font-mono uppercase text-text-muted whitespace-nowrap pointer-events-none ${
          visible ? "" : "hidden"
        }`}
      >
        {hint}
      </span>
    </span>
  );
}
