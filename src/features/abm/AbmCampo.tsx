import {
  BTN_SEG_MD,
  CampoEstado,
  DateTimeField,
  ESTADO_CLASES,
  FieldLabel,
  MOD_FIELD_CLS,
  ValuePicker,
} from "@/components/ui";
import { AbmMode, CampoBusqueda } from "@/data/types";

function estadoDeCampo(campo: CampoBusqueda, mode: AbmMode, consultando: boolean, lockedEnModificar: boolean): CampoEstado {
  if (consultando) return "placeholder";
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
  consultando,
  valoresFormulario,
}: {
  campo: CampoBusqueda;
  mode: AbmMode;
  value?: string;
  onChange?: (v: string) => void;
  // Campo bloqueado específicamente en modo Modificar (config por tabla),
  // independiente de si el campo es editable al buscar/insertar.
  lockedEnModificar?: boolean;
  // Hay una fila seleccionada en Resultados mientras se sigue en modo
  // buscar — el campo muestra el dato de esa fila (si lo tiene) pero
  // conserva su widget natural (select/toggle/fecha/texto), solo que en
  // estado "placeholder" (ver CampoEstado). No es lo mismo que "modificar":
  // no cambia título ni botones del panel, es una vista de consulta nomás.
  consultando?: boolean;
  // Formulario completo (todos los `valores` del panel de Búsqueda/Alta),
  // no solo el de este campo — lo necesita `campo.opciones` cuando es
  // función, para resolver opciones en cascada según otro campo (ej.
  // Localidad según Partido) sin acoplar acá el nombre de ningún campo.
  valoresFormulario?: Record<string, string>;
}) {
  const estado = estadoDeCampo(campo, mode, !!consultando, !!lockedEnModificar);
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
    return (
      <div>
        <FieldLabel>{campo.label}</FieldLabel>
        <div className="flex gap-2 mt-0.5 [@media(max-height:760px)]:w-full">
          {toggleOpts.map((opt) => {
            const active = v === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                disabled={isDisabled}
                onClick={() => onChange?.(active ? "" : opt.value)}
                // Tier 760px: la grilla plana de AbmScreen estira TODO
                // campo a w-full en su celda, toggles incluidos — de ahí el
                // flex-1 incondicional en ese breakpoint (en tamaño normal
                // sigue siendo shrink-to-fit salvo que expandirBotones lo
                // pida explícitamente).
                className={`${BTN_SEG_MD} ${campo.expandirBotones ? "flex-1" : ""} [@media(max-height:760px)]:flex-1 flex items-center justify-center border select-none transition-colors duration-(--duration-base) ${
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
        <FieldLabel>{campo.label}</FieldLabel>
        <DateTimeField value={value ?? ""} onChange={(v) => onChange?.(v)} disabled={isDisabled} muted={estado === "disabled"} fullWidth />
      </div>
    );
  }

  // "select" (pocas opciones, sin buscador) y "combobox" (con buscador;
  // modal en vez de panel inline si `listaLarga`) comparten un solo chrome
  // de trigger/panel vía ValuePicker — ver comentario en su definición.
  if (widget === "select" || widget === "combobox") {
    return (
      <ValuePicker
        label={campo.label}
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
      <FieldLabel>{campo.label}</FieldLabel>
      {/* key: ver comentario en el <select> de más arriba — mismo fix para
          el cruce uncontrolled→controlled. */}
      <input
        key={controlled ? "c" : "u"}
        disabled={isDisabled}
        className={MOD_FIELD_CLS + estadoCls}
        placeholder={campo.placeholder}
        {...(controlled ? { value: value ?? "", onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value) } : {})}
      />
    </div>
  );
}
