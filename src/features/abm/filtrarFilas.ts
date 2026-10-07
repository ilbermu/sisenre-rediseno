import { ChipFiltroDef, fechaDeExtremo, parseDateTimeStr, rangoDeValor } from "@/components/ui";

// Cómo compara un filtro contra la columna de la fila:
//   "contiene" → la columna contiene el valor, sin distinguir mayúsculas;
//   "igual"    → igualdad exacta;
//   "rango"    → la fecha de la columna ("dd/mm/aaaa hh:mm") cae dentro del
//                rango (valor de ChipFilterBar, ver valorDeRango); extremos
//                inclusivos, sin hora = día completo.
export type ModoFiltro = "contiene" | "igual" | "rango";

export type FiltroFila = { columna: string; valor: string; modo: ModoFiltro };

// Modo de un filtro de ChipFilterBar según su editor.
export function modoDeEditor(editor: ChipFiltroDef["editor"]): ModoFiltro {
  if (editor === "texto") return "contiene";
  if (editor === "fecha") return "rango";
  return "igual";
}

function enRango(celda: string, valor: string): boolean {
  const { date, time } = parseDateTimeStr(celda);
  if (!date) return false;
  const [hh, mm] = (time || "00:00").split(":").map(Number);
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hh, mm);
  const r = rangoDeValor(valor);
  const desde = fechaDeExtremo(r.desdeFecha, r.desdeHora, false);
  const hasta = fechaDeExtremo(r.hastaFecha, r.hastaHora, true);
  return (!desde || d >= desde) && (!hasta || d <= hasta);
}

function cumple(celda: string, { valor, modo }: FiltroFila): boolean {
  if (modo === "igual") return celda === valor;
  if (modo === "rango") return enRango(celda, valor);
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
