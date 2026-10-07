import { Filter, X } from "lucide-react";
import ButtonSelectGroup from "@/components/ui/ButtonSelectGroup";
import DateTimeField from "@/components/ui/DateTimeField";
import FieldLabel from "@/components/ui/FieldLabel";
import ValuePicker from "@/components/ui/ValuePicker";
import { BTN_MD, BTN_SEG_MD, ICON, ICON_BTN_XS, MOD_FIELD_CLS } from "@/components/ui/tokens";

// Valores de la barra de búsqueda general. Todos string; "" = sin filtro.
// Origen y Tipo van con su etiqueta ("Interno"/"Externo",
// "Forzado"/"Programado"): la pantalla traduce a su propio dato si hace
// falta.
export type FilterBarValores = {
  codigo: string;
  fecha: string;
  nivel: string;
  fase: string;
  origen: string;
  tipo: string;
  cadenaElectrica: string;
  alimentadorMT: string;
  centroTransf: string;
  codigoEquipo: string;
  descEquipo: string;
  divisionRed: string;
};

export const FILTER_BAR_VACIO: FilterBarValores = {
  codigo: "", fecha: "", nivel: "", fase: "", origen: "", tipo: "",
  cadenaElectrica: "", alimentadorMT: "", centroTransf: "", codigoEquipo: "", descEquipo: "", divisionRed: "",
};

type CampoFlyout = keyof FilterBarValores;

// Campos del flyout "Más filtros", en orden de grilla (2 columnas). Cada uno
// cuenta para el badge del botón y se muestra como chip removible debajo de
// la barra. Controles: texto libre; "combobox" = lista larga con buscador
// que se abre completa en un modal (ValuePicker `modal`); "siNo" = toggle
// Sí / No de igual ancho, sin selección = sin filtro.
const FLYOUT_FIELDS: { key: CampoFlyout; label: string; control: "texto" | "combobox" | "siNo"; placeholder?: string }[] = [
  { key: "cadenaElectrica", label: "Cadena eléctrica", control: "texto", placeholder: "NCBT" },
  { key: "alimentadorMT", label: "Alimentador MT", control: "texto", placeholder: "NCBT" },
  { key: "centroTransf", label: "Centro de transformación", control: "texto", placeholder: "52705#B1#52705-TR1#1#3" },
  { key: "codigoEquipo", label: "Código equipo", control: "texto", placeholder: "@27947890" },
  { key: "descEquipo", label: "Descripción equipo operado", control: "combobox" },
  { key: "divisionRed", label: "División red normal", control: "siNo" },
];

const FLYOUT_VACIO: Partial<FilterBarValores> = Object.fromEntries(FLYOUT_FIELDS.map((f) => [f.key, ""]));

// Barra de búsqueda general de una pantalla (ver DESIGN_SYSTEM.md,
// "FilterBar"): fila única sin contenedor apoyada en el fondo (--z-raised),
// código · fecha · Nivel · Fase | ORIGEN · TIPO, y a la derecha Más filtros
// (badge) · Limpiar · Buscar. El flyout "Más filtros" se ancla a la derecha
// (--z-dropdown) con un backdrop no bloqueante en --z-dismiss. Controlada
// desde la pantalla: valores, apertura del flyout y acciones vienen por
// props; acá no hay lógica de negocio de ninguna pantalla.
export default function FilterBar({
  valores,
  onChange,
  onBuscar,
  onLimpiar,
  buscado,
  disabled = false,
  placeholderCodigo,
  opcionesDescEquipo,
  flyoutAbierto,
  onFlyoutAbiertoChange,
}: {
  valores: FilterBarValores;
  // Recibe solo los campos que cambiaron.
  onChange: (cambios: Partial<FilterBarValores>) => void;
  onBuscar: () => void;
  onLimpiar: () => void;
  // Hay resultados en pantalla: habilita Limpiar. Nunca bloquea campos ni
  // Buscar — con resultados, la barra sirve para refinar.
  buscado: boolean;
  // Toda la fila no editable, con los valores a contraste completo. Solo
  // por un motivo propio de la pantalla (ej. Consultas mientras hay una
  // interrupción seleccionada), nunca por tener resultados.
  disabled?: boolean;
  placeholderCodigo: string;
  // Lista de "Descripción equipo operado" (dato de dominio, lo pasa la
  // pantalla).
  opcionesDescEquipo: string[];
  // El flyout se controla afuera: la pantalla atenúa su contenido mientras
  // está abierto.
  flyoutAbierto: boolean;
  onFlyoutAbiertoChange: (abierto: boolean) => void;
}) {
  const activos = FLYOUT_FIELDS.filter((f) => valores[f.key].trim() !== "");
  const fijoCls = disabled ? " !bg-fill-subtle !text-text" : "";
  // Enter en un input de la barra o del flyout busca (en el flyout, como
  // Aplicar: cierra y busca).
  const buscarConEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onBuscar();
  };
  const aplicar = () => {
    onFlyoutAbiertoChange(false);
    onBuscar();
  };
  const alternar = (campo: "origen" | "tipo", opt: string) => onChange({ [campo]: valores[campo] === opt ? "" : opt });

  return (
    <div className="relative shrink-0">
      <div className="relative">
        <div className="relative z-(--z-raised) flex items-center gap-2 [@media(max-height:760px)]:flex-wrap">
          {/* Ancho fijo (no crece a ocupar el sobrante) para que se vea
              proporcionado contra Nivel/Fase — 190px en tamaño normal,
              bastante más chico en tier 760px vía el `!` important de
              abajo (el ancho normal es inline, gana a una clase sin
              important). */}
          <input
            disabled={disabled}
            placeholder={placeholderCodigo}
            className={MOD_FIELD_CLS + " !text-code font-mono" + fijoCls + " [@media(max-height:760px)]:!w-[112px]"}
            style={{ width: 190, flexShrink: 0 }}
            value={valores.codigo}
            onChange={(e) => onChange({ codigo: e.target.value })}
            onKeyDown={buscarConEnter}
          />

          <DateTimeField
            value={valores.fecha}
            onChange={(v) => onChange({ fecha: v })}
            disabled={disabled}
            muted={false}
            className="[@media(max-height:760px)]:!w-[128px]"
          />

          <ValuePicker
            isDisabled={disabled}
            triggerExtraClassName={fijoCls}
            triggerStyle={{ fontWeight: valores.nivel ? 600 : 400 }}
            value={valores.nivel}
            onChange={(v) => onChange({ nivel: v })}
            opts={["BT", "MT", "AT"]}
            placeholder="Nivel"
            wrapClassName="w-[88px] shrink-0"
          />

          <ValuePicker
            isDisabled={disabled}
            triggerExtraClassName={fijoCls}
            value={valores.fase}
            onChange={(v) => onChange({ fase: v })}
            opts={["R", "S", "T", "RS", "RT", "ST", "RST"]}
            placeholder="Fase"
            wrapClassName="w-[84px] shrink-0"
          />

          <div className="w-px h-5 bg-border shrink-0" />

          {/* Toggle Origen/Tipo — tamaño normal. En tier 760px pasan a
              dropdown (ver más abajo): ocupan menos ancho por lo que
              aportan, justo lo que le faltaba a esta fila. */}
          <div className="contents [@media(max-height:760px)]:hidden">
            <span className="text-heading-xs uppercase text-text-muted shrink-0">Origen</span>
            <ButtonSelectGroup
              options={["Interno", "Externo"]}
              selected={valores.origen ? [valores.origen] : []}
              onToggle={(opt) => alternar("origen", opt)}
              disabled={disabled}
              sizeCls={BTN_SEG_MD}
            />

            <span className="text-heading-xs uppercase text-text-muted shrink-0">Tipo</span>
            <ButtonSelectGroup
              options={["Forzado", "Programado"]}
              selected={valores.tipo ? [valores.tipo] : []}
              onToggle={(opt) => alternar("tipo", opt)}
              disabled={disabled}
              sizeCls={BTN_SEG_MD}
            />
          </div>

          <ValuePicker
            isDisabled={disabled}
            value={valores.origen}
            onChange={(v) => onChange({ origen: v })}
            opts={["Interno", "Externo"]}
            placeholder="Origen"
            wrapClassName="hidden [@media(max-height:760px)]:block w-[92px] shrink-0"
          />

          <ValuePicker
            isDisabled={disabled}
            value={valores.tipo}
            onChange={(v) => onChange({ tipo: v })}
            opts={["Forzado", "Programado"]}
            placeholder="Tipo"
            wrapClassName="hidden [@media(max-height:760px)]:block w-[112px] shrink-0"
          />

          {/* Más filtros / Limpiar / Buscar juntos, pegados a la derecha —
              mismo lugar en cualquier tamaño de ventana. Buscar (primario)
              último. */}
          <div className="ml-auto flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onFlyoutAbiertoChange(!flyoutAbierto)}
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
              disabled={!buscado}
              className={`${BTN_MD} border border-border-strong bg-surface text-text hover:bg-primary-tint hover:border-primary hover:text-secondary transition-[color,background-color,border-color,transform] duration-(--duration-base) active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none`}
            >Limpiar</button>
            <button
              type="button"
              onClick={onBuscar}
              className={`${BTN_MD} text-white transition-[color,background-color,border-color,transform] duration-(--duration-base) active:scale-[0.99] bg-primary-strong hover:bg-primary-hover`}
            >Buscar</button>
          </div>
        </div>

        {/* Backdrop — no bloqueante, sólo cierra el flyout al click afuera.
            Debajo de la barra (--z-dismiss < --z-raised): con el flyout
            abierto los controles de la barra siguen siendo clickeables.
            Vive junto al flyout (no en el wrapper externo que también
            contiene los chips) para que su posición no dependa de si hay o
            no una fila de chips debajo. */}
        {flyoutAbierto && (
          <div className="fixed inset-0 z-(--z-dismiss)" onClick={() => onFlyoutAbiertoChange(false)} />
        )}

        {/* Flyout "Más filtros" */}
        {flyoutAbierto && (
          <div
            className="shadow-md absolute right-0 z-(--z-dropdown) bg-surface border border-border rounded-md p-4"
            style={{ top: "calc(100% + 6px)", width: 520 }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-heading-sm text-text">Más filtros</span>
              <button
                type="button"
                onClick={() => onFlyoutAbiertoChange(false)}
                className={`${ICON_BTN_XS} flex items-center justify-center rounded-sm text-icon hover:bg-fill-muted hover:text-text transition-colors`}
              >
                <X size={ICON.sm} strokeWidth={1.5} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-x-3.5 gap-y-3">
              {FLYOUT_FIELDS.map((f) =>
                f.control === "combobox" ? (
                  <ValuePicker
                    key={f.key}
                    label={f.label}
                    modalTitle={f.label}
                    opts={opcionesDescEquipo}
                    value={valores[f.key]}
                    onChange={(v) => onChange({ [f.key]: v })}
                    searchable
                    modal
                  />
                ) : f.control === "siNo" ? (
                  <div key={f.key}>
                    <FieldLabel>{f.label}</FieldLabel>
                    <ButtonSelectGroup
                      options={["Sí", "No"]}
                      selected={valores[f.key] ? [valores[f.key]] : []}
                      onToggle={(opt) => onChange({ [f.key]: valores[f.key] === opt ? "" : opt })}
                      sizeCls={BTN_SEG_MD}
                      ariaLabel={f.label}
                    />
                  </div>
                ) : (
                  <div key={f.key}>
                    <FieldLabel>{f.label}</FieldLabel>
                    <input
                      placeholder={f.placeholder}
                      value={valores[f.key]}
                      onChange={(e) => onChange({ [f.key]: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && aplicar()}
                      className={MOD_FIELD_CLS}
                    />
                  </div>
                ),
              )}
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => onChange(FLYOUT_VACIO)}
                className="text-label text-secondary hover:underline"
              >
                Limpiar filtros
              </button>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => onFlyoutAbiertoChange(false)}
                  className={`${BTN_MD} border border-border-strong bg-surface text-text hover:bg-fill-muted transition-colors`}
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={aplicar}
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
          {activos.map((f) => (
            <span
              key={f.key}
              className="inline-flex items-center gap-1.5 h-(--control-sm) pl-3 pr-1.5 rounded-full bg-primary-tint border border-chip-border text-secondary text-label"
            >
              {f.label}: {valores[f.key]}
              <button
                type="button"
                onClick={() => onChange({ [f.key]: "" })}
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
