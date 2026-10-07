import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import AnchoredPopover from "@/components/ui/AnchoredPopover";
import FieldLabel from "@/components/ui/FieldLabel";
import { AtajoRango, FilterTriggerButton, RANGO_TEXTO_VACIO, RangoFechaEditor, RangoTexto } from "@/components/ui/FilterTrigger";
import { FOCUS_RING, ghostBtnCls, ICON, ICON_BTN_MD, ICON_BTN_XS, MOD_FIELD_CLS } from "@/components/ui/tokens";
import { ceros } from "@/lib/format";

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
  // Nombre corto del chip (máx. ~10 caracteres). Sin chipLabel, `label`.
  chipLabel?: string;
  // El chip con valor muestra solo el valor — únicamente para campos cuyos
  // valores se explican solos (descripciones, nombres); nunca para Sí/No,
  // códigos o números.
  soloValor?: boolean;
  editor: "lista" | "busqueda" | "texto" | "fecha";
  opciones?: ChipFiltroOpcion[];
};

// El valor de un filtro "fecha" viaja como string (todos los valores de la
// barra son string, "" = sin filtro): "desdeFecha|desdeHora|hastaFecha|hastaHora".
export function valorDeRango(r: RangoTexto): string {
  return r.desdeFecha || r.hastaFecha ? [r.desdeFecha, r.desdeHora, r.hastaFecha, r.hastaHora].join("|") : "";
}
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
function textoValor(def: ChipFiltroDef, v: string): string {
  if (def.editor === "fecha") return textoRango(v);
  return (def.opciones ?? []).map(normalizar).find((o) => o.value === v)?.label ?? v;
}

const aFechaInput = (d: Date) => `${d.getFullYear()}-${ceros(d.getMonth() + 1, 2)}-${ceros(d.getDate(), 2)}`;

const ATAJOS_FECHA: AtajoRango[] = [
  {
    label: "Hoy",
    rango: () => {
      const f = aFechaInput(new Date());
      return { desdeFecha: f, desdeHora: "", hastaFecha: f, hastaHora: "" };
    },
  },
  {
    label: "Últimos 7 días",
    rango: () => {
      const n = new Date();
      const d = new Date(n.getFullYear(), n.getMonth(), n.getDate() - 6);
      return { desdeFecha: aFechaInput(d), desdeHora: "", hastaFecha: aFechaInput(n), hastaHora: "" };
    },
  },
  // Sin límites = todo el período elegido en el masthead.
  { label: "Período completo", rango: () => RANGO_TEXTO_VACIO },
];

const ID_DEBOUNCE_MS = 500;
// Ancho máximo de un chip: el valor trunca con "…" y el texto completo va
// en el `title` del chip.
const CHIP_MAX = 200;
// Modo compacto (desborde, paso c): chips más angostos.
const CHIP_MAX_COMPACTO = 150;
const ID_MIN = 150;

// Ítem de menú/lista de los popovers — el de la lista de FilterTrigger.
const itemCls = (sel: boolean) =>
  `w-full px-2.5 py-2 rounded-sm border text-left text-body transition-colors flex items-center gap-2 ${FOCUS_RING} ${
    sel ? "bg-primary-tint border-primary text-secondary" : "border-transparent text-text hover:bg-fill-muted"
  }`;

// ─── Editores ─────────────────────────────────────────────────────────────────

function EditorLista({ def, valor, onAplicar }: { def: ChipFiltroDef; valor: string; onAplicar: (v: string) => void }) {
  const opciones = (def.opciones ?? []).map(normalizar);
  const iFoco = Math.max(0, opciones.findIndex((o) => o.value === valor));
  return (
    <div role="listbox" aria-label={def.label} className="p-1.5 flex flex-col gap-0.5 min-w-40 max-h-80 overflow-y-auto">
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

function EditorBusqueda({ def, valor, onAplicar }: { def: ChipFiltroDef; valor: string; onAplicar: (v: string) => void }) {
  const [filtro, setFiltro] = useState("");
  const opciones = (def.opciones ?? []).map(normalizar);
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
          <p className="px-2.5 py-2 text-body-sm text-text-muted">Sin resultados</p>
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

// ─── ChipFilterBar ────────────────────────────────────────────────────────────

type Abierto = { campo: string; ancla: "chip" | "mas" };

// Barra de filtros híbrida (ver DESIGN_SYSTEM.md, "ChipFilterBar" y "Barra
// de filtros híbrida"): input de ID directo + chips de filtro que aplican al
// instante, sin botón Buscar. Una sola línea, todo a --control-md:
//   ID · chips fijos · │ chips agregados · +N filtros · Agregar filtro · (ml-auto) Limpiar filtros
// Controlada desde la pantalla: `id` y `valores` (campo → valor, "" = sin
// filtro) vienen por props y cada cambio se avisa al instante. Los chips
// agregados (cuáles están en la barra) son estado propio: un agregado sin
// valor existe solo mientras su editor está abierto.
export default function ChipFilterBar({
  id,
  onIdChange,
  idPlaceholder,
  fijos,
  agregables,
  valores,
  onChange,
  onLimpiar,
}: {
  id: string;
  onIdChange: (v: string) => void;
  idPlaceholder: string;
  fijos: ChipFiltroDef[];
  agregables: ChipFiltroDef[];
  valores: Record<string, string>;
  onChange: (campo: string, valor: string) => void;
  // Limpia el ID y todos los filtros (la barra ya vacía sus agregados).
  onLimpiar: () => void;
}) {
  // ── ID: aplica con Enter o a los 500 ms de dejar de tipear.
  const [borradorId, setBorradorId] = useState(id);
  useEffect(() => setBorradorId(id), [id]);
  useEffect(() => {
    if (borradorId === id) return;
    const t = setTimeout(() => onIdChange(borradorId), ID_DEBOUNCE_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [borradorId]);

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

  const defs = useMemo(() => new Map([...fijos, ...agregables].map((d) => [d.campo, d])), [fijos, agregables]);
  const disponibles = agregables.filter((d) => !agregados.includes(d.campo));

  // ── Desborde: la barra nunca pasa de una línea. Si no entra todo, en
  // orden: (a) el ID se achica hasta su mínimo (lo hace el flex); (b) los
  // agregados, de derecha a izquierda, pasan a "+N filtros"; (c) modo
  // compacto: "Agregar filtro" solo ícono y chips a 150px. Los fijos nunca
  // se ocultan. Los anchos naturales salen de una fila de medición
  // invisible; se recalcula al cambiar filtros y con el ancho de la barra
  // (ResizeObserver).
  const barraRef = useRef<HTMLDivElement>(null);
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
  const [disposicion, setDisposicion] = useState({ visibles: agregados.length, compacto: false });
  const hayAlgo = !!id || !!borradorId || fijos.some((d) => valores[d.campo]) || agregados.some((c) => valores[c]);
  useLayoutEffect(() => {
    const barra = barraRef.current;
    if (!barra || anchoBarra === 0) return;
    const gap = parseFloat(getComputedStyle(barra).columnGap) || 0;
    const ancho = (clave: string) => medidasRef.current.get(clave)?.offsetWidth ?? 0;
    const chipAncho = (campo: string, cap: number) => Math.min(ancho(`chip:${campo}`), cap);
    const total = (n: number, compacto: boolean) => {
      const cap = compacto ? CHIP_MAX_COMPACTO : CHIP_MAX;
      const anchos = [
        ID_MIN,
        ...fijos.map((d) => chipAncho(d.campo, cap)),
        ...(agregados.length > 0 ? [1] : []),
        ...agregados.slice(0, n).map((c) => chipAncho(c, cap)),
        ...(n < agregados.length ? [ancho("mas")] : []),
        ancho(compacto ? "agregar-icono" : "agregar"),
        ...(hayAlgo ? [ancho("limpiar")] : []),
      ];
      return anchos.reduce((a, b) => a + b, 0) + gap * (anchos.length - 1);
    };
    let elegida = { visibles: 0, compacto: true };
    buscar: for (const compacto of [false, true]) {
      for (let n = agregados.length; n >= 0; n--) {
        if (total(n, compacto) <= anchoBarra) {
          elegida = { visibles: n, compacto };
          break buscar;
        }
      }
    }
    setDisposicion((prev) => (prev.visibles === elegida.visibles && prev.compacto === elegida.compacto ? prev : elegida));
  });
  const visibles = agregados.slice(0, disposicion.visibles);
  const ocultos = agregados.slice(disposicion.visibles);

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
  const chip = (def: ChipFiltroDef) => {
    const v = valores[def.campo] ?? "";
    return (
      <div key={def.campo} className="shrink-0 min-w-0 flex">
        <FilterTriggerButton
          buttonRef={refChip(def.campo)}
          label={def.label}
          etiqueta={def.chipLabel}
          soloValor={def.soloValor}
          aplicado={v ? textoValor(def, v) : null}
          open={abierto?.campo === def.campo}
          onToggle={() => (abierto?.campo === def.campo ? cerrarEditor() : setAbierto({ campo: def.campo, ancla: "chip" }))}
          onClear={() => quitar(def.campo)}
          size="md"
          maxWidth={chipMax}
          valorDestacado
          chevronConValor={false}
          haspopup={def.editor === "lista" || def.editor === "busqueda" ? "listbox" : "dialog"}
        />
      </div>
    );
  };

  // "+N filtros": chip pintado, mismo aspecto que un chip con valor.
  const masCls = "h-(--control-md) px-2.5 rounded-sm text-label border inline-flex items-center whitespace-nowrap bg-primary-tint border-primary text-secondary";

  const defAbierto = abierto ? defs.get(abierto.campo) : undefined;
  const valorAbierto = defAbierto ? valores[defAbierto.campo] ?? "" : "";

  return (
    <div ref={barraRef} className="relative shrink-0 flex items-center gap-2 flex-nowrap min-w-0">
      {/* Fila de medición: anchos naturales de lo que puede desbordar.
          Invisible, inerte y fuera del flujo. */}
      <div aria-hidden inert className="absolute left-0 top-0 invisible pointer-events-none flex items-center gap-2 whitespace-nowrap">
        {[...fijos, ...agregados.map((c) => defs.get(c)!)].map((d) => {
          const v = valores[d.campo] ?? "";
          return (
            <div key={d.campo} ref={refMedida(`chip:${d.campo}`)} className="shrink-0 flex">
              <FilterTriggerButton
                label={d.label}
                etiqueta={d.chipLabel}
                soloValor={d.soloValor}
                aplicado={v ? textoValor(d, v) : null}
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

      {/* 1. ID — se achica antes que nada (base 220px, mínimo 150px). */}
      <div className="relative" style={{ flex: "0 1 220px", minWidth: 150 }}>
        <span className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-icon">
          <Search size={ICON.sm} strokeWidth={1.5} />
        </span>
        <input
          value={borradorId}
          onChange={(e) => setBorradorId(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onIdChange(borradorId);
          }}
          placeholder={idPlaceholder}
          aria-label={idPlaceholder}
          className={MOD_FIELD_CLS + " pl-8 pr-8 text-code! font-mono"}
        />
        {borradorId && (
          <button
            type="button"
            aria-label="Borrar ID"
            onClick={() => {
              setBorradorId("");
              onIdChange("");
            }}
            className={`${ICON_BTN_XS} absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-sm text-icon hover:bg-fill-muted hover:text-text transition-colors ${FOCUS_RING}`}
          >
            <X size={ICON.sm} strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* 2. Chips fijos — siempre visibles. */}
      {fijos.map((d) => chip(d))}

      {/* 3. Chips agregados. */}
      {agregados.length > 0 && <div className="w-px h-5 bg-border shrink-0" />}
      {visibles.map((c) => chip(defs.get(c)!))}

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

      {/* 5. Agregar filtro. */}
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
            const texto = v ? textoValor(d, v) : "";
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
        reposicionar={`${disposicion.visibles}|${disposicion.compacto}|${anchoBarra}`}
      >
        {defAbierto?.editor === "lista" && <EditorLista def={defAbierto} valor={valorAbierto} onAplicar={(v) => aplicar(defAbierto.campo, v)} />}
        {defAbierto?.editor === "busqueda" && <EditorBusqueda def={defAbierto} valor={valorAbierto} onAplicar={(v) => aplicar(defAbierto.campo, v)} />}
        {defAbierto?.editor === "texto" && <EditorTexto def={defAbierto} valor={valorAbierto} onAplicar={(v) => aplicar(defAbierto.campo, v)} />}
        {defAbierto?.editor === "fecha" && (
          <RangoFechaEditor
            label={defAbierto.label}
            inicial={rangoDeValor(valorAbierto)}
            atajos={ATAJOS_FECHA}
            onApply={(r) => aplicar(defAbierto.campo, r ? valorDeRango(r) : "")}
          />
        )}
      </AnchoredPopover>
    </div>
  );
}
