import { FilterBarValores, parseDateTimeStr } from "@/components/ui";

// Cómo compara cada filtro de la barra de búsqueda (FilterBar) contra la
// columna de la fila:
//   "contiene" → la columna contiene el valor, sin distinguir mayúsculas;
//   "igual"    → igualdad exacta;
//   "fecha"    → mismo día; la hora solo cuenta si se cargó una (DateTimeField
//                completa "00:00" cuando no se elige hora, así que "00:00"
//                se toma como "sin hora").
export type ModoFiltro = "contiene" | "igual" | "fecha";

export const MODO_FILTRO: Record<keyof FilterBarValores, ModoFiltro> = {
  codigo: "contiene",
  fecha: "fecha",
  nivel: "igual",
  fase: "igual",
  origen: "igual",
  tipo: "igual",
  cadenaElectrica: "contiene",
  alimentadorMT: "contiene",
  centroTransf: "contiene",
  codigoEquipo: "contiene",
  descEquipo: "igual",
  divisionRed: "igual",
};

export type FiltroFila = { columna: string; valor: string; modo: ModoFiltro };

function mismaFecha(celda: string, filtro: string): boolean {
  const f = parseDateTimeStr(filtro);
  const c = parseDateTimeStr(celda);
  if (!f.date || !c.date) return false;
  if (f.date.getTime() !== c.date.getTime()) return false;
  return !f.time || f.time === "00:00" || f.time === c.time;
}

function cumple(celda: string, { valor, modo }: FiltroFila): boolean {
  if (modo === "igual") return celda === valor;
  if (modo === "fecha") return mismaFecha(celda, valor);
  return celda.toLowerCase().includes(valor.trim().toLowerCase());
}

// Índices de `rows` que cumplen todos los filtros con valor (AND). Los
// filtros vacíos no cuentan: sin ninguno, pasan todas las filas. Devuelve
// índices (no filas) porque el ABM usa el índice de config.rows como
// identidad de la fila.
export function filtrarFilas(rows: Record<string, string>[], filtros: FiltroFila[]): number[] {
  const activos = filtros.filter((f) => f.valor.trim() !== "");
  return rows.flatMap((row, i) => (activos.every((f) => cumple(row[f.columna] ?? "", f)) ? [i] : []));
}
