// ─── Generador de datos sintéticos (semilla fija) ──────────────────────────
// Reemplaza los arrays hardcodeados de 1-5 filas por ~40 filas por tabla,
// con forma realista por tipo de campo (códigos de interrupción, fases,
// tarifas, zonas, fechas, etc.), reusando los mismos valores/patrones ya
// vistos en las capturas de producción relevadas (OLIVOS/MORON, prefijos
// BFZ/AFZ/BPR/MFZ/MPR, cadenas "NNNNN#B1#NNNNN-TR1", etc.). El PRNG
// (mulberry32) es determinístico dada una semilla fija — el contenido no
// cambia entre cargas de la página. Sin sentido relacional entre tablas:
// alcanza con que cada una se vea creíble individualmente.

export function crearRng(semilla: number) {
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
export function hashSemilla(texto: string): number {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
export function elegir<T>(rng: () => number, opciones: T[]): T {
  return opciones[Math.floor(rng() * opciones.length)];
}
export function enteroEntre(rng: () => number, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}
