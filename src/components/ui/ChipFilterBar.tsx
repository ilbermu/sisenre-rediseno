import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Plus, Search, SlidersHorizontal, X } from "lucide-react";
import AnchoredPopover from "@/components/ui/AnchoredPopover";
import FieldLabel from "@/components/ui/FieldLabel";
import { FilterTriggerButton, RANGO_TEXTO_VACIO, RangoTexto } from "@/components/ui/FilterTrigger";
import RangoFechaCalendario, { rangoDePeriodo } from "@/components/ui/RangoFechaCalendario";
import { FOCUS_RING, ghostBtnCls, ICON, ICON_BTN_XS, MOD_FIELD_CLS } from "@/components/ui/tokens";

// ─── Tipos y helpers ──────────────────────────────────────────────────────────

export type ChipFiltroOpcion = string | { value: string; label: string };

// Un filtro de la barra. `campo` es la clave del valor (en el ABM, la columna
// de la fila). El editor define el popover y cómo se filtra:
//   "lista"    → opciones, igualdad exacta
//   "busqueda" → lista larga con buscador, igualdad exacta
//   "texto"    → input libre, "contiene" sin distinguir mayúsculas
//   "fecha"    → rango desde/hasta (ver valorDeRango)
export type ChipFiltroDef = {
  campo: string;
  // Nombre completo: "Agregar filtro", editor, title / aria-label del chip.
  label: string;
  // Texto del chip. En el ABM: el encabezado de la columna del campo
  // (regla verificada en desarrollo, ver encabezadosInconsistentes). Sin
  // chipLabel, `label`.
  chipLabel?: string;
  // El chip con valor muestra solo el valor — únicamente para campos cuyos
  // valores se explican solos (descripciones, nombres); nunca para Sí/No,
  // códigos o números.
  soloValor?: boolean;
  editor: "lista" | "busqueda" | "texto" | "fecha";
  // Lista fija, o función de los valores de la barra (opciones
  // dependientes, ej. Localidad según Partido).
  opciones?: ChipFiltroOpcion[] | ((valores: Record<string, string>) => ChipFiltroOpcion[]);
  // Lista vacía (ej. Localidad sin Partido). Default "Sin opciones".
  emptyMessage?: string;
};

// El valor de un filtro "fecha" viaja como string (todos los valores de la
// barra son string, "" = sin filtro): "desdeFecha|desdeHora|hastaFecha|hastaHora",
// más "|periodo" si vino del atajo "Período completo" (la barra lo
// actualiza al cambiar de período).
const MARCA_PERIODO = "periodo";
export function valorDeRango(r: RangoTexto, esPeriodo = false): string {
  if (!r.desdeFecha && !r.hastaFecha) return "";
  return [r.desdeFecha, r.desdeHora, r.hastaFecha, r.hastaHora, ...(esPeriodo ? [MARCA_PERIODO] : [])].join("|");
}
export const esRangoDePeriodo = (v: string) => v.split("|")[4] === MARCA_PERIODO;
export function rangoDeValor(v: string): RangoTexto {
  if (!v) return RANGO_TEXTO_VACIO;
  const [desdeFecha = "", desdeHora = "", hastaFecha = "", hastaHora = ""] = v.split("|");
  return { desdeFecha, desdeHora, hastaFecha, hastaHora };
}

// "dd/mm" + " hh:mm" solo si se cargó hora.
function extremoCorto(fecha: string, hora: string): string {
  const [, m, d] = fecha.split("-");
  return `${d}/${m}${hora ? ` ${hora}` : ""}`;
}
function textoRango(v: string): string {
  const r = rangoDeValor(v);
  const desde = r.desdeFecha ? extremoCorto(r.desdeFecha, r.desdeHora) : "";
  const hasta = r.hastaFecha ? extremoCorto(r.hastaFecha, r.hastaHora) : "";
  if (desde && hasta) return `${desde} – ${hasta}`;
  return desde ? `desde ${desde}` : `hasta ${hasta}`;
}

const normalizar = (o: ChipFiltroOpcion) => (typeof o === "string" ? { value: o, label: o } : o);

// Texto visible del valor de un filtro (etiqueta de la opción, rango legible).
function opcionesDe(def: ChipFiltroDef, valores: Record<string, string>): { value: string; label: string }[] {
  const o = typeof def.opciones === "function" ? def.opciones(valores) : def.opciones;
  return (o ?? []).map(normalizar);
}

function textoValor(def: ChipFiltroDef, v: string, valores: Record<string, string>): string {
  if (def.editor === "fecha") return textoRango(v);
  return opcionesDe(def, valores).find((o) => o.value === v)?.label ?? v;
}

const ID_DEBOUNCE_MS = 500;
// Ancho máximo de un chip: el valor trunca con "…" y el texto completo va
// en el `title` del chip.
const CHIP_MAX = 200;

// Ítem de menú/lista de los popovers — el de la lista de FilterTrigger.
const itemCls = (sel: boolean) =>
  `w-full px-2.5 py-2 rounded-sm border text-left text-body transition-colors flex items-center gap-2 ${FOCUS_RING} ${
    sel ? "bg-primary-tint border-primary text-secondary" : "border-transparent text-text hover:bg-fill-muted"
  }`;

// ─── Editores ─────────────────────────────────────────────────────────────────

type OpcionNormal = { value: string; label: string };

function EditorLista({ def, opciones, valor, onAplicar }: { def: ChipFiltroDef; opciones: OpcionNormal[]; valor: string; onAplicar: (v: string) => void }) {
  const iFoco = Math.max(0, opciones.findIndex((o) => o.value === valor));
  return (
    <div role="listbox" aria-label={def.label} className="p-1.5 flex flex-col gap-0.5 min-w-40 max-h-80 overflow-y-auto">
      {opciones.length === 0 && <p className="px-2.5 py-2 text-body-sm text-text-muted">{def.emptyMessage ?? "Sin opciones"}</p>}
      {opciones.map((o, i) => (
        <button
          key={o.value}
          type="button"
          role="option"
          aria-selected={o.value === valor}
          autoFocus={i === iFoco}
          onClick={() => onAplicar(o.value)}
          className={itemCls(o.value === valor) + " whitespace-nowrap"}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function EditorBusqueda({ def, opciones, valor, onAplicar }: { def: ChipFiltroDef; opciones: OpcionNormal[]; valor: string; onAplicar: (v: string) => void }) {
  const [filtro, setFiltro] = useState("");
  const visibles = filtro ? opciones.filter((o) => o.label.toLowerCase().includes(filtro.toLowerCase())) : opciones;
  return (
    <div role="dialog" aria-label={`Filtrar por ${def.label.toLowerCase()}`} className="flex flex-col" style={{ width: 320 }}>
      <div className="p-1.5 border-b border-border-subtle shrink-0">
        <input
          autoFocus
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && visibles.length === 1 && onAplicar(visibles[0].value)}
          placeholder="Buscar..."
          aria-label={`Buscar ${def.label.toLowerCase()}`}
          className={MOD_FIELD_CLS + " h-(--control-sm)! text-body-sm"}
        />
      </div>
      <div role="listbox" aria-label={def.label} className="p-1.5 flex flex-col gap-0.5 overflow-y-auto" style={{ maxHeight: 320 }}>
        {visibles.length === 0 ? (
          <p className="px-2.5 py-2 text-body-sm text-text-muted">{opciones.length === 0 ? (def.emptyMessage ?? "Sin opciones") : "Sin resultados"}</p>
        ) : (
          visibles.map((o) => (
            <button
              key={o.value}
              type="button"
              role="option"
              aria-selected={o.value === valor}
              onClick={() => onAplicar(o.value)}
              className={itemCls(o.value === valor)}
            >
              <span className="min-w-0 truncate">{o.label}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

function EditorTexto({ def, valor, onAplicar }: { def: ChipFiltroDef; valor: string; onAplicar: (v: string) => void }) {
  const [texto, setTexto] = useState(valor);
  const id = `chip-filtro-${def.campo}`;
  return (
    <div role="dialog" aria-label={`Filtrar por ${def.label.toLowerCase()}`} className="p-3" style={{ width: 260 }}>
      <FieldLabel htmlFor={id}>{def.label}</FieldLabel>
      <input
        id={id}
        autoFocus
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onAplicar(texto.trim())}
        className={MOD_FIELD_CLS}
      />
      <p className="mt-1.5 text-caption text-text-muted">Enter para aplicar</p>
    </div>
  );
}

// ─── Piezas de la barra ──────────────────────────────────────────────────────

type ChipFilterBarProps = {
  id: string;
  onIdChange: (v: string) => void;
  idPlaceholder: string;
  visibles: ChipFiltroDef[];
  agregables: ChipFiltroDef[];
  valores: Record<string, string>;
  onChange: (campo: string, valor: string) => void;
  // Limpia el ID y todos los filtros (la barra ya vacía sus agregados).
  onLimpiar: () => void;
  // Período del PeriodSelector de la pantalla (ej. "Agosto 2026"): el atajo
  // "Período completo" del editor de fecha.
  periodo?: string;
};

// ID: aplica con Enter o a los 500 ms de dejar de tipear.
function useBorradorId(id: string, onIdChange: (v: string) => void) {
  const [borradorId, setBorradorId] = useState(id);
  useEffect(() => setBorradorId(id), [id]);
  useEffect(() => {
    if (borradorId === id) return;
    const t = setTimeout(() => onIdChange(borradorId), ID_DEBOUNCE_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [borradorId]);
  return [borradorId, setBorradorId] as const;
}

// Un filtro de fecha aplicado con "Período completo" sigue al período: si
// cambia, se actualiza al nuevo.
function useSeguirPeriodo(periodo: string | undefined, defs: ChipFiltroDef[], valores: Record<string, string>, onChange: (campo: string, valor: string) => void) {
  useEffect(() => {
    const rango = periodo ? rangoDePeriodo(periodo) : null;
    if (!rango) return;
    for (const d of defs) {
      const v = valores[d.campo] ?? "";
      if (d.editor !== "fecha" || !esRangoDePeriodo(v)) continue;
      const nuevo = valorDeRango(rango, true);
      if (nuevo !== v) onChange(d.campo, nuevo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodo]);
}

// Input de ID: lupa, valor en mono (placeholder en fuente de texto) y ✕ para
// borrarlo. El ancho lo pone quien lo usa (`className`).
function InputId({
  borrador,
  setBorrador,
  onIdChange,
  placeholder,
  className,
  divRef,
}: {
  borrador: string;
  setBorrador: (v: string) => void;
  onIdChange: (v: string) => void;
  placeholder: string;
  className: string;
  divRef?: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div ref={divRef} className={`relative ${className}`}>
      <span className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-icon">
        <Search size={ICON.sm} strokeWidth={1.5} />
      </span>
      <input
        value={borrador}
        onChange={(e) => setBorrador(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onIdChange(borrador);
        }}
        placeholder={placeholder}
        aria-label={placeholder}
        className={MOD_FIELD_CLS + " pl-8 pr-8 text-code! font-mono placeholder:font-sans"}
      />
      {borrador && (
        <button
          type="button"
          aria-label="Borrar ID"
          onClick={() => {
            setBorrador("");
            onIdChange("");
          }}
          className={`${ICON_BTN_XS} absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-sm text-icon hover:bg-fill-muted hover:text-text transition-colors ${FOCUS_RING}`}
        >
          <X size={ICON.sm} strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
}

// Editor del filtro abierto, según su tipo.
function EditorDeFiltro({
  def,
  valores,
  periodo,
  onAplicar,
}: {
  def: ChipFiltroDef;
  valores: Record<string, string>;
  periodo?: string;
  onAplicar: (v: string) => void;
}) {
  const valor = valores[def.campo] ?? "";
  if (def.editor === "lista") return <EditorLista def={def} opciones={opcionesDe(def, valores)} valor={valor} onAplicar={onAplicar} />;
  if (def.editor === "busqueda") return <EditorBusqueda def={def} opciones={opcionesDe(def, valores)} valor={valor} onAplicar={onAplicar} />;
  if (def.editor === "texto") return <EditorTexto def={def} valor={valor} onAplicar={onAplicar} />;
  return (
    <RangoFechaCalendario
      label={def.label}
      inicial={rangoDeValor(valor)}
      inicialPeriodo={esRangoDePeriodo(valor)}
      periodo={periodo}
      onApply={(r, esPeriodo) => onAplicar(r ? valorDeRango(r, esPeriodo) : "")}
    />
  );
}

// Chip de un filtro en la barra.
function ChipDeFiltro({
  def,
  valores,
  open,
  maxWidth,
  buttonRef,
  onToggle,
  onClear,
}: {
  def: ChipFiltroDef;
  valores: Record<string, string>;
  open: boolean;
  maxWidth: number;
  buttonRef: (el: HTMLButtonElement | null) => void;
  onToggle: () => void;
  onClear: () => void;
}) {
  const v = valores[def.campo] ?? "";
  return (
    <div className="shrink-0 min-w-0 flex">
      <FilterTriggerButton
        buttonRef={buttonRef}
        label={def.label}
        etiqueta={def.chipLabel}
        soloValor={def.soloValor}
        aplicado={v ? textoValor(def, v, valores) : null}
        open={open}
        onToggle={onToggle}
        onClear={onClear}
        size="md"
        maxWidth={maxWidth}
        valorDestacado
        chevronConValor={false}
        haspopup={def.editor === "lista" || def.editor === "busqueda" ? "listbox" : "dialog"}
      />
    </div>
  );
}

// ─── ChipFilterBar ────────────────────────────────────────────────────────────

type Abierto = { campo: string; ancla: "chip" | "boton" };

// Barra de filtros híbrida (ver DESIGN_SYSTEM.md, "ChipFilterBar" y "Barra
// de filtros híbrida"): input de ID directo + chips de filtro que aplican al
// instante, sin botón Buscar. SIEMPRE una sola fila, todo a --control-md:
//   ID · chips visibles · │ chips agregados · [Más filtros | Agregar filtro] · (ml-auto) Limpiar filtros
// Controlada desde la pantalla: `id` y `valores` (campo → valor, "" = sin
// filtro) vienen por props y cada cambio se avisa al instante. Los chips
// agregados (cuáles están en la barra) son estado propio: un agregado sin
// valor existe solo mientras su editor está abierto.
export default function ChipFilterBar({
  id,
  onIdChange,
  idPlaceholder,
  visibles,
  agregables,
  valores,
  onChange,
  onLimpiar,
  periodo,
}: ChipFilterBarProps) {
  const [borradorId, setBorradorId] = useBorradorId(id, onIdChange);
  useSeguirPeriodo(periodo, [...visibles, ...agregables], valores, onChange);

  // ── Chips agregados (en orden de alta).
  const [agregados, setAgregados] = useState<string[]>(() => agregables.filter((d) => valores[d.campo]).map((d) => d.campo));
  const [abierto, setAbierto] = useState<Abierto | null>(null);
  const [menu, setMenu] = useState(false);
  // Un agregado sin valor (limpiado desde afuera) sale de la barra, salvo el
  // que se está editando.
  useEffect(() => {
    setAgregados((prev) => {
      const next = prev.filter((c) => valores[c] || abierto?.campo === c);
      return next.length === prev.length ? prev : next;
    });
  }, [valores, abierto]);

  const defs = useMemo(() => new Map([...visibles, ...agregables].map((d) => [d.campo, d])), [visibles, agregables]);
  // Orden de prioridad de lo que puede estar en la barra: los visibles, y
  // después los agregados en orden de alta.
  const secuencia = [...visibles, ...agregados.map((c) => defs.get(c)!)];
  const disponibles = agregables.filter((d) => !agregados.includes(d.campo));

  // ── Overflow: la barra nunca pasa de una línea. Se muestran el ID y los
  // chips de `secuencia` mientras entren; los que no entran se ocultan
  // empezando por el último y pasan al botón final "Más filtros" (sin
  // ocultos, ese botón es "Agregar filtro"). El ID es de ancho fijo
  // (--filter-id-w): no se achica. Los anchos naturales salen de una fila de
  // medición invisible; se recalcula con el ancho de la barra
  // (ResizeObserver) y al cambiar un filtro (un chip con valor cambia de
  // ancho), pero no mientras hay un popover abierto: los chips no se mueven
  // debajo del cursor.
  const barraRef = useRef<HTMLDivElement>(null);
  const idRef = useRef<HTMLDivElement>(null);
  const medidasRef = useRef(new Map<string, HTMLElement>());
  const refMedida = (clave: string) => (el: HTMLElement | null) => {
    if (el) medidasRef.current.set(clave, el);
    else medidasRef.current.delete(clave);
  };
  const [anchoBarra, setAnchoBarra] = useState(0);
  useLayoutEffect(() => {
    const el = barraRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setAnchoBarra(el.clientWidth));
    ro.observe(el);
    setAnchoBarra(el.clientWidth);
    return () => ro.disconnect();
  }, []);
  // Cantidad de ítems de `secuencia` que entran en la barra.
  const [enBarra, setEnBarra] = useState(secuencia.length);
  const hayAlgo = !!id || !!borradorId || [...visibles, ...agregables].some((d) => valores[d.campo]);
  const hayPopover = menu || abierto !== null;
  useLayoutEffect(() => {
    const barra = barraRef.current;
    if (!barra || anchoBarra === 0 || hayPopover) return;
    const gap = parseFloat(getComputedStyle(barra).columnGap) || 0;
    const ancho = (clave: string) => medidasRef.current.get(clave)?.offsetWidth ?? 0;
    const total = (n: number) => {
      const hayOcultos = n < secuencia.length;
      const anchos = [
        idRef.current?.offsetWidth ?? 0,
        ...secuencia.slice(0, n).map((d) => Math.min(ancho(`chip:${d.campo}`), CHIP_MAX)),
        ...(n > visibles.length ? [1] : []),
        ...(hayOcultos ? [ancho("mas")] : agregables.length > 0 ? [ancho("agregar")] : []),
        ...(hayAlgo ? [ancho("limpiar")] : []),
      ];
      return anchos.reduce((a, b) => a + b, 0) + gap * (anchos.length - 1);
    };
    let elegida = 0;
    for (let n = secuencia.length; n >= 0; n--) {
      if (total(n) <= anchoBarra) {
        elegida = n;
        break;
      }
    }
    setEnBarra((prev) => (prev === elegida ? prev : elegida));
  });
  const enBarraDefs = secuencia.slice(0, enBarra);
  const ocultos = secuencia.slice(enBarra);
  const ocultosActivos = ocultos.filter((d) => valores[d.campo]).length;
  const hayOcultos = ocultos.length > 0;

  // ── Anclas de los popovers.
  const chipRefs = useRef(new Map<string, HTMLButtonElement>());
  const botonRef = useRef<HTMLButtonElement>(null);
  const abiertoRef = useRef(abierto);
  abiertoRef.current = abierto;
  // El editor se ancla a su chip; si el chip está oculto, al botón final.
  const anclaEditor = useMemo<React.RefObject<HTMLElement | null>>(
    () => ({
      get current() {
        const a = abiertoRef.current;
        if (!a) return null;
        return (a.ancla === "chip" ? chipRefs.current.get(a.campo) : null) ?? botonRef.current;
      },
    }),
    [],
  );
  const refChip = (campo: string) => (el: HTMLButtonElement | null) => {
    if (el) chipRefs.current.set(campo, el);
    else chipRefs.current.delete(campo);
  };

  const quitarAgregado = (campo: string) => setAgregados((prev) => prev.filter((c) => c !== campo));

  function aplicar(campo: string, v: string) {
    onChange(campo, v);
    if (!v) quitarAgregado(campo);
    const ancla = anclaEditor.current;
    setAbierto(null);
    ancla?.focus();
  }
  function cerrarEditor() {
    if (abierto && agregables.some((d) => d.campo === abierto.campo) && !valores[abierto.campo]) quitarAgregado(abierto.campo);
    setAbierto(null);
  }
  function quitar(campo: string) {
    onChange(campo, "");
    if (agregados.includes(campo)) quitarAgregado(campo);
    if (abierto?.campo === campo) setAbierto(null);
  }
  function agregar(campo: string) {
    setAgregados((prev) => [...prev, campo]);
    setMenu(false);
    setAbierto({ campo, ancla: "chip" });
  }
  // Borra TODO: ID y todos los filtros, visibles u ocultos.
  function limpiarTodo() {
    setBorradorId("");
    setAgregados([]);
    setAbierto(null);
    setMenu(false);
    onLimpiar();
  }

  const chip = (def: ChipFiltroDef) => (
    <ChipDeFiltro
      key={def.campo}
      def={def}
      valores={valores}
      open={abierto?.campo === def.campo}
      maxWidth={CHIP_MAX}
      buttonRef={refChip(def.campo)}
      onToggle={() => (abierto?.campo === def.campo ? cerrarEditor() : setAbierto({ campo: def.campo, ancla: "chip" }))}
      onClear={() => quitar(def.campo)}
    />
  );

  // "Más filtros": con filtros ocultos activos, estilo seleccionado + contador.
  const masSel = ocultosActivos > 0 || (menu && hayOcultos);
  const masCls = `h-(--control-md) shrink-0 px-2.5 rounded-sm text-label border inline-flex items-center gap-1.5 whitespace-nowrap transition-colors ${
    masSel
      ? "bg-primary-tint border-chip-border text-secondary"
      : "border-transparent bg-transparent text-text hover:bg-primary-tint hover:border-primary hover:text-secondary"
  }`;
  const contador = (n: number) => (
    <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-secondary text-white text-caption font-semibold tabular-nums inline-flex items-center justify-center">
      {n}
    </span>
  );

  const defAbierto = abierto ? defs.get(abierto.campo) : undefined;
  const filaOculta = (d: ChipFiltroDef, i: number) => {
    const v = valores[d.campo] ?? "";
    const texto = v ? textoValor(d, v, valores) : "";
    return (
      <div key={d.campo} className="group flex items-center gap-1 rounded-sm hover:bg-fill-muted focus-within:bg-fill-muted">
        <button
          type="button"
          role="menuitem"
          autoFocus={i === 0}
          title={texto ? `${d.label}: ${texto}` : d.label}
          onClick={() => {
            setMenu(false);
            setAbierto({ campo: d.campo, ancla: "boton" });
          }}
          className={`flex-1 min-w-0 px-2.5 py-2 rounded-sm text-left text-body flex items-baseline justify-between gap-3 ${FOCUS_RING}`}
        >
          <span className="shrink-0 text-text">{d.chipLabel ?? d.label}</span>
          {texto ? <span className="min-w-0 truncate text-secondary font-semibold tabular-nums">{texto}</span> : <span className="shrink-0 text-text-muted">Todos</span>}
        </button>
        {texto && (
          <button
            type="button"
            aria-label={`Quitar filtro ${d.label}`}
            onClick={() => quitar(d.campo)}
            className={`${ICON_BTN_XS} shrink-0 mr-1 flex items-center justify-center rounded-sm text-icon opacity-60 group-hover:opacity-100 group-focus-within:opacity-100 hover:bg-fill-muted hover:text-text transition-[opacity,color,background-color] ${FOCUS_RING}`}
          >
            <X size={ICON.sm} strokeWidth={1.5} />
          </button>
        )}
      </div>
    );
  };

  return (
    <div ref={barraRef} className="relative shrink-0 flex items-center gap-2 flex-nowrap min-w-0">
      {/* Fila de medición: anchos naturales de lo que puede desbordar.
          Invisible, inerte y fuera del flujo. */}
      <div aria-hidden inert className="absolute left-0 top-0 invisible pointer-events-none flex items-center gap-2 whitespace-nowrap">
        {secuencia.map((d) => {
          const v = valores[d.campo] ?? "";
          return (
            <div key={d.campo} ref={refMedida(`chip:${d.campo}`)} className="shrink-0 flex">
              <FilterTriggerButton
                label={d.label}
                etiqueta={d.chipLabel}
                soloValor={d.soloValor}
                aplicado={v ? textoValor(d, v, valores) : null}
                open={false}
                onToggle={() => {}}
                onClear={() => {}}
                size="md"
                valorDestacado
                chevronConValor={false}
              />
            </div>
          );
        })}
        <span ref={refMedida("mas")} className={masCls}>
          <SlidersHorizontal size={ICON.sm} strokeWidth={1.5} />
          Más filtros
          {contador(secuencia.length)}
          <ChevronDown size={ICON.xs} strokeWidth={1.5} />
        </span>
        <span ref={refMedida("agregar")} className={`${ghostBtnCls("neutral")} h-(--control-md)! gap-1.5`}>
          <Plus size={ICON.sm} strokeWidth={1.5} />
          Agregar filtro
        </span>
        <span ref={refMedida("limpiar")} className="text-label">Limpiar filtros</span>
      </div>

      {/* 1. ID — ancho fijo (--filter-id-w): entra el placeholder más largo
          (el encabezado de la columna del ID) en todos los tiers. */}
      <InputId
        divRef={idRef}
        borrador={borradorId}
        setBorrador={setBorradorId}
        onIdChange={onIdChange}
        placeholder={idPlaceholder}
        className="shrink-0 w-(--filter-id-w)"
      />

      {/* 2. Chips visibles que entran, en su orden de prioridad. */}
      {enBarraDefs.slice(0, visibles.length).map((d) => chip(d))}

      {/* 3. Chips agregados que entran. */}
      {enBarra > visibles.length && <div className="w-px h-5 bg-border shrink-0" />}
      {enBarraDefs.slice(visibles.length).map((d) => chip(d))}

      {/* 4. Botón final: "Más filtros" si hay ocultos; si no, "Agregar
          filtro" (solo con agregables). */}
      {hayOcultos ? (
        <button
          ref={botonRef}
          type="button"
          aria-haspopup="menu"
          aria-expanded={menu}
          aria-label={ocultosActivos > 0 ? `Más filtros (${ocultosActivos} activos)` : undefined}
          onClick={() => setMenu(!menu)}
          className={`${masCls} ${FOCUS_RING}`}
        >
          <SlidersHorizontal size={ICON.sm} strokeWidth={1.5} />
          Más filtros
          {ocultosActivos > 0 && contador(ocultosActivos)}
          {menu ? <ChevronUp size={ICON.xs} strokeWidth={1.5} /> : <ChevronDown size={ICON.xs} strokeWidth={1.5} />}
        </button>
      ) : (
        agregables.length > 0 && (
          <button
            ref={botonRef}
            type="button"
            aria-haspopup="menu"
            aria-expanded={menu}
            disabled={disponibles.length === 0}
            onClick={() => setMenu(!menu)}
            className={`${ghostBtnCls("neutral")} shrink-0 h-(--control-md)! gap-1.5`}
          >
            <Plus size={ICON.sm} strokeWidth={1.5} />
            Agregar filtro
          </button>
        )
      )}

      {/* 5. Limpiar filtros — solo con algún filtro o ID cargado; borra
          todo, también lo oculto. */}
      {hayAlgo && (
        <button type="button" onClick={limpiarTodo} className={`ml-auto shrink-0 whitespace-nowrap rounded-sm text-label text-secondary hover:underline ${FOCUS_RING}`}>
          Limpiar filtros
        </button>
      )}

      {/* Popover del botón final. "Más filtros": los ocultos (nombre a la
          izquierda, valor o "Todos" a la derecha, ✕ con valor), un
          separador, "Más campos" y los agregables. "Agregar filtro": solo
          los agregables. */}
      <AnchoredPopover anchorRef={botonRef} open={menu} onClose={() => setMenu(false)} role="menu" ariaLabel={hayOcultos ? "Más filtros" : "Agregar filtro"}>
        <div className="p-1.5 flex flex-col gap-0.5" style={{ width: hayOcultos ? 300 : undefined, minWidth: hayOcultos ? undefined : 208 }}>
          {ocultos.map((d, i) => filaOculta(d, i))}
          {hayOcultos && disponibles.length > 0 && (
            <>
              <div className="my-1 border-t border-border-subtle" />
              <p className="px-2.5 pb-1 text-heading-xs uppercase text-text-muted select-none">Más campos</p>
            </>
          )}
          {disponibles.map((d, i) => (
            <button key={d.campo} type="button" role="menuitem" autoFocus={!hayOcultos && i === 0} onClick={() => agregar(d.campo)} className={itemCls(false) + " whitespace-nowrap"}>
              {d.label}
            </button>
          ))}
        </div>
      </AnchoredPopover>

      {/* Editor del filtro abierto — anclado a su chip (o al botón final). */}
      <AnchoredPopover anchorRef={anclaEditor} open={!!defAbierto} onClose={cerrarEditor} reposicionar={`${enBarra}|${anchoBarra}`}>
        {defAbierto && <EditorDeFiltro def={defAbierto} valores={valores} periodo={periodo} onAplicar={(v) => aplicar(defAbierto.campo, v)} />}
      </AnchoredPopover>
    </div>
  );
}
