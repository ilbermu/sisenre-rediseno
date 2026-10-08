export function ceros(n: number, ancho: number): string {
  return String(n).padStart(ancho, "0");
}

// Formatos de la app (ver DESIGN_SYSTEM.md, "Voz y formatos"): un helper por
// formato, nada de toLocaleString / armado a mano por pantalla.
// Valor ausente o no aplicable: siempre el mismo guion largo.
export const VALOR_VACIO = "—";
const NUMERO_ES_AR = new Intl.NumberFormat("es-AR", { useGrouping: "always" } as unknown as Intl.NumberFormatOptions);
// 1234567 → "1.234.567" (con punto desde los miles, también 1.234)
export function formatNumero(n: number): string {
  return NUMERO_ES_AR.format(n);
}
// dd/mm/aaaa
export function formatFecha(d: Date): string {
  return `${ceros(d.getDate(), 2)}/${ceros(d.getMonth() + 1, 2)}/${d.getFullYear()}`;
}
// hh:mm, 24 h
export function formatHora(d: Date): string {
  return `${ceros(d.getHours(), 2)}:${ceros(d.getMinutes(), 2)}`;
}
// dd/mm/aaaa hh:mm, 24 h
export function formatFechaHora(d: Date): string {
  return `${formatFecha(d)} ${formatHora(d)}`;
}

// "dd/mm/aaaa hh:mm" → Date (null si no parsea).
export function parseFechaHora(texto: string): Date | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})(?: (\d{2}):(\d{2}))?$/.exec(texto.trim());
  if (!m) return null;
  return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]), Number(m[4] ?? 0), Number(m[5] ?? 0));
}

// "dd/mm hh:mm" — texto del trigger con un rango aplicado.
export function fmtDiaHora(d: Date): string {
  return `${ceros(d.getDate(), 2)}/${ceros(d.getMonth() + 1, 2)} ${formatHora(d)}`;
}

// "3 h 8 min", "1 d 23 h".
export function fmtDuracion(min: number): string {
  const d = Math.floor(min / 1440);
  const h = Math.floor((min % 1440) / 60);
  const m = min % 60;
  if (d > 0) return h > 0 ? `${d} d ${h} h` : `${d} d`;
  if (h > 0) return m > 0 ? `${h} h ${m} min` : `${h} h`;
  return `${m} min`;
}

// "47 min", "2 h 14 min", "2 h 05 min" (sin días: 26 h 10 min). Minutos con
// dos cifras cuando hay horas. Duración y tiempos entre fases de Consultas de
// interrupción.
export function fmtHorasMin(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h} h ${ceros(m, 2)} min` : `${m} min`;
}

// Delta desde el inicio: "+8 min", "+1 h 14 min".
export function fmtDelta(min: number): string {
  return `+${fmtDuracion(min)}`;
}

// "80% llegó en": número grande + última unidad en chico ("1 h 14" + "min").
export function partesDuracion(min: number): [string, string] {
  const txt = fmtDuracion(min);
  const i = txt.lastIndexOf(" ");
  return [txt.slice(0, i), txt.slice(i + 1)];
}

// "HH:mm", o "dd/mm HH:mm" cuando la interrupción dura más de un día.
export function fmtHoraCorta(d: Date, conDia: boolean): string {
  const hora = formatHora(d);
  return conDia ? `${ceros(d.getDate(), 2)}/${ceros(d.getMonth() + 1, 2)} ${hora}` : hora;
}
