import { Filter, X } from "lucide-react";
import {
  BTN_MD,
  BTN_SEG_MD,
  ButtonSelectGroup,
  DateTimeField,
  ICON,
  ICON_BTN_XS,
  MOD_FIELD_CLS,
  ValuePicker,
} from "@/components/ui";
import { AbmTableConfig, CampoBusqueda } from "@/data/types";
import AbmCampo from "@/features/abm/AbmCampo";
import { labelDeValor } from "@/features/abm/labelDeValor";

// Barra de búsqueda del layout "barra" del ABM (PRUEBA, solo CDS2 — ver
// AbmLayout). Es una COPIA del filter bar de Consultas de interrupción
// (ModificarContent): mismo markup, clases, capas y comportamiento en los
// tres tiers — fila única sin contenedor apoyada en el fondo, flyout "Más
// filtros" anclado a la derecha con backdrop en --z-dismiss, chips de
// filtros aplicados y Más filtros / Limpiar / Buscar a la derecha. No
// importa nada de features/consultas-interrupcion (una feature no importa
// de otra). Diferencias con el original:
//   - los campos salen de config.barraBusqueda + config.secciones (tipo,
//     opciones, label), no de constantes propias; los del flyout se
//     renderizan con AbmCampo, así cada uno usa el control que define la
//     tabla (combobox con lista larga, toggle Sí/No…) en vez de un input;
//   - seleccionar una fila en Resultados NO deshabilita la barra.
// El estado (valores, showData, flyout abierto) vive en AbmScreen.
export default function AbmBarraBusqueda({
  config,
  valores,
  onChange,
  onLimpiarCampos,
  showData,
  onBuscar,
  onLimpiar,
  flyoutOpen,
  setFlyoutOpen,
}: {
  config: AbmTableConfig;
  valores: Record<string, string>;
  onChange: (nombre: string, v: string) => void;
  onLimpiarCampos: (nombres: string[]) => void;
  showData: boolean;
  onBuscar: () => void;
  onLimpiar: () => void;
  flyoutOpen: boolean;
  setFlyoutOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
}) {
  const barra = config.barraBusqueda!;
  const campos = config.secciones.flatMap((s) => s.filas.flat());
  const campo = (nombre: string) => campos.find((c) => c.nombre === nombre)!;
  const opciones = (c: CampoBusqueda) => (typeof c.opciones === "function" ? c.opciones(valores) : c.opciones) ?? [];
  const activos = barra.masFiltros.filter((n) => (valores[n] ?? "").trim() !== "");

  // Más filtros / Limpiar / Buscar — mismo lugar (pegados a la derecha de la
  // fila de filtros) en cualquier tamaño de ventana.
  const masFiltrosBtn = (
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
  );
  const limpiarBuscarBtns = (
    <>
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
    </>
  );

  return (
    <div className="relative shrink-0">
      <div className="relative">
        <div className="relative z-(--z-raised) flex items-center gap-2 [@media(max-height:760px)]:flex-wrap">
          {barra.principales.map(({ nombre, placeholder, ancho }) => {
            const c = campo(nombre);
            if (c.tipo === "fecha") {
              return (
                <DateTimeField
                  key={nombre}
                  value={valores[nombre] ?? ""}
                  onChange={(v) => onChange(nombre, v)}
                  muted={false}
                  className="[@media(max-height:760px)]:!w-[128px]"
                />
              );
            }
            if (c.tipo === "toggle" || c.tipo === "select" || c.tipo === "combobox") {
              // Ancho fijo vía wrapper con style (el ancho sale de la config,
              // no puede ser una clase arbitraria armada en runtime).
              return (
                <div key={nombre} className="shrink-0" style={{ width: ancho }}>
                  <ValuePicker
                    triggerStyle={c.tipo === "toggle" ? { fontWeight: valores[nombre] ? 600 : 400 } : undefined}
                    value={valores[nombre] ?? ""}
                    onChange={(v) => onChange(nombre, v)}
                    opts={opciones(c)}
                    placeholder={placeholder ?? c.label}
                    wrapClassName="w-full"
                  />
                </div>
              );
            }
            // Texto: ancho fijo (no crece a ocupar el sobrante), mono como
            // el código de interrupción de Consultas; más chico en tier
            // 760px vía el `!` important (el ancho normal es inline).
            return (
              <input
                key={nombre}
                placeholder={placeholder ?? c.placeholder}
                className={MOD_FIELD_CLS + " !text-code font-mono" + " [@media(max-height:760px)]:!w-[112px]"}
                style={{ width: ancho, flexShrink: 0 }}
                value={valores[nombre] ?? ""}
                onChange={(e) => onChange(nombre, e.target.value)}
              />
            );
          })}

          <div className="w-px h-5 bg-border shrink-0" />

          {/* Toggles (Origen/Tipo) — tamaño normal. En tier 760px pasan a
              ValuePicker (ver más abajo): ocupan menos ancho por lo que
              aportan. Muestran la etiqueta de la opción ("Interno"), guardan
              su value ("I"). Como en Consultas, se deshabilitan después de
              Buscar. */}
          <div className="contents [@media(max-height:760px)]:hidden">
            {barra.segmentados.map(({ nombre, etiqueta }) => {
              const opts = opciones(campo(nombre)).map((o) => (typeof o === "string" ? { value: o, label: o } : o));
              const sel = opts.find((o) => o.value === valores[nombre]);
              return (
                <div key={nombre} className="contents">
                  <span className="text-heading-xs uppercase text-text-muted shrink-0">{etiqueta}</span>
                  <ButtonSelectGroup
                    options={opts.map((o) => o.label)}
                    selected={sel ? [sel.label] : []}
                    onToggle={(label) => {
                      const o = opts.find((x) => x.label === label)!;
                      onChange(nombre, valores[nombre] === o.value ? "" : o.value);
                    }}
                    disabled={showData}
                    sizeCls={BTN_SEG_MD}
                  />
                </div>
              );
            })}
          </div>

          {barra.segmentados.map(({ nombre, etiqueta, anchoTier760 }) => (
            <div key={nombre} className="hidden [@media(max-height:760px)]:block shrink-0" style={{ width: anchoTier760 }}>
              <ValuePicker
                isDisabled={showData}
                value={valores[nombre] ?? ""}
                onChange={(v) => onChange(nombre, v)}
                opts={opciones(campo(nombre))}
                placeholder={etiqueta}
                wrapClassName="w-full"
              />
            </div>
          ))}

          {/* Más filtros / Limpiar / Buscar juntos, pegados a la derecha —
              mismo lugar en cualquier tamaño de ventana. */}
          <div className="ml-auto flex items-center gap-2 shrink-0">
            {masFiltrosBtn}
            {limpiarBuscarBtns}
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
            {/* mode="alta": campo editable y controlado (en "buscar" los
                inputs de texto de AbmCampo son no controlados). */}
            <div className="grid grid-cols-2 gap-x-3.5 gap-y-3">
              {barra.masFiltros.map((nombre) => (
                <AbmCampo
                  key={nombre}
                  campo={campo(nombre)}
                  mode="alta"
                  value={valores[nombre] ?? ""}
                  onChange={(v) => onChange(nombre, v)}
                  valoresFormulario={valores}
                />
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => onLimpiarCampos(barra.masFiltros)}
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
          {activos.map((nombre) => {
            const c = campo(nombre);
            return (
              <span
                key={nombre}
                className="inline-flex items-center gap-1.5 h-(--control-sm) pl-3 pr-1.5 rounded-full bg-primary-tint border border-chip-border text-secondary text-label"
              >
                {c.label}: {labelDeValor(c, valores[nombre], valores)}
                <button
                  type="button"
                  onClick={() => onChange(nombre, "")}
                  className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-chip-border-hover transition-colors"
                >
                  <svg width="8" height="8" viewBox="0 0 14 14" fill="none">
                    <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
