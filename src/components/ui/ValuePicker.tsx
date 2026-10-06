import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, X } from "lucide-react";
import FieldLabel from "@/components/ui/FieldLabel";
import FloatingPanel, { useDentroDeModal } from "@/components/ui/FloatingPanel";
import { useDropdownDirection } from "@/components/ui/dropdown";
import { ICON, ICON_BTN_SM, MOD_FIELD_CLS, MOD_SELECT_CLS } from "@/components/ui/tokens";
import { CampoOpcion } from "@/data/types";

// Familia unificada "dropdown de valor" — reemplaza tanto al <select>
// nativo (chrome MOD_SELECT_CLS) como al combobox buscable: mismo trigger
// (<button> con flecha, borde/alto/radius de MOD_SELECT_CLS) y mismo chrome
// de panel (borde/radius/sombra/alto de fila/hover/selected), sea que el
// panel se abra inline (junto al trigger, con smart-positioning vía
// dropdownAnchorStyle/useDropdownDirection) o como modal centrado con
// backdrop (listas largas, ver `modal`). La única pieza que puede variar es
// el buscador arriba de la lista (`searchable`) — todo lo demás es un solo
// chrome, tanto si viene de un <select> corto sin buscador como de un
// combobox largo con buscador y modal.
export default function ValuePicker({
  label,
  opts,
  value,
  defaultValue = "",
  onChange,
  isDisabled = false,
  estadoCls = "",
  searchable = false,
  modal = false,
  modalTitle,
  emptyMessage = "Sin opciones",
  searchPlaceholder = "Buscar...",
  placeholder = "Seleccioná",
  wrapClassName = "w-full",
  triggerExtraClassName = "",
  triggerStyle,
}: {
  label?: string;
  opts: CampoOpcion[];
  value?: string;
  defaultValue?: string;
  onChange?: (v: string) => void;
  isDisabled?: boolean;
  estadoCls?: string;
  // Muestra el input de buscador arriba de la lista — el único elemento
  // que puede diferir entre un <select> corto (false) y un combobox
  // (true, sea inline o modal).
  searchable?: boolean;
  // Panel como modal centrado con backdrop en vez de panel inline — listas
  // largas (~20+ opciones) donde el panel inline ya no es usable.
  modal?: boolean;
  modalTitle?: string;
  emptyMessage?: string;
  searchPlaceholder?: string;
  placeholder?: string;
  wrapClassName?: string;
  triggerExtraClassName?: string;
  triggerStyle?: React.CSSProperties;
}) {
  const [open, setOpen] = useState(false);
  const [filtro, setFiltro] = useState("");
  // Uncontrolled fallback: mocks/estáticos que no traen value/onChange (ver
  // GenerarModal/ReplicarModal) igual necesitan mostrar y cambiar una
  // selección — mismo patrón que un <select> sin value controlado.
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const ref = useRef<HTMLDivElement>(null);
  // Panel inline: dentro de un Modal va en un portal (FloatingPanel), así
  // que el clic afuera tiene que contar también el panel como "adentro".
  const panelRef = useRef<HTMLDivElement>(null);
  const enModal = useDentroDeModal();

  useEffect(() => {
    if (modal || !open) return;
    const fn = (e: MouseEvent) => {
      const t = e.target as Node;
      if (ref.current && !ref.current.contains(t) && !panelRef.current?.contains(t)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [modal, open]);

  useEffect(() => {
    if (!modal || !open) return;
    // Captura + stopPropagation: si el ValuePicker vive dentro de un Modal,
    // Escape cierra solo esta lista, no también el Modal (que escucha
    // Escape en document, en fase de burbuja).
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        cerrar();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [modal, open]);

  const direction = useDropdownDirection(ref, open && !modal, searchable ? 450 : 260);

  // Si el campo pasa a no-editable (ej. se seleccionó una fila en
  // Resultados mientras el panel estaba abierto) no debe quedar un panel
  // huérfano abierto sobre un trigger ya bloqueado.
  useEffect(() => {
    if (isDisabled) setOpen(false);
  }, [isDisabled]);

  const normalizados = opts.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  const filtrados = filtro ? normalizados.filter((o) => o.label.toLowerCase().includes(filtro.toLowerCase())) : normalizados;
  const seleccionado = normalizados.find((o) => o.value === currentValue);

  function elegir(v: string) {
    if (!isControlled) setInternalValue(v);
    onChange?.(v);
    cerrar();
  }
  function cerrar() {
    setOpen(false);
    setFiltro("");
  }

  // Variante `modal` (listas largas): dentro de un Modal, scrim y panel van
  // en un portal a document.body (en --z-modal-popover), si no el transform
  // y el overflow del Modal los recortan.
  const enPortalSiModal = (nodo: React.ReactNode) => (enModal ? createPortal(nodo, document.body) : nodo);

  const buscador = searchable && (
    <div className="p-1.5 border-b border-border-subtle shrink-0">
      <input
        autoFocus
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        placeholder={searchPlaceholder}
        className={MOD_FIELD_CLS + " h-(--control-sm)! text-body-sm"}
      />
    </div>
  );

  const lista = (
    <div className={modal ? "flex-1 overflow-y-auto p-1.5 flex flex-col gap-0.5" : "p-1.5 flex flex-col gap-0.5 max-h-96 overflow-y-auto"}>
      {normalizados.length === 0 ? (
        <p className="px-2.5 py-2 text-body-sm text-text-muted">{emptyMessage}</p>
      ) : filtrados.length === 0 ? (
        <p className="px-2.5 py-2 text-body-sm text-text-muted">Sin resultados</p>
      ) : (
        filtrados.map((opt) => {
          const active = opt.value === currentValue;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => elegir(opt.value)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-sm border text-left transition-colors ${
                active ? "bg-primary-tint border-primary text-secondary" : "border-transparent text-text hover:bg-fill-muted"
              }`}
            >
              <span className="flex-1 min-w-0 truncate text-body">{opt.label}</span>
            </button>
          );
        })
      )}
    </div>
  );

  return (
    <div>
      {label && <FieldLabel>{label}</FieldLabel>}
      <div ref={ref} className={`relative ${wrapClassName}`}>
        <button
          type="button"
          disabled={isDisabled}
          onClick={() => setOpen((v) => !v)}
          style={triggerStyle}
          className={MOD_SELECT_CLS + " w-full" + estadoCls + " flex items-center text-left" + (!currentValue ? " !text-text-muted" : "") + triggerExtraClassName}
        >
          {/* || (no ??): value "" es "sin selección", no un valor real a
              mostrar — con ?? quedaría en blanco en vez del placeholder. */}
          <span className="block truncate">{seleccionado?.label || currentValue || placeholder}</span>
        </button>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-icon">
          <ChevronDown size={ICON.md} strokeWidth={1.5} />
        </div>
        <FloatingPanel
          anchorRef={ref}
          panelRef={panelRef}
          open={!modal && open && !isDisabled}
          direction={direction}
          gap={5}
          matchWidth
          className="shadow-md bg-surface rounded-md border border-border overflow-hidden"
        >
          {buscador}
          {lista}
        </FloatingPanel>
      </div>
      {modal && open && !isDisabled && enPortalSiModal(
        <>
          <div className={`fixed inset-0 ${enModal ? "z-(--z-modal-popover)" : "z-(--z-overlay)"} bg-scrim`} onClick={cerrar} />
          <div
            className={`shadow-lg fixed ${enModal ? "z-(--z-modal-popover)" : "z-(--z-modal)"} flex flex-col bg-surface rounded-xl overflow-hidden`}
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 440,
              maxWidth: "calc(100vw - 40px)",
              maxHeight: "calc(100vh - 80px)",
            }}
          >
            <div className="px-4 py-3 border-b border-border shrink-0 flex items-center justify-between gap-3">
              <p className="min-w-0 truncate text-heading-md text-text">{modalTitle ?? label ?? "Seleccionar"}</p>
              <button
                type="button"
                onClick={cerrar}
                className={`shrink-0 ${ICON_BTN_SM} flex items-center justify-center rounded-sm text-icon hover:bg-fill-muted hover:text-text transition-colors`}
              >
                <X size={ICON.sm} strokeWidth={1.5} />
              </button>
            </div>
            {buscador}
            {lista}
          </div>
        </>
      )}
    </div>
  );
}
