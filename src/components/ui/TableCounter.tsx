// Contador del toolbar de tabla ("N de M registros") — siempre visible,
// también sin filtros, para que el layout no salte al aplicar uno.
// Sin `total` (ej. toolbar sin resultados): "N registros".
export function TableCounter({ visibles, total }: { visibles: number; total?: number }) {
  return (
    <span className="text-caption text-text-muted tabular-nums whitespace-nowrap">
      <span className="font-semibold text-text">{visibles}</span>{total === undefined ? "" : ` de ${total}`} registros
    </span>
  );
}
