import { AbmTableKey, Screen } from "@/data/types";

// ─── Data ────────────────────────────────────────────────────────────────────

// Los 9 hijos de ABM no llevan ícono propio en el sidebar — el lápiz queda
// solo en la fila padre "Alta, Baja y Modificación". Etiqueta simplificada
// a "Tabla N" (sin badge de código) en vez del nombre descriptivo + CDS. El
// nombre completo + badge siguen intactos en el masthead del panel al
// entrar (ver AbmScreen/AbmTableSelector).
export const ABM_ITEMS: { code: string; label: string; screen?: Screen; key?: string }[] = [
  { code: "CDS2",  label: "Tabla 2",    screen: "cds2" },
  { code: "CDS3",  label: "Tabla 3",    screen: "cds3" },
  { code: "CDS4",  label: "Tabla 4",    screen: "cds4" },
  { code: "CDS5",  label: "Tabla 5",    screen: "cds5" },
  { code: "CDS6",  label: "Tabla 6",    screen: "cds6" },
  { code: "CDS7",  label: "Tabla 7",    screen: "cds7" },
  { code: "CDS8",  label: "Tabla 8",    screen: "cds8" },
  { code: "CDS9",  label: "Tabla 9",    screen: "cds9" },
  { code: "CDS9",  label: "Tabla 9 NM", screen: "cds9nm", key: "CDS9b" },
];

export const PERIODS = ["Agosto 2026","Julio 2026","Junio 2026","Mayo 2026","Abril 2026"];

const NOTA_PRESETS = ["Procesar Lotes", "Test 2", "Test 3", "Alta manual / Modifico", "2da Alta Manual"];
export const NOTA_OPCIONES = [...NOTA_PRESETS, "Otra (especificar)"];

// Solo label/alert/tabKey son estáticos — el "value" que se muestra en
// cada tarjeta se recalcula por interrupción seleccionada (ver
// generarTablasRelacionadas más abajo), no es un dato fijo del ítem.
export const STATUS_ITEMS = [
  { label: "TABLA 3", alert: false, tabKey: "tabla3" },
  { label: "TABLA 5", alert: false, tabKey: "tabla5" },
  { label: "TABLA 6", alert: false, tabKey: "tabla6" },
  { label: "TABLA 8", alert: false, tabKey: "tabla8" },
  { label: "TABLA 9", alert: false, tabKey: "tabla9" },
];

export const DRAWER_TABS = [
  {
    key: "tabla4", label: "Tabla 4",
    subtitle: "Reposiciones",
    // ⚠ "Fase" acá es la fase ELÉCTRICA de la reposición (R/S/T/RS/RT/ST/
    // RST) — no confundir con la columna "Fase" de Tabla 5/6/9 (más abajo
    // en este mismo array), que guarda el NÚMERO de reposición. Mismo
    // nombre, dos significados distintos dentro del drawer — reportado,
    // sin resolver a propósito (ver mensaje de entrega).
    cols: ["Reposición", "Hora reposición", "Fase", "Equipo", "Usuarios BT"],
    filtrables: [] as string[],
    // Sin uso — Card B arma sus propias filas via generarFasesSinteticas,
    // acá solo quedan cols/subtitle/key/label.
    rows: [] as string[][],
  },
  {
    key: "tabla3", label: "Tabla 3",
    subtitle: "Existencia en tabla",
    cols: ["Existencia"],
    filtrables: [] as string[],
    rows: [] as string[][],
  },
  {
    key: "tabla5", label: "Tabla 5",
    subtitle: "Transformadores MT/BT repuestos en interrupciones AT/MT (Tabla 5)",
    cols: ["Interrupción", "Fase", "Cadena eléctrica", "Potencia (Kva)", "Fase eléctrica", "Cant. clientes BT"],
    // Columnas con FilterTrigger en el toolbar del modal (por nombre de `cols`).
    filtrables: ["Fase eléctrica"],
    // Buscador = columnas de `cols` que NO están en `filtrables`. Con 3+
    // columnas buscables el placeholder es obligatorio (si no, se arma solo:
    // "Buscar {col}…" / "Buscar {col1} o {col2}…").
    searchPlaceholder: "Buscar interrupción o cadena…",
    // Sin uso — ModificarContent arma las filas via generarFilasTabla5,
    // acá solo quedan cols/subtitle/key/label.
    rows: [] as string[][],
  },
  {
    key: "tabla6", label: "Tabla 6",
    subtitle: "Clientes AT/MT afectados en interrupciones AT/MT (Tabla 6)",
    cols: ["Interrupción", "Fase", "Cliente", "Consumo", "CT T9", "CT T10", "Tarifa", "Demanda media", "Tensión"],
    filtrables: ["Tarifa", "Tensión", "CT T9", "CT T10"],
    searchPlaceholder: "Buscar interrupción o cliente…",
    // Sin uso — ModificarContent arma las filas via generarFilasTabla6.
    rows: [] as string[][],
  },
  {
    key: "tabla8", label: "Tabla 8",
    subtitle: "Reclamos de clientes (Tabla 8)",
    cols: ["Reclamo", "Fecha", "Cliente", "Nombre", "Tarifa", "Causa", "Piso", "Dpto", "Partido"],
    filtrables: ["Tarifa", "Causa", "Partido"],
    searchPlaceholder: "Buscar reclamo, cliente o nombre…",
    // Sin uso — ModificarContent arma las filas via generarFilasTabla8.
    rows: [] as string[][],
  },
  {
    key: "tabla9", label: "Tabla 9",
    subtitle: "Interrupciones por cliente (Tabla 9)",
    cols: ["Interrupción", "Fase", "Cliente", "Tarifa", "CT T9", "CT T10"],
    filtrables: ["Tarifa", "CT T9", "CT T10"],
    searchPlaceholder: "Buscar interrupción o cliente…",
    // Sin uso — ModificarContent arma las filas via generarFilasTabla9.
    rows: [] as string[][],
  },
];

// Mapeo de tabs del drawer "Tablas relacionadas" a su tabla ABM equivalente
// — solo los 4 tabs acotados a la interrupción actual (CDS5/6/8/9); tabla3
// y tabla4 no tienen equivalente en el motor ABM y quedan sin mapeo.
// `campoCodigoInterrupcion` es el `nombre` del campo de búsqueda a precargar
// en destino; `columnaCodigoInterrupcion` es la key de columnasResultado
// usada para encontrar y seleccionar la fila correspondiente.
export const DRAWER_TAB_TO_ABM: Partial<Record<string, { tableKey: AbmTableKey; campoCodigoInterrupcion: string; columnaCodigoInterrupcion: string }>> = {
  tabla5: { tableKey: "cds5", campoCodigoInterrupcion: "codigoInterrupcion", columnaCodigoInterrupcion: "ref" },
  tabla6: { tableKey: "cds6", campoCodigoInterrupcion: "codigoInterrupcion", columnaCodigoInterrupcion: "ref" },
  tabla8: { tableKey: "cds8", campoCodigoInterrupcion: "interrupcion", columnaCodigoInterrupcion: "ref" },
  tabla9: { tableKey: "cds9", campoCodigoInterrupcion: "codigoInterrupcion", columnaCodigoInterrupcion: "ref" },
};
