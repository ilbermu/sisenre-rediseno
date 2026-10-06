// Badge de código de tabla (ej. "CDS2", "CDS6") — mismo componente en todo
// lugar donde haga falta dejar explícito sobre qué tabla ABM se trabaja:
// CardHeader (paneles de ABM) y la barra de búsqueda de Modificar interrupción.
export function CodeBadge({ code }: { code: string }) {
  return (
    <span
      className="text-caption px-1.5 py-0.5 rounded-xs border border-border-strong text-text-muted shrink-0 font-mono"
    >
      {code}
    </span>
  );
}
