import { Filter, X } from "lucide-react";
import { BTN_MD, ICON, ICON_BTN_XS } from "@/components/ui";
import { AbmMode, AbmTableConfig } from "@/data/types";
import AbmCampo from "@/features/abm/AbmCampo";
import { labelDeValor } from "@/features/abm/labelDeValor";

// Barra de búsqueda del layout "barra" del ABM (PRUEBA, solo CDS2 — ver
// AbmLayout). Del filter bar de Consultas de interrupción se copia SOLO el
// FORMATO: fila única sin contenedor apoyada en el fondo (--z-raised),
// botón "Más filtros" con badge + flyout anclado a la derecha
// (--z-dropdown) con backdrop en --z-dismiss, chips de filtros aplicados, y
// Limpiar + Buscar a la derecha (Buscar, primario, último). No importa nada
// de features/consultas-interrupcion (una feature no importa de otra).
// Los CAMPOS son siempre los de la tabla: cada uno se renderiza con
// AbmCampo — mismo label (FieldLabel arriba), control, opciones,
// placeholder y estado (`valores` / `setValor` de AbmScreen) que en el
// panel de Búsqueda del layout "split". Las secciones de
// config.barraBusqueda.seccionesBarra van en la fila; las de
// seccionesMasFiltros, en el flyout. Diferencias con el panel split:
//   - `controlado`: los inputs de texto son controlados también en modo
//     buscar (el badge y los chips cuentan valores; Limpiar los vacía);
//   - seleccionar una fila en Resultados no la deshabilita ni le vuelca
//     datos (no hay estado "consultando").
export default function AbmBarraBusqueda({
  config,
  mode,
  valores,
  setValor,
  camposLocked,
  showData,
  onBuscar,
  onLimpiar,
  flyoutOpen,
  setFlyoutOpen,
}: {
  config: AbmTableConfig;
  mode: AbmMode;
  valores: Record<string, string>;
  setValor: (nombre: string, v: string) => void;
  camposLocked: string[];
  showData: boolean;
  onBuscar: () => void;
  onLimpiar: () => void;
  flyoutOpen: boolean;
  setFlyoutOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
}) {
  const barra = config.barraBusqueda!;
  const camposDe = (titulos: string[]) =>
    config.secciones.filter((s) => titulos.includes(s.titulo)).flatMap((s) => s.filas.flat());
  const camposBarra = camposDe(barra.seccionesBarra);
  const camposMasFiltros = camposDe(barra.seccionesMasFiltros);
  const activos = camposMasFiltros.filter((c) => (valores[c.nombre] ?? "").trim() !== "");

  const campo = (c: (typeof camposBarra)[number]) => (
    <AbmCampo
      campo={c}
      mode={mode}
      value={valores[c.nombre]}
      onChange={(v) => setValor(c.nombre, v)}
      lockedEnModificar={camposLocked.includes(c.nombre)}
      consultando={false}
      valoresFormulario={valores}
      controlado
    />
  );

  return (
    <div className="relative shrink-0">
      <div className="relative">
        {/* items-end: los controles (y Más filtros / Limpiar / Buscar)
            quedan alineados por su base, debajo de los labels. Tier 760px:
            la fila hace wrap. */}
        <div className="relative z-(--z-raised) flex items-end gap-3 [@media(max-height:760px)]:flex-wrap">
          {camposBarra.map((c) => (
            // Ancho fijo acorde al contenido (config.barraBusqueda.anchos);
            // sin ancho, el del contenido (toggles: el de sus opciones).
            <div
              key={c.nombre}
              className={`shrink-0 ${barra.anchos[c.nombre] ? "" : "w-fit"}`}
              style={barra.anchos[c.nombre] ? { width: barra.anchos[c.nombre] } : undefined}
            >
              {campo(c)}
            </div>
          ))}

          {/* Más filtros / Limpiar / Buscar juntos, pegados a la derecha —
              mismo lugar en cualquier tamaño de ventana. */}
          <div className="ml-auto flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setFlyoutOpen((v) => !v)}
              className={`${BTN_MD} border flex items-center gap-1.5 transition-colors duration-(--duration-base) ${
                activos.length > 0
                  ? "bg-primary-tint border-primary text-secondary"
                  : "bg-surface border-border-strong text-text hover:bg-primary-tint hover:border-primary hover:text-secondary"
              }`}
            >
              <Filter size={ICON.sm} strokeWidth={1.5} />
              Más filtros
              {activos.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-primary-strong text-white text-caption flex items-center justify-center">
                  {activos.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={onLimpiar}
              disabled={!showData}
              className={`${BTN_MD} border border-border-strong bg-surface text-text hover:bg-primary-tint hover:border-primary hover:text-secondary transition-[color,background-color,border-color,transform] duration-(--duration-base) active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none`}
            >Limpiar</button>
            <button
              type="button"
              onClick={onBuscar}
              disabled={showData}
              className={`${BTN_MD} text-white transition-[color,background-color,border-color,transform] duration-(--duration-base) active:scale-[0.99] bg-primary-strong hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none`}
            >Buscar</button>
          </div>
        </div>

        {/* Backdrop — no bloqueante, sólo cierra el flyout al click afuera.
            Debajo del filter bar (--z-dismiss < --z-raised): con el flyout
            abierto los controles de la barra siguen siendo clickeables. */}
        {flyoutOpen && (
          <div className="fixed inset-0 z-(--z-dismiss)" onClick={() => setFlyoutOpen(false)} />
        )}

        {/* Flyout "Más filtros" */}
        {flyoutOpen && (
          <div
            className="shadow-md absolute right-0 z-(--z-dropdown) bg-surface border border-border rounded-md p-4"
            style={{ top: "calc(100% + 6px)", width: 520 }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-heading-sm text-text">Más filtros</span>
              <button
                type="button"
                onClick={() => setFlyoutOpen(false)}
                className={`${ICON_BTN_XS} flex items-center justify-center rounded-sm text-icon hover:bg-fill-muted hover:text-text transition-colors`}
              >
                <X size={ICON.sm} strokeWidth={1.5} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-x-3.5 gap-y-3 items-end">
              {camposMasFiltros.map((c) => (
                <div key={c.nombre}>{campo(c)}</div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => camposMasFiltros.forEach((c) => setValor(c.nombre, ""))}
                className="text-label text-secondary hover:underline"
              >
                Limpiar filtros
              </button>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setFlyoutOpen(false)}
                  className={`${BTN_MD} border border-border-strong bg-surface text-text hover:bg-fill-muted transition-colors`}
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={() => setFlyoutOpen(false)}
                  className={`${BTN_MD} text-white bg-primary-strong hover:bg-primary-hover transition-colors`}
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chips de filtros aplicados (flyout) — franja propia, no texto suelto */}
      {activos.length > 0 && (
        <div className="flex items-center flex-wrap gap-2 mt-4 px-3 py-2 rounded-sm border border-border bg-fill-subtle">
          <span className="text-heading-xs uppercase text-text-muted shrink-0">
            Filtros aplicados:
          </span>
          {activos.map((c) => (
            <span
              key={c.nombre}
              className="inline-flex items-center gap-1.5 h-(--control-sm) pl-3 pr-1.5 rounded-full bg-primary-tint border border-chip-border text-secondary text-label"
            >
              {c.label}: {labelDeValor(c, valores[c.nombre], valores)}
              <button
                type="button"
                onClick={() => setValor(c.nombre, "")}
                className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-chip-border-hover transition-colors"
              >
                <svg width="8" height="8" viewBox="0 0 14 14" fill="none">
                  <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
