import { useLayoutEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnchoredPopover, FOCUS_RING, ICON } from "@/components/ui";
import { FaseReposicion } from "@/data/types";
import { formatHora, formatNumero, parseFechaHora } from "@/lib/format";

const horaDe = (texto: string) => {
  const d = parseFechaHora(texto);
  return d ? formatHora(d) : texto;
};

const MAX_SEGMENTADO = 6;

// Selector de fase de reposición del modal "Tablas relacionadas" (ver
// DESIGN_SYSTEM.md, "Selector de fase"). UN SOLO control, según el caso:
//   - segmentado (6 fases o menos Y todas entran en el ancho de la columna,
//     medido con ResizeObserver): un botón por fase con "Fase N" + hh:mm;
//     contenedor fill-subtle con borde y radio 8, padding 3px; la
//     seleccionada va en fondo blanco, text-secondary, sombra sutil y anillo
//     de 1px; role="tablist", ←/→ mueven la selección;
//   - desplegable (más de 6 fases o no entran): trigger de --control-md con
//     "Fase N" + hh:mm, chevron y border-strong; la lista muestra en tres
//     columnas alineadas "Fase N" | hh:mm | "N clientes"; con foco en el
//     trigger cerrado, ↑/↓ cambian de fase.
// Sin flechas anterior/siguiente ni "1 de N".
export default function FaseSelector({
  fases,
  seleccionada,
  onSeleccionar,
}: {
  fases: FaseReposicion[];
  // nro de la fase elegida.
  seleccionada: number;
  onSeleccionar: (nro: number) => void;
}) {
  const contRef = useRef<HTMLDivElement>(null);
  const medidaRef = useRef<HTMLDivElement>(null);
  const [entra, setEntra] = useState(true);
  const posibleSegmentado = fases.length <= MAX_SEGMENTADO;

  // ¿Entra el segmentado completo en el ancho de la columna? Se mide una copia
  // invisible (ancho natural) contra el contenedor.
  useLayoutEffect(() => {
    const cont = contRef.current;
    const medida = medidaRef.current;
    if (!cont || !medida || !posibleSegmentado) return;
    const medir = () => setEntra(medida.offsetWidth <= cont.clientWidth);
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(cont);
    return () => ro.disconnect();
  }, [fases, posibleSegmentado]);

  const indice = Math.max(
    0,
    fases.findIndex((f) => f.nro === seleccionada),
  );
  const actual = fases[indice];
  const ir = (i: number) => {
    const f = fases[Math.min(fases.length - 1, Math.max(0, i))];
    if (f && f.nro !== seleccionada) onSeleccionar(f.nro);
  };

  const [abierto, setAbierto] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listaRef = useRef<HTMLDivElement>(null);

  if (!actual) return null;

  const etiqueta = (f: FaseReposicion) => (
    <>
      Fase {f.nro} <span className="text-[12px] font-normal text-neutral-500">{horaDe(f.horaRep)}</span>
    </>
  );
  const botonCls = "inline-flex items-center gap-1.5 h-[30px] px-3 rounded-md text-[13px] font-medium whitespace-nowrap tabular-nums";

  const segmentado = posibleSegmentado && entra;
  return (
    <div ref={contRef} className="relative w-full min-w-0">
      {/* Copia invisible para medir el ancho natural del segmentado. */}
      {posibleSegmentado && (
        <div ref={medidaRef} aria-hidden className="invisible absolute left-0 top-0 inline-flex w-max gap-1 p-[3px] border border-transparent pointer-events-none">
          {fases.map((f) => (
            <span key={f.nro} className={`${botonCls} text-neutral-600`}>
              {etiqueta(f)}
            </span>
          ))}
        </div>
      )}

      {segmentado ? (
        <div
          role="tablist"
          aria-label="Reposición"
          onKeyDown={(e) => {
            if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
            e.preventDefault();
            const sig = (indice + (e.key === "ArrowRight" ? 1 : fases.length - 1)) % fases.length;
            ir(sig);
            requestAnimationFrame(() => contRef.current?.querySelector<HTMLElement>(`[data-nro="${fases[sig].nro}"]`)?.focus());
          }}
          className="inline-flex max-w-full gap-1 p-[3px] bg-fill-subtle border border-border rounded-lg"
        >
          {fases.map((f) => {
            const sel = f.nro === seleccionada;
            return (
              <button
                key={f.nro}
                type="button"
                role="tab"
                data-nro={f.nro}
                aria-selected={sel}
                tabIndex={sel ? 0 : -1}
                onClick={() => onSeleccionar(f.nro)}
                className={`${botonCls} cursor-pointer transition-colors ${FOCUS_RING} ${
                  sel ? "bg-surface text-secondary shadow-sm ring-1 ring-border [&>span]:text-secondary" : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                {etiqueta(f)}
              </button>
            );
          })}
        </div>
      ) : (
        <>
          <button
            ref={triggerRef}
            type="button"
            aria-haspopup="listbox"
            aria-expanded={abierto}
            aria-label="Reposición"
            onClick={() => setAbierto((v) => !v)}
            onKeyDown={(e) => {
              if (abierto || (e.key !== "ArrowDown" && e.key !== "ArrowUp")) return;
              e.preventDefault();
              ir(indice + (e.key === "ArrowDown" ? 1 : -1));
            }}
            className={`inline-flex items-center gap-2 h-(--control-md) pl-3 pr-2.5 bg-surface border border-border-strong rounded-sm text-body-sm font-medium text-secondary tabular-nums cursor-pointer ${FOCUS_RING}`}
          >
            <span className="[&>span]:text-secondary">{etiqueta(actual)}</span>
            <ChevronDown size={ICON.md} strokeWidth={1.5} className="text-icon" />
          </button>
          <AnchoredPopover
            anchorRef={triggerRef}
            open={abierto}
            onClose={() => setAbierto(false)}
            role="listbox"
            ariaLabel="Reposición"
            style={{ zIndex: "var(--z-modal-popover)" }}
          >
            <div
              ref={listaRef}
              className="w-[300px] max-h-[280px] overflow-auto p-1"
              onKeyDown={(e) => {
                if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
                e.preventDefault();
                const opciones = [...(listaRef.current?.querySelectorAll<HTMLElement>("[role=option]") ?? [])];
                const i = opciones.indexOf(document.activeElement as HTMLElement);
                opciones[Math.min(opciones.length - 1, Math.max(0, i + (e.key === "ArrowDown" ? 1 : -1)))]?.focus();
              }}
            >
              {fases.map((f) => {
                const sel = f.nro === seleccionada;
                return (
                  <button
                    key={f.nro}
                    type="button"
                    role="option"
                    aria-selected={sel}
                    ref={(el) => {
                      if (el && sel && abierto) requestAnimationFrame(() => el.focus());
                    }}
                    onClick={() => {
                      onSeleccionar(f.nro);
                      setAbierto(false);
                      triggerRef.current?.focus();
                    }}
                    className={`grid grid-cols-[64px_48px_1fr] items-center w-full h-[34px] px-2.5 rounded-sm text-body-sm tabular-nums text-left cursor-pointer ${FOCUS_RING} ${
                      sel ? "bg-primary-tint text-secondary font-medium" : "text-neutral-700 hover:bg-fill-subtle"
                    }`}
                  >
                    <span>Fase {f.nro}</span>
                    <span className={`text-[12px] ${sel ? "text-secondary" : "text-neutral-500"}`}>{horaDe(f.horaRep)}</span>
                    <span className={`text-[12px] text-right ${sel ? "text-secondary" : "text-neutral-500"}`}>
                      {formatNumero(f.usuariosBT)} {f.usuariosBT === 1 ? "cliente" : "clientes"}
                    </span>
                  </button>
                );
              })}
            </div>
          </AnchoredPopover>
        </>
      )}
    </div>
  );
}
