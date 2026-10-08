// Línea de tiempo vertical (ver DESIGN_SYSTEM.md, "Timeline"): lista
// ordenada de ítems, cada uno con un dot a la izquierda, una línea conectora
// hasta el dot siguiente y su contenido. Genérica: el contenido y el estado de
// cada dot los pone quien la usa (ej. ReposicionesTimeline).
//   - <ol>; cada ítem con padding-left de 28px y el dot (16px) en left 0.
//   - Línea conectora de 2px (bg-border) entre dots; el último ítem no la
//     tiene.
//   - El dot se alinea con la PRIMERA línea del contenido: quien la usa
//     arranca el contenido con TIMELINE_CONTENIDO_PY (8px) arriba y una
//     primera línea de 20px.
// Medidas en px (no en la escala --spacing, que cambia por tier de altura):
// el dot y la línea no tienen que moverse entre tiers.
//
// Dots:
//   "inicio"  → relleno fill-muted con borde 1px neutral-400 (ítem fijo, no
//               seleccionable, ej. el inicio de una interrupción);
//   "normal"  → blanco con borde 2px neutral-300;
//   "activo"  → relleno bg-secondary con anillo de 3px primary-tint (ítem
//               seleccionado).
export type TimelineDot = "inicio" | "normal" | "activo";

export type TimelineItem = {
  key: string;
  dot: TimelineDot;
  contenido: React.ReactNode;
};

// Padding vertical del contenido de cada ítem (y del área de hover): 8px.
export const TIMELINE_CONTENIDO_PY = "py-[8px]";

const DOT_CLS: Record<TimelineDot, string> = {
  inicio: "bg-fill-muted border border-neutral-400",
  normal: "bg-surface border-2 border-neutral-300",
  activo: "bg-secondary shadow-[0_0_0_3px_var(--color-primary-tint)]",
};

export default function Timeline({ items, ariaLabel }: { items: TimelineItem[]; ariaLabel?: string }) {
  return (
    <ol aria-label={ariaLabel} className="flex flex-col">
      {items.map((item, i) => {
        const ultimo = i === items.length - 1;
        return (
          <li key={item.key} className={`relative pl-[28px] ${ultimo ? "" : "pb-[4px]"}`}>
            {/* Dot: centrado con la primera línea (8px de padding + 20px de
                línea → centro a 18px → top 10px). */}
            <span aria-hidden className={`absolute left-0 top-[10px] w-[16px] h-[16px] rounded-full box-border transition-colors duration-(--duration-fast) ${DOT_CLS[item.dot]}`} />
            {/* Conectora: del pie de este dot al tope del siguiente (que
                está 10px dentro del ítem siguiente). */}
            {!ultimo && <span aria-hidden className="absolute left-[7px] top-[26px] bottom-[-10px] w-[2px] bg-border" />}
            {item.contenido}
          </li>
        );
      })}
    </ol>
  );
}
