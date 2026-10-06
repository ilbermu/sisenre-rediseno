import { CampoBusqueda } from "@/data/types";

// Resuelve el value crudo de un campo (toggle/select/combobox) a su label
// legible, usando las mismas `opciones` que ya usa AbmCampo — incluyendo el
// caso de opciones en función/cascada (ej. Localidad depende de Partido).
export function labelDeValor(campo: CampoBusqueda, valor: string, contexto: Record<string, string>): string {
  if (!valor) return "";
  if (campo.tipo === "toggle" || campo.tipo === "select" || campo.tipo === "combobox") {
    const opciones = typeof campo.opciones === "function" ? campo.opciones(contexto) : campo.opciones;
    const opcion = opciones?.find((o) => (typeof o === "string" ? o === valor : o.value === valor));
    if (opcion) return typeof opcion === "string" ? opcion : opcion.label;
  }
  return valor;
}
