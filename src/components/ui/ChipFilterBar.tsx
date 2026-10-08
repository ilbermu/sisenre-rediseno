import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Plus, Search, SlidersHorizontal, X } from "lucide-react";
import AnchoredPopover from "@/components/ui/AnchoredPopover";
import FieldLabel from "@/components/ui/FieldLabel";
import { FilterTriggerButton, RANGO_TEXTO_VACIO, RangoTexto } from "@/components/ui/FilterTrigger";
import RangoFechaCalendario, { rangoDePeriodo } from "@/components/ui/RangoFechaCalendario";
import { FOCUS_RING, ghostBtnCls, ICON, ICON_BTN_MD, ICON_BTN_XS, MOD_FIELD_CLS } from "@/components/ui/tokens";

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
// Modo compacto (desborde, paso b): chips más angostos.
const CHIP_MAX_COMPACTO = 150;

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

// ─── Piezas compartidas por las dos variantes ────────────────────────────────

type ChipFilterBarProps = {
  // "completa" (default): la barra de los ABM. "compact": paneles angostos
  // (ID + Fecha + "Filtros" agrupados, ver ChipFilterBarCompacta).
  variant?: "completa" | "compact";
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

// Chip de un filtro en la barra (mismo aspecto en las dos variantes).
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

export default function ChipFilterBar(props: ChipFilterBarProps) {
  return props.variant === "compact" ? <ChipFilterBarCompacta {...props} /> : <ChipFilterBarCompleta {...props} />;
}

type Abierto = { campo: string; ancla: "chip" | "mas" };

// Barra de filtros híbrida (ver DESIGN_SYSTEM.md, "ChipFilterBar" y "Barra
// de filtros híbrida"): input de ID directo + chips de filtro que aplican al
// instante, sin botón Buscar. Una sola línea, todo a --control-md:
//   ID · chips visibles · │ chips agregados · +N filtros · Agregar filtro · (ml-auto) Limpiar filtros
// Controlada desde la pantalla: `id` y `valores` (campo → valor, "" = sin
// filtro) vienen por props y cada cambio se avisa al instante. Los chips
// agregados (cuáles están en la barra) son estado propio: un agregado sin
// valor existe solo mientras su editor está abierto.
function ChipFilterBarCompleta({
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
  const [menu, setMenu] = useState<"agregar" | "mas" | null>(null);
  // Un agregado sin valor (limpiado desde afuera) sale de la barra, salvo el
  // que se está editando.
  useEffect(() => {
    setAgregados((prev) => {
      const next = prev.filter((c) => valores[c] || abierto?.campo === c);
      return next.length === prev.length ? prev : next;
    });
  }, [valores, abierto]);

  const defs = useMemo(() => new Map([...visibles, ...agregables].map((d) => [d.campo, d])), [visibles, agregables]);
  const disponibles = agregables.filter((d) => !agregados.includes(d.campo));
  // Sin agregables (la tabla tiene 5 filtros o menos), no hay "Agregar
  // filtro".
  const hayAgregar = agregables.length > 0;

  // ── Desborde: la barra nunca pasa de una línea. Si no entra todo, en
  // orden: (a) los agregados, de derecha a izquierda, pasan a "+N filtros";
  // (b) modo compacto: "Agregar filtro" solo ícono y chips a 150px. El ID es
  // de ancho fijo (--filter-id-w): no se achica. Los visibles nunca
  // se ocultan. Los anchos naturales salen de una fila de medición
  // invisible; se recalcula al cambiar filtros y con el ancho de la barra
  // (ResizeObserver).
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
  const [disposicion, setDisposicion] = useState({ enBarra: agregados.length, compacto: false });
  const hayAlgo = !!id || !!borradorId || visibles.some((d) => valores[d.campo]) || agregados.some((c) => valores[c]);
  useLayoutEffect(() => {
    const barra = barraRef.current;
    if (!barra || anchoBarra === 0) return;
    const gap = parseFloat(getComputedStyle(barra).columnGap) || 0;
    const ancho = (clave: string) => medidasRef.current.get(clave)?.offsetWidth ?? 0;
    const chipAncho = (campo: string, cap: number) => Math.min(ancho(`chip:${campo}`), cap);
    const total = (n: number, compacto: boolean) => {
      const cap = compacto ? CHIP_MAX_COMPACTO : CHIP_MAX;
      const anchos = [
        idRef.current?.offsetWidth ?? 0,
        ...visibles.map((d) => chipAncho(d.campo, cap)),
        ...(agregados.length > 0 ? [1] : []),
        ...agregados.slice(0, n).map((c) => chipAncho(c, cap)),
        ...(n < agregados.length ? [ancho("mas")] : []),
        ...(hayAgregar ? [ancho(compacto ? "agregar-icono" : "agregar")] : []),
        ...(hayAlgo ? [ancho("limpiar")] : []),
      ];
      return anchos.reduce((a, b) => a + b, 0) + gap * (anchos.length - 1);
    };
    let elegida = { enBarra: 0, compacto: true };
    buscar: for (const compacto of [false, true]) {
      for (let n = agregados.length; n >= 0; n--) {
        if (total(n, compacto) <= anchoBarra) {
          elegida = { enBarra: n, compacto };
          break buscar;
        }
      }
    }
    setDisposicion((prev) => (prev.enBarra === elegida.enBarra && prev.compacto === elegida.compacto ? prev : elegida));
  });
  const agregadosVisibles = agregados.slice(0, disposicion.enBarra);
  const ocultos = agregados.slice(disposicion.enBarra);

  // ── Anclas de los popovers.
  const chipRefs = useRef(new Map<string, HTMLButtonElement>());
  const masRef = useRef<HTMLButtonElement>(null);
  const agregarRef = useRef<HTMLButtonElement>(null);
  const abiertoRef = useRef(abierto);
  abiertoRef.current = abierto;
  // El editor se ancla a su chip; si el chip está oculto (en "+N"), al "+N".
  const anclaEditor = useMemo<React.RefObject<HTMLElement | null>>(
    () => ({
      get current() {
        const a = abiertoRef.current;
        if (!a) return null;
        return (a.ancla === "chip" ? chipRefs.current.get(a.campo) : null) ?? masRef.current ?? agregarRef.current;
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
    setMenu(null);
    setAbierto({ campo, ancla: "chip" });
  }
  function limpiarTodo() {
    setBorradorId("");
    setAgregados([]);
    setAbierto(null);
    setMenu(null);
    onLimpiar();
  }

  const chipMax = disposicion.compacto ? CHIP_MAX_COMPACTO : CHIP_MAX;
  const chip = (def: ChipFiltroDef) => (
    <ChipDeFiltro
      key={def.campo}
      def={def}
      valores={valores}
      open={abierto?.campo === def.campo}
      maxWidth={chipMax}
      buttonRef={refChip(def.campo)}
      onToggle={() => (abierto?.campo === def.campo ? cerrarEditor() : setAbierto({ campo: def.campo, ancla: "chip" }))}
      onClear={() => quitar(def.campo)}
    />
  );

  // "+N filtros": chip pintado, mismo aspecto que un chip con valor.
  const masCls = "h-(--control-md) px-2.5 rounded-sm text-label border inline-flex items-center whitespace-nowrap bg-primary-tint border-primary text-secondary";

  const defAbierto = abierto ? defs.get(abierto.campo) : undefined;

  return (
    <div ref={barraRef} className="relative shrink-0 flex items-center gap-2 flex-nowrap min-w-0">
      {/* Fila de medición: anchos naturales de lo que puede desbordar.
          Invisible, inerte y fuera del flujo. */}
      <div aria-hidden inert className="absolute left-0 top-0 invisible pointer-events-none flex items-center gap-2 whitespace-nowrap">
        {[...visibles, ...agregados.map((c) => defs.get(c)!)].map((d) => {
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
        <span ref={refMedida("mas")} className={`${masCls} shrink-0`}>+{agregados.length} filtros</span>
        <span ref={refMedida("agregar")} className={`${ghostBtnCls("neutral")} h-(--control-md)! gap-1.5`}>
          <Plus size={ICON.sm} strokeWidth={1.5} />
          Agregar filtro
        </span>
        <span ref={refMedida("agregar-icono")} className={`${ghostBtnCls("neutral")} ${ICON_BTN_MD} px-0!`}>
          <Plus size={ICON.sm} strokeWidth={1.5} />
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

      {/* 2. Chips visibles — siempre en la barra. */}
      {visibles.map((d) => chip(d))}

      {/* 3. Chips agregados. */}
      {agregados.length > 0 && <div className="w-px h-5 bg-border shrink-0" />}
      {agregadosVisibles.map((c) => chip(defs.get(c)!))}

      {/* 4. "+N filtros" — los agregados que no entran. */}
      {ocultos.length > 0 && (
        <button
          ref={masRef}
          type="button"
          aria-haspopup="menu"
          aria-expanded={menu === "mas"}
          onClick={() => setMenu(menu === "mas" ? null : "mas")}
          className={`${masCls} shrink-0 ${FOCUS_RING}`}
        >
          +{ocultos.length} {ocultos.length === 1 ? "filtro" : "filtros"}
        </button>
      )}

      {/* 5. Agregar filtro — solo si la tabla tiene agregables. */}
      {hayAgregar && (
      <button
        ref={agregarRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={menu === "agregar"}
        aria-label={disposicion.compacto ? "Agregar filtro" : undefined}
        title={disposicion.compacto ? "Agregar filtro" : undefined}
        disabled={disponibles.length === 0}
        onClick={() => setMenu(menu === "agregar" ? null : "agregar")}
        className={`${ghostBtnCls("neutral")} shrink-0 ${disposicion.compacto ? `${ICON_BTN_MD} px-0!` : "h-(--control-md)! gap-1.5"}`}
      >
        <Plus size={ICON.sm} strokeWidth={1.5} />
        {!disposicion.compacto && "Agregar filtro"}
      </button>
      )}

      {/* 6. Limpiar filtros — solo con algún filtro o ID cargado. */}
      {hayAlgo && (
        <button type="button" onClick={limpiarTodo} className="ml-auto shrink-0 whitespace-nowrap text-label text-secondary hover:underline">
          Limpiar filtros
        </button>
      )}

      {/* Menú "Agregar filtro". */}
      <AnchoredPopover anchorRef={agregarRef} open={menu === "agregar"} onClose={() => setMenu(null)} role="menu" ariaLabel="Agregar filtro">
        <div className="p-1.5 flex flex-col gap-0.5 min-w-52">
          {disponibles.map((d, i) => (
            <button key={d.campo} type="button" role="menuitem" autoFocus={i === 0} onClick={() => agregar(d.campo)} className={itemCls(false) + " whitespace-nowrap"}>
              {d.label}
            </button>
          ))}
        </div>
      </AnchoredPopover>

      {/* Menú "+N filtros": filas con etiqueta + valor; ✕ ghost para quitar. */}
      <AnchoredPopover anchorRef={masRef} open={menu === "mas" && ocultos.length > 0} onClose={() => setMenu(null)} role="menu" ariaLabel="Filtros ocultos">
        <div className="p-1.5 flex flex-col gap-0.5" style={{ width: 280 }}>
          {ocultos.map((c, i) => {
            const d = defs.get(c)!;
            const v = valores[c] ?? "";
            const texto = v ? textoValor(d, v, valores) : "";
            return (
              <div key={c} className="group flex items-center gap-1 rounded-sm hover:bg-fill-muted focus-within:bg-fill-muted">
                <button
                  type="button"
                  role="menuitem"
                  autoFocus={i === 0}
                  title={texto ? `${d.label}: ${texto}` : d.label}
                  onClick={() => {
                    setMenu(null);
                    setAbierto({ campo: c, ancla: "mas" });
                  }}
                  className={`flex-1 min-w-0 px-2.5 py-2 rounded-sm text-left text-body flex items-baseline gap-1.5 ${FOCUS_RING}`}
                >
                  <span className="shrink-0 text-text-muted">{d.label}</span>
                  <span className="min-w-0 truncate text-text">{texto}</span>
                </button>
                <button
                  type="button"
                  aria-label={`Quitar filtro ${d.label}`}
                  onClick={() => quitar(c)}
                  className={`${ICON_BTN_XS} shrink-0 mr-1 flex items-center justify-center rounded-sm text-icon opacity-60 group-hover:opacity-100 group-focus-within:opacity-100 hover:bg-fill-muted hover:text-text transition-[opacity,color,background-color] ${FOCUS_RING}`}
                >
                  <X size={ICON.sm} strokeWidth={1.5} />
                </button>
              </div>
            );
          })}
        </div>
      </AnchoredPopover>

      {/* Editor del filtro abierto — anclado a su chip (o al "+N"). */}
      <AnchoredPopover
        anchorRef={anclaEditor}
        open={!!defAbierto}
        onClose={cerrarEditor}
        reposicionar={`${disposicion.enBarra}|${disposicion.compacto}|${anchoBarra}`}
      >
        {defAbierto && <EditorDeFiltro def={defAbierto} valores={valores} periodo={periodo} onAplicar={(v) => aplicar(defAbierto.campo, v)} />}
      </AnchoredPopover>
    </div>
  );
}

// ─── Variante compacta ────────────────────────────────────────────────────────

type AbiertoCompacta = { campo: string; ancla: "chip" | "filtros" };

// Variante compacta (`variant="compact"`, ver DESIGN_SYSTEM.md,
// "ChipFilterBar"): para paneles angostos (el maestro de un maestro-detalle).
// Siempre una sola fila, sin desborde que calcular:
//   ID (flexible, 160–260px) · chip Fecha · [Filtros ⌄] · (ml-auto) Limpiar
// El chip de fecha es el/los visibles con editor "fecha", igual que en la
// variante completa. Todos los demás filtros (los visibles que no son fecha
// y, debajo de "Más campos", los agregables) van agrupados en el popover de
// "Filtros" (300px, anclado al botón): una fila por filtro con el nombre a
// la izquierda y el valor a la derecha ("Todos" sin filtro); la fila abre el
// MISMO editor que su chip, anclado al botón "Filtros". Con alguno de esos
// filtros activo, el botón toma el estilo seleccionado y muestra cuántos, y
// aparece "Limpiar" (limpia solo los filtros del popover; ID y fecha tienen
// su ✕). Aplicación instantánea, como la completa.
function ChipFilterBarCompacta({ id, onIdChange, idPlaceholder, visibles, agregables, valores, onChange, periodo }: ChipFilterBarProps) {
  const [borradorId, setBorradorId] = useBorradorId(id, onIdChange);
  useSeguirPeriodo(periodo, [...visibles, ...agregables], valores, onChange);

  const fechas = visibles.filter((d) => d.editor === "fecha");
  const principales = visibles.filter((d) => d.editor !== "fecha");
  const enPanel = [...principales, ...agregables];
  const defs = useMemo(() => new Map([...visibles, ...agregables].map((d) => [d.campo, d])), [visibles, agregables]);
  const activos = enPanel.filter((d) => valores[d.campo]).length;

  const [panel, setPanel] = useState(false);
  const [abierto, setAbierto] = useState<AbiertoCompacta | null>(null);
  const chipRefs = useRef(new Map<string, HTMLButtonElement>());
  const filtrosRef = useRef<HTMLButtonElement>(null);
  const abiertoRef = useRef(abierto);
  abiertoRef.current = abierto;
  const anclaEditor = useMemo<React.RefObject<HTMLElement | null>>(
    () => ({
      get current() {
        const a = abiertoRef.current;
        if (!a) return null;
        return (a.ancla === "chip" ? chipRefs.current.get(a.campo) : null) ?? filtrosRef.current;
      },
    }),
    [],
  );
  const refChip = (campo: string) => (el: HTMLButtonElement | null) => {
    if (el) chipRefs.current.set(campo, el);
    else chipRefs.current.delete(campo);
  };

  function aplicar(campo: string, v: string) {
    onChange(campo, v);
    const ancla = anclaEditor.current;
    setAbierto(null);
    ancla?.focus();
  }
  function limpiarPanel() {
    for (const d of enPanel) if (valores[d.campo]) onChange(d.campo, "");
  }

  const defAbierto = abierto ? defs.get(abierto.campo) : undefined;
  const filaPanel = (d: ChipFiltroDef, autoFocus: boolean) => {
    const v = valores[d.campo] ?? "";
    const texto = v ? textoValor(d, v, valores) : "";
    return (
      <div key={d.campo} className="group flex items-center gap-1 rounded-sm hover:bg-fill-muted focus-within:bg-fill-muted">
        <button
          type="button"
          autoFocus={autoFocus}
          title={texto ? `${d.label}: ${texto}` : d.label}
          aria-haspopup={d.editor === "lista" || d.editor === "busqueda" ? "listbox" : "dialog"}
          onClick={() => {
            setPanel(false);
            setAbierto({ campo: d.campo, ancla: "filtros" });
          }}
          className={`flex-1 min-w-0 px-2.5 py-2 rounded-sm text-left text-body flex items-baseline justify-between gap-3 ${FOCUS_RING}`}
        >
          <span className="shrink-0 text-text">{d.chipLabel ?? d.label}</span>
          {texto ? (
            <span className="min-w-0 truncate text-secondary font-semibold tabular-nums">{texto}</span>
          ) : (
            <span className="shrink-0 text-text-muted">Todos</span>
          )}
        </button>
        {texto && (
          <button
            type="button"
            aria-label={`Quitar filtro ${d.label}`}
            onClick={() => onChange(d.campo, "")}
            className={`${ICON_BTN_XS} shrink-0 mr-1 flex items-center justify-center rounded-sm text-icon opacity-60 group-hover:opacity-100 group-focus-within:opacity-100 hover:bg-fill-muted hover:text-text transition-[opacity,color,background-color] ${FOCUS_RING}`}
          >
            <X size={ICON.sm} strokeWidth={1.5} />
          </button>
        )}
      </div>
    );
  };

  const seleccionado = activos > 0 || panel || abierto?.ancla === "filtros";
  return (
    <div className="relative shrink-0 flex items-center gap-2 flex-nowrap min-w-0">
      <InputId
        borrador={borradorId}
        setBorrador={setBorradorId}
        onIdChange={onIdChange}
        placeholder={idPlaceholder}
        className="flex-1 min-w-[160px] max-w-[260px]"
      />

      {fechas.map((d) => (
        <ChipDeFiltro
          key={d.campo}
          def={d}
          valores={valores}
          open={abierto?.campo === d.campo}
          maxWidth={CHIP_MAX_COMPACTO}
          buttonRef={refChip(d.campo)}
          onToggle={() => setAbierto(abierto?.campo === d.campo ? null : { campo: d.campo, ancla: "chip" })}
          onClear={() => onChange(d.campo, "")}
        />
      ))}

      {enPanel.length > 0 && (
        <button
          ref={filtrosRef}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={panel}
          aria-label={activos > 0 ? `Filtros (${activos} activos)` : undefined}
          onClick={() => setPanel(!panel)}
          className={`h-(--control-md) shrink-0 px-2.5 rounded-sm text-label border inline-flex items-center gap-1.5 whitespace-nowrap transition-colors ${FOCUS_RING} ${
            seleccionado
              ? "bg-primary-tint border-chip-border text-secondary"
              : "border-transparent bg-transparent text-text hover:bg-primary-tint hover:border-primary hover:text-secondary"
          }`}
        >
          <SlidersHorizontal size={ICON.sm} strokeWidth={1.5} />
          Filtros
          {activos > 0 && (
            <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-secondary text-white text-caption font-semibold tabular-nums inline-flex items-center justify-center">
              {activos}
            </span>
          )}
          {panel ? <ChevronUp size={ICON.xs} strokeWidth={1.5} /> : <ChevronDown size={ICON.xs} strokeWidth={1.5} />}
        </button>
      )}

      {activos > 0 && (
        <button type="button" onClick={limpiarPanel} className={`ml-auto shrink-0 whitespace-nowrap rounded-sm text-label text-secondary hover:underline ${FOCUS_RING}`}>
          Limpiar
        </button>
      )}

      {/* Popover "Filtros": los visibles que no son fecha y, debajo de "Más
          campos", los agregables. */}
      <AnchoredPopover anchorRef={filtrosRef} open={panel} onClose={() => setPanel(false)} role="dialog" ariaLabel="Filtros">
        <div className="p-1.5 flex flex-col gap-0.5" style={{ width: 300 }}>
          {principales.map((d, i) => filaPanel(d, i === 0))}
          {agregables.length > 0 && (
            <>
              <p className={`px-2.5 pt-2 pb-1 text-heading-xs uppercase text-text-muted select-none ${principales.length > 0 ? "mt-1 border-t border-border-subtle" : ""}`}>
                Más campos
              </p>
              {agregables.map((d, i) => filaPanel(d, principales.length === 0 && i === 0))}
            </>
          )}
        </div>
      </AnchoredPopover>

      {/* Editor del filtro abierto — anclado a su chip o al botón "Filtros". */}
      <AnchoredPopover anchorRef={anclaEditor} open={!!defAbierto} onClose={() => setAbierto(null)}>
        {defAbierto && <EditorDeFiltro def={defAbierto} valores={valores} periodo={periodo} onAplicar={(v) => aplicar(defAbierto.campo, v)} />}
      </AnchoredPopover>
    </div>
  );
}
