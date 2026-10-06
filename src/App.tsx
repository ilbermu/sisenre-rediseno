import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  ChevronLeft, ChevronRight, ChevronDown, FileText, Pencil, Clipboard, UserPlus, Shield, Search,
  Inbox, Plus, Download, ChevronsUp, ChevronsDown, Home, Wrench,
} from "lucide-react";
import Logo from "@/imports/Logo/index";
import { NavItem } from "@/components/layout/NavItem";
import { UserMenu } from "@/components/layout/UserMenu";
import {
  actionBtnCls,
  ActionItem,
  BTN_SEG_MD,
  BTN_SM,
  ButtonSelectGroup,
  CampoEstado,
  CardHeader,
  DateTimeField,
  dropdownAnchorStyle,
  ESTADO_CLASES,
  FIELD_FOCUS,
  FieldLabel,
  FOCUS_RING,
  FOCUS_RING_INSET,
  ICON,
  ICON_BTN_SM,
  MOD_FIELD_CLS,
  MOD_SELECT_CLS,
  Modal,
  ModalCheckbox,
  modalDestructiveBtnCls,
  modalNeutralBtnCls,
  modalPrimaryBtnCls,
  PeriodSelector,
  rowActionBtnCls,
  SectionDivider,
  SelectionActionBar,
  SelectWrap,
  SortableHeaderCell,
  TableToolbar,
  useDropdownDirection,
  useTableToolbar,
  ValuePicker,
} from "@/components/ui";
import { ABM_TABLE_CONFIGS, ABM_TABLE_ORDER, isAbmTableKey } from "@/data/abmTables";
import { ABM_ITEMS, NOTA_OPCIONES, PERIODS } from "@/data/dominio";
import { NOTAS_INICIALES, USUARIOS_SISENRE_DEMO } from "@/data/mocks";
import { crearRng, hashSemilla } from "@/data/rng";
import { generarConsolidacionSintetica } from "@/data/sinteticos";
import { AbmDeepLink, AbmMode, AbmTableKey, CampoBusqueda, CampoTipo, Screen } from "@/data/types";
import { ModificarContent } from "@/features/consultas-interrupcion/ModificarContent";
import { LotesModal } from "@/features/herramientas/LotesModal";
import { WelcomeContent } from "@/features/inicio/WelcomeContent";
import { LoginScreen } from "@/features/login/LoginScreen";
import { SelectScreen } from "@/features/login/SelectScreen";
import { formatFechaHora, formatNumero } from "@/lib/format";
import { useMatchMedia } from "@/lib/useMatchMedia";

const OTROS_ITEMS: { label: string; icon: React.ReactNode; screen: Screen }[] = [
  { label: "Generación de txt",    icon: <FileText size={ICON.md} strokeWidth={1.5} />,      screen: "generaciontxt" },
  { label: "Planilla consolidada", icon: <Clipboard size={ICON.md} strokeWidth={1.5} />, screen: "planillaconsolidada" },
  { label: "Gestor de notas",      icon: <Pencil size={ICON.md} strokeWidth={1.5} />,      screen: "gestornotas" },
  { label: "Inserta clientes",     icon: <UserPlus size={ICON.md} strokeWidth={1.5} />,  screen: "insertaclientes" },
  { label: "Auditoría",            icon: <Shield size={ICON.md} strokeWidth={1.5} />,    screen: "auditoria" },
];

// Grupo "Herramientas" del sidebar — las acciones que antes vivían en la
// fila de botones de Consultas de interrupción, en el mismo orden. `key`
// identifica qué abre cada ítem en App. Solo Lotes está conectado: el resto
// depende de la interrupción seleccionada en Consultas de interrupción (el
// modal recibe su referencia y/o el botón se habilitaba recién con una
// selección), así que queda deshabilitado hasta definir cómo resolverlo
// desde el menú.
type HerramientaKey = "desarmes" | "lotes" | "niveltipo" | "replicar" | "cambiafases" | "altaclientes" | "intercambio";
const HERRAMIENTAS_ITEMS: { key: HerramientaKey; label: string; pendiente?: boolean }[] = [
  { key: "desarmes",     label: "Desarmes",      pendiente: true },
  { key: "lotes",        label: "Lotes" },
  { key: "niveltipo",    label: "Nivel/Tipo",    pendiente: true },
  { key: "replicar",     label: "Replicar",      pendiente: true },
  { key: "cambiafases",  label: "Cambia fases",  pendiente: true },
  { key: "altaclientes", label: "Alta clientes", pendiente: true },
  { key: "intercambio",  label: "Intercambio",   pendiente: true },
];

function exportRowsToCsv(filename: string, headers: string[], rows: string[][]) {
  const escape = (v: string) => (/[",\n;]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  const csv = "﻿" + [headers, ...rows].map((r) => r.map(escape).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Modal: Confirmar borrado ───────────────────────────────────────────────
// Confirmación antes de eliminar un registro de una tabla ABM — mismo Modal
// compartido, tamaño "sm". Botón primario en color de error (no el azul de
// acciones normales) con el verbo de la acción ("Eliminar"), nunca "Sí/No" —
// así el compromiso queda claro sin releer la pregunta.
function ConfirmarBorrarModal({
  open,
  registro,
  tabla,
  onCancelar,
  onConfirmar,
}: {
  open: boolean;
  registro: string;
  // Nomenclatura de la tabla ABM activa tal como la conoce el usuario
  // ("Tabla 2".."Tabla 9 NM", ver ABM_ITEMS) — no el nombre descriptivo de
  // config.titulo ("Interrupciones", etc.), que es una etiqueta interna.
  tabla: string;
  onCancelar: () => void;
  onConfirmar: () => void;
}) {
  return (
    <Modal
      title="¿Eliminar el registro?"
      open={open}
      onClose={onCancelar}
      size="sm"
      footer={
        <>
          <button type="button" onClick={onCancelar} className={modalNeutralBtnCls}>Cancelar</button>
          <button type="button" onClick={onConfirmar} className={modalDestructiveBtnCls}>Eliminar</button>
        </>
      }
    >
      <p className="text-body text-text">
        Se eliminará el registro{" "}
        <span className="text-code font-medium text-text tabular-nums font-mono">
          {registro}
        </span>
        {" "}de <span className="font-medium text-text">{tabla}</span>. Esta acción no se puede deshacer.
      </p>
    </Modal>
  );
}

function ConfirmarModificarModal({
  open,
  cambios,
  onCancelar,
  onConfirmar,
}: {
  open: boolean;
  cambios: { label: string; anterior: string; nuevo: string }[];
  onCancelar: () => void;
  onConfirmar: (nota: string) => void;
}) {
  const [nota, setNota] = useState("");
  const [notaManual, setNotaManual] = useState("");
  const esManual = nota === "__manual__";
  const notaFinal = (esManual ? notaManual : nota).trim();
  const seleccionBoton = esManual ? "Otra (especificar)" : nota;

  // Reset cada vez que se abre — para que la próxima vez no arranque con la
  // nota de la edición anterior ya seleccionada.
  useEffect(() => {
    if (open) { setNota(""); setNotaManual(""); }
  }, [open]);

  return (
    <Modal
      title="Justificá el cambio antes de guardar"
      open={open}
      onClose={onCancelar}
      size="lg"
      footer={
        <>
          <button type="button" onClick={onCancelar} className={modalNeutralBtnCls}>Cancelar</button>
          <button
            type="button"
            onClick={() => onConfirmar(notaFinal)}
            disabled={!notaFinal}
            className={modalPrimaryBtnCls}
          >
            Guardar
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-heading-xs uppercase text-text-muted mb-3">Resumen de cambios</p>
          {cambios.length === 0 ? (
            <p className="text-body-sm text-text-muted">No se detectaron cambios respecto al registro original.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {cambios.map((c) => (
                <div key={c.label} className="flex items-center gap-3 px-3 py-2 rounded-sm bg-fill-subtle border border-border">
                  <span className="w-[38%] shrink-0 text-label text-text">{c.label}</span>
                  <span className="flex-1 min-w-0 text-body-sm text-text-muted line-through truncate">{c.anterior || "(vacío)"}</span>
                  <span className="shrink-0 text-text-faint">→</span>
                  <span className="flex-1 min-w-0 text-label text-text truncate">{c.nuevo || "(vacío)"}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-md border border-primary bg-primary-tint p-4">
          <p className="text-heading-xs uppercase text-secondary mb-1">Motivo</p>
          <p className="text-body-sm text-text-muted mb-3">
            Seleccioná una nota o ingresá una manual para justificar este cambio.
          </p>
          <ButtonSelectGroup
            options={NOTA_OPCIONES}
            selected={seleccionBoton ? [seleccionBoton] : []}
            onToggle={(opt) => setNota(opt === "Otra (especificar)" ? "__manual__" : opt)}
          />
          {esManual && (
            <input
              autoFocus
              value={notaManual}
              onChange={(e) => setNotaManual(e.target.value)}
              placeholder="Escribí el motivo de la modificación"
              className={`mt-2 w-full h-(--control-md) px-2.5 text-body bg-surface border border-border-strong rounded-sm text-text placeholder:text-text-muted ${FIELD_FOCUS}`}
            />
          )}
        </div>
      </div>
    </Modal>
  );
}

// Barra de acciones persistente — a diferencia de SelectionActionBar
// (que solo aparece con una fila seleccionada),
// esta vive siempre en pantalla. Cada acción decide su propio estado
// habilitado/deshabilitado via `disabled` en vez de depender de que la
// barra entera aparezca/desaparezca — mismo criterio que separa "+Insertar"
// (siempre disponible) de Auditoría/Modificar/Borrar (dependen de
// selección) en el motor ABM. Los botones van a ancho natural (no se
// estiran), alineados a la izquierda; un divisor vertical separa las
// acciones siempre habilitadas (Desarmes, Lotes) del resto, que dependen
// de tener una interrupción seleccionada — para que esa diferencia de
// lógica se note de un vistazo.
function PersistentActionsBar({
  siempreHabilitadas,
  condicionales,
}: {
  siempreHabilitadas: ActionItem[];
  condicionales: ActionItem[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  const direction = useDropdownDirection(ref, open, 300);

  function Boton(a: ActionItem) {
    return (
      <button
        key={a.label}
        onClick={a.onClick}
        disabled={a.disabled}
        className={actionBtnCls(a.variant) + " shrink-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"}
      >
        {a.label}
      </button>
    );
  }

  function ItemMenu(a: ActionItem) {
    return (
      <button
        key={a.label}
        type="button"
        disabled={a.disabled}
        onClick={() => { a.onClick?.(); setOpen(false); }}
        className={`w-full flex items-center px-2.5 py-2 rounded-sm text-left text-body transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none ${
          a.variant === "destructive" ? "text-error hover:text-error-text-strong hover:bg-error-bg-subtle" : "text-text hover:bg-fill-muted"
        }`}
      >
        {a.label}
      </button>
    );
  }

  // El trigger+panel de tier 760px no vive acá abajo — se porta junto al
  // buscador de la tabla "Interrupciones" (ver slot "acciones-tier2-slot",
  // dentro de ModificarContent) — no al header de esa card, ni al de
  // "Búsqueda", ni a la barra de título principal (esa es solo título +
  // selector de período en toda la app). Esto elimina la fila/card entera
  // de PersistentActionsBar en ese breakpoint en vez de solo vaciarla de
  // contenido.
  //
  // El elemento con ese id vive en uno de dos renders condicionales según
  // haya o no resultados (el buscador de tabla solo existe con datos
  // cargados) — por eso `portalNode` se re-resuelve en CADA render (sin
  // dependencias) en vez de una sola vez al montar: cuando cambia esa
  // condición, React desmonta el div viejo y monta uno nuevo con el mismo
  // id, y el efecto necesita volver a buscarlo o el portal quedaría
  // apuntando a un nodo ya removido del DOM.
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setPortalNode(document.getElementById("acciones-tier2-slot"));
  });

  const dropdown = (
    <div ref={ref} className="hidden [@media(max-height:760px)]:block relative mr-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={actionBtnCls("neutral") + " inline-flex items-center gap-1.5"}
      >
        Acciones
        <span className={`transition-transform duration-(--duration-base) ${open ? "rotate-180" : ""}`}><ChevronDown size={ICON.md} strokeWidth={1.5} /></span>
      </button>
      {open && (
        <div
          className="shadow-md absolute left-0 w-56 bg-surface rounded-md border border-border z-(--z-dropdown) overflow-hidden p-1.5 flex flex-col gap-0.5"
          style={{ ...dropdownAnchorStyle(direction, 5) }}
        >
          {siempreHabilitadas.map(ItemMenu)}
          <div className="h-px bg-border my-0.5" />
          {condicionales.map(ItemMenu)}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Fila expandida — tamaño normal de ventana. Es la segunda fila de
          la card de Búsqueda (sin card propia), separada de los filtros
          por border-t. Se esconde entera (no solo se vacía) en tier 760px, porque el dropdown que la reemplaza
          vive en el header (portal de acá abajo), no en este lugar. */}
      <div
        className="flex items-center gap-2 flex-wrap px-4 py-2.5 border-t border-border-subtle [@media(max-height:760px)]:hidden"
      >
        {siempreHabilitadas.map(Boton)}
        <div className="w-px h-5 bg-border shrink-0" />
        {condicionales.map(Boton)}
      </div>
      {portalNode && createPortal(dropdown, portalNode)}
    </>
  );
}

// ─── ABM engine: componentes de UI ─────────────────────────────────────────

// Selector de tabla ABM — trigger + panel flotante tokenizado (mismo
// mecanismo que PeriodSelector), pero el trigger hace las veces de título
// del panel (ícono + nombre + badge de código) ya que el masthead no lleva
// nada más. Lee/escribe el mismo estado `screen` que ya maneja el sidebar,
// asi que ambos quedan sincronizados automaticamente sin estado global
// adicional. Cada opción del panel replica la riqueza visual del sidebar
// (ícono + nombre + badge), activa resaltada con bg-primary-tint +
// border-primary + text-secondary.
function AbmTableSelector({ value, onChange }: { value: AbmTableKey; onChange: (k: AbmTableKey) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  const direction = useDropdownDirection(ref, open, 450);
  const current = ABM_TABLE_CONFIGS[value];
  return (
    <div ref={ref} style={{ position: "relative" }} className="min-w-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="group flex items-center gap-2 h-(--control-md) pl-1.5 pr-2 -ml-1.5 rounded-sm min-w-0 transition-colors duration-(--duration-base) hover:bg-fill-muted"
      >
        {/* Lápiz fijo — no el ícono por tabla: el masthead del panel de
            trabajo siempre representa "estás en la herramienta de ABM",
            no una tabla en particular (esa distinción vive en el badge). */}
        <span className="shrink-0 text-icon group-hover:text-secondary transition-colors"><Pencil size={ICON.md} strokeWidth={1.5} /></span>
        <span className="text-heading-md text-text truncate">{current.titulo}</span>
        <span
          className="px-1.5 py-0.5 text-caption font-mono rounded-xs border border-border-strong text-focus shrink-0"
          style={{ backgroundColor: "var(--color-fill-muted)" }}
        >
          {current.code}
        </span>
        <span className={`shrink-0 text-icon transition-transform duration-(--duration-base) ${open ? "rotate-180" : ""}`}>
          <ChevronDown size={ICON.md} strokeWidth={1.5} />
        </span>
      </button>
      {open && (
        <div
          className="shadow-md absolute left-0 w-96 bg-surface rounded-md border border-border z-(--z-dropdown) overflow-hidden"
          style={{ ...dropdownAnchorStyle(direction, 5) }}
        >
          <div className="px-3 py-2.5 border-b border-border-subtle">
            <p className="text-heading-xs text-text-muted uppercase select-none">Cambiar de tabla</p>
          </div>
          <div className="p-1.5 flex flex-col gap-0.5 max-h-96 overflow-y-auto">
            {ABM_TABLE_ORDER.map((k) => {
              const c = ABM_TABLE_CONFIGS[k];
              const isSel = k === value;
              return (
                <button
                  key={k}
                  onClick={() => { onChange(k); setOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-sm border text-left transition-colors ${
                    isSel
                      ? "bg-primary-tint border-primary text-secondary"
                      : "border-transparent text-text hover:bg-fill-muted"
                  }`}
                >
                  <span className="flex-1 min-w-0 truncate text-body">{c.titulo}</span>
                  <span
                    className={`text-caption font-mono shrink-0 tabular-nums ${isSel ? "text-secondary" : "text-text-muted"}`}
                  >
                    {c.code}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

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
function AbmCampo({
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

function AbmFila({
  fila,
  mode,
  valores,
  setValor,
  camposLocked,
  consultando,
  columnasCompartidas,
}: {
  fila: CampoBusqueda[];
  mode: AbmMode;
  valores: Record<string, string>;
  setValor: (nombre: string, v: string) => void;
  // Nombres de campo bloqueados en modo Modificar para la tabla activa.
  camposLocked: string[];
  // Ver AbmCampo — fila seleccionada en Resultados en modo buscar.
  consultando?: boolean;
  // true si otra(s) fila(s) de la misma sección tienen la misma cantidad de
  // columnas — en ese caso las columnas deben quedar parejas (1fr) entre
  // todas para que se alineen visualmente, sin importar si alguna tiene un
  // toggle angosto. Solo una fila que es la única de su longitud en la
  // sección puede darse el lujo de ajustar sus columnas por tipo de campo.
  columnasCompartidas?: boolean;
}) {
  const isMulti = fila.length > 1;
  // Fila de un solo campo: por default el campo define su propio ancho
  // (w-full en texto/select/fecha, ya se ve bien) y la fila no necesita
  // estilo propio. El toggle es la excepción — su grupo de botones es
  // angosto por naturaleza (shrink-to-fit, ver AbmCampo), así que sin esto
  // la fila (100% del panel) deja un espacio muerto grande a la derecha.
  // `ancho` explícito en el campo, si lo hay, sigue ganando por sobre esto.
  const soloCampo = !isMulti ? fila[0] : undefined;
  const soloAncho = soloCampo?.ancho ?? (soloCampo?.tipo === "toggle" && !soloCampo?.expandirBotones ? "fit-content" : undefined);
  // Columnas parejas (1fr cada una) dejan un hueco cuando alguna es un
  // control de opciones acotadas (toggle/select, angosto por naturaleza)
  // — esa columna se ajusta a su contenido (auto); texto/fecha/combobox
  // son de contenido abierto y absorben el espacio sobrante. Pero eso solo
  // vale cuando la fila no tiene con quién alinearse dentro de la sección:
  // si otra fila hermana comparte la misma cantidad de columnas (ver
  // `columnasCompartidas`, calculado por sección en AbmScreen), todas esas
  // filas deben usar la misma grilla pareja para que sus columnas queden
  // alineadas entre sí, aunque alguna tenga un toggle/select. Si TODOS los
  // campos de una fila "no compartida" quedan compactos (ningún campo
  // abierto que absorba el sobrante), ese sobrante se reparte como espacio
  // entre los campos (space-between) en vez de amontonarse al final.
  const esCompacto = (tipo: CampoTipo) => tipo === "toggle" || tipo === "select";
  const gridTemplate = isMulti
    ? columnasCompartidas
      ? `repeat(${fila.length}, 1fr)`
      : fila.map((c) => (esCompacto(c.tipo) ? "auto" : "1fr")).join(" ")
    : undefined;
  const todosCompactos = isMulti && !columnasCompartidas && fila.every((c) => esCompacto(c.tipo));
  // A partir de 3 campos la fila ya usa casi todo el ancho del panel — en el
  // grid de 2 columnas de la sección (ver AbmScreen, tier 760px) tiene que
  // ocupar las 2 para no aplastar sus campos a la mitad. Filas de 1-2 campos
  // sí pueden emparejarse una al lado de la otra.
  const spanTodas = fila.length >= 3;
  return (
    <div
      className={`${isMulti ? "grid gap-3 items-end" : ""}${spanTodas ? " [@media(max-height:760px)]:col-span-2" : ""}`}
      style={
        isMulti
          ? { gridTemplateColumns: gridTemplate, justifyContent: todosCompactos ? "space-between" : undefined }
          : soloAncho
            ? { width: soloAncho }
            : undefined
      }
    >
      {fila.map((campo) => (
        <AbmCampo
          key={campo.nombre}
          campo={campo}
          mode={mode}
          value={valores[campo.nombre]}
          onChange={(v) => setValor(campo.nombre, v)}
          lockedEnModificar={camposLocked.includes(campo.nombre)}
          consultando={consultando}
          valoresFormulario={valores}
        />
      ))}
    </div>
  );
}

// Vuelca los datos de una fila de resultados en `valores` del formulario,
// según el mapeo columna→campo de la tabla (config.mapeoFilaACampos).
// Usado tanto por el estado "consultando" (fila seleccionada en modo
// buscar) como al entrar a "modificar" — en ambos casos el formulario debe
// mostrar el dato REAL del registro, nunca arrancar en blanco. Los campos
// sin mapeo quedan sin tocar (ver AbmCampo: siguen en blanco, pero
// disabled/atenuados igual).
function mapearFilaAValores(mapeo: Record<string, string>, fila: Record<string, string>): Record<string, string> {
  const nuevos: Record<string, string> = {};
  for (const [columna, campoNombre] of Object.entries(mapeo)) {
    if (fila[columna] !== undefined) nuevos[campoNombre] = fila[columna];
  }
  return nuevos;
}

// Resuelve el value crudo de un campo (toggle/select/combobox) a su label
// legible, usando las mismas `opciones` que ya usa AbmCampo — incluyendo el
// caso de opciones en función/cascada (ej. Localidad depende de Partido).
function labelDeValor(campo: CampoBusqueda, valor: string, contexto: Record<string, string>): string {
  if (!valor) return "";
  if (campo.tipo === "toggle" || campo.tipo === "select" || campo.tipo === "combobox") {
    const opciones = typeof campo.opciones === "function" ? campo.opciones(contexto) : campo.opciones;
    const opcion = opciones?.find((o) => (typeof o === "string" ? o === valor : o.value === valor));
    if (opcion) return typeof opcion === "string" ? opcion : opcion.label;
  }
  return valor;
}

// Componente unico que renderiza cualquiera de las 9 tablas ABM a partir de
// ABM_TABLE_CONFIGS[tableKey]. `onChangeTable` es el mismo setScreen del
// componente App — asi el selector interno y el item activo del sidebar
// comparten el mismo estado sin duplicarlo.
function AbmScreen({
  tableKey,
  onChangeTable,
  deepLink,
  onDeepLinkConsumed,
  volverVisible,
  onVolver,
}: {
  tableKey: AbmTableKey;
  onChangeTable: (k: AbmTableKey) => void;
  // Deep-link pendiente desde afuera (ej. drawer de Consultas de
  // interrupción) — se aplica una vez y se descarta via onDeepLinkConsumed.
  deepLink?: AbmDeepLink | null;
  onDeepLinkConsumed?: () => void;
  // Se llegó acá por un deep-link (no por navegación normal del sidebar) —
  // muestra el botón "←" (solo ícono) en el masthead.
  volverVisible?: boolean;
  onVolver?: () => void;
}) {
  const config = ABM_TABLE_CONFIGS[tableKey];
  // Tier 760px: la grilla plana del panel de Búsqueda (ver más abajo) es de
  // 2 columnas por default, ya validado contra Tabla 2 (12 campos, 6 filas
  // — entra sin scroll). Tablas con más campos que eso (CDS8: 14, la más
  // cargada — sección Cliente sola tiene 9) no entran en 6 filas y siguen
  // necesitando scroll con solo 2 columnas; el criterio de "cero scroll"
  // pesa más que mantener el mismo número de columnas en todas las tablas.
  // Contar los campos totales de la tabla (no medir nada en el DOM) alcanza
  // para decidirlo de antemano, sin necesidad de una lista hardcodeada de
  // tablas ni de lógica por tabla en el JSX de abajo.
  const totalCamposTabla = config.secciones.reduce((acc, sec) => acc + sec.filas.flat().length, 0);
  const usaTresColumnasTier2 = totalCamposTabla > 12;
  const filasGridColsTier2Cls = usaTresColumnasTier2 ? "[@media(max-height:760px)]:grid-cols-3" : "[@media(max-height:760px)]:grid-cols-2";
  // Si la tabla usa 3 columnas, un campo `expandirBotones` necesita las 3
  // para ocupar todo el ancho (no las 2 de siempre) — ver más abajo.
  const expandirBotonesSpanCls = usaTresColumnasTier2 ? "[@media(max-height:760px)]:col-span-3" : "[@media(max-height:760px)]:col-span-2";
  const [mode, setMode] = useState<AbmMode>("buscar");
  const [showData, setShowData] = useState(false);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [valores, setValores] = useState<Record<string, string>>({});
  // Foto del registro tal como estaba al entrar a Modificar — se compara
  // contra `valores` (que sí cambia con cada edición) para saber qué
  // campos cambiaron, ver ConfirmarModificarModal.
  const [valoresOriginales, setValoresOriginales] = useState<Record<string, string>>({});
  const [modalModificarAbierto, setModalModificarAbierto] = useState(false);
  const [filaABorrar, setFilaABorrar] = useState<number | null>(null);
  // Índices (de config.rows) borrados en esta sesión — config.rows es mock
  // estático derivado de la config, no estado real, así que "borrar" no
  // puede sacar la fila del array: en cambio se la excluye de Resultados
  // (visibleIndices más abajo) sin tocar los índices de las demás filas,
  // que siguen usándose como identidad en selectedRow/mapeoFilaACampos/etc.
  const [filasBorradas, setFilasBorradas] = useState<Set<number>>(new Set());
  const camposLocked = config.camposReadonlyEnModificar ?? [];

  // Reset al cambiar de tabla — corre primero.
  useEffect(() => {
    setMode("buscar");
    setShowData(false);
    setSelectedRow(null);
    setValores({});
    setValoresOriginales({});
    setFilasBorradas(new Set());
  }, [tableKey]);

  // Aplica un deep-link pendiente para ESTA tabla — corre después del
  // reset de arriba (mismo commit cuando tableKey y deepLink cambian
  // juntos, que es el caso normal), así su estado gana. Se descarta con
  // onDeepLinkConsumed apenas se aplica, para no reaplicarse en loop.
  useEffect(() => {
    if (!deepLink || deepLink.tableKey !== tableKey) return;
    if (deepLink.modo === "alta") {
      setMode("alta");
      setShowData(false);
      setSelectedRow(null);
      setValores({ [deepLink.campo]: deepLink.valor });
    } else {
      setMode("buscar");
      setValores({ [deepLink.campo]: deepLink.valor });
      setShowData(true);
      const idx = config.rows.findIndex((r) => r[deepLink.columna] === deepLink.valor);
      setSelectedRow(idx >= 0 ? idx : null);
    }
    onDeepLinkConsumed?.();
  }, [deepLink, tableKey]);

  // Estado "consultando" — hay una fila seleccionada en Resultados
  // mientras se sigue en modo buscar. Vuelca los datos de esa fila (según
  // config.mapeoFilaACampos) en el formulario de Búsqueda, en solo-lectura
  // — no cambia mode ni título/botones del panel (eso es "modificar", una
  // acción aparte que ahora arranca con los mismos datos, ver
  // handleAbrirModificar). Corre después del efecto de deep-link: si se
  // llega acá con una fila ya preseleccionada, esta pasada completa el
  // formulario con TODOS los campos mapeados (el deep-link por sí solo
  // precarga uno nada más).
  useEffect(() => {
    if (mode !== "buscar") return;
    if (selectedRow === null) {
      setValores({});
      return;
    }
    setValores(mapearFilaAValores(config.mapeoFilaACampos, config.rows[selectedRow]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, selectedRow, tableKey]);

  function setValor(nombre: string, v: string) {
    // `limpiaAlCambiar` (config del campo que cambió) — típicamente el
    // campo dependiente de una cascada (ver Partido -> Localidad en CDS8),
    // para que no quede seleccionado un valor que ya no es una opción
    // válida del campo dependiente.
    const campo = config.secciones.flatMap((s) => s.filas.flat()).find((c) => c.nombre === nombre);
    setValores((prev) => {
      const next = { ...prev, [nombre]: v };
      for (const otro of campo?.limpiaAlCambiar ?? []) next[otro] = "";
      return next;
    });
  }

  const hasSelection = selectedRow !== null;
  const consultando = mode === "buscar" && hasSelection;
  const columnKeys = config.columnasResultado.map((c) => c.key);
  const getCells = (row: Record<string, string>) => columnKeys.map((k) => row[k] ?? "");
  const { search, setSearch, sortIdx, sortDir, toggleSort, visibleIndices: visibleIndicesConBorradas } =
    useTableToolbar(config.rows, getCells, tableKey);
  // Excluye las filas "borradas" de Resultados (navegación por teclado,
  // export, conteo) sin renumerar nada — los índices que quedan siguen
  // siendo los mismos de config.rows, que es lo que usan selectedRow,
  // mapeoFilaACampos y el resto del formulario.
  const visibleIndices = visibleIndicesConBorradas.filter((i) => !filasBorradas.has(i));

  // Navegación por teclado en Resultados: flecha abajo/arriba mueve la
  // selección entre filas visibles y autocompleta Búsqueda en vivo (mismo
  // patrón que la tabla de Interrupciones en Consultas de interrupción,
  // ver handleModListKeyDown/modListRef).
  const resultadosListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedRow === null || !resultadosListRef.current) return;
    resultadosListRef.current
      .querySelector<HTMLElement>(`[data-row-index="${selectedRow}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [selectedRow]);

  function handleResultadosKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!showData || mode !== "buscar" || visibleIndices.length === 0) return;
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    if (selectedRow === null) {
      setSelectedRow(e.key === "ArrowDown" ? visibleIndices[0] : visibleIndices[visibleIndices.length - 1]);
      return;
    }
    const currentPos = visibleIndices.indexOf(selectedRow);
    const nextPos =
      e.key === "ArrowDown"
        ? Math.min(currentPos + 1, visibleIndices.length - 1)
        : Math.max(currentPos - 1, 0);
    setSelectedRow(visibleIndices[Math.max(nextPos, 0)]);
  }

  function handleLimpiar() {
    setShowData(false);
    setSelectedRow(null);
    setValores({});
  }
  function handleBuscar() {
    setShowData(true);
    setSelectedRow(null);
  }
  function handleAbrirAlta() {
    // No toca showData/selectedRow — el panel de Resultados sigue
    // mostrando exactamente lo que tenía (solo se atenúa vía el wrapper
    // de la derecha, ver `mode !== "buscar"` más abajo), no se resetea.
    setMode("alta");
    setValores({});
  }
  function handleCancelarAlta() {
    // Sin setSelectedRow(null) acá, si había una fila seleccionada al
    // entrar a Alta, el efecto de "consultando" la vuelve a volcar en
    // `valores` apenas mode pasa a "buscar" — el formulario quedaría en
    // estado "placeholder" en vez de "empty".
    setMode("buscar");
    setSelectedRow(null);
    setValores({});
  }
  function handleGuardarAlta() {
    setMode("buscar");
    setSelectedRow(null);
    setValores({});
  }
  // Modificar es un ícono por fila (no depende de que la fila ya esté
  // seleccionada) — toma el índice directo en vez de leer `selectedRow` del
  // closure, así funciona igual de bien sobre una fila recién clickeada que
  // sobre una ya seleccionada. El panel de Resultados no se toca (ni
  // showData ni selectedRow se resetean): sigue mostrando exactamente los
  // mismos resultados, con esta fila resaltada, solo atenuado vía el
  // wrapper de la derecha — igual que en modo Insertar.
  function handleAbrirModificar(i: number) {
    const filaActual = config.rows[i];
    const valoresIniciales = mapearFilaAValores(config.mapeoFilaACampos, filaActual);
    setSelectedRow(i);
    setMode("modificar");
    setValores(valoresIniciales);
    setValoresOriginales(valoresIniciales);
  }
  function handleCancelarModificar() {
    // Misma razón que handleCancelarAlta: sin limpiar selectedRow, el
    // efecto de "consultando" recompletaría el formulario apenas mode
    // vuelve a "buscar" (la fila sigue seleccionada en Resultados), y el
    // campo quedaría en "placeholder" en vez de volver a "empty". El panel
    // de Resultados en sí no se resetea (showData no se toca): sigue
    // mostrando los mismos resultados, solo sin ninguna fila resaltada.
    setMode("buscar");
    setSelectedRow(null);
    setValores({});
    setValoresOriginales({});
  }
  function handleGuardarModificar() {
    setModalModificarAbierto(true);
  }
  function handleCancelarConfirmarModificar() {
    // Solo cierra el modal — sigue en modo Modificando, no se pierde la edición.
    setModalModificarAbierto(false);
  }
  function handleConfirmarModificar(nota: string) {
    // TODO: config.rows es mock derivado de la config, no estado real —
    // todavía no hay dónde persistir el cambio ni la nota (mismo caso que
    // Borrar). Por ahora cierra el flujo igual que antes.
    setModalModificarAbierto(false);
    setMode("buscar");
    setSelectedRow(null);
    setValores({});
    setValoresOriginales({});
  }

  function handleAbrirBorrar(i: number) {
    setFilaABorrar(i);
  }
  function handleCancelarBorrar() {
    setFilaABorrar(null);
  }
  function handleConfirmarBorrar() {
    if (filaABorrar !== null) {
      setFilasBorradas((prev) => new Set(prev).add(filaABorrar));
      // La fila borrada no puede seguir seleccionada — si lo estaba,
      // "consultando" quedaría mostrando el dato de un registro que ya no
      // aparece en Resultados.
      if (selectedRow === filaABorrar) setSelectedRow(null);
    }
    setFilaABorrar(null);
  }

  const totalPages = Math.max(1, Math.ceil(config.totalRegistros / 25));

  // Campos que cambiaron respecto a `valoresOriginales` (la foto tomada al
  // entrar a Modificar) — alimenta ConfirmarModificarModal. Excluye
  // "readonly" (no editables, nunca cambian) y resuelve value → label
  // legible vía labelDeValor para toggle/select/combobox.
  const camposModificados = config.secciones
    .flatMap((s) => s.filas.flat())
    .filter((c) => c.tipo !== "readonly" && (valores[c.nombre] ?? "") !== (valoresOriginales[c.nombre] ?? ""))
    .map((c) => ({
      label: c.label,
      anterior: labelDeValor(c, valoresOriginales[c.nombre] ?? "", valoresOriginales),
      nuevo: labelDeValor(c, valores[c.nombre] ?? "", valores),
    }));

  return (
    <>
      {/* Masthead — selector de tabla (hace de título) a la izquierda, período
          a la derecha. Único agregado condicional: el link "Volver" cuando
          se llegó acá por un deep-link (ver AbmDeepLink) — nada de Insertar
          ni dropdown genérico. */}
      <header
        className="flex items-center gap-3 px-6 border-b border-border bg-bg-app shrink-0"
        style={{ minHeight: "var(--header-min-height, 60px)" }}
      >
        {volverVisible && (
          <button
            type="button"
            onClick={onVolver}
            title="Volver a Consultas de interrupción"
            aria-label="Volver a Consultas de interrupción"
            className={`flex items-center justify-center ${ICON_BTN_SM} -ml-1.5 rounded-sm text-icon hover:text-secondary hover:bg-fill-muted transition-colors shrink-0`}
          >
            ←
          </button>
        )}
        <div className="flex-1 min-w-0">
          <AbmTableSelector value={tableKey} onChange={onChangeTable} />
        </div>
        <PeriodSelector />
      </header>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden p-5 gap-5" key={mode}>

        {/* ── Left column: form ── */}
        <div
          // Tier 760px: el split pasa de 41/resto a ~47/resto — al revés que
          // en Interrupciones/Reposiciones (acá es Búsqueda la que le sobra
          // espacio a Resultados y necesita más ancho para acomodar más
          // columnas de campos, ver la sección de abajo). El ancho normal
          // (41%, inline) tiene prioridad de especificidad sobre una clase
          // sin `!important`, de ahí el `!w-[47%]`.
          className="shadow-sm flex flex-col rounded-md border border-border bg-surface shrink-0 overflow-hidden [@media(max-height:760px)]:!w-[47%]"
          style={{ width: "41%" }}
        >
          <CardHeader
            title={mode === "alta" ? "Insertando en" : mode === "modificar" ? "Modificando" : "Búsqueda"}
            tag={config.code}
            padX="px-5"
          />
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
            {config.secciones.map((sec) => {
              const conteoPorLongitud = new Map<number, number>();
              for (const fila of sec.filas) conteoPorLongitud.set(fila.length, (conteoPorLongitud.get(fila.length) ?? 0) + 1);
              // Tier 760px reemplaza el sistema de filas/columnasCompartidas
              // de acá abajo por una grilla fija y genérica: TODOS los
              // campos de la sección, sin importar cómo la tabla los
              // agrupó en `filas`, se aplanan y se acomodan de a 2 por
              // línea en un grid-template-columns: repeat(2, minmax(0,1fr))
              // — el wrap natural de CSS grid, no un reordenamiento manual
              // por tabla. Mismo mecanismo para las 9 tablas.
              const camposPlanos = sec.filas.flat();
              return (
                <div key={sec.titulo}>
                  <SectionDivider title={sec.titulo} />
                  {/* Tamaño normal: sistema de filas de siempre. */}
                  <div className="flex flex-col gap-3 [@media(max-height:760px)]:hidden">
                    {sec.filas.map((fila, fi) => (
                      <AbmFila
                        key={fi}
                        fila={fila}
                        mode={mode}
                        valores={valores}
                        setValor={setValor}
                        camposLocked={camposLocked}
                        consultando={consultando}
                        columnasCompartidas={(conteoPorLongitud.get(fila.length) ?? 0) > 1}
                      />
                    ))}
                  </div>
                  {/* Tier 760px: grilla fija a lo ancho completo del panel
                      — 2 o 3 columnas según cuántos campos tenga la tabla
                      en total (ver totalCamposTabla más arriba) — cada
                      campo (toggle, select o input) estira a w-full dentro
                      de su celda. */}
                  <div className={`hidden [@media(max-height:760px)]:grid ${filasGridColsTier2Cls} [@media(max-height:760px)]:items-end [@media(max-height:760px)]:gap-3`}>
                    {camposPlanos.map((campo) => (
                      // `expandirBotones` es la señal existente de "este
                      // toggle necesita todo el ancho disponible, no una
                      // celda" (ver Causa en CDS3, Zona en CDS7) — acá eso
                      // se traduce en ocupar todas las columnas de la
                      // grilla plana (2 o 3 según la tabla), no solo una.
                      // Sin esto, un toggle de 1-2 opciones largas queda a
                      // una fracción del ancho del panel y el texto rompe a
                      // 2 líneas.
                      <div key={campo.nombre} className={campo.expandirBotones ? expandirBotonesSpanCls : ""}>
                        <AbmCampo
                          campo={campo}
                          mode={mode}
                          value={valores[campo.nombre]}
                          onChange={(v) => setValor(campo.nombre, v)}
                          lockedEnModificar={camposLocked.includes(campo.nombre)}
                          consultando={consultando}
                          valoresFormulario={valores}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="shrink-0 border-t border-border px-5 py-4 flex gap-3">
            {mode === "buscar" ? (
              <>
                <button
                  onClick={handleLimpiar}
                  disabled={!showData}
                  className="flex-1 h-(--control-md) rounded-sm text-body font-medium border border-border-strong bg-surface text-text hover:bg-primary-tint hover:border-primary hover:text-secondary transition-[color,background-color,border-color,transform] duration-(--duration-base) active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
                >Limpiar</button>
                <button
                  onClick={handleBuscar}
                  disabled={showData}
                  className="flex-1 h-(--control-md) rounded-sm text-body font-medium text-white transition-[color,background-color,border-color,transform] duration-(--duration-base) active:scale-[0.99] bg-primary-strong hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
                >Buscar</button>
              </>
            ) : mode === "alta" ? (
              <>
                <button
                  onClick={handleCancelarAlta}
                  className="flex-1 h-(--control-md) rounded-sm text-body font-medium border border-border-strong bg-surface text-text hover:bg-primary-tint hover:border-primary hover:text-secondary transition-[color,background-color,border-color,transform] duration-(--duration-base) active:scale-[0.99]"
                >Cancelar</button>
                <button
                  onClick={handleGuardarAlta}
                  className="flex-1 h-(--control-md) rounded-sm text-body font-medium text-white transition-[color,background-color,border-color,transform] duration-(--duration-base) active:scale-[0.99] bg-primary-strong hover:bg-primary-hover"
                >Insertar</button>
              </>
            ) : (
              <>
                <button
                  onClick={handleCancelarModificar}
                  className="flex-1 h-(--control-md) rounded-sm text-body font-medium border border-border-strong bg-surface text-text hover:bg-primary-tint hover:border-primary hover:text-secondary transition-[color,background-color,border-color,transform] duration-(--duration-base) active:scale-[0.99]"
                >Cancelar</button>
                <button
                  onClick={handleGuardarModificar}
                  className="flex-1 h-(--control-md) rounded-sm text-body font-medium text-white transition-[color,background-color,border-color,transform] duration-(--duration-base) active:scale-[0.99] bg-primary-strong hover:bg-primary-hover"
                >Guardar</button>
              </>
            )}
          </div>
        </div>

        {/* ── Right column: results — se atenua y deshabilita en modo alta
            y en modo modificar, para que el foco visual quede en el panel
            Búsqueda ── */}
        <div
          className={`shadow-sm flex-1 flex flex-col border border-border rounded-md bg-surface overflow-hidden transition-opacity duration-(--duration-base) ${
            mode !== "buscar" ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <CardHeader
            title="Resultados"
            tag={config.code}
            actions={
              <div className="flex items-center gap-2">
                {/* Auditoría es una acción de panel, no de registro: genera
                    una auditoría de todos los campos modificados en el
                    conjunto de resultados, no de una fila puntual — por eso
                    vive acá siempre visible/habilitada, no en la fila ni
                    atada a una selección (corrige un comportamiento heredado
                    del producto original que la ataba a un registro). */}
                <button type="button" title="Auditoría" aria-label="Auditoría" className={actionBtnCls("neutral")}>
                  <span className="inline-flex items-center gap-1.5"><Shield size={ICON.md} strokeWidth={1.5} /> <span className="[@media(max-height:760px)]:hidden">Auditoría</span></span>
                </button>
                {showData && (
                  <button
                    type="button"
                    title="Exportar"
                    aria-label="Exportar"
                    onClick={() =>
                      exportRowsToCsv(
                        config.exportFilename,
                        config.columnasResultado.map((c) => c.label),
                        visibleIndices.map((i) => getCells(config.rows[i]))
                      )
                    }
                    className={actionBtnCls("neutral")}
                  >
                    <span className="inline-flex items-center gap-1.5"><Download size={ICON.md} strokeWidth={1.5} /> <span className="[@media(max-height:760px)]:hidden">Exportar</span></span>
                  </button>
                )}
                {config.hasInsertar && (
                  <button type="button" title="Insertar" aria-label="Insertar" onClick={handleAbrirAlta} className={actionBtnCls("neutral")}>
                    <span className="inline-flex items-center gap-1.5"><Plus size={ICON.sm} strokeWidth={1.5} /> <span className="[@media(max-height:760px)]:hidden">Insertar</span></span>
                  </button>
                )}
              </div>
            }
          />
          {showData && (
            <TableToolbar search={search} onSearchChange={setSearch} hideExport />
          )}

          {/* Contenedor de la tabla — mx-4 mb-4 con borde propio, sin línea
              entre él y el toolbar (proximidad, ver TableToolbar); sin datos
              no hay toolbar y suma mt-3 para no quedar pegado al header.
              Adentro: la línea de registro seleccionado, la tabla con
              scroll propio y el pie de paginación. */}
          <div className={`flex-1 min-h-0 mx-4 mb-4 flex flex-col border border-border rounded-sm overflow-hidden ${showData ? "" : "mt-3"}`}>
          {hasSelection && (
            <SelectionActionBar recordLabel={config.rows[selectedRow!][columnKeys[0]]} />
          )}

          {/* Header + Body — un solo <table> (thead+tbody), no dos divs
              flex separados: así el navegador mide el ancho de cada
              columna teniendo en cuenta header + TODAS las filas juntas
              (mismo criterio que la Tabla 4 de Consultas de interrupción),
              lo que además es la única forma de garantizar que header y
              filas queden alineados en columnas shrink-to-fit — con divs
              independientes por fila cada una mide su propio ancho por su
              cuenta y se desalinean entre sí.
              Cada columna de datos usa w-[1%] + whitespace-nowrap — el
              truco estándar de CSS para "esta columna no debe crecer, se
              achica a su contenido" en table-layout:auto (que además evita
              el wrap a dos líneas, ej. "SAN FERNANDO" en CDS7/Zona). La
              única columna SIN ese freno es el spacer vacío entre la
              última columna de datos y Acciones: al ser la única sin
              límite de ancho, absorbe ella sola todo el espacio sobrante
              de la fila. Acciones mantiene su ancho fijo (w-40), pegada a
              la derecha. */}
          <div
            ref={resultadosListRef}
            tabIndex={showData ? 0 : -1}
            onKeyDown={handleResultadosKeyDown}
            className={`flex-1 min-h-0 overflow-y-auto ${FOCUS_RING_INSET}`}
          >
            {!showData ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-text-faint">
                <Inbox size={ICON.xl} strokeWidth={1.25} />
                <p className="text-body-lg text-text-muted mt-1">
                  No hay resultados para los filtros aplicados
                </p>
                <p className="text-body-sm text-text-muted">
                  Completá los filtros y presioná{" "}
                  <span className="font-semibold text-secondary">Buscar</span>
                </p>
              </div>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    {config.columnasResultado.map((c, ci) => (
                      <th key={c.key} className="sticky top-0 z-(--z-sticky) bg-fill-subtle-solid w-[1%] whitespace-nowrap px-4 py-2 text-left">
                        <SortableHeaderCell
                          label={c.label}
                          active={sortIdx === ci}
                          dir={sortDir}
                          onClick={() => toggleSort(ci)}
                        />
                      </th>
                    ))}
                    <th className="sticky top-0 z-(--z-sticky) bg-fill-subtle-solid" />
                    <th className="sticky top-0 z-(--z-sticky) bg-fill-subtle-solid w-40 whitespace-nowrap px-4 py-2 text-left text-heading-xs uppercase text-text-muted">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleIndices.map((i) => {
                    const row = config.rows[i];
                    const isSelected = selectedRow === i;
                    const isHovered = hoveredRow === i;
                    return (
                      <tr
                        key={i}
                        data-row-index={i}
                        onClick={() => setSelectedRow(isSelected ? null : i)}
                        onMouseEnter={() => setHoveredRow(i)}
                        onMouseLeave={() => setHoveredRow(null)}
                        className="border-b border-border-subtle cursor-pointer transition-colors duration-(--duration-fast)"
                        style={{ backgroundColor: isSelected ? "var(--color-primary-tint)" : isHovered ? "var(--color-fill-muted)" : undefined }}
                      >
                        {config.columnasResultado.map((c, ci) => (
                          <td
                            key={c.key}
                            className={`w-[1%] whitespace-nowrap px-4 py-2.5 ${
                              c.mono ? "text-code font-mono tabular-nums" : isSelected ? "text-body text-secondary font-medium" : "text-body text-text"
                            }`}
                            style={{
                              ...(c.mono
                                ? {
                                    color: isSelected ? "var(--color-secondary)" : "var(--color-text)",
                                    fontWeight: isSelected ? 600 : 400,
                                  }
                                : undefined),
                              // Acento de selección en la primera celda, no
                              // en el <tr>: con border-collapse un borde
                              // puesto directo en la fila no renderiza de
                              // forma confiable en todos los navegadores.
                              borderLeft: ci === 0 ? (isSelected ? "3px solid var(--color-primary)" : "3px solid transparent") : undefined,
                            }}
                          >
                            {row[c.key]}
                          </td>
                        ))}
                        {/* Spacer — celda vacía, sin ancho fijo: absorbe
                            sola todo el sobrante de la fila. */}
                        <td />
                        {/* Modificar/Borrar — con texto (no solo ícono,
                            ambiguo) siempre visibles por fila, ya no atados
                            a tener la fila seleccionada. stopPropagation:
                            no deben togglear la selección de la fila (eso
                            lo maneja el onClick del <tr>). */}
                        <td className="w-40 px-4 py-2.5">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleAbrirModificar(i); }}
                              className={rowActionBtnCls("neutral")}
                            >
                              Modificar
                            </button>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleAbrirBorrar(i); }}
                              className={rowActionBtnCls("destructive")}
                            >
                              Borrar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer */}
          {showData && (
            <div className="px-4 py-2 border-t border-border bg-fill-subtle rounded-b-md shrink-0 flex items-center justify-between">
              <span className="text-body-sm text-text">
                Registros encontrados:{" "}
                <span className="font-semibold text-secondary">
                  {formatNumero(config.totalRegistros)}
                </span>
              </span>
              <div className="flex items-center gap-2 text-body-sm text-text-muted">
                <button className={`${BTN_SM} border border-border-strong bg-surface hover:bg-fill-muted disabled:opacity-40 transition-colors`} disabled>
                  Anterior
                </button>
                <span>
                  Pág. <span className="font-medium text-text">1</span> de{" "}
                  <span className="font-medium text-text">{formatNumero(totalPages)}</span>
                </span>
                <button
                  className={`${BTN_SM} border border-border-strong bg-surface hover:bg-fill-muted disabled:opacity-40 transition-colors`}
                  disabled={totalPages <= 1}
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>

      <ConfirmarBorrarModal
        open={filaABorrar !== null}
        registro={filaABorrar !== null ? config.rows[filaABorrar][config.columnasResultado[0].key] : ""}
        tabla={ABM_ITEMS.find((it) => it.screen === tableKey)?.label ?? config.titulo}
        onCancelar={handleCancelarBorrar}
        onConfirmar={handleConfirmarBorrar}
      />
      <ConfirmarModificarModal
        open={modalModificarAbierto}
        cambios={camposModificados}
        onCancelar={handleCancelarConfirmarModificar}
        onConfirmar={handleConfirmarModificar}
      />
    </>
  );
}

// ─── Generación de txt ──────────────────────────────────────────────────────

function GeneracionTxtContent() {
  const [tabla, setTabla] = useState("");

  function handleExportar() {
    // mock: sin backend real conectado todavía (mismo alcance que Borrar/Guardar)
  }

  return (
    <div className="flex-1 overflow-y-auto px-10 py-10">
      <div className="bg-surface rounded-lg border border-border" style={{ maxWidth: 640 }}>
        <CardHeader title="Exportación" padX="px-6" />
        <div className="p-6 flex items-end gap-3">
          <div className="flex-1 min-w-0" style={{ maxWidth: 320 }}>
            <ValuePicker
              label="Tabla a exportar"
              value={tabla}
              onChange={setTabla}
              opts={ABM_ITEMS.map((item) => ({ value: item.screen as string, label: item.label }))}
              placeholder="Seleccioná tabla a exportar"
            />
          </div>
          <button type="button" disabled={!tabla} onClick={handleExportar} className={modalPrimaryBtnCls}>
            Exportar
          </button>
        </div>
      </div>
    </div>
  );
}

function PlanillaConsolidadaContent() {
  const [datos, setDatos] = useState(() => generarConsolidacionSintetica(crearRng(hashSemilla("planilla-consolidada"))));
  const [fechaProceso, setFechaProceso] = useState("12/08/2026 09:19");
  const [usuarioProceso] = useState("Rdellamagiora");
  const [procesando, setProcesando] = useState(false);
  const [progresoAbierto, setProgresoAbierto] = useState(false);

  function handleProcesar() {
    setProcesando(true);
    setTimeout(() => {
      setDatos(generarConsolidacionSintetica(crearRng(Date.now())));
      setFechaProceso(formatFechaHora(new Date()));
      setProcesando(false);
    }, 900);
  }

  function handleGenerarCsv() {
    const filas: [string, string][] = [
      ["Fecha último proceso", fechaProceso],
      ["Usuario último proceso", usuarioProceso],
      ["Reclamos", String(datos.reclamos)],
      ["Reiteraciones", String(datos.reiteraciones)],
      ["SAIDI", datos.saidi],
      ["SAIFI", datos.saifi],
      ["Máxima duración — Interrupción", datos.maxDuracionRef],
      ["Máxima duración — Valor", String(datos.maxDuracionValor)],
      ["Máximo marginal ajustado — Interrupción", datos.maxMarginalRef],
      ["Máximo marginal ajustado — Valor", datos.maxMarginalValor],
    ];
    const csv = filas.map((f) => f.join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `planilla_consolidada_${fechaProceso.replace(/[/: ]/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex-1 overflow-y-auto px-10 py-10">
      <div className="bg-surface rounded-lg border border-border" style={{ maxWidth: 760 }}>
        <CardHeader title="Consolidación" padX="px-6" />
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div><FieldLabel>Fecha último proceso</FieldLabel><input readOnly value={fechaProceso} className={MOD_FIELD_CLS + ESTADO_CLASES.disabled} /></div>
            <div><FieldLabel>Usuario último proceso</FieldLabel><input readOnly value={usuarioProceso} className={MOD_FIELD_CLS + ESTADO_CLASES.disabled} /></div>
            <div><FieldLabel>Reclamos</FieldLabel><input readOnly value={String(datos.reclamos)} className={MOD_FIELD_CLS + ESTADO_CLASES.disabled} /></div>
            <div><FieldLabel>Reiteraciones</FieldLabel><input readOnly value={String(datos.reiteraciones)} className={MOD_FIELD_CLS + ESTADO_CLASES.disabled} /></div>
            <div><FieldLabel>SAIDI</FieldLabel><input readOnly value={datos.saidi} className={MOD_FIELD_CLS + ESTADO_CLASES.disabled} /></div>
            <div><FieldLabel>SAIFI</FieldLabel><input readOnly value={datos.saifi} className={MOD_FIELD_CLS + ESTADO_CLASES.disabled} /></div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <p className="text-heading-xs uppercase text-text-muted mb-1.5">Máxima duración</p>
              <div className="grid grid-cols-2 gap-3">
                <div><FieldLabel>Interrupción</FieldLabel><input readOnly value={datos.maxDuracionRef} className={MOD_FIELD_CLS + ESTADO_CLASES.disabled} /></div>
                <div><FieldLabel>Valor</FieldLabel><input readOnly value={String(datos.maxDuracionValor)} className={MOD_FIELD_CLS + ESTADO_CLASES.disabled} /></div>
              </div>
            </div>
            <div>
              <p className="text-heading-xs uppercase text-text-muted mb-1.5">Máximo marginal ajustado</p>
              <div className="grid grid-cols-2 gap-3">
                <div><FieldLabel>Interrupción</FieldLabel><input readOnly value={datos.maxMarginalRef} className={MOD_FIELD_CLS + ESTADO_CLASES.disabled} /></div>
                <div><FieldLabel>Valor</FieldLabel><input readOnly value={datos.maxMarginalValor} className={MOD_FIELD_CLS + ESTADO_CLASES.disabled} /></div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-border">
            <button type="button" onClick={() => setProgresoAbierto(true)} className={modalNeutralBtnCls}>Ver progreso</button>
            <button type="button" disabled={procesando} onClick={handleProcesar} className={modalPrimaryBtnCls}>
              {procesando ? "Procesando…" : "Procesar"}
            </button>
            <button type="button" onClick={handleGenerarCsv} className={modalPrimaryBtnCls}>Generar CSV</button>
          </div>
        </div>
      </div>

      <Modal
        title="Progreso del proceso"
        open={progresoAbierto}
        onClose={() => setProgresoAbierto(false)}
        size="sm"
        footer={<button type="button" onClick={() => setProgresoAbierto(false)} className={modalNeutralBtnCls}>Cerrar</button>}
      >
        <div className="flex flex-col gap-3">
          {["Recepción de tablas", "Cálculo de indicadores", "Consolidación final"].map((paso, i) => (
            <div key={paso} className="flex items-center gap-2.5">
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white text-caption"
                style={{ backgroundColor: i < 2 ? "var(--color-success)" : "var(--color-neutral-200)" }}
              >
                {i < 2 ? "✓" : ""}
              </span>
              <span className="text-body text-text">{paso}</span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}

function GestorNotasContent() {
  const [notas, setNotas] = useState(NOTAS_INICIALES);
  const [filtro, setFiltro] = useState("");
  const [seleccionada, setSeleccionada] = useState<string | null>(null);
  const [porPagina, setPorPagina] = useState(10);
  const [pagina, setPagina] = useState(1);
  const [modalAbierto, setModalAbierto] = useState<string | null>(null); // "nueva" o el id a editar
  const [textoModal, setTextoModal] = useState("");

  const ordenadas = [...notas].sort((a, b) => a.posicion - b.posicion);
  const filtradas = filtro ? ordenadas.filter((n) => n.texto.toLowerCase().includes(filtro.toLowerCase())) : ordenadas;
  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / porPagina));
  const paginaSegura = Math.min(pagina, totalPaginas);
  const visibles = filtradas.slice((paginaSegura - 1) * porPagina, paginaSegura * porPagina);

  function mover(id: string, direccion: "top" | "up" | "down" | "bottom") {
    const orden = [...notas].sort((a, b) => a.posicion - b.posicion);
    const idx = orden.findIndex((n) => n.id === id);
    if (idx === -1) return;
    const [item] = orden.splice(idx, 1);
    if (direccion === "top") orden.unshift(item);
    else if (direccion === "bottom") orden.push(item);
    else if (direccion === "up") orden.splice(Math.max(0, idx - 1), 0, item);
    else orden.splice(Math.min(orden.length, idx + 1), 0, item);
    setNotas(orden.map((n, i) => ({ ...n, posicion: i + 1 })));
  }

  function abrirNueva() { setTextoModal(""); setModalAbierto("nueva"); }
  function abrirEditar(id: string, texto: string) { setTextoModal(texto); setModalAbierto(id); }
  function guardarModal() {
    const texto = textoModal.trim();
    if (!texto) return;
    if (modalAbierto === "nueva") {
      setNotas((prev) => [...prev, { id: `n${Date.now()}`, texto, posicion: prev.length + 1 }]);
    } else if (modalAbierto) {
      setNotas((prev) => prev.map((n) => (n.id === modalAbierto ? { ...n, texto } : n)));
    }
    setModalAbierto(null);
  }

  return (
    <div className="flex-1 overflow-y-auto px-10 py-10">
      <div className="flex gap-4 items-start" style={{ maxWidth: 900 }}>
        <div className="flex-1 bg-surface rounded-lg border border-border overflow-hidden">
          <CardHeader
            title="Notas"
            padX="px-5"
            actions={
              <button type="button" onClick={abrirNueva} className={modalPrimaryBtnCls}>
                Agregar nota
              </button>
            }
          />
          <div className="p-5">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-fill-subtle border-b border-border">
                  <th className="px-3 py-2 text-left text-heading-xs uppercase text-text-muted">Nota</th>
                  <th className="w-24 px-3 py-2 text-left text-heading-xs uppercase text-text-muted">Posición</th>
                  <th className="w-14 px-2 py-2" />
                </tr>
                <tr className="border-b border-border">
                  <td className="p-1.5">
                    <input
                      value={filtro}
                      onChange={(e) => { setFiltro(e.target.value); setPagina(1); }}
                      placeholder="Buscar nota..."
                      className={MOD_FIELD_CLS}
                    />
                  </td>
                  <td /><td />
                </tr>
              </thead>
              <tbody>
                {visibles.length === 0 ? (
                  <tr><td colSpan={3}>
                    <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
                      <span className="text-text-faint"><Inbox size={ICON.xl} strokeWidth={1.25} /></span>
                      <p className="text-heading-sm text-text-muted">No hay notas</p>
                    </div>
                  </td></tr>
                ) : visibles.map((n) => (
                  <tr
                    key={n.id}
                    onClick={() => setSeleccionada(n.id)}
                    className={`border-b border-border-subtle cursor-pointer transition-colors ${seleccionada === n.id ? "bg-primary-tint" : "hover:bg-fill-muted"}`}
                  >
                    <td className="px-3 py-2.5 text-body text-text">{n.texto}</td>
                    <td className="px-3 py-2.5 text-body text-text-muted tabular-nums">{n.posicion}</td>
                    <td className="px-2 py-2.5">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); abrirEditar(n.id, n.texto); }}
                        className={`${ICON_BTN_SM} flex items-center justify-center rounded-sm text-icon hover:bg-primary-tint hover:text-secondary transition-colors`}
                        title="Editar"
                      >
                        <Pencil size={ICON.md} strokeWidth={1.5} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2 text-body-sm text-text-muted">
                <span>Mostrar</span>
                <SelectWrap>
                  <select
                    value={porPagina}
                    onChange={(e) => { setPorPagina(Number(e.target.value)); setPagina(1); }}
                    className={MOD_SELECT_CLS}
                  >
                    {[10, 25, 50].map((n) => <option key={n} value={n}>{n} registros</option>)}
                  </select>
                </SelectWrap>
              </div>
              <div className="flex items-center gap-3 text-body-sm text-text-muted">
                <button disabled={paginaSegura <= 1} onClick={() => setPagina((p) => p - 1)} className={`${BTN_SM} border border-border-strong bg-surface disabled:opacity-40`}>Anterior</button>
                <span>Pág. <span className="font-medium text-text">{paginaSegura}</span> de <span className="font-medium text-text">{totalPaginas}</span></span>
                <button disabled={paginaSegura >= totalPaginas} onClick={() => setPagina((p) => p + 1)} className={`${BTN_SM} border border-border-strong bg-surface disabled:opacity-40`}>Siguiente</button>
              </div>
            </div>
          </div>
        </div>

        {/* Reordenar — actúa sobre la fila seleccionada de la tabla (click en la fila) */}
        <div className="flex flex-col gap-1.5 pt-14 shrink-0">
          {([
            { dir: "top" as const, icon: <ChevronsUp size={ICON.sm} strokeWidth={1.5} />, title: "Mover al principio" },
            { dir: "up" as const, icon: <span className="inline-flex rotate-180"><ChevronDown size={ICON.md} strokeWidth={1.5} /></span>, title: "Subir" },
            { dir: "down" as const, icon: <ChevronDown size={ICON.md} strokeWidth={1.5} />, title: "Bajar" },
            { dir: "bottom" as const, icon: <ChevronsDown size={ICON.sm} strokeWidth={1.5} />, title: "Mover al final" },
          ]).map((b) => (
            <button
              key={b.dir}
              type="button"
              title={b.title}
              disabled={!seleccionada}
              onClick={() => seleccionada && mover(seleccionada, b.dir)}
              className={`${ICON_BTN_SM} flex items-center justify-center rounded-sm border border-border-strong bg-surface text-icon hover:bg-primary-tint hover:border-primary hover:text-secondary disabled:opacity-30 disabled:pointer-events-none transition-colors`}
            >
              {b.icon}
            </button>
          ))}
        </div>
      </div>

      <Modal
        title={modalAbierto === "nueva" ? "Agregar nota" : "Editar nota"}
        open={modalAbierto !== null}
        onClose={() => setModalAbierto(null)}
        size="sm"
        footer={
          <>
            <button type="button" onClick={() => setModalAbierto(null)} className={modalNeutralBtnCls}>Cancelar</button>
            <button type="button" disabled={!textoModal.trim()} onClick={guardarModal} className={modalPrimaryBtnCls}>Guardar</button>
          </>
        }
      >
        <FieldLabel>Nota</FieldLabel>
        <input value={textoModal} onChange={(e) => setTextoModal(e.target.value.toUpperCase())} className={MOD_FIELD_CLS} placeholder="Ej. DATOS INCOMPLETOS/ INCORRECTOS" autoFocus />
      </Modal>
    </div>
  );
}

// ─── Inserta clientes en BDTH ───────────────────────────────────────────────

function InsertaClientesContent() {
  const [cliente, setCliente] = useState("");
  const [validado, setValidado] = useState(false);
  const [periodo, setPeriodo] = useState("");

  function handleCambioCliente(v: string) { setCliente(v); setValidado(false); }
  function handleValidar() { if (cliente.trim()) setValidado(true); }
  function handleInsertar() {
    // mock: sin backend real conectado todavía
  }

  return (
    <div className="flex-1 overflow-y-auto px-10 py-10">
      <div className="bg-surface rounded-lg border border-border p-6" style={{ maxWidth: 640 }}>
        <div className="flex flex-col gap-4">
          <div className="flex items-end gap-3">
            <div className="flex-1 min-w-0">
              <FieldLabel>Cliente</FieldLabel>
              <input value={cliente} onChange={(e) => handleCambioCliente(e.target.value)} placeholder="ID de cliente" className={MOD_FIELD_CLS} />
            </div>
            <button type="button" disabled={!cliente.trim()} onClick={handleValidar} className={modalNeutralBtnCls}>Validar</button>
            {validado && <span className="text-label text-success-text-strong shrink-0">✓ Cliente válido</span>}
          </div>
          <div style={{ maxWidth: 280 }}>
            <ValuePicker
              label="Período BDTH"
              value={periodo}
              onChange={setPeriodo}
              opts={PERIODS}
              placeholder="Seleccioná período"
            />
          </div>
          <div className="flex justify-end pt-3 border-t border-border">
            <button type="button" disabled={!validado || !periodo} onClick={handleInsertar} className={modalPrimaryBtnCls}>Insertar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuditoriaContent() {
  const [usuario, setUsuario] = useState("");
  const [tablasSel, setTablasSel] = useState<Set<AbmTableKey>>(new Set());

  function toggleTabla(k: AbmTableKey) {
    setTablasSel((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k); else next.add(k);
      return next;
    });
  }

  function handleExportar() {
    // mock: sin backend real conectado todavía
  }

  return (
    <div className="flex-1 overflow-y-auto px-10 py-10">
      <div className="bg-surface rounded-lg border border-border" style={{ maxWidth: 720 }}>
        <CardHeader title="Filtros" padX="px-6" />
        <div className="p-6 grid grid-cols-2 gap-6">
          <div>
            <ValuePicker
              label="Seleccioná usuario"
              opts={USUARIOS_SISENRE_DEMO}
              value={usuario}
              onChange={setUsuario}
              searchable
            />
          </div>
          <div>
            <FieldLabel>Seleccioná tablas</FieldLabel>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {ABM_ITEMS.map((item) => (
                <ModalCheckbox
                  key={item.key ?? item.code + item.label}
                  label={item.label}
                  checked={item.screen ? tablasSel.has(item.screen as AbmTableKey) : false}
                  onChange={() => item.screen && toggleTabla(item.screen as AbmTableKey)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end px-6 pb-6">
          <button
            type="button"
            disabled={!usuario || tablasSel.size === 0}
            onClick={handleExportar}
            className={modalPrimaryBtnCls}
          >
            Exportar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [collapsed, setCollapsed] = useState(false);
  const [lastAbmTable, setLastAbmTable] = useState<AbmTableKey>("cds2");
  const [abmExpanded, setAbmExpanded] = useState(true);
  // Grupo "Herramientas": arranca plegado (ABM arranca desplegado) — los
  // dos grupos se excluyen: abrir uno pliega el otro, en cualquier tamaño.
  const [herramientasExpanded, setHerramientasExpanded] = useState(false);
  // Herramienta abierta desde el menú (modal) — independiente de la
  // pantalla activa.
  const [herramientaAbierta, setHerramientaAbierta] = useState<HerramientaKey | null>(null);
  // "Otros" no es desplegable en el tamaño normal (label fijo, ver más
  // abajo) — este estado solo importa en el acordeón compacto de tier
  // 760px, donde ABM/Otros pasan a excluirse mutuamente.
  const [otrosExpanded, setOtrosExpanded] = useState(true);
  // Notebooks de 14" (ventana baja): "Alta, Baja y Modificación" (9 tablas)
  // y "Otros" (5 pantallas) expandidos a la vez es lo primero que se corta
  // (tapa ítems contra el footer del sidebar). Acá SÍ hace falta JS real
  // (no solo CSS) porque cambia comportamiento — qué grupo se auto-expande
  // y cuál handler colapsa al otro — no solo apariencia.
  const compactSidebar = useMatchMedia("(max-height: 760px)");
  // Deep-link pendiente hacia una tabla ABM (ej. desde el modal "Tablas
  // relacionadas" de Modificar interrupción) — AbmScreen lo consume al
  // montar/cambiar de tabla y precarga campo, ejecuta búsqueda o entra en
  // alta según corresponda.
  const [abmDeepLink, setAbmDeepLink] = useState<AbmDeepLink | null>(null);
  // "Venís de Consultas de interrupción por un deep-link" — mientras esté
  // seteado, AbmScreen muestra el botón "Volver". Se limpia en cualquier
  // navegación ABM normal (sidebar, selector interno) y se restablece solo
  // al llegar por un deep-link nuevo.
  const [volverA, setVolverA] = useState<{ relTab: string | null; referencia: string | null; reposicion: number | null } | null>(null);
  // Estado a restaurar en Consultas de interrupción al volver desde ABM —
  // lo consume ModificarContent como valor inicial en su próximo mount.
  const [modificarInitialRelTab, setModificarInitialRelTab] = useState<string | null>(null);
  const [modificarInitialReferencia, setModificarInitialReferencia] = useState<string | null>(null);
  const [modificarInitialReposicion, setModificarInitialReposicion] = useState<number | null>(null);

  // Acordeón de uno-abierto-a-la-vez del sidebar compacto (tier 760px):
  // abre el grupo que contiene `target` y cierra el otro. No hace nada si
  // la ventana no está en el tier compacto — en tamaño normal ambos grupos
  // siguen su comportamiento de siempre (ABM toggleable a mano, Otros
  // siempre expandido). Función plana (no hook) — puede vivir después de
  // los early return de abajo sin problema; se referencia acá arriba por
  // hoisting de `function`.
  function syncAccordionCompacto(target: Screen) {
    if (!compactSidebar) return;
    setHerramientasExpanded(false);
    if (isAbmTableKey(target)) {
      setAbmExpanded(true);
      setOtrosExpanded(false);
    } else if (OTROS_ITEMS.some((it) => it.screen === target)) {
      setAbmExpanded(false);
      setOtrosExpanded(true);
    } else {
      setAbmExpanded(false);
      setOtrosExpanded(false);
    }
  }

  // Al entrar/salir del tier compacto (resize, o directamente montar con la
  // ventana ya baja): en compacto, auto-expande el grupo de la pantalla
  // activa y colapsa el resto; al volver a tamaño normal, restaura el
  // default de siempre (ambos expandidos). No corre en cada cambio de
  // `screen` — eso ya lo cubren las funciones de navegación de abajo vía
  // syncAccordionCompacto, para no pisar un toggle manual del usuario en
  // tamaño normal.
  //
  // Este hook (como todos los de App) tiene que quedar ANTES de los early
  // return de login/select de abajo — Rules of Hooks: un hook detrás de un
  // return condicional se salta en esos renders y React explota ("Rendered
  // more hooks than during the previous render").
  useEffect(() => {
    if (compactSidebar) syncAccordionCompacto(screen);
    else { setAbmExpanded(true); setOtrosExpanded(true); setHerramientasExpanded(false); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compactSidebar]);

  if (screen === "login") return <LoginScreen onLogin={() => setScreen("select")} />;
  if (screen === "select") return <SelectScreen onSelect={(v) => setScreen(v === "nuevo" ? "welcome" : "select")} />;

  // Navega a una tabla ABM específica — usado tanto por los hijos del
  // sidebar como por el selector interno de AbmScreen, así ambos quedan
  // sincronizados sobre el mismo estado sin duplicarlo. Siempre expande el
  // padre "ABM" del sidebar si estaba colapsado. Cualquier navegación por
  // esta vía es "normal" — descarta el botón "Volver" si estaba armado.
  function goToAbmTable(k: AbmTableKey) {
    setScreen(k);
    setLastAbmTable(k);
    setAbmExpanded(true);
    setHerramientasExpanded(false);
    if (compactSidebar) setOtrosExpanded(false);
    setVolverA(null);
  }

  // Click en el ítem padre "ABM": navega a la última tabla activa (o CDS2
  // la primera vez) y despliega/colapsa los hijos. En el acordeón compacto,
  // abrir ABM cierra "Otros" (uno-abierto-a-la-vez).
  function handleAbmParentClick() {
    const next = !abmExpanded;
    setScreen(lastAbmTable);
    setAbmExpanded(next);
    if (next) setHerramientasExpanded(false);
    if (compactSidebar && next) setOtrosExpanded(false);
    setVolverA(null);
  }

  // Click en el padre "Herramientas": despliega/pliega los ítems, sin
  // navegar (no es una pantalla). Abrirlo pliega ABM (uno abierto a la
  // vez) y, en el acordeón compacto, también "Otros". Con el sidebar
  // colapsado no hay dónde mostrar los ítems: expande el sidebar y abre
  // el grupo.
  function handleHerramientasParentClick() {
    const next = collapsed ? true : !herramientasExpanded;
    if (collapsed) setCollapsed(false);
    setHerramientasExpanded(next);
    if (next) {
      setAbmExpanded(false);
      if (compactSidebar) setOtrosExpanded(false);
    }
  }

  // Click en el header "Otros" — solo clickeable en el acordeón compacto
  // (ver sidebar): en tamaño normal sigue siendo un label fijo, decisión de
  // diseño ya tomada que no se toca fuera de tier 760px.
  function handleOtrosParentClick() {
    const next = !otrosExpanded;
    setOtrosExpanded(next);
    if (compactSidebar && next) { setAbmExpanded(false); setHerramientasExpanded(false); }
  }

  // Navegación a Inicio (sidebar) — sin estado previo que restaurar, igual
  // que irAConsultas.
  function irAInicio() {
    setVolverA(null);
    setScreen("welcome");
    syncAccordionCompacto("welcome");
  }

  function irAOtroScreen(s: Screen) {
    setVolverA(null);
    setScreen(s);
    syncAccordionCompacto(s);
  }

  // Navegación normal a Consultas de interrupción (sidebar) — sin estado
  // previo que restaurar.
  function irAConsultas() {
    setModificarInitialRelTab(null);
    setModificarInitialReferencia(null);
    setModificarInitialReposicion(null);
    setVolverA(null);
    setScreen("modificar");
    syncAccordionCompacto("modificar");
  }

  function irAAbmConDeepLink(link: AbmDeepLink) {
    setAbmDeepLink(link);
    goToAbmTable(link.tableKey); // limpia volverA...
    setVolverA({ relTab: link.relTabOrigen ?? null, referencia: link.referenciaOrigen ?? null, reposicion: link.reposicionOrigen ?? null }); // ...y lo vuelve a armar
  }

  // Botón "Volver a Consultas de interrupción" del masthead de AbmScreen —
  // restaura la misma interrupción, el mismo tab del modal "Tablas
  // relacionadas" (si lo hay) y la misma reposición.
  function volverAConsultas() {
    setModificarInitialRelTab(volverA?.relTab ?? null);
    setModificarInitialReferencia(volverA?.referencia ?? null);
    setModificarInitialReposicion(volverA?.reposicion ?? null);
    setVolverA(null);
    setScreen("modificar");
    syncAccordionCompacto("modificar");
  }

  return (
    <div className="font-sans" style={{
      width: "100%", height: "100vh", display: "flex",
      backgroundColor: "var(--color-bg-app)",
      overflow: "hidden",
    }}>

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside style={{
        // Tier 760px: sidebar ~26% más angosto (256 → 190) para devolverle
        // ancho horizontal al contenido — es justo lo que le faltaba a la
        // barra de Búsqueda. Los labels largos ("Alta, Baja y Modificación")
        // truncan con ellipsis + title (tooltip nativo) si no entran, en vez
        // de encimarse o cortarse sin indicación.
        width: collapsed ? 60 : compactSidebar ? 190 : 256,
        transition: "width var(--duration-slow) var(--ease-standard)",
        backgroundColor: "var(--color-bg-app)",
        display: "flex", flexDirection: "column",
        flexShrink: 0, overflow: "hidden",
        borderRight: "1px solid var(--color-border)",
      }}>
        {/* Logo + collapse */}
        <div className="flex items-center gap-2 px-3 border-b border-border" style={{ minHeight: "var(--header-min-height, 60px)", paddingTop: 10, paddingBottom: 10 }}>
          {!collapsed ? (
            <>
              <button
                type="button"
                onClick={irAInicio}
                title="Ir a Inicio"
                className="flex-1 flex items-center overflow-hidden cursor-pointer"
                style={{ height: 38 }}
              >
                <div style={{ transform: "scale(0.68)", transformOrigin: "left center", pointerEvents: "none" }}>
                  <Logo />
                </div>
              </button>
              <button
                onClick={() => setCollapsed(true)}
                className={`shrink-0 ${ICON_BTN_SM} flex items-center justify-center rounded-sm text-icon hover:text-text hover:bg-fill-muted transition-colors`}
                title="Colapsar"
              >
                <ChevronLeft size={ICON.md} strokeWidth={1.5} />
              </button>
            </>
          ) : (
            /* Collapsed: small E monogram matching brand blue */
            <button
              onClick={() => setCollapsed(false)}
              className={`mx-auto ${ICON_BTN_SM} flex items-center justify-center rounded-sm transition-colors hover:bg-fill-muted`}
              title="Expandir"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-heading-sm text-white bg-brand-gradient"
              >E</div>
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2" style={{ scrollbarWidth: "none" }}>
          <div className="flex flex-col gap-0.5">
            <NavItem
              label="Inicio"
              icon={<Home size={ICON.md} strokeWidth={1.5} />}
              active={screen === "welcome"}
              collapsed={collapsed}
              onClick={irAInicio}
            />
            <NavItem
              label="Consultas de interrupción"
              icon={<Search size={ICON.md} strokeWidth={1.5} />}
              active={screen === "modificar"}
              collapsed={collapsed}
              onClick={irAConsultas}
            />
          </div>

          <div className={`my-2 border-t border-border ${collapsed ? "mx-auto w-8" : "mx-1"}`} />

          {/* ABM — ítem padre desplegable (acordeón), ahora con el MISMO lenguaje
              visual (ícono + texto) que Inicio/Consultas en los dos estados del
              sidebar — antes tenía dos renders distintos (caption chico sin ícono
              expandido, NavItem con ícono colapsado). Click navega a la última
              tabla activa (o CDS2 la primera vez) y despliega/colapsa los hijos. */}
          <button
            type="button"
            onClick={handleAbmParentClick}
            aria-expanded={abmExpanded}
            title={!collapsed ? "Alta, Baja y Modificación" : undefined}
            style={{ position: "relative" }}
            className={`sidebar-item-btn w-full flex items-center gap-2 rounded-sm border transition-colors duration-(--duration-base) group
              ${collapsed ? "justify-center py-[9px] mx-auto w-9" : "px-[9px] py-[6px]"}
              ${isAbmTableKey(screen)
                ? "border-transparent bg-secondary/10 text-secondary"
                : "border-transparent text-text hover:bg-fill-muted"
              }`}
          >
            <span className="shrink-0"><Pencil size={ICON.md} strokeWidth={1.5} fill={isAbmTableKey(screen) ? "currentColor" : "none"} /></span>
            {!collapsed && (
              <>
                <span className="flex-1 min-w-0 truncate text-body text-left">Alta, Baja y Modificación</span>
                <span className={`shrink-0 transition-transform duration-(--duration-base) ${abmExpanded ? "" : "-rotate-90"}`}>
                  <ChevronDown size={ICON.md} strokeWidth={1.5} />
                </span>
              </>
            )}
            {collapsed && (
              <span className="sidebar-item-tooltip">Alta, Baja y Modificación</span>
            )}
          </button>

          {abmExpanded && !collapsed && (
            <div className="flex flex-col gap-0.5 pl-3 ml-2.5 border-l border-border">
              {ABM_ITEMS.map((item, i) => (
                <NavItem
                  key={item.key ?? item.code + i}
                  label={item.label}
                  active={item.screen !== undefined && item.screen === screen}
                  collapsed={collapsed}
                  onClick={item.screen ? () => goToAbmTable(item.screen as AbmTableKey) : undefined}
                />
              ))}
            </div>
          )}

          {/* Herramientas — grupo desplegable con el mismo lenguaje que ABM
              (ícono + texto + chevron, hijos con guía vertical). Abre las
              herramientas que antes eran la fila de botones de Consultas
              de interrupción; ver HERRAMIENTAS_ITEMS. */}
          <button
            type="button"
            onClick={handleHerramientasParentClick}
            aria-expanded={herramientasExpanded}
            title={!collapsed ? "Herramientas" : undefined}
            style={{ position: "relative" }}
            className={`sidebar-item-btn w-full flex items-center gap-2 rounded-sm border transition-colors duration-(--duration-base) group mt-0.5
              ${collapsed ? "justify-center py-[9px] mx-auto w-9" : "px-[9px] py-[6px]"}
              border-transparent text-text hover:bg-fill-muted`}
          >
            <span className="shrink-0"><Wrench size={ICON.md} strokeWidth={1.5} /></span>
            {!collapsed && (
              <>
                <span className="flex-1 min-w-0 truncate text-body text-left">Herramientas</span>
                <span className={`shrink-0 transition-transform duration-(--duration-base) ${herramientasExpanded ? "" : "-rotate-90"}`}>
                  <ChevronDown size={ICON.md} strokeWidth={1.5} />
                </span>
              </>
            )}
            {collapsed && (
              <span className="sidebar-item-tooltip">Herramientas</span>
            )}
          </button>

          {herramientasExpanded && !collapsed && (
            <div className="flex flex-col gap-0.5 pl-3 ml-2.5 border-l border-border">
              {HERRAMIENTAS_ITEMS.map((item) => (
                <NavItem
                  key={item.key}
                  label={item.label}
                  collapsed={collapsed}
                  disabled={item.pendiente}
                  disabledTitle="Pendiente: depende de la interrupción seleccionada en Consultas de interrupción"
                  onClick={item.pendiente ? undefined : () => setHerramientaAbierta(item.key)}
                />
              ))}
            </div>
          )}

          {/* Otros group — label fijo, no clickeable, en tamaño normal
              (decisión de diseño ya tomada). Solo en el acordeón compacto
              (tier 760px) se vuelve un disclosure como el de ABM, porque
              ahí sí hace falta poder colapsarlo para que ambos grupos no
              se corten contra el footer. */}
          {collapsed ? (
            <div className="my-3 border-t border-border mx-auto w-8" />
          ) : compactSidebar ? (
            <button
              type="button"
              onClick={handleOtrosParentClick}
              aria-expanded={otrosExpanded}
              className="w-full flex items-center gap-1 px-1 pt-5 pb-1.5 text-heading-xs uppercase text-text-muted select-none hover:text-text transition-colors"
            >
              <span className="flex-1 text-left">Otros</span>
              <span className={`shrink-0 transition-transform duration-(--duration-base) ${otrosExpanded ? "" : "-rotate-90"}`}>
                <ChevronDown size={ICON.md} strokeWidth={1.5} />
              </span>
            </button>
          ) : (
            <p className="px-1 pt-5 pb-1.5 text-heading-xs uppercase text-text-muted select-none">Otros</p>
          )}
          {(!compactSidebar || otrosExpanded) && !collapsed && (
            <div className="flex flex-col gap-0.5">
              {OTROS_ITEMS.map((item) => (
                <NavItem
                  key={item.label}
                  label={item.label}
                  icon={item.icon}
                  active={screen === item.screen}
                  collapsed={collapsed}
                  onClick={() => irAOtroScreen(item.screen)}
                />
              ))}
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="border-t border-border px-2 py-2.5">
          <UserMenu collapsed={collapsed} onLogout={() => setScreen("login")} />
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {isAbmTableKey(screen) ? (
          <AbmScreen
            tableKey={screen}
            onChangeTable={goToAbmTable}
            deepLink={abmDeepLink}
            onDeepLinkConsumed={() => setAbmDeepLink(null)}
            volverVisible={volverA !== null}
            onVolver={volverAConsultas}
          />
        ) : (
          <>
            {/* Encabezado de página de Consultas de interrupción — apoyado en
                el fondo, sin borde inferior: breadcrumb (Inicio > pantalla)
                y debajo el título de la vista, con el selector de período a
                la derecha, a la altura del título. Solo esta pantalla; el
                resto sigue con el top bar de abajo. */}
            {screen === "modificar" ? (
              <header className="px-5 pt-4 shrink-0">
                <nav aria-label="Ruta" className="flex items-center gap-1.5 text-body-sm text-text-muted">
                  <button
                    type="button"
                    onClick={irAInicio}
                    aria-label="Inicio"
                    title="Inicio"
                    className={`flex items-center rounded-xs text-text-muted hover:text-text transition-colors ${FOCUS_RING}`}
                  >
                    <Home size={ICON.sm} strokeWidth={1.5} aria-hidden />
                  </button>
                  <ChevronRight size={ICON.xs} strokeWidth={1.5} aria-hidden className="text-text-faint" />
                  <span aria-current="page">Consultas de interrupción</span>
                </nav>
                <div className="mt-1 flex items-center gap-4">
                  <h1 className="flex-1 min-w-0 truncate text-heading-lg text-text">Búsqueda de interrupciones</h1>
                  <PeriodSelector />
                </div>
              </header>
            ) : (
            /* Top bar — reservado para título de pantalla + selector de
                período, transversal al resto de la app: no le agregues nada
                más acá. Consultas de interrupción usa su propio encabezado
                de página (arriba). */
            <header
              className="flex items-center px-6 border-b border-border bg-bg-app shrink-0"
              style={{ minHeight: "var(--header-min-height, 60px)" }}
            >
              <div className="flex items-center gap-2.5 flex-1">
                {screen === "welcome" && (
                  <h1 className="text-heading-md text-text">Inicio</h1>
                )}
                {screen === "generaciontxt" && <h1 className="text-heading-md text-text">Generación de txt</h1>}
                {screen === "planillaconsolidada" && <h1 className="text-heading-md text-text">Planilla consolidada</h1>}
                {screen === "gestornotas" && <h1 className="text-heading-md text-text">Gestor de notas</h1>}
                {screen === "insertaclientes" && <h1 className="text-heading-md text-text">Inserta clientes en BDTH</h1>}
                {screen === "auditoria" && <h1 className="text-heading-md text-text">Reporte de auditoría</h1>}
              </div>
              <PeriodSelector />
            </header>
            )}

            {/* Content */}
            {screen === "welcome" && <WelcomeContent onIrATabla={goToAbmTable} />}
            {screen === "modificar" && (
              <ModificarContent
                onIrAAbm={irAAbmConDeepLink}
                initialRelTab={modificarInitialRelTab}
                initialReferencia={modificarInitialReferencia}
                initialReposicion={modificarInitialReposicion}
              />
            )}
            {screen === "generaciontxt" && <GeneracionTxtContent />}
            {screen === "planillaconsolidada" && <PlanillaConsolidadaContent />}
            {screen === "gestornotas" && <GestorNotasContent />}
            {screen === "insertaclientes" && <InsertaClientesContent />}
            {screen === "auditoria" && <AuditoriaContent />}
          </>
        )}
      </div>

      {/* Herramientas abiertas desde el menú lateral — viven acá (no en una
          pantalla) para abrirse desde cualquier pantalla. */}
      <LotesModal open={herramientaAbierta === "lotes"} onClose={() => setHerramientaAbierta(null)} />
    </div>
  );
}
