// Badge con el nombre de una tabla (ej. "Tabla 2", "Tabla 4" — el `nombre`
// de su config, nunca el código CDS) — mismo componente en todo lugar donde
// haga falta dejar explícito sobre qué tabla se trabaja: CardHeader
// (paneles de ABM, cards de Consultas) y la ficha de la reposición.
export default function CodeBadge({ code }: { code: string }) {
  return (
    <span
      className="text-caption px-1.5 py-0.5 rounded-xs border border-border-strong text-text-muted shrink-0 font-mono"
    >
      {code}
    </span>
  );
}
