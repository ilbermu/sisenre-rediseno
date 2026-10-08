import { useState, useRef, useEffect, useMemo } from "react";
import { Plus } from "lucide-react";
import {
  BTN_MD,
  BTN_SM,
  ChipFilterBar,
  FOCUS_RING,
  FOCUS_RING_INSET,
  FormRow,
  ICON,
  ICON_BTN_SM,
  Modal,
  modalNeutralBtnCls,
  modalPrimaryBtnCls,
  rangoDePeriodo,
  READONLY_FIELD_CLS,
  SortableHeaderCell,
  useTableToolbar,
} from "@/components/ui";
import TopBar from "@/components/layout/TopBar";
import { columnasDeResultados, encabezadosInconsistentes } from "@/features/abm/columnasDeResultados";
import { ABM_TABLE_CONFIGS } from "@/data/abmTables";
import { PERIODS } from "@/data/dominio";
import { AbmDeepLink, AbmMode, AbmTableKey, CampoBusqueda } from "@/data/types";
import AbmCampo from "@/features/abm/AbmCampo";
import AbmTableSelector from "@/features/abm/AbmTableSelector";
import AbmToolbar from "@/features/abm/AbmToolbar";
import ConfirmarBorrarModal from "@/features/abm/ConfirmarBorrarModal";
import { filtrarFilas, FiltroFila } from "@/features/abm/filtrarFilas";
import { chipsDeConfig, filtrosFilaDeBarra } from "@/features/abm/filtrosDeConfig";
import RevisarCambiosContent, { ResumenValoresContent, useMotivoCambio } from "@/features/abm/RevisarCambiosContent";
import { labelDeValor } from "@/features/abm/labelDeValor";
import { descargarCsv } from "@/lib/csv";
import { formatHora, formatNumero } from "@/lib/format";

// Verificación de desarrollo: mismo nombre real = mismo encabezado en todas
// las tablas (salvo las excepciones declaradas). Si falla, lo reporta.
if (import.meta.env.DEV) {
  const problemas = encabezadosInconsistentes(ABM_TABLE_CONFIGS);
  if (problemas.length) console.error("[ABM] Encabezados de columna inconsistentes:\n" + problemas.join("\n"));
}

// Vuelca los datos de una fila de resultados en `valores` del formulario,
// según el mapeo columna→campo de la tabla (config.mapeoFilaACampos) — el
// modal de Modificar arranca con el dato REAL del registro. Los campos sin
// mapeo quedan sin tocar.
function mapearFilaAValores(mapeo: Record<string, string>, fila: Record<string, string>): Record<string, string> {
  const nuevos: Record<string, string> = {};
  for (const [columna, campoNombre] of Object.entries(mapeo)) {
    if (fila[columna] !== undefined) nuevos[campoNombre] = fila[columna];
  }
  return nuevos;
}

// Pantalla única de ABM (ver DESIGN_SYSTEM.md, Patrones → "ABM"): el mismo
// patrón para todas las tablas — TopBar, selector de tabla como título (+
// Insertar si la tabla lo permite), barra de filtros híbrida y la tabla en
// su caja, con una toolbar de tabla persistente entre ambas (contexto +
// Exportar / Auditoría, o el registro seleccionado + Modificar / Borrar);
// Modificar e Insertar en el modal de edición de registro. Todo el contenido
// (campos, tipos, opciones, dependencias, qué se bloquea) sale de
// ABM_TABLE_CONFIGS[tableKey]: nada de una tabla puntual vive acá.
// `onChangeTable` es el mismo setScreen de App — así el selector y el ítem
// activo del sidebar comparten el mismo estado sin duplicarlo.
export default function AbmScreen({
  tableKey,
  onChangeTable,
  deepLink,
  onDeepLinkConsumed,
  volverVisible,
  onVolver,
}: {
  tableKey: AbmTableKey;
  onChangeTable: (k: AbmTableKey) => void;
  // Deep-link pendiente desde afuera (ej. "Tablas relacionadas" de
  // Consultas de interrupción) — se aplica una vez y se descarta via
  // onDeepLinkConsumed.
  deepLink?: AbmDeepLink | null;
  onDeepLinkConsumed?: () => void;
  // Se llegó acá por un deep-link (no por navegación normal del sidebar) —
  // muestra el botón "←" (solo ícono) junto al selector de tabla.
  volverVisible?: boolean;
  onVolver?: () => void;
}) {
  const config = ABM_TABLE_CONFIGS[tableKey];
  // "buscar" = la pantalla; "modificar" / "alta" = el modal de edición
  // abierto en ese modo.
  const [mode, setMode] = useState<AbmMode>("buscar");
  // Selección: colección de ids de fila (índices de `rows`, que son su
  // identidad). Hoy la tabla selecciona de a una (clic en otra fila reemplaza
  // la selección); las reglas de selección múltiple ya están (ver
  // AbmToolbar y ConfirmarBorrarModal).
  const [seleccion, setSeleccion] = useState<number[]>([]);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  // Valores del formulario del modal (Modificar / Insertar).
  const [valores, setValores] = useState<Record<string, string>>({});
  // Foto del registro tal como estaba al entrar a Modificar — se compara
  // contra `valores` para saber qué campos cambiaron.
  const [valoresOriginales, setValoresOriginales] = useState<Record<string, string>>({});
  // Filas pendientes de confirmar el borrado; vacío = modal cerrado.
  const [filasABorrar, setFilasABorrar] = useState<number[]>([]);
  // Índices borrados en esta sesión — config.rows es mock estático, así
  // que "borrar" excluye la fila de Resultados (visibleIndices) sin tocar
  // los índices de las demás, que siguen siendo su identidad.
  const [filasBorradas, setFilasBorradas] = useState<Set<number>>(new Set());
  // Filas agregadas con Insertar en esta sesión (data local), por tabla:
  // van después de config.rows, así los índices existentes no cambian.
  const [filasAgregadas, setFilasAgregadas] = useState<Partial<Record<AbmTableKey, Record<string, string>[]>>>({});
  const rows = useMemo(() => [...config.rows, ...(filasAgregadas[tableKey] ?? [])], [config, filasAgregadas, tableKey]);
  const camposLocked = config.camposReadonlyEnModificar ?? [];
  // Barra de filtros (ChipFilterBar): estado propio, keyed por nombre de
  // campo — no comparte `valores` con el modal. Cada cambio filtra al
  // instante sobre todas las filas.
  const [idBarra, setIdBarra] = useState("");
  const [filtrosBarraValores, setFiltrosBarraValores] = useState<Record<string, string>>({});
  // Período del TopBar — lo usa el atajo "Período completo" del filtro de
  // fecha de la barra.
  const [periodo, setPeriodo] = useState(PERIODS[0]);
  // Modal de edición de registro: dos pasos — 1 Editar/Completar, 2 Revisar.
  // Nunca se abre otro modal encima: el paso 2 es el mismo modal.
  const [pasoModal, setPasoModal] = useState<1 | 2>(1);
  const motivoModificar = useMotivoCambio();
  const bodyModalRef = useRef<HTMLDivElement>(null);

  // Reset al cambiar de tabla — corre primero.
  useEffect(() => {
    setMode("buscar");
    setSeleccion([]);
    setValores({});
    setValoresOriginales({});
    setFilasBorradas(new Set());
    setIdBarra("");
    setFiltrosBarraValores({});
    setPasoModal(1);
  }, [tableKey]);

  const camposTabla = config.secciones.flatMap((s) => s.filas.flat());
  const campoDe = (nombre: string) => camposTabla.find((c) => c.nombre === nombre);

  // Aplica un deep-link pendiente para ESTA tabla — corre después del
  // reset de arriba, así su estado gana. "alta" abre Insertar con el campo
  // precargado; "buscar" pone el valor en el ID o en el chip de ese campo y
  // selecciona la fila (si existe).
  useEffect(() => {
    if (!deepLink || deepLink.tableKey !== tableKey) return;
    // Una tabla sin Insertar (Tabla 8) no abre el alta: el deep-link se
    // aplica como búsqueda.
    if (deepLink.modo === "alta" && config.hasInsertar) {
      setMode("alta");
      setSeleccion([]);
      setValores({ [deepLink.campo]: deepLink.valor });
      setPasoModal(1);
    } else {
      setMode("buscar");
      const filtros = [...config.filtrosBarra.visibles, ...config.filtrosBarra.agregables];
      if (deepLink.campo === config.campoId) setIdBarra(deepLink.valor);
      else if (filtros.some((f) => f.campo === deepLink.campo)) setFiltrosBarraValores({ [deepLink.campo]: deepLink.valor });
      const idx = rows.findIndex((r) => r[deepLink.columna] === deepLink.valor);
      setSeleccion(idx >= 0 ? [idx] : []);
    }
    onDeepLinkConsumed?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deepLink, tableKey]);

  function setValor(nombre: string, v: string) {
    // `limpiaAlCambiar` (config del campo que cambió) — el campo dependiente
    // de una cascada (Partido → Localidad en Tabla 8), para que no quede un
    // valor que ya no es una opción válida.
    setValores((prev) => {
      const next = { ...prev, [nombre]: v };
      for (const otro of campoDe(nombre)?.limpiaAlCambiar ?? []) next[otro] = "";
      return next;
    });
  }

  // ── Barra de filtros ────────────────────────────────────────────────────
  // Cada filtro de la config → ChipFiltroDef (chipsDeConfig): editor,
  // opciones y emptyMessage salen del campo, sin cambios.
  const { visibles: chipsVisibles, agregables: chipsAgregables } = useMemo(() => chipsDeConfig(config), [config]);
  function cambiarFiltro(campo: string, v: string) {
    // Misma dependencia que el formulario: al cambiar Partido se limpia
    // Localidad.
    setFiltrosBarraValores((prev) => {
      const next = { ...prev, [campo]: v };
      for (const otro of campoDe(campo)?.limpiaAlCambiar ?? []) next[otro] = "";
      return next;
    });
  }
  // Filtros de la barra → filtros por columna de `rows`: el ID por
  // "contiene"; cada chip según su editor.
  const filtrosFila: FiltroFila[] = filtrosFilaDeBarra(config, idBarra, filtrosBarraValores, [...chipsVisibles, ...chipsAgregables]);
  const hayFiltrosBarra = filtrosFila.some((f) => f.valor.trim() !== "");
  function handleLimpiarFiltrosBarra() {
    setIdBarra("");
    setFiltrosBarraValores({});
  }

  // ── Resultados ──────────────────────────────────────────────────────────
  const hasSelection = seleccion.length > 0;
  // Última fila seleccionada: ancla de la navegación por teclado y del scroll.
  const ultimaSel = seleccion.length > 0 ? seleccion[seleccion.length - 1] : null;
  // Columnas derivadas de la config (columnasDeResultados): los campos con
  // nombreReal, en el orden de la tabla real, con el campoId primero y fijo.
  // Una columna de toggle/select/combobox muestra la etiqueta de la opción
  // ("Interno") en vez del value ("I") — también para ordenar.
  const columnas = useMemo(() => columnasDeResultados(config), [config]);
  const celda = (row: Record<string, string>, c: (typeof columnas)[number]) =>
    labelDeValor(c.campo, row[c.key] ?? "", row);
  const columnKeys = columnas.map((c) => c.key);
  // Scroll horizontal dentro de la caja: con contenido desplazado a la
  // izquierda, la columna fija del ID muestra un borde que marca la
  // superposición (sin scroll, sin borde).
  const [desplazado, setDesplazado] = useState(false);
  const getCells = (row: Record<string, string>) => columnas.map((c) => celda(row, c));
  // Sin buscador propio (la barra de filtros es el único): useTableToolbar
  // aporta solo el orden por columna.
  const { sortIdx, sortDir, toggleSort, visibleIndices: visibleIndicesOrdenados } = useTableToolbar(rows, getCells, tableKey);
  // Excluye las filas borradas y las que no pasan los filtros de la barra,
  // sin renumerar: los índices siguen siendo los de `rows`.
  const indicesBuscados = hayFiltrosBarra ? new Set(filtrarFilas(rows, filtrosFila)) : null;
  const visibleIndices = visibleIndicesOrdenados.filter((i) => !filasBorradas.has(i) && (!indicesBuscados || indicesBuscados.has(i)));

  // Navegación por teclado en Resultados: flecha abajo/arriba mueve la
  // selección entre filas visibles.
  const resultadosListRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ultimaSel === null || !resultadosListRef.current) return;
    resultadosListRef.current
      .querySelector<HTMLElement>(`[data-row-index="${ultimaSel}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [ultimaSel]);

  // Toolbar de tabla (AbmToolbar, siempre presente): si al deseleccionar el
  // foco estaba en las acciones de registro, vuelve a la lista de Resultados —
  // esa capa pasa a inert y el foco se perdería.
  const accionesRegistroRef = useRef<HTMLDivElement>(null);
  // "Actualizado hh:mm": la última vez que se resolvieron los resultados
  // (cada aplicación de filtros o cambio de período/tabla).
  const [actualizado, setActualizado] = useState(() => new Date());
  useEffect(() => {
    setActualizado(new Date());
  }, [idBarra, filtrosBarraValores, periodo, tableKey]);
  function deseleccionar() {
    if (accionesRegistroRef.current?.contains(document.activeElement)) resultadosListRef.current?.focus();
    setSeleccion([]);
  }

  // Escape con una fila seleccionada la deselecciona (las acciones de
  // registro viven en la barra de selección, solo con selección). No actúa
  // con un modal abierto.
  useEffect(() => {
    if (!hasSelection || mode !== "buscar" || filasABorrar.length > 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") deseleccionar();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSelection, mode, filasABorrar]);

  // Exportar: CSV de las filas que se ven con los filtros actuales, con los
  // encabezados de columna en el orden de la tabla. Archivo:
  // <exportFilename>_<aaaamm>.csv (período del TopBar).
  function handleExportar() {
    const desde = rangoDePeriodo(periodo)?.desdeFecha ?? "";
    const aaaamm = desde ? desde.slice(0, 4) + desde.slice(5, 7) : "";
    descargarCsv(
      aaaamm ? `${config.exportFilename}_${aaaamm}` : config.exportFilename,
      columnas.map((c) => c.label),
      visibleIndices.map((i) => getCells(rows[i])),
    );
  }
  // Auditoría: acción de la tabla (no de un registro). Como en el ABM
  // original, el botón todavía no abre nada.
  function handleAuditoria() {
    // TODO: sin definir qué abre (el original no tenía handler); ver PROGRESO.md.
  }

  function handleResultadosKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (mode !== "buscar" || visibleIndices.length === 0) return;
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    if (ultimaSel === null) {
      setSeleccion([e.key === "ArrowDown" ? visibleIndices[0] : visibleIndices[visibleIndices.length - 1]]);
      return;
    }
    const currentPos = visibleIndices.indexOf(ultimaSel);
    const nextPos =
      e.key === "ArrowDown"
        ? Math.min(currentPos + 1, visibleIndices.length - 1)
        : Math.max(currentPos - 1, 0);
    setSeleccion([visibleIndices[Math.max(nextPos, 0)]]);
  }

  // Si un cambio de filtro deja afuera a registros seleccionados, se
  // deseleccionan. (La paginación es fija: siempre página 1.)
  useEffect(() => {
    if (indicesBuscados && seleccion.some((i) => !indicesBuscados.has(i))) {
      setSeleccion((prev) => prev.filter((i) => indicesBuscados.has(i)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idBarra, filtrosBarraValores]);

  // ── Modal de edición: Modificar / Insertar ──────────────────────────────
  const esAlta = mode === "alta";
  function abrirModal(m: "modificar" | "alta", iniciales: Record<string, string>) {
    setMode(m);
    setValores(iniciales);
    setValoresOriginales(iniciales);
    setPasoModal(1);
    motivoModificar.reset();
  }
  function handleAbrirModificar(i: number) {
    setSeleccion([i]);
    abrirModal("modificar", mapearFilaAValores(config.mapeoFilaACampos, rows[i]));
  }
  function handleAbrirAlta() {
    abrirModal("alta", {});
  }
  function cerrarModal() {
    setMode("buscar");
    setValores({});
    setValoresOriginales({});
    setPasoModal(1);
  }
  function handleCancelarModificar() {
    // Cancelar Modificar deselecciona; cancelar Insertar deja la selección
    // como estaba.
    if (!esAlta) setSeleccion([]);
    cerrarModal();
  }
  function handleConfirmarModificar() {
    // TODO: config.rows es mock derivado de la config, no estado real —
    // todavía no hay dónde persistir el cambio ni la nota (mismo caso que
    // Borrar). Por ahora cierra el flujo.
    setSeleccion([]);
    cerrarModal();
  }
  function handleConfirmarAlta() {
    // La fila nueva (columnas de `rows` según mapeoFilaACampos) se agrega a
    // la data local y queda seleccionada. Si los filtros activos la dejarían
    // afuera, se limpian para que se vea.
    const fila: Record<string, string> = {};
    for (const [columna, campo] of Object.entries(config.mapeoFilaACampos)) fila[columna] = valores[campo] ?? "";
    const indice = rows.length;
    setFilasAgregadas((prev) => ({ ...prev, [tableKey]: [...(prev[tableKey] ?? []), fila] }));
    if (hayFiltrosBarra && filtrarFilas([fila], filtrosFila).length === 0) handleLimpiarFiltrosBarra();
    setSeleccion([indice]);
    cerrarModal();
  }
  // Al pasar de paso, el foco va al primer elemento interactivo del body
  // nuevo (no en la apertura: ahí el foco lo maneja Modal).
  const pasoPrevioRef = useRef(pasoModal);
  useEffect(() => {
    if (pasoPrevioRef.current === pasoModal) return;
    pasoPrevioRef.current = pasoModal;
    bodyModalRef.current
      ?.querySelector<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')
      ?.focus();
  }, [pasoModal]);

  function handleAbrirBorrar(filas: number[]) {
    setFilasABorrar(filas);
  }
  function handleCancelarBorrar() {
    setFilasABorrar([]);
  }
  function handleConfirmarBorrar() {
    setFilasBorradas((prev) => new Set([...prev, ...filasABorrar]));
    setSeleccion((prev) => prev.filter((i) => !filasABorrar.includes(i)));
    setFilasABorrar([]);
  }

  // Campos que cambiaron respecto a `valoresOriginales` (Modificar) — value →
  // label legible vía labelDeValor. Excluye "readonly" (nunca cambian).
  const camposModificados = camposTabla
    .filter((c) => c.tipo !== "readonly" && (valores[c.nombre] ?? "") !== (valoresOriginales[c.nombre] ?? ""))
    .map((c) => ({
      label: c.label,
      anterior: labelDeValor(c, valoresOriginales[c.nombre] ?? "", valoresOriginales),
      nuevo: labelDeValor(c, valores[c.nombre] ?? "", valores),
    }));
  // Insertar, paso Revisar: todos los campos en orden, con su valor.
  const resumenAlta = camposTabla.map((c) => ({ label: c.label, valor: labelDeValor(c, valores[c.nombre] ?? "", valores) }));
  const hayValoresAlta = camposTabla.some((c) => (valores[c.nombre] ?? "").trim() !== "");

  // Bloqueado en Modificar: camposReadonlyEnModificar + tipo "readonly"
  // (config de cada tabla). En Insertar no se bloquea nada (lo que hace
  // AbmCampo en modo "alta").
  const esNoEditable = (c: CampoBusqueda) => c.tipo === "readonly" || camposLocked.includes(c.nombre);

  // ── Resultados: la caja de la tabla ─────────────────────────────────────
  // Debajo de la barra de filtros (gap-3), la tabla en su caja (borde, radio
  // md, surface, shadow-sm; thead fill-subtle-solid sticky; paginación al
  // pie con fill-subtle). Sin overflow-hidden en la caja: el radio lo
  // resuelven el wrapper con scroll (rounded-t-md) y el pie (rounded-b-md).
  // Sin contador. Sin filas, el thead sigue y el estado vacío va debajo,
  // dentro de la caja. El thead está siempre visible, también con una fila
  // seleccionada. Sin columna de acciones por fila.
  const hayResultados = visibleIndices.length > 0;
  // "08/2026" — el período controlado del TopBar.
  const desdePeriodo = rangoDePeriodo(periodo)?.desdeFecha ?? "";
  const periodoMmAaaa = desdePeriodo ? `${desdePeriodo.slice(5, 7)}/${desdePeriodo.slice(0, 4)}` : periodo;
  // Con algún filtro aplicado, el pie cuenta las filas encontradas; sin
  // filtros, el total de la tabla.
  const registrosEncontrados = hayFiltrosBarra ? visibleIndices.length : config.totalRegistros;
  const paginas = Math.max(1, Math.ceil(registrosEncontrados / 25));
  const resultados = (
    <div className="shadow-sm flex-1 min-h-0 min-w-0 flex flex-col border border-border rounded-md bg-surface">
      <div
        ref={resultadosListRef}
        tabIndex={0}
        onKeyDown={handleResultadosKeyDown}
        onScroll={(e) => setDesplazado(e.currentTarget.scrollLeft > 0)}
        className={`flex-1 min-h-0 overflow-auto rounded-t-md ${hayResultados ? "" : "rounded-b-md"} ${FOCUS_RING_INSET}`}
      >
        {/* border-separate (spacing 0): bajo border-collapse los bordes de
            una celda sticky quedan en la capa de la tabla y se pintan
            encima o debajo mal al scrollear. Celdas y encabezados en
            nowrap: ningún valor se trunca; si no entran, scroll horizontal
            adentro de la caja (la paginación queda fuera). */}
        <table className="w-full border-separate" style={{ borderSpacing: 0 }}>
          <thead>
            <tr>
              {columnas.map((c, ci) => (
                <th
                  key={c.key}
                  className={`sticky top-0 bg-fill-subtle-solid w-[1%] whitespace-nowrap px-4 py-2 text-left border-b border-border ${
                    ci === 0 ? `left-0 border-r ${desplazado ? "border-r-border" : "border-r-transparent"}` : "z-(--z-sticky)"
                  }`}
                  // Esquina (ID fijo + encabezado fijo): sobre las demás
                  // celdas sticky.
                  style={ci === 0 ? { zIndex: "calc(var(--z-sticky) + 1)" } : undefined}
                >
                  <SortableHeaderCell
                    label={c.label}
                    active={sortIdx === ci}
                    dir={sortDir}
                    onClick={() => toggleSort(ci)}
                    hint={c.nombreReal}
                  />
                </th>
              ))}
              {/* Spacer — absorbe el sobrante de la fila. */}
              <th className="sticky top-0 z-(--z-sticky) bg-fill-subtle-solid border-b border-border" />
            </tr>
          </thead>
          <tbody>
            {visibleIndices.map((i) => {
              const row = rows[i];
              const isSelected = seleccion.includes(i);
              const isHovered = hoveredRow === i;
              const fondoFila = isSelected ? "var(--color-primary-tint)" : isHovered ? "var(--color-fill-muted)" : undefined;
              return (
                <tr
                  key={i}
                  data-row-index={i}
                  onClick={() => setSeleccion(isSelected && seleccion.length === 1 ? [] : [i])}
                  onMouseEnter={() => setHoveredRow(i)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className="cursor-pointer transition-colors duration-(--duration-fast)"
                  style={{ backgroundColor: fondoFila }}
                >
                  {columnas.map((c, ci) => {
                    // Mono SOLO en el valor del identificador del
                    // registro (la columna del campoId); el resto, fuente
                    // de texto. Todas con tabular-nums: las cifras
                    // (números, fechas, horas) alinean en columna.
                    const esId = c.campo.nombre === config.campoId;
                    return (
                      <td
                        key={c.key}
                        className={`w-[1%] whitespace-nowrap px-4 py-2.5 tabular-nums border-b border-border-subtle ${
                          esId ? "text-code font-mono" : "text-body"
                        } ${isSelected ? `text-secondary ${esId ? "font-semibold" : "font-medium"}` : "text-text"} ${
                          ci === 0
                            ? `sticky left-0 z-(--z-sticky) border-r ${desplazado ? "border-r-border" : "border-r-transparent"} ${isSelected ? "inset-shadow-row-selected" : ""}`
                            : ""
                        }`}
                        // La celda fija necesita fondo OPACO (la fila
                        // pasa por detrás al scrollear): surface + el
                        // color de hover o selección encima (fill-muted
                        // es translúcido).
                        style={
                          ci === 0
                            ? {
                                backgroundColor: isSelected ? "var(--color-primary-tint)" : "var(--color-surface)",
                                backgroundImage: !isSelected && isHovered ? "linear-gradient(var(--color-fill-muted), var(--color-fill-muted))" : undefined,
                              }
                            : undefined
                        }
                      >
                        {celda(row, c)}
                      </td>
                    );
                  })}
                  <td className="border-b border-border-subtle" />
                </tr>
              );
            })}
          </tbody>
        </table>
        {!hayResultados && (
          // Los filtros no dejan filas — "Limpiar filtros" hace lo mismo que
          // el de la barra.
          <div className="py-10 flex flex-col items-center gap-2 text-center px-8">
            <p className="text-body-sm text-neutral-600">No hay registros con estos filtros</p>
            <button type="button" onClick={handleLimpiarFiltrosBarra} className={`text-label text-secondary hover:underline ${FOCUS_RING}`}>
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Paginación — al pie, dentro de la caja. */}
      {hayResultados && (
        <div className="px-4 py-2 border-t border-border bg-fill-subtle rounded-b-md shrink-0 flex items-center justify-between">
          <span className="text-body-sm text-text tabular-nums">
            Registros encontrados:{" "}
            <span className="font-semibold text-secondary">
              {formatNumero(registrosEncontrados)}
            </span>
          </span>
          <div className="flex items-center gap-2 text-body-sm text-text-muted tabular-nums">
            <button className={`${BTN_SM} border border-border-strong bg-surface hover:bg-fill-muted disabled:opacity-40 transition-colors`} disabled>
              Anterior
            </button>
            <span>
              Pág. <span className="font-medium text-text">1</span> de{" "}
              <span className="font-medium text-text">{formatNumero(paginas)}</span>
            </span>
            <button
              className={`${BTN_SM} border border-border-strong bg-surface hover:bg-fill-muted disabled:opacity-40 transition-colors`}
              disabled={paginas <= 1}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Identificador del registro en el modal: el campoId, con copiar si está
  // bloqueado (el label de la copia es el de la primera columna).
  const tituloModal = esAlta ? `Insertar en ${config.nombre}` : (config.tituloModificar ?? `Modificar en ${config.nombre}`);

  return (
    <>
      {/* TopBar común a todas las pantallas: título de la sección del menú
          + PeriodSelector (controlado: el período vive acá y también lo usa
          el atajo "Período completo" de ChipFilterBar). */}
      <TopBar title="Alta, baja y modificación" periodo={periodo} onPeriodoChange={setPeriodo} />

      {/* Content — mismo padding y gap de página que Consultas de
          interrupción. Primero el selector de tabla, que hace de título de
          la vista (no hay otro título de tabla), con Insertar a la derecha
          si la tabla lo permite; el "←" a su izquierda solo cuando se llegó
          por un deep-link. */}
      <div className="flex-1 min-h-0 flex flex-col gap-(--page-gap) px-(--page-px) pt-(--page-pt) pb-(--page-pt) relative overflow-hidden">
        <div className="shrink-0 flex items-center gap-2 min-w-0">
          {volverVisible && (
            <button
              type="button"
              onClick={onVolver}
              title="Volver a Consultas de interrupción"
              aria-label="Volver a Consultas de interrupción"
              className={`flex items-center justify-center ${ICON_BTN_SM} rounded-sm text-icon hover:text-secondary hover:bg-fill-muted transition-colors shrink-0 ${FOCUS_RING}`}
            >
              ←
            </button>
          )}
          <AbmTableSelector value={tableKey} onChange={onChangeTable} />
          {config.hasInsertar && (
            <button
              type="button"
              onClick={handleAbrirAlta}
              className={`${BTN_MD} ml-auto shrink-0 inline-flex items-center gap-1.5 text-white bg-primary-strong hover:bg-primary-hover transition-[color,background-color,border-color,transform] duration-(--duration-base) active:scale-[0.99] ${FOCUS_RING}`}
            >
              <Plus size={ICON.sm} strokeWidth={1.5} />
              Insertar
            </button>
          )}
        </div>
        {/* Filtros → gap-3 → toolbar → gap-2 → tabla (--page-gap solo separa
            el header de página de este bloque). */}
        <div className="flex-1 min-h-0 flex flex-col gap-3">
          <ChipFilterBar
            id={idBarra}
            onIdChange={setIdBarra}
            idPlaceholder={columnas[0]?.label ?? campoDe(config.campoId)?.label ?? config.campoId}
            visibles={chipsVisibles}
            agregables={chipsAgregables}
            valores={filtrosBarraValores}
            onChange={cambiarFiltro}
            onLimpiar={handleLimpiarFiltrosBarra}
            periodo={periodo}
          />
          <div className="flex-1 min-h-0 flex flex-col gap-2">
            {/* Toolbar de tabla — SIEMPRE presente (ver AbmToolbar): la tabla no
                se mueve al seleccionar ni al deseleccionar. */}
            <AbmToolbar
              contexto={`Período ${periodoMmAaaa} · Actualizado ${formatHora(actualizado)}`}
              hayResultados={hayResultados}
              codigos={seleccion.map((i) => rows[i]?.[columnKeys[0]] ?? "")}
              onExportar={handleExportar}
              onAuditoria={handleAuditoria}
              onModificar={() => handleAbrirModificar(ultimaSel ?? 0)}
              onBorrar={() => handleAbrirBorrar(seleccion)}
              onDeseleccionar={deseleccionar}
              registroRef={accionesRegistroRef}
            />
            {resultados}
          </div>
        </div>
      </div>

      {/* Modal de edición de registro (ver DESIGN_SYSTEM.md, "Modal de
          edición de registro"), el mismo para Modificar e Insertar:
            - size "form" (--modal-form-w), igual en los dos pasos; header
              de una línea: título + "Paso N de 2" + ✕;
            - paso 1 (Editar / Completar): formulario horizontal en filas —
              un campo por FormRow, todos los de la tabla en su orden, sin
              títulos de sección. Cada control con el tipo de su config
              (AbmCampo). En Modificar, lo bloqueado (camposReadonlyEnModificar
              + tipo "readonly") en solo lectura con candado; el campoId
              bloqueado con copiar;
            - paso 2: Modificar → Resumen de cambios + Motivo (Guardar solo
              con motivo); Insertar → resumen de valores, sin diff ni Motivo;
            - Escape, ✕ y Cancelar cierran todo el flujo sin guardar. */}
      <Modal
        title={tituloModal}
        size="form"
        open={mode !== "buscar"}
        onClose={handleCancelarModificar}
        paso={{ actual: pasoModal, total: 2 }}
        footer={
          pasoModal === 1 ? (
            <>
              <button type="button" onClick={handleCancelarModificar} className={modalNeutralBtnCls}>Cancelar</button>
              <button
                type="button"
                onClick={() => setPasoModal(2)}
                disabled={esAlta ? !hayValoresAlta : camposModificados.length === 0}
                className={modalPrimaryBtnCls}
              >
                {esAlta ? "Revisar" : "Revisar cambios"}
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => setPasoModal(1)} className={modalNeutralBtnCls}>Volver</button>
              {esAlta ? (
                <button type="button" onClick={handleConfirmarAlta} className={modalPrimaryBtnCls}>Insertar</button>
              ) : (
                <button type="button" onClick={handleConfirmarModificar} disabled={!motivoModificar.notaFinal} className={modalPrimaryBtnCls}>Guardar</button>
              )}
            </>
          )
        }
      >
        <div ref={bodyModalRef}>
          {pasoModal === 1 ? (
            <div>
              {camposTabla.map((c) => {
                const controlId = `modal-abm-${c.nombre}`;
                const labelId = `${controlId}-label`;
                const bloqueado = !esAlta && esNoEditable(c);
                if (bloqueado && c.nombre === config.campoId && c.tipo !== "toggle") {
                  // Identificador bloqueado: solo lectura (seleccionable, con
                  // candado en la fila), en mono. No se edita, así que nunca
                  // entra en "Revisar cambios".
                  const id = valores[c.nombre] ?? "";
                  return (
                    <FormRow key={c.nombre} label={c.label} labelId={labelId} htmlFor={controlId} readOnly>
                      <input id={controlId} readOnly value={id} className={`${READONLY_FIELD_CLS} text-code! font-mono tabular-nums`} />
                    </FormRow>
                  );
                }
                // Toggles a su ancho (igual ancho por opción); con
                // expandirBotones, al menos el ancho de la columna de
                // controles.
                const esToggle = c.tipo === "toggle";
                const expandir = esToggle && !!c.expandirBotones && !bloqueado;
                const control = (
                  <AbmCampo
                    campo={c}
                    mode={mode}
                    value={valores[c.nombre]}
                    onChange={(v) => setValor(c.nombre, v)}
                    lockedEnModificar={bloqueado}
                    valoresFormulario={valores}
                    readOnly={bloqueado}
                    intrinseco={!expandir}
                    labelExterno={{ controlId, labelId }}
                  />
                );
                return (
                  <FormRow
                    key={c.nombre}
                    label={c.label}
                    labelId={labelId}
                    htmlFor={controlId}
                    readOnly={bloqueado}
                    anchoControl={esToggle ? "intrinseco" : "fijo"}
                  >
                    {expandir ? <div className="min-w-(--form-control-w)">{control}</div> : control}
                  </FormRow>
                );
              })}
            </div>
          ) : esAlta ? (
            <ResumenValoresContent valores={resumenAlta} />
          ) : (
            <RevisarCambiosContent cambios={camposModificados} motivo={motivoModificar} />
          )}
        </div>
      </Modal>

      <ConfirmarBorrarModal
        open={filasABorrar.length > 0}
        registros={filasABorrar.map((i) => rows[i]?.[columnKeys[0]] ?? "")}
        tabla={config.nombre}
        onCancelar={handleCancelarBorrar}
        onConfirmar={handleConfirmarBorrar}
      />
    </>
  );
}
