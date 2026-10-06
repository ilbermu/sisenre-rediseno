import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import {
  actionBtnCls,
  ActionItem,
  dropdownAnchorStyle,
  ICON,
  useDropdownDirection,
} from "@/components/ui";

// Barra de acciones persistente — a diferencia de SelectionActionBar
// (que solo aparece con una fila seleccionada),
// esta vive siempre en pantalla. Cada acción decide su propio estado
// habilitado/deshabilitado via `disabled` en vez de depender de que la
// barra entera aparezca/desaparezca — mismo criterio que separa "+Insertar"
// (siempre disponible) de Auditoría/Modificar/Borrar (dependen de
// selección) en el motor ABM. Los botones van a ancho natural (no se
// estiran), alineados a la izquierda; un divisor vertical separa las
// acciones siempre habilitadas (Desarmes, Lotes) del resto, que dependen
// de tener una interrupción seleccionada — para que esa diferencia de
// lógica se note de un vistazo.
export default function PersistentActionsBar({
  siempreHabilitadas,
  condicionales,
}: {
  siempreHabilitadas: ActionItem[];
  condicionales: ActionItem[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  const direction = useDropdownDirection(ref, open, 300);

  function Boton(a: ActionItem) {
    return (
      <button
        key={a.label}
        onClick={a.onClick}
        disabled={a.disabled}
        className={actionBtnCls(a.variant) + " shrink-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"}
      >
        {a.label}
      </button>
    );
  }

  function ItemMenu(a: ActionItem) {
    return (
      <button
        key={a.label}
        type="button"
        disabled={a.disabled}
        onClick={() => { a.onClick?.(); setOpen(false); }}
        className={`w-full flex items-center px-2.5 py-2 rounded-sm text-left text-body transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none ${
          a.variant === "destructive" ? "text-error hover:text-error-text-strong hover:bg-error-bg-subtle" : "text-text hover:bg-fill-muted"
        }`}
      >
        {a.label}
      </button>
    );
  }

  // El trigger+panel de tier 760px no vive acá abajo — se porta junto al
  // buscador de la tabla "Interrupciones" (ver slot "acciones-tier2-slot",
  // dentro de ModificarContent) — no al header de esa card, ni al de
  // "Búsqueda", ni a la barra de título principal (esa es solo título +
  // selector de período en toda la app). Esto elimina la fila/card entera
  // de PersistentActionsBar en ese breakpoint en vez de solo vaciarla de
  // contenido.
  //
  // El elemento con ese id vive en uno de dos renders condicionales según
  // haya o no resultados (el buscador de tabla solo existe con datos
  // cargados) — por eso `portalNode` se re-resuelve en CADA render (sin
  // dependencias) en vez de una sola vez al montar: cuando cambia esa
  // condición, React desmonta el div viejo y monta uno nuevo con el mismo
  // id, y el efecto necesita volver a buscarlo o el portal quedaría
  // apuntando a un nodo ya removido del DOM.
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setPortalNode(document.getElementById("acciones-tier2-slot"));
  });

  const dropdown = (
    <div ref={ref} className="hidden [@media(max-height:760px)]:block relative mr-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={actionBtnCls("neutral") + " inline-flex items-center gap-1.5"}
      >
        Acciones
        <span className={`transition-transform duration-(--duration-base) ${open ? "rotate-180" : ""}`}><ChevronDown size={ICON.md} strokeWidth={1.5} /></span>
      </button>
      {open && (
        <div
          className="shadow-md absolute left-0 w-56 bg-surface rounded-md border border-border z-(--z-dropdown) overflow-hidden p-1.5 flex flex-col gap-0.5"
          style={{ ...dropdownAnchorStyle(direction, 5) }}
        >
          {siempreHabilitadas.map(ItemMenu)}
          <div className="h-px bg-border my-0.5" />
          {condicionales.map(ItemMenu)}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Fila expandida — tamaño normal de ventana. Es la segunda fila de
          la card de Búsqueda (sin card propia), separada de los filtros
          por border-t. Se esconde entera (no solo se vacía) en tier 760px, porque el dropdown que la reemplaza
          vive en el header (portal de acá abajo), no en este lugar. */}
      <div
        className="flex items-center gap-2 flex-wrap px-4 py-2.5 border-t border-border-subtle [@media(max-height:760px)]:hidden"
      >
        {siempreHabilitadas.map(Boton)}
        <div className="w-px h-5 bg-border shrink-0" />
        {condicionales.map(Boton)}
      </div>
      {portalNode && createPortal(dropdown, portalNode)}
    </>
  );
}
