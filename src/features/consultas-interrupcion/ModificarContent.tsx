import { useState, useRef, useEffect, useMemo } from "react";
import { X, Filter, Inbox } from "lucide-react";
import {
  BTN_MD,
  BTN_SEG_MD,
  BTN_SM,
  ButtonSelectGroup,
  CardHeader,
  CopyButton,
  DateTimeField,
  FieldLabel,
  FilterTrigger,
  FOCUS_RING_INSET,
  ICON,
  ICON_BTN_XS,
  MOD_FIELD_CLS,
  Modal,
  parseDateTimeStr,
  RangoFecha,
  SortableHeaderCell,
  SortableTh,
  TableCounter,
  TableToolbar,
  UnderlineTabs,
  useTableToolbar,
  ValuePicker,
} from "@/components/ui";
import { ABM_TABLE_CONFIGS } from "@/data/abmTables";
import { DRAWER_TAB_TO_ABM, DRAWER_TABS, STATUS_ITEMS } from "@/data/dominio";
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
import { AbmDeepLink, FaseReposicion } from "@/data/types";
import DatosInterrupcionModal from "@/features/consultas-interrupcion/DatosInterrupcionModal";
import FaseReposicionFicha from "@/features/consultas-interrupcion/FaseReposicionFicha";
import ReclamosResumenCompacto from "@/features/consultas-interrupcion/ReclamosResumenCompacto";
import RelacionadaChip from "@/features/consultas-interrupcion/RelacionadaChip";
import ReposicionesLista from "@/features/consultas-interrupcion/ReposicionesLista";
import AltaClientesModal from "@/features/consultas-interrupcion/herramientas/AltaClientesModal";
import CambiaFasesModal from "@/features/consultas-interrupcion/herramientas/CambiaFasesModal";
import DesarmeModal from "@/features/consultas-interrupcion/herramientas/DesarmeModal";
import IntercambioModal from "@/features/consultas-interrupcion/herramientas/IntercambioModal";
import NivelTipoModal from "@/features/consultas-interrupcion/herramientas/NivelTipoModal";
import ReplicarModal from "@/features/consultas-interrupcion/herramientas/ReplicarModal";
import { VALOR_VACIO } from "@/lib/format";

// ─── Modificar content ────────────────────────────────────────────────────────

// "dd/mm/aaaa hh:mm" → Date, sobre parseDateTimeStr (null si no parsea).
function fechaHoraDeStr(v: string): Date | null {
  const { date, time } = parseDateTimeStr(v);
  if (!date) return null;
  const [hh, mm] = time.split(":").map(Number);
  const d = new Date(date);
  d.setHours(hh || 0, mm || 0, 0, 0);
  return d;
}

// Rango inclusivo; se permite un solo extremo. Sin rango, todo pasa.
function fechaEnRango(d: Date | null, r: RangoFecha | null): boolean {
  if (!r) return true;
  if (!d) return false;
  if (r.desde && d < r.desde) return false;
  if (r.hasta && d > r.hasta) return false;
  return true;
}

// Campos del flyout "Más filtros" de la Card A. Cada uno se puede aplicar,
// mostrar como chip removible debajo de la filter bar, y contar para el
// badge del botón "Más filtros".
type FlyoutFilters = {
  fecha: string;
  codigoEquipo: string;
  descEquipo: string;
  cadenaElectrica: string;
  alimentadorMT: string;
  centroTransf: string;
  divisionRed: string;
};

const EMPTY_FLYOUT_FILTERS: FlyoutFilters = {
  fecha: "", codigoEquipo: "", descEquipo: "", cadenaElectrica: "", alimentadorMT: "", centroTransf: "", divisionRed: "",
};

const FLYOUT_FIELDS: { key: keyof FlyoutFilters; label: string; placeholder: string }[] = [
  { key: "cadenaElectrica", label: "Cadena eléctrica", placeholder: "NCBT" },
  { key: "alimentadorMT", label: "Alimentador MT", placeholder: "NCBT" },
  { key: "centroTransf", label: "Centro de transformación", placeholder: "52705#B1#52705-TR1#1#3" },
  { key: "codigoEquipo", label: "Código equipo", placeholder: "@27947890" },
  { key: "descEquipo", label: "Descripción equipo operado", placeholder: "PROTECCION DE SUMINISTRO" },
  { key: "divisionRed", label: "División red normal", placeholder: "S" },
];

export default function ModificarContent({
  onIrAAbm,
  initialRelTab = null,
  initialReferencia = null,
  initialReposicion = null,
}: {
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
  // que initialRelTab/initialReferencia, para que "Volver" restaure
  // exactamente la reposición que se estaba mirando, no siempre la
  // primera. Se resuelve una sola vez, en el useState inicial de
  // modSelectedFase más abajo — el efecto que resetea esa selección al
  // cambiar de interrupción se salta su primera corrida para no pisarlo.
  initialReposicion?: number | null;
}) {
  const initialRowIndex = initialReferencia ? SAMPLE_ROWS.findIndex((r) => r.referencia === initialReferencia) : -1;
  const [modShowData, setModShowData] = useState(initialRowIndex >= 0);
  const [modSelectedRow, setModSelectedRow] = useState<number | null>(initialRowIndex >= 0 ? initialRowIndex : null);
  const [relTab, setRelTab] = useState<string | null>(initialRelTab);
  const [origenSel, setOrigenSel] = useState<string | null>(null);
  const [tipoSel, setTipoSel] = useState<string | null>(null);
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const [flyoutFilters, setFlyoutFilters] = useState<FlyoutFilters>(EMPTY_FLYOUT_FILTERS);
  // Campos de la barra principal de Búsqueda que antes quedaban sin
  // controlar — ahora necesitan estado propio para poder autocompletarse
  // con los datos de la interrupción seleccionada en la tabla de abajo.
  const [nivelSel, setNivelSel] = useState("");
  const [codigoBusqueda, setCodigoBusqueda] = useState("");
  const [faseSel, setFaseSel] = useState("");
  const [desarmeOpen, setDesarmeOpen] = useState(false);
  const [nivelTipoOpen, setNivelTipoOpen] = useState(false);
  const [replicarOpen, setReplicarOpen] = useState(false);
  const [cambiaFasesOpen, setCambiaFasesOpen] = useState(false);
  const [altaClientesOpen, setAltaClientesOpen] = useState(false);
  const [intercambioOpen, setIntercambioOpen] = useState(false);
  const [datosInterrupcionOpen, setDatosInterrupcionOpen] = useState(false);
  const hasSelection = modSelectedRow !== null;
  const activeTabData = DRAWER_TABS.find(t => t.key === relTab);
  const selectedRecord = modSelectedRow !== null ? SAMPLE_ROWS[modSelectedRow] : null;
  // Tabla ABM equivalente al tab activo del modal "Tablas relacionadas"
  // (solo CDS5/6/8/9) — si existe, las filas de la tabla y el estado vacío
  // ofrecen el deep-link hacia AbmScreen.
  const abmMapping = relTab ? DRAWER_TAB_TO_ABM[relTab] : undefined;
  // Interrupción (SAMPLE_ROWS) que se está mirando ahora mismo — viaja en
  // todo deep-link como `referenciaOrigen` para que "Volver" restaure
  // exactamente esta selección.
  const interrupcionActualRef = selectedRecord?.referencia ?? RECORD.referencia;

  // Autocompleta el formulario de Búsqueda con los datos de la interrupción
  // seleccionada en la tabla — solo para mostrar contexto, nunca dispara
  // una búsqueda ni toca modShowData/resultados. A diferencia de ABM, acá
  // no hay modo Modificar propio: mientras haya una fila seleccionada el
  // formulario entero queda fijo en placeholder/no editable (ver
  // `disabled={hasSelection}` en cada campo más abajo) — no editable "por
  // si el usuario quiere ajustar y volver a buscar", nomás de consulta.
  // Cubre selección por click, por teclado (flechas) y la restauración
  // inicial al volver desde ABM, ya que todas pasan por modSelectedRow. Al
  // deseleccionar, el formulario vuelve a su estado en blanco y editable —
  // mismo criterio que ya usan "Datos de la interrupción" y "Tablas
  // relacionadas" para su estado vacío.
  useEffect(() => {
    if (selectedRecord) {
      setNivelSel(selectedRecord.nivel);
      setCodigoBusqueda(selectedRecord.referencia);
      setFaseSel(selectedRecord.fase);
      setOrigenSel(selectedRecord.origen);
      setTipoSel(selectedRecord.tipo);
      setFlyoutFilters((prev) => ({ ...prev, fecha: selectedRecord.fecha }));
    } else {
      setNivelSel("");
      setCodigoBusqueda("");
      setFaseSel("");
      setOrigenSel(null);
      setTipoSel(null);
      setFlyoutFilters((prev) => ({ ...prev, fecha: "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modSelectedRow]);

  // Filtros del flyout "Más filtros" con valor cargado — alimentan el badge
  // del botón y los chips removibles debajo de la filter bar.
  const activeFlyoutFields = FLYOUT_FIELDS.filter((f) => flyoutFilters[f.key].trim() !== "");

  function clearFlyoutField(key: keyof FlyoutFilters) {
    setFlyoutFilters((prev) => ({ ...prev, [key]: "" }));
  }


  // Tabla Referencia / Fecha (columna derecha). El buscador cubre solo
  // Referencia (searchCols [0]); la fecha se filtra con el FilterTrigger
  // date-range. El filtro se aplica DESPUÉS del hook, sobre los índices de
  // SAMPLE_ROWS (mismo criterio que las filas borradas de ABM): así
  // modVisibleIndices sigue indexando SAMPLE_ROWS, que es lo que usan
  // modSelectedRow, data-row-index y la navegación por teclado. Si la
  // interrupción seleccionada queda fuera del filtro, NO se deselecciona.
  const modGetCells = (row: (typeof SAMPLE_ROWS)[number]) => [row.referencia, row.fecha];
  const [modFiltroFecha, setModFiltroFecha] = useState<RangoFecha | null>(null);
  const { search: modSearch, setSearch: setModSearch, sortIdx: modSortIdx, sortDir: modSortDir, toggleSort: modToggleSort, visibleIndices: modVisibleIndicesBusqueda } =
    useTableToolbar(SAMPLE_ROWS, modGetCells, undefined, [0]);
  const modVisibleIndices = modFiltroFecha
    ? modVisibleIndicesBusqueda.filter((i) => fechaEnRango(fechaHoraDeStr(SAMPLE_ROWS[i].fecha), modFiltroFecha))
    : modVisibleIndicesBusqueda;

  // Tabla 4 (Reposiciones) — siempre visible en la Card B, ya no vive detrás
  // de un tab del drawer. Sin interrupción seleccionada no hay reposiciones
  // que mostrar. Con selección, se generan (seed = referencia) filas
  // propias de esa interrupción — cantidad y valores varían de una a otra,
  // pero siempre las mismas para la misma interrupción.
  const tabla4Rows: FaseReposicion[] = selectedRecord ? generarFasesSinteticas(selectedRecord.referencia) : [];

  // Fila de Reposiciones seleccionada (tabla interactiva, igual que
  // Interrupciones) — "Tablas relacionadas" y "Datos de la interrupción"
  // reflejan la reposición puntual seleccionada acá, no siempre la primera
  // ni la última. Al cambiar de interrupción se preselecciona la primera
  // reposición de la lista (si tiene alguna) — ver efecto más abajo. Al
  // MONTAR, en cambio, arranca en `initialReposicion` si vino uno (viaja
  // desde el botón "Volver" de AbmScreen) — el useState inicial la busca
  // por .nro en vez de asumir índice 0, porque la posición de una
  // reposición dentro de tabla4Rows no tiene por qué coincidir con su
  // número (ver DRAWER_TABS.tabla4).
  const [modSelectedFase, setModSelectedFase] = useState<number | null>(() => {
    if (tabla4Rows.length === 0) return null;
    if (initialReposicion !== null) {
      const idx = tabla4Rows.findIndex((f) => f.nro === initialReposicion);
      if (idx >= 0) return idx;
    }
    return 0;
  });
  // Se salta su primera corrida (el useState de arriba ya resolvió el
  // valor inicial, initialReposicion incluido) — si no, este efecto corre
  // igual en el primer render (todo useEffect corre después del montaje,
  // "cambió" o no) y pisaría esa restauración con 0 antes de que el
  // usuario llegue a verla.
  const isFirstFaseReset = useRef(true);
  useEffect(() => {
    if (isFirstFaseReset.current) {
      isFirstFaseReset.current = false;
      return;
    }
    setModSelectedFase(tabla4Rows.length > 0 ? 0 : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modSelectedRow]);
  const filaFaseSeleccionada = modSelectedFase !== null ? tabla4Rows[modSelectedFase] : undefined;

  // Valores de "Tablas relacionadas" para la reposición seleccionada —
  // mismo generador (ver generarTablasRelacionadas), pero semilla = la
  // interrupción + el número de esa reposición puntual (no solo la
  // interrupción), así cada reposición tiene sus propios valores,
  // deterministicos: volver a seleccionar la misma reposición siempre da
  // los mismos valores.
  const valoresRelacionadas = selectedRecord && filaFaseSeleccionada
    ? generarTablasRelacionadas(`${selectedRecord.referencia}#${filaFaseSeleccionada.nro}`)
    : null;

  // Filas de cada tab del modal "Tablas relacionadas" (5/6/8/9) —
  // generadas por reposición seleccionada (ver generarFilasTabla5/6/8/9),
  // cantidad exactamente igual al tile correspondiente en
  // valoresRelacionadas. Tabla 3 no pasa por acá (usa
  // valoresRelacionadas.tabla3 directo, ver JSX).
  const relTabRows: string[][] = (() => {
    if (!relTab || !selectedRecord || !filaFaseSeleccionada || !valoresRelacionadas) return [];
    const referencia = selectedRecord.referencia;
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
  const relResetKey = `${relTab}#${modSelectedFase}`;
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

  // Datos de la interrupción (widget + modal, Card B) — solo tiene sentido
  // con una interrupción seleccionada; sin selección, la sección completa
  // muestra un estado vacío (ver JSX) y estos valores no se usan.
  // "Fecha última reposición" ahora refleja la reposición seleccionada en
  // la Tabla 4 (no siempre la última de la lista).
  const timelineReferencia = selectedRecord?.referencia ?? "";
  const timelineFechaInicio = selectedRecord?.fecha ?? "";
  const timelineFechaUltRepo = filaFaseSeleccionada ? filaFaseSeleccionada.horaRep : "";
  // Reclamos de la interrupción seleccionada (gráfico debajo de la
  // Tabla 4) — por interrupción, no por reposición.
  const reclamosInterrupcion = useMemo(
    () => (selectedRecord ? generarReclamosSinteticos(selectedRecord.referencia, selectedRecord.fecha) : null),
    [selectedRecord],
  );

  // Navegación por teclado en la tabla de Interrupciones: flecha abajo/arriba
  // mueve la selección entre filas visibles y actualiza en vivo la Card B,
  // igual que un click sobre la fila.
  const modListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modSelectedRow === null || !modListRef.current) return;
    modListRef.current
      .querySelector<HTMLElement>(`[data-row-index="${modSelectedRow}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [modSelectedRow]);

  function handleModListKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!modShowData || modVisibleIndices.length === 0) return;
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    if (modSelectedRow === null) {
      setModSelectedRow(e.key === "ArrowDown" ? modVisibleIndices[0] : modVisibleIndices[modVisibleIndices.length - 1]);
      return;
    }
    const currentPos = modVisibleIndices.indexOf(modSelectedRow);
    const nextPos =
      e.key === "ArrowDown"
        ? Math.min(currentPos + 1, modVisibleIndices.length - 1)
        : Math.max(currentPos - 1, 0);
    setModSelectedRow(modVisibleIndices[Math.max(nextPos, 0)]);
  }

  // Más filtros / Limpiar / Buscar — mismo lugar (pegados a la derecha de la
  // fila de filtros) en cualquier tamaño de ventana.
  const masFiltrosBtn = (
    <button
      type="button"
      onClick={() => setFlyoutOpen((v) => !v)}
      className={`${BTN_MD} border flex items-center gap-1.5 transition-colors duration-(--duration-base) ${
        activeFlyoutFields.length > 0
          ? "bg-primary-tint border-primary text-secondary"
          : "bg-surface border-border-strong text-text hover:bg-primary-tint hover:border-primary hover:text-secondary"
      }`}
    >
      <Filter size={ICON.sm} strokeWidth={1.5} />
      Más filtros
      {activeFlyoutFields.length > 0 && (
        <span className="w-4 h-4 rounded-full bg-primary-strong text-white text-caption flex items-center justify-center">
          {activeFlyoutFields.length}
        </span>
      )}
    </button>
  );
  const limpiarBuscarBtns = (
    <>
      <button
        type="button"
        onClick={() => {
          setModShowData(false);
          setModSelectedRow(null);
          setOrigenSel(null);
          setTipoSel(null);
          setFlyoutFilters(EMPTY_FLYOUT_FILTERS);
          setNivelSel("");
          setCodigoBusqueda("");
          setFaseSel("");
        }}
        disabled={!modShowData}
        className={`${BTN_MD} border border-border-strong bg-surface text-text hover:bg-primary-tint hover:border-primary hover:text-secondary transition-[color,background-color,border-color,transform] duration-(--duration-base) active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none`}
      >Limpiar</button>
      <button
        type="button"
        onClick={() => { setModShowData(true); setModSelectedRow(null); }}
        disabled={modShowData}
        className={`${BTN_MD} text-white transition-[color,background-color,border-color,transform] duration-(--duration-base) active:scale-[0.99] bg-primary-strong hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none`}
      >Buscar</button>
    </>
  );

  return (
    <div className="flex-1 min-h-0 flex flex-col px-(--page-px) pt-(--page-pt) pb-(--page-pt) relative overflow-hidden">
    <div className="flex-1 min-h-0 flex flex-col gap-(--page-gap)">

        {/* Búsqueda — sin contenedor: la fila de filtros se apoya directo
            en el fondo de la página, debajo del título del encabezado. Una
            sola fila + flyout "Más filtros" anclado a la derecha. */}
        <div className="relative shrink-0">
          <div className="relative">
            <div className="relative z-(--z-raised) flex items-center gap-2 [@media(max-height:760px)]:flex-wrap">
            {/* Ancho fijo (no crece a ocupar el sobrante) para que se vea
                proporcionado contra Nivel/Fase — 190px en tamaño normal,
                bastante más chico en tier 760px vía el `!` important de
                abajo (el ancho normal es inline, gana a una clase sin
                important). */}
            <input
              disabled={hasSelection}
              placeholder={`Ej: ${RECORD.referencia}`}
              className={MOD_FIELD_CLS + " !text-code font-mono" + (hasSelection ? " !bg-fill-subtle !text-text" : "") + " [@media(max-height:760px)]:!w-[112px]"}
              style={{ width: 190, flexShrink: 0 }}
              value={codigoBusqueda}
              onChange={(e) => setCodigoBusqueda(e.target.value)}
            />

            <DateTimeField
              value={flyoutFilters.fecha}
              onChange={(v) => setFlyoutFilters((prev) => ({ ...prev, fecha: v }))}
              disabled={hasSelection}
              muted={false}
              className="[@media(max-height:760px)]:!w-[128px]"
            />

            <ValuePicker
              isDisabled={hasSelection}
              triggerExtraClassName={hasSelection ? " !bg-fill-subtle !text-text" : ""}
              triggerStyle={{ fontWeight: nivelSel ? 600 : 400 }}
              value={nivelSel}
              onChange={setNivelSel}
              opts={["BT", "MT", "AT"]}
              placeholder="Nivel"
              wrapClassName="w-[88px] shrink-0"
            />

            <ValuePicker
              isDisabled={hasSelection}
              triggerExtraClassName={hasSelection ? " !bg-fill-subtle !text-text" : ""}
              value={faseSel}
              onChange={setFaseSel}
              opts={["R", "S", "T", "RS", "RT", "ST", "RST"]}
              placeholder="Fase"
              wrapClassName="w-[84px] shrink-0"
            />

            <div className="w-px h-5 bg-border shrink-0" />

            {/* Toggle Origen/Tipo — tamaño normal. En tier 760px pasan a
                <select> nativo (ver más abajo): ocupan menos ancho por lo
                que aportan, justo lo que le faltaba a esta fila. */}
            <div className="contents [@media(max-height:760px)]:hidden">
              <span className="text-heading-xs uppercase text-text-muted shrink-0">Origen</span>
              <ButtonSelectGroup
                options={["Interno", "Externo"]}
                selected={origenSel ? [origenSel] : []}
                onToggle={(opt) => setOrigenSel(origenSel === opt ? null : opt)}
                disabled={modShowData || hasSelection}
                sizeCls={BTN_SEG_MD}
              />

              <span className="text-heading-xs uppercase text-text-muted shrink-0">Tipo</span>
              <ButtonSelectGroup
                options={["Forzado", "Programado"]}
                selected={tipoSel ? [tipoSel] : []}
                onToggle={(opt) => setTipoSel(tipoSel === opt ? null : opt)}
                disabled={modShowData || hasSelection}
                sizeCls={BTN_SEG_MD}
              />
            </div>

            <ValuePicker
              isDisabled={modShowData || hasSelection}
              value={origenSel ?? ""}
              onChange={(v) => setOrigenSel(v || null)}
              opts={["Interno", "Externo"]}
              placeholder="Origen"
              wrapClassName="hidden [@media(max-height:760px)]:block w-[92px] shrink-0"
            />

            <ValuePicker
              isDisabled={modShowData || hasSelection}
              value={tipoSel ?? ""}
              onChange={(v) => setTipoSel(v || null)}
              opts={["Forzado", "Programado"]}
              placeholder="Tipo"
              wrapClassName="hidden [@media(max-height:760px)]:block w-[112px] shrink-0"
            />

            {/* Más filtros / Limpiar / Buscar juntos, pegados a la derecha —
                mismo lugar en cualquier tamaño de ventana. */}
            <div className="ml-auto flex items-center gap-2 shrink-0">
              {masFiltrosBtn}
              {limpiarBuscarBtns}
            </div>
            </div>

            {/* Backdrop — no bloqueante, sólo cierra el flyout al click afuera.
                Vive junto al flyout (no en el wrapper externo que también
                contiene los chips) para que su posición no se vea afectada
                por si hay o no una fila de chips debajo. */}
            {flyoutOpen && (
              <div className="fixed inset-0 z-(--z-dismiss)" onClick={() => setFlyoutOpen(false)} />
            )}

            {/* Flyout "Más filtros" */}
            {flyoutOpen && (
              <div
                className="shadow-md absolute right-0 z-(--z-dropdown) bg-surface border border-border rounded-md p-4"
                style={{ top: "calc(100% + 6px)", width: 520 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-heading-sm text-text">Más filtros</span>
                  <button
                    type="button"
                    onClick={() => setFlyoutOpen(false)}
                    className={`${ICON_BTN_XS} flex items-center justify-center rounded-sm text-icon hover:bg-fill-muted hover:text-text transition-colors`}
                  >
                    <X size={ICON.sm} strokeWidth={1.5} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-x-3.5 gap-y-3">
                  {FLYOUT_FIELDS.map((f) => (
                    <div key={f.key}>
                      <FieldLabel>{f.label}</FieldLabel>
                      <input
                        placeholder={f.placeholder}
                        value={flyoutFilters[f.key]}
                        onChange={(e) => setFlyoutFilters((prev) => ({ ...prev, [f.key]: e.target.value }))}
                        className={MOD_FIELD_CLS}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setFlyoutFilters(EMPTY_FLYOUT_FILTERS)}
                    className="text-label text-secondary hover:underline"
                  >
                    Limpiar filtros
                  </button>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setFlyoutOpen(false)}
                      className={`${BTN_MD} border border-border-strong bg-surface text-text hover:bg-fill-muted transition-colors`}
                    >
                      Cerrar
                    </button>
                    <button
                      type="button"
                      onClick={() => setFlyoutOpen(false)}
                      className={`${BTN_MD} text-white bg-primary-strong hover:bg-primary-hover transition-colors`}
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chips de filtros aplicados (flyout) — franja propia, no texto suelto */}
          {activeFlyoutFields.length > 0 && (
            <div className="flex items-center flex-wrap gap-2 mt-4 px-3 py-2 rounded-sm border border-border bg-fill-subtle">
              <span className="text-heading-xs uppercase text-text-muted shrink-0">
                Filtros aplicados:
              </span>
              {activeFlyoutFields.map((f) => (
                <span
                  key={f.key}
                  className="inline-flex items-center gap-1.5 h-(--control-sm) pl-3 pr-1.5 rounded-full bg-primary-tint border border-chip-border text-secondary text-label"
                >
                  {f.label}: {flyoutFilters[f.key]}
                  <button
                    type="button"
                    onClick={() => clearFlyoutField(f.key)}
                    className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-chip-border-hover transition-colors"
                  >
                    <svg width="8" height="8" viewBox="0 0 14 14" fill="none">
                      <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

      {/* ── FILA INFERIOR — Interrupciones y Reposiciones (CDS4), una al lado
          de la otra. Cada card se ajusta a su contenido (items-start, no se
          fuerza el mismo alto) con tope en el alto disponible (max-h-full):
          si el contenido no entra, la tabla se achica y scrollea adentro,
          nunca la página. Las cards NO llevan overflow-hidden: recortaría
          el panel del filtro de Fecha y cualquier otro popover. ── */}
      <div className={`flex-1 min-h-0 flex items-start gap-(--cards-gap) transition-opacity duration-(--duration-base) ${flyoutOpen ? "opacity-50 pointer-events-none" : ""}`}>

      {/* ── Card Interrupciones — card con secciones (ver DESIGN_SYSTEM.md,
          "Card con secciones"): header con divisor → toolbar → tabla al ras
          con paginación al pie → sección Reclamos. Split 50/50 con
          Reposiciones (flex-1 en las dos). ── */}
      <div
        className="shadow-sm flex-1 min-w-0 max-h-full flex flex-col rounded-md border border-border bg-surface"
      >

        {/* Header — sin subtítulo (el contador va en el toolbar). Sin
            acciones: "Datos de la interrupción" se abre desde la sección
            Reclamos. */}
        <CardHeader title="Interrupciones" tag="CDS2" />

        {/* Toolbar de tabla — FUERA del contenedor de la tabla, sin fondo ni
            línea divisoria con la tabla (ver DESIGN_SYSTEM.md, "Patrones
            de contenedor y tabla"): buscador de Referencia → divisor → filtro de Fecha →
            (derecha) Limpiar filtros + contador. Se renderiza SIEMPRE: sin
            resultados, buscador y filtro quedan deshabilitados y el contador
            dice "0 registros" — así el divisor del header nunca queda pegado
            al thead. "Limpiar filtros" quita el filtro, no el texto del
            buscador. */}
        <div className="px-(--card-px) py-3 shrink-0 flex items-center flex-wrap gap-2">
          <div className="w-60 shrink-0">
            <TableToolbar search={modSearch} onSearchChange={setModSearch} searchPlaceholder="Buscar referencia…" hideExport bare disabled={!modShowData} />
          </div>
          <div className="w-px h-5 bg-border shrink-0" />
          <FilterTrigger variant="date-range" label="Fecha" value={modFiltroFecha} onChange={setModFiltroFecha} disabled={!modShowData} />
          <div className="ml-auto shrink-0 flex items-center gap-4">
            {modShowData && modFiltroFecha && (
              <button
                type="button"
                onClick={() => setModFiltroFecha(null)}
                className="text-label text-secondary hover:underline"
              >
                Limpiar filtros
              </button>
            )}
            {modShowData
              ? <TableCounter visibles={modVisibleIndices.length} total={SAMPLE_ROWS.length} />
              : <TableCounter visibles={0} />}
          </div>
        </div>

        {/* Body — tabla Referencia / Fecha al ras de la card (el aire de
            arriba lo da el py-3 del toolbar), y debajo el resumen de
            reclamos. Los paddings horizontales de header, toolbar, celdas
            extremas, paginador y secciones salen todos de --card-px para
            quedar alineados. */}
        <div className="min-h-0 flex flex-col">
          {/* Tabla: header bg-fill-subtle de alto fijo (32px), celdas
              px-3 py-2 text-body-sm, separador border-subtle, acento de
              selección con sombra inset en la primera celda, paginación como
              pie (fill-subtle). El toolbar de arriba siempre está, así que
              la tabla lleva su propia línea superior. */}
          <div className="min-h-0 flex flex-col">
            <div className="grid grid-cols-2 items-center shrink-0 bg-fill-subtle border-y border-border" style={{ height: 32 }}>
              <SortableHeaderCell
                label="Referencia"
                active={modSortIdx === 0}
                dir={modSortDir}
                onClick={() => modToggleSort(0)}
                className="pl-(--card-px) pr-3"
              />
              <SortableHeaderCell
                label="Fecha"
                active={modSortIdx === 1}
                dir={modSortDir}
                onClick={() => modToggleSort(1)}
                className="pl-3 pr-(--card-px)"
              />
            </div>
            {/* La card tiene altura fija (arriba) — esta lista ocupa todo el
                espacio que queda dentro de ese alto fijo (flex-1) y scrollea
                internamente, en vez de empujar el scroll general de la página.
                min-h-0 es necesario para que un hijo flex con overflow pueda
                angostarse por debajo de su alto de contenido natural. */}
            <div
              ref={modListRef}
              tabIndex={modShowData ? 0 : -1}
              onKeyDown={handleModListKeyDown}
              className={`min-h-0 overflow-y-auto ${FOCUS_RING_INSET}`}
            >
              {!modShowData ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2 text-center px-8">
                  <span className="text-text-faint scale-90"><Inbox size={ICON.xl} strokeWidth={1.25} /></span>
                  <p className="text-label text-text-muted">Sin resultados</p>
                  <p className="text-caption text-text-muted">Completá los filtros y presioná Buscar</p>
                </div>
              ) : modFiltroFecha && modVisibleIndices.length === 0 ? (
                /* El filtro dejó 0 filas — mismo empty state de arriba. */
                <div className="flex flex-col items-center justify-center py-10 gap-2 text-center px-8">
                  <span className="text-text-faint scale-90"><Inbox size={ICON.xl} strokeWidth={1.25} /></span>
                  <p className="text-label text-text-muted">Sin resultados para los filtros aplicados</p>
                </div>
              ) : modVisibleIndices.map((i, vi) => {
                const row = SAMPLE_ROWS[i];
                const selected = modSelectedRow === i;
                const esUltima = vi === modVisibleIndices.length - 1;
                const textCls = selected ? "text-secondary font-medium" : "text-text";
                return (
                  <div
                    key={i}
                    data-row-index={i}
                    className={`grid grid-cols-2 transition-colors cursor-pointer hover:bg-fill-muted ${esUltima ? "" : "border-b border-border-subtle"}`}
                    style={{ backgroundColor: selected ? "var(--color-primary-tint)" : undefined }}
                    onClick={() => setModSelectedRow(selected ? null : i)}
                  >
                    <div
                      className={`pl-(--card-px) pr-3 py-2 text-code tabular-nums whitespace-nowrap font-mono ${textCls} ${selected ? "inset-shadow-row-selected" : ""}`}
                    >
                      {row.referencia}
                    </div>
                    <div className={`pl-3 pr-(--card-px) py-2 text-body-sm tabular-nums whitespace-nowrap ${textCls}`}>{row.fecha}</div>
                  </div>
                );
              })}
            </div>
            <div className="shrink-0 border-t border-border bg-fill-subtle px-(--card-px) py-1.5 flex items-center justify-between">
              <button className={`${BTN_SM} border border-border bg-surface text-text-muted disabled:opacity-40`} disabled>Anterior</button>
              <span className="text-caption text-text-muted">Página <span className="font-medium text-text">1</span> de <span className="font-medium text-text">2.213</span></span>
              <button className={`${BTN_SM} border border-border bg-surface text-text-muted hover:bg-fill-muted transition-colors`}>Siguiente</button>
            </div>
          </div>
          <ReclamosResumenCompacto
            datos={reclamosInterrupcion}
            referencia={selectedRecord?.referencia ?? null}
            onClick={() => setDatosInterrupcionOpen(true)}
          />
        </div>
      </div>

        {/* Card B — Reposiciones (CDS4). Mismo criterio que la card de
            Interrupciones: nunca crece con el contenido (banner de
            selección, filas de la Tabla 4, etc.) — body scrolleable propio
            en vez de empujar el scroll de la página. Split de la fila 50/50
            en todos los tamaños (flex-1 acá y en Interrupciones) — antes era
            40/60 a favor de esta card, pero el resumen de reclamos pasó a
            vivir en Interrupciones. */}
        <div
          className="shadow-sm flex-1 min-w-0 max-h-full flex flex-col rounded-md border border-border bg-surface"
        >
          {/* La interrupción seleccionada (registro padre de las
              reposiciones) va como contexto del header, en la misma línea
              del título: "· INTERRUPCIÓN" + ID. La línea del header hace de
              línea superior de la lista. */}
          <CardHeader
            title="Reposiciones"
            tag="CDS4"
            context={selectedRecord ? { label: "Interrupción", value: selectedRecord.referencia } : undefined}
          />

          <div className="min-h-0 flex flex-col">

            {/* Tabla 4 — siempre visible, nunca detrás de un modal/drawer.
                Vacía hasta que se selecciona una interrupción. Toma el alto
                de su contenido (la card no se estira); si no entra en el
                alto disponible se achica con scroll propio + header sticky,
                ver ReposicionesLista. min-h-0 en este wrapper: sin él la
                tabla no puede achicarse y Tablas relacionadas quedaría
                cortada. */}
            <div className="min-h-0 flex flex-col">
              <ReposicionesLista
                rows={tabla4Rows}
                selectedIndex={modSelectedFase}
                onSelect={setModSelectedFase}
              />
              {/* Sección "Tablas relacionadas" de la card (no una card
                  anidada): separada por border-t a todo el ancho, sin
                  borde, fondo ni radio propios. Los chips abren el modal
                  "Tablas relacionadas", preseleccionado en la reposición
                  actual (modSelectedFase es la única fuente de verdad,
                  compartida entre esta card y el modal) y en el tab del
                  chip clickeado. La reposición activa va como contexto:
                  "REPOSICIÓN" + "X de N · hora". */}
              <div className="shrink-0 border-t border-border">
                <CardHeader
                  title="Tablas relacionadas"
                  level="section"
                  context={
                    filaFaseSeleccionada
                      ? { label: "Reposición", value: `${modSelectedFase !== null ? modSelectedFase + 1 : VALOR_VACIO} de ${tabla4Rows.length} · ${filaFaseSeleccionada.horaRep}` }
                      : undefined
                  }
                />
                <div className="flex flex-wrap gap-[6px] px-(--card-px) pt-1 pb-(--card-section-py)">
                  {STATUS_ITEMS.map((item) => (
                    <RelacionadaChip
                      key={item.tabKey}
                      label={item.label}
                      raw={hasSelection ? valoresRelacionadas?.[item.tabKey] : undefined}
                      booleana={item.tabKey === "tabla3"}
                      onClick={() => setRelTab(item.tabKey)}
                    />
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      </div>

      {/* ── MODALES DE ACCIÓN ───────────────────────────────────── */}
      <DesarmeModal
        open={desarmeOpen}
        onClose={() => setDesarmeOpen(false)}
        referencia={selectedRecord?.referencia ?? ""}
      />
      <NivelTipoModal open={nivelTipoOpen} onClose={() => setNivelTipoOpen(false)} />
      <ReplicarModal
        open={replicarOpen}
        onClose={() => setReplicarOpen(false)}
        referencia={selectedRecord?.referencia ?? ""}
      />
      <CambiaFasesModal
        open={cambiaFasesOpen}
        onClose={() => setCambiaFasesOpen(false)}
        referencia={selectedRecord?.referencia ?? ""}
      />
      <AltaClientesModal
        open={altaClientesOpen}
        onClose={() => setAltaClientesOpen(false)}
        referencia={selectedRecord?.referencia ?? ""}
      />
      <IntercambioModal
        open={intercambioOpen}
        onClose={() => setIntercambioOpen(false)}
        referencia={selectedRecord?.referencia ?? ""}
      />
      <DatosInterrupcionModal
        open={datosInterrupcionOpen}
        onClose={() => setDatosInterrupcionOpen(false)}
        referencia={timelineReferencia}
        fechaInicio={timelineFechaInicio}
        fechaUltRepo={timelineFechaUltRepo}
        reclamos={reclamosInterrupcion}
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
              {selectedRecord ? selectedRecord.referencia : RECORD.referencia}
            </span>
            <CopyButton value={selectedRecord ? selectedRecord.referencia : RECORD.referencia} label="interrupción" />
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
              reposicionIndex={modSelectedFase ?? 0}
              totalReposiciones={tabla4Rows.length}
              onChangeReposicion={setModSelectedFase}
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
                        Ir a {ABM_TABLE_CONFIGS[abmMapping.tableKey].code} a insertar →
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
