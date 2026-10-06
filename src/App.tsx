import { useState, useEffect } from "react";
import {
  ChevronLeft, ChevronRight, ChevronDown, FileText, Pencil, Clipboard, UserPlus, Shield, Search,
  Inbox, ChevronsUp, ChevronsDown, Home, Wrench,
} from "lucide-react";
import Logo from "@/imports/Logo/index";
import { NavItem } from "@/components/layout/NavItem";
import { UserMenu } from "@/components/layout/UserMenu";
import {
  BTN_SM,
  CardHeader,
  ESTADO_CLASES,
  FieldLabel,
  FOCUS_RING,
  ICON,
  ICON_BTN_SM,
  MOD_FIELD_CLS,
  MOD_SELECT_CLS,
  Modal,
  ModalCheckbox,
  modalNeutralBtnCls,
  modalPrimaryBtnCls,
  PeriodSelector,
  SelectWrap,
  ValuePicker,
} from "@/components/ui";
import { isAbmTableKey } from "@/data/abmTables";
import { ABM_ITEMS, PERIODS } from "@/data/dominio";
import { NOTAS_INICIALES, USUARIOS_SISENRE_DEMO } from "@/data/mocks";
import { crearRng, hashSemilla } from "@/data/rng";
import { generarConsolidacionSintetica } from "@/data/sinteticos";
import { AbmDeepLink, AbmTableKey, Screen } from "@/data/types";
import { AbmScreen } from "@/features/abm/AbmScreen";
import { ModificarContent } from "@/features/consultas-interrupcion/ModificarContent";
import { LotesModal } from "@/features/herramientas/LotesModal";
import { WelcomeContent } from "@/features/inicio/WelcomeContent";
import { LoginScreen } from "@/features/login/LoginScreen";
import { SelectScreen } from "@/features/login/SelectScreen";
import { formatFechaHora } from "@/lib/format";
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
