import CodeBadge from "@/components/ui/CodeBadge";

// Header compartido de toda card y de toda sección de card (Búsqueda,
// Resultados, Interrupciones, Reposiciones, Reclamos, Tablas relacionadas…).
// Anatomía (ver DESIGN_SYSTEM.md, "Header de card"):
//   title    → text-heading-md, con el badge de código (`tag`) en línea.
//   subtitle → debajo del título, text-body-sm text-text-muted: el contexto
//              de los datos de la card (registro padre, conteo). En
//              minúsculas, sin "·" inicial; un ID o una fecha dentro del
//              subtítulo va en text-code font-mono.
//   actions  → a la derecha: solo acciones de alcance tabla, nunca sobre el
//              registro seleccionado — salvo el botón "stretched" de una
//              sección clickeable (ver ReclamosResumenCompacto).
// Sin fondo: el alto sale del contenido (no hay alto fijo). Por defecto sin
// línea divisoria (la separación la da el espaciado pt-3 pb-2); con `divider`
// lleva línea inferior a todo el ancho.
// `reserveSubtitle`: reserva la línea del subtítulo aunque todavía no haya
// nada que mostrar (ej. sin interrupción seleccionada), para que el header
// no cambie de alto — y dos cards lado a lado no se desalineen — cuando el
// subtítulo aparece.
// `padX`: padding horizontal, SIEMPRE el mismo que el cuerpo de la card
// (px-4 en la vista de trabajo, que es el default).
// `chrome`: el aire sale de las variables de chrome de index.css en vez de
// --spacing — px-(--card-px) (pisa `padX`), py-(--card-header-py) con
// `divider` y pt-(--card-section-py) en `level="section"`. Ver
// DESIGN_SYSTEM.md, "Aire: chrome vs datos".
//
// Card con secciones (Consultas de interrupción — ver DESIGN_SYSTEM.md,
// "Card con secciones"): el header de la card lleva `divider` (siempre
// visible) y `chrome`, con el badge en línea junto al título (el lado
// derecho queda solo para acciones); el header de cada sección lleva
// `level="section"` (título en heading-sm, sin divisor). El resto de los
// usos (paneles ABM, Notas, Exportación…) sigue con el header sin divisor
// y el padding propio (`padX`).
export default function CardHeader({
  title,
  tag,
  subtitle,
  reserveSubtitle = false,
  actions,
  padX = "px-4",
  divider = false,
  chrome = false,
  level = "card",
}: {
  title: string;
  tag?: string;
  subtitle?: React.ReactNode;
  reserveSubtitle?: boolean;
  actions?: React.ReactNode;
  padX?: string;
  divider?: boolean;
  chrome?: boolean;
  level?: "card" | "section";
}) {
  const px = chrome ? "px-(--card-px)" : padX;
  const py = divider
    ? `${chrome ? "py-(--card-header-py)" : "py-3"} border-b border-border`
    : `${chrome && level === "section" ? "pt-(--card-section-py)" : "pt-3"} pb-2`;
  return (
    <div className={`${px} ${py} shrink-0 flex items-center gap-3`}>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={`min-w-0 truncate text-text ${level === "section" ? "text-heading-sm" : "text-heading-md"}`}>{title}</span>
          {tag && <CodeBadge code={tag} />}
        </div>
        {(subtitle || reserveSubtitle) && (
          <p className="truncate text-body-sm text-text-muted" aria-hidden={subtitle ? undefined : true}>
            {subtitle || "\u00A0"}
          </p>
        )}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}
