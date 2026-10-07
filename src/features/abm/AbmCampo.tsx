import { Lock } from "lucide-react";
import {
  BTN_SEG_MD,
  CampoEstado,
  DateTimeField,
  ESTADO_CLASES,
  FieldLabel,
  ICON,
  MOD_FIELD_CLS,
  READONLY_FIELD_CLS,
  SegmentadoSoloLectura,
  ValuePicker,
} from "@/components/ui";
import { labelDeValor } from "@/features/abm/labelDeValor";
import { AbmMode, CampoBusqueda } from "@/data/types";

function estadoDeCampo(campo: CampoBusqueda, mode: AbmMode, lockedEnModificar: boolean): CampoEstado {
  if (mode === "modificar" && (campo.tipo === "readonly" || lockedEnModificar)) return "disabled";
  if (mode === "buscar") return "empty";
  return "enabled"; // alta, o modificar sobre un campo editable
}

// Un campo de camposBusqueda → el input correspondiente, en el estado visual
// (CampoEstado) que corresponda. Todos los tipos (select/toggle/fecha/texto,
// readonly de config incluido) pasan por el mismo mecanismo: sin excepciones
// hardcodeadas por tipo o por tabla.
export default function AbmCampo({
  campo,
  mode,
  value,
  onChange,
  lockedEnModificar,
  valoresFormulario,
  readOnly = false,
  intrinseco = false,
  labelExterno,
}: {
  campo: CampoBusqueda;
  mode: AbmMode;
  value?: string;
  onChange?: (v: string) => void;
  // Campo bloqueado específicamente en modo Modificar (config por tabla),
  // independiente de si el campo es editable al buscar/insertar.
  lockedEnModificar?: boolean;
  // Formulario completo (todos los `valores` del panel de Búsqueda/Alta),
  // no solo el de este campo — lo necesita `campo.opciones` cuando es
  // función, para resolver opciones en cascada según otro campo (ej.
  // Localidad según Partido) sin acoplar acá el nombre de ningún campo.
  valoresFormulario?: Record<string, string>;
  // Dato fijo (solo lectura), distinto de disabled (ver DESIGN_SYSTEM.md,
  // "Estados: editable, solo lectura, deshabilitado"): un toggle muestra sus
  // como SegmentadoSoloLectura, sin hover y sin responder a clic ni
  // teclado, con un candado junto al label; cualquier otro tipo de campo,
  // como campo de solo lectura (READONLY_FIELD_CLS). Lo usa el modal de
  // edición de registro.
  readOnly?: boolean;
  // Toggle a su ancho intrínseco en cualquier tier (sin el estiramiento del
  // tier 760px que necesita la grilla plana del panel de Búsqueda) — para
  // la grilla del modal de edición de registro.
  intrinseco?: boolean;
  // El label vive afuera (FormRow: label al costado, no arriba): AbmCampo
  // renderiza solo el control, sin FieldLabel ni candado, con `controlId`
  // como id del control (para el <label htmlFor>) y `labelId` para
  // aria-labelledby en los grupos de toggles. El popover de fecha se
  // alinea al borde derecho (el control está pegado a la derecha).
  labelExterno?: { controlId: string; labelId: string };
}) {
  if (readOnly && campo.tipo !== "toggle") {
    // Estado de solo lectura (READONLY_FIELD_CLS): <input readOnly>, el
    // valor se puede seleccionar y copiar.
    const legible = labelDeValor(campo, value ?? "", valoresFormulario ?? {});
    const campoSoloLectura = <input id={labelExterno?.controlId} readOnly value={legible} className={READONLY_FIELD_CLS} />;
    if (labelExterno) return campoSoloLectura;
    return (
      <div>
        <FieldLabel>{campo.label}</FieldLabel>
        {campoSoloLectura}
      </div>
    );
  }
  const estado = estadoDeCampo(campo, mode, !!lockedEnModificar);
  const isDisabled = estado === "placeholder" || estado === "disabled";
  const controlled = estado !== "empty";
  const estadoCls = ESTADO_CLASES[estado];
  // "readonly" (config) es un valor derivado/no tipeable por su cuenta, no
  // un widget propio — en estado "empty"/"enabled" (alta) se ve y escribe
  // como cualquier campo de texto.
  const widget = campo.tipo === "readonly" ? "texto" : campo.tipo;
  const opts = (typeof campo.opciones === "function" ? campo.opciones(valoresFormulario ?? {}) : campo.opciones) ?? [];

  if (widget === "toggle") {
    // Igual que "select": opciones string simple (value===label) u
    // objeto {value,label} — el dato real del campo es siempre `value`,
    // el botón muestra `label`.
    const toggleOpts = opts.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
    const v = value ?? "";
    if (readOnly) {
      // Solo lectura: segmentado estático (una caja, sin forma de botón).
      return (
        <div>
          {!labelExterno && (
            <FieldLabel>
              <span className="inline-flex items-center gap-1">
                {campo.label}
                <span title="No editable" aria-label="No editable" role="img" className="text-icon inline-flex">
                  <Lock size={ICON.xs} strokeWidth={1.5} aria-hidden />
                </span>
              </span>
            </FieldLabel>
          )}
          <SegmentadoSoloLectura opciones={toggleOpts} valor={v} ariaLabel={campo.label} id={labelExterno?.controlId} />
        </div>
      );
    }
    return (
      <div>
        {!labelExterno && <FieldLabel>{campo.label}</FieldLabel>}
        <div
          id={labelExterno?.controlId}
          role={labelExterno ? "group" : undefined}
          aria-labelledby={labelExterno?.labelId}
          // Igual ancho: todas las opciones miden lo que la más larga
          // (inline-grid auto-cols-fr + botones w-full). Con
          // expandirBotones, o en la grilla plana del tier 760px, el grupo
          // ocupa todo el ancho de su celda (grid w-full) y las opciones se
          // reparten parejo.
          className={`${campo.expandirBotones && !intrinseco ? "grid w-full" : "inline-grid"} grid-flow-col auto-cols-fr gap-2 ${labelExterno ? "" : "mt-0.5"} ${intrinseco ? "" : "[@media(max-height:760px)]:grid [@media(max-height:760px)]:w-full"}`}
        >
          {toggleOpts.map((opt) => {
            const active = v === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                disabled={isDisabled}
                onClick={() => onChange?.(active ? "" : opt.value)}
                // w-full: llena su columna del grid del grupo (todas las
                // columnas miden lo mismo, ver el contenedor).
                className={`${BTN_SEG_MD} w-full flex items-center justify-center border select-none transition-colors duration-(--duration-base) ${
                  estado === "disabled" ? "cursor-not-allowed opacity-60" : isDisabled ? "cursor-default" : "cursor-pointer"
                } ${
                  active
                    ? "border-primary bg-primary-tint text-secondary"
                    : `border-border-strong bg-surface text-text ${isDisabled ? "" : "hover:border-primary hover:bg-primary-tint hover:text-secondary"}`
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (widget === "fecha") {
    return (
      <div>
        {!labelExterno && <FieldLabel>{campo.label}</FieldLabel>}
        <DateTimeField
          value={value ?? ""}
          onChange={(v) => onChange?.(v)}
          disabled={isDisabled}
          muted={estado === "disabled"}
          fullWidth
          id={labelExterno?.controlId}
          alinearPanel={labelExterno ? "right" : "left"}
        />
      </div>
    );
  }

  // "select" (pocas opciones, sin buscador) y "combobox" (con buscador;
  // modal en vez de panel inline si `listaLarga`) comparten un solo chrome
  // de trigger/panel vía ValuePicker — ver comentario en su definición.
  if (widget === "select" || widget === "combobox") {
    return (
      <ValuePicker
        label={labelExterno ? undefined : campo.label}
        modalTitle={campo.label}
        triggerId={labelExterno?.controlId}
        opts={opts}
        value={value ?? ""}
        onChange={onChange}
        isDisabled={isDisabled}
        estadoCls={estadoCls}
        searchable={widget === "combobox" || !!campo.listaLarga}
        modal={!!campo.listaLarga}
        emptyMessage={campo.emptyMessage}
      />
    );
  }

  // texto (incluye los campos "readonly" de config)
  return (
    <div>
      {!labelExterno && <FieldLabel>{campo.label}</FieldLabel>}
      {/* key: ver comentario en el <select> de más arriba — mismo fix para
          el cruce uncontrolled→controlled. */}
      <input
        key={controlled ? "c" : "u"}
        id={labelExterno?.controlId}
        disabled={isDisabled}
        className={MOD_FIELD_CLS + estadoCls}
        placeholder={campo.placeholder}
        {...(controlled ? { value: value ?? "", onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value) } : {})}
      />
    </div>
  );
}
