import { useEffect, useMemo, useRef, useState } from "react";
import { BTN_SM, ChipFilterBar, FOCUS_RING_INSET, rangoDePeriodo, SortableHeaderCell, TablaChip, useTableToolbar } from "@/components/ui";
import { ABM_TABLE_CONFIGS } from "@/data/abmTables";
import { columnasDeResultados } from "@/features/abm/columnasDeResultados";
import { filtrarFilas } from "@/features/abm/filtrarFilas";
import { chipsDeConfig, filtrosFilaDeBarra } from "@/features/abm/filtrosDeConfig";
import { labelDeValor } from "@/features/abm/labelDeValor";
import { formatHora, formatNumero } from "@/lib/format";

// Tabla 2 (Interrupciones) — sus filas son las de SAMPLE_ROWS, en el mismo
// orden: el índice de fila es la identidad de la interrupción en toda la
// pantalla (selección, "Volver" desde ABM).
const CONFIG = ABM_TABLE_CONFIGS.cds2;
// Columnas del maestro, en este orden (nombreReal de cada una): el resto de
// las columnas de Tabla 2 no se muestran acá.
const COLUMNAS_MAESTRO = ["REF", "FECHA", "TE", "FAS", "ORIGEN", "TIPO"];

// Maestro de Consultas de interrupción (ver DESIGN_SYSTEM.md, Patrones →
// "Maestro-detalle"): columna izquierda (52%), sobre el fondo de la app, con
// padding de página. De arriba abajo:
//   título de sección (chip "Tabla 2" + "Interrupciones", estático) →
//   ChipFilterBar compacta (ID + Fecha + "Filtros"; los filtros de Tabla 2,
//   los mismos que en su ABM) → toolbar con solo el contexto ("Período
//   08/2026 · Actualizado hh:mm"; sin Exportar, Auditoría ni modo selección:
//   acá seleccionar es ver el detalle) → la tabla en su caja (mismo estilo
//   que los ABM) con paginación al pie.
// Selección SIEMPRE activa (la controla la pantalla): al cargar y al cambiar
// los filtros, si la seleccionada no está en los resultados, pasa a la
// primera fila; sin resultados, ninguna. Clic en la seleccionada no
// deselecciona. Con foco en la tabla, ↑/↓ mueven la selección.
export default function InterrupcionesMaestro({
  periodo,
  seleccionada,
  onSeleccionar,
}: {
  periodo: string;
  seleccionada: number | null;
  onSeleccionar: (indice: number | null) => void;
}) {
  const rows = CONFIG.rows;
  const columnas = useMemo(
    () =>
      COLUMNAS_MAESTRO.map((real) => columnasDeResultados(CONFIG).find((c) => c.nombreReal === real)).filter(
        (c): c is NonNullable<typeof c> => !!c,
      ),
    [],
  );
  const celda = (row: Record<string, string>, c: (typeof columnas)[number]) => labelDeValor(c.campo, row[c.key] ?? "", row);
  const getCells = (row: Record<string, string>) => columnas.map((c) => celda(row, c));

  // ── Filtros (aplicación instantánea, como en los ABM).
  const { visibles, agregables } = useMemo(() => chipsDeConfig(CONFIG), []);
  const [id, setId] = useState("");
  const [valores, setValores] = useState<Record<string, string>>({});
  const filtros = filtrosFilaDeBarra(CONFIG, id, valores, [...visibles, ...agregables]);
  const hayFiltros = filtros.some((f) => f.valor.trim() !== "");
  const indicesBuscados = hayFiltros ? new Set(filtrarFilas(rows, filtros)) : null;

  // ── Orden por columna + filtros, sin renumerar.
  const { sortIdx, sortDir, toggleSort, visibleIndices: ordenados } = useTableToolbar(rows, getCells);
  const visibleIndices = indicesBuscados ? ordenados.filter((i) => indicesBuscados.has(i)) : ordenados;
  const hayResultados = visibleIndices.length > 0;

  // ── Auto-selección: siempre hay una interrupción seleccionada mientras
  // haya resultados.
  const clave = visibleIndices.join(",");
  useEffect(() => {
    if (visibleIndices.length === 0) {
      if (seleccionada !== null) onSeleccionar(null);
      return;
    }
    if (seleccionada === null || !visibleIndices.includes(seleccionada)) onSeleccionar(visibleIndices[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave, seleccionada]);

  // ── Teclado y scroll.
  const listaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (seleccionada === null) return;
    listaRef.current?.querySelector<HTMLElement>(`[data-row-index="${seleccionada}"]`)?.scrollIntoView({ block: "nearest" });
  }, [seleccionada]);
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!hayResultados || (e.key !== "ArrowDown" && e.key !== "ArrowUp")) return;
    e.preventDefault();
    const pos = seleccionada === null ? -1 : visibleIndices.indexOf(seleccionada);
    const sig = e.key === "ArrowDown" ? Math.min(pos + 1, visibleIndices.length - 1) : Math.max(pos - 1, 0);
    onSeleccionar(visibleIndices[sig]);
  }

  // ── Toolbar: "Período 08/2026 · Actualizado hh:mm".
  const [actualizado, setActualizado] = useState(() => new Date());
  useEffect(() => {
    setActualizado(new Date());
  }, [id, valores, periodo]);
  const desde = rangoDePeriodo(periodo)?.desdeFecha ?? "";
  const periodoMmAaaa = desde ? `${desde.slice(5, 7)}/${desde.slice(0, 4)}` : periodo;

  // Scroll horizontal: con contenido desplazado, la columna fija del código
  // muestra su borde derecho.
  const [desplazado, setDesplazado] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const registros = hayFiltros ? visibleIndices.length : CONFIG.totalRegistros;
  const paginas = Math.max(1, Math.ceil(registros / 25));

  return (
    <section aria-label="Interrupciones" className="flex-[52_1_0%] min-w-0 min-h-0 flex flex-col gap-3 px-(--page-px) pt-(--page-pt) pb-(--page-pt)">
      {/* Título de sección — estático, no es selector. */}
      <h2 className="shrink-0 flex items-center gap-2 min-w-0">
        <TablaChip nombre={CONFIG.nombre} />
        <span className="text-heading-sm text-neutral-900 truncate">{CONFIG.titulo}</span>
      </h2>

      <ChipFilterBar
        variant="compact"
        id={id}
        onIdChange={setId}
        idPlaceholder={columnas[0]?.label ?? "Código de interrupción"}
        visibles={visibles}
        agregables={agregables}
        valores={valores}
        onChange={(campo, v) => setValores((prev) => ({ ...prev, [campo]: v }))}
        onLimpiar={() => {
          setId("");
          setValores({});
        }}
        periodo={periodo}
      />

      <div className="flex-1 min-h-0 flex flex-col gap-2">
        {/* Toolbar de tabla: solo el contexto. */}
        <div className="shrink-0 h-(--control-sm) px-2 flex items-center min-w-0">
          <span className="text-caption text-neutral-600 tabular-nums whitespace-nowrap truncate">
            Período {periodoMmAaaa} · Actualizado {formatHora(actualizado)}
          </span>
        </div>

        {/* La tabla en su caja — mismo estilo que los ABM. */}
        <div className="shadow-sm flex-1 min-h-0 min-w-0 flex flex-col border border-border rounded-md bg-surface">
          <div
            ref={listaRef}
            tabIndex={0}
            aria-label="Interrupciones"
            onKeyDown={handleKeyDown}
            onScroll={(e) => setDesplazado(e.currentTarget.scrollLeft > 0)}
            className={`flex-1 min-h-0 overflow-auto rounded-t-md ${hayResultados ? "" : "rounded-b-md"} ${FOCUS_RING_INSET}`}
          >
            <table className="w-full border-separate" style={{ borderSpacing: 0 }}>
              <thead>
                <tr>
                  {columnas.map((c, ci) => (
                    <th
                      key={c.key}
                      className={`sticky top-0 bg-fill-subtle-solid w-[1%] whitespace-nowrap px-3 py-2 text-left border-b border-border ${
                        ci === 0 ? `left-0 border-r ${desplazado ? "border-r-border" : "border-r-transparent"}` : "z-(--z-sticky)"
                      }`}
                      style={ci === 0 ? { zIndex: "calc(var(--z-sticky) + 1)" } : undefined}
                    >
                      <SortableHeaderCell label={c.label} active={sortIdx === ci} dir={sortDir} onClick={() => toggleSort(ci)} hint={c.nombreReal} />
                    </th>
                  ))}
                  {/* Spacer: absorbe el sobrante; en la fila seleccionada
                      lleva el chevron que apunta al detalle. */}
                  <th className="sticky top-0 z-(--z-sticky) bg-fill-subtle-solid border-b border-border" />
                </tr>
              </thead>
              <tbody>
                {visibleIndices.map((i) => {
                  const row = rows[i];
                  const sel = seleccionada === i;
                  const fondo = sel ? "var(--color-primary-tint)" : hover === i ? "var(--color-fill-muted)" : undefined;
                  return (
                    <tr
                      key={i}
                      data-row-index={i}
                      aria-selected={sel}
                      onClick={() => onSeleccionar(i)}
                      onMouseEnter={() => setHover(i)}
                      onMouseLeave={() => setHover(null)}
                      className="cursor-pointer transition-colors duration-(--duration-fast)"
                      style={{ backgroundColor: fondo }}
                    >
                      {columnas.map((c, ci) => {
                        const esId = ci === 0;
                        return (
                          <td
                            key={c.key}
                            className={`w-[1%] whitespace-nowrap px-3 py-2.5 tabular-nums border-b border-border-subtle ${esId ? "text-code font-mono" : "text-body"} ${
                              sel ? `text-secondary ${esId ? "font-semibold" : "font-medium"}` : "text-text"
                            } ${
                              esId
                                ? `sticky left-0 z-(--z-sticky) border-r ${desplazado ? "border-r-border" : "border-r-transparent"} ${sel ? "shadow-[inset_3px_0_0_var(--color-secondary)]" : ""}`
                                : ""
                            }`}
                            // Celda fija: fondo opaco (la fila pasa por detrás).
                            style={
                              esId
                                ? {
                                    backgroundColor: sel ? "var(--color-primary-tint)" : "var(--color-surface)",
                                    backgroundImage: !sel && hover === i ? "linear-gradient(var(--color-fill-muted), var(--color-fill-muted))" : undefined,
                                  }
                                : undefined
                            }
                          >
                            {celda(row, c)}
                          </td>
                        );
                      })}
                      <td className="border-b border-border-subtle pr-3 text-right">
                        {sel && (
                          <svg aria-hidden width="6" height="10" viewBox="0 0 6 10" fill="none" className="inline-block align-middle">
                            <path d="M1 1l4 4-4 4" stroke="var(--color-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!hayResultados && (
              <div className="py-10 px-8 text-center">
                <p className="text-body-sm text-neutral-600">No hay interrupciones con estos filtros</p>
              </div>
            )}
          </div>

          {/* Paginación — al pie, dentro de la caja. */}
          {hayResultados && (
            <div className="px-3 py-2 border-t border-border bg-fill-subtle rounded-b-md shrink-0 flex items-center justify-between gap-2">
              <button className={`${BTN_SM} border border-border-strong bg-surface hover:bg-fill-muted disabled:opacity-40 transition-colors`} disabled>
                Anterior
              </button>
              <span className="text-body-sm text-text-muted tabular-nums whitespace-nowrap">
                Pág. <span className="font-medium text-text">1</span> de <span className="font-medium text-text">{formatNumero(paginas)}</span>
              </span>
              <button className={`${BTN_SM} border border-border-strong bg-surface hover:bg-fill-muted disabled:opacity-40 transition-colors`} disabled={paginas <= 1}>
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
