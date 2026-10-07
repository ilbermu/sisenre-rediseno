export type FaseRow = { fase: number; fecha: string; idElemento: string; tipoElemento: string; cadena: string; cliente: number };

// Fila de la lista de Reposiciones (Tabla 4/CDS4) — campos con nombre en vez
// de string[][], para que ReposicionesLista pueda renderizar código y
// descripción del equipo por separado sin depender de posiciones de array.
export type FaseReposicion = {
  nro: number;
  horaRep: string;
  fase: string;
  equipoCodigo: string;
  equipoDesc: string;
  usuariosBT: number;
};

// Reclamos recibidos durante la interrupción seleccionada — mismo criterio
// de semilla = referencia. Devuelve inicio/fin de la interrupción y el
// instante de cada reclamo, en minutos desde el inicio (ver
// ReclamosTimeline). Duración sesgada a pocas horas, con cortes largos
// (días) ocasionales. Cantidad según la distribución real (agosto 2026:
// 54% 1 reclamo, 40% 2, 4,8% 3-15, 1,5% 16-337), con las colas un poco
// infladas para que las 40 filas de muestra cubran los cuatro casos del
// gráfico: ~10% sin reclamos; del resto 50% 1, 35% 2, 10% 3-15, 5% 16-400.
// La curva típica: arranca rápido, pica al rato y decae.
export type ReclamosInterrupcion = { inicio: Date; fin: Date; minutos: number[] };

export type AbmTableKey = "cds2" | "cds3" | "cds4" | "cds5" | "cds6" | "cds7" | "cds8" | "cds9" | "cds9nm";

// Modo del panel: "buscar" (default), "alta" (formulario de Insertar) o
// "modificar" (formulario de Modificar, disparado desde la action bar de
// selección). Alta y modificar comparten el mismo tratamiento visual del
// panel de resultados (atenuado/deshabilitado).
export type AbmMode = "buscar" | "alta" | "modificar";

// Deep-link hacia una tabla ABM con un campo precargado — usado por el
// modal "Tablas relacionadas" de Modificar interrupción para saltar
// directo a CDS5/6/8/9 con la interrupción actual ya cargada. `modo:
// "buscar"` precarga el campo, ejecuta la búsqueda y selecciona la fila que
// matchea `columna`/`valor` en los resultados; `modo: "alta"` precarga el
// campo y entra directo en modo Insertar.
export type AbmDeepLink = {
  tableKey: AbmTableKey;
  campo: string; // nombre del campo de camposBusqueda a precargar
  columna: string; // columna de `rows` usada para encontrar la fila a seleccionar
  valor: string;
  modo: "buscar" | "alta";
  // Tab del modal "Tablas relacionadas" desde el que se disparó el
  // deep-link — usado solo para reabrirlo al volver a Consultas.
  relTabOrigen?: string;
  // Referencia (SAMPLE_ROWS) de la interrupción que se estaba mirando en
  // Consultas al disparar el deep-link — usada por "Volver" para
  // restaurar exactamente esa selección, no solo la pantalla.
  referenciaOrigen?: string;
  // Número de reposición (.nro) seleccionado en Consultas al disparar el
  // deep-link — usado junto con referenciaOrigen para que "Volver"
  // restaure la reposición exacta, no siempre la primera.
  reposicionOrigen?: number;
};

export type CampoOpcion = string | { value: string; label: string };
export type CampoTipo = "texto" | "select" | "fecha" | "readonly" | "toggle" | "combobox";

export type CampoBusqueda = {
  nombre: string;
  label: string;
  tipo: CampoTipo;
  // Función en vez de array fijo: opciones en cascada que dependen de otro
  // campo del mismo formulario (ver AbmCampo, que la resuelve pasándole
  // `valoresFormulario`) — sin acoplar el nombre del campo del que depende
  // ni la tabla a este tipo.
  opciones?: CampoOpcion[] | ((valores: Record<string, string>) => CampoOpcion[]);
  placeholder?: string;
  // Ancho solo se aplica cuando el campo va solo en su fila (fila de 1).
  ancho?: string;
  // Nombres de otros campos que se vacían cuando este campo cambia de
  // valor — típicamente el campo dependiente de una cascada (ver
  // `opciones` función), para que no quede un valor huérfano que ya no es
  // una opción válida del campo dependiente.
  limpiaAlCambiar?: string[];
  // Solo aplica a tipo "toggle", en una fila donde es el único campo (sin
  // nada más para acompañarlo, ver Causa en CDS3): en vez del criterio
  // default (shrink-to-fit + espacio en blanco aceptado a la derecha), los
  // botones se reparten el 100% del ancho de la fila entre los dos, como
  // si fueran un input.
  expandirBotones?: boolean;
  // "select"/"combobox" con ~20+ opciones (Partido, Localidad, Descripción
  // equipo operado): el panel inline deja de ser usable, así que ValuePicker
  // lo abre como modal centrado con buscador en vez de panel junto al
  // trigger — el resto del chrome (trigger, fila de opción, hover/selected)
  // es el mismo panel inline que cualquier select/combobox corto.
  listaLarga?: boolean;
  // Mensaje de "sin opciones" a medida (ej. Localidad antes de elegir
  // Partido) — default genérico si no se especifica.
  emptyMessage?: string;
};

type SeccionBusqueda = {
  titulo: string;
  // Cada fila tiene 1 o 2 campos — 2 campos se renderizan en grid-cols-2,
  // 1 campo ocupa el ancho completo (o `ancho` si se especifica).
  filas: CampoBusqueda[][];
};

type ColumnaResultado = {
  key: string;
  label: string;
  // Sin width/align: la tabla de Resultados es un <table> real donde cada
  // columna siempre se ajusta a su propio contenido (shrink-to-fit,
  // alineada a la izquierda) — ver AbmScreen.
  mono?: boolean;
  // Nombre de un campo del formulario cuyas `opciones` traducen el value
  // crudo de la fila a su etiqueta (ej. origen "I" → "Interno"). Sin esto,
  // la celda muestra el value tal cual.
  campo?: string;
};

// Un filtro de la barra de filtros del ABM (ChipFilterBar): el campo
// (`nombre` de `secciones`) y cómo se presenta su chip. El editor, las
// opciones y las dependencias salen del campo, sin cambios: texto/readonly
// → texto ("contiene"); toggle/select → lista; combobox → lista con
// búsqueda; fecha → rango con hora.
export type AbmFiltroBarra = {
  campo: string;
  // Nombre completo (menú "Agregar filtro", editor, title del chip). Default:
  // el label del campo.
  label?: string;
  // Nombre corto del chip (máx. ~10 caracteres). Default: `label`.
  chipLabel?: string;
  // El chip muestra solo el valor (valores que se explican solos).
  soloValor?: boolean;
};

export type AbmFiltrosBarra = {
  // Placeholder del input de ID. Default: el label de `campoId`.
  idPlaceholder?: string;
  // Chips siempre visibles: la fecha (si la tabla tiene) y los campos de
  // lista cerrada (toggle, select).
  fijos: AbmFiltroBarra[];
  // El resto, con "Agregar filtro".
  agregables: AbmFiltroBarra[];
};

export type AbmTableConfig = {
  key: AbmTableKey;
  // Código interno de la tabla (CDS2…): datos, exportaciones, nombres de
  // archivo y tooltip del selector. No se muestra como nombre en la UI.
  code: string;
  // Nombre visible de la tabla ("Tabla 2"… "Tabla 9 NM", los del menú
  // lateral, ABM_ITEMS): tags, badges, selector.
  nombre: string;
  titulo: string;
  hasInsertar: boolean;
  // Título del modal de Modificar. Default "Modificar en {nombre}".
  tituloModificar?: string;
  // Campo (`nombre` de `secciones`) que identifica el registro: va en el
  // input de ID de la barra ("contiene") y, si está bloqueado en Modificar,
  // en el modal lleva botón copiar.
  campoId: string;
  filtrosBarra: AbmFiltrosBarra;
  secciones: SeccionBusqueda[];
  // Columnas de Resultados (tabla a ancho completo): campoId primero (mono),
  // la fecha si hay, los campos de los chips fijos y 1 o 2 de contexto.
  // Una columna con `campo` muestra la etiqueta de la opción.
  columnasResultadoBarra: ColumnaResultado[];
  rows: Record<string, string>[];
  totalRegistros: number;
  exportFilename: string;
  // Nombres de campo (los mismos `nombre` de camposBusqueda) que quedan no
  // editables en modo Modificar. Reusa el mismo tratamiento visual de
  // "readonly" ya usado en el formulario de búsqueda — independiente del
  // `tipo` que ese campo tenga en modo búsqueda/alta (p. ej. en CDS2 el
  // código de interrupción es editable al buscar pero se bloquea al
  // modificar).
  camposReadonlyEnModificar?: string[];
  // Mapeo columna de `rows` → nombre de campo de `secciones`: precarga el
  // modal de Modificar, traduce los filtros de la barra a columnas y arma
  // la fila nueva de Insertar.
  mapeoFilaACampos: Record<string, string>;
};

// screens: login → select → welcome → (tabla ABM) → modificar
export type Screen = "login" | "select" | "welcome" | "modificar" | AbmTableKey
  | "generaciontxt" | "planillaconsolidada" | "gestornotas" | "insertaclientes" | "auditoria";
