// Franja de cifras de la hoja de Consulta de interrupciones y del modal de
// reclamos (ver DESIGN_SYSTEM.md, Maestro-detalle): columnas iguales
// separadas por border-l, etiqueta de 11px y valor de 17px semibold. Con 4
// cifras pasa a 2×2 si el contenedor mide menos de 440px (container query);
// con 2, siempre 2 columnas.
export default function FranjaCifras({ cifras }: { cifras: { label: string; valor: React.ReactNode }[] }) {
  const cuatro = cifras.length === 4;
  return (
    <div className="@container shrink-0 border-b border-border">
      <dl className={`grid px-[24px] py-[12px] ${cuatro ? "grid-cols-4 @max-[440px]:grid-cols-2" : "grid-cols-2"}`}>
        {cifras.map((c, i) => (
          <div
            key={c.label}
            className={`min-w-0 ${i === 0 ? "pr-4" : "px-4 border-l border-border"} ${
              cuatro && i === 2 ? "@max-[440px]:pl-0 @max-[440px]:border-l-0" : ""
            } ${cuatro && i >= 2 ? "@max-[440px]:mt-3" : ""}`}
          >
            <dt className="text-[11px] leading-4 font-medium text-neutral-500 truncate">{c.label}</dt>
            <dd className="text-[17px] leading-6 font-semibold tabular-nums text-neutral-900 whitespace-nowrap">{c.valor}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
