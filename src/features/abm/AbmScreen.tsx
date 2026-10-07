import { useState, useRef, useEffect } from "react";
import { Shield, Inbox, Plus, Download, X } from "lucide-react";
import {
  actionBtnCls,
  BTN_SM,
  CardHeader,
  CopyButton,
  ChipFilterBar,
  FOCUS_RING_INSET,
  FormRow,
  ghostBtnCls,
  ICON,
  ICON_BTN_SM,
  Modal,
  modalNeutralBtnCls,
  modalPrimaryBtnCls,
  PeriodSelector,
  SectionDivider,
  SelectionActionBar,
  SortableHeaderCell,
  TableCounter,
  TableToolbar,
  useTableToolbar,
} from "@/components/ui";
import { ABM_TABLE_CONFIGS } from "@/data/abmTables";
import { ABM_ITEMS } from "@/data/dominio";
import { AbmDeepLink, AbmMode, AbmTableKey } from "@/data/types";
import AbmCampo from "@/features/abm/AbmCampo";
import AbmFila from "@/features/abm/AbmFila";
import AbmTableSelector from "@/features/abm/AbmTableSelector";
import ConfirmarBorrarModal from "@/features/abm/ConfirmarBorrarModal";
import ConfirmarModificarModal from "@/features/abm/ConfirmarModificarModal";
import { filtrarFilas, FiltroFila, modoDeEditor } from "@/features/abm/filtrarFilas";
import RevisarCambiosContent, { useMotivoCambio } from "@/features/abm/RevisarCambiosContent";
import { labelDeValor } from "@/features/abm/labelDeValor";
import { formatNumero } from "@/lib/format";

function exportRowsToCsv(filename: string, headers: string[], rows: string[][]) {
  const escape = (v: string) => (/[",\n;]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  const csv = "﻿" + [headers, ...rows].map((r) => r.map(escape).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Vuelca los datos de una fila de resultados en `valores` del formulario,
// según el mapeo columna→campo de la tabla (config.mapeoFilaACampos).
// Usado tanto por el estado "consultando" (fila seleccionada en modo
// buscar) como al entrar a "modificar" — en ambos casos el formulario debe
// mostrar el dato REAL del registro, nunca arrancar en blanco. Los campos
// sin mapeo quedan sin tocar (ver AbmCampo: siguen en blanco, pero
// disabled/atenuados igual).
function mapearFilaAValores(mapeo: Record<string, string>, fila: Record<string, string>): Record<string, string> {
  const nuevos: Record<string, string> = {};
  for (const [columna, campoNombre] of Object.entries(mapeo)) {
    if (fila[columna] !== undefined) nuevos[campoNombre] = fila[columna];
  }
  return nuevos;
}

// Componente unico que renderiza cualquiera de las 9 tablas ABM a partir de
// ABM_TABLE_CONFIGS[tableKey]. `onChangeTable` es el mismo setScreen del
// componente App — asi el selector interno y el item activo del sidebar
// comparten el mismo estado sin duplicarlo.
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
  // Deep-link pendiente desde afuera (ej. drawer de Consultas de
  // interrupción) — se aplica una vez y se descarta via onDeepLinkConsumed.
  deepLink?: AbmDeepLink | null;
  onDeepLinkConsumed?: () => void;
  // Se llegó acá por un deep-link (no por navegación normal del sidebar) —
  // muestra el botón "←" (solo ícono) en el masthead.
  volverVisible?: boolean;
  onVolver?: () => void;
}) {
  const config = ABM_TABLE_CONFIGS[tableKey];
  // Tier 760px: la grilla plana del panel de Búsqueda (ver más abajo) es de
  // 2 columnas por default, ya validado contra Tabla 2 (12 campos, 6 filas
  // — entra sin scroll). Tablas con más campos que eso (CDS8: 14, la más
  // cargada — sección Cliente sola tiene 9) no entran en 6 filas y siguen
  // necesitando scroll con solo 2 columnas; el criterio de "cero scroll"
  // pesa más que mantener el mismo número de columnas en todas las tablas.
  // Contar los campos totales de la tabla (no medir nada en el DOM) alcanza
  // para decidirlo de antemano, sin necesidad de una lista hardcodeada de
  // tablas ni de lógica por tabla en el JSX de abajo.
  const totalCamposTabla = config.secciones.reduce((acc, sec) => acc + sec.filas.flat().length, 0);
  const usaTresColumnasTier2 = totalCamposTabla > 12;
  const filasGridColsTier2Cls = usaTresColumnasTier2 ? "[@media(max-height:760px)]:grid-cols-3" : "[@media(max-height:760px)]:grid-cols-2";
  // Si la tabla usa 3 columnas, un campo `expandirBotones` necesita las 3
  // para ocupar todo el ancho (no las 2 de siempre) — ver más abajo.
  const expandirBotonesSpanCls = usaTresColumnasTier2 ? "[@media(max-height:760px)]:col-span-3" : "[@media(max-height:760px)]:col-span-2";
  const [mode, setMode] = useState<AbmMode>("buscar");
  const [showData, setShowData] = useState(false);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [valores, setValores] = useState<Record<string, string>>({});
  // Foto del registro tal como estaba al entrar a Modificar — se compara
  // contra `valores` (que sí cambia con cada edición) para saber qué
  // campos cambiaron, ver ConfirmarModificarModal.
  const [valoresOriginales, setValoresOriginales] = useState<Record<string, string>>({});
  const [modalModificarAbierto, setModalModificarAbierto] = useState(false);
  const [filaABorrar, setFilaABorrar] = useState<number | null>(null);
  // Índices (de config.rows) borrados en esta sesión — config.rows es mock
  // estático derivado de la config, no estado real, así que "borrar" no
  // puede sacar la fila del array: en cambio se la excluye de Resultados
  // (visibleIndices más abajo) sin tocar los índices de las demás filas,
  // que siguen usándose como identidad en selectedRow/mapeoFilaACampos/etc.
  const [filasBorradas, setFilasBorradas] = useState<Set<number>>(new Set());
  const camposLocked = config.camposReadonlyEnModificar ?? [];
  // Layout "barra" (PRUEBA, solo CDS2 — ver AbmLayout): la búsqueda vive en
  // la barra de filtros híbrida (ChipFilterBar, config.filtrosBarra), con
  // estado propio — no comparte `valores` con el modal de Modificar. Cada
  // cambio filtra al instante sobre todas las filas de muestra.
  const esBarra = config.layout === "barra";
  const [idBarra, setIdBarra] = useState("");
  const [filtrosBarraValores, setFiltrosBarraValores] = useState<Record<string, string>>({});
  // Modal de edición de registro (layout "barra"): un solo modal con dos
  // pasos — 1 Editar, 2 Revisar (Resumen de cambios + Motivo). Nunca se abre
  // ConfirmarModificarModal encima: el paso 2 es el mismo modal.
  const [pasoModificar, setPasoModificar] = useState<1 | 2>(1);
  const motivoModificar = useMotivoCambio();
  const bodyModificarRef = useRef<HTMLDivElement>(null);

  // Reset al cambiar de tabla — corre primero.
  useEffect(() => {
    setMode("buscar");
    setShowData(false);
    setSelectedRow(null);
    setValores({});
    setValoresOriginales({});
    setFilasBorradas(new Set());
    setIdBarra("");
    setFiltrosBarraValores({});
    // Layout "barra": sin filtros se ven todos los registros del período.
    if (config.layout === "barra") setShowData(true);
  }, [tableKey]);

  // Aplica un deep-link pendiente para ESTA tabla — corre después del
  // reset de arriba (mismo commit cuando tableKey y deepLink cambian
  // juntos, que es el caso normal), así su estado gana. Se descarta con
  // onDeepLinkConsumed apenas se aplica, para no reaplicarse en loop.
  useEffect(() => {
    if (!deepLink || deepLink.tableKey !== tableKey) return;
    if (deepLink.modo === "alta") {
      setMode("alta");
      setShowData(false);
      setSelectedRow(null);
      setValores({ [deepLink.campo]: deepLink.valor });
    } else {
      setMode("buscar");
      setValores({ [deepLink.campo]: deepLink.valor });
      // Layout "barra": el valor del deep-link va al ID o al chip de esa
      // columna.
      if (config.filtrosBarra?.id.columna === deepLink.columna) setIdBarra(deepLink.valor);
      else if ([...(config.filtrosBarra?.fijos ?? []), ...(config.filtrosBarra?.agregables ?? [])].some((d) => d.campo === deepLink.columna)) {
        setFiltrosBarraValores({ [deepLink.columna]: deepLink.valor });
      }
      setShowData(true);
      const idx = config.rows.findIndex((r) => r[deepLink.columna] === deepLink.valor);
      setSelectedRow(idx >= 0 ? idx : null);
    }
    onDeepLinkConsumed?.();
  }, [deepLink, tableKey]);

  // Estado "consultando" — hay una fila seleccionada en Resultados
  // mientras se sigue en modo buscar. Vuelca los datos de esa fila (según
  // config.mapeoFilaACampos) en el formulario de Búsqueda, en solo-lectura
  // — no cambia mode ni título/botones del panel (eso es "modificar", una
  // acción aparte que ahora arranca con los mismos datos, ver
  // handleAbrirModificar). Corre después del efecto de deep-link: si se
  // llega acá con una fila ya preseleccionada, esta pasada completa el
  // formulario con TODOS los campos mapeados (el deep-link por sí solo
  // precarga uno nada más).
  // En layout "barra" no aplica: seleccionar una fila no toca la barra de
  // búsqueda (ni la deshabilita ni le vuelca datos).
  useEffect(() => {
    if (mode !== "buscar" || esBarra) return;
    if (selectedRow === null) {
      setValores({});
      return;
    }
    setValores(mapearFilaAValores(config.mapeoFilaACampos, config.rows[selectedRow]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, selectedRow, tableKey]);

  function setValor(nombre: string, v: string) {
    // `limpiaAlCambiar` (config del campo que cambió) — típicamente el
    // campo dependiente de una cascada (ver Partido -> Localidad en CDS8),
    // para que no quede seleccionado un valor que ya no es una opción
    // válida del campo dependiente.
    const campo = config.secciones.flatMap((s) => s.filas.flat()).find((c) => c.nombre === nombre);
    setValores((prev) => {
      const next = { ...prev, [nombre]: v };
      for (const otro of campo?.limpiaAlCambiar ?? []) next[otro] = "";
      return next;
    });
  }

  const camposTabla = config.secciones.flatMap((s) => s.filas.flat());
  // Filtros de la barra (layout "barra") → filtros por columna de
  // config.rows: el ID por "contiene"; cada chip según su editor.
  const filtrosBarra = config.filtrosBarra;
  const filtrosFila: FiltroFila[] = filtrosBarra
    ? [
        { columna: filtrosBarra.id.columna, valor: idBarra, modo: "contiene" },
        ...[...filtrosBarra.fijos, ...filtrosBarra.agregables].map((d) => ({
          columna: d.campo,
          valor: filtrosBarraValores[d.campo] ?? "",
          modo: modoDeEditor(d.editor),
        })),
      ]
    : [];
  const hayFiltrosBarra = filtrosFila.some((f) => f.valor.trim() !== "");

  // Secciones del formulario del panel de Búsqueda del layout "split"
  // (separador + filas de AbmFila; en tier 760px, grilla plana).
  const renderSecciones = (secciones: typeof config.secciones) =>
    secciones.map((sec) => {
              const conteoPorLongitud = new Map<number, number>();
              for (const fila of sec.filas) conteoPorLongitud.set(fila.length, (conteoPorLongitud.get(fila.length) ?? 0) + 1);
              // Tier 760px reemplaza el sistema de filas/columnasCompartidas
              // de acá abajo por una grilla fija y genérica: TODOS los
              // campos de la sección, sin importar cómo la tabla los
              // agrupó en `filas`, se aplanan y se acomodan de a 2 por
              // línea en un grid-template-columns: repeat(2, minmax(0,1fr))
              // — el wrap natural de CSS grid, no un reordenamiento manual
              // por tabla. Mismo mecanismo para las 9 tablas.
              const camposPlanos = sec.filas.flat();
              return (
                <div key={sec.titulo}>
                  <SectionDivider title={sec.titulo} />
                  {/* Tamaño normal: sistema de filas de siempre. */}
                  <div className="flex flex-col gap-3 [@media(max-height:760px)]:hidden">
                    {sec.filas.map((fila, fi) => (
                      <AbmFila
                        key={fi}
                        fila={fila}
                        mode={mode}
                        valores={valores}
                        setValor={setValor}
                        camposLocked={camposLocked}
                        consultando={consultando}
                        columnasCompartidas={(conteoPorLongitud.get(fila.length) ?? 0) > 1}
                      />
                    ))}
                  </div>
                  {/* Tier 760px: grilla fija a lo ancho completo del panel
                      — 2 o 3 columnas según cuántos campos tenga la tabla
                      en total (ver totalCamposTabla más arriba) — cada
                      campo (toggle, select o input) estira a w-full dentro
                      de su celda. */}
                  <div className={`hidden [@media(max-height:760px)]:grid ${filasGridColsTier2Cls} [@media(max-height:760px)]:items-end [@media(max-height:760px)]:gap-3`}>
                    {camposPlanos.map((campo) => (
                      // `expandirBotones` es la señal existente de "este
                      // toggle necesita todo el ancho disponible, no una
                      // celda" (ver Causa en CDS3, Zona en CDS7) — acá eso
                      // se traduce en ocupar todas las columnas de la
                      // grilla plana (2 o 3 según la tabla), no solo una.
                      // Sin esto, un toggle de 1-2 opciones largas queda a
                      // una fracción del ancho del panel y el texto rompe a
                      // 2 líneas.
                      <div key={campo.nombre} className={campo.expandirBotones ? expandirBotonesSpanCls : ""}>
                        <AbmCampo
                          campo={campo}
                          mode={mode}
                          value={valores[campo.nombre]}
                          onChange={(v) => setValor(campo.nombre, v)}
                          lockedEnModificar={camposLocked.includes(campo.nombre)}
                          consultando={consultando}
                          valoresFormulario={valores}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            });

  const hasSelection = selectedRow !== null;
  const consultando = mode === "buscar" && hasSelection;
  // Columnas de Resultados: en layout "barra" la card es de ancho completo y
  // entran más (config.columnasResultadoBarra). Una columna con `campo`
  // muestra la etiqueta de la opción ("Interno") en vez del value ("I") —
  // también para buscar, ordenar y exportar.
  const columnas = esBarra && config.columnasResultadoBarra ? config.columnasResultadoBarra : config.columnasResultado;
  const celda = (row: Record<string, string>, c: (typeof columnas)[number]) => {
    const valor = row[c.key] ?? "";
    const campoDef = c.campo ? camposTabla.find((x) => x.nombre === c.campo) : undefined;
    return campoDef ? labelDeValor(campoDef, valor, row) : valor;
  };
  const columnKeys = columnas.map((c) => c.key);
  const getCells = (row: Record<string, string>) => columnas.map((c) => celda(row, c));
  const { search, setSearch, sortIdx, sortDir, toggleSort, visibleIndices: visibleIndicesConBorradas } =
    useTableToolbar(config.rows, getCells, tableKey);
  // Excluye las filas "borradas" de Resultados (navegación por teclado,
  // export, conteo) sin renumerar nada — los índices que quedan siguen
  // siendo los mismos de config.rows, que es lo que usan selectedRow,
  // mapeoFilaACampos y el resto del formulario.
  // Layout "barra": además, solo las filas que pasan los filtros de la barra.
  const indicesBuscados = esBarra && hayFiltrosBarra ? new Set(filtrarFilas(config.rows, filtrosFila)) : null;
  const visibleIndices = visibleIndicesConBorradas.filter((i) => !filasBorradas.has(i) && (!indicesBuscados || indicesBuscados.has(i)));

  // Navegación por teclado en Resultados: flecha abajo/arriba mueve la
  // selección entre filas visibles y autocompleta Búsqueda en vivo (mismo
  // patrón que la tabla de Interrupciones en Consultas de interrupción,
  // ver handleModListKeyDown/modListRef).
  const resultadosListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedRow === null || !resultadosListRef.current) return;
    resultadosListRef.current
      .querySelector<HTMLElement>(`[data-row-index="${selectedRow}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [selectedRow]);

  // Layout "barra": Escape con una fila seleccionada la deselecciona (las
  // acciones de registro viven en la barra de herramientas solo mientras
  // hay selección). No actúa con un modal abierto (Modificar, Borrar).
  useEffect(() => {
    if (!esBarra || selectedRow === null || mode !== "buscar" || filaABorrar !== null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedRow(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [esBarra, selectedRow, mode, filaABorrar]);

  function handleResultadosKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!showData || mode !== "buscar" || visibleIndices.length === 0) return;
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    if (selectedRow === null) {
      setSelectedRow(e.key === "ArrowDown" ? visibleIndices[0] : visibleIndices[visibleIndices.length - 1]);
      return;
    }
    const currentPos = visibleIndices.indexOf(selectedRow);
    const nextPos =
      e.key === "ArrowDown"
        ? Math.min(currentPos + 1, visibleIndices.length - 1)
        : Math.max(currentPos - 1, 0);
    setSelectedRow(visibleIndices[Math.max(nextPos, 0)]);
  }

  // Layout "barra": si un cambio de filtro deja afuera al registro
  // seleccionado, se deselecciona. (La paginación es fija: siempre página 1.)
  useEffect(() => {
    if (esBarra && selectedRow !== null && indicesBuscados && !indicesBuscados.has(selectedRow)) setSelectedRow(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idBarra, filtrosBarraValores]);

  function handleLimpiar() {
    setShowData(false);
    setSelectedRow(null);
    setValores({});
  }
  function handleBuscar() {
    setShowData(true);
    setSelectedRow(null);
  }
  // Layout "barra": quita el ID y todos los filtros; vuelve a mostrar todos
  // los registros.
  function handleLimpiarFiltrosBarra() {
    setIdBarra("");
    setFiltrosBarraValores({});
  }
  function handleAbrirAlta() {
    // No toca showData/selectedRow — el panel de Resultados sigue
    // mostrando exactamente lo que tenía (solo se atenúa vía el wrapper
    // de la derecha, ver `mode !== "buscar"` más abajo), no se resetea.
    setMode("alta");
    setValores({});
  }
  function handleCancelarAlta() {
    // Sin setSelectedRow(null) acá, si había una fila seleccionada al
    // entrar a Alta, el efecto de "consultando" la vuelve a volcar en
    // `valores` apenas mode pasa a "buscar" — el formulario quedaría en
    // estado "placeholder" en vez de "empty".
    setMode("buscar");
    setSelectedRow(null);
    setValores({});
  }
  function handleGuardarAlta() {
    setMode("buscar");
    setSelectedRow(null);
    setValores({});
  }
  // Modificar es un ícono por fila (no depende de que la fila ya esté
  // seleccionada) — toma el índice directo en vez de leer `selectedRow` del
  // closure, así funciona igual de bien sobre una fila recién clickeada que
  // sobre una ya seleccionada. El panel de Resultados no se toca (ni
  // showData ni selectedRow se resetean): sigue mostrando exactamente los
  // mismos resultados, con esta fila resaltada, solo atenuado vía el
  // wrapper de la derecha — igual que en modo Insertar.
  function handleAbrirModificar(i: number) {
    const filaActual = config.rows[i];
    const valoresIniciales = mapearFilaAValores(config.mapeoFilaACampos, filaActual);
    setSelectedRow(i);
    setMode("modificar");
    setValores(valoresIniciales);
    setValoresOriginales(valoresIniciales);
    setPasoModificar(1);
    motivoModificar.reset();
  }
  function handleCancelarModificar() {
    // Misma razón que handleCancelarAlta: sin limpiar selectedRow, el
    // efecto de "consultando" recompletaría el formulario apenas mode
    // vuelve a "buscar" (la fila sigue seleccionada en Resultados), y el
    // campo quedaría en "placeholder" en vez de volver a "empty". El panel
    // de Resultados en sí no se resetea (showData no se toca): sigue
    // mostrando los mismos resultados, solo sin ninguna fila resaltada.
    setMode("buscar");
    setSelectedRow(null);
    setValores({});
    setValoresOriginales({});
    setPasoModificar(1);
  }
  function handleGuardarModificar() {
    setModalModificarAbierto(true);
  }
  // Al pasar de paso, el foco va al primer elemento interactivo del body
  // nuevo (no en la apertura: ahí el foco lo maneja Modal).
  const pasoPrevioRef = useRef(pasoModificar);
  useEffect(() => {
    if (pasoPrevioRef.current === pasoModificar) return;
    pasoPrevioRef.current = pasoModificar;
    bodyModificarRef.current
      ?.querySelector<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')
      ?.focus();
  }, [pasoModificar]);
  function handleCancelarConfirmarModificar() {
    // Solo cierra el modal — sigue en modo Modificando, no se pierde la edición.
    setModalModificarAbierto(false);
  }
  function handleConfirmarModificar(nota: string) {
    // TODO: config.rows es mock derivado de la config, no estado real —
    // todavía no hay dónde persistir el cambio ni la nota (mismo caso que
    // Borrar). Por ahora cierra el flujo igual que antes.
    setModalModificarAbierto(false);
    setMode("buscar");
    setSelectedRow(null);
    setValores({});
    setValoresOriginales({});
  }

  function handleAbrirBorrar(i: number) {
    setFilaABorrar(i);
  }
  function handleCancelarBorrar() {
    setFilaABorrar(null);
  }
  function handleConfirmarBorrar() {
    if (filaABorrar !== null) {
      setFilasBorradas((prev) => new Set(prev).add(filaABorrar));
      // La fila borrada no puede seguir seleccionada — si lo estaba,
      // "consultando" quedaría mostrando el dato de un registro que ya no
      // aparece en Resultados.
      if (selectedRow === filaABorrar) setSelectedRow(null);
    }
    setFilaABorrar(null);
  }

  const totalPages = Math.max(1, Math.ceil(config.totalRegistros / 25));

  // Campos que cambiaron respecto a `valoresOriginales` (la foto tomada al
  // entrar a Modificar) — alimenta ConfirmarModificarModal. Excluye
  // "readonly" (no editables, nunca cambian) y resuelve value → label
  // legible vía labelDeValor para toggle/select/combobox.
  const camposModificados = config.secciones
    .flatMap((s) => s.filas.flat())
    .filter((c) => c.tipo !== "readonly" && (valores[c.nombre] ?? "") !== (valoresOriginales[c.nombre] ?? ""))
    .map((c) => ({
      label: c.label,
      anterior: labelDeValor(c, valoresOriginales[c.nombre] ?? "", valoresOriginales),
      nuevo: labelDeValor(c, valores[c.nombre] ?? "", valores),
    }));

  // Split: Resultados se atenúa en Insertar/Modificar (el foco queda en el
  // panel de la izquierda).
  const atenuarResultados = mode !== "buscar";
  const resultadosCard = (
        /* ── Right column: results — se atenua y deshabilita en modo alta
            y en modo modificar, para que el foco visual quede en el panel
            Búsqueda ── */
        <div
          className={`shadow-sm flex-1 flex flex-col border border-border rounded-md bg-surface overflow-hidden transition-opacity duration-(--duration-base) ${
            atenuarResultados ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <CardHeader
            title="Resultados"
            tag={config.code}
            actions={
              <div className="flex items-center gap-2">
                {/* Auditoría y Exportar: DEPRECADO en layout barra — pendiente
                    de reubicar (en layout "barra" no se renderizan; ver
                    resultadosBarra). Siguen vivos en el layout "split". */}
                {/* Auditoría es una acción de panel, no de registro: genera
                    una auditoría de todos los campos modificados en el
                    conjunto de resultados, no de una fila puntual — por eso
                    vive acá siempre visible/habilitada, no en la fila ni
                    atada a una selección (corrige un comportamiento heredado
                    del producto original que la ataba a un registro). */}
                <button type="button" title="Auditoría" aria-label="Auditoría" className={actionBtnCls("neutral")}>
                  <span className="inline-flex items-center gap-1.5"><Shield size={ICON.md} strokeWidth={1.5} /> <span className="[@media(max-height:760px)]:hidden">Auditoría</span></span>
                </button>
                {showData && (
                  <button
                    type="button"
                    title="Exportar"
                    aria-label="Exportar"
                    onClick={() =>
                      exportRowsToCsv(
                        config.exportFilename,
                        columnas.map((c) => c.label),
                        visibleIndices.map((i) => getCells(config.rows[i]))
                      )
                    }
                    className={actionBtnCls("neutral")}
                  >
                    <span className="inline-flex items-center gap-1.5"><Download size={ICON.md} strokeWidth={1.5} /> <span className="[@media(max-height:760px)]:hidden">Exportar</span></span>
                  </button>
                )}
                {config.hasInsertar && (
                  <button type="button" title="Insertar" aria-label="Insertar" onClick={handleAbrirAlta} className={actionBtnCls("neutral")}>
                    <span className="inline-flex items-center gap-1.5"><Plus size={ICON.sm} strokeWidth={1.5} /> <span className="[@media(max-height:760px)]:hidden">Insertar</span></span>
                  </button>
                )}
              </div>
            }
          />
          {showData && (
            <TableToolbar search={search} onSearchChange={setSearch} hideExport />
          )}

          {/* Contenedor de la tabla — mx-(--card-px) mb-4 con borde propio, sin línea
              entre él y el toolbar (proximidad, ver TableToolbar); sin datos
              no hay toolbar y suma mt-3 para no quedar pegado al header.
              Adentro: la línea de registro seleccionado, la tabla con
              scroll propio y el pie de paginación. */}
          <div className={`flex-1 min-h-0 mx-(--card-px) mb-4 flex flex-col border border-border rounded-sm overflow-hidden ${showData ? "" : "mt-3"}`}>
          {hasSelection && (
            <SelectionActionBar recordLabel={config.rows[selectedRow!][columnKeys[0]]} />
          )}

          {/* Header + Body — un solo <table> (thead+tbody), no dos divs
              flex separados: así el navegador mide el ancho de cada
              columna teniendo en cuenta header + TODAS las filas juntas
              (mismo criterio que la Tabla 4 de Consultas de interrupción),
              lo que además es la única forma de garantizar que header y
              filas queden alineados en columnas shrink-to-fit — con divs
              independientes por fila cada una mide su propio ancho por su
              cuenta y se desalinean entre sí.
              Cada columna de datos usa w-[1%] + whitespace-nowrap — el
              truco estándar de CSS para "esta columna no debe crecer, se
              achica a su contenido" en table-layout:auto (que además evita
              el wrap a dos líneas, ej. "SAN FERNANDO" en CDS7/Zona). La
              única columna SIN ese freno es el spacer vacío entre la
              última columna de datos y Acciones: al ser la única sin
              límite de ancho, absorbe ella sola todo el espacio sobrante
              de la fila. Acciones mantiene su ancho fijo (w-40), pegada a
              la derecha. */}
          <div
            ref={resultadosListRef}
            tabIndex={showData ? 0 : -1}
            onKeyDown={handleResultadosKeyDown}
            className={`flex-1 min-h-0 overflow-y-auto ${FOCUS_RING_INSET}`}
          >
            {!showData ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-text-faint">
                <Inbox size={ICON.xl} strokeWidth={1.25} />
                <p className="text-body-lg text-text-muted mt-1">
                  No hay resultados para los filtros aplicados
                </p>
                <p className="text-body-sm text-text-muted">
                  Completá los filtros y presioná{" "}
                  <span className="font-semibold text-secondary">Buscar</span>
                </p>
              </div>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    {columnas.map((c, ci) => (
                      <th key={c.key} className="sticky top-0 z-(--z-sticky) bg-fill-subtle-solid w-[1%] whitespace-nowrap px-4 py-2 text-left">
                        <SortableHeaderCell
                          label={c.label}
                          active={sortIdx === ci}
                          dir={sortDir}
                          onClick={() => toggleSort(ci)}
                        />
                      </th>
                    ))}
                    <th className="sticky top-0 z-(--z-sticky) bg-fill-subtle-solid" />
                    <th className="sticky top-0 z-(--z-sticky) bg-fill-subtle-solid w-40 whitespace-nowrap px-4 py-2 text-left text-heading-xs uppercase text-text-muted">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleIndices.map((i) => {
                    const row = config.rows[i];
                    const isSelected = selectedRow === i;
                    const isHovered = hoveredRow === i;
                    return (
                      <tr
                        key={i}
                        data-row-index={i}
                        onClick={() => setSelectedRow(isSelected ? null : i)}
                        onMouseEnter={() => setHoveredRow(i)}
                        onMouseLeave={() => setHoveredRow(null)}
                        className="border-b border-border-subtle cursor-pointer transition-colors duration-(--duration-fast)"
                        style={{ backgroundColor: isSelected ? "var(--color-primary-tint)" : isHovered ? "var(--color-fill-muted)" : undefined }}
                      >
                        {columnas.map((c, ci) => (
                          <td
                            key={c.key}
                            className={`w-[1%] whitespace-nowrap px-4 py-2.5 ${
                              c.mono ? "text-code font-mono tabular-nums" : isSelected ? "text-body text-secondary font-medium" : "text-body text-text"
                            }`}
                            style={{
                              ...(c.mono
                                ? {
                                    color: isSelected ? "var(--color-secondary)" : "var(--color-text)",
                                    fontWeight: isSelected ? 600 : 400,
                                  }
                                : undefined),
                              // Acento de selección en la primera celda, no
                              // en el <tr>: con border-collapse un borde
                              // puesto directo en la fila no renderiza de
                              // forma confiable en todos los navegadores.
                              borderLeft: ci === 0 ? (isSelected ? "3px solid var(--color-primary)" : "3px solid transparent") : undefined,
                            }}
                          >
                            {celda(row, c)}
                          </td>
                        ))}
                        {/* Spacer — celda vacía, sin ancho fijo: absorbe
                            sola todo el sobrante de la fila. */}
                        <td />
                        {/* Modificar/Borrar — con texto (no solo ícono,
                            ambiguo) siempre visibles por fila, ya no atados
                            a tener la fila seleccionada. stopPropagation:
                            no deben togglear la selección de la fila (eso
                            lo maneja el onClick del <tr>). */}
                        <td className="w-40 px-4 py-2.5">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleAbrirModificar(i); }}
                              className={ghostBtnCls("neutral")}
                            >
                              Modificar
                            </button>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleAbrirBorrar(i); }}
                              className={ghostBtnCls("destructive")}
                            >
                              Borrar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer */}
          {showData && (
            <div className="px-4 py-2 border-t border-border bg-fill-subtle rounded-b-md shrink-0 flex items-center justify-between">
              <span className="text-body-sm text-text">
                Registros encontrados:{" "}
                <span className="font-semibold text-secondary">
                  {formatNumero(config.totalRegistros)}
                </span>
              </span>
              <div className="flex items-center gap-2 text-body-sm text-text-muted">
                <button className={`${BTN_SM} border border-border-strong bg-surface hover:bg-fill-muted disabled:opacity-40 transition-colors`} disabled>
                  Anterior
                </button>
                <span>
                  Pág. <span className="font-medium text-text">1</span> de{" "}
                  <span className="font-medium text-text">{formatNumero(totalPages)}</span>
                </span>
                <button
                  className={`${BTN_SM} border border-border-strong bg-surface hover:bg-fill-muted disabled:opacity-40 transition-colors`}
                  disabled={totalPages <= 1}
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
          </div>
        </div>
  );
  // ── Layout "barra": Resultados sin card ───────────────────────────────
  // Sin la card de Resultados (ni su CardHeader): debajo de la barra de
  // búsqueda (gap --page-gap) van, en la misma vertical (--page-px):
  //   1. la barra de herramientas de la tabla — sobre el fondo, sin fondo ni
  //      borde propios, de alto fijo (--control-md) con dos modos que no
  //      cambian su alto: sin selección, solo el contador (sin buscador: el
  //      único buscador es la barra de búsqueda general);
  //      con selección, SelectionActionBar + Modificar / Borrar + ✕;
  //   2. a gap-2, la tabla en su propia caja — el mismo aspecto que dentro
  //      del panel Resultados del layout "split" (borde, radio md, surface,
  //      shadow-sm; thead fill-subtle-solid sticky; paginación al pie con
  //      fill-subtle). Sin overflow-hidden en la caja: el radio lo resuelven
  //      el wrapper con scroll (rounded-t-md, que recorta su contenido) y el
  //      pie (rounded-b-md).
  // Las acciones de registro existen SOLO con una fila seleccionada: no hay
  // columna de acciones por fila. Auditoría y Exportar: DEPRECADO en layout
  // barra — pendiente de reubicar (su código y handlers siguen en
  // resultadosCard, que usa el layout "split").
  const registrosVisibles = config.rows.length - filasBorradas.size;
  const hayResultados = showData && visibleIndices.length > 0;
  // Con algún filtro aplicado, el pie cuenta las filas encontradas; sin
  // filtros, el total de la tabla (como el split).
  const registrosEncontrados = hayFiltrosBarra ? visibleIndices.length : config.totalRegistros;
  const paginasBarra = Math.max(1, Math.ceil(registrosEncontrados / 25));
  const resultadosBarra = (
    <div className="flex-1 min-h-0 flex flex-col gap-2">
      {/* Barra de herramientas — afuera de la caja, alto fijo. */}
      <div className="shrink-0 h-(--control-md) flex items-center gap-3">
        {hasSelection ? (
          <SelectionActionBar
            bare
            recordLabel={config.rows[selectedRow!][columnKeys[0]]}
            actions={
              <>
                {/* Acciones de registro: sm, ghost (no compiten con la
                    barra de filtros, que es de página). */}
                <button type="button" onClick={() => handleAbrirModificar(selectedRow!)} className={ghostBtnCls("neutral")}>
                  Modificar
                </button>
                <button type="button" onClick={() => handleAbrirBorrar(selectedRow!)} className={ghostBtnCls("destructive")}>
                  Borrar
                </button>
                <div className="w-px h-4 bg-border shrink-0" />
                <button
                  type="button"
                  onClick={() => setSelectedRow(null)}
                  aria-label="Deseleccionar"
                  title="Deseleccionar"
                  className={`${ICON_BTN_SM} flex items-center justify-center rounded-sm text-icon hover:bg-fill-muted hover:text-text transition-colors`}
                >
                  <X size={ICON.sm} strokeWidth={1.5} />
                </button>
              </>
            }
          />
        ) : (
          // Un solo buscador: la pantalla ya tiene la barra de filtros, así
          // que la tabla no lleva buscador ni filtros propios — solo el
          // contador. Sin el input, el `search` de useTableToolbar queda
          // vacío (se resetea al cambiar de tabla), así que no filtra filas:
          // las visibles salen solo de la barra. El orden por columna se
          // mantiene. "N de M registros", o "0 registros" si los filtros no
          // dejan ninguno.
          <div className="shrink-0">
            {showData &&
              (visibleIndices.length > 0
                ? <TableCounter visibles={visibleIndices.length} total={registrosVisibles} />
                : <TableCounter visibles={0} />)}
          </div>
        )}
      </div>

      {/* Caja de la tabla — mismo aspecto que en el panel Resultados del split. */}
      <div className="shadow-sm flex-1 min-h-0 flex flex-col border border-border rounded-md bg-surface">
        <div
          ref={resultadosListRef}
          tabIndex={showData ? 0 : -1}
          onKeyDown={handleResultadosKeyDown}
          className={`flex-1 min-h-0 overflow-y-auto rounded-t-md ${hayResultados ? "" : "rounded-b-md"} ${FOCUS_RING_INSET}`}
        >
          {visibleIndices.length === 0 ? (
            // Los filtros no dejan filas — "Limpiar filtros" hace lo mismo
            // que el de la barra.
            <div className="h-full flex flex-col items-center justify-center gap-2 text-center px-8">
              <span className="text-text-faint scale-90"><Inbox size={ICON.xl} strokeWidth={1.25} /></span>
              <p className="text-label text-text-muted">No hay registros con estos filtros</p>
              <button type="button" onClick={handleLimpiarFiltrosBarra} className="text-label text-secondary hover:underline">
                Limpiar filtros
              </button>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  {columnas.map((c, ci) => (
                    <th key={c.key} className="sticky top-0 z-(--z-sticky) bg-fill-subtle-solid w-[1%] whitespace-nowrap px-4 py-2 text-left">
                      <SortableHeaderCell
                        label={c.label}
                        active={sortIdx === ci}
                        dir={sortDir}
                        onClick={() => toggleSort(ci)}
                      />
                    </th>
                  ))}
                  {/* Spacer — absorbe el sobrante de la fila. */}
                  <th className="sticky top-0 z-(--z-sticky) bg-fill-subtle-solid" />
                </tr>
              </thead>
              <tbody>
                {visibleIndices.map((i) => {
                  const row = config.rows[i];
                  const isSelected = selectedRow === i;
                  const isHovered = hoveredRow === i;
                  return (
                    <tr
                      key={i}
                      data-row-index={i}
                      onClick={() => setSelectedRow(isSelected ? null : i)}
                      onMouseEnter={() => setHoveredRow(i)}
                      onMouseLeave={() => setHoveredRow(null)}
                      className="border-b border-border-subtle cursor-pointer transition-colors duration-(--duration-fast)"
                      style={{ backgroundColor: isSelected ? "var(--color-primary-tint)" : isHovered ? "var(--color-fill-muted)" : undefined }}
                    >
                      {columnas.map((c, ci) => (
                        <td
                          key={c.key}
                          className={`w-[1%] whitespace-nowrap px-4 py-2.5 ${
                            c.mono ? "text-code font-mono tabular-nums" : isSelected ? "text-body text-secondary font-medium" : "text-body text-text"
                          } ${ci === 0 && isSelected ? "inset-shadow-row-selected" : ""}`}
                          style={
                            c.mono
                              ? {
                                  color: isSelected ? "var(--color-secondary)" : "var(--color-text)",
                                  fontWeight: isSelected ? 600 : 400,
                                }
                              : undefined
                          }
                        >
                          {celda(row, c)}
                        </td>
                      ))}
                      <td />
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Paginación — al pie, dentro de la caja. */}
        {hayResultados && (
          <div className="px-4 py-2 border-t border-border bg-fill-subtle rounded-b-md shrink-0 flex items-center justify-between">
            <span className="text-body-sm text-text">
              Registros encontrados:{" "}
              <span className="font-semibold text-secondary">
                {formatNumero(registrosEncontrados)}
              </span>
            </span>
            <div className="flex items-center gap-2 text-body-sm text-text-muted">
              <button className={`${BTN_SM} border border-border-strong bg-surface hover:bg-fill-muted disabled:opacity-40 transition-colors`} disabled>
                Anterior
              </button>
              <span>
                Pág. <span className="font-medium text-text">1</span> de{" "}
                <span className="font-medium text-text">{formatNumero(paginasBarra)}</span>
              </span>
              <button
                className={`${BTN_SM} border border-border-strong bg-surface hover:bg-fill-muted disabled:opacity-40 transition-colors`}
                disabled={paginasBarra <= 1}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Modal de edición (layout "barra"): el identificador del registro (el
  // campo de la primera columna de Resultados) va como label de contexto
  // arriba del título y no aparece en el body; los demás campos no
  // editables (camposReadonlyEnModificar y tipo "readonly") quedan en su
  // sección en estado read-only (AbmCampo `readOnly`), nunca disabled.
  const campoReferencia = config.mapeoFilaACampos[columnKeys[0]];
  const esNoEditable = (c: (typeof camposTabla)[number]) => c.tipo === "readonly" || camposLocked.includes(c.nombre);
  // Formulario horizontal en filas (FormRow): una lista continua con los
  // campos de la config en su orden (sin títulos de sección), sin el de la
  // referencia.
  const camposModificar = camposTabla.filter((c) => c.nombre !== campoReferencia);
  const referenciaModificar = selectedRow !== null ? config.rows[selectedRow][columnKeys[0]] : "";

  return (
    <>
      {/* Masthead — selector de tabla (hace de título) a la izquierda, período
          a la derecha. Único agregado condicional: el link "Volver" cuando
          se llegó acá por un deep-link (ver AbmDeepLink) — nada de Insertar
          ni dropdown genérico. */}
      <header
        className="flex items-center gap-3 px-6 border-b border-border bg-bg-app shrink-0"
        style={{ minHeight: "var(--header-min-height, 60px)" }}
      >
        {volverVisible && (
          <button
            type="button"
            onClick={onVolver}
            title="Volver a Consultas de interrupción"
            aria-label="Volver a Consultas de interrupción"
            className={`flex items-center justify-center ${ICON_BTN_SM} -ml-1.5 rounded-sm text-icon hover:text-secondary hover:bg-fill-muted transition-colors shrink-0`}
          >
            ←
          </button>
        )}
        <div className="flex-1 min-w-0">
          <AbmTableSelector value={tableKey} onChange={onChangeTable} />
        </div>
        <PeriodSelector />
      </header>

      {/* Content */}
      {esBarra ? (
        // Layout "barra" (PRUEBA, solo CDS2): barra de filtros híbrida
        // apoyada en el fondo + Resultados a ancho completo — mismo padding
        // y gap de página que Consultas de interrupción.
        <div className="flex-1 min-h-0 flex flex-col px-(--page-px) pt-(--page-pt) pb-(--page-pt) relative overflow-hidden">
          <div className="flex-1 min-h-0 flex flex-col gap-(--page-gap)">
            {filtrosBarra && (
              <ChipFilterBar
                id={idBarra}
                onIdChange={setIdBarra}
                idPlaceholder={filtrosBarra.id.placeholder}
                fijos={filtrosBarra.fijos}
                agregables={filtrosBarra.agregables}
                valores={filtrosBarraValores}
                onChange={(campo, v) => setFiltrosBarraValores((prev) => ({ ...prev, [campo]: v }))}
                onLimpiar={handleLimpiarFiltrosBarra}
              />
            )}
            {resultadosBarra}
          </div>
        </div>
      ) : (
      <div className="flex-1 flex overflow-hidden p-5 gap-5" key={mode}>

        {/* ── Left column: form ── */}
        <div
          // Tier 760px: el split pasa de 41/resto a ~47/resto — al revés que
          // en Interrupciones/Reposiciones (acá es Búsqueda la que le sobra
          // espacio a Resultados y necesita más ancho para acomodar más
          // columnas de campos, ver la sección de abajo). El ancho normal
          // (41%, inline) tiene prioridad de especificidad sobre una clase
          // sin `!important`, de ahí el `!w-[47%]`.
          className="shadow-sm flex flex-col rounded-md border border-border bg-surface shrink-0 overflow-hidden [@media(max-height:760px)]:!w-[47%]"
          style={{ width: "41%" }}
        >
          <CardHeader
            title={mode === "alta" ? "Insertando en" : mode === "modificar" ? "Modificando" : "Búsqueda"}
            tag={config.code}
          />
          <div className="flex-1 overflow-y-auto px-(--card-px) py-5 flex flex-col gap-5">
            {renderSecciones(config.secciones)}
          </div>

          <div className="shrink-0 border-t border-border px-(--card-px) py-4 flex gap-3">
            {mode === "buscar" ? (
              <>
                <button
                  onClick={handleLimpiar}
                  disabled={!showData}
                  className="flex-1 h-(--control-md) rounded-sm text-body font-medium border border-border-strong bg-surface text-text hover:bg-primary-tint hover:border-primary hover:text-secondary transition-[color,background-color,border-color,transform] duration-(--duration-base) active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
                >Limpiar</button>
                <button
                  onClick={handleBuscar}
                  disabled={showData}
                  className="flex-1 h-(--control-md) rounded-sm text-body font-medium text-white transition-[color,background-color,border-color,transform] duration-(--duration-base) active:scale-[0.99] bg-primary-strong hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
                >Buscar</button>
              </>
            ) : mode === "alta" ? (
              <>
                <button
                  onClick={handleCancelarAlta}
                  className="flex-1 h-(--control-md) rounded-sm text-body font-medium border border-border-strong bg-surface text-text hover:bg-primary-tint hover:border-primary hover:text-secondary transition-[color,background-color,border-color,transform] duration-(--duration-base) active:scale-[0.99]"
                >Cancelar</button>
                <button
                  onClick={handleGuardarAlta}
                  className="flex-1 h-(--control-md) rounded-sm text-body font-medium text-white transition-[color,background-color,border-color,transform] duration-(--duration-base) active:scale-[0.99] bg-primary-strong hover:bg-primary-hover"
                >Insertar</button>
              </>
            ) : (
              <>
                <button
                  onClick={handleCancelarModificar}
                  className="flex-1 h-(--control-md) rounded-sm text-body font-medium border border-border-strong bg-surface text-text hover:bg-primary-tint hover:border-primary hover:text-secondary transition-[color,background-color,border-color,transform] duration-(--duration-base) active:scale-[0.99]"
                >Cancelar</button>
                <button
                  onClick={handleGuardarModificar}
                  className="flex-1 h-(--control-md) rounded-sm text-body font-medium text-white transition-[color,background-color,border-color,transform] duration-(--duration-base) active:scale-[0.99] bg-primary-strong hover:bg-primary-hover"
                >Guardar</button>
              </>
            )}
          </div>
        </div>

        {resultadosCard}
      </div>
      )}

      {/* Layout "barra": Modificar en un modal de edición de registro (ver
          DESIGN_SYSTEM.md, "Modal de edición de registro"):
            - size "form" (640px), igual en los dos pasos;
            - header con label de contexto arriba del título (Carbon "modal
              label"): la referencia en mono + CopyButton xs; junto al
              título, "Paso N de 2";
            - paso 1 "Editar": formulario horizontal en filas (ver
              DESIGN_SYSTEM.md, "Formulario de edición"): un campo por
              FormRow — label a la izquierda, control a la derecha en una
              columna fija (--form-control-w; toggles a su ancho) —, en una
              lista continua sin títulos de sección. Los no editables
              (Origen, Tipo) en read-only. "Revisar cambios" se habilita
              solo con cambios respecto del registro original;
            - paso 2 "Revisar": RevisarCambiosContent (el mismo contenido
              de ConfirmarModificarModal, sin modal propio). Volver regresa
              al paso 1 con todo lo editado; Guardar (motivo válido) hace lo
              mismo que la confirmación del split y cierra;
            - Escape, ✕ y Cancelar cierran todo el flujo sin guardar. */}
      {esBarra && (
        <Modal
          title={config.barraBusqueda?.tituloModificar ?? "Modificar"}
          size="form"
          open={mode === "modificar"}
          onClose={handleCancelarModificar}
          paso={{ actual: pasoModificar, total: 2 }}
          label={
            <>
              <span className="min-w-0 truncate text-code font-mono tabular-nums text-text-muted">{referenciaModificar}</span>
              <CopyButton value={referenciaModificar} label={columnas[0].label.toLowerCase()} size="xs" />
            </>
          }
          footer={
            pasoModificar === 1 ? (
              <>
                <button type="button" onClick={handleCancelarModificar} className={modalNeutralBtnCls}>Cancelar</button>
                <button type="button" onClick={() => setPasoModificar(2)} disabled={camposModificados.length === 0} className={modalPrimaryBtnCls}>Revisar cambios</button>
              </>
            ) : (
              <>
                <button type="button" onClick={() => setPasoModificar(1)} className={modalNeutralBtnCls}>Volver</button>
                <button type="button" onClick={() => handleConfirmarModificar(motivoModificar.notaFinal)} disabled={!motivoModificar.notaFinal} className={modalPrimaryBtnCls}>Guardar</button>
              </>
            )
          }
        >
          <div ref={bodyModificarRef}>
            {pasoModificar === 1 ? (
              <div>
                {camposModificar.map((c) => {
                  const controlId = `modificar-${c.nombre}`;
                  const labelId = `${controlId}-label`;
                  return (
                    <FormRow
                      key={c.nombre}
                      label={c.label}
                      labelId={labelId}
                      htmlFor={controlId}
                      readOnly={esNoEditable(c)}
                      anchoControl={c.tipo === "toggle" ? "intrinseco" : "fijo"}
                    >
                      <AbmCampo
                        campo={c}
                        mode={mode}
                        value={valores[c.nombre]}
                        onChange={(v) => setValor(c.nombre, v)}
                        valoresFormulario={valores}
                        readOnly={esNoEditable(c)}
                        intrinseco
                        labelExterno={{ controlId, labelId }}
                      />
                    </FormRow>
                  );
                })}
              </div>
            ) : (
              <RevisarCambiosContent cambios={camposModificados} motivo={motivoModificar} />
            )}
          </div>
        </Modal>
      )}

      <ConfirmarBorrarModal
        open={filaABorrar !== null}
        registro={filaABorrar !== null ? config.rows[filaABorrar][config.columnasResultado[0].key] : ""}
        tabla={ABM_ITEMS.find((it) => it.screen === tableKey)?.label ?? config.titulo}
        onCancelar={handleCancelarBorrar}
        onConfirmar={handleConfirmarBorrar}
      />
      <ConfirmarModificarModal
        open={modalModificarAbierto}
        cambios={camposModificados}
        onCancelar={handleCancelarConfirmarModificar}
        onConfirmar={handleConfirmarModificar}
      />
    </>
  );
}
