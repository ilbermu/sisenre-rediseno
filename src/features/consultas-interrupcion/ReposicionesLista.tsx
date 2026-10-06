import { useState, useRef, useEffect } from "react";
import { Inbox } from "lucide-react";
import { FaseIndicador, FOCUS_RING_INSET, ICON } from "@/components/ui";
import { FaseReposicion } from "@/data/types";

// Alto fijo de fila de ReposicionesLista, en px — una sola línea (text-body
// 20px) con aire; fuera de la escala --spacing, así las filas quedan parejas
// entre tiers (la tipografía no cambia entre tiers).
const REPOSICIONES_ROW_H = 44;

// Lista de Reposiciones (Tabla 4/CDS4) de la Card B "Reposiciones" (Modificar
// interrupción) — única instancia. Lista de filas, no tabla (ver
// DESIGN_SYSTEM.md, "Lista de filas"): cada reposición tiene pocos campos y
// un identificador principal, así que va en UNA línea sin thead:
//   izquierda (min-w-0 flex-1, trunca) → "Reposición {nro}" + código de
//     equipo (font-mono) + descripción del equipo, todo muted salvo el nro.
//   derecha (shrink-0, gap fijo)       → FaseIndicador · hora · "{n} usuarios BT".
// modSelectedFase sigue siendo la única fuente de verdad, compartida con el
// modal "Tablas relacionadas" — acá solo viven hover y ref. Alto flexible:
// el contenedor y el área scrolleable son min-h-0, así que la lista llena el
// alto que le deja su padre (mismo mecanismo que la lista de Interrupciones)
// y scrollea sola. Semántica: role="listbox" (aria-label "Reposiciones") con
// filas role="option"/aria-selected; navegación por teclado (flechas
// arriba/abajo) interna.
// El acento de fila seleccionada usa una sombra inset
// (inset-shadow-row-selected): no ocupa espacio en el layout, el texto queda
// en la misma posición seleccionado o no.
export default function ReposicionesLista({
  rows,
  selectedIndex,
  onSelect,
}: {
  rows: FaseReposicion[];
  selectedIndex: number | null;
  onSelect: (index: number | null) => void;
}) {
  const [hovIndex, setHovIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedIndex === null || !listRef.current) return;
    listRef.current
      .querySelector<HTMLElement>(`[data-fase-index="${selectedIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (rows.length === 0) return;
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    if (selectedIndex === null) {
      onSelect(e.key === "ArrowDown" ? 0 : rows.length - 1);
      return;
    }
    const next = e.key === "ArrowDown" ? selectedIndex + 1 : selectedIndex - 1;
    onSelect(Math.min(Math.max(next, 0), rows.length - 1));
  }

  return (
    <div className="min-h-0 flex flex-col">
      <div
        ref={listRef}
        role="listbox"
        aria-label="Reposiciones"
        tabIndex={rows.length > 0 ? 0 : -1}
        onKeyDown={handleKeyDown}
        className={`min-h-0 overflow-y-auto overflow-x-hidden ${FOCUS_RING_INSET}`}
      >
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
            <span className="text-text-faint"><Inbox size={ICON.xl} strokeWidth={1.25} /></span>
            <p className="text-body-sm text-text-muted">Sin reposiciones registradas</p>
          </div>
        ) : (
          rows.map((fila, ri) => {
            const seleccionada = selectedIndex === ri;
            const esUltima = ri === rows.length - 1;
            return (
              <div
                key={ri}
                role="option"
                aria-selected={seleccionada}
                data-fase-index={ri}
                onClick={() => onSelect(seleccionada ? null : ri)}
                onMouseEnter={() => setHovIndex(ri)}
                onMouseLeave={() => setHovIndex(null)}
                className={`flex items-center gap-4 px-(--card-px) transition-colors cursor-pointer ${esUltima ? "" : "border-b border-border-subtle"} ${seleccionada ? "inset-shadow-row-selected" : ""}`}
                style={{ height: REPOSICIONES_ROW_H, backgroundColor: seleccionada ? "var(--color-primary-tint)" : hovIndex === ri ? "var(--color-fill-muted)" : undefined }}
              >
                <div className="min-w-0 flex-1 flex items-baseline gap-2">
                  <span className={`shrink-0 text-body whitespace-nowrap ${seleccionada ? "text-secondary font-medium" : "text-text"}`}>
                    Reposición {fila.nro}
                  </span>
                  <span className="shrink-0 text-code font-mono text-text-muted">{fila.equipoCodigo}</span>
                  <span className="min-w-0 truncate text-body-sm text-text-muted" title={fila.equipoDesc}>{fila.equipoDesc}</span>
                </div>
                <div className="shrink-0 flex items-center justify-end gap-4">
                  <FaseIndicador fase={fila.fase} />
                  <span className="text-code font-mono tabular-nums text-text-muted">{fila.horaRep}</span>
                  <span className="text-body-sm tabular-nums text-text-muted whitespace-nowrap">{fila.usuariosBT} usuarios BT</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
