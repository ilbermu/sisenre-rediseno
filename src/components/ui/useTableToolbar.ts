import { useState, useEffect } from "react";

// ─── Table toolbar (buscador / orden / exportar) ───────────────────────────────
// Patron compartido para toda tabla de datos: buscador cliente-side, orden de
// columnas y exportar a CSV. Cada tabla mantiene su propio estado de orden y
// filtro via useTableToolbar; TableToolbar solo renderiza buscador + Exportar
// (+ botones futuros pasados como children).

export type SortDir = "asc" | "desc";

// `searchCols` (opcional): índices de getCells sobre los que busca el texto
// (misma convención que sortIdx). Sin él busca en todas las celdas, como
// siempre — los ABM no lo pasan.
export function useTableToolbar<T>(rows: T[], getCells: (row: T) => string[], resetKey: unknown = undefined, searchCols?: number[]) {
  const [search, setSearch] = useState("");
  const [sortIdx, setSortIdx] = useState<number | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  useEffect(() => {
    setSearch("");
    setSortIdx(null);
    setSortDir("asc");
  }, [resetKey]);

  const term = search.trim().toLowerCase();
  const filtered = rows
    .map((_, i) => i)
    .filter((i) => {
      if (!term) return true;
      const cells = getCells(rows[i]);
      return (searchCols ? searchCols.map((ci) => cells[ci] ?? "") : cells).some((c) => c.toLowerCase().includes(term));
    });

  const visibleIndices = sortIdx === null
    ? filtered
    : [...filtered].sort((a, b) => {
        const av = getCells(rows[a])[sortIdx] ?? "";
        const bv = getCells(rows[b])[sortIdx] ?? "";
        const cmp = av.localeCompare(bv, "es", { numeric: true, sensitivity: "base" });
        return sortDir === "asc" ? cmp : -cmp;
      });

  function toggleSort(colIdx: number) {
    setSortIdx((prev) => {
      if (prev === colIdx) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        return prev;
      }
      setSortDir("asc");
      return colIdx;
    });
  }

  return { search, setSearch, sortIdx, sortDir, toggleSort, visibleIndices };
}
