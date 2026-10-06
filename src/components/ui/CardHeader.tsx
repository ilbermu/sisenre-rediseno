import CodeBadge from "@/components/ui/CodeBadge";

// Header compartido de toda card y de toda sección de card (Búsqueda,
// Resultados, Interrupciones, Reposiciones, Reclamos, Tablas relacionadas…).
// Anatomía fija (ver DESIGN_SYSTEM.md, "CardHeader") — ningún header define
// su alto ni su padding a mano:
//   alto     → h-(--card-header-h), sin padding vertical, contenido centrado.
//   padding  → px-(--card-px), el mismo que el cuerpo de la card.
//   línea    → border-b border-border siempre en level="card"; level="section"
//              no la lleva (la sección ya se separa con su border-t).
//   una sola línea:
//     title   → text-heading-md (heading-sm en level="section"), no trunca.
//     tag     → CodeBadge en línea con el título.
//     context → en la MISMA línea, después de un "·" (text-faint): etiqueta
//               en heading-xs uppercase + valor en text-code font-mono, los
//               dos text-muted. Trunca antes que el título.
//     actions → a la derecha (ml-auto): solo acciones de alcance tabla, nunca
//               sobre el registro seleccionado — salvo el botón "stretched"
//               de una sección clickeable (ver ReclamosResumenCompacto).
export default function CardHeader({
  title,
  tag,
  context,
  actions,
  level = "card",
}: {
  title: string;
  tag?: string;
  context?: { label: string; value: string };
  actions?: React.ReactNode;
  level?: "card" | "section";
}) {
  return (
    <div
      className={`h-(--card-header-h) px-(--card-px) shrink-0 flex items-center gap-2 ${
        level === "section" ? "" : "border-b border-border"
      }`}
    >
      <span className={`shrink-0 whitespace-nowrap text-text ${level === "section" ? "text-heading-sm" : "text-heading-md"}`}>{title}</span>
      {tag && <CodeBadge code={tag} />}
      {context && (
        <>
          <span className="shrink-0 text-text-faint" aria-hidden>·</span>
          <span className="min-w-0 truncate text-text-muted">
            <span className="text-heading-xs uppercase mr-1.5">{context.label}</span>
            <span className="text-code font-mono tabular-nums">{context.value}</span>
          </span>
        </>
      )}
      {actions && <div className="ml-auto shrink-0">{actions}</div>}
    </div>
  );
}
