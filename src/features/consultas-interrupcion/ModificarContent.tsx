import { useEffect, useMemo, useState } from "react";
import { Inbox } from "lucide-react";
import {
  CopyButton,
  FilterTrigger,
  ICON,
  Modal,
  SortableTh,
  TableCounter,
  TableToolbar,
  UnderlineTabs,
  useTableToolbar,
} from "@/components/ui";
import { ABM_TABLE_CONFIGS } from "@/data/abmTables";
import { DRAWER_TAB_TO_ABM, DRAWER_TABS } from "@/data/dominio";
import {
  generarFasesSinteticas,
  generarFilasTabla5,
  generarFilasTabla6,
  generarFilasTabla8,
  generarFilasTabla9,
  generarReclamosSinteticos,
  generarTablasRelacionadas,
  RECORD,
  SAMPLE_ROWS,
} from "@/data/sinteticos";
import { AbmDeepLink } from "@/data/types";
import DatosInterrupcionModal from "@/features/consultas-interrupcion/DatosInterrupcionModal";
import FaseReposicionFicha from "@/features/consultas-interrupcion/FaseReposicionFicha";
import InterrupcionesMaestro from "@/features/consultas-interrupcion/InterrupcionesMaestro";
import InterrupcionHoja from "@/features/consultas-interrupcion/InterrupcionHoja";
import { parseFechaHora, VALOR_VACIO } from "@/lib/format";

// ─── Consultas de interrupción ─────────────────────────────────────────────
// Maestro-detalle sin cards (ver DESIGN_SYSTEM.md, Patrones →
// "Maestro-detalle"): debajo del TopBar (lo pone App, con el PeriodSelector
// controlado), un área de trabajo del alto disponible partida en dos
// columnas que scrollean por dentro — la página no scrollea en ningún tier:
//   izquierda (52%) → InterrupcionesMaestro: Tabla 2 con filtros compactos;
//   derecha (48%)   → InterrupcionHoja: la interrupción seleccionada, sus
//                     cifras, la línea de tiempo de reposiciones (Tabla 4)
//                     y el resumen de reclamos.
// El layout no se mueve al seleccionar. La selección vive acá: la
// interrupción (índice de SAMPLE_ROWS = fila de Tabla 2) y la fase de
// reposición (su nro). Al cambiar de interrupción se selecciona su primera
// fase. Los chips de Tablas relacionadas de la fase abren el modal de
// siempre ("Tablas relacionadas"), y "Ver detalle" de Reclamos abre "Datos de
// la interrupción".
export default function ModificarContent({
  periodo,
  onIrAAbm,
  initialRelTab = null,
  initialReferencia = null,
  initialReposicion = null,
}: {
  // Período del PeriodSelector del TopBar (controlado en App).
  periodo: string;
  onIrAAbm: (link: AbmDeepLink) => void;
  // Tab del modal "Tablas relacionadas" a reabrir al montar — lo usa el
  // botón "Volver" de AbmScreen para restaurar el contexto desde el que se
  // saltó a ABM.
  initialRelTab?: string | null;
  // Referencia (SAMPLE_ROWS) a re-seleccionar al montar — misma fuente que
  // initialRelTab, para volver exactamente a la interrupción que se estaba
  // mirando, no solo a la pantalla.
  initialReferencia?: string | null;
  // Número de reposición (.nro) a re-seleccionar al montar — misma fuente
  // que initialRelTab/initialReferencia.
  initialReposicion?: number | null;
}) {
  const initialRowIndex = initialReferencia ? SAMPLE_ROWS.findIndex((r) => r.referencia === initialReferencia) : -1;
  // Interrupción seleccionada (índice de SAMPLE_ROWS). El maestro la
  // mantiene siempre en una fila visible (auto-selección); null = sin
  // resultados.
  const [seleccionada, setSeleccionada] = useState<number | null>(initialRowIndex >= 0 ? initialRowIndex : null);
  const [relTab, setRelTab] = useState<string | null>(initialRelTab);
  const [datosInterrupcionOpen, setDatosInterrupcionOpen] = useState(false);
    const registro = seleccionada !== null ? SAMPLE_ROWS[seleccionada] : null;
  const activeTabData = DRAWER_TABS.find((t) => t.key === relTab);
  // Tabla ABM equivalente al tab activo del modal "Tablas relacionadas"
  // (solo CDS5/6/8/9) — si existe, las filas de la tabla y el estado vacío
  // ofrecen el deep-link hacia AbmScreen.
  const abmMapping = relTab ? DRAWER_TAB_TO_ABM[relTab] : undefined;
  // Interrupción que se está mirando — viaja en todo deep-link como
  // `referenciaOrigen` para que "Volver" restaure exactamente esta selección.
  const interrupcionActualRef = registro?.referencia ?? RECORD.referencia;

  // Reclamos de la interrupción (por interrupción, no por fase): su inicio
  // y fin también ubican las horas de las fases.
  const reclamos = useMemo(() => (registro ? generarReclamosSinteticos(registro.referencia, registro.fecha) : null), [registro]);
  // Fases de reposición (Tabla 4) de la interrupción, ordenadas por FEC.
  const fases = useMemo(() => {
    if (!registro || !reclamos) return [];
    const ms = (t: string) => parseFechaHora(t)?.getTime() ?? 0;
    return generarFasesSinteticas(registro.referencia, { inicio: reclamos.inicio, fin: reclamos.fin }).sort((a, b) => ms(a.horaRep) - ms(b.horaRep));
  }, [registro, reclamos]);

  // Fase seleccionada: { interrupción, nro }. Si no es de la interrupción
  // actual (se cambió de interrupción), vale la primera fase. Al montar
  // arranca en `initialReposicion` (viaja desde "Volver" de AbmScreen).
  const [faseSel, setFaseSel] = useState<{ referencia: string | null; nro: number | null }>({
    referencia: initialReferencia,
    nro: initialReposicion,
  });
  const nroFase =
    registro && faseSel.referencia === registro.referencia && fases.some((f) => f.nro === faseSel.nro) ? faseSel.nro : (fases[0]?.nro ?? null);
  const filaFaseSeleccionada = fases.find((f) => f.nro === nroFase);
  const indiceFase = filaFaseSeleccionada ? fases.indexOf(filaFaseSeleccionada) : 0;
  function seleccionarFase(nro: number) {
    setFaseSel({ referencia: registro?.referencia ?? null, nro });
  }

  // Valores de "Tablas relacionadas" para la fase seleccionada — semilla =
  // la interrupción + el número de esa fase: cada fase tiene sus propios
  // valores, siempre los mismos.
  const valoresRelacionadas = registro && filaFaseSeleccionada
    ? generarTablasRelacionadas(`${registro.referencia}#${filaFaseSeleccionada.nro}`)
    : null;

  // Filas de cada tab del modal "Tablas relacionadas" (5/6/8/9) —
  // generadas por reposición seleccionada (ver generarFilasTabla5/6/8/9),
  // cantidad exactamente igual al tile correspondiente en
  // valoresRelacionadas. Tabla 3 no pasa por acá (usa
  // valoresRelacionadas.tabla3 directo, ver JSX).
  const relTabRows: string[][] = (() => {
    if (!relTab || !registro || !filaFaseSeleccionada || !valoresRelacionadas) return [];
    const referencia = registro.referencia;
    const nroReposicion = filaFaseSeleccionada.nro;
    const seedBase = `${referencia}#${nroReposicion}`;
    switch (relTab) {
      case "tabla5": return generarFilasTabla5(seedBase, referencia, nroReposicion, Number(valoresRelacionadas.tabla5));
      case "tabla6": return generarFilasTabla6(seedBase, referencia, nroReposicion, Number(valoresRelacionadas.tabla6));
      case "tabla8": return generarFilasTabla8(seedBase, Number(valoresRelacionadas.tabla8));
      case "tabla9": return generarFilasTabla9(seedBase, referencia, nroReposicion, Number(valoresRelacionadas.tabla9));
      default: return [];
    }
  })();

  // Filtros por columna del toolbar (FilterTrigger): columna → valor, null
  // o ausente = sin filtro. Viven acá y no en useTableToolbar (compartido
  // con los ABM). Se resetean con la misma clave que el buscador.
  const relResetKey = `${relTab}#${registro?.referencia}#${nroFase}`;
  const [relFiltros, setRelFiltros] = useState<Record<string, string | null>>({});
  useEffect(() => {
    setRelFiltros({});
  }, [relResetKey]);
  const relFiltrables = activeTabData?.filtrables ?? [];
  const relColIdx = (col: string) => activeTabData?.cols.indexOf(col) ?? -1;
  // Filas que pasan todos los filtros activos (AND, igualdad exacta),
  // salvo el de `excepto` — para calcular las opciones de cada trigger
  // sobre los DEMÁS filtros.
  const relFiltrarFilas = (excepto?: string) =>
    relTabRows.filter((row) =>
      relFiltrables.every((col) => {
        const v = relFiltros[col];
        return col === excepto || v == null || row[relColIdx(col)] === v;
      })
    );
  const relFilteredRows = relFiltrarFilas();
  const relFiltrosActivos = relFiltrables.filter((col) => relFiltros[col] != null).length;
  const relOpcionesFiltro = (col: string) => {
    const ci = relColIdx(col);
    const conteo = new Map<string, number>();
    for (const row of relFiltrarFilas(col)) conteo.set(row[ci], (conteo.get(row[ci]) ?? 0) + 1);
    return [...conteo.entries()]
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => a.value.localeCompare(b.value, "es", { numeric: true }));
  };

  // Buscador con alcance explícito: las columnas de `cols` que NO son
  // filtrables (el buscador cubre identificadores, los triggers
  // categorías; no se superponen). Placeholder: el de DRAWER_TABS, o uno
  // armado con los nombres si son 1 o 2 columnas.
  const relSearchCols = (activeTabData?.cols ?? [])
    .map((col, ci) => (relFiltrables.includes(col) ? -1 : ci))
    .filter((ci) => ci >= 0);
  const relSearchNombres = relSearchCols.map((ci) => activeTabData!.cols[ci].toLowerCase());
  const relSearchPlaceholder =
    activeTabData?.searchPlaceholder ??
    (relSearchNombres.length <= 1
      ? `Buscar ${relSearchNombres[0] ?? ""}…`
      : `Buscar ${relSearchNombres.slice(0, -1).join(", ")} o ${relSearchNombres[relSearchNombres.length - 1]}…`);

  // Tabla del tab activo — se resetea al cambiar de tab O de reposición
  // seleccionada (el contenido de cada tab depende de ambas). Recibe las
  // filas YA filtradas: relVisibleIndices indexa relFilteredRows, no
  // relTabRows.
  const relGetCells = (row: string[]) => row;
  const { search: relSearch, setSearch: setRelSearch, sortIdx: relSortIdx, sortDir: relSortDir, toggleSort: relToggleSort, visibleIndices: relVisibleIndices } =
    useTableToolbar(relFilteredRows, relGetCells, relResetKey, relSearchCols);

  return (
    <div className="flex-1 min-h-0 flex overflow-hidden">
      <InterrupcionesMaestro periodo={periodo} seleccionada={seleccionada} onSeleccionar={setSeleccionada} />
      <InterrupcionHoja
        interrupcion={registro ? { referencia: registro.referencia, fecha: registro.fecha, nivel: registro.nivel, fase: registro.faseElectrica } : null}
        fases={fases}
        faseSeleccionada={nroFase}
        onSeleccionarFase={seleccionarFase}
        valoresRelacionadas={valoresRelacionadas}
        onAbrirTabla={setRelTab}
        reclamos={reclamos}
        onVerDetalle={() => setDatosInterrupcionOpen(true)}
      />

      <DatosInterrupcionModal
        open={datosInterrupcionOpen}
        onClose={() => setDatosInterrupcionOpen(false)}
        referencia={registro?.referencia ?? ""}
        fechaInicio={registro?.fecha ?? ""}
        fechaUltRepo={filaFaseSeleccionada?.horaRep ?? ""}
        reclamos={reclamos}
      />

      {/* ── MODAL "Tablas relacionadas" ─────────────────────────── */}
      {/* Alto FIJO (min(720px, 100vh−40px)): el modal no puede saltar de
          tamaño al cambiar de tab o de reposición. bodyPadding={false} +
          bodyOverflow="hidden": sin cards ni fondo gris — el contenido va
          de borde a borde del modal (mismo px-5 que el header), con un
          wrapper interno `h-full flex flex-col min-h-0` propio (tabs
          shrink-0, área de tabla flex-1 min-h-0 — la única zona con
          scroll). headerExtra agrega, debajo de título/cerrar: la línea
          de Interrupción + CopyButton, y — si hay una reposición
          seleccionada — la línea de metadatos de esa reposición
          (FaseReposicionFicha, separados por "·") + el paginador ‹ ›.
          Ninguna de estas props toca el header de los demás modales de la
          app (ninguno las pasa). El título va en heading-md, como en
          todos los modales. */}
      <Modal
        title="Tablas relacionadas"
        open={relTab !== null}
        onClose={() => setRelTab(null)}
        size="xl"
        bodyPadding={false}
        bodyOverflow="hidden"
        height="min(720px, calc(100vh - 40px))"
        headerExtra={
          // Solo la Interrupción: es la identidad del modal, no cambia
          // mientras está abierto (a diferencia de la reposición activa,
          // que ahora vive en el body — ver abajo). pb-3.5 fijo (ya no
          // condicional): sin una segunda línea debajo, el header siempre
          // cierra parejo.
          <div className="px-5 mt-0.5 pb-3.5 flex items-center gap-2">
            <span className="text-heading-xs uppercase text-text-muted">Interrupción</span>
            <span className="text-code font-mono tabular-nums text-text">
              {interrupcionActualRef}
            </span>
            <CopyButton value={interrupcionActualRef} label="interrupción" />
          </div>
        }
      >
        <div className="h-full flex flex-col min-h-0">
          {/* Reposición activa — primer elemento del body, en fondo
              blanco (el body no tiene bg propio, hereda el bg-surface del
              panel). Sin border-b propio: lo pone la barra de tabs de
              abajo. */}
          {filaFaseSeleccionada && (
            <FaseReposicionFicha
              fila={filaFaseSeleccionada}
              reposicionIndex={indiceFase}
              totalReposiciones={fases.length}
              onChangeReposicion={(i) => seleccionarFase(fases[i].nro)}
            />
          )}
          <UnderlineTabs
            ariaLabel="Tablas relacionadas"
            options={DRAWER_TABS.filter((tab) => tab.key !== "tabla4").map((tab) => ({ key: tab.key, label: tab.label }))}
            activeKey={relTab}
            onSelect={setRelTab}
          />

          {/* Descripción del tab activo, sola en su fila. Tabla 3 no
              repite descripción, el resultado (Sí/No existe) ya la dice. */}
          <div className="px-5 pt-3 pb-3 shrink-0">
            <p className="text-body-sm text-text-muted">
              {activeTabData && activeTabData.key !== "tabla3" ? activeTabData.subtitle : null}
            </p>
          </div>

          {/* Toolbar de la tabla (ver DESIGN_SYSTEM.md, "Patrones de
              contenedor y tabla"): FUERA del contenedor de la tabla, sin
              fondo ni líneas (px-5 pb-3, alineado con el resto del modal).
              Buscador (TableToolbar `bare`, solo columnas no filtrables) →
              divisor (el de PersistentActionsBar) → un FilterTrigger por
              columna filtrable del tab → a la derecha "Limpiar filtros"
              (clases del flyout "Más filtros", solo con ≥1 filtro activo) +
              contador. Tabla 3 no tiene toolbar. */}
          {relTabRows.length > 0 && (
            <div className="px-5 pb-3 shrink-0 flex items-center gap-2">
              <div className="w-64 shrink-0">
                <TableToolbar search={relSearch} onSearchChange={setRelSearch} searchPlaceholder={relSearchPlaceholder} hideExport bare />
              </div>
              {relFiltrables.length > 0 && (
                <>
                  <div className="w-px h-5 bg-border shrink-0" />
                  {relFiltrables.map((col) => (
                    <FilterTrigger
                      key={col}
                      label={col}
                      options={relOpcionesFiltro(col)}
                      value={relFiltros[col] ?? null}
                      onChange={(v) => setRelFiltros((prev) => ({ ...prev, [col]: v }))}
                    />
                  ))}
                </>
              )}
              <div className="ml-auto shrink-0 flex items-center gap-4">
                {relFiltrosActivos > 0 && (
                  <button
                    type="button"
                    onClick={() => setRelFiltros({})}
                    className="text-label text-secondary hover:underline"
                  >
                    Limpiar filtros
                  </button>
                )}
                <TableCounter visibles={relVisibleIndices.length} total={relTabRows.length} />
              </div>
            </div>
          )}

          {/* Área de la tabla — única zona con scroll del modal (los dos
              ejes). Tabla 3 y los estados vacíos viven ACÁ ADENTRO,
              centrados vertical y horizontalmente. Header de tabla sticky
              con fondo opaco (ver SortableTh) — la tabla pasa a
              border-separate y los separadores de fila se mueven de <tr>
              a <td>, porque bajo border-collapse un borde de fila se
              pinta en la capa de bordes de la tabla y puede quedar por
              encima del <th> sticky al scrollear (mismo criterio que
              usaba la tabla de Reposiciones). mx-5/mb-5 (antes mx-4/mb-4 dentro de
              la card, ya sin card) para alinear con el padding del resto
              del modal. */}
          <div className="flex-1 min-h-0 mx-5 mb-5 border border-border rounded-md overflow-auto">
            {activeTabData && (
              activeTabData.key === "tabla3" ? (() => {
                const existe = valoresRelacionadas?.tabla3 === "SI";
                return (
                  <div className="h-full min-h-[180px] flex items-center justify-center p-6">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: existe ? "var(--color-success-bg)" : "var(--color-error-bg)" }}
                      >
                        {existe ? (
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M4.5 10.5l3.5 3.5 7.5-7.5" stroke="var(--color-success)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M5.5 5.5l9 9M14.5 5.5l-9 9" stroke="var(--color-error)" strokeWidth="2.2" strokeLinecap="round" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="text-heading-sm" style={{ color: existe ? "var(--color-success-text-strong)" : "var(--color-error-text-strong)" }}>
                          {existe ? "Sí existe en Tabla 3" : "No existe en Tabla 3"}
                        </p>
                        <p className="text-body-sm text-text-muted">
                          {existe
                            ? "Esta reposición tiene registro en la tabla"
                            : "Esta reposición no tiene registro en la tabla"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })() : relTabRows.length === 0 ? (
                <div className="h-full min-h-[180px] flex items-center justify-center p-6">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <span className="text-text-faint"><Inbox size={ICON.xl} strokeWidth={1.25} /></span>
                    <p className="text-heading-sm text-text-muted">Sin registros</p>
                    <p className="text-body-sm text-text-muted">Sin registros para la reposición {filaFaseSeleccionada?.nro ?? VALOR_VACIO}</p>
                    {abmMapping && (
                      <button
                        type="button"
                        onClick={() =>
                          onIrAAbm({
                            tableKey: abmMapping.tableKey,
                            campo: abmMapping.campoCodigoInterrupcion,
                            columna: abmMapping.columnaCodigoInterrupcion,
                            valor: interrupcionActualRef,
                            modo: "alta",
                            relTabOrigen: relTab ?? undefined,
                            referenciaOrigen: interrupcionActualRef,
                            reposicionOrigen: filaFaseSeleccionada?.nro,
                          })
                        }
                        className="mt-1 text-label text-secondary hover:underline"
                      >
                        Ir a {ABM_TABLE_CONFIGS[abmMapping.tableKey].nombre} a insertar →
                      </button>
                    )}
                  </div>
                </div>
              ) : relFiltrosActivos > 0 && relVisibleIndices.length === 0 ? (
                /* Los filtros dejaron 0 filas — mismo empty state (Inbox)
                   que "Sin registros". */
                <div className="h-full min-h-[180px] flex items-center justify-center p-6">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <span className="text-text-faint"><Inbox size={ICON.xl} strokeWidth={1.25} /></span>
                    <p className="text-heading-sm text-text-muted">Sin resultados para los filtros aplicados</p>
                  </div>
                </div>
              ) : (
                <table className="w-full border-separate" style={{ borderSpacing: 0 }}>
                  <thead>
                    <tr>
                      {activeTabData.cols.map((col, ci) => (
                        <SortableTh
                          key={col}
                          label={col}
                          active={relSortIdx === ci}
                          dir={relSortDir}
                          onClick={() => relToggleSort(ci)}
                        />
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {relVisibleIndices.map((ri) => {
                      const row = relFilteredRows[ri];
                      // Cuando la tabla mapea a ABM y la primera columna es
                      // "Interrupción", esa celda es el valor más confiable
                      // para el deep-link; si no, se usa la interrupción
                      // actual como fallback. Con filas generadas (ver
                      // generarFilasTabla5/6/8/9) este valor no está
                      // garantizado a existir en ABM_TABLE_CONFIGS —
                      // soft-fail aceptado, ver comentario en DRAWER_TABS.
                      const valorDeepLink =
                        activeTabData.cols[0] === "Interrupción" ? row[0] : interrupcionActualRef;
                      const esUltima = ri === relVisibleIndices[relVisibleIndices.length - 1];
                      return (
                        <tr
                          key={ri}
                          onClick={
                            abmMapping
                              ? () =>
                                  onIrAAbm({
                                    tableKey: abmMapping.tableKey,
                                    campo: abmMapping.campoCodigoInterrupcion,
                                    columna: abmMapping.columnaCodigoInterrupcion,
                                    valor: valorDeepLink,
                                    modo: "buscar",
                                    relTabOrigen: relTab ?? undefined,
                                    referenciaOrigen: interrupcionActualRef,
                                    reposicionOrigen: filaFaseSeleccionada?.nro,
                                  })
                              : undefined
                          }
                          className={`transition-colors ${abmMapping ? "cursor-pointer hover:bg-primary-tint" : "hover:bg-fill-muted"}`}
                        >
                          {row.map((cell, ci) => (
                            <td
                              key={ci}
                              className={`px-4 py-3.5 text-body text-text whitespace-nowrap ${esUltima ? "" : "border-b border-border-subtle"}`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
