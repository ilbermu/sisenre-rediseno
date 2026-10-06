// Subtítulo "etiqueta + valor" de las cards con secciones: etiqueta en
// heading-xs mayúscula y el valor en text-code font-mono (ej. "INTERRUPCIÓN
// SELECCIONADA BFZ…", "REPOSICIÓN 1 de 5 · 22/07/2026 14:50"). Hereda el
// text-muted del subtítulo de CardHeader.
export function SubtituloEtiquetado({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  return (
    <>
      <span className="text-heading-xs uppercase mr-1.5">{etiqueta}</span>
      <span className="text-code font-mono tabular-nums">{children}</span>
    </>
  );
}
