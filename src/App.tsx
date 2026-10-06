import { useState, useEffect } from "react";
import {
  ChevronLeft, ChevronDown, FileText, Pencil, Clipboard, UserPlus, Shield, Search,
  Home, Wrench,
} from "lucide-react";
import Logo from "@/imports/Logo/index";
import NavItem from "@/components/layout/NavItem";
import TopBar from "@/components/layout/TopBar";
import UserMenu from "@/components/layout/UserMenu";
import { ICON, ICON_BTN_SM } from "@/components/ui";
import { isAbmTableKey } from "@/data/abmTables";
import { ABM_ITEMS } from "@/data/dominio";
import { AbmDeepLink, AbmTableKey, Screen } from "@/data/types";
import AbmScreen from "@/features/abm/AbmScreen";
import ModificarContent from "@/features/consultas-interrupcion/ModificarContent";
import LotesModal from "@/features/herramientas/LotesModal";
import WelcomeContent from "@/features/inicio/WelcomeContent";
import LoginScreen from "@/features/login/LoginScreen";
import SelectScreen from "@/features/login/SelectScreen";
import AuditoriaContent from "@/features/otros/AuditoriaContent";
import GeneracionTxtContent from "@/features/otros/GeneracionTxtContent";
import GestorNotasContent from "@/features/otros/GestorNotasContent";
import InsertaClientesContent from "@/features/otros/InsertaClientesContent";
import PlanillaConsolidadaContent from "@/features/otros/PlanillaConsolidadaContent";
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

// Título del top bar por pantalla (todas salvo el ABM, que tiene su propio
// encabezado con el selector de tabla).
const TITULOS_PANTALLA: Partial<Record<Screen, string>> = {
  welcome: "Inicio",
  modificar: "Búsqueda de interrupciones",
  generaciontxt: "Generación de txt",
  planillaconsolidada: "Planilla consolidada",
  gestornotas: "Gestor de notas",
  insertaclientes: "Inserta clientes en BDTH",
  auditoria: "Reporte de auditoría",
};

// ─── App ──────────────────────────────────────────────────────────────────────

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
            {/* Top bar — mismo en todas las pantallas salvo el ABM (que
                tiene su encabezado propio con el selector de tabla). */}
            {TITULOS_PANTALLA[screen] && <TopBar title={TITULOS_PANTALLA[screen]!} />}

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
