import { PeriodSelector } from "@/components/ui";

// Top bar — reservado para título de pantalla + selector de período,
// transversal a TODAS las pantallas (también el ABM): no le agregues nada
// más acá. Sin breadcrumb. El título es la sección del menú.
// Anatomía (ver DESIGN_SYSTEM.md, "TopBar"): título h1 text-heading-md a la
// izquierda, PeriodSelector a la derecha, border-b, fondo bg-app y alto
// mínimo var(--header-min-height, 60px).
// `periodo` / `onPeriodoChange`: PeriodSelector controlado, para la pantalla
// que necesita el período (ABM: atajo "Período completo" de la barra de
// filtros). Sin ellos, el PeriodSelector tiene estado propio. El aspecto es
// el mismo en los dos casos.
export default function TopBar({
  title,
  periodo,
  onPeriodoChange,
}: {
  title: string;
  periodo?: string;
  onPeriodoChange?: (periodo: string) => void;
}) {
  return (
    <header
      className="flex items-center px-6 border-b border-border bg-bg-app shrink-0"
      style={{ minHeight: "var(--header-min-height, 60px)" }}
    >
      <div className="flex items-center gap-2.5 flex-1">
        <h1 className="text-heading-md text-text">{title}</h1>
      </div>
      <PeriodSelector value={periodo} onChange={onPeriodoChange} />
    </header>
  );
}
