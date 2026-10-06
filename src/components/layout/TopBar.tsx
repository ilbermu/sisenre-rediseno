import { PeriodSelector } from "@/components/ui";

// Top bar — reservado para título de pantalla + selector de período,
// transversal a toda la app salvo el ABM (que tiene su encabezado propio con
// el selector de tabla): no le agregues nada más acá. Sin breadcrumb.
// Anatomía (ver DESIGN_SYSTEM.md, "TopBar"): título h1 text-heading-md a la
// izquierda, PeriodSelector a la derecha, border-b, fondo bg-app y alto
// mínimo var(--header-min-height, 60px).
export default function TopBar({ title }: { title: string }) {
  return (
    <header
      className="flex items-center px-6 border-b border-border bg-bg-app shrink-0"
      style={{ minHeight: "var(--header-min-height, 60px)" }}
    >
      <div className="flex items-center gap-2.5 flex-1">
        <h1 className="text-heading-md text-text">{title}</h1>
      </div>
      <PeriodSelector />
    </header>
  );
}
