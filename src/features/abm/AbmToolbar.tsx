import { RefObject, useRef } from "react";
import { Download, History, Pencil, Trash2 } from "lucide-react";
import { FOCUS_RING, ghostBtnCls, ICON } from "@/components/ui";

// Toolbar de tabla del ABM (ver DESIGN_SYSTEM.md, "Tabla de resultados" →
// "Toolbar de tabla"): SIEMPRE presente entre la barra de filtros y la tabla
// (--control-sm, ancho completo, px-2, sin fondo en ninguno de los dos
// estados). Cambia el contenido, no el layout: la tabla no se mueve nunca.
// Las dos capas comparten la celda de un grid y hacen crossfade de 120ms
// (solo opacidad; con movimiento reducido, directo por la regla global); la
// capa oculta es inert. El celeste queda solo en la fila seleccionada.
//
//   Sin selección   "Período 08/2026 · Actualizado 10:42"      [Exportar] [Auditoría]
//   Con selección   "<id> seleccionado" │ Deseleccionar         [Modificar] [Borrar]
//
// SELECCIÓN MÚLTIPLE (preparada, todavía NO habilitada en la UI): la
// pantalla guarda la selección como una colección de ids y le pasa a la
// toolbar los códigos (`codigos`, uno por registro). Hoy la tabla selecciona
// de a uno (clic en otra fila reemplaza la selección) y no hay checkboxes,
// pero las reglas ya valen para cuando se habilite:
//   · 1 registro  → "<código en mono> seleccionado";
//   · 2 o más     → "N registros seleccionados" (sin códigos);
//   · Modificar   → solo con exactamente 1 registro;
//   · Borrar      → aplica a todos los seleccionados (ConfirmarBorrarModal
//                   acepta N y pluraliza; lista los códigos si son 5 o menos).
export default function AbmToolbar({
  contexto,
  hayResultados,
  codigos,
  onExportar,
  onAuditoria,
  onModificar,
  onBorrar,
  onDeseleccionar,
  registroRef,
}: {
  // "Período 08/2026 · Actualizado 10:42".
  contexto: string;
  hayResultados: boolean;
  // Código (campoId) de cada registro seleccionado; vacío = sin selección.
  codigos: string[];
  onExportar: () => void;
  onAuditoria: () => void;
  onModificar: () => void;
  onBorrar: () => void;
  onDeseleccionar: () => void;
  // Capa de selección: la pantalla la usa para devolver el foco a la tabla
  // si estaba adentro al deseleccionar (la capa pasa a inert).
  registroRef: RefObject<HTMLDivElement | null>;
}) {
  const hayAlgo = codigos.length > 0;
  // Durante el crossfade de salida la selección ya está vacía, pero la capa
  // sigue mostrando los mismos registros.
  const ultimos = useRef<string[]>([]);
  if (hayAlgo) ultimos.current = codigos;
  const mostrados = ultimos.current;

  const capa = "col-start-1 row-start-1 flex items-center gap-2 min-w-0 transition-opacity duration-120";
  const textoCls = "text-caption text-neutral-600 tabular-nums whitespace-nowrap truncate";
  const accionCls = (tono: "neutral" | "destructive") => `${ghostBtnCls(tono)} gap-1.5`;

  return (
    <div className="shrink-0 grid h-(--control-sm) px-2">
      {/* Sin selección: contexto de los datos + acciones de tabla. */}
      <div inert={hayAlgo} className={`${capa} ${hayAlgo ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        <span className={textoCls}>{contexto}</span>
        <div className="ml-auto flex items-center gap-2 shrink-0">
          {/* El tooltip va en el contenedor: un botón deshabilitado no recibe
              el hover. */}
          <span title={hayResultados ? undefined : "No hay registros para exportar"}>
            <button type="button" onClick={onExportar} disabled={!hayResultados} className={accionCls("neutral")}>
              <Download size={ICON.sm} strokeWidth={1.5} />
              Exportar
            </button>
          </span>
          <button type="button" onClick={onAuditoria} className={accionCls("neutral")}>
            <History size={ICON.sm} strokeWidth={1.5} />
            Auditoría
          </button>
        </div>
      </div>

      {/* Con selección: qué hay seleccionado + acciones de registro. */}
      <div ref={registroRef} inert={!hayAlgo} className={`${capa} ${hayAlgo ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <span className={textoCls}>
          {mostrados.length === 1 ? (
            <>
              <span className="font-mono text-neutral-900">{mostrados[0]}</span> seleccionado
            </>
          ) : (
            `${mostrados.length} registros seleccionados`
          )}
        </span>
        <div className="w-px h-4 bg-neutral-300 shrink-0" />
        <button
          type="button"
          onClick={onDeseleccionar}
          className={`shrink-0 rounded-sm text-caption text-secondary underline underline-offset-3 hover:text-primary-strong ${FOCUS_RING}`}
        >
          Deseleccionar
        </button>
        <div className="ml-auto flex items-center gap-2 shrink-0">
          {mostrados.length === 1 && (
            <button type="button" onClick={onModificar} className={accionCls("neutral")}>
              <Pencil size={ICON.sm} strokeWidth={1.5} />
              Modificar
            </button>
          )}
          <button type="button" onClick={onBorrar} className={accionCls("destructive")}>
            <Trash2 size={ICON.sm} strokeWidth={1.5} />
            Borrar
          </button>
        </div>
      </div>
    </div>
  );
}
