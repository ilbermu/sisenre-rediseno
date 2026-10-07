import { crearRng, elegir, enteroEntre } from "@/data/rng";
import {
  cadenaCodeSintetica,
  CALLES_SINTETICAS,
  CAUSAS_NC,
  CDS3_ROWS,
  CDS3_TOTAL,
  CDS4_ROWS,
  CDS4_TOTAL,
  clienteIdSintetico,
  CODIGOS_FALLA_SINTETICOS,
  DESCRIPCIONES_EQUIPO_OPERADO,
  fechaSintetica,
  filasSinteticas,
  N_FILAS_SINTETICAS,
  NOMBRES_SINTETICOS,
  PARTIDO_LOCALIDAD,
  PARTIDOS,
  PARTIDOS_LOCALIDADES_SINTETICOS,
  recCodeSintetico,
  refInterrupcionSintetica,
  SAMPLE_ROWS,
  TOTAL_REGISTROS,
  ZONAS_CDS7,
} from "@/data/sinteticos";
import { AbmTableConfig, AbmTableKey } from "@/data/types";

// ─── ABM engine (config-driven) ────────────────────────────────────────────
// Motor generico para las 9 tablas ABM (CDS2..CDS9-NM). En vez de un
// componente por tabla, cada tabla es una entrada de ABM_TABLE_CONFIGS y
// AbmScreen renderiza formulario de busqueda + tabla de resultados + action
// bar contextual a partir de esa config. CDS2/CDS3/CDS4 quedan migradas a
// este motor reproduciendo exactamente su comportamiento actual; CDS5..CDS9NM
// son tablas nuevas relevadas de capturas de produccion.

export const ABM_TABLE_ORDER: AbmTableKey[] = ["cds2", "cds3", "cds4", "cds5", "cds6", "cds7", "cds8", "cds9", "cds9nm"];

export function isAbmTableKey(s: string): s is AbmTableKey {
  return (ABM_TABLE_ORDER as string[]).includes(s);
}

// Opciones de CDS2 compartidas entre el formulario y los filtros de la barra.
const OPCIONES_NIVEL = ["BT", "MT", "AT"];
const OPCIONES_FASE = ["R", "S", "T", "RS", "RT", "ST", "RST"];
const OPCIONES_ORIGEN = [{ value: "I", label: "Interno" }, { value: "E", label: "Externo" }];
const OPCIONES_TIPO = [{ value: "F", label: "Forzado" }, { value: "P", label: "Programado" }];

export const ABM_TABLE_CONFIGS: Record<AbmTableKey, AbmTableConfig> = {
  cds2: {
    key: "cds2",
    code: "CDS2",
    nombre: "Tabla 2",
    titulo: "Interrupciones",
    hasInsertar: false,
    // PRUEBA de layout — solo esta tabla. Ver AbmLayout.
    layout: "barra",
    barraBusqueda: {
      tituloModificar: "Modificar interrupción",
    },
    filtrosBarra: {
      id: { columna: "referencia", placeholder: "ID de interrupción" },
      fijos: [
        { campo: "fecha", label: "Fecha", chipLabel: "Fecha", editor: "fecha" },
        { campo: "nivel", label: "Nivel de tensión", chipLabel: "Nivel", editor: "lista", opciones: OPCIONES_NIVEL },
        { campo: "faseElectrica", label: "Fase eléctrica", chipLabel: "Fase", editor: "lista", opciones: OPCIONES_FASE },
        { campo: "origen", label: "Origen", chipLabel: "Origen", editor: "lista", opciones: OPCIONES_ORIGEN },
        { campo: "tipo", label: "Tipo", chipLabel: "Tipo", editor: "lista", opciones: OPCIONES_TIPO },
      ],
      agregables: [
        { campo: "codigoEquipoOperado", label: "Código equipo", chipLabel: "Cód. equipo", editor: "texto" },
        { campo: "descEquipoOperado", label: "Descripción equipo operado", soloValor: true, editor: "busqueda", opciones: DESCRIPCIONES_EQUIPO_OPERADO },
        { campo: "divisionRedNormal", label: "División red normal", chipLabel: "División", editor: "lista", opciones: ["Sí", "No"] },
        { campo: "cadenaElectricaAguasArriba", label: "Cadena eléctrica", chipLabel: "Cadena", editor: "texto" },
        { campo: "alimentadorMT", label: "Alimentador MT", chipLabel: "Alim. MT", editor: "texto" },
        { campo: "ctMtBtEquipoOperado", label: "CT MT/BT", chipLabel: "CT", editor: "texto" },
      ],
    },
    secciones: [
      {
        titulo: "Identificación",
        filas: [
          [
            { nombre: "codigoInterrupcion", label: "Código de interrupción", tipo: "texto", placeholder: "Ej: BFZ202607056849" },
            { nombre: "fecha", label: "Fecha", tipo: "fecha" },
          ],
        ],
      },
      {
        titulo: "Clasificación",
        // Orden Nivel, Fase, Origen, Tipo (no el orden "de lectura" Nivel/
        // Origen/Tipo/Fase) — en tamaño normal esta fila de 4 sigue en una
        // sola línea (gridTemplateColumns propio de AbmFila, no le importa
        // el orden), pero en tier 760px (grilla plana de 2 columnas, ver
        // AbmScreen) el wrap natural empareja de a 2 en el orden del
        // array: así entran (Nivel+Fase) y (Origen+Tipo), no (Nivel+Origen)
        // y (Tipo+Fase).
        filas: [
          [
            { nombre: "nivelTension", label: "Nivel de tensión", tipo: "toggle", opciones: OPCIONES_NIVEL },
            { nombre: "faseElectrica", label: "Fase eléctrica", tipo: "select", opciones: OPCIONES_FASE },
            { nombre: "origen", label: "Origen", tipo: "toggle", opciones: OPCIONES_ORIGEN },
            { nombre: "tipo", label: "Tipo", tipo: "toggle", opciones: OPCIONES_TIPO },
          ],
        ],
      },
      {
        titulo: "Datos de red",
        filas: [
          [
            { nombre: "codigoEquipoOperado", label: "Código de equipo operado", tipo: "texto" },
            { nombre: "descEquipoOperado", label: "Descripción equipo operado", tipo: "combobox", opciones: DESCRIPCIONES_EQUIPO_OPERADO, listaLarga: true },
          ],
          [
            { nombre: "divisionRedNormal", label: "División red normal?", tipo: "toggle", opciones: ["Sí", "No"] },
            { nombre: "cadenaElectricaAguasArriba", label: "Cadena eléctrica aguas arriba", tipo: "texto" },
          ],
          [
            { nombre: "alimentadorMT", label: "Alimentador MT", tipo: "texto" },
            { nombre: "ctMtBtEquipoOperado", label: "CT MT/BT del equipo operado", tipo: "texto" },
          ],
        ],
      },
    ],
    columnasResultado: [
      { key: "referencia", label: "Referencia", mono: true },
      { key: "fecha", label: "Fecha" },
    ],
    columnasResultadoBarra: [
      { key: "referencia", label: "Referencia", mono: true },
      { key: "fecha", label: "Fecha" },
      { key: "nivel", label: "Nivel" },
      { key: "faseElectrica", label: "Fase" },
      { key: "origen", label: "Origen", campo: "origen" },
      { key: "tipo", label: "Tipo", campo: "tipo" },
      { key: "codigoEquipoOperado", label: "Código de equipo operado", mono: true },
      { key: "alimentadorMT", label: "Alimentador MT" },
    ],
    mapeoFilaACampos: {
      referencia: "codigoInterrupcion",
      fecha: "fecha",
      nivel: "nivelTension",
      origen: "origen",
      tipo: "tipo",
      faseElectrica: "faseElectrica",
      codigoEquipoOperado: "codigoEquipoOperado",
      descEquipoOperado: "descEquipoOperado",
      divisionRedNormal: "divisionRedNormal",
      cadenaElectricaAguasArriba: "cadenaElectricaAguasArriba",
      alimentadorMT: "alimentadorMT",
      ctMtBtEquipoOperado: "ctMtBtEquipoOperado",
    },
    // origen/tipo se traducen de la etiqueta que usa SAMPLE_ROWS (compartida
    // con ModificarContent, que sí necesita "Interno"/"Forzado" tal cual)
    // al value de las opciones de este formulario ("I"/"E", "F"/"P").
    rows: SAMPLE_ROWS.map((r) => ({
      referencia: r.referencia,
      fecha: r.fecha,
      nivel: r.nivel,
      origen: r.origen === "Interno" ? "I" : "E",
      tipo: r.tipo === "Forzado" ? "F" : "P",
      faseElectrica: r.faseElectrica,
      codigoEquipoOperado: r.codigoEquipoOperado,
      descEquipoOperado: r.descEquipoOperado,
      divisionRedNormal: r.divisionRedNormal,
      cadenaElectricaAguasArriba: r.cadenaElectricaAguasArriba,
      alimentadorMT: r.alimentadorMT,
      ctMtBtEquipoOperado: r.ctMtBtEquipoOperado,
    })),
    totalRegistros: TOTAL_REGISTROS,
    exportFilename: "interrupciones",
    camposReadonlyEnModificar: ["codigoInterrupcion", "origen", "tipo"],
  },

  cds3: {
    key: "cds3",
    code: "CDS3",
    nombre: "Tabla 3",
    titulo: "Interrupciones no computables",
    hasInsertar: true,
    secciones: [
      {
        titulo: "Identificación",
        filas: [
          [
            { nombre: "codigoInterrupcion", label: "Código de interrupción", tipo: "texto", placeholder: "Ej: BPR202607059383" },
            { nombre: "faseReposicion", label: "Fase de reposición", tipo: "texto", placeholder: "1" },
          ],
        ],
      },
      {
        titulo: "Clasificación",
        filas: [[{ nombre: "causa", label: "Causa", tipo: "toggle", opciones: CAUSAS_NC, expandirBotones: true }]],
      },
    ],
    columnasResultado: [
      { key: "referencia", label: "Referencia", mono: true },
      { key: "fase", label: "Fase" },
    ],
    mapeoFilaACampos: { referencia: "codigoInterrupcion", fase: "faseReposicion", causa: "causa" },
    rows: CDS3_ROWS.map((r) => ({ referencia: r.referencia, fase: r.fase, causa: r.causa })),
    totalRegistros: CDS3_TOTAL,
    exportFilename: "interrupciones_no_computables",
    camposReadonlyEnModificar: ["codigoInterrupcion", "faseReposicion"],
  },

  cds4: {
    key: "cds4",
    code: "CDS4",
    nombre: "Tabla 4",
    titulo: "Reposiciones",
    hasInsertar: true,
    secciones: [
      {
        titulo: "Identificación",
        filas: [
          [
            { nombre: "codigoInterrupcion", label: "Código de interrupción", tipo: "texto", placeholder: "Ej: BPR202607059383" },
            { nombre: "faseReposicion", label: "Fase de reposición", tipo: "texto", placeholder: "1" },
          ],
          [
            { nombre: "fecha", label: "Fecha", tipo: "fecha" },
            { nombre: "faseElectrica", label: "Fase eléctrica", tipo: "texto", placeholder: "RST" },
          ],
        ],
      },
      {
        titulo: "Datos de red",
        filas: [
          [{ nombre: "codigoEquipoManiobrado", label: "Código del equipo maniobrado", tipo: "texto", placeholder: "@47309278" }],
          [{ nombre: "descEquipoManiobrado", label: "Descripción del equipo maniobrado", tipo: "texto", placeholder: "PROTECCION DE TOMA/ACOMETIDA" }],
          [
            { nombre: "cadenaElectricaAguasArriba", label: "Cadena eléctrica aguas arriba", tipo: "texto", placeholder: "NCBT" },
            { nombre: "alimentadorMT", label: "Alimentador MT", tipo: "texto", placeholder: "NCBT" },
          ],
          [
            { nombre: "cantidadClientesBt", label: "Cantidad de clientes BT repuestos", tipo: "texto", placeholder: "1" },
            { nombre: "ctMtBtManiobrado", label: "CT MT/BT maniobrado", tipo: "texto", placeholder: "NCBT" },
          ],
        ],
      },
    ],
    columnasResultado: [
      { key: "referencia", label: "Referencia", mono: true },
      { key: "fase", label: "Fase" },
      { key: "fecha", label: "Fecha" },
    ],
    mapeoFilaACampos: {
      referencia: "codigoInterrupcion",
      fase: "faseReposicion",
      fecha: "fecha",
      faseElectrica: "faseElectrica",
      codigoEquipoManiobrado: "codigoEquipoManiobrado",
      descEquipoManiobrado: "descEquipoManiobrado",
      cadenaElectricaAguasArriba: "cadenaElectricaAguasArriba",
      alimentadorMT: "alimentadorMT",
      cantidadClientesBt: "cantidadClientesBt",
      ctMtBtManiobrado: "ctMtBtManiobrado",
    },
    rows: CDS4_ROWS.map((r) => ({
      referencia: r.referencia,
      fase: r.fase,
      fecha: r.fecha,
      faseElectrica: r.faseElectrica,
      codigoEquipoManiobrado: r.codigoEquipoManiobrado,
      descEquipoManiobrado: r.descEquipoManiobrado,
      cadenaElectricaAguasArriba: r.cadenaElectricaAguasArriba,
      alimentadorMT: r.alimentadorMT,
      cantidadClientesBt: r.cantidadClientesBt,
      ctMtBtManiobrado: r.ctMtBtManiobrado,
    })),
    totalRegistros: CDS4_TOTAL,
    exportFilename: "reposiciones",
    camposReadonlyEnModificar: ["codigoInterrupcion", "faseReposicion"],
  },

  cds5: {
    key: "cds5",
    code: "CDS5",
    nombre: "Tabla 5",
    titulo: "Trafos MT/BT repuestos en interrupciones MT y AT",
    hasInsertar: true,
    secciones: [
      {
        titulo: "Identificación",
        filas: [[
          { nombre: "codigoInterrupcion", label: "Código de interrupción", tipo: "readonly", placeholder: "Ej: MFZ202401001157" },
          { nombre: "faseReposicion", label: "Fase de reposición", tipo: "readonly", placeholder: "1" },
        ]],
      },
      {
        titulo: "Datos del trafo",
        filas: [
          [
            { nombre: "cadenaElectrica", label: "Cadena eléctrica del trafo repuesto", tipo: "texto", placeholder: "50006#B1#50006-TR1" },
            { nombre: "potenciaKva", label: "Potencia en KVA del trafo", tipo: "texto", placeholder: "800" },
          ],
          [
            { nombre: "faseElectrica", label: "Fase eléctrica", tipo: "texto", placeholder: "RST" },
            { nombre: "cantidadClientesBt", label: "Cantidad de clientes BT repuestos", tipo: "texto", placeholder: "753" },
          ],
        ],
      },
    ],
    columnasResultado: [
      { key: "ref", label: "Ref", mono: true },
      { key: "f", label: "F" },
      { key: "cadena", label: "Cadena" },
    ],
    mapeoFilaACampos: {
      ref: "codigoInterrupcion",
      f: "faseReposicion",
      cadena: "cadenaElectrica",
      potenciaKva: "potenciaKva",
      faseElectrica: "faseElectrica",
      cantidadClientesBt: "cantidadClientesBt",
    },
    rows: (() => {
      const rng = crearRng(20250105);
      return filasSinteticas(N_FILAS_SINTETICAS, () => ({
        ref: refInterrupcionSintetica(rng, "2024"),
        f: String(enteroEntre(rng, 1, 5)),
        cadena: cadenaCodeSintetica(rng),
        potenciaKva: String(enteroEntre(rng, 100, 2000)),
        faseElectrica: elegir(rng, ["R", "S", "T", "RS", "RT", "ST", "RST"]),
        cantidadClientesBt: String(enteroEntre(rng, 1, 900)),
      }));
    })(),
    totalRegistros: 18942,
    exportFilename: "trafos_repuestos",
    camposReadonlyEnModificar: ["codigoInterrupcion", "faseReposicion"],
  },

  cds6: {
    key: "cds6",
    code: "CDS6",
    nombre: "Tabla 6",
    titulo: "Clientes AT/MT afectados en interrupciones MT/AT",
    hasInsertar: true,
    secciones: [
      {
        titulo: "Identificación",
        filas: [[
          { nombre: "codigoInterrupcion", label: "Código de interrupción", tipo: "readonly", placeholder: "Ej: MPR202401004095" },
          { nombre: "fase", label: "Fase", tipo: "readonly", placeholder: "1" },
        ]],
      },
      {
        titulo: "Cliente",
        filas: [
          [
            { nombre: "idComercialCliente", label: "Id. comercial del cliente", tipo: "texto", placeholder: "9933000000" },
            { nombre: "consumo", label: "Consumo", tipo: "readonly", placeholder: "1240" },
            { nombre: "ctTabla9", label: "CT (Tabla 9)", tipo: "readonly", placeholder: "50006#B1#50006-TR1" },
            { nombre: "ctTabla10", label: "CT (Tabla 10)", tipo: "readonly", placeholder: "50006#B1#50006-TR1" },
          ],
          [
            { nombre: "demandaMedia", label: "Demanda media del cliente (KW)", tipo: "texto", placeholder: "290" },
            { nombre: "tarifa", label: "Tarifa", tipo: "texto", placeholder: "3MT" },
            { nombre: "nivelTension", label: "Nivel de tensión", tipo: "texto", placeholder: "MT" },
          ],
        ],
      },
    ],
    columnasResultado: [
      { key: "ref", label: "Ref", mono: true },
      { key: "fase", label: "Fase" },
      { key: "cliente", label: "Cliente", mono: true },
    ],
    mapeoFilaACampos: {
      ref: "codigoInterrupcion",
      fase: "fase",
      cliente: "idComercialCliente",
      consumo: "consumo",
      ctTabla9: "ctTabla9",
      ctTabla10: "ctTabla10",
      demandaMedia: "demandaMedia",
      tarifa: "tarifa",
      nivelTension: "nivelTension",
    },
    rows: (() => {
      const rng = crearRng(20250106);
      const generadas = filasSinteticas(N_FILAS_SINTETICAS - 1, () => ({
        ref: refInterrupcionSintetica(rng, "2024"),
        fase: String(enteroEntre(rng, 1, 5)),
        cliente: clienteIdSintetico(rng),
        consumo: String(enteroEntre(rng, 50, 5000)),
        ctTabla9: cadenaCodeSintetica(rng),
        ctTabla10: cadenaCodeSintetica(rng),
        demandaMedia: String(enteroEntre(rng, 50, 900)),
        tarifa: elegir(rng, ["1MT", "2MT", "3MT", "4MT"]),
        nivelTension: elegir(rng, ["MT", "AT"]),
      }));
      // Fila fija — misma interrupción que usa DRAWER_TABS.tabla6 en el
      // drawer de Consultas de interrupción, para que el deep-link a
      // ABM/CDS6 encuentre y seleccione esta fila en destino.
      return [{
        ref: "MPR202401004095", fase: "1", cliente: "9933000000",
        consumo: "1240", ctTabla9: "50412#B1#50412-TR1", ctTabla10: "50413#B1#50413-TR1",
        demandaMedia: "310", tarifa: "3MT", nivelTension: "MT",
      }, ...generadas];
    })(),
    totalRegistros: 777,
    exportFilename: "clientes_mt_afectados",
    camposReadonlyEnModificar: ["codigoInterrupcion", "fase", "consumo", "ctTabla9", "ctTabla10"],
  },

  cds7: {
    key: "cds7",
    code: "CDS7",
    nombre: "Tabla 7",
    titulo: "Instalaciones MT",
    hasInsertar: true,
    secciones: [
      {
        titulo: "Identificación",
        filas: [
          [
            { nombre: "alimentadorMT", label: "Alimentador MT", tipo: "texto", placeholder: "NCBT" },
            { nombre: "subestacion", label: "Subestación", tipo: "texto", placeholder: "SE NORTE" },
          ],
          [{ nombre: "zona", label: "Zona", tipo: "toggle", opciones: ZONAS_CDS7, expandirBotones: true }],
        ],
      },
      {
        titulo: "Datos del alimentador",
        filas: [
          [
            { nombre: "cantClientes", label: "Cantidad de clientes del alimentador", tipo: "texto", placeholder: "1250" },
            { nombre: "cantTrafos", label: "Cantidad de trafos MT/BT del alimentador", tipo: "texto", placeholder: "48" },
          ],
          [
            { nombre: "sumaPotenciaTrafos", label: "Suma potencia media trafos MT/BT del alimentador", tipo: "texto", placeholder: "3200" },
            { nombre: "demandaMaxima", label: "Demanda máxima", tipo: "texto", placeholder: "2800" },
          ],
          [
            { nombre: "sumaPotenciaClientesMT", label: "Suma potencia media clientes MT del alimentador", tipo: "texto", placeholder: "450" },
            { nombre: "capacidadAlimentador", label: "Capacidad del alimentador", tipo: "texto", placeholder: "4000" },
          ],
          [
            { nombre: "tensionAlimentador", label: "Tensión del alimentador", tipo: "texto", placeholder: "13.2" },
            { nombre: "longitudAlimentador", label: "Longitud del alimentador", tipo: "texto", placeholder: "28.4" },
          ],
        ],
      },
    ],
    columnasResultado: [
      { key: "alim", label: "Alim", mono: true },
      { key: "zona", label: "Zona" },
      { key: "ssee", label: "SSEE" },
    ],
    mapeoFilaACampos: {
      alim: "alimentadorMT",
      zona: "zona",
      ssee: "subestacion",
      cantClientes: "cantClientes",
      cantTrafos: "cantTrafos",
      sumaPotenciaTrafos: "sumaPotenciaTrafos",
      demandaMaxima: "demandaMaxima",
      sumaPotenciaClientesMT: "sumaPotenciaClientesMT",
      capacidadAlimentador: "capacidadAlimentador",
      tensionAlimentador: "tensionAlimentador",
      longitudAlimentador: "longitudAlimentador",
    },
    rows: (() => {
      const rng = crearRng(20250107);
      return filasSinteticas(N_FILAS_SINTETICAS, () => ({
        alim: String(enteroEntre(rng, 5000, 5999)),
        zona: elegir(rng, ZONAS_CDS7),
        ssee: String(enteroEntre(rng, 100, 299)),
        cantClientes: String(enteroEntre(rng, 200, 3000)),
        cantTrafos: String(enteroEntre(rng, 5, 120)),
        sumaPotenciaTrafos: String(enteroEntre(rng, 500, 6000)),
        demandaMaxima: String(enteroEntre(rng, 400, 5000)),
        sumaPotenciaClientesMT: String(enteroEntre(rng, 50, 900)),
        capacidadAlimentador: String(enteroEntre(rng, 2000, 8000)),
        tensionAlimentador: elegir(rng, ["13.2", "33"]),
        longitudAlimentador: (enteroEntre(rng, 50, 600) / 10).toFixed(1),
      }));
    })(),
    totalRegistros: 2034,
    exportFilename: "instalaciones_mt",
  },

  cds8: {
    key: "cds8",
    code: "CDS8",
    nombre: "Tabla 8",
    titulo: "Reclamos de clientes",
    hasInsertar: false,
    secciones: [
      {
        titulo: "Reclamo",
        filas: [
          [
            { nombre: "idReclamo", label: "Identificador del reclamo", tipo: "readonly", placeholder: "R-2024-01-00001" },
            { nombre: "interrupcion", label: "Interrupción", tipo: "texto", placeholder: "MFZ202401001496" },
            { nombre: "reclamos", label: "Reclamos", tipo: "readonly", placeholder: "3" },
          ],
          [
            { nombre: "fechaReclamo", label: "Fecha reclamo", tipo: "fecha" },
            { nombre: "codigoFalla", label: "Código falla", tipo: "texto", placeholder: "Otros" },
          ],
        ],
      },
      {
        titulo: "Cliente",
        filas: [
          [
            { nombre: "nroPoliza", label: "Nro póliza", tipo: "readonly", placeholder: "123456" },
            { nombre: "nombre", label: "Nombre", tipo: "texto", placeholder: "MENDEZ MONICA ISABEL" },
            { nombre: "tarifa", label: "Tarifa", tipo: "texto", placeholder: "1R" },
          ],
          [
            { nombre: "calle", label: "Calle", tipo: "texto", placeholder: "SALTA" },
            { nombre: "nro", label: "Nro", tipo: "texto", placeholder: "666" },
            { nombre: "piso", label: "Piso", tipo: "texto", placeholder: "1" },
            { nombre: "depto", label: "Depto.", tipo: "texto", placeholder: "A" },
          ],
          [
            { nombre: "partido", label: "Partido", tipo: "select", opciones: PARTIDOS, limpiaAlCambiar: ["localidad"], listaLarga: true },
            { nombre: "localidad", label: "Localidad", tipo: "combobox", opciones: (valores: Record<string, string>) => PARTIDO_LOCALIDAD[valores.partido] ?? [], listaLarga: true, emptyMessage: "Sin opciones — seleccioná Partido primero" },
          ],
        ],
      },
    ],
    columnasResultado: [
      { key: "rec", label: "Rec", mono: true },
      { key: "ref", label: "Ref", mono: true },
    ],
    mapeoFilaACampos: {
      rec: "idReclamo",
      ref: "interrupcion",
      reclamos: "reclamos",
      fechaReclamo: "fechaReclamo",
      codigoFalla: "codigoFalla",
      nroPoliza: "nroPoliza",
      nombre: "nombre",
      tarifa: "tarifa",
      calle: "calle",
      nro: "nro",
      piso: "piso",
      depto: "depto",
      partido: "partido",
      localidad: "localidad",
    },
    rows: (() => {
      const rng = crearRng(20250108);
      return filasSinteticas(N_FILAS_SINTETICAS, () => {
        const domicilio = elegir(rng, PARTIDOS_LOCALIDADES_SINTETICOS);
        return {
          rec: recCodeSintetico(rng),
          ref: refInterrupcionSintetica(rng, "2024"),
          reclamos: String(enteroEntre(rng, 1, 9)),
          fechaReclamo: fechaSintetica(rng, 1, 2024),
          codigoFalla: elegir(rng, CODIGOS_FALLA_SINTETICOS),
          nroPoliza: String(enteroEntre(rng, 100000, 999999)),
          nombre: elegir(rng, NOMBRES_SINTETICOS),
          tarifa: elegir(rng, ["1R", "1G", "2", "3"]),
          calle: elegir(rng, CALLES_SINTETICAS),
          nro: String(enteroEntre(rng, 100, 4999)),
          piso: elegir(rng, ["", "1", "2", "3", "PB"]),
          depto: elegir(rng, ["", "A", "B", "C"]),
          partido: domicilio.partido,
          localidad: domicilio.localidad,
        };
      });
    })(),
    totalRegistros: 104681,
    exportFilename: "reclamos",
    camposReadonlyEnModificar: ["idReclamo", "reclamos", "nroPoliza"],
  },

  cds9: {
    key: "cds9",
    code: "CDS9",
    nombre: "Tabla 9",
    titulo: "Interrupciones por cliente",
    hasInsertar: true,
    secciones: [
      {
        titulo: "Identificación",
        filas: [
          [
            { nombre: "codigoInterrupcion", label: "Código de interrupción", tipo: "readonly", placeholder: "Ej: MFZ202401001157" },
            { nombre: "fase", label: "Fase", tipo: "readonly", placeholder: "1" },
          ],
          [
            { nombre: "cliente", label: "Cliente", tipo: "readonly", placeholder: "3190897997" },
            { nombre: "tarifa", label: "Tarifa", tipo: "select", opciones: ["1AP", "1G", "1R", "2", "3AT", "3BT", "3MT"] },
          ],
          [{ nombre: "ct", label: "CT", tipo: "texto", placeholder: "19649#B1#19649-TR1" }],
        ],
      },
    ],
    columnasResultado: [
      { key: "ref", label: "Ref", mono: true },
      { key: "f", label: "F" },
      { key: "cliente", label: "Cliente", mono: true },
    ],
    mapeoFilaACampos: { ref: "codigoInterrupcion", f: "fase", cliente: "cliente", tarifa: "tarifa", ct: "ct" },
    rows: (() => {
      const rng = crearRng(20250109);
      const generadas = filasSinteticas(N_FILAS_SINTETICAS - 1, () => ({
        ref: refInterrupcionSintetica(rng, "2024"),
        f: String(enteroEntre(rng, 1, 5)),
        cliente: clienteIdSintetico(rng),
        tarifa: elegir(rng, ["1AP", "1G", "1R", "2", "3AT", "3BT", "3MT"]),
        ct: cadenaCodeSintetica(rng),
      }));
      // Fila fija — misma interrupción que usa DRAWER_TABS.tabla9 en el
      // drawer de Consultas de interrupción, para que el deep-link a
      // ABM/CDS9 encuentre y seleccione esta fila en destino.
      return [{
        ref: "MFZ202401001157", f: "4", cliente: "3190897997",
        tarifa: "1R", ct: "19649#B1#19649-TR1",
      }, ...generadas];
    })(),
    totalRegistros: 2318952,
    exportFilename: "interrupciones_por_cliente",
    camposReadonlyEnModificar: ["codigoInterrupcion", "fase", "cliente"],
  },

  cds9nm: {
    key: "cds9nm",
    code: "CDS9-NM",
    nombre: "Tabla 9 NM",
    titulo: "Interrupciones por cliente NM",
    hasInsertar: true,
    secciones: [
      {
        titulo: "Identificación",
        filas: [
          [
            { nombre: "codigoInterrupcion", label: "Código de interrupción", tipo: "texto", placeholder: "Ej: BFZ202607056849" },
            { nombre: "fase", label: "Fase", tipo: "texto", placeholder: "1" },
          ],
          [
            { nombre: "cliente", label: "Cliente", tipo: "texto", placeholder: "0932073585" },
            { nombre: "tarifa", label: "Tarifa", tipo: "select", opciones: ["1AP", "1G", "1R", "2", "3AT", "3BT", "3MT"] },
          ],
        ],
      },
    ],
    columnasResultado: [
      { key: "ref", label: "Ref", mono: true },
      { key: "f", label: "F" },
      { key: "cliente", label: "Cliente", mono: true },
    ],
    mapeoFilaACampos: { ref: "codigoInterrupcion", f: "fase", cliente: "cliente", tarifa: "tarifa" },
    rows: (() => {
      const rng = crearRng(20250110);
      return filasSinteticas(N_FILAS_SINTETICAS, () => ({
        ref: refInterrupcionSintetica(rng, "2026"),
        f: String(enteroEntre(rng, 1, 5)),
        cliente: clienteIdSintetico(rng),
        tarifa: elegir(rng, ["1AP", "1G", "1R", "2", "3AT", "3BT", "3MT"]),
      }));
    })(),
    totalRegistros: 58,
    exportFilename: "interrupciones_por_cliente_nm",
    camposReadonlyEnModificar: ["codigoInterrupcion", "fase", "cliente"],
  },
};
