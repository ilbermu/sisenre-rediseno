import { FaseRow } from "@/data/types";

export const CAMBIA_FASES_ROWS_INIT: FaseRow[] = [
  { fase: 1, fecha: "01/07/2026 00:43", idElemento: "@27947890", tipoElemento: "Proteccion de Toma/Acometida", cadena: "52705#B1#52705-TR1#1#3", cliente: 1 },
  { fase: 2, fecha: "01/07/2026 00:52", idElemento: "@27947891", tipoElemento: "Proteccion de Suministro", cadena: "52705#B1#52705-TR1#1#4", cliente: 3 },
  { fase: 1, fecha: "01/07/2026 01:10", idElemento: "@27947892", tipoElemento: "Proteccion de Toma/Acometida", cadena: "52705#B1#52705-TR1#1#5", cliente: 2 },
];

// ─── Modal: Alta de clientes ────────────────────────────────────────────────
export const ALTA_CLIENTES_ROWS = [
  { interrupcion: "BFZ202607056849", repo: 1, cadenaCuenta: "52705#B1#52705-TR1#1#3", t4: 1, t6: 0, t9: 1, t10: 107 },
];

// ─── Gestor de notas ────────────────────────────────────────────────────────

export const NOTAS_INICIALES = [
  "INCONSISTENCIA DE AFECTACION",
  "SUPERPOSICION CON OTRA INTERRUPCION",
  "NO CORRESPONDE INTERRUPCION/ AFECTACION",
  "INTERRUPCION NO CREADA POR CALCULO",
  "CORRESPONDE A INSTALACION CLIENTE/ MENOR A 3 MINUTOS",
  "INTERRUPCION CREADA A PARTIR DE RECLAMO",
  "INTERRUPCION POR OM EC O FM",
  "DATOS INCOMPLETOS/ INCORRECTOS",
  "TIPO O NIVEL DE TENSION DE LA INTERRUPCION INCORRECTOS",
].map((texto, i) => ({ id: `n${i + 1}`, texto, posicion: i + 1 }));

// ─── Reporte de auditoría ───────────────────────────────────────────────────

export const USUARIOS_SISENRE_DEMO = [
  "ALEGHISSA", "APOZZER", "BLOPONTE", "BMABDALLAH", "CGLOAZZO", "CONSULTA_SISENRE",
  "DJAHNEL", "DLAZZARI", "EROMANELLO", "EVINTRIAGO", "FSCANDIZZO", "ICALVET",
  "LALVANO", "LCALABRESE", "LGUERINI", "LORIVAS", "LRICLE", "LSTIVANELLO",
]; // lista de ejemplo — reemplazar por el listado real de usuarios SISENRE cuando lo tengamos
