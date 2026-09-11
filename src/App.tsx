import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { DayPicker, useDayPicker, type ChevronProps } from "react-day-picker";
import { es } from "date-fns/locale";
import Logo from "@/imports/Logo/index";
import imgLoginBg from "@/imports/Login/032e40ba72541a29aef64c7150d660b7f04d7948.png";

// ─── Icons ───────────────────────────────────────────────────────────────────

const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IcoTable = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <rect x="1.5" y="2.5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M1.5 6h12M5.5 6v6.5" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);
const IcoZap = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M8.5 1.5L3.5 8.5H7.5L6.5 13.5L12.5 6.5H8.5L9.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IcoZapOff = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M8.5 1.5L3.5 8.5H7.5L6.5 13.5L12.5 6.5H8.5L9.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2.5 1.5" />
  </svg>
);
const IcoRefresh = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M12.5 7.5a5 5 0 1 1-1.4-3.5L12.5 2v4h-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IcoCpu = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <rect x="3.5" y="3.5" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" />
    <path d="M5.5 1v2M9.5 1v2M5.5 12v2M9.5 12v2M1 5.5h2M12 5.5h2M1 9.5h2M12 9.5h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const IcoUsers = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M1 13c0-2.8 2.2-4.5 5-4.5s5 1.7 5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M10.5 4a2 2 0 0 1 0 4M13.5 13c0-2.3-1.4-3.8-3-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const IcoBuilding = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <rect x="1.5" y="2.5" width="8" height="11" rx="1" stroke="currentColor" strokeWidth="1.2" />
    <path d="M9.5 6.5h2.5a1 1 0 0 1 1 1v5H9.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M4.5 5.5h2M4.5 8.5h2M4.5 11.5h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const IcoMsg = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M13 9a2 2 0 0 1-2 2H5L2 13.5V3.5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2V9z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);
const IcoFile = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M8.5 1.5H3.5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6L8.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M8.5 1.5V6h3.5M4.5 8.5h6M4.5 11h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const IcoEdit = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M10.5 2a1.41 1.41 0 0 1 2 2L4 12.5l-3 .5.5-3L10.5 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);
const IcoClipboard = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <rect x="2.5" y="2.5" width="10" height="11" rx="1" stroke="currentColor" strokeWidth="1.2" />
    <path d="M5.5 2.5V1.5h4v1M5.5 6.5h4M5.5 9.5h2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const IcoUserPlus = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M1 13c0-2.8 2.2-4.5 5-4.5S11 10.2 11 13M11.5 6v4M9.5 8h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const IcoShield = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M7.5 1.5L2.5 3.5v4c0 3 2.5 5.5 5 6 2.5-.5 5-3 5-6v-4L7.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);
const IcoCalendar = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <rect x="1.5" y="2.5" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M1.5 6.5h12M5 1.5v2M10 1.5v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const IcoSearch = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.25" />
    <path d="M10 10L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const IcoX = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const IcoFilter = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
    <path d="M4 5h12M6.5 10h7M9 15h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
const IcoInbox = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect x="6" y="12" width="32" height="24" rx="3" stroke="currentColor" strokeWidth="1.4" />
    <path d="M6 26h8l3 4h10l3-4h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 8h12M22 5v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const IcoUser = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="7.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M2.5 13.5c0-3 2.3-4.5 5-4.5s5 1.5 5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const IcoSettings = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M7.5 1v2M7.5 12v2M1 7.5h2M12 7.5h2M3.2 3.2l1.4 1.4M10.4 10.4l1.4 1.4M3.2 11.8l1.4-1.4M10.4 4.6l1.4-1.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const IcoLogOut = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M5.5 2H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h2.5M10 10.5l3-3-3-3M13 7.5H6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IcoPlus = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M6.5 1.5v9.5M1.75 6.25h9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
const IcoDownload = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M7.5 2v7.5M4.5 6.5L7.5 9.5l3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 11.5v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const IcoChevronsUp = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M2.5 7l4-4 4 4M2.5 11l4-4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IcoChevronsDown = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M2.5 2l4 4 4-4M2.5 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IcoExternalLink = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M5 2H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8M8 1h4v4M7 6l4.5-4.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IcoHome = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M2 7.5L7.5 2l5.5 5.5M3.5 6v6.5a1 1 0 0 0 1 1h2v-4h2v4h2a1 1 0 0 0 1-1V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Data ────────────────────────────────────────────────────────────────────

// Los 9 hijos de ABM no llevan ícono propio en el sidebar — el lápiz queda
// solo en la fila padre "Alta, Baja y Modificación". Etiqueta simplificada
// a "Tabla N" (sin badge de código) en vez del nombre descriptivo + CDS. El
// nombre completo + badge siguen intactos en el masthead del panel al
// entrar (ver AbmScreen/AbmTableSelector).
const ABM_ITEMS: { code: string; label: string; screen?: Screen; key?: string }[] = [
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

const OTROS_ITEMS: { label: string; icon: React.ReactNode; screen: Screen }[] = [
  { label: "Generación de txt",    icon: <IcoFile />,      screen: "generaciontxt" },
  { label: "Planilla consolidada", icon: <IcoClipboard />, screen: "planillaconsolidada" },
  { label: "Gestor de notas",      icon: <IcoEdit />,      screen: "gestornotas" },
  { label: "Inserta clientes",     icon: <IcoUserPlus />,  screen: "insertaclientes" },
  { label: "Auditoría",            icon: <IcoShield />,    screen: "auditoria" },
];

const PERIODS = ["Agosto 2026","Julio 2026","Junio 2026","Mayo 2026","Abril 2026"];

// ─── Generador de datos sintéticos (semilla fija) ──────────────────────────
// Reemplaza los arrays hardcodeados de 1-5 filas por ~40 filas por tabla,
// con forma realista por tipo de campo (códigos de interrupción, fases,
// tarifas, zonas, fechas, etc.), reusando los mismos valores/patrones ya
// vistos en las capturas de producción relevadas (OLIVOS/MORON, prefijos
// BFZ/AFZ/BPR/MFZ/MPR, cadenas "NNNNN#B1#NNNNN-TR1", etc.). El PRNG
// (mulberry32) es determinístico dada una semilla fija — el contenido no
// cambia entre cargas de la página. Sin sentido relacional entre tablas:
// alcanza con que cada una se vea creíble individualmente.

function crearRng(semilla: number) {
  let s = semilla >>> 0;
  return function rng() {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// Hash determinístico (FNV-1a) de un string a un entero de 32 bits — para
// poder usar un texto (ej. la referencia de una interrupción) como semilla
// de crearRng. Mismo texto → mismo entero, siempre.
function hashSemilla(texto: string): number {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function elegir<T>(rng: () => number, opciones: T[]): T {
  return opciones[Math.floor(rng() * opciones.length)];
}
function enteroEntre(rng: () => number, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}
function ceros(n: number, ancho: number): string {
  return String(n).padStart(ancho, "0");
}
function filasSinteticas<T>(n: number, gen: () => T): T[] {
  return Array.from({ length: n }, gen);
}

const N_FILAS_SINTETICAS = 40;
// Zonas reales de Instalaciones MT (CDS7) — 4 valores, no confundir con los
// 25 partidos que usa CDS8 (Reclamos de clientes).
const ZONAS_CDS7 = ["NORTE", "MORON", "OLIVOS", "PILAR"];

// Código de interrupción con el patrón real (ej. BFZ202607056849,
// AFZ202401000404) — `anio` elige el estilo "2026" (CDS2/3/4/9-NM, como en
// las capturas originales) o "2024" (CDS5/6/8/9, como en las capturas de
// producción relevadas para esas tablas).
function refInterrupcionSintetica(rng: () => number, anio: "2026" | "2024"): string {
  const prefijo = elegir(rng, ["BFZ", "AFZ", "BPR", "MFZ", "MPR"]);
  const yyyymm = anio === "2026" ? "202607" : "202401";
  return `${prefijo}${yyyymm}${ceros(enteroEntre(rng, 0, 999999), 6)}`;
}
function fechaSintetica(rng: () => number, mes: number, anio: number): string {
  const dia = ceros(enteroEntre(rng, 1, 28), 2);
  const hh = ceros(enteroEntre(rng, 0, 23), 2);
  const mm = ceros(elegir(rng, [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]), 2);
  return `${dia}/${ceros(mes, 2)}/${anio} ${hh}:${mm}`;
}
function clienteIdSintetico(rng: () => number): string {
  return String(enteroEntre(rng, 1000000000, 9999999999));
}
function cadenaCodeSintetica(rng: () => number): string {
  const n = enteroEntre(rng, 50000, 50999);
  return `${n}#B1#${n}-TR1`;
}
function recCodeSintetico(rng: () => number): string {
  return `R-2024-${ceros(enteroEntre(rng, 1, 12), 2)}-${ceros(enteroEntre(rng, 10000, 99999), 5)}`;
}
// Código de equipo (ej. "@27947890") — CDS2/CDS4, equipo operado/maniobrado.
function equipoCodeSintetico(rng: () => number): string {
  return `@${enteroEntre(rng, 10000000, 99999999)}`;
}

// Valores reales de "Descripción equipo operado" / "Descripción equipo
// maniobrado" (CDS2/CDS4), tal cual la base — no normalizados salvo
// mayúsculas/espacios (dos entradas que difieren en una letra real,
// SECCIONAALIZADOR vs SECCIONALIZADOR, se mantienen separadas a propósito).
const DESCRIPCIONES_EQUIPO_OPERADO: string[] = [
  "CABLE - SIN DATOS", "CAJA CARENCIADA MONOFÁSICA", "CAJA CARENCIADA TRIFÁSICA",
  "CAJA DE FUSIBLES APR", "CONCÉNTRICO", "FUSIBLE LIRA C/SECCION",
  "INTERRUPTOR DE GENERADOR", "LAC", "LAPE", "LLAVE SECC. C/F.C/FRONT.ANILLO",
  "LLAVE SECCIONADORA C/ FUSIBLES", "LÍNEA - SIN DATOS", "MD CLIENTE MT",
  "MD SECC BAJO CARGA C/FUSIBLE", "MD SECCIONADOR BAJO CARGA",
  "MONOPOSTE CARENCIADO", "NODO DE CAJA DE DISTRIBUCION", "PILAR",
  "PILAR DOBLE", "PROTECCION DE SUMINISTRO", "PROTECCION DE TOMA/ACOMETIDA",
  "PUENTE", "SALIDA BT DE CT", "SECC. AUTODESC. B/C UNIPOLAR",
  "SECC. PUENTE B/CARGA UNIPOLAR", "SECCIONALIZADOR UNIPOLAR", "SECO",
  "SUMINISTRO", "TIPO_ELE", "TOMA I DOBLE", "TOMA I HASTA 60 A.",
  "TOMA II HASTA 200 A.", "TOMA III", "UNI AT INTERRUPTOR",
  "UNI AT SECCIONADOR", "UNI MT CARRO", "UNI MT INT. C/PROT TEMPORAL",
  "UNI MT INT. C/PROTECCIÓN", "UNI MT INTERRUPTOR", "UNI MT RECONECTADOR",
  "UNI MT RECONECTADOR UNIPOLAR", "UNI MT SECC. AUTODESCONECTADOR",
  "UNI MT SECC. BAJO CARGA", "UNI MT SECC. BAJO CARGA C/FUS.",
  "UNI MT SECCIONAALIZADOR", "UNI MT SECCIONADOR",
  "UNI MT SECCIONADOR BAJO CARGA", "UNI MT SECCIONALIZADOR",
];
const NOMBRES_SINTETICOS = [
  "MENDEZ MONICA ISABEL",
  "GONZALEZ RAUL ALBERTO",
  "FERNANDEZ LAURA BEATRIZ",
  "RODRIGUEZ JORGE OMAR",
  "MARTINEZ ANA PAULA",
  "LOPEZ CARLOS ALBERTO",
  "PEREZ SILVIA GRACIELA",
  "GOMEZ DIEGO HERNAN",
  "SANCHEZ MARIA EUGENIA",
  "ROMERO WALTER DANIEL",
];
const CALLES_SINTETICAS = [
  "SALTA", "MITRE", "SAN MARTIN", "BELGRANO", "RIVADAVIA",
  "SARMIENTO", "MORENO", "AVELLANEDA", "9 DE JULIO", "LAS HERAS",
];
const PARTIDOS_LOCALIDADES_SINTETICOS = [
  { partido: "LA MATANZA", localidad: "LOMAS DEL MIRADOR" },
  { partido: "MORON", localidad: "CASTELAR" },
  { partido: "SAN ISIDRO", localidad: "BOULOGNE" },
  { partido: "TIGRE", localidad: "DON TORCUATO" },
  { partido: "VICENTE LOPEZ", localidad: "OLIVOS" },
  // "GRAL SAN MARTIN" (no "SAN MARTIN" a secas) — así coincide con la key
  // real de PARTIDO_LOCALIDAD que alimenta el select de Partido en CDS8.
  { partido: "GRAL SAN MARTIN", localidad: "VILLA BALLESTER" },
];
// Mapeo Partido -> Localidad (datos reales NEXUS_GIS). Cada Localidad
// pertenece a un unico Partido segun este mapeo; alimenta el combobox en
// cascada Partido -> Localidad de CDS8. No mergear ni excluir partidos:
// son categorias reales de Edenor (incluye NORTE y las 3 variantes de
// Capital Federal como entradas separadas, tal cual la base).
const PARTIDO_LOCALIDAD: Record<string, string[]> = {
  "3 DE FEBRERO": ["11 DE SEPTIEMBRE", "C J LOMAS DEL PALOMAR", "CASEROS", "CHURRUCA", "CIUDADELA", "COLEGIO MILITAR", "EJCTO MILITAR (TF)", "EL LIBERTADOR", "JOSE INGENIEROS", "LOMA HERMOSA", "MARTIN CORONADO", "PABLO PODESTA", "REMEDIOS DE ESCALADA", "SAENZ PEÑA", "SANTOS LUGARES", "VILLA BOSCH", "VILLA RAFFO"],
  "CAPITAL FEDERAL": ["11 DE SEPTIEMBRE", "AGRONOMIA", "AYACUCHO", "BELGRANO", "BERNARDO MONTEAGUDO", "C J LOMAS DEL PALOMAR", "C JARDIN EL LIBERTADOR", "C LIBERTADOR SAN MARTÍN", "CASEROS", "CHACABUCO", "CHACARITA", "CIUDADELA", "CNEL JOSE ZAPIOLA", "COGHLAN", "COLEGIALES", "COLEGIO MILITAR", "EJCTO MILITAR (TF)", "EL LIBERTADOR", "GDEROS DE SAN MARTÍN", "GRAL EUGENIO NECOCHEA", "GRAL JOSE DE SUCRE", "GRAL JOSE TOMAS GUIDO", "GREGORIA MATORRAS", "JOSE INGENIEROS", "JOSE LEON SUAREZ", "JUAN GREGORIO LAS HERAS", "JUAN M DE PUEYRREDON", "LA PATERNAL", "LOMA HERMOSA", "MARTIN CORONADO", "NUÑEZ", "PABLO PODESTA", "PALERMO", "PARQUE SAN LORENZO", "PTE F ALCORTA", "RECOLETA", "REMEDIOS DE ESCALADA", "SAAVEDRA", "SAENZ PEÑA", "SAN ANDRES", "SANTOS LUGARES", "VILLA BALLESTER", "VILLA BOSCH", "VILLA CRESPO", "VILLA DEVOTO", "VILLA LIBERTAD", "VILLA LYNCH", "VILLA MAIPU", "VILLA ORTUZAR", "VILLA PUEYRREDON", "VILLA PUEYRREDÓN", "VILLA RAFFO", "VILLA URQUIZA", "YAPEYU"],
  "CIUDAD AUTONOMA DE BS": ["AGRONOMIA", "BELGRANO", "CHACARITA", "COGHLAN", "COLEGIALES", "LA PATERNAL", "NUÑEZ", "PALERMO", "RECOLETA", "SAAVEDRA", "VILLA CRESPO", "VILLA ORTUZAR", "VILLA PUEYRREDON", "VILLA URQUIZA"],
  "CIUDAD AUTONOMA DE BS AS": ["AGRONOMIA", "BELGRANO", "CHACARITA", "COGHLAN", "COLEGIALES", "LA PATERNAL", "NUÑEZ", "PALERMO", "RECOLETA", "SAAVEDRA", "VILLA CRESPO", "VILLA DEVOTO", "VILLA ORTUZAR", "VILLA PUEYRREDON", "VILLA URQUIZA"],
  "ESCOBAR": ["BENAVIDEZ", "DELTA 1RA SECCION (ES)", "ESCOBAR", "GARIN", "INGENIERO MASCHWITZ", "LOMA VERDE", "MAQUINISTA SAVIO", "MATHEU"],
  "GRAL LAS HERAS": ["GRAL LAS HERAS"],
  "GRAL RODRIGUEZ": ["GRAL RODRIGUEZ"],
  "GRAL SAN MARTIN": ["AYACUCHO", "BERNARDO MONTEAGUDO", "BILLINGHURST", "BO PARQUE SAN MARTIN", "C JARDIN EL LIBERTADOR", "C LIBERTADOR SAN MARTIN", "C LIBERTADOR SAN MARTÍN", "CHACABUCO", "CNEL JOSE ZAPIOLA", "GDEROS DE SAN MARTIN", "GDEROS DE SAN MARTÍN", "GODOY CRUZ", "GRAL EUGENIO NECOCHEA", "GRAL JOSE DE SUCRE", "GRAL JOSE TOMAS GUIDO", "GREGORIA MATORRAS", "JOSE LEON SUAREZ", "JUAN GREGORIO LAS HERAS", "JUAN M DE PUEYRREDON", "M REMEDIOS DE ESCALADA", "MARQUES A DE AGUADO", "PARQUE SAN LORENZO", "PTE F ALCORTA", "SAN ANDRES", "SAN MARTIN", "VILLA BALLESTER", "VILLA LIBERTAD", "VILLA LYNCH", "VILLA MAIPU", "YAPEYU"],
  "HURLINGHAM": ["HURLINGHAM", "VILLA TESEI", "WILLIAM MORRIS"],
  "ITUZAINGO": ["ITUZAINGO", "VILLA UDAONDO"],
  "JOSE C PAZ": ["JOSE C PAZ"],
  "LA MATANZA": ["20 DE JUNIO", "ALDO BONZI", "CIUDAD EVITA", "GONZALEZ CATAN", "GREGORIO DE LAFERRERE", "ISIDRO CASANOVA", "LA TABLADA", "LOMAS DEL MIRADOR", "RAFAEL CASTILLO", "RAMOS MEJIA", "SAN JUSTO", "TAPIALES", "VILLA LUZURIAGA", "VILLA MADERO", "VIRREY DEL PINO"],
  "MALVINAS ARGENTINAS": ["ADOLFO SOURDEAUX", "EL TRIANGULO", "GRAND BOURG", "LOS POLVORINES", "MALVINAS ARGENTINAS", "PABLO NOGUES", "TIERRAS ALTAS", "TORTUGUITAS", "VILLA DE MAYO"],
  "MARCOS PAZ": ["MARCOS PAZ"],
  "MERLO": ["LIBERTAD", "MARIANO ACOSTA", "MERLO", "PONTEVEDRA", "SAN ANTONIO DE PADUA"],
  "MORENO": ["CUARTEL V", "FRANCISCO ALVAREZ", "LA REJA", "MORENO", "PASO DEL REY", "TRUJUI"],
  "MORON": ["20 DE JUNIO", "ALDO BONZI", "CASTELAR", "CIUDAD EVITA", "EL PALOMAR", "GONZALEZ CATAN", "GRAL LAS HERAS", "GREGORIO DE LAFERRERE", "HAEDO", "HURLINGHAM", "ISIDRO CASANOVA", "ITUZAINGO", "LA TABLADA", "LIBERTAD", "LOMAS DEL MIRADOR", "MARCOS PAZ", "MARIANO ACOSTA", "MERLO", "MORON", "PONTEVEDRA", "RAFAEL CASTILLO", "RAMOS MEJIA", "SAN ANTONIO DE PADUA", "SAN JUSTO", "TAPIALES", "VILLA LUZURIAGA", "VILLA MADERO", "VILLA SARMIENTO", "VILLA TESEI", "VILLA UDAONDO", "VIRREY DEL PINO", "WILLIAM MORRIS"],
  "NORTE": ["11 DE SEPTIEMBRE", "AGRONOMIA", "AYACUCHO", "BELGRANO", "BERNARDO MONTEAGUDO", "BILLINGHURST", "BO PARQUE SAN MARTIN", "C J LOMAS DEL PALOMAR", "C JARDIN EL LIBERTADOR", "C LIBERTADOR SAN MARTÍN", "CASEROS", "CHACABUCO", "CHACARITA", "CHURRUCA", "CIUDADELA", "CNEL JOSE ZAPIOLA", "COGHLAN", "COLEGIALES", "COLEGIO MILITAR", "EJCTO MILITAR (TF)", "EL LIBERTADOR", "GDEROS DE SAN MARTÍN", "GODOY CRUZ", "GRAL EUGENIO NECOCHEA", "GRAL JOSE DE SUCRE", "GRAL JOSE TOMAS GUIDO", "GREGORIA MATORRAS", "JOSE INGENIEROS", "JOSE LEON SUAREZ", "JUAN GREGORIO LAS HERAS", "JUAN M DE PUEYRREDON", "LA PATERNAL", "LOMA HERMOSA", "M REMEDIOS DE ESCALADA", "MARQUES A DE AGUADO", "MARTIN CORONADO", "NUÑEZ", "PABLO PODESTA", "PALERMO", "PARQUE SAN LORENZO", "PTE F ALCORTA", "RECOLETA", "REMEDIOS DE ESCALADA", "SAAVEDRA", "SAENZ PEÑA", "SAN ANDRES", "SANTOS LUGARES", "VILLA BALLESTER", "VILLA BOSCH", "VILLA CRESPO", "VILLA DEVOTO", "VILLA LIBERTAD", "VILLA LYNCH", "VILLA MAIPU", "VILLA ORTUZAR", "VILLA PUEYRREDÓN", "VILLA RAFFO", "VILLA URQUIZA", "YAPEYU"],
  "OLIVOS": ["ACASSUSO", "BECCAR", "BENAVIDEZ", "BOULOGNE", "CARAPACHAY", "CIUDAD DE TIGRE", "DELTA 1RA SECCION (ES)", "DELTA 1RA SECCION (TI)", "DELTA 2DA SECCION (SF)", "DELTA 3RA SECCION (SF)", "DIQUE LUJAN", "DON TORCUATO", "EL TALAR", "ESCOBAR", "FLORIDA", "FLORIDA (OESTE)", "GARIN", "GENERAL PACHECO", "INGENIERO MASCHWITZ", "LA LUCILA", "LOMA VERDE", "MAQUINISTA SAVIO", "MARTINEZ", "MATHEU", "MUNRO", "NORDELTA", "OLIVOS", "RICARDO ROJAS", "RINCON DE MILBERG", "SAN FERNANDO", "SAN ISIDRO", "TRONCOS DEL TALAR", "VICENTE LOPEZ", "VICTORIA", "VILLA ADELINA (SI)", "VILLA ADELINA (VL)", "VILLA MARTELLI", "VIRREYES"],
  "PILAR": ["ADOLFO SOURDEAUX", "BELLA VISTA", "CAMPO DE MAYO", "CUARTEL V", "DEL VISO", "EL TRIANGULO", "FATIMA", "FRANCISCO ALVAREZ", "GRAL RODRIGUEZ", "GRAND BOURG", "JOSE C PAZ", "LA LONJA", "LA REJA", "LOS POLVORINES", "LUIS LAGOMARSINO", "MALVINAS ARGENTINAS", "MANUEL ALBERTI", "MANZANARES", "MORENO", "MUÑIZ", "PABLO NOGUES", "PASO DEL REY", "PILAR", "PTE DERQUI", "SAN MIGUEL", "TIERRAS ALTAS", "TORTUGUITAS", "TRUJUI", "VILLA ASTOLFI", "VILLA DE MAYO", "VILLA ROSA", "ZELAYA"],
  "SAN FERNANDO": ["CIUDAD DE TIGRE", "DELTA 2DA SECCION (SF)", "DELTA 3RA SECCION (SF)", "SAN FERNANDO", "VICTORIA", "VIRREYES"],
  "SAN ISIDRO": ["ACASSUSO", "BECCAR", "BOULOGNE", "FATIMA", "MARTINEZ", "SAN ISIDRO", "VILLA ADELINA (SI)", "VILLA TESEI"],
  "SAN MIGUEL": ["BELLA VISTA", "CAMPO DE MAYO", "MUÑIZ", "SAN MIGUEL"],
  "TIGRE": ["BENAVIDEZ", "CIUDAD DE TIGRE", "DELTA 1RA SECCION (TI)", "DIQUE LUJAN", "DON TORCUATO", "EL TALAR", "GENERAL PACHECO", "NORDELTA", "RICARDO ROJAS", "RINCON DE MILBERG", "SAN FERNANDO", "TRONCOS DEL TALAR"],
  "VICENTE LOPEZ": ["CARAPACHAY", "FATIMA", "FLORIDA", "FLORIDA (OESTE)", "LA LUCILA", "MUNRO", "OLIVOS", "VICENTE LOPEZ", "VILLA ADELINA (VL)", "VILLA MARTELLI"],
};
const PARTIDOS: string[] = Object.keys(PARTIDO_LOCALIDAD);
const CODIGOS_FALLA_SINTETICOS = [
  "Otros", "Rotura de conductor", "Falla en transformador",
  "Descarga atmosférica", "Vandalismo", "Sobrecarga",
];

// Sample rows — CDS2
// fase/origen/tipo/nivel — no son columnas de la tabla CDS2 (que solo
// muestra Referencia/Fecha), pero viven en cada fila para poder
// autocompletar el formulario de Búsqueda al seleccionar una interrupción
// en la tabla (ver ModificarContent). Los valores coinciden con las
// opciones reales de cada campo del formulario (R/S/T.../Interno-Externo/
// Forzado-Programado/BT-MT-AT).
// El resto de los campos (faseElectrica en adelante) no los usa
// ModificarContent — solo existen para poder autocompletar el resto del
// formulario de Búsqueda del motor ABM (CDS2) al seleccionar una fila (ver
// ABM_TABLE_CONFIGS.cds2.mapeoFilaACampos).
const SAMPLE_ROWS = (() => {
  const rng = crearRng(20260702);
  return filasSinteticas(N_FILAS_SINTETICAS, () => ({
    referencia: refInterrupcionSintetica(rng, "2026"),
    fecha: fechaSintetica(rng, 7, 2026),
    fase: elegir(rng, ["R", "S", "T", "RS", "RT", "ST", "RST"]),
    origen: elegir(rng, ["Interno", "Externo"]),
    tipo: elegir(rng, ["Forzado", "Programado"]),
    nivel: elegir(rng, ["BT", "MT", "AT"]),
    faseElectrica: elegir(rng, ["R", "S", "T", "RST"]),
    codigoEquipoOperado: equipoCodeSintetico(rng),
    descEquipoOperado: elegir(rng, DESCRIPCIONES_EQUIPO_OPERADO),
    divisionRedNormal: elegir(rng, ["Sí", "No"]),
    cadenaElectricaAguasArriba: cadenaCodeSintetica(rng),
    alimentadorMT: String(enteroEntre(rng, 5000, 5999)),
    ctMtBtEquipoOperado: cadenaCodeSintetica(rng),
  }));
})();
const TOTAL_REGISTROS = 57098;

// ─── CDS3 data ────────────────────────────────────────────────────────────────

const CAUSAS_NC = [
  "<= A 3 MINUTOS",
  "INSTALACION CLIENTE",
];
const CDS3_ROWS = (() => {
  const rng = crearRng(20260703);
  return filasSinteticas(N_FILAS_SINTETICAS, () => ({
    referencia: refInterrupcionSintetica(rng, "2026"),
    fase: String(enteroEntre(rng, 1, 5)),
    causa: elegir(rng, CAUSAS_NC),
  }));
})();
const CDS3_TOTAL = 2501;

// ─── CDS4 data ────────────────────────────────────────────────────────────────

const CDS4_ROWS = (() => {
  const rng = crearRng(20260704);
  return filasSinteticas(N_FILAS_SINTETICAS, () => ({
    referencia: refInterrupcionSintetica(rng, "2026"),
    fase: String(enteroEntre(rng, 1, 5)),
    fecha: fechaSintetica(rng, 7, 2026),
    faseElectrica: elegir(rng, ["R", "S", "T", "RS", "RT", "ST", "RST"]),
    codigoEquipoManiobrado: equipoCodeSintetico(rng),
    descEquipoManiobrado: elegir(rng, DESCRIPCIONES_EQUIPO_OPERADO),
    cadenaElectricaAguasArriba: cadenaCodeSintetica(rng),
    alimentadorMT: String(enteroEntre(rng, 5000, 5999)),
    cantidadClientesBt: String(enteroEntre(rng, 1, 40)),
    ctMtBtManiobrado: cadenaCodeSintetica(rng),
  }));
})();
// Total ajustado — el "1" original era una reproducción pixel-exacta de una
// captura real de producción, pero ya no tiene sentido junto a ~40 filas
// generadas para la vista de muestra.
const CDS4_TOTAL = 48213;

// ─── Dropdown/popover "smart" direction ────────────────────────────────────────
// Mecanismo único reusado por TODO panel flotante de la app (ValuePicker,
// AbmTableSelector, PeriodSelector, DateTimeField, MiniCaptionDropdown,
// DiaDelMesField, UserMenu, el dropdown "Acciones" de PersistentActionsBar)
// en vez de que cada uno hardcodee su propia dirección (algunos abrían
// siempre hacia abajo, otros siempre hacia arriba, sin criterio común).
// Abre hacia abajo por default; flipea hacia arriba solo cuando el panel no
// entra completo entre el trigger y el borde inferior del viewport. Mide
// recién al abrirse (no en cada render, no todo el tiempo) usando el mismo
// `ref` que cada componente ya tiene para su listener de click-outside.
function useDropdownDirection(
  triggerRef: React.RefObject<HTMLElement | null>,
  open: boolean,
  panelHeight: number
): "down" | "up" {
  const [direction, setDirection] = useState<"down" | "up">("down");
  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const espacioAbajo = window.innerHeight - rect.bottom;
    const espacioArriba = rect.top;
    setDirection(espacioAbajo < panelHeight && espacioArriba > espacioAbajo ? "up" : "down");
  }, [open, triggerRef, panelHeight]);
  return direction;
}

// Ancla vertical del panel según la dirección resuelta — spread dentro del
// `style` del panel junto a lo que cada dropdown ya tenga (width, boxShadow,
// etc.). `gapPx` es la separación entre trigger y panel (cada dropdown ya
// tenía su propio valor de 4-6px, se mantiene).
function dropdownAnchorStyle(direction: "down" | "up", gapPx: number): React.CSSProperties {
  return direction === "up" ? { bottom: `calc(100% + ${gapPx}px)` } : { top: `calc(100% + ${gapPx}px)` };
}

function SelectWrap({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {children}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500">
        <ChevronDown />
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block mb-1 text-body-sm font-medium text-gray-700 select-none tracking-wide">
      {children}
    </label>
  );
}

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-3 mt-1">
      <span className="text-caption font-semibold uppercase tracking-[0.09em] text-gray-600 whitespace-nowrap select-none">
        {title}
      </span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

// ─── Sidebar nav item ─────────────────────────────────────────────────────────

function NavItem({
  label, code, icon, active, collapsed, onClick, boldLabel = false,
}: {
  // `icon` es opcional: filas hijas sin ícono propio (ej. Tabla 2..Tabla 9
  // NM) simplemente no reservan ese espacio, solo texto indentado.
  label: string; code?: string; icon?: React.ReactNode; active?: boolean; collapsed: boolean; onClick?: () => void;
  // Le da al label más peso visual que el resto de los ítems, siempre —
  // no solo cuando está activo. Uso puntual (ej. "Consultas de interrupción"),
  // el resto del tratamiento (ícono, tamaño de fila) queda igual.
  boldLabel?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={!collapsed ? label + (code ? ` · ${code}` : "") : undefined}
      style={{ position: "relative" }}
      className={`sidebar-item-btn w-full flex items-center gap-2 rounded-sm border transition-all duration-150 group
        ${collapsed ? "justify-center py-[9px] mx-auto w-9" : "px-[9px] py-[6px]"}
        ${active
          ? "border-primary bg-primary-tint text-secondary"
          : "border-transparent text-gray-700 hover:text-gray-800 hover:bg-gray-100"
        }`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {!collapsed && (
        <>
          <span className={`flex-1 min-w-0 truncate text-body text-left leading-snug ${boldLabel ? "font-semibold" : ""}`}>{label}</span>
          {code && (
            <span
              className={`text-micro font-mono shrink-0 tabular-nums ${active ? "text-secondary/60" : "text-gray-500 group-hover:text-gray-600"}`}
            >
              {code}
            </span>
          )}
        </>
      )}
      {collapsed && (
        <span className="sidebar-item-tooltip">
          {label}{code && ` · ${code}`}
        </span>
      )}
    </button>
  );
}

// ─── Period dropdown ──────────────────────────────────────────────────────────

function PeriodSelector() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(PERIODS[0]);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  const direction = useDropdownDirection(ref, open, 260);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        className={`${BTN_MD} group flex items-center gap-1.5 border font-medium transition-all duration-150
          ${open ? "bg-primary-tint border-primary text-secondary" : "bg-white border-gray-400 text-gray-700 hover:border-primary hover:bg-primary-tint hover:text-secondary"}`}
      >
        <span className={`transition-colors ${open ? "text-secondary" : "text-gray-500 group-hover:text-secondary"}`}><IcoCalendar /></span>
        <span>{selected}</span>
        <span className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}>
          <ChevronDown />
        </span>
      </button>
      {open && (
        <div
          className="absolute right-0 w-48 bg-white rounded-sm border border-gray-300 z-50 overflow-hidden"
          style={{ ...dropdownAnchorStyle(direction, 5), boxShadow: "var(--shadow-mid)" }}
        >
          <div className="px-3 py-2.5 border-b border-gray-100">
            <p className="text-caption font-semibold text-gray-600 uppercase tracking-[0.08em] select-none">Seleccioná el período</p>
          </div>
          <div className="p-1.5 flex flex-col gap-0.5">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => { setSelected(p); setOpen(false); }}
              className={`w-full px-2.5 py-2 rounded-sm border text-left text-body transition-colors
                ${p === selected ? "bg-primary-tint border-primary text-secondary" : "border-transparent text-gray-700 hover:bg-gray-100"}`}
            >
              {p}
            </button>
          ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Date/time field ──────────────────────────────────────────────────────────
// Mismo patrón de dropdown que PeriodSelector (ref + click-outside), pero el
// popover aloja un DayPicker + input de hora en vez de una lista. La interfaz
// pública es la de un input de texto (value/onChange de "dd/mm/aaaa hh:mm")
// para no tocar el tipo FlyoutFilters ni la lógica de chips/badge existente.

function parseDateTimeStr(v: string): { date: Date | undefined; time: string } {
  const [datePart, timePart] = v.split(" ");
  const [dd, mm, yyyy] = (datePart ?? "").split("/").map(Number);
  const date = dd && mm && yyyy ? new Date(yyyy, mm - 1, dd) : undefined;
  return { date, time: timePart ?? "" };
}

function formatDateTimeStr(date: Date | undefined, time: string): string {
  if (!date) return "";
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy} ${time || "00:00"}`;
}

function DateTimeChevron({ orientation }: ChevronProps) {
  return orientation === "right" ? <ChevronRight /> : <ChevronLeft />;
}

const DAY_PICKER_CLASSNAMES = {
  month: "relative flex flex-col",
  month_caption: "flex items-center justify-center h-6 mb-2",
  button_previous: "absolute left-0 top-0 w-6 h-6 flex items-center justify-center rounded-sm text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-all",
  button_next: "absolute right-0 top-0 w-6 h-6 flex items-center justify-center rounded-sm text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-all",
  month_grid: "w-full border-collapse",
  weekdays: "",
  weekday: "text-micro font-semibold uppercase text-gray-500 pb-1",
  day: "p-0.5 text-center",
  day_button: "w-8 h-8 rounded-full bg-transparent flex items-center justify-center text-body-sm font-medium text-gray-700 transition-colors hover:bg-primary-tint hover:text-secondary",
  selected: "rounded-full bg-primary-tint border border-primary text-secondary",
  today: "text-secondary font-semibold",
  outside: "text-gray-400",
};

const MESES_ES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function MiniCaptionDropdown({
  label,
  options,
  onSelect,
}: {
  label: string;
  options: { value: number; label: string; selected: boolean }[];
  onSelect: (value: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  const direction = useDropdownDirection(ref, open, 224);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-6 px-1.5 rounded-sm text-body font-semibold text-gray-900 hover:bg-primary-tint hover:text-secondary transition-colors"
      >
        {label}
      </button>
      {open && (
        <div
          className="absolute left-1/2 z-40 bg-white border border-gray-300 rounded-lg p-1.5 flex flex-col gap-0.5 overflow-y-auto"
          style={{ ...dropdownAnchorStyle(direction, 4), transform: "translateX(-50%)", minWidth: 96, maxHeight: 224, boxShadow: "var(--shadow-mid)" }}
        >
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => { onSelect(o.value); setOpen(false); }}
              className={`w-full text-left px-2.5 py-2 rounded-sm border text-body-sm transition-colors ${
                o.selected ? "bg-primary-tint border-primary text-secondary" : "border-transparent text-gray-700 hover:bg-primary-tint hover:text-secondary"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function DateTimeCaptionLabel(props: React.HTMLAttributes<HTMLSpanElement>) {
  const { months, goToMonth, dayPickerProps } = useDayPicker();
  const current = months[0].date;
  const startYear = dayPickerProps.startMonth?.getFullYear() ?? 2018;
  const endYear = dayPickerProps.endMonth?.getFullYear() ?? new Date().getFullYear();
  const years: number[] = [];
  for (let y = endYear; y >= startYear; y--) years.push(y);

  return (
    <span {...props} className="flex items-center gap-1">
      <MiniCaptionDropdown
        label={MESES_ES[current.getMonth()]}
        options={MESES_ES.map((m, i) => ({ value: i, label: m, selected: i === current.getMonth() }))}
        onSelect={(m) => goToMonth(new Date(current.getFullYear(), m, 1))}
      />
      <MiniCaptionDropdown
        label={String(current.getFullYear())}
        options={years.map((y) => ({ value: y, label: String(y), selected: y === current.getFullYear() }))}
        onSelect={(y) => goToMonth(new Date(y, current.getMonth(), 1))}
      />
    </span>
  );
}

function DateTimeField({
  value,
  onChange,
  disabled,
  muted = disabled,
  fullWidth = false,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  // No editable (abre/cierra el popover solo si es false).
  disabled?: boolean;
  // Look "disabled clásico" (atenuado/muted) vs. "placeholder" (dato real
  // de una fila seleccionada, legible, sin atenuar) — ambos son no
  // editables (disabled=true), pero se ven distinto. Por defecto sigue a
  // `disabled` (comportamiento previo) para no romper otros usos.
  muted?: boolean;
  // Ancho fijo de 170px (comportamiento históric) vs. 100% de la columna
  // que ocupe — los formularios ABM (grid 1fr/1fr) necesitan fullWidth
  // para no quedar más angostos que el input vecino en su misma fila; la
  // barra de filtros compacta de Consultas de interrupción sigue usando el
  // ancho fijo (default), que ahí es intencional.
  fullWidth?: boolean;
  // Extra classes sumadas al trigger — ej. un override de ancho con `!`
  // (important) para un breakpoint puntual, ya que el ancho fijo de acá
  // arriba se aplica vía `style` inline y le gana a una clase normal.
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [hora, setHora] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  const direction = useDropdownDirection(ref, open, 400);

  // Sincroniza selectedDate/hora cada vez que cambia `value`, sin importar
  // si el popover está abierto — antes solo sincronizaba al abrir, así que
  // un cambio programático de `value` (ej. autocompletar el formulario al
  // seleccionar una fila en Resultados) mientras el campo estaba cerrado
  // dejaba `hora` desactualizada la primera vez que se abría el popover.
  useEffect(() => {
    const { date, time } = parseDateTimeStr(value);
    setSelectedDate(date);
    setHora(time);
  }, [value]);

  function aplicar() {
    onChange(formatDateTimeStr(selectedDate, hora));
    setOpen(false);
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={
          MOD_SELECT_CLS +
          " w-full flex items-center justify-between gap-2 text-left" +
          // `!` (important): MOD_SELECT_CLS ya trae bg-white/text-gray-900, que en
          // el CSS compilado ganan igual sin importar el orden en que se
          // concatenan los strings acá (ver mismo fix en AbmCampo/disabledCls).
          (muted ? " !bg-gray-100 !text-gray-500" : disabled ? " !bg-gray-50 !text-gray-900" : "") +
          (className ? ` ${className}` : "")
        }
        style={fullWidth ? undefined : { width: 170, flexShrink: 0 }}
      >
        {value ? <span className={muted ? "text-gray-500 truncate" : "text-gray-900 truncate"}>{value}</span> : <span className="text-gray-500 truncate">dd/mm/aaaa hh:mm</span>}
        <span className="shrink-0 text-gray-500"><IcoCalendar /></span>
      </button>
      {!disabled && open && (
        <div
          className="absolute z-30 bg-white border border-gray-300 rounded-lg p-4"
          style={{ ...dropdownAnchorStyle(direction, 6), width: "max-content", boxShadow: "var(--shadow-high)" }}
        >
          <DayPicker
            mode="single"
            navLayout="around"
            locale={es}
            startMonth={new Date(2018, 0)}
            endMonth={new Date()}
            selected={selectedDate}
            onSelect={setSelectedDate}
            components={{ Chevron: DateTimeChevron, CaptionLabel: DateTimeCaptionLabel }}
            classNames={DAY_PICKER_CLASSNAMES}
          />
          <div className="mt-3">
            <FieldLabel>Hora</FieldLabel>
            <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} className={MOD_FIELD_CLS} />
          </div>
          <div className="flex items-center justify-end gap-2.5 mt-4 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className={`${BTN_MD} font-medium border border-gray-400 bg-white text-gray-700 hover:bg-primary-tint hover:border-primary hover:text-secondary transition-all`}
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={aplicar}
              className={`${BTN_MD} font-semibold text-white hover:brightness-105 transition-all`}
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── User menu ────────────────────────────────────────────────────────────────

function UserMenu({ collapsed, onLogout }: { collapsed: boolean; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  // Solo aplica al caso no-colapsado (flyout vertical) — el colapsado abre
  // hacia el costado (flyout horizontal), geometría distinta que no entra
  // en el criterio arriba/abajo.
  const direction = useDropdownDirection(ref, open, 170);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-2 rounded-sm px-1.5 py-1.5 transition-colors hover:bg-gray-100 ${open ? "bg-gray-100" : ""}`}
      >
        <div
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-body-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg,#1565C0,#1E3A8A)" }}
        >
          R
        </div>
        {!collapsed && (
          <>
            <div className="flex-1 text-left overflow-hidden">
              <p className="text-body font-medium text-gray-800 leading-none truncate">Rdellamagiora</p>
              <p className="text-caption text-gray-600 mt-0.5 truncate">Operador</p>
            </div>
            <span className={`text-gray-500 transition-transform duration-150 ${open ? "rotate-180" : ""}`}>
              <ChevronDown />
            </span>
          </>
        )}
      </button>
      {open && (
        <div
          className={`absolute ${collapsed ? "left-[calc(100%+8px)] bottom-0" : "left-0 right-0"} bg-white rounded-sm border border-gray-300 py-1 z-50 min-w-[160px]`}
          style={collapsed ? { boxShadow: "var(--shadow-mid)" } : { ...dropdownAnchorStyle(direction, 6), boxShadow: "var(--shadow-mid)" }}
        >
          <button className="w-full flex items-center gap-2 px-3 py-2 text-body text-gray-700 hover:bg-gray-50 transition-colors">
            <IcoUser /> Mi perfil
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-2 text-body text-gray-700 hover:bg-gray-50 transition-colors">
            <IcoSettings /> Configuración
          </button>
          <div className="my-1 border-t border-gray-200" />
          <button
            onClick={() => { setOpen(false); onLogout(); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-body text-error hover:bg-red-50 transition-colors"
          >
            <IcoLogOut /> Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Sistema de tamaños de botón ────────────────────────────────────────────
// Los 2 únicos tamaños de botón de toda la app — ver documentación completa
// en index.css, junto a los tokens que los anclan (--radius-sm/md,
// --text-caption/body). No hay un componente <Button/> compartido (la app
// es un solo archivo grande con botones ad hoc por instancia), así que la
// forma de reusarlos es esta: BTN_SM/BTN_MD (o los helpers que ya los
// consumen, actionBtnCls/rowActionBtnCls) definen tamaño/padding/tipografía/
// radius; cada botón solo suma por afuera su propio color/variante/hover.
// Nunca estilar un botón nuevo escribiendo su propio alto/radius/tamaño de
// texto a mano — eso es exactamente lo que generó las inconsistencias
// (ghost vs outline, headers de tabla desproporcionados) que esto corrige.
//   sm — acciones inline de fila (Modificar/Borrar en tablas ABM) y
//        toggles/chips (BT/MT/AT, Interno/Externo, etc.)
//   md — acciones de panel (Buscar, Limpiar, Cancelar, Guardar, Insertar,
//        Exportar, Auditoría) y botones dropdown-trigger (selector de
//        período, "Cambiar de tabla")
const BTN_SM = "h-7 px-2.5 rounded-sm text-caption";
const BTN_MD = "h-9 px-4 rounded-md text-body";

// ─── Login screen ─────────────────────────────────────────────────────────────

type ActionItem = {
  label: string;
  onClick?: () => void;
  variant?: "neutral" | "destructive";
  disabled?: boolean;
};

function actionBtnCls(variant?: ActionItem["variant"]) {
  if (variant === "destructive") {
    return `${BTN_MD} font-medium border border-error-border bg-white text-error hover:bg-red-50 hover:border-error-border-hover transition-all active:scale-[0.98] whitespace-nowrap`;
  }
  return `${BTN_MD} font-medium border border-gray-400 bg-white text-gray-700 hover:bg-primary-tint hover:border-primary hover:text-secondary transition-all active:scale-[0.98] whitespace-nowrap`;
}

// Variante compacta de actionBtnCls — mismo botón outline/secundario ya
// establecido en el resto de la app (borde visible en reposo, hover a
// border-primary + bg-primary-tint + text-secondary; border-error-border +
// hover bg-red-50 en la destructiva), solo en tamaño sm en vez de md, para
// acciones por fila dentro de una tabla (ej. Modificar/Borrar en
// Resultados) donde el tamaño md no entra prolijo.
function rowActionBtnCls(variant?: ActionItem["variant"]) {
  if (variant === "destructive") {
    return `${BTN_SM} font-medium border border-error-border bg-white text-error hover:bg-red-50 hover:border-error-border-hover transition-all active:scale-[0.97] whitespace-nowrap`;
  }
  return `${BTN_SM} font-medium border border-gray-400 bg-white text-gray-700 hover:bg-primary-tint hover:border-primary hover:text-secondary transition-all active:scale-[0.97] whitespace-nowrap`;
}

// Confirmación visual de qué registro está seleccionado — solo la línea
// "REGISTRO SELECCIONADO [id]", sin acciones debajo: Modificar/Borrar viven
// como íconos en la fila de Resultados, y Auditoría en el header del panel
// (junto a Exportar) — ver AbmScreen.
function SelectionActionBar({ recordLabel }: { recordLabel: string }) {
  return (
    <div className="px-4 py-3 border-b border-gray-200 bg-white shrink-0 flex items-center gap-2.5">
      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
      <span className="text-caption font-semibold text-secondary uppercase tracking-wide select-none">
        Registro seleccionado
      </span>
      <span
        className="text-body-sm font-medium text-gray-800 tabular-nums font-mono"
      >
        {recordLabel}
      </span>
    </div>
  );
}

// ─── Table toolbar (buscador / orden / exportar) ───────────────────────────────
// Patron compartido para toda tabla de datos: buscador cliente-side, orden de
// columnas y exportar a CSV. Cada tabla mantiene su propio estado de orden y
// filtro via useTableToolbar; TableToolbar solo renderiza buscador + Exportar
// (+ botones futuros pasados como children).

type SortDir = "asc" | "desc";

function useTableToolbar<T>(rows: T[], getCells: (row: T) => string[], resetKey: unknown = undefined) {
  const [search, setSearch] = useState("");
  const [sortIdx, setSortIdx] = useState<number | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  useEffect(() => {
    setSearch("");
    setSortIdx(null);
    setSortDir("asc");
  }, [resetKey]);

  const term = search.trim().toLowerCase();
  const filtered = rows
    .map((_, i) => i)
    .filter((i) => !term || getCells(rows[i]).some((c) => c.toLowerCase().includes(term)));

  const visibleIndices = sortIdx === null
    ? filtered
    : [...filtered].sort((a, b) => {
        const av = getCells(rows[a])[sortIdx] ?? "";
        const bv = getCells(rows[b])[sortIdx] ?? "";
        const cmp = av.localeCompare(bv, "es", { numeric: true, sensitivity: "base" });
        return sortDir === "asc" ? cmp : -cmp;
      });

  function toggleSort(colIdx: number) {
    setSortIdx((prev) => {
      if (prev === colIdx) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        return prev;
      }
      setSortDir("asc");
      return colIdx;
    });
  }

  return { search, setSearch, sortIdx, sortDir, toggleSort, visibleIndices };
}

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

function SortIndicator({ dir }: { dir: SortDir }) {
  return (
    <span className="text-primary" style={{ fontSize: 8, lineHeight: 1 }}>
      {dir === "asc" ? "▲" : "▼"}
    </span>
  );
}

// Encabezado clickeable para tablas armadas con divs (flex/grid).
function SortableHeaderCell({
  label,
  active,
  dir,
  onClick,
  className = "",
}: {
  label: string;
  active: boolean;
  dir: SortDir;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1 font-semibold uppercase tracking-[0.07em] select-none cursor-pointer transition-colors hover:text-gray-700 ${
        active ? "text-secondary" : "text-gray-600"
      } ${className}`}
    >
      <span className="truncate">{label}</span>
      {active && <SortIndicator dir={dir} />}
    </button>
  );
}

// Encabezado clickeable para tablas armadas con <table>/<th> (drawer de indicadores).
function SortableTh({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: SortDir;
  onClick: () => void;
}) {
  return (
    <th className="px-4 py-3 text-left text-caption font-semibold uppercase tracking-[0.07em] select-none whitespace-nowrap">
      <button
        type="button"
        onClick={onClick}
        className={`flex items-center gap-1 cursor-pointer transition-colors hover:text-gray-700 ${
          active ? "text-secondary" : "text-gray-600"
        }`}
      >
        {label}
        {active && <SortIndicator dir={dir} />}
      </button>
    </th>
  );
}

// Barra de herramientas de tabla — buscador cliente-side a la izquierda,
// Exportar a la derecha. Siempre se integra como franja superior dentro del
// card que ya contiene la tabla (mismo lenguaje que SelectionActionBar
// embedded), nunca como card propia flotando encima. Se le pueden agregar
// mas botones a la derecha de Exportar pasandolos como children, sin
// reestructurar nada.
function TableToolbar({
  search,
  onSearchChange,
  onExport,
  hideExport = false,
  searchPlaceholder = "Buscar en la tabla…",
  children,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  onExport?: () => void;
  // El motor ABM mueve "Exportar" a la cabecera del panel (junto a
  // + Insertar) y deja esta fila solo con el buscador — ver AbmScreen.
  hideExport?: boolean;
  searchPlaceholder?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="px-4 py-2.5 border-b border-gray-200 bg-white shrink-0 flex items-center justify-between gap-3">
      <div className="relative flex-1 max-w-[320px]">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-gray-500">
          <IcoSearch />
        </span>
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full h-8 pl-8 pr-2.5 text-body bg-white border border-gray-400 rounded-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-focus focus:ring-2 focus:ring-focus/10 transition-all duration-150"
        />
      </div>
      {(!hideExport || children) && (
        <div className="flex items-center gap-2 shrink-0">
          {!hideExport && onExport && (
            <button type="button" onClick={onExport} className={actionBtnCls("neutral")}>
              Exportar
            </button>
          )}
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Modal estándar ─────────────────────────────────────────────────────────
// Standard compartido para toda accion de tabla que requiera un dialogo
// (Desarmes, Nivel/Tipo, Replicar, Cambia fases, Alta clientes, Lotes,
// Intercambio, y las que vengan despues). Overlay + panel centrado, header
// con titulo/subtitulo y boton X, body libre por contenido, footer con
// botones alineados a la derecha (mismo lenguaje que Buscar/Limpiar: neutral
// outline para cancelar, azul solido para la accion primaria). Cierra con X,
// click en el overlay o Escape.
const modalPrimaryBtnCls =
  "h-9 px-5 rounded-md text-body font-semibold text-white transition-all duration-150 active:scale-[0.99] hover:brightness-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none";
const modalNeutralBtnCls =
  "h-9 px-5 rounded-md text-body font-medium border border-gray-400 bg-white text-gray-700 hover:bg-primary-tint hover:border-primary hover:text-secondary transition-all duration-150 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none";

function Modal({
  title,
  subtitle,
  open,
  onClose,
  size = "lg",
  footer,
  children,
}: {
  title: string;
  subtitle?: string;
  open: boolean;
  onClose: () => void;
  size?: "sm" | "lg" | "xl";
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/25" onClick={onClose} />
      <div
        className="fixed z-50 flex flex-col bg-white rounded-lg overflow-hidden"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: size === "sm" ? 480 : size === "xl" ? 1120 : 920,
          maxWidth: "calc(100vw - 40px)",
          maxHeight: "calc(100vh - 40px)",
          boxShadow: "var(--shadow-high)",
        }}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 shrink-0 flex items-center justify-between gap-3">
          <p className="min-w-0 truncate text-label font-semibold text-gray-900">
            {title}
            {subtitle && (
              <span
                className="ml-2 font-normal text-body text-gray-600 font-mono"
              >
                {subtitle}
              </span>
            )}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-sm text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-all"
          >
            <IcoX />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-5 py-4 border-t border-gray-200 shrink-0 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </>
  );
}

// Lista con header, reusada dentro de modales para paneles tipo
// "Interrupción/Reclamo" / "Errores".
function ListBox({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col border border-gray-300 rounded-sm overflow-hidden" style={{ height: 160 }}>
      <div className="px-3 py-2 border-b border-gray-300 bg-gray-50 text-caption font-semibold uppercase tracking-[0.07em] text-gray-600 shrink-0">
        {title}
      </div>
      <div className="flex-1 overflow-y-auto p-2">{children}</div>
    </div>
  );
}

// Checkbox custom (no accent-color nativo) — mismo lenguaje que el resto de
// la app: borde var(--color-gray-400) en reposo, relleno var(--color-primary) + check blanco al marcar.
// El <input> real queda oculto (sr-only) para mantener accesibilidad/teclado;
// el estado visual lo maneja React, nunca CSS nativo del navegador.
// Sin "checked"/"onChange" queda no-controlado (estado propio, como en
// Desarmes/Alta clientes); pasando ambos queda controlado por el padre
// (necesario cuando otra parte de la UI, como los botones Copiar/Mover en
// Intercambio, necesita leer que filas estan tildadas).
function ModalCheckbox({
  label,
  defaultChecked = false,
  checked: checkedProp,
  onChange,
}: {
  label: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const checked = checkedProp !== undefined ? checkedProp : internalChecked;
  const setChecked = (v: boolean) => {
    if (checkedProp === undefined) setInternalChecked(v);
    onChange?.(v);
  };
  return (
    <label className="inline-flex items-center gap-2 text-body text-gray-700 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        className="sr-only"
      />
      <span
        className={`w-4 h-4 rounded-[3px] border flex items-center justify-center shrink-0 transition-colors duration-150 ${
          checked ? "bg-primary border-primary" : "bg-white border-gray-400 hover:border-gray-500"
        }`}
      >
        {checked && (
          <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
            <path d="M1.5 5.2l2.4 2.4L8.5 2.3" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {label}
    </label>
  );
}

// Radio custom, controlado desde el padre (seleccion mutuamente excluyente
// entre varios ModalRadio via checked/onSelect) — mismo motivo que el
// checkbox: nada de estilo nativo del navegador.
function ModalRadio({ label, checked, onSelect }: { label: string; checked: boolean; onSelect: () => void }) {
  return (
    <label
      onClick={onSelect}
      className="inline-flex items-center gap-1.5 text-body text-gray-700 cursor-pointer select-none"
    >
      <span
        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-150 ${
          checked ? "border-primary" : "border-gray-400 hover:border-gray-500"
        }`}
      >
        <span className={`w-2 h-2 rounded-full bg-primary transition-transform duration-150 ${checked ? "scale-100" : "scale-0"}`} />
      </span>
      {label}
    </label>
  );
}

// ─── Modal: Desarmes ────────────────────────────────────────────────────────
function DesarmeModal({
  open,
  onClose,
  referencia,
}: {
  open: boolean;
  onClose: () => void;
  referencia: string;
}) {
  const [fileName, setFileName] = useState("No se eligió ningún archivo");
  const [desarmePor, setDesarmePor] = useState<"interrupcion" | "reclamo">("interrupcion");

  return (
    <Modal
      title="Desarme"
      open={open}
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className={modalNeutralBtnCls}>
            Salir
          </button>
          <button type="button" onClick={onClose} className={modalPrimaryBtnCls} style={{ backgroundColor: "var(--color-primary)" }}>
            Procesar
          </button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <ListBox title="Interrupción/Reclamo">
          <div
            className="px-2 py-1.5 text-body tabular-nums text-gray-800 font-mono"
          >
            {referencia}
          </div>
        </ListBox>
        <ListBox title="Errores" />
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-5">
        <div className="flex flex-col gap-3.5">
          <div className="flex items-center gap-5 flex-wrap">
            <ModalCheckbox label="Reasigna" defaultChecked />
            <ModalCheckbox label="Alta reclamos faltantes" />
            <ModalCheckbox label="Solo MT/AT" />
          </div>
          <div className="flex items-center gap-2">
            <ModalCheckbox label="Reasigna por proximidad" />
            <input defaultValue="250" className={MOD_FIELD_CLS} style={{ width: 64 }} />
            <span className="text-body text-gray-700">Mts.</span>
          </div>
          <div className="flex items-center gap-5">
            <ModalCheckbox label="Desarmo" defaultChecked />
            <ModalCheckbox label="Instalación cliente" defaultChecked />
          </div>
          <div className="flex items-center gap-5">
            <ModalRadio
              label="Por interrupción"
              checked={desarmePor === "interrupcion"}
              onSelect={() => setDesarmePor("interrupcion")}
            />
            <ModalRadio
              label="Por reclamo"
              checked={desarmePor === "reclamo"}
              onSelect={() => setDesarmePor("reclamo")}
            />
          </div>
          <ModalCheckbox label="Borra interrupción original" defaultChecked />
        </div>
        <div className="flex flex-col gap-3.5">
          <ModalCheckbox label="Carga reclamos faltantes" />
          <div className="flex items-center gap-2">
            <input
              type="file"
              id="desarme-file"
              className="hidden"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "No se eligió ningún archivo")}
            />
            <label
              htmlFor="desarme-file"
              className={actionBtnCls("neutral") + " cursor-pointer inline-flex items-center justify-center shrink-0"}
            >
              Elegir archivo
            </label>
            <span className="text-body-sm text-gray-600 truncate">{fileName}</span>
          </div>
          <div>
            <button type="button" className={actionBtnCls("neutral")}>
              Cargar archivo
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ─── Modal: Nivel/Tipo ──────────────────────────────────────────────────────
const NIVEL_TIPO_TIPOS = ["BFZ", "AFZ", "BPR", "MFZ"];

function NivelTipoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal
      title="Bajar nivel de interrupción"
      open={open}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <button type="button" onClick={onClose} className={modalNeutralBtnCls}>
            Salir
          </button>
          <button type="button" onClick={onClose} className={modalPrimaryBtnCls} style={{ backgroundColor: "var(--color-primary)" }}>
            Generar
          </button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Nivel tensión</FieldLabel>
          <ValuePicker opts={["BT", "MT", "AT"]} defaultValue="BT" />
        </div>
        <div>
          <FieldLabel>Tipo</FieldLabel>
          <ValuePicker opts={NIVEL_TIPO_TIPOS} defaultValue={NIVEL_TIPO_TIPOS[0]} />
        </div>
        <div>
          <FieldLabel>Nueva interrupción</FieldLabel>
          <div className="w-full h-8 px-2.5 flex items-center text-body bg-gray-100 border border-gray-300 rounded-sm text-gray-400 select-none cursor-not-allowed">
            —
          </div>
        </div>
        <div>
          <FieldLabel>Cadena</FieldLabel>
          <input placeholder="NCBT" className={MOD_FIELD_CLS} />
        </div>
      </div>
    </Modal>
  );
}

// ─── Modal: Replicar ────────────────────────────────────────────────────────
function ReplicarModal({
  open,
  onClose,
  referencia,
}: {
  open: boolean;
  onClose: () => void;
  referencia: string;
}) {
  return (
    <Modal
      title="Replicar interrupción"
      subtitle={referencia}
      open={open}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <button type="button" onClick={onClose} className={modalNeutralBtnCls}>
            Salir
          </button>
          <button type="button" onClick={onClose} className={modalPrimaryBtnCls} style={{ backgroundColor: "var(--color-primary)" }}>
            Generar
          </button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Período destino</FieldLabel>
          <ValuePicker opts={PERIODS} placeholder="Período" />
        </div>
        <div>
          <FieldLabel>Nueva interrupción</FieldLabel>
          <div className="w-full h-8 px-2.5 flex items-center text-body bg-gray-100 border border-gray-300 rounded-sm text-gray-400 select-none cursor-not-allowed">
            —
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ─── Modal: Cambia fases ────────────────────────────────────────────────────
type FaseRow = { fase: number; fecha: string; idElemento: string; tipoElemento: string; cadena: string; cliente: number };

const CAMBIA_FASES_ROWS_INIT: FaseRow[] = [
  { fase: 1, fecha: "01/07/2026 00:43", idElemento: "@27947890", tipoElemento: "Proteccion de Toma/Acometida", cadena: "52705#B1#52705-TR1#1#3", cliente: 1 },
  { fase: 2, fecha: "01/07/2026 00:52", idElemento: "@27947891", tipoElemento: "Proteccion de Suministro", cadena: "52705#B1#52705-TR1#1#4", cliente: 3 },
  { fase: 1, fecha: "01/07/2026 01:10", idElemento: "@27947892", tipoElemento: "Proteccion de Toma/Acometida", cadena: "52705#B1#52705-TR1#1#5", cliente: 2 },
];

function CambiaFasesModal({
  open,
  onClose,
  referencia,
}: {
  open: boolean;
  onClose: () => void;
  referencia: string;
}) {
  const [rows, setRows] = useState(CAMBIA_FASES_ROWS_INIT);

  function move(i: number, dir: -1 | 1) {
    setRows((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  return (
    <Modal
      title="Cambia fases"
      subtitle={referencia}
      open={open}
      onClose={onClose}
      footer={
        <button type="button" onClick={onClose} className={modalNeutralBtnCls}>
          Salir
        </button>
      }
    >
      <div className="border border-gray-300 rounded-sm overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {["Fase", "Fecha", "Id elemento", "Tipo elemento", "Cadena", "Cliente"].map((c) => (
                <th key={c} className="px-4 py-3 text-left text-caption font-semibold uppercase tracking-[0.07em] text-gray-600 select-none whitespace-nowrap">
                  {c}
                </th>
              ))}
              <th className="px-3 py-3 w-16" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.idElemento} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-body text-gray-700 tabular-nums">{r.fase}</td>
                <td className="px-4 py-3 text-body text-gray-700 whitespace-nowrap">{r.fecha}</td>
                <td className="px-4 py-3 text-body text-gray-700 whitespace-nowrap font-mono">
                  {r.idElemento}
                </td>
                <td className="px-4 py-3 text-body text-gray-700 whitespace-nowrap">{r.tipoElemento}</td>
                <td className="px-4 py-3 text-body text-gray-700 whitespace-nowrap font-mono" style={{ fontSize: "var(--text-caption)" }}>
                  {r.cadena}
                </td>
                <td className="px-4 py-3 text-body text-gray-700 tabular-nums">{r.cliente}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      className="w-6 h-6 flex items-center justify-center rounded-sm text-gray-600 hover:bg-primary-tint hover:text-secondary disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                        <path d="M5.5 8.5V2.5M5.5 2.5L2.5 5.5M5.5 2.5l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      disabled={i === rows.length - 1}
                      className="w-6 h-6 flex items-center justify-center rounded-sm text-gray-600 hover:bg-primary-tint hover:text-secondary disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                        <path d="M5.5 2.5v6M5.5 8.5l-3-3M5.5 8.5l3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
}

// ─── Modal: Alta de clientes ────────────────────────────────────────────────
const ALTA_CLIENTES_ROWS = [
  { interrupcion: "BFZ202607056849", repo: 1, cadenaCuenta: "52705#B1#52705-TR1#1#3", t4: 1, t6: 0, t9: 1, t10: 107 },
];

function AltaClientesModal({
  open,
  onClose,
  referencia,
}: {
  open: boolean;
  onClose: () => void;
  referencia: string;
}) {
  const [filtroActivo, setFiltroActivo] = useState(false);
  const [periodicidad, setPeriodicidad] = useState<"mensual" | "semestral">("mensual");

  return (
    <Modal
      title="Alta de clientes BT"
      subtitle={referencia}
      open={open}
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className={modalNeutralBtnCls}>
            Salir
          </button>
          <button type="button" onClick={onClose} className={modalPrimaryBtnCls} style={{ backgroundColor: "var(--color-primary)" }}>
            Procesar
          </button>
        </>
      }
    >
      <div className="flex items-center justify-end gap-2 mb-3">
        <span className="text-body-sm text-gray-600">Filtro</span>
        <button
          type="button"
          onClick={() => setFiltroActivo((v) => !v)}
          className={`${BTN_SM} font-medium border transition-colors ${
            filtroActivo ? "bg-primary-tint border-primary text-secondary" : "bg-white border-gray-400 text-gray-700 hover:border-primary hover:bg-primary-tint hover:text-secondary"
          }`}
        >
          {filtroActivo ? "Activo" : "Inactivo"}
        </button>
      </div>

      <div className="border border-gray-300 rounded-sm overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {["Interrupción", "Repo", "Cadena/Cuenta", "Clientes T4", "Clientes T6", "Clientes T9", "Clientes T10"].map((c) => (
                <th key={c} className="px-4 py-3 text-left text-caption font-semibold uppercase tracking-[0.07em] text-gray-600 select-none whitespace-nowrap">
                  {c}
                </th>
              ))}
              <th className="px-3 py-3 w-10" />
            </tr>
          </thead>
          <tbody>
            {ALTA_CLIENTES_ROWS.map((r) => (
              <tr key={r.interrupcion} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-body tabular-nums font-mono" style={{ color: "var(--color-gray-800)" }}>
                  {r.interrupcion}
                </td>
                <td className="px-4 py-3 text-body text-gray-700 tabular-nums">{r.repo}</td>
                <td className="px-4 py-3 text-body text-gray-700 whitespace-nowrap font-mono" style={{ fontSize: "var(--text-caption)" }}>
                  {r.cadenaCuenta}
                </td>
                <td className="px-4 py-3 text-body text-gray-700 tabular-nums">{r.t4}</td>
                <td className="px-4 py-3 text-body text-gray-700 tabular-nums">{r.t6}</td>
                <td className="px-4 py-3 text-body text-gray-700 tabular-nums">{r.t9}</td>
                <td className="px-4 py-3 text-body text-gray-700 tabular-nums">{r.t10}</td>
                <td className="px-3 py-3">
                  <ModalCheckbox label="" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="inline-flex rounded-sm border border-gray-400 overflow-hidden">
          <button
            type="button"
            onClick={() => setPeriodicidad("mensual")}
            className={`h-7 px-2.5 text-caption font-medium transition-colors ${
              periodicidad === "mensual" ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Mensual
          </button>
          <button
            type="button"
            onClick={() => setPeriodicidad("semestral")}
            className={`h-7 px-2.5 text-caption font-medium border-l border-gray-400 transition-colors ${
              periodicidad === "semestral" ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Semestral
          </button>
        </div>
        <button type="button" className={actionBtnCls("neutral")}>
          Agregar
        </button>
      </div>
    </Modal>
  );
}

// ─── Modal: Lotes ───────────────────────────────────────────────────────────
// "extra" marca las opciones que traen un control adicional inline (select,
// sub-radios o checkbox) en la captura de referencia de ese Tipo.
type LotesOpcion = { label: string; extra?: "codigoFalla" | "causaAlta" | "conservaCausa" };
type LotesTipo = { key: string; opciones: LotesOpcion[]; desc: string; columns?: 2 };

const LOTES_TIPOS: LotesTipo[] = [
  {
    key: "0",
    desc: "Tipo 0 - Sin datos requeridos",
    opciones: [
      { label: "Elimina CT en 0 (excluye interrupciones)" },
      { label: "Completar con RST en T2/T4 (excluye interrupciones)" },
      { label: "Pasar texto a mayúscula (excluye interrupciones)" },
      { label: "Buscar CT por acometida en T10 Sem" },
      { label: "Nivelación automática" },
      { label: "Completa Cadenas Vacías en T9" },
      { label: "Carga Potencia de Cts en 0" },
    ],
  },
  {
    key: "1",
    desc: "Tipo 1 - REF",
    opciones: [
      { label: "Borra interrupción" },
      { label: "Coincidir fecha 1er reclamo" },
      { label: "Cambiar código de falla", extra: "codigoFalla" },
      { label: "Dividir interrupción" },
      { label: "Cambiar tipo" },
      { label: "Baja clientes sin reclamos" },
      { label: "Alta clientes por cercanía de reclamo" },
      { label: "Cambia a NCBT las interrupciones" },
    ],
  },
  {
    key: "2",
    desc: "Tipo 2 - Póliza/Tarifa",
    opciones: [{ label: "Asignar tarifa" }, { label: "Borrar pólizas" }],
  },
  {
    key: "3",
    desc: "Tipo 3 - REF/F/Fecha",
    opciones: [{ label: "Modificar horario de interrupción / F" }],
  },
  {
    key: "4",
    desc: "Tipo 4 - REF/F/Cuenta",
    opciones: [{ label: "Baja clientes en T9" }, { label: "Alta clientes en T9" }],
  },
  {
    key: "5",
    desc: "Tipo 5 - REF/F",
    opciones: [
      { label: "Alta en T3", extra: "causaAlta" },
      { label: "Copia en T4 datos de T2" },
      { label: "Elimina registros en T3" },
      { label: "Elimina duplicados en T3" },
      { label: "Elimina causa <= 3 a minutos en T3" },
      { label: "Elimina causa INSTALACION CLIENTE en T3" },
    ],
  },
  {
    key: "6",
    desc: "Tipo 6 - REF/REF o Reclamo/REF",
    opciones: [
      { label: "Pasaje de reclamos", extra: "conservaCausa" },
      { label: "Renombrar Interrupciones" },
    ],
  },
  {
    key: "7",
    desc: "Tipo 7 - REF/Null/Texto",
    columns: 2,
    opciones: [
      { label: "Completa id_elem en T2" },
      { label: "Cambia tipo elemento T2" },
      { label: "Completar CMTBT en T2" },
      { label: "Completa alim en T2" },
      { label: "Completa ssee en T2" },
      { label: "Completa id_elem en T4" },
      { label: "Cambia tipo elemento T4" },
      { label: "Completar CMTBT en T4" },
      { label: "Completa alim en T4" },
      { label: "Completa ssee en T4" },
    ],
  },
  {
    key: "8",
    desc: "Tipo 8 - REF/F/Cadena",
    opciones: [{ label: "Inserta registros en T5" }, { label: "Elimina Registros en T5" }],
  },
];

function LotesModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [fileName, setFileName] = useState("No se eligió ningún archivo");
  const [activeTipo, setActiveTipo] = useState("0");
  const [selectedOpcion, setSelectedOpcion] = useState<string | null>(null);
  const [causaAlta, setCausaAlta] = useState<"3min" | "instalacion" | null>(null);
  const [conservaCausa, setConservaCausa] = useState(false);
  const tipoData = LOTES_TIPOS.find((t) => t.key === activeTipo)!;

  return (
    <Modal
      title="Lotes"
      open={open}
      onClose={onClose}
      size="xl"
      footer={
        <>
          <button type="button" onClick={onClose} className={modalNeutralBtnCls}>
            Salir
          </button>
          <button type="button" onClick={onClose} className={modalPrimaryBtnCls} style={{ backgroundColor: "var(--color-primary)" }}>
            Procesar
          </button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-6">
        {/* Izquierda: archivo + porcentajes */}
        <div className="flex flex-col gap-4">
          <div className="border border-gray-300 rounded-sm overflow-hidden" style={{ height: 160 }}>
            <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-300">
              {["Campo 1", "Campo 2", "Campo 3"].map((c) => (
                <div key={c} className="px-3 py-2 text-caption font-semibold uppercase tracking-[0.07em] text-gray-600">
                  {c}
                </div>
              ))}
            </div>
            <div className="h-full overflow-y-auto" />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              id="lotes-file"
              className="hidden"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "No se eligió ningún archivo")}
            />
            <label
              htmlFor="lotes-file"
              className={actionBtnCls("neutral") + " cursor-pointer inline-flex items-center justify-center shrink-0"}
            >
              Elegir archivo
            </label>
            <span className="text-body-sm text-gray-600 truncate">{fileName}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Porcentaje 1</FieldLabel>
              <div className="flex items-center gap-2">
                <input defaultValue="10" className={MOD_FIELD_CLS} style={{ width: 60 }} />
                <span className="text-body-sm text-gray-600">Intervalo mayor a 48hs</span>
              </div>
            </div>
            <div>
              <FieldLabel>Distancia del reclamo</FieldLabel>
              <div className="flex items-center gap-2">
                <input defaultValue="100" className={MOD_FIELD_CLS} style={{ width: 60 }} />
                <span className="text-body-sm text-gray-600">Mts.</span>
              </div>
            </div>
            <div>
              <FieldLabel>Porcentaje 2</FieldLabel>
              <div className="flex items-center gap-2">
                <input defaultValue="10" className={MOD_FIELD_CLS} style={{ width: 60 }} />
                <span className="text-body-sm text-gray-600">Intervalo menor a 48hs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Derecha: errores + tipos */}
        <div className="flex flex-col gap-4">
          <ListBox title="Errores" />

          <div>
            <div className="flex items-center gap-1 border-b border-gray-200 overflow-x-auto">
              {LOTES_TIPOS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActiveTipo(t.key)}
                  className={`px-3 py-2 text-body-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTipo === t.key ? "border-primary text-secondary" : "border-transparent text-gray-600 hover:text-gray-700"
                  }`}
                >
                  Tipo {t.key}
                </button>
              ))}
            </div>

            <div
              className={`gap-x-8 gap-y-2 py-3 overflow-y-auto ${tipoData.columns === 2 ? "grid grid-cols-2 grid-rows-5 grid-flow-col" : "flex flex-col"}`}
              style={{ height: 220 }}
            >
              {tipoData.opciones.map((op) => (
                <div key={op.label} className="flex items-center gap-4 flex-wrap">
                  <ModalRadio
                    label={op.label}
                    checked={selectedOpcion === op.label}
                    onSelect={() => setSelectedOpcion(op.label)}
                  />
                  {/* Sin más opciones que el placeholder — siempre muestra
                      "Seleccione código" (mismo criterio que AbmCampo: sin
                      value real, el trigger queda fijo en gray-500). */}
                  {op.extra === "codigoFalla" && (
                    <ValuePicker opts={[]} placeholder="Seleccione código" wrapClassName="w-44" />
                  )}
                  {op.extra === "causaAlta" && (
                    <div className="flex items-center gap-4">
                      <ModalRadio label="<= 3 minutos" checked={causaAlta === "3min"} onSelect={() => setCausaAlta("3min")} />
                      <ModalRadio
                        label="Instalación cliente"
                        checked={causaAlta === "instalacion"}
                        onSelect={() => setCausaAlta("instalacion")}
                      />
                    </div>
                  )}
                  {op.extra === "conservaCausa" && (
                    <ModalCheckbox label="Conserva la misma causa" checked={conservaCausa} onChange={setConservaCausa} />
                  )}
                </div>
              ))}
            </div>

            <div className="w-full h-8 px-2.5 flex items-center text-body-sm bg-gray-100 border border-gray-300 rounded-sm text-gray-600 select-none">
              {tipoData.desc}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ─── Modal: Intercambio ─────────────────────────────────────────────────────
type IntercambioRow = { id: number; fecha: string; clientes: number; repo: number };

function IntercambioModal({
  open,
  onClose,
  referencia,
}: {
  open: boolean;
  onClose: () => void;
  referencia: string;
}) {
  const [leftRows, setLeftRows] = useState<IntercambioRow[]>([{ id: 1, fecha: "01/07/2026 00:43", clientes: 1, repo: 1 }]);
  const [rightRows, setRightRows] = useState<IntercambioRow[]>([]);
  const [leftChecked, setLeftChecked] = useState<Set<number>>(new Set());
  const [seleccion, setSeleccion] = useState<"interrupcion" | "reclamos" | "cts" | "clientes">("interrupcion");
  const [tarifa, setTarifa] = useState<"todas" | "mtat" | "bt">("todas");
  const [ocultarExistentes, setOcultarExistentes] = useState(false);
  const nextRowId = useRef(2);

  function toggleLeftChecked(i: number, checked: boolean) {
    setLeftChecked((prev) => {
      const next = new Set(prev);
      if (checked) next.add(i);
      else next.delete(i);
      return next;
    });
  }

  function toggleSelectAll(checked: boolean) {
    setLeftChecked(checked ? new Set(leftRows.map((_, i) => i)) : new Set());
  }

  function copiar() {
    const selected = leftRows.filter((_, i) => leftChecked.has(i));
    if (selected.length === 0) return;
    setRightRows((prev) => [...prev, ...selected.map((r) => ({ ...r, id: nextRowId.current++ }))]);
  }

  function mover() {
    const selected = leftRows.filter((_, i) => leftChecked.has(i));
    if (selected.length === 0) return;
    setRightRows((prev) => [...prev, ...selected.map((r) => ({ ...r, id: nextRowId.current++ }))]);
    setLeftRows((prev) => prev.filter((_, i) => !leftChecked.has(i)));
    setLeftChecked(new Set());
  }

  function eliminar() {
    setLeftRows((prev) => prev.filter((_, i) => !leftChecked.has(i)));
    setLeftChecked(new Set());
  }

  function swap() {
    setLeftRows(rightRows);
    setRightRows(leftRows);
    setLeftChecked(new Set());
  }

  return (
    <Modal
      title="Intercambio entre 2 interrupciones"
      subtitle={referencia}
      open={open}
      onClose={onClose}
      size="xl"
      footer={
        <button type="button" onClick={onClose} className={modalPrimaryBtnCls} style={{ backgroundColor: "var(--color-primary)" }}>
          Salir
        </button>
      }
    >
      <div className="flex gap-5">
        {/* Sidebar izquierda */}
        <div className="flex flex-col gap-4 shrink-0" style={{ width: 190 }}>
          <div className="border border-gray-300 rounded-sm divide-y divide-gray-100 overflow-hidden">
            <div className="flex items-center justify-between gap-2 px-3 py-2">
              <span
                className="text-body-sm tabular-nums text-gray-800 truncate font-mono"
              >
                {referencia}
              </span>
              <ModalCheckbox label="" defaultChecked />
            </div>
            <div className="flex items-center justify-between gap-2 px-3 py-2">
              <span className="text-body-sm text-gray-700">Reposición 1</span>
              <ModalCheckbox label="" defaultChecked />
            </div>
          </div>

          <div>
            <FieldLabel>Selección</FieldLabel>
            <div className="flex flex-col gap-2 mt-1">
              <ModalRadio label="Interrupción" checked={seleccion === "interrupcion"} onSelect={() => setSeleccion("interrupcion")} />
              <ModalRadio label="Reclamos" checked={seleccion === "reclamos"} onSelect={() => setSeleccion("reclamos")} />
              <ModalRadio label="CTs" checked={seleccion === "cts"} onSelect={() => setSeleccion("cts")} />
              <ModalRadio label="Clientes" checked={seleccion === "clientes"} onSelect={() => setSeleccion("clientes")} />
            </div>
          </div>

          <div>
            <FieldLabel>Tarifas</FieldLabel>
            <div className="flex flex-col gap-2 mt-1">
              <ModalRadio label="Todas" checked={tarifa === "todas"} onSelect={() => setTarifa("todas")} />
              <ModalRadio label="MT/AT" checked={tarifa === "mtat"} onSelect={() => setTarifa("mtat")} />
              <ModalRadio label="BT" checked={tarifa === "bt"} onSelect={() => setTarifa("bt")} />
            </div>
          </div>
        </div>

        {/* Tabla origen */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <div className="border border-gray-300 rounded-sm overflow-y-auto" style={{ height: 240 }}>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {["Fecha", "Clientes", "Repo"].map((c) => (
                    <th key={c} className="px-3 py-2 text-left text-caption font-semibold uppercase tracking-[0.07em] text-gray-600 whitespace-nowrap">
                      {c}
                    </th>
                  ))}
                  <th className="w-9 px-2 py-2">
                    <div className="flex justify-center">
                      <ModalCheckbox
                        label=""
                        checked={leftChecked.size > 0 && leftChecked.size === leftRows.length}
                        onChange={toggleSelectAll}
                      />
                    </div>
                  </th>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-1.5"><input className={MOD_FIELD_CLS} style={{ height: 26 }} /></td>
                  <td className="p-1.5"><input className={MOD_FIELD_CLS} style={{ height: 26 }} /></td>
                  <td className="p-1.5"><input className={MOD_FIELD_CLS} style={{ height: 26 }} /></td>
                  <td />
                </tr>
              </thead>
              <tbody>
                {leftRows.length === 0 ? (
                  <tr>
                    <td colSpan={4}>
                      <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
                        <span className="text-gray-400"><IcoInbox /></span>
                        <p className="text-body font-medium text-gray-600">No hay registros</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  leftRows.map((r, i) => (
                    <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-2 text-body text-gray-700 whitespace-nowrap">{r.fecha}</td>
                      <td className="px-3 py-2 text-body text-gray-700 tabular-nums">{r.clientes}</td>
                      <td className="px-3 py-2 text-body text-gray-700 tabular-nums">{r.repo}</td>
                      <td className="px-2 py-2">
                        <div className="flex justify-center">
                          <ModalCheckbox label="" checked={leftChecked.has(i)} onChange={(c) => toggleLeftChecked(i, c)} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between text-body-sm text-gray-600">
            <button className="px-2.5 py-1 rounded border border-gray-400 bg-white disabled:opacity-40" disabled>Anterior</button>
            <span>Página <span className="font-medium text-gray-800">1</span> de <span className="font-medium text-gray-800">1</span></span>
            <button className="px-2.5 py-1 rounded border border-gray-400 bg-white disabled:opacity-40" disabled>Siguiente</button>
          </div>
          <ModalCheckbox label="Ocultar existentes en ambas interrupciones" checked={ocultarExistentes} onChange={setOcultarExistentes} />
        </div>

        {/* Botones centrales */}
        <div className="flex flex-col gap-2 justify-center shrink-0" style={{ width: 150 }}>
          <button type="button" onClick={copiar} className={actionBtnCls("neutral")}>
            Copiar - {">>"}
          </button>
          <button type="button" onClick={mover} className={actionBtnCls("neutral")}>
            Mover - {">>"}
          </button>
          <button type="button" onClick={eliminar} className={actionBtnCls("neutral")}>
            Eliminar
          </button>
          <button type="button" className={actionBtnCls("neutral")}>
            Modifica en destino
          </button>
          <button type="button" onClick={swap} className={modalNeutralBtnCls}>
            {"<< - >>"}
          </button>
        </div>

        {/* Tabla destino */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <div className="border border-gray-300 rounded-sm overflow-y-auto" style={{ height: 240 }}>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {["Fecha", "Clientes", "Repo"].map((c) => (
                    <th key={c} className="px-3 py-2 text-left text-caption font-semibold uppercase tracking-[0.07em] text-gray-600 whitespace-nowrap">
                      {c}
                    </th>
                  ))}
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-1.5"><input className={MOD_FIELD_CLS} style={{ height: 26 }} /></td>
                  <td className="p-1.5"><input className={MOD_FIELD_CLS} style={{ height: 26 }} /></td>
                  <td className="p-1.5"><input className={MOD_FIELD_CLS} style={{ height: 26 }} /></td>
                </tr>
              </thead>
              <tbody>
                {rightRows.length === 0 ? (
                  <tr>
                    <td colSpan={3}>
                      <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
                        <span className="text-gray-400"><IcoInbox /></span>
                        <p className="text-body font-medium text-gray-600">No hay registros</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  rightRows.map((r) => (
                    <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-2 text-body text-gray-700 whitespace-nowrap">{r.fecha}</td>
                      <td className="px-3 py-2 text-body text-gray-700 tabular-nums">{r.clientes}</td>
                      <td className="px-3 py-2 text-body text-gray-700 tabular-nums">{r.repo}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between text-body-sm text-gray-600">
            <button className="px-2.5 py-1 rounded border border-gray-400 bg-white disabled:opacity-40" disabled>Anterior</button>
            <span>Página <span className="font-medium text-gray-800">1</span> de <span className="font-medium text-gray-800">1</span></span>
            <button className="px-2.5 py-1 rounded border border-gray-400 bg-white disabled:opacity-40" disabled>Siguiente</button>
          </div>
          <div className="relative">
            <input placeholder="Buscar destino" className={MOD_FIELD_CLS} style={{ paddingRight: 36 }} />
            <span className="absolute right-0 top-0 h-8 w-8 flex items-center justify-center text-gray-600">
              <IcoSearch />
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (usuario === "rdellamagiora" && password === "1234") {
      setLoading(true);
      setTimeout(onLogin, 600);
    } else {
      setError("Usuario o contraseña incorrectos.");
    }
  }

  const inputCls = "w-full px-[8px] py-[12px] [@media(max-height:760px)]:py-[var(--login-input-py,12px)] border border-gray-500 rounded-sm bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all";
  const inputStyle: React.CSSProperties = { fontWeight: 400, fontSize: 14, color: "var(--color-gray-900)", lineHeight: "20px", letterSpacing: "0.14px" };
  const labelStyle: React.CSSProperties = { fontWeight: 400, fontSize: 14, color: "var(--color-gray-700)", lineHeight: "20px", letterSpacing: "0.14px" };

  return (
    <div className="relative w-full h-screen overflow-hidden flex">
      {/* Background image */}
      <img src={imgLoginBg} alt="" className="absolute inset-0 size-full object-cover pointer-events-none" />

      {/* Left half: branding */}
      <div className="relative flex-1 flex flex-col justify-center" style={{ padding: "100px" }}>
        <div style={{ filter: "brightness(0) invert(1)", width: 272 }}>
          <Logo />
        </div>
        <div style={{ marginTop: 50 }}>
          <p className="font-sans" style={{ fontWeight: 600, fontSize: "39.06px", color: "white", lineHeight: "46.87px" }}>SISENRE</p>
          <p className="font-sans" style={{ fontWeight: 600, fontSize: "39.06px", color: "white", lineHeight: "46.87px" }}>Calidad de servicio</p>
        </div>
      </div>

      {/* Right half: 600px card, top aligned ~15px below logo. Todo el
          padding/gap de acá abajo es en px inline (no clases Tailwind), así
          que no participa de --spacing — cada valor que aporta alto
          vertical usa var(--login-*, valor-normal) para poder achicarse en
          tier 760px (ver index.css) sin tocar el tamaño normal. */}
      <div className="relative flex-1 flex flex-col" style={{ paddingTop: "var(--login-top-offset, calc(38vh + 15px))" }}>
        <div className="bg-gray-50 rounded-tl-[12px] rounded-tr-[12px] flex flex-col overflow-hidden flex-1 min-h-0" style={{ width: 600, margin: "0 auto" }}>
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0" style={{ paddingTop: "var(--login-form-pt, 60px)", paddingLeft: 32, paddingRight: 32, paddingBottom: "var(--login-form-pb, 32px)" }}>
            {/* Header */}
            <div className="flex flex-col gap-[8px] [@media(max-height:760px)]:gap-[var(--login-header-gap,8px)] shrink-0">
              <p className="font-sans" style={{ fontWeight: 600, fontSize: "var(--login-title-size, 40px)", color: "var(--color-secondary)", lineHeight: "var(--login-title-line, 40px)" }}>Bienvenido </p>
              <p className="font-sans" style={{ fontWeight: 400, fontSize: 16, color: "var(--color-gray-700)", lineHeight: "20px", letterSpacing: "0.16px" }}>Ingresá tu usuario y contraseña</p>
            </div>

            {/* Inputs */}
            <div className="flex flex-col shrink-0" style={{ marginTop: "var(--login-inputs-mt, 24px)", gap: "var(--login-inputs-gap, 32px)" }}>
              <div className="flex flex-col gap-[4px]">
                <label className="font-sans" style={labelStyle}>Usuario</label>
                <input type="text" autoComplete="username" value={usuario} onChange={e => { setUsuario(e.target.value); setError(""); }} className={inputCls + " font-sans"} style={inputStyle} />
              </div>
              <div className="flex flex-col gap-[4px]">
                <label className="font-sans" style={labelStyle}>Contraseña</label>
                <input type="password" autoComplete="current-password" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} className={inputCls + " font-sans"} style={inputStyle} />
              </div>
            </div>

            {error && (
              <p className="mt-3 shrink-0 text-body-sm text-error bg-red-50 border border-red-200 rounded-sm px-3 py-2">{error}</p>
            )}

            {/* Button */}
            <div className="shrink-0" style={{ marginTop: "var(--login-button-mt, 32px)" }}>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-sm text-white hover:brightness-110 disabled:opacity-70 disabled:pointer-events-none active:scale-[0.99] transition-all font-sans"
                style={{
                  backgroundColor: "var(--color-primary)", fontWeight: 500, fontSize: 16, lineHeight: "20px",
                  paddingTop: "var(--login-button-py, 12px)", paddingBottom: "var(--login-button-py, 12px)", paddingLeft: 24, paddingRight: 24,
                  boxShadow: "0px 1px 2px 0px rgba(16,24,40,0.05)",
                }}
              >
                {loading ? "Ingresando…" : "Confirmar"}
              </button>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Footer */}
            <div className="shrink-0 text-center">
              <p className="font-sans" style={{ fontWeight: 400, fontSize: "var(--text-body-sm)", lineHeight: "16px", letterSpacing: "1px", color: "#000" }}>© Desarrollos propios 2026</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Select screen ────────────────────────────────────────────────────────────

function SelectScreen({ onSelect }: { onSelect: (v: "clasico" | "nuevo") => void }) {
  const [hovered, setHovered] = useState<string | null>(null);

  const options = [
    {
      id: "clasico",
      title: "SISENRE clásico",
      desc: "El SISENRE de siempre, el que ya conocías.",
      disabled: true,
    },
    {
      id: "nuevo",
      title: "SISENRE 2.0",
      desc: "Nuevo SISENRE, nuevo motor de datos y framework moderno.",
      disabled: false,
    },
  ] as const;

  return (
    <div
      className="w-full h-screen flex items-center justify-center font-sans"
      style={{ backgroundColor: "var(--color-gray-100)" }}
    >
      <div className="w-full max-w-[520px] px-6">
        {/* Header */}
        <div className="mb-6 pb-5 border-b border-gray-300">
          <h1 className="text-title-sm font-bold text-gray-900 mb-1">Bienvenido a SISENRE</h1>
          <p className="text-label text-gray-600">Seleccioná con qué herramienta comenzarás a trabajar</p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3">
          {options.map((opt) => {
            const isHov = hovered === opt.id && !opt.disabled;
            return (
              <button
                key={opt.id}
                disabled={opt.disabled}
                onClick={() => !opt.disabled && onSelect(opt.id)}
                onMouseEnter={() => setHovered(opt.id)}
                onMouseLeave={() => setHovered(null)}
                className="w-full text-left px-5 py-4 rounded-lg border transition-all duration-150"
                style={{
                  backgroundColor: isHov ? "var(--color-primary-tint)" : "#fff",
                  borderColor: isHov ? "var(--color-primary)" : "var(--color-gray-300)",
                  boxShadow: isHov ? "0 4px 16px rgba(77,151,250,0.12)" : "0 1px 3px rgba(21,40,80,0.05)",
                  cursor: opt.disabled ? "not-allowed" : "pointer",
                  opacity: opt.disabled ? 0.55 : 1,
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-label font-semibold text-gray-900 mb-0.5">{opt.title}</p>
                    <p className="text-body text-gray-600">{opt.desc}</p>
                  </div>
                  {!opt.disabled && (
                    <span
                      className="shrink-0 ml-4 transition-transform duration-150"
                      style={{
                        color: isHov ? "var(--color-primary)" : "var(--color-gray-400)",
                        transform: isHov ? "translateX(3px)" : "none",
                      }}
                    >
                      <ChevronRight />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-center text-caption text-gray-500 mt-8">© Desarrollos propios 2026</p>
      </div>
    </div>
  );
}

// ─── Welcome screen content ───────────────────────────────────────────────────

// Selector de día acotado al mes de entrega — mismo mecanismo/estilos que
// DateTimeField (DayPicker/es/DateTimeChevron/DateTimeCaptionLabel/
// DAY_PICKER_CLASSNAMES/IcoCalendar), pero sin hora y sin navegación de mes:
// startMonth === endMonth, así que las flechas del calendario quedan sin
// efecto y clickear un día aplica y cierra al toque (no hay hora que
// confirmar aparte, no hace falta botón "Aplicar").
function DiaDelMesField({ value, onChange, anio, mes }: { value: number; onChange: (d: number) => void; anio: number; mes: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  const direction = useDropdownDirection(ref, open, 340);
  const mesFijo = new Date(anio, mes, 1);
  return (
    <div ref={ref} style={{ position: "relative" }} className="shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-8 px-2.5 flex items-center gap-1.5 border border-gray-400 rounded-sm bg-white text-body-sm font-semibold text-gray-900 hover:border-primary hover:text-secondary transition-colors"
      >
        {value}
        <span className="text-gray-500"><IcoCalendar /></span>
      </button>
      {open && (
        <div
          className="absolute z-30 bg-white border border-gray-300 rounded-lg p-3"
          style={{ ...dropdownAnchorStyle(direction, 6), right: 0, width: "max-content", boxShadow: "var(--shadow-high)" }}
        >
          <DayPicker
            mode="single"
            navLayout="around"
            locale={es}
            defaultMonth={mesFijo}
            startMonth={mesFijo}
            endMonth={mesFijo}
            selected={new Date(anio, mes, value)}
            onSelect={(d) => { if (d) { onChange(d.getDate()); setOpen(false); } }}
            components={{ Chevron: DateTimeChevron, CaptionLabel: DateTimeCaptionLabel }}
            classNames={DAY_PICKER_CLASSNAMES}
          />
        </div>
      )}
    </div>
  );
}

function CronogramaEnre() {
  // El cronograma marca el MES DE ENTREGA/CORRECCIÓN (cuando IT hace el
  // trabajo) — que es un mes POSTERIOR al período que se está procesando.
  // Ej.: IT entrega las tablas de Agosto 2026 recién en septiembre — por
  // eso la grilla muestra septiembre pero la leyenda de período dice
  // "Período Agosto 2026". El período se calcula como el mes anterior al
  // de entrega (con rollover de año si hace falta), no se hardcodea.
  const ANIO_ENTREGA = 2026;
  const MES_ENTREGA = 8; // 0=enero..11=diciembre → 8=septiembre

  const MESES_ES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  const fechaEntregaMes = new Date(ANIO_ENTREGA, MES_ENTREGA, 1);
  const fechaPeriodo = new Date(ANIO_ENTREGA, MES_ENTREGA - 1, 1);
  const nombreMesEntrega = MESES_ES[fechaEntregaMes.getMonth()];
  const nombrePeriodo = `${MESES_ES[fechaPeriodo.getMonth()].replace(/^./, (c) => c.toUpperCase())} ${fechaPeriodo.getFullYear()}`;
  const DIAS_MES = new Date(ANIO_ENTREGA, MES_ENTREGA + 1, 0).getDate();

  // Entrega y entrega tentativa son puntuales y EDITABLES; la ventana de
  // corrección se autocompleta con todos los días entre las dos.
  const [diaEntrega, setDiaEntrega] = useState(11);
  const [diaTentativa, setDiaTentativa] = useState(29);

  const hoyReal = new Date();
  const HOY = (hoyReal.getFullYear() === ANIO_ENTREGA && hoyReal.getMonth() === MES_ENTREGA) ? hoyReal.getDate() : null;

  const hayCorreccion = diaTentativa - diaEntrega > 1;
  const correccionDesde = diaEntrega + 1;
  const correccionHasta = diaTentativa - 1;

  function etapaDelDia(dia: number): "entrega" | "correccion" | "tentativa" | null {
    if (dia === diaEntrega) return "entrega";
    if (dia === diaTentativa) return "tentativa";
    if (hayCorreccion && dia > diaEntrega && dia < diaTentativa) return "correccion";
    return null;
  }

  // Swatches de la referencia (solo lectura) — acá sí van sólidos, es una
  // leyenda de color puntual, no una celda de calendario completa.
  const COLOR_ETAPA = {
    entrega: "var(--color-primary)",
    correccion: "var(--color-warning)",
    tentativa: "var(--color-error)",
  } as const;

  const LEYENDA = [
    { etapa: "entrega" as const, label: "Entrega de tablas" },
    { etapa: "correccion" as const, label: "Ventana de corrección" },
    { etapa: "tentativa" as const, label: "Entrega tentativa final" },
  ];

  const primerDiaSemana = (fechaEntregaMes.getDay() + 6) % 7; // Lun=0..Dom=6
  const celdas: { dia: number | null; col: number; row: number }[] = [];
  for (let i = 0; i < primerDiaSemana; i++) celdas.push({ dia: null, col: i, row: 0 });
  for (let dia = 1; dia <= DIAS_MES; dia++) {
    const idx = primerDiaSemana + dia - 1;
    celdas.push({ dia, col: idx % 7, row: Math.floor(idx / 7) });
  }
  const totalFilas = Math.max(...celdas.map((c) => c.row)) + 1;

  // Calendario con ancho PROPIO, acotado — no estira a lo ancho de la card
  // (eso hacía que cada celda quedara un rectángulo achatado en vez de un
  // día). 34px de celda × 7 columnas + gaps ≈ 256px, proporción real de
  // calendario.
  const CAL_CELL = 34;
  const CAL_WIDTH = CAL_CELL * 7 + 3 * 6;

  const claseCeldaBase = "rounded-[3px] flex items-center justify-center text-micro font-semibold border";

  return (
    <div className="bg-white rounded-md border border-gray-300 px-5 py-4" style={{ maxWidth: 760 }}>
      <div className="mb-4">
        <span className="inline-flex items-center gap-1.5 h-7 pl-2.5 pr-3 rounded-full bg-primary-tint border border-chip-border text-secondary text-body-sm font-semibold">
          <span className="shrink-0 rounded-full" style={{ width: 6, height: 6, backgroundColor: "var(--color-primary)" }} />
          Período {nombrePeriodo}
        </span>
      </div>

      <div className="flex gap-6 items-start">
        {/* Calendario — ancho fijo, celdas casi cuadradas, colores tenues */}
        <div className="shrink-0" style={{ width: CAL_WIDTH }}>
          <div className="grid gap-[3px] mb-1" style={{ gridTemplateColumns: `repeat(7, ${CAL_CELL}px)` }}>
            {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
              <span key={i} className="text-micro text-center font-medium text-gray-400">{d}</span>
            ))}
          </div>
          <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(7, ${CAL_CELL}px)`, gridTemplateRows: `repeat(${totalFilas}, 30px)` }}>
            {celdas.map((c, i) => {
              if (c.dia === null) return <div key={i} style={{ gridColumn: c.col + 1, gridRow: c.row + 1 }} />;
              const esFinDeSemana = c.col >= 5;
              const etapaReal = etapaDelDia(c.dia);
              const etapa = esFinDeSemana ? null : etapaReal;
              const esHoy = c.dia === HOY;

              let clase = claseCeldaBase + " border-transparent bg-gray-100 text-gray-500";
              let estiloExtra: React.CSSProperties = {};
              if (etapa === "entrega") {
                clase = claseCeldaBase + " bg-primary-tint border-primary text-secondary";
              } else if (etapa === "correccion") {
                clase = claseCeldaBase + " bg-warning-bg border-warning-border text-warning-text font-medium";
              } else if (etapa === "tentativa") {
                clase = claseCeldaBase + " border-error-border text-error";
                estiloExtra.backgroundColor = "var(--color-error-bg)";
              }

              return (
                <div
                  key={i}
                  title={`${c.dia} de ${nombreMesEntrega}${etapa ? " — " + LEYENDA.find((l) => l.etapa === etapa)?.label : ""}`}
                  className={clase}
                  style={{
                    gridColumn: c.col + 1,
                    gridRow: c.row + 1,
                    boxShadow: esHoy ? "0 0 0 2px var(--color-secondary)" : undefined,
                    ...estiloExtra,
                  }}
                >
                  {c.dia}
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel derecho — referencia de solo lectura arriba, fechas clave editables abajo, separadas */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="shrink-0 rounded-[2px]" style={{ width: 10, height: 10, backgroundColor: COLOR_ETAPA.entrega }} />
              <span className="text-body-sm text-gray-600 flex-1 min-w-0">Entrega de tablas</span>
              <span className="text-body-sm font-medium text-gray-900 shrink-0">{diaEntrega} de {nombreMesEntrega}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="shrink-0 rounded-[2px]" style={{ width: 10, height: 10, backgroundColor: COLOR_ETAPA.correccion }} />
              <span className="text-body-sm text-gray-600 flex-1 min-w-0">Ventana de corrección</span>
              <span className="text-body-sm font-medium text-gray-900 shrink-0">
                {hayCorreccion ? `${correccionDesde} – ${correccionHasta} de ${nombreMesEntrega}` : "—"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="shrink-0 rounded-[2px]" style={{ width: 10, height: 10, backgroundColor: COLOR_ETAPA.tentativa }} />
              <span className="text-body-sm text-gray-600 flex-1 min-w-0">Entrega tentativa final</span>
              <span className="text-body-sm font-medium text-gray-900 shrink-0">{diaTentativa} de {nombreMesEntrega}</span>
            </div>
          </div>

          <div className="border-t border-gray-200 my-3" />

          <p className="text-caption font-semibold uppercase tracking-[0.07em] text-gray-600 mb-2">Fechas clave</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Entrega de tablas</FieldLabel>
              <div className="flex items-center gap-1.5">
                <DiaDelMesField value={diaEntrega} onChange={setDiaEntrega} anio={ANIO_ENTREGA} mes={MES_ENTREGA} />
                <span className="text-body-sm text-gray-600 truncate">de {nombreMesEntrega}</span>
              </div>
            </div>
            <div>
              <FieldLabel>Entrega tentativa</FieldLabel>
              <div className="flex items-center gap-1.5">
                <DiaDelMesField value={diaTentativa} onChange={setDiaTentativa} anio={ANIO_ENTREGA} mes={MES_ENTREGA} />
                <span className="text-body-sm text-gray-600 truncate">de {nombreMesEntrega}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WelcomeContent({ onIrATabla }: { onIrATabla: (k: AbmTableKey) => void }) {
  const quickLinks: { code: string; tableKey: AbmTableKey; label: string; desc: string; icon: React.ReactNode }[] = [
    { code: "CDS2", tableKey: "cds2", label: "Interrupciones", desc: "Consulta y gestión de interrupciones computadas", icon: <IcoZap /> },
    { code: "CDS3", tableKey: "cds3", label: "Interrupciones no computables", desc: "Registro de interrupciones no imputables", icon: <IcoZap /> },
    { code: "CDS4", tableKey: "cds4", label: "Reposiciones", desc: "Seguimiento de reposiciones de servicio", icon: <IcoZap /> },
    { code: "CDS8", tableKey: "cds8", label: "Reclamos", desc: "Gestión de reclamos de calidad de servicio", icon: <IcoZap /> },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-10 py-10">
      {/* Greeting */}
      <div className="mb-8">
        <p className="text-body-sm font-medium uppercase tracking-widest text-gray-500 mb-1">SISENRE 2.0 · Agosto 2026</p>
        <h2 className="text-title font-bold text-gray-900 leading-tight">Buenos días, Rdellamagiora</h2>
        <p className="text-[14px] text-gray-600 mt-1">Seleccioná una sección del menú o usá los accesos rápidos para comenzar.</p>
      </div>

      {/* Quick access */}
      <p className="text-caption font-semibold uppercase tracking-[0.09em] text-gray-500 mb-3">Accesos frecuentes</p>
      <div className="grid grid-cols-2 gap-4 mb-8" style={{ maxWidth: 760 }}>
        {quickLinks.map((item) => (
          <div
            key={item.code}
            onClick={() => onIrATabla(item.tableKey)}
            className="group bg-white rounded-md border border-gray-300 px-5 py-4 cursor-pointer transition-all duration-150 hover:border-primary hover:shadow-[0_4px_16px_rgba(77,151,250,0.1)]"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-primary shrink-0">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-label font-semibold text-gray-900">{item.label}</p>
                  <span
                    className="text-micro font-mono font-medium px-1.5 py-0.5 rounded-[3px] border border-gray-400 text-gray-600"
                  >
                    {item.code}
                  </span>
                </div>
                <p className="text-body-sm text-gray-600 leading-snug">{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cronograma ENRE */}
      <p className="text-caption font-semibold uppercase tracking-[0.09em] text-gray-500 mb-3">Cronograma ENRE</p>
      <CronogramaEnre />
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

// ─── Modal: Datos de la interrupción ───────────────────────────────────────
// Mismo chrome que el resto de los modales de la app (Modal genérico:
// header claro, X, footer con modalNeutralBtnCls/modalPrimaryBtnCls), sin
// excepciones de color — "Procesar" usa el mismo azul primario que el botón
// principal de cualquier otro modal.

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[9px] font-semibold uppercase tracking-[0.05em] text-gray-600 mb-1 truncate">{label}</p>
      <div className="h-7 px-2 flex items-center text-body-sm bg-gray-100 border border-gray-300 rounded-sm text-gray-700 truncate">
        {value || " "}
      </div>
    </div>
  );
}

const DATOS_INTERRUPCION_COLUMNS: { label: string; value: string }[][] = [
  [
    { label: "Repos", value: "1" },
    { label: "Usu_BT", value: "0" },
    { label: "Usu_MT", value: "0" },
    { label: "Pot Cont", value: "0" },
    { label: "CT", value: "0" },
    { label: "CT en 0", value: "0" },
    { label: "Usu BT CT", value: "0" },
    { label: "Rec", value: "0" },
    { label: "Reit", value: "0" },
    { label: "Rec ENRE", value: "0" },
  ],
  [
    { label: "Rec ATF", value: "0" },
    { label: "Rec ATP", value: "0" },
    { label: "Rec MTF", value: "0" },
    { label: "Rec MTP", value: "0" },
    { label: "Rec BTF", value: "0" },
    { label: "Rec BTP", value: "0" },
    { label: "Rec Otros", value: "0" },
    { label: "Hue Ini", value: "" },
    { label: "Max Fin", value: "" },
    { label: "Hue Fin", value: "" },
  ],
  [
    { label: "Hue Rec 180", value: "" },
    { label: "Rec 12", value: "0" },
    { label: "Rec AU", value: "0" },
    { label: "Hue Ini SR", value: "" },
    { label: "Max Med SR", value: "" },
    { label: "Hue Fin SR", value: "" },
    { label: "Hue Rec 180 SR", value: "" },
    { label: "Rec 12 SR", value: "0" },
    { label: "Rec Au SR", value: "0" },
    { label: "Cli T9", value: "0" },
  ],
  [
    { label: "T9 T3 MT", value: "0" },
    { label: "T9 T3 BT", value: "0" },
    { label: "Cli T9 no T3", value: "0" },
    { label: "Cli T9 AP", value: "0" },
    { label: "Dura Max", value: "" },
    { label: "Cli Int", value: "0" },
    { label: "Cli Min", value: "0" },
  ],
  [
    { label: "SAIFI", value: "0.00" },
    { label: "SAIDI", value: "0.00" },
    { label: "Energ no Suminist", value: "0" },
    { label: "Marginal", value: "0" },
    { label: "Marginal Aj", value: "0" },
  ],
];

function DatosInterrupcionModal({
  open,
  onClose,
  referencia,
  fechaInicio,
  fechaUltRepo,
}: {
  open: boolean;
  onClose: () => void;
  referencia: string;
  fechaInicio: string;
  fechaUltRepo: string;
}) {
  const topFields = [
    { label: "Interrupción", value: referencia },
    { label: "Fecha inicio", value: fechaInicio },
    { label: "Fecha ult. repo.", value: fechaUltRepo },
    { label: "Inicio del proceso", value: fechaInicio },
    { label: "Fin del proceso", value: fechaUltRepo },
    { label: "Usuario del proceso", value: "RDELLAMAGIORA" },
  ];

  return (
    <Modal
      title="Datos de la Interrupción"
      subtitle={referencia}
      open={open}
      onClose={onClose}
      size="xl"
      footer={
        <>
          <button type="button" onClick={onClose} className={modalNeutralBtnCls}>
            Salir
          </button>
          <button type="button" onClick={onClose} className={modalPrimaryBtnCls} style={{ backgroundColor: "var(--color-primary)" }}>
            Procesar
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-6 gap-3">
          {topFields.map((f) => (
            <ReadOnlyField key={f.label} label={f.label} value={f.value} />
          ))}
        </div>

        <div className="grid grid-cols-5 gap-4">
          {DATOS_INTERRUPCION_COLUMNS.map((col, ci) => (
            <div key={ci} className="flex flex-col gap-2.5">
              {col.map((f) => (
                <ReadOnlyField key={f.label} label={f.label} value={f.value} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

// ─── Modal: Confirmar borrado ───────────────────────────────────────────────
// Confirmación antes de eliminar un registro de una tabla ABM — mismo Modal
// compartido, tamaño "sm". Botón primario en color de error (no el azul de
// acciones normales) con el verbo de la acción ("Eliminar"), nunca "Sí/No" —
// así el compromiso queda claro sin releer la pregunta.
function ConfirmarBorrarModal({
  open,
  registro,
  tabla,
  onCancelar,
  onConfirmar,
}: {
  open: boolean;
  registro: string;
  // Nomenclatura de la tabla ABM activa tal como la conoce el usuario
  // ("Tabla 2".."Tabla 9 NM", ver ABM_ITEMS) — no el nombre descriptivo de
  // config.titulo ("Interrupciones", etc.), que es una etiqueta interna.
  tabla: string;
  onCancelar: () => void;
  onConfirmar: () => void;
}) {
  return (
    <Modal
      title="¿Eliminar el registro?"
      open={open}
      onClose={onCancelar}
      size="sm"
      footer={
        <>
          <button type="button" onClick={onCancelar} className={modalNeutralBtnCls}>Cancelar</button>
          <button type="button" onClick={onConfirmar} className={modalPrimaryBtnCls} style={{ backgroundColor: "var(--color-error)" }}>Eliminar</button>
        </>
      }
    >
      <p className="text-body text-gray-700">
        Se eliminará el registro{" "}
        <span className="font-medium text-gray-900 tabular-nums font-mono">
          {registro}
        </span>
        {" "}de <span className="font-medium text-gray-900">{tabla}</span>. Esta acción no se puede deshacer.
      </p>
    </Modal>
  );
}

// ─── Modal: Confirmar modificación ─────────────────────────────────────────
const NOTA_PRESETS = ["Procesar Lotes", "Test 2", "Test 3", "Alta manual / Modifico", "2da Alta Manual"];
const NOTA_OPCIONES = [...NOTA_PRESETS, "Otra (especificar)"];

function ConfirmarModificarModal({
  open,
  cambios,
  onCancelar,
  onConfirmar,
}: {
  open: boolean;
  cambios: { label: string; anterior: string; nuevo: string }[];
  onCancelar: () => void;
  onConfirmar: (nota: string) => void;
}) {
  const [nota, setNota] = useState("");
  const [notaManual, setNotaManual] = useState("");
  const esManual = nota === "__manual__";
  const notaFinal = (esManual ? notaManual : nota).trim();
  const seleccionBoton = esManual ? "Otra (especificar)" : nota;

  // Reset cada vez que se abre — para que la próxima vez no arranque con la
  // nota de la edición anterior ya seleccionada.
  useEffect(() => {
    if (open) { setNota(""); setNotaManual(""); }
  }, [open]);

  return (
    <Modal
      title="Justificá el cambio antes de guardar"
      open={open}
      onClose={onCancelar}
      size="lg"
      footer={
        <>
          <button type="button" onClick={onCancelar} className={modalNeutralBtnCls}>Cancelar</button>
          <button
            type="button"
            onClick={() => onConfirmar(notaFinal)}
            disabled={!notaFinal}
            className={modalPrimaryBtnCls}
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Guardar
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-caption font-semibold uppercase tracking-[0.07em] text-gray-600 mb-3">Resumen de cambios</p>
          {cambios.length === 0 ? (
            <p className="text-body-sm text-gray-500">No se detectaron cambios respecto al registro original.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {cambios.map((c) => (
                <div key={c.label} className="flex items-center gap-3 px-3 py-2 rounded-sm bg-gray-50 border border-gray-200">
                  <span className="w-[38%] shrink-0 text-body-sm font-medium text-gray-700">{c.label}</span>
                  <span className="flex-1 min-w-0 text-body-sm text-gray-500 line-through truncate">{c.anterior || "(vacío)"}</span>
                  <span className="shrink-0 text-gray-400">→</span>
                  <span className="flex-1 min-w-0 text-body-sm font-semibold text-gray-900 truncate">{c.nuevo || "(vacío)"}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-sm border border-primary bg-primary-tint p-4">
          <p className="text-caption font-semibold uppercase tracking-[0.07em] text-secondary mb-1">Motivo</p>
          <p className="text-body-sm text-gray-600 mb-3">
            Seleccioná una nota o ingresá una manual para justificar este cambio.
          </p>
          <ButtonSelectGroup
            options={NOTA_OPCIONES}
            selected={seleccionBoton ? [seleccionBoton] : []}
            onToggle={(opt) => setNota(opt === "Otra (especificar)" ? "__manual__" : opt)}
          />
          {esManual && (
            <input
              autoFocus
              value={notaManual}
              onChange={(e) => setNotaManual(e.target.value)}
              placeholder="Escribí el motivo de la modificación"
              className="mt-2 w-full h-9 px-2.5 text-body bg-white border border-gray-400 rounded-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-focus focus:ring-2 focus:ring-focus/10"
            />
          )}
        </div>
      </div>
    </Modal>
  );
}

// ─── Modificar content ────────────────────────────────────────────────────────

const RECORD = SAMPLE_ROWS[0]; // BFZ202607056849

// Clases únicas para todo <input>/<select> de texto simple de la app —
// Modificar, Alta/Búsqueda ABM y ValuePicker comparten estas dos (antes
// existían por separado como inputCls/selectCls, ya unificadas acá).
const MOD_FIELD_CLS =
  "w-full h-8 px-2.5 text-body bg-white border border-gray-400 rounded-sm text-gray-900 " +
  "placeholder:text-gray-500 focus:outline-none focus:border-focus focus:ring-2 focus:ring-focus/10 transition-all duration-150";

const MOD_SELECT_CLS =
  "h-8 px-2.5 pr-7 text-body bg-white border border-gray-400 rounded-sm text-gray-900 appearance-none " +
  "cursor-pointer focus:outline-none focus:border-focus focus:ring-2 focus:ring-focus/10 transition-all duration-150 shrink-0";

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

// Solo label/alert/tabKey son estáticos — el "value" que se muestra en
// cada tarjeta se recalcula por interrupción seleccionada (ver
// generarTablasRelacionadas más abajo), no es un dato fijo del ítem.
const STATUS_ITEMS = [
  { label: "TABLA 3", alert: false, tabKey: "tabla3" },
  { label: "TABLA 5", alert: false, tabKey: "tabla5" },
  { label: "TABLA 6", alert: false, tabKey: "tabla6" },
  { label: "TABLA 8", alert: false, tabKey: "tabla8" },
  { label: "TABLA 9", alert: false, tabKey: "tabla9" },
];

// Fases de reposición de la interrupción seleccionada — mostrada siempre
// visible en la Card B de Consultas de interrupción (ya no detrás de un
// tab del drawer). Varía por interrupción: la semilla es la referencia
// seleccionada, así que la misma interrupción siempre muestra las mismas
// fases pero cada interrupción tiene las suyas. La cantidad de filas está
// sesgada hacia pocas (1-3 el caso típico, 4-6 menos común, 7-10 raro).
function generarFasesSinteticas(referencia: string): { nro: number; horaRep: string; clientes: number; clientesTA: number }[] {
  const rng = crearRng(hashSemilla(referencia + ":fases"));
  const dado = rng();
  const cantidad = dado < 0.65 ? enteroEntre(rng, 1, 3) : dado < 0.9 ? enteroEntre(rng, 4, 6) : enteroEntre(rng, 7, 10);
  return Array.from({ length: cantidad }, (_, i) => {
    const clientes = enteroEntre(rng, 1, 60);
    return {
      nro: i + 1,
      horaRep: fechaSintetica(rng, 7, 2026),
      clientes,
      clientesTA: enteroEntre(rng, 0, clientes),
    };
  });
}

// Valores de "Tablas relacionadas" (indicadores TABLA 3/5/6/8/9) para la
// interrupción seleccionada — mismo criterio: semilla = referencia, así
// que varían de forma determinística por interrupción. Tabla 3 es SI/NO;
// el resto son cantidades sesgadas hacia números bajos, con valores más
// altos ocasionales.
function generarTablasRelacionadas(referencia: string): Record<string, string> {
  const rng = crearRng(hashSemilla(referencia + ":relacionadas"));
  function cantidadBaja(): string {
    const dado = rng();
    const n = dado < 0.7 ? enteroEntre(rng, 0, 3) : dado < 0.92 ? enteroEntre(rng, 4, 10) : enteroEntre(rng, 11, 30);
    return String(n);
  }
  const tabla3 = rng() < 0.5 ? "SI" : "NO";
  return {
    tabla3,
    tabla5: cantidadBaja(),
    tabla6: cantidadBaja(),
    tabla8: cantidadBaja(),
    tabla9: cantidadBaja(),
  };
}

const DRAWER_TABS = [
  {
    key: "tabla4", label: "Tabla 4",
    subtitle: "Reposiciones",
    cols: ["Reposición", "Hora reposición", "Cant. clientes", "Cant. clientes T5"],
    // Sin uso — Card B arma sus propias filas via generarFasesSinteticas,
    // acá solo quedan cols/subtitle/key/label.
    rows: [] as string[][],
  },
  {
    key: "tabla3", label: "Tabla 3",
    subtitle: "Existencia en tabla",
    cols: ["Existencia"],
    rows: [] as string[][],
  },
  {
    key: "tabla5", label: "Tabla 5",
    subtitle: "Transformadores MT/BT repuestos en interrupciones AT/MT (CDS5)",
    cols: ["Interrupción", "Fase", "Cadena eléctrica", "Potencia (Kva)", "Fase eléctrica", "Cant. clientes BT"],
    rows: [] as string[][],
  },
  {
    key: "tabla6", label: "Tabla 6",
    subtitle: "Clientes AT/MT afectados en interrupciones AT/MT (CDS6)",
    cols: ["Interrupción", "Fase", "Cliente", "Consumo", "CT T9", "CT T10", "Tarifa", "Demanda media", "Tensión"],
    // Mismo registro que ABM_TABLE_CONFIGS.cds6.rows[0] — permite que el
    // deep-link a ABM/CDS6 encuentre y seleccione esta fila en destino.
    rows: [["MPR202401004095", "1", "9933000000", "808151", "20044#BC-1", "20044#BC-1", "3MT", "290", "MT"]],
  },
  {
    key: "tabla8", label: "Tabla 8",
    subtitle: "Reclamos de clientes (CDS8)",
    cols: ["Reclamo", "Fecha", "Cliente", "Nombre", "Tarifa", "Causa", "Piso", "Dpto", "Partido"],
    rows: [["78291", "01/07/2026 00:05", "47291038", "GARCIA LUIS", "T1", "Falta de tensión", "3", "A", "SAN ISIDRO"]],
  },
  {
    key: "tabla9", label: "Tabla 9",
    subtitle: "Interrupciones por cliente (CDS9)",
    cols: ["Interrupción", "Fase", "Cliente", "Tarifa", "CT T9", "CT T10"],
    // Interrupción alineada con ABM_TABLE_CONFIGS.cds9.rows para que el
    // deep-link a ABM/CDS9 encuentre y seleccione la fila correspondiente.
    rows: [
      ["MFZ202401001157", "1", "0932073585", "1R", "9187#B1#9187-TR1", "9187#B1#9187-TR1#1#1"],
      ["MFZ202401001157", "1", "0420679018", "1R", "9552#B1#9552-TR1", "9552#B1#9552-TR1#1#1"],
      ["MFZ202401001157", "1", "8064795584", "1G", "9552#B1#9552-TR1", "9552#B1#9552-TR1#1#1"],
      ["MFZ202401001157", "1", "6332256529", "1R", "9187#B1#9187-TR1", "9187#B1#9187-TR1#1#1"],
      ["MFZ202401001157", "1", "9212796994", "1R", "9187#B1#9187-TR1", "9187#B1#9187-TR1#1#1"],
      ["MFZ202401001157", "1", "1835073321", "1R", "9187#B1#9187-TR1", "9187#B1#9187-TR1#1#2"],
      ["MFZ202401001157", "1", "7423312576", "1R", "9187#B1#9187-TR1", "9187#B1#9187-TR1#1#1"],
      ["MFZ202401001157", "1", "5265910967", "1R", "9187#B1#9187-TR1", "9187#B1#9187-TR1#1#2"],
    ],
  },
];

// Mapeo de tabs del drawer "Tablas relacionadas" a su tabla ABM equivalente
// — solo los 4 tabs acotados a la interrupción actual (CDS5/6/8/9); tabla3
// y tabla4 no tienen equivalente en el motor ABM y quedan sin mapeo.
// `campoCodigoInterrupcion` es el `nombre` del campo de búsqueda a precargar
// en destino; `columnaCodigoInterrupcion` es la key de columnasResultado
// usada para encontrar y seleccionar la fila correspondiente.
const DRAWER_TAB_TO_ABM: Partial<Record<string, { tableKey: AbmTableKey; campoCodigoInterrupcion: string; columnaCodigoInterrupcion: string }>> = {
  tabla5: { tableKey: "cds5", campoCodigoInterrupcion: "codigoInterrupcion", columnaCodigoInterrupcion: "ref" },
  tabla6: { tableKey: "cds6", campoCodigoInterrupcion: "codigoInterrupcion", columnaCodigoInterrupcion: "ref" },
  tabla8: { tableKey: "cds8", campoCodigoInterrupcion: "interrupcion", columnaCodigoInterrupcion: "ref" },
  tabla9: { tableKey: "cds9", campoCodigoInterrupcion: "codigoInterrupcion", columnaCodigoInterrupcion: "ref" },
};

// Badge de código de tabla (ej. "CDS2", "CDS6") — mismo componente en todo
// lugar donde haga falta dejar explícito sobre qué tabla ABM se trabaja:
// CardHeader (paneles de ABM) y la barra de búsqueda de Modificar interrupción.
function CodeBadge({ code }: { code: string }) {
  return (
    <span
      className="text-micro font-medium px-1.5 py-0.5 rounded-[3px] border border-gray-400 text-gray-600 shrink-0 font-mono"
    >
      {code}
    </span>
  );
}

// Header compartido de toda card contenedora (Búsqueda, Resultados,
// Interrupciones, Reposiciones, etc.) — altura fija (h-14, ni más ni menos)
// en vez de dejar que py-2.5 defina el alto según el contenido: sin esto,
// una card sin `right` (ej. Búsqueda) quedaba más baja que una con botones
// md ahí (ej. Resultados, con Auditoría/Exportar/Insertar a h-9), y las
// cards no alineaban entre sí. items-center centra título/tag/right dentro
// de ese alto fijo, tengan o no acciones.
function CardHeader({ title, tag, right }: { title: string; tag?: string; right?: React.ReactNode }) {
  return (
    <div className="h-14 px-5 border-b border-gray-200 bg-gray-50 shrink-0 flex items-center gap-2">
      <span className="text-label font-semibold text-gray-900">{title}</span>
      {tag && <CodeBadge code={tag} />}
      {right && <div className="ml-auto shrink-0">{right}</div>}
    </div>
  );
}

// Selector tipo botón (single-select) — usado en el formulario de Modificar
// interrupción para Origen y Tipo. El estado seleccionado se marca con
// borde + relleno claro (mismo lenguaje que el toggle "Filtro" de
// AltaClientesModal), nunca el azul relleno reservado para botones de
// acción primarios.
function ButtonSelectGroup({
  options,
  selected,
  onToggle,
  disabled = false,
  sizeCls = BTN_SM,
}: {
  options: string[];
  selected: string[];
  onToggle: (opt: string) => void;
  disabled?: boolean;
  sizeCls?: string;
}) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {options.map((opt) => {
        const isSel = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            disabled={disabled}
            aria-pressed={isSel}
            onClick={() => onToggle(opt)}
            className={`${sizeCls} font-medium border transition-all duration-150 shrink-0 ${
              disabled
                ? isSel
                  ? "bg-primary-tint/60 border-primary/50 text-secondary/80 cursor-not-allowed"
                  : "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                : isSel
                ? "bg-primary-tint border-primary text-secondary"
                : "bg-white border-gray-400 text-gray-700 hover:border-primary hover:bg-primary-tint hover:text-secondary active:scale-[0.98]"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// Barra de acciones contextual de la tabla "Interrupciones" (navegador
// compacto) en Modificar interrupción. Reusa actionBtnCls/ActionItem tal
// cual — mismos botones/variantes/colores que SelectionActionBar — pero en
// una única línea de altura fija: si los botones no entran en el ancho de
// la card, scrollean horizontalmente en vez de wrappear a varias líneas y
// comerse el espacio de la lista de referencias. Sin label/referencia — esa
// info ya se ve en el header "Interrupción" de la Card B de al lado.
// SelectionActionBar en sí no se toca y sigue igual en CDS2/CDS3/CDS4.
function CompactSelectionActionBar({ actions }: { actions: ActionItem[] }) {
  return (
    <div className="px-4 py-2 border-b border-gray-200 bg-white shrink-0 flex items-center gap-2 overflow-x-auto">
      {actions.map((a) => (
        <button
          key={a.label}
          onClick={a.onClick}
          disabled={a.disabled}
          className={actionBtnCls(a.variant) + " shrink-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"}
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}

// Barra de acciones persistente — a diferencia de SelectionActionBar /
// CompactSelectionActionBar (que solo aparecen con una fila seleccionada),
// esta vive siempre en pantalla. Cada acción decide su propio estado
// habilitado/deshabilitado via `disabled` en vez de depender de que la
// barra entera aparezca/desaparezca — mismo criterio que separa "+Insertar"
// (siempre disponible) de Auditoría/Modificar/Borrar (dependen de
// selección) en el motor ABM. Los botones van a ancho natural (no se
// estiran), alineados a la izquierda; un divisor vertical separa las
// acciones siempre habilitadas (Desarmes, Lotes) del resto, que dependen
// de tener una interrupción seleccionada — para que esa diferencia de
// lógica se note de un vistazo.
function PersistentActionsBar({
  siempreHabilitadas,
  condicionales,
}: {
  siempreHabilitadas: ActionItem[];
  condicionales: ActionItem[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  const direction = useDropdownDirection(ref, open, 300);

  function Boton(a: ActionItem) {
    return (
      <button
        key={a.label}
        onClick={a.onClick}
        disabled={a.disabled}
        className={actionBtnCls(a.variant) + " shrink-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"}
      >
        {a.label}
      </button>
    );
  }

  function ItemMenu(a: ActionItem) {
    return (
      <button
        key={a.label}
        type="button"
        disabled={a.disabled}
        onClick={() => { a.onClick?.(); setOpen(false); }}
        className={`w-full flex items-center px-2.5 py-2 rounded-sm text-left text-body transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none ${
          a.variant === "destructive" ? "text-error hover:bg-red-50" : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        {a.label}
      </button>
    );
  }

  // El trigger+panel de tier 760px no vive acá abajo — se porta junto al
  // buscador de la tabla "Interrupciones" (ver slot "acciones-tier2-slot",
  // dentro de ModificarContent) — no al header de esa card, ni al de
  // "Búsqueda", ni a la barra de título principal (esa es solo título +
  // selector de período en toda la app). Esto elimina la fila/card entera
  // de PersistentActionsBar en ese breakpoint en vez de solo vaciarla de
  // contenido.
  //
  // El elemento con ese id vive en uno de dos renders condicionales según
  // haya o no resultados (el buscador de tabla solo existe con datos
  // cargados) — por eso `portalNode` se re-resuelve en CADA render (sin
  // dependencias) en vez de una sola vez al montar: cuando cambia esa
  // condición, React desmonta el div viejo y monta uno nuevo con el mismo
  // id, y el efecto necesita volver a buscarlo o el portal quedaría
  // apuntando a un nodo ya removido del DOM.
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setPortalNode(document.getElementById("acciones-tier2-slot"));
  });

  const dropdown = (
    <div ref={ref} className="hidden [@media(max-height:760px)]:block relative mr-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={actionBtnCls("neutral") + " inline-flex items-center gap-1.5"}
      >
        Acciones
        <span className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}><ChevronDown /></span>
      </button>
      {open && (
        <div
          className="absolute left-0 w-56 bg-white rounded-sm border border-gray-300 z-50 overflow-hidden p-1.5 flex flex-col gap-0.5"
          style={{ ...dropdownAnchorStyle(direction, 5), boxShadow: "var(--shadow-mid)" }}
        >
          {siempreHabilitadas.map(ItemMenu)}
          <div className="h-px bg-gray-200 my-0.5" />
          {condicionales.map(ItemMenu)}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Fila expandida — tamaño normal de ventana. Se esconde entera (no
          solo se vacía) en tier 760px, porque el dropdown que la reemplaza
          vive en el header (portal de acá abajo), no en este lugar. */}
      <div
        className="rounded-sm border border-gray-300 bg-white shrink-0 flex items-center gap-2 flex-wrap px-3 py-2.5 [@media(max-height:760px)]:hidden"
        style={{ boxShadow: "var(--shadow-low)" }}
      >
        {siempreHabilitadas.map(Boton)}
        <div className="w-px h-5 bg-gray-300 shrink-0" />
        {condicionales.map(Boton)}
      </div>
      {portalNode && createPortal(dropdown, portalNode)}
    </>
  );
}

function ModificarContent({
  onIrAAbm,
  initialDrawerTab = null,
  initialReferencia = null,
}: {
  onIrAAbm: (link: AbmDeepLink) => void;
  // Tab del drawer a reabrir al montar — lo usa el botón "Volver" de
  // AbmScreen para restaurar el contexto desde el que se saltó a ABM.
  initialDrawerTab?: string | null;
  // Referencia (SAMPLE_ROWS) a re-seleccionar al montar — misma fuente que
  // initialDrawerTab, para volver exactamente a la interrupción que se
  // estaba mirando, no solo a la pantalla.
  initialReferencia?: string | null;
}) {
  const initialRowIndex = initialReferencia ? SAMPLE_ROWS.findIndex((r) => r.referencia === initialReferencia) : -1;
  const [hovFase, setHovFase] = useState<number | null>(null);
  const [modShowData, setModShowData] = useState(initialRowIndex >= 0);
  const [modSelectedRow, setModSelectedRow] = useState<number | null>(initialRowIndex >= 0 ? initialRowIndex : null);
  const [drawerTab, setDrawerTab] = useState<string | null>(initialDrawerTab);
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
  const [lotesOpen, setLotesOpen] = useState(false);
  const [intercambioOpen, setIntercambioOpen] = useState(false);
  const [datosInterrupcionOpen, setDatosInterrupcionOpen] = useState(false);
  const hasSelection = modSelectedRow !== null;
  const activeTabData = DRAWER_TABS.find(t => t.key === drawerTab);
  const selectedRecord = modSelectedRow !== null ? SAMPLE_ROWS[modSelectedRow] : null;
  // Tabla ABM equivalente al tab activo del drawer (solo CDS5/6/8/9) — si
  // existe, las filas de la mini-tabla y el estado vacío ofrecen el
  // deep-link hacia AbmScreen.
  const abmMapping = drawerTab ? DRAWER_TAB_TO_ABM[drawerTab] : undefined;
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
  // mismo criterio que ya usan "Datos de la Interrupción" y "Tablas
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

  const CARD_SHADOW = { boxShadow: "var(--shadow-low)" };

  // Tabla Referencia / Fecha (columna derecha)
  const modGetCells = (row: (typeof SAMPLE_ROWS)[number]) => [row.referencia, row.fecha];
  const { search: modSearch, setSearch: setModSearch, sortIdx: modSortIdx, sortDir: modSortDir, toggleSort: modToggleSort, visibleIndices: modVisibleIndices } =
    useTableToolbar(SAMPLE_ROWS, modGetCells);

  // Tabla del drawer de indicadores — se resetea al cambiar de tab
  const drawerRows = activeTabData?.rows ?? [];
  const drawerGetCells = (row: string[]) => row;
  const { search: drawerSearch, setSearch: setDrawerSearch, sortIdx: drawerSortIdx, sortDir: drawerSortDir, toggleSort: drawerToggleSort, visibleIndices: drawerVisibleIndices } =
    useTableToolbar(drawerRows, drawerGetCells, drawerTab);

  // Tabla 4 (Reposiciones) — siempre visible en la Card B, ya no vive detrás
  // de un tab del drawer. Sin interrupción seleccionada no hay reposiciones
  // que mostrar. Con selección, se generan (seed = referencia) filas
  // propias de esa interrupción — cantidad y valores varían de una a otra,
  // pero siempre las mismas para la misma interrupción.
  const tabla4Data = DRAWER_TABS.find(t => t.key === "tabla4")!;
  const tabla4Rows = selectedRecord
    ? generarFasesSinteticas(selectedRecord.referencia).map((f) => [String(f.nro), f.horaRep, String(f.clientes), String(f.clientesTA)])
    : [];

  // Fila de Reposiciones seleccionada (tabla interactiva, igual que
  // Interrupciones) — "Tablas relacionadas" y "Datos de la interrupción"
  // reflejan la reposición puntual seleccionada acá, no siempre la primera
  // ni la última. Al cambiar de interrupción se preselecciona la primera
  // reposición de la lista (si tiene alguna) — ver efecto más abajo.
  const [modSelectedFase, setModSelectedFase] = useState<number | null>(null);
  useEffect(() => {
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
    ? generarTablasRelacionadas(`${selectedRecord.referencia}#${filaFaseSeleccionada[0]}`)
    : null;

  // Datos de la Interrupción (widget + modal, Card B) — solo tiene sentido
  // con una interrupción seleccionada; sin selección, la sección completa
  // muestra un estado vacío (ver JSX) y estos valores no se usan.
  // "Fecha última reposición" ahora refleja la reposición seleccionada en
  // la Tabla 4 (no siempre la última de la lista).
  const timelineReferencia = selectedRecord?.referencia ?? "";
  const timelineFechaInicio = selectedRecord?.fecha ?? "";
  const timelineFechaUltRepo = filaFaseSeleccionada ? filaFaseSeleccionada[1] : "";
  const timelineDuracion = "0 dias, 2 hs, 8 min";
  const timelineTicks = [0, 14, 22, 38, 47, 63, 81, 100];

  // Navegación por teclado en la tabla de Reposiciones: mismo patrón que
  // Interrupciones (flecha abajo/arriba mueve la selección entre filas).
  const modFaseListRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (modSelectedFase === null || !modFaseListRef.current) return;
    modFaseListRef.current
      .querySelector<HTMLElement>(`[data-fase-index="${modSelectedFase}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [modSelectedFase]);
  function handleModFaseListKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (tabla4Rows.length === 0) return;
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    if (modSelectedFase === null) {
      setModSelectedFase(e.key === "ArrowDown" ? 0 : tabla4Rows.length - 1);
      return;
    }
    const next = e.key === "ArrowDown" ? modSelectedFase + 1 : modSelectedFase - 1;
    setModSelectedFase(Math.min(Math.max(next, 0), tabla4Rows.length - 1));
  }

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
      className={`${BTN_MD} font-medium border flex items-center gap-1.5 transition-all duration-150 ${
        activeFlyoutFields.length > 0
          ? "bg-primary-tint border-primary text-secondary"
          : "bg-white border-gray-400 text-gray-700 hover:bg-primary-tint hover:border-primary hover:text-secondary"
      }`}
    >
      <IcoFilter />
      Más filtros
      {activeFlyoutFields.length > 0 && (
        <span className="w-4 h-4 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">
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
        className={`${BTN_MD} font-medium border border-gray-400 bg-white text-gray-700 hover:bg-primary-tint hover:border-primary hover:text-secondary transition-all duration-150 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none`}
      >Limpiar</button>
      <button
        type="button"
        onClick={() => { setModShowData(true); setModSelectedRow(null); }}
        disabled={modShowData}
        className={`${BTN_MD} font-semibold text-white transition-all duration-150 active:scale-[0.99] hover:brightness-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none`}
        style={{ backgroundColor: "var(--color-primary)" }}
      >Buscar</button>
    </>
  );

  return (
    <div className="flex-1 min-h-0 flex flex-col p-5 relative overflow-hidden">
    <div className="flex-1 min-h-0 flex flex-col gap-5 [@media(max-height:760px)]:gap-2">

        {/* Card A — título propio ("Búsqueda" + badge CDS2, mismo patrón que
            los paneles Búsqueda/Resultados del motor ABM) arriba de la
            barra de filtros compacta, una sola fila, + flyout "Más filtros" */}
        <div className="relative shrink-0">
          <div
            className="relative rounded-sm border border-gray-300 bg-white"
            style={CARD_SHADOW}
          >
            <CardHeader title="Búsqueda" tag="CDS2" />
            <div className="relative z-30 flex items-center gap-2 px-3 py-2.5 [@media(max-height:760px)]:flex-wrap">
            {/* Ancho fijo (no crece a ocupar el sobrante) para que se vea
                proporcionado contra Nivel/Fase — 190px en tamaño normal,
                bastante más chico en tier 760px vía el `!` important de
                abajo (el ancho normal es inline, gana a una clase sin
                important). */}
            <input
              disabled={hasSelection}
              placeholder={`Ej: ${RECORD.referencia}`}
              className={MOD_FIELD_CLS + " font-mono" + (hasSelection ? " !bg-gray-50 !text-gray-900" : "") + " [@media(max-height:760px)]:!w-[112px]"}
              style={{ width: 190, flexShrink: 0, fontSize: "var(--text-body-sm)" }}
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
              triggerExtraClassName={hasSelection ? " !bg-gray-50 !text-gray-900" : ""}
              triggerStyle={{ fontWeight: nivelSel ? 600 : 400 }}
              value={nivelSel}
              onChange={setNivelSel}
              opts={["BT", "MT", "AT"]}
              placeholder="Nivel"
              wrapClassName="w-[88px] shrink-0"
            />

            <ValuePicker
              isDisabled={hasSelection}
              triggerExtraClassName={hasSelection ? " !bg-gray-50 !text-gray-900" : ""}
              value={faseSel}
              onChange={setFaseSel}
              opts={["R", "S", "T", "RS", "RT", "ST", "RST"]}
              placeholder="Fase"
              wrapClassName="w-[84px] shrink-0"
            />

            <div className="w-px h-5 bg-gray-300 shrink-0" />

            {/* Toggle Origen/Tipo — tamaño normal. En tier 760px pasan a
                <select> nativo (ver más abajo): ocupan menos ancho por lo
                que aportan, justo lo que le faltaba a esta fila. */}
            <div className="contents [@media(max-height:760px)]:hidden">
              <span className="text-micro font-semibold uppercase tracking-[0.08em] text-gray-500 shrink-0">Origen</span>
              <ButtonSelectGroup
                options={["Interno", "Externo"]}
                selected={origenSel ? [origenSel] : []}
                onToggle={(opt) => setOrigenSel(origenSel === opt ? null : opt)}
                disabled={modShowData || hasSelection}
                sizeCls={BTN_SM.replace("h-7", "h-8")}
              />

              <span className="text-micro font-semibold uppercase tracking-[0.08em] text-gray-500 shrink-0">Tipo</span>
              <ButtonSelectGroup
                options={["Forzado", "Programado"]}
                selected={tipoSel ? [tipoSel] : []}
                onToggle={(opt) => setTipoSel(tipoSel === opt ? null : opt)}
                disabled={modShowData || hasSelection}
                sizeCls={BTN_SM.replace("h-7", "h-8")}
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
              <div className="fixed inset-0 z-20" onClick={() => setFlyoutOpen(false)} />
            )}

            {/* Flyout "Más filtros" */}
            {flyoutOpen && (
              <div
                className="absolute right-0 z-30 bg-white border border-gray-300 rounded-lg p-4"
                style={{ top: "calc(100% + 6px)", width: 520, boxShadow: "var(--shadow-high)" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-body font-semibold text-gray-900">Más filtros</span>
                  <button
                    type="button"
                    onClick={() => setFlyoutOpen(false)}
                    className="w-6 h-6 flex items-center justify-center rounded-sm text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-all"
                  >
                    <IcoX />
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
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setFlyoutFilters(EMPTY_FLYOUT_FILTERS)}
                    className="text-body-sm font-medium text-primary hover:text-secondary transition-colors"
                  >
                    Limpiar filtros
                  </button>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setFlyoutOpen(false)}
                      className={`${BTN_MD} font-medium border border-gray-400 bg-white text-gray-700 hover:bg-gray-50 transition-colors`}
                    >
                      Cerrar
                    </button>
                    <button
                      type="button"
                      onClick={() => setFlyoutOpen(false)}
                      className={`${BTN_MD} font-semibold text-white hover:brightness-105 transition-all`}
                      style={{ backgroundColor: "var(--color-primary)" }}
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
            <div className="flex items-center flex-wrap gap-2 mt-2 px-3 py-2 rounded-sm border border-gray-200 bg-gray-50">
              <span className="text-caption font-semibold uppercase tracking-[0.06em] text-gray-600 shrink-0">
                Filtros aplicados:
              </span>
              {activeFlyoutFields.map((f) => (
                <span
                  key={f.key}
                  className="inline-flex items-center gap-1.5 h-7 pl-3 pr-1.5 rounded-full bg-primary-tint border border-chip-border text-secondary text-body-sm font-semibold"
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

      {/* ── Barra de acciones persistente — siempre visible, independiente de
          si hay búsqueda o selección activa. Desarmes/Lotes funcionan sin
          ninguna interrupción cargada; el resto se habilita recién con una
          interrupción seleccionada. ── */}
      <PersistentActionsBar
        siempreHabilitadas={[
          { label: "Desarmes", onClick: () => setDesarmeOpen(true) },
          { label: "Lotes", onClick: () => setLotesOpen(true) },
        ]}
        condicionales={[
          { label: "Nivel/Tipo", disabled: !hasSelection, onClick: () => setNivelTipoOpen(true) },
          { label: "Replicar", disabled: !hasSelection, onClick: () => setReplicarOpen(true) },
          { label: "Cambia fases", disabled: !hasSelection, onClick: () => setCambiaFasesOpen(true) },
          { label: "Alta clientes", disabled: !hasSelection, onClick: () => setAltaClientesOpen(true) },
          { label: "Intercambio", disabled: !hasSelection, onClick: () => setIntercambioOpen(true) },
        ]}
      />

      {/* ── FILA INFERIOR — tabla de datos y Reposiciones (CDS4), una al lado de
          la otra. flex-1 min-h-0 hace que la fila ocupe el resto del alto
          disponible (nunca más) y que ambas cards, al estirarse (stretch,
          default de un flex row) al alto de la fila, queden parejas — cada
          una scrollea su body internamente (flex-1 min-h-0 overflow-y-auto)
          en vez de crecer con el contenido y empujar scroll de página. ── */}
      <div className={`flex-1 min-h-0 flex gap-5 transition-opacity duration-150 ${flyoutOpen ? "opacity-50 pointer-events-none" : ""}`}>

      {/* ── Tabla de datos — navegador de referencias, mismo alto y mismo
          tratamiento de card que Card B ── */}
      <div
        className="flex-1 min-h-0 flex flex-col rounded-sm border border-gray-300 bg-white overflow-hidden [@media(max-height:760px)]:flex-[2]"
        style={CARD_SHADOW}
      >

        {/* Header — mismo componente/tratamiento que el de Card B (Reposiciones) */}
        <CardHeader title="Interrupciones" tag="CDS2" />

        {/* Table toolbar — solo buscador, sin Exportar. En tier 760px suma
            el dropdown "Acciones" a la derecha del buscador (children,
            tiene lugar de sobra ahí) en vez de una fila propia. Con
            resultados vacíos no hay buscador que mostrar, así que el slot
            vive en una franja mínima aparte — Desarmes/Lotes siguen
            disponibles sin selección, no pueden depender de modShowData. */}
        {modShowData ? (
          <TableToolbar search={modSearch} onSearchChange={setModSearch} hideExport>
            <div id="acciones-tier2-slot" className="hidden [@media(max-height:760px)]:flex items-center" />
          </TableToolbar>
        ) : (
          <div className="hidden [@media(max-height:760px)]:flex items-center justify-end px-4 py-2 border-b border-gray-200 bg-white shrink-0">
            <div id="acciones-tier2-slot" className="flex items-center" />
          </div>
        )}

        {/* Tabla Referencia / Fecha */}
        <div className="grid grid-cols-2 px-4 border-b border-gray-100 bg-gray-50 shrink-0">
          <SortableHeaderCell
            label="Referencia"
            active={modSortIdx === 0}
            dir={modSortDir}
            onClick={() => modToggleSort(0)}
            className="py-1.5 text-micro"
          />
          <SortableHeaderCell
            label="Fecha"
            active={modSortIdx === 1}
            dir={modSortDir}
            onClick={() => modToggleSort(1)}
            className="py-1.5 text-micro"
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
          className="flex-1 min-h-0 overflow-y-auto outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/30"
        >
          {!modShowData ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-center px-8">
              <span className="text-gray-300 scale-90"><IcoInbox /></span>
              <p className="text-body-sm font-medium text-gray-500">Sin resultados</p>
              <p className="text-caption text-gray-500">Completá los filtros y presioná Buscar</p>
            </div>
          ) : modVisibleIndices.map((i) => {
            const row = SAMPLE_ROWS[i];
            const selected = modSelectedRow === i;
            return (
              <div
                key={i}
                data-row-index={i}
                className="grid grid-cols-2 px-4 border-b border-gray-50 transition-colors cursor-pointer hover:bg-gray-50"
                style={{ backgroundColor: selected ? "var(--color-primary-tint)" : undefined, borderLeft: selected ? "3px solid var(--color-primary)" : "3px solid transparent" }}
                onClick={() => setModSelectedRow(selected ? null : i)}
              >
                <div className="py-1.5 text-caption tabular-nums pr-3 font-mono"
                  style={{ color: selected ? "var(--color-secondary)" : "var(--color-gray-700)", fontWeight: selected ? 600 : 400 }}>
                  {row.referencia}
                </div>
                <div className={`py-1.5 text-caption ${selected ? "text-secondary font-medium" : "text-gray-600"}`}>{row.fecha}</div>
              </div>
            );
          })}
        </div>
        <div className="px-4 py-1.5 border-t border-gray-100 bg-gray-50 shrink-0 flex items-center justify-between">
          <button className="px-2 py-0.5 rounded border border-gray-300 bg-white text-caption text-gray-500 disabled:opacity-40" disabled>Anterior</button>
          <span className="text-caption text-gray-500">Página <span className="font-medium text-gray-700">1</span> de <span className="font-medium text-gray-700">2.213</span></span>
          <button className="px-2 py-0.5 rounded border border-gray-300 bg-white text-caption text-gray-500 hover:bg-gray-50 transition-colors">Siguiente</button>
        </div>
      </div>

        {/* Card B — Reposiciones (CDS4). Mismo criterio que la card de
            Interrupciones: nunca crece con el contenido (banner de
            selección, filas de la Tabla 4, etc.) — body scrolleable propio
            en vez de empujar el scroll de la página. En tier 760px el split
            de la fila pasa de 50/50 a 40/60 (ver flex-[2]/flex-[3] acá y en
            Interrupciones) — esta card es la que más necesita el ancho
            extra para sus columnas. */}
        <div
          className="flex-1 min-h-0 flex flex-col rounded-sm border border-gray-300 bg-white overflow-hidden [@media(max-height:760px)]:flex-[3]"
          style={CARD_SHADOW}
        >
          <CardHeader title="Reposiciones" tag="CDS4" />
          <div className="flex-1 min-h-0 overflow-y-auto">

            {/* Interrupción seleccionada — solo aparece con una fila activa
                en la tabla de la derecha. Oculto en tier 760px: no aporta
                lo suficiente para el espacio que ocupa ahí (en tamaño
                normal se queda como está). */}
            {selectedRecord && (
              <div className="px-5 py-2.5 border-b border-gray-100 flex items-center gap-2 [@media(max-height:760px)]:hidden">
                <span className="text-micro font-semibold uppercase tracking-[0.08em] text-gray-500">Interrupción</span>
                <span
                  className="text-body-sm font-medium text-gray-800 tabular-nums font-mono"
                >
                  {selectedRecord.referencia}
                </span>
              </div>
            )}

            {/* Tabla 4 — siempre visible, nunca detrás de un modal/drawer.
                Vacía hasta que se selecciona una interrupción. */}
            <div className="px-5 py-3 border-b border-gray-100">
              {/* Altura fija (no maxHeight: siempre ocupa el mismo alto, sin
                  achicarse con pocas filas) + scroll propio, mismo criterio
                  que la lista de Interrupciones — con muchas filas no debe
                  empujar el scroll general de la página. Header pegajoso
                  (sticky) para que las columnas sigan visibles al
                  scrollear el body. */}
              <div
                ref={modFaseListRef}
                tabIndex={tabla4Rows.length > 0 ? 0 : -1}
                onKeyDown={handleModFaseListKeyDown}
                className="border border-gray-200 rounded-sm overflow-y-auto overflow-x-auto outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/30"
                style={{ height: 220 }}
              >
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      {tabla4Data.cols.map((c) => (
                        <th key={c} className="sticky top-0 z-10 bg-gray-50 px-3 py-2 text-left text-micro font-semibold uppercase tracking-[0.06em] text-gray-600 whitespace-nowrap">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tabla4Rows.length === 0 ? (
                      <tr>
                        <td colSpan={tabla4Data.cols.length}>
                          <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
                            <span className="text-gray-400"><IcoInbox /></span>
                            <p className="text-body-sm text-gray-500">Sin reposiciones registradas</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      tabla4Rows.map((row, ri) => {
                        const faseSeleccionada = modSelectedFase === ri;
                        return (
                          <tr
                            key={ri}
                            data-fase-index={ri}
                            onClick={() => setModSelectedFase(faseSeleccionada ? null : ri)}
                            onMouseEnter={() => setHovFase(ri)}
                            onMouseLeave={() => setHovFase(null)}
                            className="border-b border-gray-100 last:border-b-0 transition-colors cursor-pointer"
                            style={{ backgroundColor: faseSeleccionada ? "var(--color-primary-tint)" : hovFase === ri ? "var(--color-gray-50)" : undefined }}
                          >
                            {row.map((cell, ci) => (
                              <td
                                key={ci}
                                className={`px-3 py-2.5 text-body-sm whitespace-nowrap ${faseSeleccionada ? "text-secondary font-medium" : "text-gray-700"}`}
                                // borde de acento en la primera celda, no en el <tr>: con
                                // border-collapse, un borde puesto directo en la fila no
                                // renderiza de forma confiable en todos los navegadores.
                                style={ci === 0 ? { borderLeft: faseSeleccionada ? "3px solid var(--color-primary)" : "3px solid transparent" } : undefined}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Indicadores de las tablas relacionadas — siguen abriendo el drawer */}
            <div className="px-5 py-3 border-b border-gray-100 [@media(max-height:760px)]:pb-2">
              <p className="text-caption font-semibold uppercase tracking-[0.07em] text-gray-600 mb-2">Tablas relacionadas</p>
              {/* Tier 760px: los 5 tiles (Tabla 3/5/6/8/9) tienen que entrar
                  en una sola fila. El ancho acá es el recurso escaso (esta
                  card es la mitad de la fila inferior), no el alto — así
                  que en vez de columnas parejas y angostas (grid-cols-N
                  estira cada tile a lo alto), pasan a flex-wrap con cada
                  tile en fila (label + valor una al lado de la otra, tipo
                  "TABLA 3: 12") y ancho ajustado a su contenido: bajo y
                  ancho en vez de angosto y alto. */}
              {/* Tamaño normal: tiles como siempre. */}
              <div className="grid grid-cols-3 gap-2 [@media(max-height:760px)]:hidden">
                {STATUS_ITEMS.map((item) => (
                  <button
                    key={item.tabKey}
                    type="button"
                    disabled={!hasSelection}
                    onClick={() => setDrawerTab(item.tabKey)}
                    className={`rounded-sm border px-2 py-2 flex flex-col gap-1 text-left transition-all duration-150 ${
                      !hasSelection
                        ? "bg-gray-100 border-gray-300 cursor-not-allowed"
                        : `hover:ring-2 hover:ring-primary/30 active:scale-[0.97] ${item.alert ? "bg-warning-bg border-warning-border" : "bg-gray-50 border-gray-300"}`
                    }`}
                  >
                    <span className="text-micro text-gray-600 leading-tight">{item.label}</span>
                    <span className={`text-label font-semibold leading-none ${!hasSelection ? "text-gray-400" : item.alert ? "text-warning-text" : "text-gray-900"}`}>
                      {hasSelection ? valoresRelacionadas?.[item.tabKey] : "—"}
                    </span>
                  </button>
                ))}
              </div>

              {/* Tier 760px: mismo patrón de chip/pill que "Filtros
                  aplicados" (recap-chips) — clickeables igual que los
                  tiles, todos en una fila (con wrap si no entran). Label
                  (caption, atenuado) y valor (más peso, color secundario)
                  separados — antes se leían empastados con el mismo peso. */}
              <div className="hidden [@media(max-height:760px)]:flex items-center flex-wrap gap-2">
                {STATUS_ITEMS.map((item) => (
                  <button
                    key={item.tabKey}
                    type="button"
                    disabled={!hasSelection}
                    onClick={() => setDrawerTab(item.tabKey)}
                    className="inline-flex items-center gap-1.5 h-8 px-4 rounded-full bg-primary-tint border border-chip-border transition-all duration-150 hover:brightness-95 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span className="text-caption text-secondary/60">{item.label}:</span>
                    <span className="text-body-sm font-bold text-secondary">
                      {hasSelection ? valoresRelacionadas?.[item.tabKey] : "—"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Datos de la Interrupción — abre el modal del mismo nombre.
                Sin selección no hay datos que mostrar ni modal que abrir. */}
            <div className="px-5 py-4 [@media(max-height:760px)]:pt-2">
              <p className="text-caption font-semibold uppercase tracking-[0.07em] text-gray-600 mb-2.5">Datos de la Interrupción</p>
              {selectedRecord ? (
                <button
                  type="button"
                  onClick={() => setDatosInterrupcionOpen(true)}
                  className="group w-full text-left rounded-sm border border-gray-300 overflow-hidden cursor-pointer transition-all duration-150 hover:border-primary hover:shadow-[0_2px_10px_rgba(77,151,250,0.1)]"
                >
                  {/* Sparkline: ticks de reposición + apertura/cierre */}
                  <div className="relative bg-white" style={{ height: 34 }}>
                    {timelineTicks.map((pct, i) => {
                      const isEdge = i === 0 || i === timelineTicks.length - 1;
                      return (
                        <div
                          key={i}
                          className="absolute top-1/2"
                          style={{
                            left: `${pct}%`,
                            width: isEdge ? 3 : 1.5,
                            height: isEdge ? 22 : 15,
                            backgroundColor: isEdge ? "var(--color-gray-900)" : "var(--color-primary)",
                            transform: "translate(-50%, -50%)",
                          }}
                        />
                      );
                    })}
                  </div>
                  {/* Barra de resumen */}
                  <div className="px-3 py-2 text-center" style={{ backgroundColor: "var(--color-gray-700)" }}>
                    <span
                      className="text-caption font-medium text-white whitespace-nowrap font-mono"
                    >
                      {timelineFechaInicio}  -  {timelineReferencia}  -  {timelineFechaUltRepo}  -  {timelineDuracion}
                    </span>
                  </div>
                </button>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-6 rounded-sm border border-gray-200 bg-gray-50 text-center">
                  <span className="text-gray-400"><IcoInbox /></span>
                  <p className="text-body-sm text-gray-500">Seleccioná una interrupción para ver sus datos</p>
                </div>
              )}
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
      <LotesModal open={lotesOpen} onClose={() => setLotesOpen(false)} />
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
      />

      {/* ── DRAWER OVERLAY ──────────────────────────────────────── */}
      {drawerTab !== null && (
        <div
          className="fixed inset-0 z-40 bg-black/25"
          onClick={() => setDrawerTab(null)}
        />
      )}

      {/* ── DRAWER PANEL ────────────────────────────────────────── */}
      <div
        className="fixed top-0 right-0 h-full bg-white z-50 flex flex-col"
        style={{
          width: 900,
          boxShadow: "-4px 0 32px rgba(21,40,80,0.18)",
          transform: drawerTab !== null ? "translateX(0)" : "translateX(100%)",
          transition: "transform 280ms cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Drawer header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 shrink-0 flex items-center justify-between">
          <div>
            <p className="text-caption text-gray-600 uppercase tracking-[0.08em] font-semibold mb-0.5">Interrupción</p>
            <p className="text-[14px] font-semibold text-gray-900 font-mono">
              {selectedRecord ? selectedRecord.referencia : RECORD.referencia}
            </p>
          </div>
          <button
            onClick={() => setDrawerTab(null)}
            className="w-8 h-8 flex items-center justify-center rounded-sm text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-all"
          >
            <IcoX />
          </button>
        </div>

        {/* Tabs — Tabla 4 vive ahora siempre visible en la Card B, ya no acá */}
        <div className="flex border-b border-gray-200 px-6 shrink-0">
          {DRAWER_TABS.filter((tab) => tab.key !== "tabla4").map((tab) => (
            <button
              key={tab.key}
              onClick={() => setDrawerTab(tab.key)}
              className={`px-4 py-3 text-body font-medium border-b-2 transition-colors ${
                drawerTab === tab.key
                  ? "border-primary text-secondary"
                  : "border-transparent text-gray-600 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {activeTabData && (
            <>
              {/* Subtitle */}
              {activeTabData.subtitle && (
                <div className="px-5 py-2.5 border-b border-gray-100 shrink-0">
                  <p className="text-body-sm text-gray-600 leading-snug">{activeTabData.subtitle}</p>
                </div>
              )}

              {/* Tabla 3: existencia simple */}
              {activeTabData.key === "tabla3" ? (() => {
                const existe = valoresRelacionadas?.tabla3 === "SI";
                return (
                  <div className="flex flex-col items-center justify-center flex-1 gap-4 py-16">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: existe ? "var(--color-success-bg)" : "var(--color-error-bg)" }}
                    >
                      {existe ? (
                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                          <path d="M8 18l7 7 13-13" stroke="var(--color-success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                          <path d="M10 10l16 16M26 10L10 26" stroke="var(--color-error)" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-[16px] font-semibold mb-1" style={{ color: existe ? "var(--color-success-text-strong)" : "var(--color-error-text-strong)" }}>
                        {existe ? "SÍ existe en Tabla 3" : "NO existe en Tabla 3"}
                      </p>
                      <p className="text-body-sm text-gray-500">
                        {existe
                          ? "Esta interrupción tiene registro en la tabla"
                          : "Esta interrupción no tiene registro en la tabla"}
                      </p>
                    </div>
                  </div>
                );
              })() : (
                /* Tabla con scroll horizontal para columnas anchas */
                <div className="flex-1 flex flex-col overflow-hidden">
                  {activeTabData.rows.length > 0 && (
                    <TableToolbar
                      search={drawerSearch}
                      onSearchChange={setDrawerSearch}
                      onExport={() =>
                        exportRowsToCsv(
                          activeTabData.label.replace(/\s+/g, "_").toLowerCase(),
                          activeTabData.cols,
                          drawerVisibleIndices.map((i) => drawerGetCells(activeTabData.rows[i]))
                        )
                      }
                    />
                  )}
                  <div className="flex-1 overflow-x-auto overflow-y-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          {activeTabData.cols.map((col, ci) => (
                            <SortableTh
                              key={col}
                              label={col}
                              active={drawerSortIdx === ci}
                              dir={drawerSortDir}
                              onClick={() => drawerToggleSort(ci)}
                            />
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {activeTabData.rows.length === 0 ? (
                          <tr>
                            <td colSpan={activeTabData.cols.length}>
                              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                                <span className="text-gray-400"><IcoInbox /></span>
                                <p className="text-body font-medium text-gray-600">Sin registros</p>
                                <p className="text-body-sm text-gray-500">Esta tabla no tiene datos para esta interrupción</p>
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
                                        drawerTabOrigen: drawerTab ?? undefined,
                                        referenciaOrigen: interrupcionActualRef,
                                      })
                                    }
                                    className="mt-1 text-body-sm font-semibold text-secondary hover:underline"
                                  >
                                    Ir a {ABM_TABLE_CONFIGS[abmMapping.tableKey].code} a insertar →
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ) : drawerVisibleIndices.map((ri) => {
                          const row = activeTabData.rows[ri];
                          // Cuando la tabla mapea a ABM y la primera columna es
                          // "Interrupción", esa celda es el valor más confiable
                          // para el deep-link (garantiza match en destino);
                          // si no, se usa la interrupción actual como fallback.
                          const valorDeepLink =
                            activeTabData.cols[0] === "Interrupción" ? row[0] : interrupcionActualRef;
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
                                        drawerTabOrigen: drawerTab ?? undefined,
                                        referenciaOrigen: interrupcionActualRef,
                                      })
                                  : undefined
                              }
                              className={`border-b border-gray-100 transition-colors ${
                                abmMapping ? "cursor-pointer hover:bg-primary-tint" : "hover:bg-gray-50"
                              }`}
                            >
                              {row.map((cell, ci) => (
                                <td key={ci} className="px-4 py-3.5 text-body text-gray-700 whitespace-nowrap">{cell}</td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

    </div>
  );
}

// ─── ABM engine (config-driven) ────────────────────────────────────────────
// Motor generico para las 9 tablas ABM (CDS2..CDS9-NM). En vez de un
// componente por tabla, cada tabla es una entrada de ABM_TABLE_CONFIGS y
// AbmScreen renderiza formulario de busqueda + tabla de resultados + action
// bar contextual a partir de esa config. CDS2/CDS3/CDS4 quedan migradas a
// este motor reproduciendo exactamente su comportamiento actual; CDS5..CDS9NM
// son tablas nuevas relevadas de capturas de produccion.

type AbmTableKey = "cds2" | "cds3" | "cds4" | "cds5" | "cds6" | "cds7" | "cds8" | "cds9" | "cds9nm";

const ABM_TABLE_ORDER: AbmTableKey[] = ["cds2", "cds3", "cds4", "cds5", "cds6", "cds7", "cds8", "cds9", "cds9nm"];

function isAbmTableKey(s: string): s is AbmTableKey {
  return (ABM_TABLE_ORDER as string[]).includes(s);
}

// Modo del panel: "buscar" (default), "alta" (formulario de Insertar) o
// "modificar" (formulario de Modificar, disparado desde la action bar de
// selección). Alta y modificar comparten el mismo tratamiento visual del
// panel de resultados (atenuado/deshabilitado).
type AbmMode = "buscar" | "alta" | "modificar";

// Deep-link hacia una tabla ABM con un campo precargado — usado por el
// drawer "Tablas relacionadas" de Modificar interrupción para saltar
// directo a CDS5/6/8/9 con la interrupción actual ya cargada. `modo:
// "buscar"` precarga el campo, ejecuta la búsqueda y selecciona la fila que
// matchea `columna`/`valor` en los resultados; `modo: "alta"` precarga el
// campo y entra directo en modo Insertar.
type AbmDeepLink = {
  tableKey: AbmTableKey;
  campo: string; // nombre del campo de camposBusqueda a precargar
  columna: string; // key de columnasResultado usada para encontrar la fila a seleccionar
  valor: string;
  modo: "buscar" | "alta";
  // Tab del drawer "Tablas relacionadas" desde el que se disparó el
  // deep-link — usado solo para reabrirlo al volver a Consultas.
  drawerTabOrigen?: string;
  // Referencia (SAMPLE_ROWS) de la interrupción que se estaba mirando en
  // Consultas al disparar el deep-link — usada por "Volver" para
  // restaurar exactamente esa selección, no solo la pantalla.
  referenciaOrigen?: string;
};

type CampoOpcion = string | { value: string; label: string };
type CampoTipo = "texto" | "select" | "fecha" | "readonly" | "toggle" | "combobox";

type CampoBusqueda = {
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
};

type AbmTableConfig = {
  key: AbmTableKey;
  code: string;
  titulo: string;
  hasInsertar: boolean;
  secciones: SeccionBusqueda[];
  columnasResultado: ColumnaResultado[];
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
  // Mapeo de key de columnasResultado → nombre de campo de camposBusqueda,
  // usado por el estado "consultando" (fila seleccionada en Resultados
  // mientras se sigue en modo buscar): al seleccionar una fila, sus
  // valores se vuelcan en los campos mapeados y el formulario entero pasa
  // a solo-lectura. Los campos sin mapeo (la fila no trae ese dato) quedan
  // igual de no-editables, solo que en blanco.
  mapeoFilaACampos: Record<string, string>;
};

const ABM_TABLE_CONFIGS: Record<AbmTableKey, AbmTableConfig> = {
  cds2: {
    key: "cds2",
    code: "CDS2",
    titulo: "Interrupciones",
    hasInsertar: false,
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
            { nombre: "nivelTension", label: "Nivel de tensión", tipo: "toggle", opciones: ["BT", "MT", "AT"] },
            { nombre: "faseElectrica", label: "Fase eléctrica", tipo: "select", opciones: ["R", "S", "T", "RST"] },
            { nombre: "origen", label: "Origen", tipo: "toggle", opciones: [{ value: "I", label: "Interno" }, { value: "E", label: "Externo" }] },
            { nombre: "tipo", label: "Tipo", tipo: "toggle", opciones: [{ value: "F", label: "Forzado" }, { value: "P", label: "Programado" }] },
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

// ─── ABM engine: componentes de UI ─────────────────────────────────────────

// Selector de tabla ABM — trigger + panel flotante tokenizado (mismo
// mecanismo que PeriodSelector), pero el trigger hace las veces de título
// del panel (ícono + nombre + badge de código) ya que el masthead no lleva
// nada más. Lee/escribe el mismo estado `screen` que ya maneja el sidebar,
// asi que ambos quedan sincronizados automaticamente sin estado global
// adicional. Cada opción del panel replica la riqueza visual del sidebar
// (ícono + nombre + badge), activa resaltada con bg-primary-tint +
// border-primary + text-secondary.
function AbmTableSelector({ value, onChange }: { value: AbmTableKey; onChange: (k: AbmTableKey) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  const direction = useDropdownDirection(ref, open, 450);
  const current = ABM_TABLE_CONFIGS[value];
  return (
    <div ref={ref} style={{ position: "relative" }} className="min-w-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="group flex items-center gap-2 h-9 pl-1.5 pr-2 -ml-1.5 rounded-md min-w-0 transition-colors duration-150 hover:bg-gray-100"
      >
        {/* Lápiz fijo — no el ícono por tabla: el masthead del panel de
            trabajo siempre representa "estás en la herramienta de ABM",
            no una tabla en particular (esa distinción vive en el badge). */}
        <span className="shrink-0 text-gray-500 group-hover:text-secondary transition-colors"><IcoEdit /></span>
        <span className="text-label font-semibold text-gray-900 leading-none truncate">{current.titulo}</span>
        <span
          className="px-1.5 py-0.5 text-micro font-mono font-medium rounded-[3px] border border-gray-400 text-[#1565C0] shrink-0"
          style={{ backgroundColor: "var(--color-gray-100)" }}
        >
          {current.code}
        </span>
        <span className={`shrink-0 text-gray-500 transition-transform duration-150 ${open ? "rotate-180" : ""}`}>
          <ChevronDown />
        </span>
      </button>
      {open && (
        <div
          className="absolute left-0 w-96 bg-white rounded-sm border border-gray-300 z-50 overflow-hidden"
          style={{ ...dropdownAnchorStyle(direction, 5), boxShadow: "var(--shadow-mid)" }}
        >
          <div className="px-3 py-2.5 border-b border-gray-100">
            <p className="text-caption font-semibold text-gray-600 uppercase tracking-[0.08em] select-none">Cambiar de tabla</p>
          </div>
          <div className="p-1.5 flex flex-col gap-0.5 max-h-96 overflow-y-auto">
            {ABM_TABLE_ORDER.map((k) => {
              const c = ABM_TABLE_CONFIGS[k];
              const isSel = k === value;
              return (
                <button
                  key={k}
                  onClick={() => { onChange(k); setOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-sm border text-left transition-colors ${
                    isSel
                      ? "bg-primary-tint border-primary text-secondary"
                      : "border-transparent text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="flex-1 min-w-0 truncate text-body">{c.titulo}</span>
                  <span
                    className={`text-micro font-mono shrink-0 tabular-nums ${isSel ? "text-secondary/70" : "text-gray-500"}`}
                  >
                    {c.code}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Los 4 estados visuales que puede tener un campo de camposBusqueda, sin
// excepción por tabla ni por tipo de campo (select/toggle/fecha/texto,
// readonly de config incluidos):
//   - "empty": formulario recién abierto, sin búsqueda ni selección — se ve
//     como un input normal (fondo blanco, borde normal) con placeholder de
//     ejemplo. Sin controlar (Buscar/Limpiar no leen ni resetean lo tipeado).
//   - "enabled": se puede escribir con un valor real detrás — tipeando en
//     buscar, o en alta, o en modificar sobre un campo no bloqueado. Mismo
//     look que "empty", pero controlado (value/onChange reales).
//   - "placeholder": hay una fila seleccionada en Resultados en modo buscar
//     ("consultando") — muestra el dato real de esa fila, legible (buen
//     contraste), no editable. Es una vista de lectura, no una prohibición.
//   - "disabled": modo Modificar sobre un campo que la tabla marca como no
//     editable (readonly de config, o en camposReadonlyEnModificar) — el
//     clásico look atenuado, comunicando "esto no se puede tocar".
// "placeholder" y "disabled" comparten `disabled=true` en el input real,
// pero llevan clases distintas a propósito: no deben verse igual.
type CampoEstado = "empty" | "enabled" | "placeholder" | "disabled";

function estadoDeCampo(campo: CampoBusqueda, mode: AbmMode, consultando: boolean, lockedEnModificar: boolean): CampoEstado {
  if (consultando) return "placeholder";
  if (mode === "modificar" && (campo.tipo === "readonly" || lockedEnModificar)) return "disabled";
  if (mode === "buscar") return "empty";
  return "enabled"; // alta, o modificar sobre un campo editable
}

// `!` (important) es necesario en ambas: MOD_FIELD_CLS/MOD_SELECT_CLS ya traen
// bg-white/text-gray-900, y en el CSS compilado esas reglas quedan DESPUÉS
// de las de gray-50/gray-100 (orden interno de Tailwind, no el orden en que
// se concatenan los strings acá), así que sin !important terminan ganando
// igual y el campo se ve "habilitado" pese al atributo disabled.
const ESTADO_CLASES: Record<CampoEstado, string> = {
  empty: "",
  enabled: "",
  // Legible: texto con contraste normal, apenas un tinte de fondo para
  // distinguirlo de un campo editable — nunca el gris apagado de disabled.
  placeholder: " !bg-gray-50 !border-gray-300 !text-gray-900",
  disabled: " !bg-gray-100 !border-gray-300 !text-gray-500",
};

// Un campo de camposBusqueda → el input correspondiente, en el estado visual
// (CampoEstado) que corresponda. Todos los tipos (select/toggle/fecha/texto,
// readonly de config incluido) pasan por el mismo mecanismo: sin excepciones
// hardcodeadas por tipo o por tabla.
function AbmCampo({
  campo,
  mode,
  value,
  onChange,
  lockedEnModificar,
  consultando,
  valoresFormulario,
}: {
  campo: CampoBusqueda;
  mode: AbmMode;
  value?: string;
  onChange?: (v: string) => void;
  // Campo bloqueado específicamente en modo Modificar (config por tabla),
  // independiente de si el campo es editable al buscar/insertar.
  lockedEnModificar?: boolean;
  // Hay una fila seleccionada en Resultados mientras se sigue en modo
  // buscar — el campo muestra el dato de esa fila (si lo tiene) pero
  // conserva su widget natural (select/toggle/fecha/texto), solo que en
  // estado "placeholder" (ver CampoEstado). No es lo mismo que "modificar":
  // no cambia título ni botones del panel, es una vista de consulta nomás.
  consultando?: boolean;
  // Formulario completo (todos los `valores` del panel de Búsqueda/Alta),
  // no solo el de este campo — lo necesita `campo.opciones` cuando es
  // función, para resolver opciones en cascada según otro campo (ej.
  // Localidad según Partido) sin acoplar acá el nombre de ningún campo.
  valoresFormulario?: Record<string, string>;
}) {
  const estado = estadoDeCampo(campo, mode, !!consultando, !!lockedEnModificar);
  const isDisabled = estado === "placeholder" || estado === "disabled";
  const controlled = estado !== "empty";
  const estadoCls = ESTADO_CLASES[estado];
  // "readonly" (config) es un valor derivado/no tipeable por su cuenta, no
  // un widget propio — en estado "empty"/"enabled" (alta) se ve y escribe
  // como cualquier campo de texto.
  const widget = campo.tipo === "readonly" ? "texto" : campo.tipo;
  const opts = (typeof campo.opciones === "function" ? campo.opciones(valoresFormulario ?? {}) : campo.opciones) ?? [];

  if (widget === "toggle") {
    // Igual que "select": opciones string simple (value===label) u
    // objeto {value,label} — el dato real del campo es siempre `value`,
    // el botón muestra `label`.
    const toggleOpts = opts.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
    const v = value ?? "";
    return (
      <div>
        <FieldLabel>{campo.label}</FieldLabel>
        <div className="flex gap-2 mt-0.5 [@media(max-height:760px)]:w-full">
          {toggleOpts.map((opt) => {
            const active = v === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                disabled={isDisabled}
                onClick={() => onChange?.(active ? "" : opt.value)}
                // Tier 760px: la grilla plana de AbmScreen estira TODO
                // campo a w-full en su celda, toggles incluidos — de ahí el
                // flex-1 incondicional en ese breakpoint (en tamaño normal
                // sigue siendo shrink-to-fit salvo que expandirBotones lo
                // pida explícitamente).
                className={`${BTN_SM.replace("h-7", "h-8")} ${campo.expandirBotones ? "flex-1" : ""} [@media(max-height:760px)]:flex-1 flex items-center justify-center border select-none font-medium transition-all duration-150 ${
                  estado === "disabled" ? "cursor-not-allowed opacity-60" : isDisabled ? "cursor-default" : "cursor-pointer"
                } ${
                  active
                    ? "border-primary bg-primary-tint text-secondary"
                    : `border-gray-400 bg-white text-gray-700 ${isDisabled ? "" : "hover:border-primary hover:bg-primary-tint hover:text-secondary"}`
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (widget === "fecha") {
    return (
      <div>
        <FieldLabel>{campo.label}</FieldLabel>
        <DateTimeField value={value ?? ""} onChange={(v) => onChange?.(v)} disabled={isDisabled} muted={estado === "disabled"} fullWidth />
      </div>
    );
  }

  // "select" (pocas opciones, sin buscador) y "combobox" (con buscador;
  // modal en vez de panel inline si `listaLarga`) comparten un solo chrome
  // de trigger/panel vía ValuePicker — ver comentario en su definición.
  if (widget === "select" || widget === "combobox") {
    return (
      <ValuePicker
        label={campo.label}
        opts={opts}
        value={value ?? ""}
        onChange={onChange}
        isDisabled={isDisabled}
        estadoCls={estadoCls}
        searchable={widget === "combobox" || !!campo.listaLarga}
        modal={!!campo.listaLarga}
        emptyMessage={campo.emptyMessage}
      />
    );
  }

  // texto (incluye los campos "readonly" de config)
  return (
    <div>
      <FieldLabel>{campo.label}</FieldLabel>
      {/* key: ver comentario en el <select> de más arriba — mismo fix para
          el cruce uncontrolled→controlled. */}
      <input
        key={controlled ? "c" : "u"}
        disabled={isDisabled}
        className={MOD_FIELD_CLS + estadoCls}
        placeholder={campo.placeholder}
        {...(controlled ? { value: value ?? "", onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value) } : {})}
      />
    </div>
  );
}

// Familia unificada "dropdown de valor" — reemplaza tanto al <select>
// nativo (chrome MOD_SELECT_CLS) como al combobox buscable: mismo trigger
// (<button> con flecha, borde/alto/radius de MOD_SELECT_CLS) y mismo chrome
// de panel (borde/radius/sombra/alto de fila/hover/selected), sea que el
// panel se abra inline (junto al trigger, con smart-positioning vía
// dropdownAnchorStyle/useDropdownDirection) o como modal centrado con
// backdrop (listas largas, ver `modal`). La única pieza que puede variar es
// el buscador arriba de la lista (`searchable`) — todo lo demás es un solo
// chrome, tanto si viene de un <select> corto sin buscador como de un
// combobox largo con buscador y modal.
function ValuePicker({
  label,
  opts,
  value,
  defaultValue = "",
  onChange,
  isDisabled = false,
  estadoCls = "",
  searchable = false,
  modal = false,
  modalTitle,
  emptyMessage = "Sin opciones",
  searchPlaceholder = "Buscar...",
  placeholder = "Seleccione",
  wrapClassName = "w-full",
  triggerExtraClassName = "",
  triggerStyle,
}: {
  label?: string;
  opts: CampoOpcion[];
  value?: string;
  defaultValue?: string;
  onChange?: (v: string) => void;
  isDisabled?: boolean;
  estadoCls?: string;
  // Muestra el input de buscador arriba de la lista — el único elemento
  // que puede diferir entre un <select> corto (false) y un combobox
  // (true, sea inline o modal).
  searchable?: boolean;
  // Panel como modal centrado con backdrop en vez de panel inline — listas
  // largas (~20+ opciones) donde el panel inline ya no es usable.
  modal?: boolean;
  modalTitle?: string;
  emptyMessage?: string;
  searchPlaceholder?: string;
  placeholder?: string;
  wrapClassName?: string;
  triggerExtraClassName?: string;
  triggerStyle?: React.CSSProperties;
}) {
  const [open, setOpen] = useState(false);
  const [filtro, setFiltro] = useState("");
  // Uncontrolled fallback: mocks/estáticos que no traen value/onChange (ver
  // GenerarModal/ReplicarModal) igual necesitan mostrar y cambiar una
  // selección — mismo patrón que un <select> sin value controlado.
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modal || !open) return;
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [modal, open]);

  useEffect(() => {
    if (!modal || !open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") cerrar(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [modal, open]);

  const direction = useDropdownDirection(ref, open && !modal, searchable ? 450 : 260);

  // Si el campo pasa a no-editable (ej. se seleccionó una fila en
  // Resultados mientras el panel estaba abierto) no debe quedar un panel
  // huérfano abierto sobre un trigger ya bloqueado.
  useEffect(() => {
    if (isDisabled) setOpen(false);
  }, [isDisabled]);

  const normalizados = opts.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  const filtrados = filtro ? normalizados.filter((o) => o.label.toLowerCase().includes(filtro.toLowerCase())) : normalizados;
  const seleccionado = normalizados.find((o) => o.value === currentValue);

  function elegir(v: string) {
    if (!isControlled) setInternalValue(v);
    onChange?.(v);
    cerrar();
  }
  function cerrar() {
    setOpen(false);
    setFiltro("");
  }

  const buscador = searchable && (
    <div className="p-1.5 border-b border-gray-100 shrink-0">
      <input
        autoFocus
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        placeholder={searchPlaceholder}
        className={MOD_FIELD_CLS + " h-7 text-body-sm"}
      />
    </div>
  );

  const lista = (
    <div className={modal ? "flex-1 overflow-y-auto p-1.5 flex flex-col gap-0.5" : "p-1.5 flex flex-col gap-0.5 max-h-96 overflow-y-auto"}>
      {normalizados.length === 0 ? (
        <p className="px-2.5 py-2 text-body-sm text-gray-500">{emptyMessage}</p>
      ) : filtrados.length === 0 ? (
        <p className="px-2.5 py-2 text-body-sm text-gray-500">Sin resultados</p>
      ) : (
        filtrados.map((opt) => {
          const active = opt.value === currentValue;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => elegir(opt.value)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-sm border text-left transition-colors ${
                active ? "bg-primary-tint border-primary text-secondary" : "border-transparent text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="flex-1 min-w-0 truncate text-body">{opt.label}</span>
            </button>
          );
        })
      )}
    </div>
  );

  return (
    <div>
      {label && <FieldLabel>{label}</FieldLabel>}
      <div ref={ref} className={`relative ${wrapClassName}`}>
        <button
          type="button"
          disabled={isDisabled}
          onClick={() => setOpen((v) => !v)}
          style={triggerStyle}
          className={MOD_SELECT_CLS + " w-full" + estadoCls + " flex items-center text-left" + (!currentValue ? " !text-gray-500" : "") + triggerExtraClassName}
        >
          {/* || (no ??): value "" es "sin selección", no un valor real a
              mostrar — con ?? quedaría en blanco en vez del placeholder. */}
          <span className="block truncate">{seleccionado?.label || currentValue || placeholder}</span>
        </button>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500">
          <ChevronDown />
        </div>
        {!modal && open && !isDisabled && (
          <div
            className="absolute left-0 w-full bg-white rounded-sm border border-gray-300 z-50 overflow-hidden"
            style={{ ...dropdownAnchorStyle(direction, 5), boxShadow: "var(--shadow-mid)" }}
          >
            {buscador}
            {lista}
          </div>
        )}
      </div>
      {modal && open && !isDisabled && (
        <>
          <div className="fixed inset-0 z-40 bg-black/25" onClick={cerrar} />
          <div
            className="fixed z-50 flex flex-col bg-white rounded-lg overflow-hidden"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 440,
              maxWidth: "calc(100vw - 40px)",
              maxHeight: "calc(100vh - 80px)",
              boxShadow: "var(--shadow-high)",
            }}
          >
            <div className="px-4 py-3 border-b border-gray-200 shrink-0 flex items-center justify-between gap-3">
              <p className="min-w-0 truncate text-label font-semibold text-gray-900">{modalTitle ?? label ?? "Seleccionar"}</p>
              <button
                type="button"
                onClick={cerrar}
                className="shrink-0 w-8 h-8 flex items-center justify-center rounded-sm text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-all"
              >
                <IcoX />
              </button>
            </div>
            {buscador}
            {lista}
          </div>
        </>
      )}
    </div>
  );
}

function AbmFila({
  fila,
  mode,
  valores,
  setValor,
  camposLocked,
  consultando,
  columnasCompartidas,
}: {
  fila: CampoBusqueda[];
  mode: AbmMode;
  valores: Record<string, string>;
  setValor: (nombre: string, v: string) => void;
  // Nombres de campo bloqueados en modo Modificar para la tabla activa.
  camposLocked: string[];
  // Ver AbmCampo — fila seleccionada en Resultados en modo buscar.
  consultando?: boolean;
  // true si otra(s) fila(s) de la misma sección tienen la misma cantidad de
  // columnas — en ese caso las columnas deben quedar parejas (1fr) entre
  // todas para que se alineen visualmente, sin importar si alguna tiene un
  // toggle angosto. Solo una fila que es la única de su longitud en la
  // sección puede darse el lujo de ajustar sus columnas por tipo de campo.
  columnasCompartidas?: boolean;
}) {
  const isMulti = fila.length > 1;
  // Fila de un solo campo: por default el campo define su propio ancho
  // (w-full en texto/select/fecha, ya se ve bien) y la fila no necesita
  // estilo propio. El toggle es la excepción — su grupo de botones es
  // angosto por naturaleza (shrink-to-fit, ver AbmCampo), así que sin esto
  // la fila (100% del panel) deja un espacio muerto grande a la derecha.
  // `ancho` explícito en el campo, si lo hay, sigue ganando por sobre esto.
  const soloCampo = !isMulti ? fila[0] : undefined;
  const soloAncho = soloCampo?.ancho ?? (soloCampo?.tipo === "toggle" && !soloCampo?.expandirBotones ? "fit-content" : undefined);
  // Columnas parejas (1fr cada una) dejan un hueco cuando alguna es un
  // control de opciones acotadas (toggle/select, angosto por naturaleza)
  // — esa columna se ajusta a su contenido (auto); texto/fecha/combobox
  // son de contenido abierto y absorben el espacio sobrante. Pero eso solo
  // vale cuando la fila no tiene con quién alinearse dentro de la sección:
  // si otra fila hermana comparte la misma cantidad de columnas (ver
  // `columnasCompartidas`, calculado por sección en AbmScreen), todas esas
  // filas deben usar la misma grilla pareja para que sus columnas queden
  // alineadas entre sí, aunque alguna tenga un toggle/select. Si TODOS los
  // campos de una fila "no compartida" quedan compactos (ningún campo
  // abierto que absorba el sobrante), ese sobrante se reparte como espacio
  // entre los campos (space-between) en vez de amontonarse al final.
  const esCompacto = (tipo: CampoTipo) => tipo === "toggle" || tipo === "select";
  const gridTemplate = isMulti
    ? columnasCompartidas
      ? `repeat(${fila.length}, 1fr)`
      : fila.map((c) => (esCompacto(c.tipo) ? "auto" : "1fr")).join(" ")
    : undefined;
  const todosCompactos = isMulti && !columnasCompartidas && fila.every((c) => esCompacto(c.tipo));
  // A partir de 3 campos la fila ya usa casi todo el ancho del panel — en el
  // grid de 2 columnas de la sección (ver AbmScreen, tier 760px) tiene que
  // ocupar las 2 para no aplastar sus campos a la mitad. Filas de 1-2 campos
  // sí pueden emparejarse una al lado de la otra.
  const spanTodas = fila.length >= 3;
  return (
    <div
      className={`${isMulti ? "grid gap-3 items-end" : ""}${spanTodas ? " [@media(max-height:760px)]:col-span-2" : ""}`}
      style={
        isMulti
          ? { gridTemplateColumns: gridTemplate, justifyContent: todosCompactos ? "space-between" : undefined }
          : soloAncho
            ? { width: soloAncho }
            : undefined
      }
    >
      {fila.map((campo) => (
        <AbmCampo
          key={campo.nombre}
          campo={campo}
          mode={mode}
          value={valores[campo.nombre]}
          onChange={(v) => setValor(campo.nombre, v)}
          lockedEnModificar={camposLocked.includes(campo.nombre)}
          consultando={consultando}
          valoresFormulario={valores}
        />
      ))}
    </div>
  );
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

// Resuelve el value crudo de un campo (toggle/select/combobox) a su label
// legible, usando las mismas `opciones` que ya usa AbmCampo — incluyendo el
// caso de opciones en función/cascada (ej. Localidad depende de Partido).
function labelDeValor(campo: CampoBusqueda, valor: string, contexto: Record<string, string>): string {
  if (!valor) return "";
  if (campo.tipo === "toggle" || campo.tipo === "select" || campo.tipo === "combobox") {
    const opciones = typeof campo.opciones === "function" ? campo.opciones(contexto) : campo.opciones;
    const opcion = opciones?.find((o) => (typeof o === "string" ? o === valor : o.value === valor));
    if (opcion) return typeof opcion === "string" ? opcion : opcion.label;
  }
  return valor;
}

// Componente unico que renderiza cualquiera de las 9 tablas ABM a partir de
// ABM_TABLE_CONFIGS[tableKey]. `onChangeTable` es el mismo setScreen del
// componente App — asi el selector interno y el item activo del sidebar
// comparten el mismo estado sin duplicarlo.
function AbmScreen({
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

  // Reset al cambiar de tabla — corre primero.
  useEffect(() => {
    setMode("buscar");
    setShowData(false);
    setSelectedRow(null);
    setValores({});
    setValoresOriginales({});
    setFilasBorradas(new Set());
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
  useEffect(() => {
    if (mode !== "buscar") return;
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

  const hasSelection = selectedRow !== null;
  const consultando = mode === "buscar" && hasSelection;
  const columnKeys = config.columnasResultado.map((c) => c.key);
  const getCells = (row: Record<string, string>) => columnKeys.map((k) => row[k] ?? "");
  const { search, setSearch, sortIdx, sortDir, toggleSort, visibleIndices: visibleIndicesConBorradas } =
    useTableToolbar(config.rows, getCells, tableKey);
  // Excluye las filas "borradas" de Resultados (navegación por teclado,
  // export, conteo) sin renumerar nada — los índices que quedan siguen
  // siendo los mismos de config.rows, que es lo que usan selectedRow,
  // mapeoFilaACampos y el resto del formulario.
  const visibleIndices = visibleIndicesConBorradas.filter((i) => !filasBorradas.has(i));

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

  function handleLimpiar() {
    setShowData(false);
    setSelectedRow(null);
    setValores({});
  }
  function handleBuscar() {
    setShowData(true);
    setSelectedRow(null);
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
  }
  function handleGuardarModificar() {
    setModalModificarAbierto(true);
  }
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

  return (
    <>
      {/* Masthead — selector de tabla (hace de título) a la izquierda, período
          a la derecha. Único agregado condicional: el link "Volver" cuando
          se llegó acá por un deep-link (ver AbmDeepLink) — nada de Insertar
          ni dropdown genérico. */}
      <header
        className="flex items-center gap-3 px-6 border-b border-gray-300 shrink-0"
        style={{ minHeight: "var(--header-min-height, 60px)", backgroundColor: "var(--color-gray-50)", boxShadow: "0 1px 0 var(--color-gray-300)" }}
      >
        {volverVisible && (
          <button
            type="button"
            onClick={onVolver}
            title="Volver a Consultas de interrupción"
            aria-label="Volver a Consultas de interrupción"
            className="flex items-center justify-center w-8 h-8 -ml-1.5 rounded-sm text-gray-600 hover:text-secondary hover:bg-gray-100 transition-colors shrink-0"
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
      <div className="flex-1 flex overflow-hidden p-5 gap-5" key={mode}>

        {/* ── Left column: form ── */}
        <div
          // Tier 760px: el split pasa de 41/resto a ~47/resto — al revés que
          // en Interrupciones/Reposiciones (acá es Búsqueda la que le sobra
          // espacio a Resultados y necesita más ancho para acomodar más
          // columnas de campos, ver la sección de abajo). El ancho normal
          // (41%, inline) tiene prioridad de especificidad sobre una clase
          // sin `!important`, de ahí el `!w-[47%]`.
          className="flex flex-col rounded-sm border border-gray-300 bg-white shrink-0 overflow-hidden [@media(max-height:760px)]:!w-[47%]"
          style={{ width: "41%", boxShadow: "var(--shadow-low)" }}
        >
          <CardHeader
            title={mode === "alta" ? "Insertando en" : mode === "modificar" ? "Modificando" : "Búsqueda"}
            tag={config.code}
          />
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
            {config.secciones.map((sec) => {
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
            })}
          </div>

          <div className="shrink-0 border-t border-gray-200 px-5 py-4 flex gap-3">
            {mode === "buscar" ? (
              <>
                <button
                  onClick={handleLimpiar}
                  disabled={!showData}
                  className="flex-1 h-9 rounded-md text-body font-medium border border-gray-400 bg-white text-gray-700 hover:bg-primary-tint hover:border-primary hover:text-secondary transition-all duration-150 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
                >Limpiar</button>
                <button
                  onClick={handleBuscar}
                  disabled={showData}
                  className="flex-1 h-9 rounded-md text-body font-semibold text-white transition-all duration-150 active:scale-[0.99] hover:brightness-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >Buscar</button>
              </>
            ) : mode === "alta" ? (
              <>
                <button
                  onClick={handleCancelarAlta}
                  className="flex-1 h-9 rounded-md text-body font-medium border border-gray-400 bg-white text-gray-700 hover:bg-primary-tint hover:border-primary hover:text-secondary transition-all duration-150 active:scale-[0.99]"
                >Cancelar</button>
                <button
                  onClick={handleGuardarAlta}
                  className="flex-1 h-9 rounded-md text-body font-semibold text-white transition-all duration-150 active:scale-[0.99] hover:brightness-105"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >Insertar</button>
              </>
            ) : (
              <>
                <button
                  onClick={handleCancelarModificar}
                  className="flex-1 h-9 rounded-md text-body font-medium border border-gray-400 bg-white text-gray-700 hover:bg-primary-tint hover:border-primary hover:text-secondary transition-all duration-150 active:scale-[0.99]"
                >Cancelar</button>
                <button
                  onClick={handleGuardarModificar}
                  className="flex-1 h-9 rounded-md text-body font-semibold text-white transition-all duration-150 active:scale-[0.99] hover:brightness-105"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >Guardar</button>
              </>
            )}
          </div>
        </div>

        {/* ── Right column: results — se atenua y deshabilita en modo alta
            y en modo modificar, para que el foco visual quede en el panel
            Búsqueda ── */}
        <div
          className={`flex-1 flex flex-col border border-gray-300 rounded-sm bg-white overflow-hidden transition-opacity duration-150 ${
            mode !== "buscar" ? "opacity-50 pointer-events-none" : ""
          }`}
          style={{ boxShadow: "var(--shadow-low)" }}
        >
          <CardHeader
            title="Resultados"
            tag={config.code}
            right={
              <div className="flex items-center gap-2">
                {/* Auditoría es una acción de panel, no de registro: genera
                    una auditoría de todos los campos modificados en el
                    conjunto de resultados, no de una fila puntual — por eso
                    vive acá siempre visible/habilitada, no en la fila ni
                    atada a una selección (corrige un comportamiento heredado
                    del producto original que la ataba a un registro). */}
                <button type="button" title="Auditoría" aria-label="Auditoría" className={actionBtnCls("neutral")}>
                  <span className="inline-flex items-center gap-1.5"><IcoShield /> <span className="[@media(max-height:760px)]:hidden">Auditoría</span></span>
                </button>
                {showData && (
                  <button
                    type="button"
                    title="Exportar"
                    aria-label="Exportar"
                    onClick={() =>
                      exportRowsToCsv(
                        config.exportFilename,
                        config.columnasResultado.map((c) => c.label),
                        visibleIndices.map((i) => getCells(config.rows[i]))
                      )
                    }
                    className={actionBtnCls("neutral")}
                  >
                    <span className="inline-flex items-center gap-1.5"><IcoDownload /> <span className="[@media(max-height:760px)]:hidden">Exportar</span></span>
                  </button>
                )}
                {config.hasInsertar && (
                  <button type="button" title="Insertar" aria-label="Insertar" onClick={handleAbrirAlta} className={actionBtnCls("neutral")}>
                    <span className="inline-flex items-center gap-1.5"><IcoPlus /> <span className="[@media(max-height:760px)]:hidden">Insertar</span></span>
                  </button>
                )}
              </div>
            }
          />
          {showData && (
            <TableToolbar search={search} onSearchChange={setSearch} hideExport />
          )}

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
            className="flex-1 overflow-y-auto outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/30"
          >
            {!showData ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
                <IcoInbox />
                <p className="text-label font-medium text-gray-600 mt-1">
                  No hay resultados para los filtros aplicados
                </p>
                <p className="text-body-sm text-gray-500">
                  Completá los filtros y presioná{" "}
                  <span className="font-semibold text-primary">Buscar</span>
                </p>
              </div>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-300 bg-gray-50">
                    {config.columnasResultado.map((c, ci) => (
                      <th key={c.key} className="sticky top-0 z-10 bg-gray-50 w-[1%] whitespace-nowrap px-4 py-2 text-left text-caption">
                        <SortableHeaderCell
                          label={c.label}
                          active={sortIdx === ci}
                          dir={sortDir}
                          onClick={() => toggleSort(ci)}
                        />
                      </th>
                    ))}
                    <th className="sticky top-0 z-10 bg-gray-50" />
                    <th className="sticky top-0 z-10 bg-gray-50 w-40 whitespace-nowrap px-4 py-2 text-left text-caption font-semibold uppercase tracking-[0.07em] text-gray-600">
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
                        className="border-b border-gray-100 cursor-pointer transition-colors duration-100"
                        style={{ backgroundColor: isSelected ? "var(--color-primary-tint)" : isHovered ? "var(--color-gray-50)" : undefined }}
                      >
                        {config.columnasResultado.map((c, ci) => (
                          <td
                            key={c.key}
                            className={`w-[1%] whitespace-nowrap px-4 py-2.5 text-body ${
                              c.mono ? "font-mono tabular-nums" : isSelected ? "text-secondary font-medium" : "text-gray-700"
                            }`}
                            style={{
                              ...(c.mono
                                ? {
                                    color: isSelected ? "var(--color-secondary)" : "var(--color-gray-800)",
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
                            {row[c.key]}
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
                              className={rowActionBtnCls("neutral")}
                            >
                              Modificar
                            </button>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleAbrirBorrar(i); }}
                              className={rowActionBtnCls("destructive")}
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
            <div className="px-4 py-2 border-t border-gray-300 bg-gray-50 shrink-0 flex items-center justify-between">
              <span className="text-body-sm text-gray-700">
                Registros encontrados:{" "}
                <span className="font-semibold text-secondary">
                  {config.totalRegistros.toLocaleString("es-AR")}
                </span>
              </span>
              <div className="flex items-center gap-2 text-body-sm text-gray-600">
                <button className="px-2.5 py-1 rounded border border-gray-400 bg-white hover:bg-gray-50 disabled:opacity-40 transition-colors" disabled>
                  Anterior
                </button>
                <span>
                  Pág. <span className="font-medium text-gray-800">1</span> de{" "}
                  <span className="font-medium text-gray-800">{totalPages.toLocaleString("es-AR")}</span>
                </span>
                <button
                  className="px-2.5 py-1 rounded border border-gray-400 bg-white hover:bg-gray-50 disabled:opacity-40 transition-colors"
                  disabled={totalPages <= 1}
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

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

// screens: login → select → welcome → (tabla ABM) → modificar
type Screen = "login" | "select" | "welcome" | "modificar" | AbmTableKey
  | "generaciontxt" | "planillaconsolidada" | "gestornotas" | "insertaclientes" | "auditoria";

// ─── Generación de txt ──────────────────────────────────────────────────────

function GeneracionTxtContent() {
  const [tabla, setTabla] = useState("");

  function handleExportar() {
    // mock: sin backend real conectado todavía (mismo alcance que Borrar/Guardar)
  }

  return (
    <div className="flex-1 overflow-y-auto px-10 py-10">
      <div className="bg-white rounded-md border border-gray-300" style={{ maxWidth: 640 }}>
        <CardHeader title="Exportación" />
        <div className="p-6 flex items-end gap-3">
          <div className="flex-1 min-w-0" style={{ maxWidth: 320 }}>
            <ValuePicker
              label="Tabla a exportar"
              value={tabla}
              onChange={setTabla}
              opts={ABM_ITEMS.map((item) => ({ value: item.screen as string, label: item.label }))}
              placeholder="Seleccione tabla a exportar"
            />
          </div>
          <button type="button" disabled={!tabla} onClick={handleExportar} className={modalPrimaryBtnCls} style={{ backgroundColor: "var(--color-primary)" }}>
            Exportar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Planilla consolidada ───────────────────────────────────────────────────

function generarConsolidacionSintetica(rng: () => number) {
  return {
    reclamos: enteroEntre(rng, 70000, 95000),
    reiteraciones: enteroEntre(rng, 45000, 65000),
    saidi: (rng() * 0.6).toFixed(9),
    saifi: (rng() * 0.3).toFixed(9),
    maxDuracionRef: refInterrupcionSintetica(rng, "2026"),
    maxDuracionValor: enteroEntre(rng, 10000, 30000),
    maxMarginalRef: refInterrupcionSintetica(rng, "2026"),
    maxMarginalValor: (rng() * 300000000).toFixed(7),
  };
}

function PlanillaConsolidadaContent() {
  const [datos, setDatos] = useState(() => generarConsolidacionSintetica(crearRng(hashSemilla("planilla-consolidada"))));
  const [fechaProceso, setFechaProceso] = useState("12/08/2026 09:19");
  const [usuarioProceso] = useState("Rdellamagiora");
  const [procesando, setProcesando] = useState(false);
  const [progresoAbierto, setProgresoAbierto] = useState(false);

  function handleProcesar() {
    setProcesando(true);
    setTimeout(() => {
      setDatos(generarConsolidacionSintetica(crearRng(Date.now())));
      setFechaProceso(new Date().toLocaleString("es-AR").slice(0, 16));
      setProcesando(false);
    }, 900);
  }

  function handleGenerarCsv() {
    const filas: [string, string][] = [
      ["Fecha último proceso", fechaProceso],
      ["Usuario último proceso", usuarioProceso],
      ["Reclamos", String(datos.reclamos)],
      ["Reiteraciones", String(datos.reiteraciones)],
      ["SAIDI", datos.saidi],
      ["SAIFI", datos.saifi],
      ["Máxima duración — Interrupción", datos.maxDuracionRef],
      ["Máxima duración — Valor", String(datos.maxDuracionValor)],
      ["Máximo marginal ajustado — Interrupción", datos.maxMarginalRef],
      ["Máximo marginal ajustado — Valor", datos.maxMarginalValor],
    ];
    const csv = filas.map((f) => f.join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `planilla_consolidada_${fechaProceso.replace(/[/: ]/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex-1 overflow-y-auto px-10 py-10">
      <div className="bg-white rounded-md border border-gray-300" style={{ maxWidth: 760 }}>
        <CardHeader title="Consolidación" />
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div><FieldLabel>Fecha último proceso</FieldLabel><input readOnly value={fechaProceso} className={MOD_FIELD_CLS + ESTADO_CLASES.disabled} /></div>
            <div><FieldLabel>Usuario último proceso</FieldLabel><input readOnly value={usuarioProceso} className={MOD_FIELD_CLS + ESTADO_CLASES.disabled} /></div>
            <div><FieldLabel>Reclamos</FieldLabel><input readOnly value={String(datos.reclamos)} className={MOD_FIELD_CLS + ESTADO_CLASES.disabled} /></div>
            <div><FieldLabel>Reiteraciones</FieldLabel><input readOnly value={String(datos.reiteraciones)} className={MOD_FIELD_CLS + ESTADO_CLASES.disabled} /></div>
            <div><FieldLabel>SAIDI</FieldLabel><input readOnly value={datos.saidi} className={MOD_FIELD_CLS + ESTADO_CLASES.disabled} /></div>
            <div><FieldLabel>SAIFI</FieldLabel><input readOnly value={datos.saifi} className={MOD_FIELD_CLS + ESTADO_CLASES.disabled} /></div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <p className="text-caption font-semibold uppercase tracking-[0.07em] text-gray-600 mb-1.5">Máxima duración</p>
              <div className="grid grid-cols-2 gap-3">
                <div><FieldLabel>Interrupción</FieldLabel><input readOnly value={datos.maxDuracionRef} className={MOD_FIELD_CLS + ESTADO_CLASES.disabled} /></div>
                <div><FieldLabel>Valor</FieldLabel><input readOnly value={String(datos.maxDuracionValor)} className={MOD_FIELD_CLS + ESTADO_CLASES.disabled} /></div>
              </div>
            </div>
            <div>
              <p className="text-caption font-semibold uppercase tracking-[0.07em] text-gray-600 mb-1.5">Máximo marginal ajustado</p>
              <div className="grid grid-cols-2 gap-3">
                <div><FieldLabel>Interrupción</FieldLabel><input readOnly value={datos.maxMarginalRef} className={MOD_FIELD_CLS + ESTADO_CLASES.disabled} /></div>
                <div><FieldLabel>Valor</FieldLabel><input readOnly value={datos.maxMarginalValor} className={MOD_FIELD_CLS + ESTADO_CLASES.disabled} /></div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button type="button" onClick={() => setProgresoAbierto(true)} className={modalNeutralBtnCls}>Ver progreso</button>
            <button type="button" disabled={procesando} onClick={handleProcesar} className={modalPrimaryBtnCls} style={{ backgroundColor: "var(--color-primary)" }}>
              {procesando ? "Procesando…" : "Procesar"}
            </button>
            <button type="button" onClick={handleGenerarCsv} className={modalPrimaryBtnCls} style={{ backgroundColor: "var(--color-primary)" }}>Generar CSV</button>
          </div>
        </div>
      </div>

      <Modal
        title="Progreso del proceso"
        open={progresoAbierto}
        onClose={() => setProgresoAbierto(false)}
        size="sm"
        footer={<button type="button" onClick={() => setProgresoAbierto(false)} className={modalNeutralBtnCls}>Cerrar</button>}
      >
        <div className="flex flex-col gap-3">
          {["Recepción de tablas", "Cálculo de indicadores", "Consolidación final"].map((paso, i) => (
            <div key={paso} className="flex items-center gap-2.5">
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white text-micro"
                style={{ backgroundColor: i < 2 ? "var(--color-success)" : "var(--color-gray-300)" }}
              >
                {i < 2 ? "✓" : ""}
              </span>
              <span className="text-body text-gray-700">{paso}</span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}

// ─── Gestor de notas ────────────────────────────────────────────────────────

const NOTAS_INICIALES = [
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

function GestorNotasContent() {
  const [notas, setNotas] = useState(NOTAS_INICIALES);
  const [filtro, setFiltro] = useState("");
  const [seleccionada, setSeleccionada] = useState<string | null>(null);
  const [porPagina, setPorPagina] = useState(10);
  const [pagina, setPagina] = useState(1);
  const [modalAbierto, setModalAbierto] = useState<string | null>(null); // "nueva" o el id a editar
  const [textoModal, setTextoModal] = useState("");

  const ordenadas = [...notas].sort((a, b) => a.posicion - b.posicion);
  const filtradas = filtro ? ordenadas.filter((n) => n.texto.toLowerCase().includes(filtro.toLowerCase())) : ordenadas;
  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / porPagina));
  const paginaSegura = Math.min(pagina, totalPaginas);
  const visibles = filtradas.slice((paginaSegura - 1) * porPagina, paginaSegura * porPagina);

  function mover(id: string, direccion: "top" | "up" | "down" | "bottom") {
    const orden = [...notas].sort((a, b) => a.posicion - b.posicion);
    const idx = orden.findIndex((n) => n.id === id);
    if (idx === -1) return;
    const [item] = orden.splice(idx, 1);
    if (direccion === "top") orden.unshift(item);
    else if (direccion === "bottom") orden.push(item);
    else if (direccion === "up") orden.splice(Math.max(0, idx - 1), 0, item);
    else orden.splice(Math.min(orden.length, idx + 1), 0, item);
    setNotas(orden.map((n, i) => ({ ...n, posicion: i + 1 })));
  }

  function abrirNueva() { setTextoModal(""); setModalAbierto("nueva"); }
  function abrirEditar(id: string, texto: string) { setTextoModal(texto); setModalAbierto(id); }
  function guardarModal() {
    const texto = textoModal.trim();
    if (!texto) return;
    if (modalAbierto === "nueva") {
      setNotas((prev) => [...prev, { id: `n${Date.now()}`, texto, posicion: prev.length + 1 }]);
    } else if (modalAbierto) {
      setNotas((prev) => prev.map((n) => (n.id === modalAbierto ? { ...n, texto } : n)));
    }
    setModalAbierto(null);
  }

  return (
    <div className="flex-1 overflow-y-auto px-10 py-10">
      <div className="flex gap-4 items-start" style={{ maxWidth: 900 }}>
        <div className="flex-1 bg-white rounded-md border border-gray-300 overflow-hidden">
          <CardHeader
            title="Notas"
            right={
              <button type="button" onClick={abrirNueva} className={modalPrimaryBtnCls} style={{ backgroundColor: "var(--color-primary)" }}>
                Agregar nota
              </button>
            }
          />
          <div className="p-5">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 py-2 text-left text-caption font-semibold uppercase tracking-[0.07em] text-gray-600">Nota</th>
                  <th className="w-24 px-3 py-2 text-left text-caption font-semibold uppercase tracking-[0.07em] text-gray-600">Posición</th>
                  <th className="w-14 px-2 py-2" />
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-1.5">
                    <input
                      value={filtro}
                      onChange={(e) => { setFiltro(e.target.value); setPagina(1); }}
                      placeholder="Buscar nota..."
                      className={MOD_FIELD_CLS}
                    />
                  </td>
                  <td /><td />
                </tr>
              </thead>
              <tbody>
                {visibles.length === 0 ? (
                  <tr><td colSpan={3}>
                    <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
                      <span className="text-gray-400"><IcoInbox /></span>
                      <p className="text-body font-medium text-gray-600">No hay notas</p>
                    </div>
                  </td></tr>
                ) : visibles.map((n) => (
                  <tr
                    key={n.id}
                    onClick={() => setSeleccionada(n.id)}
                    className={`border-b border-gray-100 cursor-pointer transition-colors ${seleccionada === n.id ? "bg-primary-tint" : "hover:bg-gray-50"}`}
                  >
                    <td className="px-3 py-2.5 text-body text-gray-800">{n.texto}</td>
                    <td className="px-3 py-2.5 text-body text-gray-600 tabular-nums">{n.posicion}</td>
                    <td className="px-2 py-2.5">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); abrirEditar(n.id, n.texto); }}
                        className="w-7 h-7 flex items-center justify-center rounded-sm text-gray-500 hover:bg-primary-tint hover:text-secondary transition-colors"
                        title="Editar"
                      >
                        <IcoEdit />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2 text-body-sm text-gray-600">
                <span>Mostrar</span>
                <SelectWrap>
                  <select
                    value={porPagina}
                    onChange={(e) => { setPorPagina(Number(e.target.value)); setPagina(1); }}
                    className={MOD_SELECT_CLS}
                  >
                    {[10, 25, 50].map((n) => <option key={n} value={n}>{n} registros</option>)}
                  </select>
                </SelectWrap>
              </div>
              <div className="flex items-center gap-3 text-body-sm text-gray-600">
                <button disabled={paginaSegura <= 1} onClick={() => setPagina((p) => p - 1)} className="px-2.5 py-1 rounded border border-gray-400 bg-white disabled:opacity-40">Anterior</button>
                <span>Pág. <span className="font-medium text-gray-800">{paginaSegura}</span> de <span className="font-medium text-gray-800">{totalPaginas}</span></span>
                <button disabled={paginaSegura >= totalPaginas} onClick={() => setPagina((p) => p + 1)} className="px-2.5 py-1 rounded border border-gray-400 bg-white disabled:opacity-40">Siguiente</button>
              </div>
            </div>
          </div>
        </div>

        {/* Reordenar — actúa sobre la fila seleccionada de la tabla (click en la fila) */}
        <div className="flex flex-col gap-1.5 pt-14 shrink-0">
          {([
            { dir: "top" as const, icon: <IcoChevronsUp />, title: "Mover al principio" },
            { dir: "up" as const, icon: <span className="inline-flex rotate-180"><ChevronDown /></span>, title: "Subir" },
            { dir: "down" as const, icon: <ChevronDown />, title: "Bajar" },
            { dir: "bottom" as const, icon: <IcoChevronsDown />, title: "Mover al final" },
          ]).map((b) => (
            <button
              key={b.dir}
              type="button"
              title={b.title}
              disabled={!seleccionada}
              onClick={() => seleccionada && mover(seleccionada, b.dir)}
              className="w-9 h-9 flex items-center justify-center rounded-sm border border-gray-400 bg-white text-gray-600 hover:bg-primary-tint hover:border-primary hover:text-secondary disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              {b.icon}
            </button>
          ))}
        </div>
      </div>

      <Modal
        title={modalAbierto === "nueva" ? "Agregar nota" : "Editar nota"}
        open={modalAbierto !== null}
        onClose={() => setModalAbierto(null)}
        size="sm"
        footer={
          <>
            <button type="button" onClick={() => setModalAbierto(null)} className={modalNeutralBtnCls}>Cancelar</button>
            <button type="button" disabled={!textoModal.trim()} onClick={guardarModal} className={modalPrimaryBtnCls} style={{ backgroundColor: "var(--color-primary)" }}>Guardar</button>
          </>
        }
      >
        <FieldLabel>Nota</FieldLabel>
        <input value={textoModal} onChange={(e) => setTextoModal(e.target.value.toUpperCase())} className={MOD_FIELD_CLS} placeholder="Ej. DATOS INCOMPLETOS/ INCORRECTOS" autoFocus />
      </Modal>
    </div>
  );
}

// ─── Inserta clientes en BDTH ───────────────────────────────────────────────

function InsertaClientesContent() {
  const [cliente, setCliente] = useState("");
  const [validado, setValidado] = useState(false);
  const [periodo, setPeriodo] = useState("");

  function handleCambioCliente(v: string) { setCliente(v); setValidado(false); }
  function handleValidar() { if (cliente.trim()) setValidado(true); }
  function handleInsertar() {
    // mock: sin backend real conectado todavía
  }

  return (
    <div className="flex-1 overflow-y-auto px-10 py-10">
      <div className="bg-white rounded-md border border-gray-300 p-6" style={{ maxWidth: 640 }}>
        <div className="flex flex-col gap-4">
          <div className="flex items-end gap-3">
            <div className="flex-1 min-w-0">
              <FieldLabel>Cliente</FieldLabel>
              <input value={cliente} onChange={(e) => handleCambioCliente(e.target.value)} placeholder="ID de cliente" className={MOD_FIELD_CLS} />
            </div>
            <button type="button" disabled={!cliente.trim()} onClick={handleValidar} className={modalNeutralBtnCls}>Validar</button>
            {validado && <span className="text-body-sm font-medium shrink-0" style={{ color: "var(--color-success)" }}>✓ Cliente válido</span>}
          </div>
          <div style={{ maxWidth: 280 }}>
            <ValuePicker
              label="Período BDTH"
              value={periodo}
              onChange={setPeriodo}
              opts={PERIODS}
              placeholder="Seleccione período"
            />
          </div>
          <div className="flex justify-end pt-3 border-t border-gray-200">
            <button type="button" disabled={!validado || !periodo} onClick={handleInsertar} className={modalPrimaryBtnCls} style={{ backgroundColor: "var(--color-primary)" }}>Insertar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Reporte de auditoría ───────────────────────────────────────────────────

const USUARIOS_SISENRE_DEMO = [
  "ALEGHISSA", "APOZZER", "BLOPONTE", "BMABDALLAH", "CGLOAZZO", "CONSULTA_SISENRE",
  "DJAHNEL", "DLAZZARI", "EROMANELLO", "EVINTRIAGO", "FSCANDIZZO", "ICALVET",
  "LALVANO", "LCALABRESE", "LGUERINI", "LORIVAS", "LRICLE", "LSTIVANELLO",
]; // lista de ejemplo — reemplazar por el listado real de usuarios SISENRE cuando lo tengamos

function AuditoriaContent() {
  const [usuario, setUsuario] = useState("");
  const [tablasSel, setTablasSel] = useState<Set<AbmTableKey>>(new Set());

  function toggleTabla(k: AbmTableKey) {
    setTablasSel((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k); else next.add(k);
      return next;
    });
  }

  function handleExportar() {
    // mock: sin backend real conectado todavía
  }

  return (
    <div className="flex-1 overflow-y-auto px-10 py-10">
      <div className="bg-white rounded-md border border-gray-300" style={{ maxWidth: 720 }}>
        <CardHeader title="Filtros" />
        <div className="p-6 grid grid-cols-2 gap-6">
          <div>
            <ValuePicker
              label="Seleccione usuario"
              opts={USUARIOS_SISENRE_DEMO}
              value={usuario}
              onChange={setUsuario}
              searchable
            />
          </div>
          <div>
            <FieldLabel>Seleccione tablas</FieldLabel>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {ABM_ITEMS.map((item) => (
                <ModalCheckbox
                  key={item.key ?? item.code + item.label}
                  label={item.label}
                  checked={item.screen ? tablasSel.has(item.screen as AbmTableKey) : false}
                  onChange={() => item.screen && toggleTabla(item.screen as AbmTableKey)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end px-6 pb-6">
          <button
            type="button"
            disabled={!usuario || tablasSel.size === 0}
            onClick={handleExportar}
            className={modalPrimaryBtnCls}
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Exportar
          </button>
        </div>
      </div>
    </div>
  );
}

// Sigue una media query en vivo (matchMedia + listener de "change") — usado
// para el acordeón del sidebar en tier 760px (ver App): a diferencia de una
// clase Tailwind condicionada por CSS, acá el breakpoint tiene que cambiar
// comportamiento real (qué grupo se auto-expande, qué handler navega vs.
// solo despliega), no nada más apariencia.
function useMatchMedia(query: string): boolean {
  const [matches, setMatches] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [collapsed, setCollapsed] = useState(false);
  const [lastAbmTable, setLastAbmTable] = useState<AbmTableKey>("cds2");
  const [abmExpanded, setAbmExpanded] = useState(true);
  // "Otros" no es desplegable en el tamaño normal (label fijo, ver más
  // abajo) — este estado solo importa en el acordeón compacto de tier
  // 760px, donde ABM/Otros pasan a excluirse mutuamente.
  const [otrosExpanded, setOtrosExpanded] = useState(true);
  // Notebooks de 14" (ventana baja): "Alta, Baja y Modificación" (9 tablas)
  // y "Otros" (5 pantallas) expandidos a la vez es lo primero que se corta
  // (tapa ítems contra el footer del sidebar). Acá SÍ hace falta JS real
  // (no solo CSS) porque cambia comportamiento — qué grupo se auto-expande
  // y cuál handler colapsa al otro — no solo apariencia.
  const compactSidebar = useMatchMedia("(max-height: 760px)");
  // Deep-link pendiente hacia una tabla ABM (ej. desde el drawer "Tablas
  // relacionadas" de Modificar interrupción) — AbmScreen lo consume al
  // montar/cambiar de tabla y precarga campo, ejecuta búsqueda o entra en
  // alta según corresponda.
  const [abmDeepLink, setAbmDeepLink] = useState<AbmDeepLink | null>(null);
  // "Venís de Consultas de interrupción por un deep-link" — mientras esté
  // seteado, AbmScreen muestra el botón "Volver". Se limpia en cualquier
  // navegación ABM normal (sidebar, selector interno) y se restablece solo
  // al llegar por un deep-link nuevo.
  const [volverA, setVolverA] = useState<{ drawerTab: string | null; referencia: string | null } | null>(null);
  // Estado a restaurar en Consultas de interrupción al volver desde ABM —
  // lo consume ModificarContent como valor inicial en su próximo mount.
  const [modificarInitialDrawerTab, setModificarInitialDrawerTab] = useState<string | null>(null);
  const [modificarInitialReferencia, setModificarInitialReferencia] = useState<string | null>(null);

  // Acordeón de uno-abierto-a-la-vez del sidebar compacto (tier 760px):
  // abre el grupo que contiene `target` y cierra el otro. No hace nada si
  // la ventana no está en el tier compacto — en tamaño normal ambos grupos
  // siguen su comportamiento de siempre (ABM toggleable a mano, Otros
  // siempre expandido). Función plana (no hook) — puede vivir después de
  // los early return de abajo sin problema; se referencia acá arriba por
  // hoisting de `function`.
  function syncAccordionCompacto(target: Screen) {
    if (!compactSidebar) return;
    if (isAbmTableKey(target)) {
      setAbmExpanded(true);
      setOtrosExpanded(false);
    } else if (OTROS_ITEMS.some((it) => it.screen === target)) {
      setAbmExpanded(false);
      setOtrosExpanded(true);
    } else {
      setAbmExpanded(false);
      setOtrosExpanded(false);
    }
  }

  // Al entrar/salir del tier compacto (resize, o directamente montar con la
  // ventana ya baja): en compacto, auto-expande el grupo de la pantalla
  // activa y colapsa el resto; al volver a tamaño normal, restaura el
  // default de siempre (ambos expandidos). No corre en cada cambio de
  // `screen` — eso ya lo cubren las funciones de navegación de abajo vía
  // syncAccordionCompacto, para no pisar un toggle manual del usuario en
  // tamaño normal.
  //
  // Este hook (como todos los de App) tiene que quedar ANTES de los early
  // return de login/select de abajo — Rules of Hooks: un hook detrás de un
  // return condicional se salta en esos renders y React explota ("Rendered
  // more hooks than during the previous render").
  useEffect(() => {
    if (compactSidebar) syncAccordionCompacto(screen);
    else { setAbmExpanded(true); setOtrosExpanded(true); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compactSidebar]);

  if (screen === "login") return <LoginScreen onLogin={() => setScreen("select")} />;
  if (screen === "select") return <SelectScreen onSelect={(v) => setScreen(v === "nuevo" ? "welcome" : "select")} />;

  // Navega a una tabla ABM específica — usado tanto por los hijos del
  // sidebar como por el selector interno de AbmScreen, así ambos quedan
  // sincronizados sobre el mismo estado sin duplicarlo. Siempre expande el
  // padre "ABM" del sidebar si estaba colapsado. Cualquier navegación por
  // esta vía es "normal" — descarta el botón "Volver" si estaba armado.
  function goToAbmTable(k: AbmTableKey) {
    setScreen(k);
    setLastAbmTable(k);
    setAbmExpanded(true);
    if (compactSidebar) setOtrosExpanded(false);
    setVolverA(null);
  }

  // Click en el ítem padre "ABM": navega a la última tabla activa (o CDS2
  // la primera vez) y despliega/colapsa los hijos. En el acordeón compacto,
  // abrir ABM cierra "Otros" (uno-abierto-a-la-vez).
  function handleAbmParentClick() {
    const next = !abmExpanded;
    setScreen(lastAbmTable);
    setAbmExpanded(next);
    if (compactSidebar && next) setOtrosExpanded(false);
    setVolverA(null);
  }

  // Click en el header "Otros" — solo clickeable en el acordeón compacto
  // (ver sidebar): en tamaño normal sigue siendo un label fijo, decisión de
  // diseño ya tomada que no se toca fuera de tier 760px.
  function handleOtrosParentClick() {
    const next = !otrosExpanded;
    setOtrosExpanded(next);
    if (compactSidebar && next) setAbmExpanded(false);
  }

  // Navegación a Inicio (sidebar) — sin estado previo que restaurar, igual
  // que irAConsultas.
  function irAInicio() {
    setVolverA(null);
    setScreen("welcome");
    syncAccordionCompacto("welcome");
  }

  function irAOtroScreen(s: Screen) {
    setVolverA(null);
    setScreen(s);
    syncAccordionCompacto(s);
  }

  // Navegación normal a Consultas de interrupción (sidebar) — sin estado
  // previo que restaurar.
  function irAConsultas() {
    setModificarInitialDrawerTab(null);
    setModificarInitialReferencia(null);
    setVolverA(null);
    setScreen("modificar");
    syncAccordionCompacto("modificar");
  }

  function irAAbmConDeepLink(link: AbmDeepLink) {
    setAbmDeepLink(link);
    goToAbmTable(link.tableKey); // limpia volverA...
    setVolverA({ drawerTab: link.drawerTabOrigen ?? null, referencia: link.referenciaOrigen ?? null }); // ...y lo vuelve a armar
  }

  // Botón "Volver a Consultas de interrupción" del masthead de AbmScreen —
  // restaura la misma interrupción (y el mismo tab del drawer, si lo hay).
  function volverAConsultas() {
    setModificarInitialDrawerTab(volverA?.drawerTab ?? null);
    setModificarInitialReferencia(volverA?.referencia ?? null);
    setVolverA(null);
    setScreen("modificar");
    syncAccordionCompacto("modificar");
  }

  return (
    <div className="font-sans" style={{
      width: "100%", height: "100vh", display: "flex",
      backgroundColor: "var(--color-gray-100)",
      overflow: "hidden",
    }}>

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside style={{
        // Tier 760px: sidebar ~26% más angosto (256 → 190) para devolverle
        // ancho horizontal al contenido — es justo lo que le faltaba a la
        // barra de Búsqueda. Los labels largos ("Alta, Baja y Modificación")
        // truncan con ellipsis + title (tooltip nativo) si no entran, en vez
        // de encimarse o cortarse sin indicación.
        width: collapsed ? 60 : compactSidebar ? 190 : 256,
        transition: "width 220ms cubic-bezier(0.4,0,0.2,1)",
        backgroundColor: "var(--color-gray-50)",
        display: "flex", flexDirection: "column",
        flexShrink: 0, overflow: "hidden",
        borderRight: "1px solid var(--color-gray-300)",
      }}>
        {/* Logo + collapse */}
        <div className="flex items-center gap-2 px-3 border-b border-gray-300" style={{ minHeight: "var(--header-min-height, 60px)", paddingTop: 10, paddingBottom: 10 }}>
          {!collapsed ? (
            <>
              <button
                type="button"
                onClick={irAInicio}
                title="Ir a Inicio"
                className="flex-1 flex items-center overflow-hidden cursor-pointer"
                style={{ height: 38 }}
              >
                <div style={{ transform: "scale(0.68)", transformOrigin: "left center", pointerEvents: "none" }}>
                  <Logo />
                </div>
              </button>
              <button
                onClick={() => setCollapsed(true)}
                className="shrink-0 w-7 h-7 flex items-center justify-center rounded text-gray-600 hover:text-gray-800 hover:bg-gray-200 transition-colors"
                title="Colapsar"
              >
                <ChevronLeft />
              </button>
            </>
          ) : (
            /* Collapsed: small E monogram matching brand blue */
            <button
              onClick={() => setCollapsed(false)}
              className="mx-auto w-8 h-8 flex items-center justify-center rounded transition-colors hover:bg-gray-200"
              title="Expandir"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-body text-white"
                style={{ background: "linear-gradient(135deg,#1565C0,#1E3A8A)" }}
              >E</div>
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2" style={{ scrollbarWidth: "none" }}>
          <div className="flex flex-col gap-0.5">
            <NavItem
              label="Inicio"
              icon={<IcoHome />}
              active={screen === "welcome"}
              collapsed={collapsed}
              onClick={irAInicio}
            />
            <NavItem
              label="Consultas de interrupción"
              icon={<IcoSearch />}
              active={screen === "modificar"}
              collapsed={collapsed}
              onClick={irAConsultas}
            />
          </div>

          <div className={`my-2 border-t border-gray-300 ${collapsed ? "mx-auto w-8" : "mx-1"}`} />

          {/* ABM — ítem padre desplegable (acordeón), ahora con el MISMO lenguaje
              visual (ícono + texto) que Inicio/Consultas en los dos estados del
              sidebar — antes tenía dos renders distintos (caption chico sin ícono
              expandido, NavItem con ícono colapsado). Click navega a la última
              tabla activa (o CDS2 la primera vez) y despliega/colapsa los hijos. */}
          <button
            type="button"
            onClick={handleAbmParentClick}
            aria-expanded={abmExpanded}
            title={!collapsed ? "Alta, Baja y Modificación" : undefined}
            style={{ position: "relative" }}
            className={`sidebar-item-btn w-full flex items-center gap-2 rounded-sm border transition-all duration-150 group
              ${collapsed ? "justify-center py-[9px] mx-auto w-9" : "px-[9px] py-[6px]"}
              ${isAbmTableKey(screen)
                ? "border-primary bg-primary-tint text-secondary"
                : "border-transparent text-gray-700 hover:text-gray-800 hover:bg-gray-100"
              }`}
          >
            <span className="shrink-0"><IcoEdit /></span>
            {!collapsed && (
              <>
                <span className="flex-1 min-w-0 truncate text-body text-left leading-snug">Alta, Baja y Modificación</span>
                <span className={`shrink-0 transition-transform duration-150 ${abmExpanded ? "" : "-rotate-90"}`}>
                  <ChevronDown />
                </span>
              </>
            )}
            {collapsed && (
              <span className="sidebar-item-tooltip">Alta, Baja y Modificación</span>
            )}
          </button>

          {abmExpanded && !collapsed && (
            <div className="flex flex-col gap-0.5 pl-3 ml-2.5 border-l border-gray-200">
              {ABM_ITEMS.map((item, i) => (
                <NavItem
                  key={item.key ?? item.code + i}
                  label={item.label}
                  active={item.screen !== undefined && item.screen === screen}
                  collapsed={collapsed}
                  onClick={item.screen ? () => goToAbmTable(item.screen as AbmTableKey) : undefined}
                />
              ))}
            </div>
          )}

          {/* Otros group — label fijo, no clickeable, en tamaño normal
              (decisión de diseño ya tomada). Solo en el acordeón compacto
              (tier 760px) se vuelve un disclosure como el de ABM, porque
              ahí sí hace falta poder colapsarlo para que ambos grupos no
              se corten contra el footer. */}
          {collapsed ? (
            <div className="my-3 border-t border-gray-300 mx-auto w-8" />
          ) : compactSidebar ? (
            <button
              type="button"
              onClick={handleOtrosParentClick}
              aria-expanded={otrosExpanded}
              className="w-full flex items-center gap-1 px-1 pt-5 pb-1.5 text-micro font-semibold uppercase tracking-[0.1em] text-gray-500 select-none hover:text-gray-700 transition-colors"
            >
              <span className="flex-1 text-left">Otros</span>
              <span className={`shrink-0 transition-transform duration-150 ${otrosExpanded ? "" : "-rotate-90"}`}>
                <ChevronDown />
              </span>
            </button>
          ) : (
            <p className="px-1 pt-5 pb-1.5 text-micro font-semibold uppercase tracking-[0.1em] text-gray-500 select-none">Otros</p>
          )}
          {(!compactSidebar || otrosExpanded) && !collapsed && (
            <div className="flex flex-col gap-0.5">
              {OTROS_ITEMS.map((item) => (
                <NavItem
                  key={item.label}
                  label={item.label}
                  icon={item.icon}
                  active={screen === item.screen}
                  collapsed={collapsed}
                  onClick={() => irAOtroScreen(item.screen)}
                />
              ))}
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-300 px-2 py-2.5">
          <UserMenu collapsed={collapsed} onLogout={() => setScreen("login")} />
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {isAbmTableKey(screen) ? (
          <AbmScreen
            tableKey={screen}
            onChangeTable={goToAbmTable}
            deepLink={abmDeepLink}
            onDeepLinkConsumed={() => setAbmDeepLink(null)}
            volverVisible={volverA !== null}
            onVolver={volverAConsultas}
          />
        ) : (
          <>
            {/* Top bar — reservado para título de pantalla + selector de
                período, transversal a toda la app: no le agregues nada más
                acá (ver AjustesConsultas/PersistentActionsBar, que anclan su
                propio dropdown de tier 760px a la card de Búsqueda, no acá). */}
            <header
              className="flex items-center px-6 border-b border-gray-300 shrink-0"
              style={{ minHeight: "var(--header-min-height, 60px)", backgroundColor: "var(--color-gray-50)", boxShadow: "0 1px 0 var(--color-gray-300)" }}
            >
              <div className="flex items-center gap-2.5 flex-1">
                {screen === "modificar" && (
                  <h1 className="text-label font-semibold text-gray-900 leading-none">Consultas de interrupción</h1>
                )}
                {screen === "welcome" && (
                  <h1 className="text-label font-semibold text-gray-900 leading-none">Inicio</h1>
                )}
                {screen === "generaciontxt" && <h1 className="text-label font-semibold text-gray-900 leading-none">Generación de txt</h1>}
                {screen === "planillaconsolidada" && <h1 className="text-label font-semibold text-gray-900 leading-none">Planilla consolidada</h1>}
                {screen === "gestornotas" && <h1 className="text-label font-semibold text-gray-900 leading-none">Gestor de notas</h1>}
                {screen === "insertaclientes" && <h1 className="text-label font-semibold text-gray-900 leading-none">Inserta clientes en BDTH</h1>}
                {screen === "auditoria" && <h1 className="text-label font-semibold text-gray-900 leading-none">Reporte de auditoría</h1>}
              </div>
              <PeriodSelector />
            </header>

            {/* Content */}
            {screen === "welcome" && <WelcomeContent onIrATabla={goToAbmTable} />}
            {screen === "modificar" && (
              <ModificarContent
                onIrAAbm={irAAbmConDeepLink}
                initialDrawerTab={modificarInitialDrawerTab}
                initialReferencia={modificarInitialReferencia}
              />
            )}
            {screen === "generaciontxt" && <GeneracionTxtContent />}
            {screen === "planillaconsolidada" && <PlanillaConsolidadaContent />}
            {screen === "gestornotas" && <GestorNotasContent />}
            {screen === "insertaclientes" && <InsertaClientesContent />}
            {screen === "auditoria" && <AuditoriaContent />}
          </>
        )}
      </div>
    </div>
  );
}
