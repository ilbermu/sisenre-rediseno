// Descarga client-side de filas como CSV (Blob + <a download>), igual que
// "Generar CSV" de Planilla consolidada. Formato del exportRowsToCsv original
// del ABM: BOM (Excel abre los acentos bien), separador ",", CRLF, comillas
// dobles escapadas en los valores con coma, comilla, punto y coma o salto.
export function descargarCsv(nombreArchivo: string, encabezados: string[], filas: string[][]) {
  const escapar = (v: string) => (/[",\n;]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  const csv = "\uFEFF" + [encabezados, ...filas].map((f) => f.map(escapar).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${nombreArchivo}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
