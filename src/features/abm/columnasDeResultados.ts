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
