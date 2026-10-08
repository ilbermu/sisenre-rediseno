import { AbmTableConfig, ColumnaResultado } from "@/data/types";

// Columnas de la tabla de Resultados de una tabla ABM, derivadas de su
// config (ver DESIGN_SYSTEM.md, Patrones → "ABM"):
//   · todos los campos del formulario con `nombreReal` (o sea, que existen
//     en la tabla real), en el ORDEN de la tabla real (`ordenTablaReal`);
//   · el campoId siempre primero, aunque en la tabla real no lo sea;
//   · sin los campos sin nombreReal (siguen en el modal) ni los de
//     auditoría; sin máximo de columnas.
// Encabezado = `labelColumna` o el label del campo; el nombreReal va en el
// tag de ColumnHeaderHint, no en el encabezado.
export function columnasDeResultados(config: AbmTableConfig): ColumnaResultado[] {
  const campos = config.secciones.flatMap((s) => s.filas.flat());
  const columnaDe = (nombre: string) => Object.keys(config.mapeoFilaACampos).find((k) => config.mapeoFilaACampos[k] === nombre);
  const ordenados = config.ordenTablaReal
    .map((real) => campos.find((c) => c.nombreReal === real))
    .filter((c): c is NonNullable<typeof c> => !!c);
  const id = ordenados.find((c) => c.nombre === config.campoId);
  const todos = id ? [id, ...ordenados.filter((c) => c !== id)] : ordenados;
  return todos.flatMap((c) => {
    const key = columnaDe(c.nombre);
    return key ? [{ key, label: c.labelColumna ?? c.label, campo: c, nombreReal: c.nombreReal }] : [];
  });
}

// Excepciones declaradas a "mismo nombre real = mismo encabezado" (ver
// DESIGN_SYSTEM.md, Patrones → "ABM"): { tabla, nombreReal } cuyo encabezado
// puede diferir. SSEE de Tabla 7 es otro dato (la subestación, no la cadena
// eléctrica); POT y POTENCIA de Tabla 7 se distinguen entre sí
// ("Potencia trafos" / "Potencia clientes MT").
const EXCEPCIONES: { tabla: string; nombreReal: string }[] = [
  { tabla: "cds7", nombreReal: "SSEE" },
  { tabla: "cds7", nombreReal: "POT" },
  { tabla: "cds7", nombreReal: "POTENCIA" },
];

// Verificación de consistencia de encabezados: agrupando por nombreReal,
// todas las columnas de todas las tablas llevan el mismo encabezado (salvo
// las EXCEPCIONES), y ninguna tabla repite un encabezado. Además, el chip de
// cada filtro que tiene columna se llama como su encabezado. Devuelve la
// lista de problemas (vacía = ok); AbmScreen la reporta en desarrollo.
export function encabezadosInconsistentes(configs: Record<string, AbmTableConfig>): string[] {
  const problemas: string[] = [];
  const porReal = new Map<string, Map<string, string[]>>();
  for (const [tabla, config] of Object.entries(configs)) {
    const columnas = columnasDeResultados(config);
    const vistos = new Map<string, string>();
    for (const f of [...config.filtrosBarra.visibles, ...config.filtrosBarra.agregables]) {
      const c = columnas.find((col) => col.campo.nombre === f.campo);
      const chip = f.chipLabel ?? f.label ?? c?.campo.label;
      if (c && chip !== c.label) problemas.push(`${tabla}: el chip "${chip}" debería llamarse "${c.label}" (encabezado de ${f.campo})`);
    }
    for (const c of columnas) {
      const previo = vistos.get(c.label);
      if (previo) problemas.push(`${tabla}: "${c.label}" repetido (${previo} y ${c.nombreReal})`);
      vistos.set(c.label, c.nombreReal ?? c.campo.nombre);
      if (!c.nombreReal || EXCEPCIONES.some((e) => e.tabla === tabla && e.nombreReal === c.nombreReal)) continue;
      const grupo = porReal.get(c.nombreReal) ?? new Map<string, string[]>();
      grupo.set(c.label, [...(grupo.get(c.label) ?? []), tabla]);
      porReal.set(c.nombreReal, grupo);
    }
  }
  for (const [real, titulos] of porReal) {
    if (titulos.size > 1) {
      problemas.push(`${real}: encabezados distintos — ${[...titulos].map(([t, tablas]) => `"${t}" (${tablas.join(", ")})`).join(" vs ")}`);
    }
  }
  return problemas;
}
