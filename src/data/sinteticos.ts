import { crearRng, elegir, enteroEntre, hashSemilla } from "@/data/rng";
import { FaseReposicion, ReclamosInterrupcion } from "@/data/types";
import { ceros } from "@/lib/format";

export function filasSinteticas<T>(n: number, gen: () => T): T[] {
  return Array.from({ length: n }, gen);
}

export const N_FILAS_SINTETICAS = 40;
// Zonas reales de Instalaciones MT (CDS7) — 4 valores, no confundir con los
// 25 partidos que usa CDS8 (Reclamos de clientes).
export const ZONAS_CDS7 = ["NORTE", "MORON", "OLIVOS", "PILAR"];

// Código de interrupción con el patrón real (ej. BFZ202607056849,
// AFZ202401000404) — `anio` elige el estilo "2026" (CDS2/3/4/9-NM, como en
// las capturas originales) o "2024" (CDS5/6/8/9, como en las capturas de
// producción relevadas para esas tablas).
export function refInterrupcionSintetica(rng: () => number, anio: "2026" | "2024"): string {
  const prefijo = elegir(rng, ["BFZ", "AFZ", "BPR", "MFZ", "MPR"]);
  const yyyymm = anio === "2026" ? "202607" : "202401";
  return `${prefijo}${yyyymm}${ceros(enteroEntre(rng, 0, 999999), 6)}`;
}
export function fechaSintetica(rng: () => number, mes: number, anio: number): string {
  const dia = ceros(enteroEntre(rng, 1, 28), 2);
  const hh = ceros(enteroEntre(rng, 0, 23), 2);
  const mm = ceros(elegir(rng, [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]), 2);
  return `${dia}/${ceros(mes, 2)}/${anio} ${hh}:${mm}`;
}
export function clienteIdSintetico(rng: () => number): string {
  return String(enteroEntre(rng, 1000000000, 9999999999));
}
export function cadenaCodeSintetica(rng: () => number): string {
  const n = enteroEntre(rng, 50000, 50999);
  return `${n}#B1#${n}-TR1`;
}
export function recCodeSintetico(rng: () => number): string {
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
export const DESCRIPCIONES_EQUIPO_OPERADO: string[] = [
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
export const NOMBRES_SINTETICOS = [
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
export const CALLES_SINTETICAS = [
  "SALTA", "MITRE", "SAN MARTIN", "BELGRANO", "RIVADAVIA",
  "SARMIENTO", "MORENO", "AVELLANEDA", "9 DE JULIO", "LAS HERAS",
];
export const PARTIDOS_LOCALIDADES_SINTETICOS = [
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
export const PARTIDO_LOCALIDAD: Record<string, string[]> = {
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
export const PARTIDOS: string[] = Object.keys(PARTIDO_LOCALIDAD);
export const CODIGOS_FALLA_SINTETICOS = [
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
export const SAMPLE_ROWS = (() => {
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
export const TOTAL_REGISTROS = 57098;

// ─── CDS3 data ────────────────────────────────────────────────────────────────

export const CAUSAS_NC = [
  "<= A 3 MINUTOS",
  "INSTALACION CLIENTE",
];
export const CDS3_ROWS = (() => {
  const rng = crearRng(20260703);
  return filasSinteticas(N_FILAS_SINTETICAS, () => ({
    referencia: refInterrupcionSintetica(rng, "2026"),
    fase: String(enteroEntre(rng, 1, 5)),
    causa: elegir(rng, CAUSAS_NC),
  }));
})();
export const CDS3_TOTAL = 2501;

// ─── CDS4 data ────────────────────────────────────────────────────────────────

export const CDS4_ROWS = (() => {
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
export const CDS4_TOTAL = 48213;

// ─── Modificar content ────────────────────────────────────────────────────────

export const RECORD = SAMPLE_ROWS[0]; // BFZ202607056849

// Fase eléctrica de la reposición — sesgada hacia monofásicas (R/S/T) y RST
// (el caso más común en la base real), con las combinaciones bifásicas
// (RS/RT/ST) como minoría.
function faseElectricaReposicionSintetica(rng: () => number): string {
  const dado = rng();
  if (dado < 0.55) return elegir(rng, ["R", "S", "T"]);
  if (dado < 0.85) return "RST";
  return elegir(rng, ["RS", "RT", "ST"]);
}

// Fases de reposición de la interrupción seleccionada — mostrada siempre
// visible en la Card B de Consultas de interrupción (ya no detrás de un
// tab del drawer). Varía por interrupción: la semilla es la referencia
// seleccionada, así que la misma interrupción siempre muestra las mismas
// fases pero cada interrupción tiene las suyas. La cantidad de filas está
// sesgada hacia pocas (1-3 el caso típico, 4-6 menos común, 7-10 raro).
export function generarFasesSinteticas(referencia: string): FaseReposicion[] {
  const rng = crearRng(hashSemilla(referencia + ":fases"));
  const dado = rng();
  const cantidad = dado < 0.65 ? enteroEntre(rng, 1, 3) : dado < 0.9 ? enteroEntre(rng, 4, 6) : enteroEntre(rng, 7, 10);
  return Array.from({ length: cantidad }, (_, i) => ({
    nro: i + 1,
    horaRep: fechaSintetica(rng, 7, 2026),
    fase: faseElectricaReposicionSintetica(rng),
    equipoCodigo: equipoCodeSintetico(rng),
    equipoDesc: elegir(rng, DESCRIPCIONES_EQUIPO_OPERADO),
    usuariosBT: enteroEntre(rng, 1, 60),
  }));
}

// Valores de "Tablas relacionadas" (indicadores TABLA 3/5/6/8/9) para la
// interrupción seleccionada — mismo criterio: semilla = referencia, así
// que varían de forma determinística por interrupción. Tabla 3 es SI/NO;
// el resto son cantidades sesgadas hacia números bajos, con valores más
// altos ocasionales.
export function generarTablasRelacionadas(referencia: string): Record<string, string> {
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

function parseFechaHora(texto: string): Date {
  const [fecha, hora = "00:00"] = texto.split(" ");
  const [d, m, a] = fecha.split("/").map(Number);
  const [hh, mm] = hora.split(":").map(Number);
  return new Date(a, m - 1, d, hh, mm);
}

export function generarReclamosSinteticos(referencia: string, fechaInicio: string): ReclamosInterrupcion {
  const rng = crearRng(hashSemilla(referencia + ":reclamos"));
  const dado = rng();
  const duracionMin =
    dado < 0.6 ? enteroEntre(rng, 40, 240)
    : dado < 0.85 ? enteroEntre(rng, 241, 720)
    : dado < 0.96 ? enteroEntre(rng, 721, 2880)
    : enteroEntre(rng, 2881, 7200);
  const inicio = parseFechaHora(fechaInicio);
  const fin = new Date(inicio.getTime() + duracionMin * 60000);
  const dadoCantidad = rng();
  const cantidad =
    dadoCantidad < 0.1 ? 0
    : dadoCantidad < 0.55 ? 1
    : dadoCantidad < 0.865 ? 2
    : dadoCantidad < 0.955 ? enteroEntre(rng, 3, 15)
    : enteroEntre(rng, 16, 400);
  const minutos = Array.from({ length: cantidad }, () =>
    Math.min(duracionMin - 1, Math.floor(duracionMin * (0.02 + rng() * 0.12 + Math.pow(rng(), 2.2) * 0.86))),
  );
  return { inicio, fin, minutos };
}

// Filas de cada tab del drawer "Tablas relacionadas" (5/6/8/9) — misma
// semilla que los tiles (referencia + reposición seleccionada, ver
// generarTablasRelacionadas): la cantidad SIEMPRE coincide con el valor
// del tile correspondiente (valoresRelacionadas), y en las tablas con
// columnas "Interrupción"/"Fase" (5, 6, 9) esas dos columnas quedan fijas
// en la referencia y el número de reposición seleccionados — el tab
// muestra solo las filas de esa reposición puntual.
//
// ⚠ Antes tabla6/tabla9 tenían UNA fila hardcodeada (misma referencia que
// una fila igualmente hardcodeada en ABM_TABLE_CONFIGS.cds6/cds9.rows)
// para que el deep-link "Ir a ABM" siempre encontrara y seleccionara esa
// fila en destino. Con filas generadas por reposición, ese match dejó de
// estar garantizado (las referencias sintéticas no van a coincidir con
// las de cds5/6/8/9, que usan semillas fijas propias) — mismo
// comportamiento de soft-fail que ya tenía tabla8 (ver
// AbmScreen: `config.rows.findIndex` sin match → sin crash, sin fila
// preseleccionada, el buscador queda con el valor precargado nomás).
// Decisión conversada con el usuario: aceptar ese soft-fail en vez de
// tocar ABM_TABLE_CONFIGS para forzar un match real.
export function generarFilasTabla5(seed: string, referencia: string, nroReposicion: number, cantidad: number): string[][] {
  const rng = crearRng(hashSemilla(seed + ":tabla5"));
  return filasSinteticas(cantidad, () => [
    referencia,
    String(nroReposicion),
    cadenaCodeSintetica(rng),
    String(enteroEntre(rng, 100, 2000)),
    elegir(rng, ["R", "S", "T", "RS", "RT", "ST", "RST"]),
    String(enteroEntre(rng, 1, 900)),
  ]);
}
export function generarFilasTabla6(seed: string, referencia: string, nroReposicion: number, cantidad: number): string[][] {
  const rng = crearRng(hashSemilla(seed + ":tabla6"));
  return filasSinteticas(cantidad, () => [
    referencia,
    String(nroReposicion),
    clienteIdSintetico(rng),
    String(enteroEntre(rng, 50, 5000)),
    cadenaCodeSintetica(rng),
    cadenaCodeSintetica(rng),
    elegir(rng, ["1MT", "2MT", "3MT", "4MT"]),
    String(enteroEntre(rng, 50, 900)),
    elegir(rng, ["MT", "AT"]),
  ]);
}
export function generarFilasTabla8(seed: string, cantidad: number): string[][] {
  const rng = crearRng(hashSemilla(seed + ":tabla8"));
  return filasSinteticas(cantidad, () => {
    const domicilio = elegir(rng, PARTIDOS_LOCALIDADES_SINTETICOS);
    return [
      recCodeSintetico(rng),
      fechaSintetica(rng, 1, 2024),
      clienteIdSintetico(rng),
      elegir(rng, NOMBRES_SINTETICOS),
      elegir(rng, ["1R", "1G", "2", "3"]),
      elegir(rng, CODIGOS_FALLA_SINTETICOS),
      elegir(rng, ["", "1", "2", "3", "PB"]),
      elegir(rng, ["", "A", "B", "C"]),
      domicilio.partido,
    ];
  });
}
export function generarFilasTabla9(seed: string, referencia: string, nroReposicion: number, cantidad: number): string[][] {
  const rng = crearRng(hashSemilla(seed + ":tabla9"));
  return filasSinteticas(cantidad, () => [
    referencia,
    String(nroReposicion),
    clienteIdSintetico(rng),
    elegir(rng, ["1AP", "1G", "1R", "2", "3AT", "3BT", "3MT"]),
    cadenaCodeSintetica(rng),
    cadenaCodeSintetica(rng),
  ]);
}

// ─── Planilla consolidada ───────────────────────────────────────────────────

export function generarConsolidacionSintetica(rng: () => number) {
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
