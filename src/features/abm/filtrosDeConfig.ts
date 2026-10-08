import { ChipFiltroDef } from "@/components/ui";
import { AbmFiltroBarra, AbmTableConfig, CampoBusqueda } from "@/data/types";
import { FiltroFila, modoDeEditor } from "@/features/abm/filtrarFilas";

// Editor del chip según el tipo actual del campo (ver AbmFiltroBarra).
export function editorDeCampo(c: CampoBusqueda): ChipFiltroDef["editor"] {
  if (c.tipo === "fecha") return "fecha";
  if (c.tipo === "toggle" || c.tipo === "select") return "lista";
  if (c.tipo === "combobox") return "busqueda";
  return "texto";
}

// Filtros de la barra de una tabla ABM (filtrosBarra de su config) como
// ChipFiltroDef: editor, opciones y emptyMessage salen del campo. Lo usan
// los ABM y el maestro de Consultas de interrupción (Tabla 2), así los dos
// filtran igual.
export function chipsDeConfig(config: AbmTableConfig): { visibles: ChipFiltroDef[]; agregables: ChipFiltroDef[] } {
  const campos = config.secciones.flatMap((s) => s.filas.flat());
  const chipDe = (f: AbmFiltroBarra): ChipFiltroDef => {
    const c = campos.find((x) => x.nombre === f.campo);
    return {
      campo: f.campo,
      label: f.label ?? c?.label ?? f.campo,
      chipLabel: f.chipLabel,
      soloValor: f.soloValor,
      editor: c ? editorDeCampo(c) : "texto",
      opciones: c?.opciones,
      emptyMessage: c?.emptyMessage,
    };
  };
  return { visibles: config.filtrosBarra.visibles.map(chipDe), agregables: config.filtrosBarra.agregables.map(chipDe) };
}

// Columna de `rows` de un campo (inversa de mapeoFilaACampos).
export function columnaDeCampo(config: AbmTableConfig, nombre: string): string | undefined {
  return Object.keys(config.mapeoFilaACampos).find((k) => config.mapeoFilaACampos[k] === nombre);
}

// Valores de la barra (ID + chips) → filtros por columna de `rows`: el ID por
// "contiene"; cada chip según su editor.
export function filtrosFilaDeBarra(config: AbmTableConfig, id: string, valores: Record<string, string>, chips: ChipFiltroDef[]): FiltroFila[] {
  return [
    { columna: columnaDeCampo(config, config.campoId) ?? config.campoId, valor: id, modo: "contiene" },
    ...chips.map((d) => ({ columna: columnaDeCampo(config, d.campo) ?? d.campo, valor: valores[d.campo] ?? "", modo: modoDeEditor(d.editor) })),
  ];
}
