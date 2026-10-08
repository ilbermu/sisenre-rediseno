// Chip "Tabla N" (ver DESIGN_SYSTEM.md, "AbmTableSelector"): el nombre de la
// tabla tal como lo conoce el usuario, al lado de su título. 22px de alto,
// px-2, rounded-full, primary-tint + borde chip-border, text-secondary caption
// semibold. Lo usan el título de los ABM (AbmTableSelector) y los títulos de
// sección de Consultas de interrupción. `ancho`: ancho mínimo parejo, para
// listas (el dropdown del selector).
export default function TablaChip({ nombre, ancho = false }: { nombre: string; ancho?: boolean }) {
  return (
    <span
      className={`inline-flex items-center justify-center h-5.5 px-2 shrink-0 rounded-full border border-chip-border bg-primary-tint text-secondary text-caption font-semibold whitespace-nowrap ${
        ancho ? "min-w-20" : ""
      }`}
    >
      {nombre}
    </span>
  );
}
