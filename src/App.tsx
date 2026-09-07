import { useState, useRef, useEffect } from "react";
import Logo from "@/imports/Logo/index";
import imgLoginBg from "@/imports/Login/032e40ba72541a29aef64c7150d660b7f04d7948.png";

// ─── Icons ───────────────────────────────────────────────────────────────────

const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IcoTable = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <rect x="1.5" y="2.5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M1.5 6h12M5.5 6v6.5" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);
const IcoZap = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M8.5 1.5L3.5 8.5H7.5L6.5 13.5L12.5 6.5H8.5L9.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IcoZapOff = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M8.5 1.5L3.5 8.5H7.5L6.5 13.5L12.5 6.5H8.5L9.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2.5 1.5" />
  </svg>
);
const IcoRefresh = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M12.5 7.5a5 5 0 1 1-1.4-3.5L12.5 2v4h-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IcoCpu = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <rect x="3.5" y="3.5" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" />
    <path d="M5.5 1v2M9.5 1v2M5.5 12v2M9.5 12v2M1 5.5h2M12 5.5h2M1 9.5h2M12 9.5h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const IcoUsers = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M1 13c0-2.8 2.2-4.5 5-4.5s5 1.7 5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M10.5 4a2 2 0 0 1 0 4M13.5 13c0-2.3-1.4-3.8-3-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const IcoBuilding = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <rect x="1.5" y="2.5" width="8" height="11" rx="1" stroke="currentColor" strokeWidth="1.2" />
    <path d="M9.5 6.5h2.5a1 1 0 0 1 1 1v5H9.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M4.5 5.5h2M4.5 8.5h2M4.5 11.5h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const IcoMsg = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M13 9a2 2 0 0 1-2 2H5L2 13.5V3.5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2V9z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);
const IcoFile = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M8.5 1.5H3.5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6L8.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M8.5 1.5V6h3.5M4.5 8.5h6M4.5 11h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const IcoEdit = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M10.5 2a1.41 1.41 0 0 1 2 2L4 12.5l-3 .5.5-3L10.5 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);
const IcoClipboard = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <rect x="2.5" y="2.5" width="10" height="11" rx="1" stroke="currentColor" strokeWidth="1.2" />
    <path d="M5.5 2.5V1.5h4v1M5.5 6.5h4M5.5 9.5h2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const IcoUserPlus = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M1 13c0-2.8 2.2-4.5 5-4.5S11 10.2 11 13M11.5 6v4M9.5 8h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const IcoShield = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M7.5 1.5L2.5 3.5v4c0 3 2.5 5.5 5 6 2.5-.5 5-3 5-6v-4L7.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);
const IcoCalendar = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <rect x="1.5" y="2.5" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M1.5 6.5h12M5 1.5v2M10 1.5v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const IcoSearch = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.25" />
    <path d="M10 10L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const IcoX = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const IcoFilter = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
    <path d="M4 5h12M6.5 10h7M9 15h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
const IcoInbox = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect x="6" y="12" width="32" height="24" rx="3" stroke="currentColor" strokeWidth="1.4" />
    <path d="M6 26h8l3 4h10l3-4h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 8h12M22 5v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const IcoUser = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="7.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M2.5 13.5c0-3 2.3-4.5 5-4.5s5 1.5 5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const IcoSettings = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M7.5 1v2M7.5 12v2M1 7.5h2M12 7.5h2M3.2 3.2l1.4 1.4M10.4 10.4l1.4 1.4M3.2 11.8l1.4-1.4M10.4 4.6l1.4-1.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const IcoLogOut = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M5.5 2H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h2.5M10 10.5l3-3-3-3M13 7.5H6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IcoExternalLink = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M5 2H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8M8 1h4v4M7 6l4.5-4.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Data ────────────────────────────────────────────────────────────────────

const ABM_ITEMS: { code: string; label: string; icon: React.ReactNode; screen?: Screen; key?: string }[] = [
  { code: "CDS2",  label: "Interrupciones",               icon: <IcoZap />,     screen: "cds2" },
  { code: "CDS3",  label: "Interrupciones no computables",icon: <IcoZapOff />,  screen: "cds3" },
  { code: "CDS4",  label: "Reposiciones",                 icon: <IcoRefresh />, screen: "cds4" },
  { code: "CDS5",  label: "Trafos repuestos",             icon: <IcoCpu /> },
  { code: "CDS6",  label: "Clientes MT afectados",        icon: <IcoUsers /> },
  { code: "CDS7",  label: "Instalaciones",                icon: <IcoBuilding /> },
  { code: "CDS8",  label: "Reclamos",                     icon: <IcoMsg /> },
  { code: "CDS9",  label: "Interrupciones x cliente",     icon: <IcoFile /> },
  { code: "CDS9",  label: "Interrupciones x cliente NM",  icon: <IcoFile />, key: "CDS9b" },
];

const OTROS_ITEMS = [
  { label: "Generación de txt",    icon: <IcoFile /> },
  { label: "Planilla consolidada", icon: <IcoClipboard /> },
  { label: "Gestor de notas",      icon: <IcoEdit /> },
  { label: "Inserta clientes",     icon: <IcoUserPlus /> },
  { label: "Auditoría",            icon: <IcoShield /> },
];

const PERIODS = ["Agosto 2026","Julio 2026","Junio 2026","Mayo 2026","Abril 2026"];

// Sample rows — real data from CDS2
const SAMPLE_ROWS = [
  { referencia: "BFZ202607056849", fecha: "01/07/2026 00:00" },
  { referencia: "BFZ202607056850", fecha: "01/07/2026 00:00" },
  { referencia: "BFZ202607012923", fecha: "01/07/2026 00:01" },
  { referencia: "BFZ202607056851", fecha: "01/07/2026 00:01" },
  { referencia: "BFZ202607012924", fecha: "01/07/2026 00:02" },
];
const TOTAL_REGISTROS = 57098;

// ─── CDS3 data ────────────────────────────────────────────────────────────────

const CDS3_ROWS = [
  { referencia: "BPR202607059383", fase: "1" },
  { referencia: "BPR202607062003", fase: "1" },
  { referencia: "AFZ202607058982", fase: "5" },
  { referencia: "AFZ202607058982", fase: "1" },
  { referencia: "BPR202607012884", fase: "1" },
];
const CDS3_TOTAL = 2501;
const CAUSAS_NC = [
  "<= A 3 MINUTOS",
  "INSTALACION CLIENTE",
];

// ─── CDS4 data ────────────────────────────────────────────────────────────────

const CDS4_ROWS = [
  { referencia: "BPR202607059383", fase: "1", fecha: "02/07/2026 12:56" },
];
const CDS4_TOTAL = 1;

// ─── Shared input classes ─────────────────────────────────────────────────────

const inputCls =
  "w-full h-8 px-2.5 text-[12.5px] bg-white border border-gray-400 rounded-sm text-gray-900 " +
  "placeholder:text-gray-500 focus:outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/10 " +
  "transition-all duration-150";

const selectCls =
  "w-full h-8 px-2.5 pr-7 text-[12.5px] bg-white border border-gray-400 rounded-sm text-gray-900 " +
  "appearance-none cursor-pointer focus:outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/10 " +
  "transition-all duration-150";

function SelectWrap({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {children}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-[#8FA8CC]">
        <ChevronDown />
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block mb-1 text-[11.5px] font-medium text-gray-700 select-none tracking-wide">
      {children}
    </label>
  );
}

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-3 mt-1">
      <span className="text-[10.5px] font-semibold uppercase tracking-[0.09em] text-gray-600 whitespace-nowrap select-none">
        {title}
      </span>
      <div className="flex-1 h-px bg-[#E4EAF4]" />
    </div>
  );
}

// ─── Sidebar nav item ─────────────────────────────────────────────────────────

function NavItem({
  label, code, icon, active, collapsed, onClick,
}: {
  label: string; code?: string; icon: React.ReactNode; active?: boolean; collapsed: boolean; onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{ position: "relative" }}
      className={`sidebar-item-btn w-full flex items-center gap-2 rounded-sm transition-all duration-150 group
        ${collapsed ? "justify-center px-0 py-2.5 mx-auto w-9" : "px-2.5 py-[7px]"}
        ${active
          ? "bg-[#1565C0] text-white shadow-[0_1px_6px_rgba(21,101,192,0.25)]"
          : "text-[#4A6080] hover:text-gray-800 hover:bg-[#EBF1FB]"
        }`}
    >
      <span className="shrink-0">{icon}</span>
      {!collapsed && (
        <>
          <span className="flex-1 text-[12.5px] text-left leading-snug">{label}</span>
          {code && (
            <span
              className={`text-micro font-mono shrink-0 tabular-nums ${active ? "text-white/60" : "text-[#97AFC8] group-hover:text-[#6A8AAD]"}`}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {code}
            </span>
          )}
        </>
      )}
      {collapsed && (
        <span className="sidebar-item-tooltip">
          {label}{code && ` · ${code}`}
        </span>
      )}
    </button>
  );
}

// ─── Period dropdown ──────────────────────────────────────────────────────────

function PeriodSelector() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(PERIODS[0]);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 h-8 px-3 rounded-sm border text-[12.5px] font-medium transition-all duration-150
          ${open ? "bg-white border-primary text-secondary ring-2 ring-primary/10" : "bg-white border-gray-400 text-gray-700 hover:border-[#97B0CF]"}`}
      >
        <span className={`transition-colors ${open ? "text-primary" : "text-[#97B0CF]"}`}><IcoCalendar /></span>
        <span>{selected}</span>
        <span className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}>
          <ChevronDown />
        </span>
      </button>
      {open && (
        <div
          className="absolute right-0 top-[calc(100%+5px)] w-48 bg-white rounded-sm border border-[#D8E4F0] z-50 overflow-hidden"
          style={{ boxShadow: "var(--shadow-mid)" }}
        >
          <div className="px-3 py-2.5 border-b border-[#EEF2F8]">
            <p className="text-caption font-semibold text-[#7A95B8] uppercase tracking-[0.08em] select-none">Seleccioná el período</p>
          </div>
          <div className="py-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => { setSelected(p); setOpen(false); }}
              className={`w-full px-3 py-1.5 text-left text-[12.5px] transition-colors
                ${p === selected ? "bg-primary-tint text-secondary font-semibold" : "text-gray-700 hover:bg-[#F4F6F9]"}`}
            >
              {p}
            </button>
          ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── User menu ────────────────────────────────────────────────────────────────

function UserMenu({ collapsed, onLogout }: { collapsed: boolean; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-2 rounded-sm px-1.5 py-1.5 transition-colors hover:bg-[#EBF1FB] ${open ? "bg-[#EBF1FB]" : ""}`}
      >
        <div
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-body-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg,#1565C0,#1E3A8A)" }}
        >
          R
        </div>
        {!collapsed && (
          <>
            <div className="flex-1 text-left overflow-hidden">
              <p className="text-[12.5px] font-medium text-gray-800 leading-none truncate">Rdellamagiora</p>
              <p className="text-caption text-[#7A95B8] mt-0.5 truncate">Operador</p>
            </div>
            <span className={`text-gray-500 transition-transform duration-150 ${open ? "rotate-180" : ""}`}>
              <ChevronDown />
            </span>
          </>
        )}
      </button>
      {open && (
        <div
          className={`absolute ${collapsed ? "left-[calc(100%+8px)] bottom-0" : "bottom-[calc(100%+6px)] left-0 right-0"} bg-white rounded-sm border border-gray-300 py-1 z-50 min-w-[160px]`}
          style={{ boxShadow: "var(--shadow-mid)" }}
        >
          <button className="w-full flex items-center gap-2 px-3 py-2 text-[12.5px] text-gray-700 hover:bg-[#F4F7FC] transition-colors">
            <IcoUser /> Mi perfil
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-2 text-[12.5px] text-gray-700 hover:bg-[#F4F7FC] transition-colors">
            <IcoSettings /> Configuración
          </button>
          <div className="my-1 border-t border-[#E4EBF5]" />
          <button
            onClick={() => { setOpen(false); onLogout(); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-[12.5px] text-error hover:bg-red-50 transition-colors"
          >
            <IcoLogOut /> Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Results table ────────────────────────────────────────────────────────────

function ResultsTable({
  hasData,
  selectedRow,
  onSelect,
  selectionActions,
}: {
  hasData: boolean;
  selectedRow: number | null;
  onSelect: (i: number | null) => void;
  selectionActions: ActionItem[];
}) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const columns = ["Referencia", "Fecha"];
  const getCells = (row: (typeof SAMPLE_ROWS)[number]) => [row.referencia, row.fecha];
  const { search, setSearch, sortIdx, sortDir, toggleSort, visibleIndices } =
    useTableToolbar(SAMPLE_ROWS, getCells);

  return (
    <div
      className="flex-1 flex flex-col border border-gray-300 rounded-sm bg-white overflow-hidden"
      style={{ boxShadow: "var(--shadow-low)" }}
    >
      {/* Table toolbar — buscador / exportar */}
      {hasData && (
        <TableToolbar
          search={search}
          onSearchChange={setSearch}
          onExport={() =>
            exportRowsToCsv("interrupciones", columns, visibleIndices.map((i) => getCells(SAMPLE_ROWS[i])))
          }
        />
      )}

      {/* Contextual action bar — visible only when a row is selected */}
      {hasData && selectedRow !== null && (
        <SelectionActionBar recordLabel={SAMPLE_ROWS[selectedRow].referencia} actions={selectionActions} />
      )}

      {/* Header */}
      <div className="flex items-center border-b border-gray-300 bg-gray-50 px-4 shrink-0">
        {columns.map((c, ci) => (
          <SortableHeaderCell
            key={c}
            label={c}
            active={sortIdx === ci}
            dir={sortDir}
            onClick={() => toggleSort(ci)}
            className="flex-1 py-2.5 text-caption"
          />
        ))}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {!hasData ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-[#B8C8DC]">
            <IcoInbox />
            <p className="text-[13.5px] font-medium text-[#6B7E9A] mt-1">
              No hay resultados para los filtros aplicados
            </p>
            <p className="text-body-sm text-gray-500">
              Completá los filtros y presioná{" "}
              <span className="font-semibold text-primary">Buscar</span>
            </p>
          </div>
        ) : (
          visibleIndices.map((i) => {
            const row = SAMPLE_ROWS[i];
            const isSelected = selectedRow === i;
            const isHovered = hoveredRow === i;
            return (
              <div
                key={i}
                onClick={() => onSelect(isSelected ? null : i)}
                onMouseEnter={() => setHoveredRow(i)}
                onMouseLeave={() => setHoveredRow(null)}
                className="relative flex items-center px-4 border-b border-gray-100 cursor-pointer transition-colors duration-100"
                style={{
                  backgroundColor: isSelected
                    ? "var(--color-primary-tint)"
                    : isHovered
                    ? "#F5F8FD"
                    : "#fff",
                  borderLeft: isSelected ? "3px solid var(--color-primary)" : "3px solid transparent",
                }}
              >
                <div
                  className="flex-1 min-w-0 py-2.5 text-[12.5px] tabular-nums"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: isSelected ? "var(--color-secondary)" : "#1F2D40",
                    fontWeight: isSelected ? 600 : 400,
                  }}
                >
                  {row.referencia}
                </div>
                <div className={`flex-1 min-w-0 py-2.5 text-[12.5px] ${isSelected ? "text-secondary font-medium" : "text-gray-700"}`}>
                  {row.fecha}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {hasData && (
        <div className="px-4 py-2 border-t border-gray-300 bg-gray-50 shrink-0 flex items-center justify-between">
          <span className="text-[11.5px] text-gray-700">
            Registros encontrados:{" "}
            <span className="font-semibold text-secondary">
              {TOTAL_REGISTROS.toLocaleString("es-AR")}
            </span>
          </span>
          <div className="flex items-center gap-2 text-[11.5px] text-gray-600">
            <button className="px-2.5 py-1 rounded border border-[#D0DAE8] bg-white hover:bg-[#F4F7FC] disabled:opacity-40 transition-colors" disabled>
              Anterior
            </button>
            <span>
              Pág. <span className="font-medium text-gray-800">1</span> de{" "}
              <span className="font-medium text-gray-800">2.284</span>
            </span>
            <button className="px-2.5 py-1 rounded border border-[#D0DAE8] bg-white hover:bg-[#F4F7FC] transition-colors">
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Login screen ─────────────────────────────────────────────────────────────

type ActionItem = {
  label: string;
  onClick?: () => void;
  variant?: "neutral" | "destructive";
};

function actionBtnCls(variant?: ActionItem["variant"]) {
  if (variant === "destructive") {
    return "h-8 px-4 rounded-sm text-body-sm font-medium border border-[#FCA5A5] bg-white text-error hover:bg-red-50 hover:border-[#F87171] transition-all active:scale-[0.98] whitespace-nowrap";
  }
  return "h-8 px-4 rounded-sm text-body-sm font-medium border border-gray-400 bg-white text-gray-700 hover:bg-primary-tint hover:border-primary hover:text-secondary transition-all active:scale-[0.98] whitespace-nowrap";
}

// Barra de acciones contextual — patron unico reusado en CDS2, CDS3, CDS4 y
// Modificar interrupcion. Aparece solo cuando hay un registro seleccionado.
// Sin orden jerarquico entre acciones: todas se muestran siempre (wrap si
// no entran en una linea), nunca se agrupan en un menu de overflow.
function SelectionActionBar({
  recordLabel,
  actions,
}: {
  recordLabel: string;
  actions: ActionItem[];
}) {
  return (
    <div className="px-4 py-3 border-b border-gray-200 bg-white shrink-0 flex flex-col gap-2.5">
      <div className="flex items-center gap-2.5">
        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
        <span className="text-caption font-semibold text-secondary uppercase tracking-wide select-none">
          Registro seleccionado
        </span>
        <span
          className="text-body-sm font-medium text-gray-800 tabular-nums"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {recordLabel}
        </span>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {actions.map((a) => (
          <button
            key={a.label}
            onClick={a.onClick}
            className={actionBtnCls(a.variant)}
          >
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Table toolbar (buscador / orden / exportar) ───────────────────────────────
// Patron compartido para toda tabla de datos: buscador cliente-side, orden de
// columnas y exportar a CSV. Cada tabla mantiene su propio estado de orden y
// filtro via useTableToolbar; TableToolbar solo renderiza buscador + Exportar
// (+ botones futuros pasados como children).

type SortDir = "asc" | "desc";

function useTableToolbar<T>(rows: T[], getCells: (row: T) => string[], resetKey: unknown = undefined) {
  const [search, setSearch] = useState("");
  const [sortIdx, setSortIdx] = useState<number | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  useEffect(() => {
    setSearch("");
    setSortIdx(null);
    setSortDir("asc");
  }, [resetKey]);

  const term = search.trim().toLowerCase();
  const filtered = rows
    .map((_, i) => i)
    .filter((i) => !term || getCells(rows[i]).some((c) => c.toLowerCase().includes(term)));

  const visibleIndices = sortIdx === null
    ? filtered
    : [...filtered].sort((a, b) => {
        const av = getCells(rows[a])[sortIdx] ?? "";
        const bv = getCells(rows[b])[sortIdx] ?? "";
        const cmp = av.localeCompare(bv, "es", { numeric: true, sensitivity: "base" });
        return sortDir === "asc" ? cmp : -cmp;
      });

  function toggleSort(colIdx: number) {
    setSortIdx((prev) => {
      if (prev === colIdx) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        return prev;
      }
      setSortDir("asc");
      return colIdx;
    });
  }

  return { search, setSearch, sortIdx, sortDir, toggleSort, visibleIndices };
}

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

function SortIndicator({ dir }: { dir: SortDir }) {
  return (
    <span className="text-primary" style={{ fontSize: 8, lineHeight: 1 }}>
      {dir === "asc" ? "▲" : "▼"}
    </span>
  );
}

// Encabezado clickeable para tablas armadas con divs (flex/grid).
function SortableHeaderCell({
  label,
  active,
  dir,
  onClick,
  className = "",
}: {
  label: string;
  active: boolean;
  dir: SortDir;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1 font-semibold uppercase tracking-[0.07em] select-none cursor-pointer transition-colors hover:text-gray-700 ${
        active ? "text-secondary" : "text-[#6B7E9A]"
      } ${className}`}
    >
      <span className="truncate">{label}</span>
      {active && <SortIndicator dir={dir} />}
    </button>
  );
}

// Encabezado clickeable para tablas armadas con <table>/<th> (drawer de indicadores).
function SortableTh({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: SortDir;
  onClick: () => void;
}) {
  return (
    <th className="px-4 py-3 text-left text-[10.5px] font-semibold uppercase tracking-[0.07em] select-none whitespace-nowrap">
      <button
        type="button"
        onClick={onClick}
        className={`flex items-center gap-1 cursor-pointer transition-colors hover:text-gray-700 ${
          active ? "text-secondary" : "text-[#6B7E9A]"
        }`}
      >
        {label}
        {active && <SortIndicator dir={dir} />}
      </button>
    </th>
  );
}

// Barra de herramientas de tabla — buscador cliente-side a la izquierda,
// Exportar a la derecha. Siempre se integra como franja superior dentro del
// card que ya contiene la tabla (mismo lenguaje que SelectionActionBar
// embedded), nunca como card propia flotando encima. Se le pueden agregar
// mas botones a la derecha de Exportar pasandolos como children, sin
// reestructurar nada.
function TableToolbar({
  search,
  onSearchChange,
  onExport,
  searchPlaceholder = "Buscar en la tabla…",
  children,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  onExport: () => void;
  searchPlaceholder?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="px-4 py-2.5 border-b border-gray-200 bg-white shrink-0 flex items-center justify-between gap-3">
      <div className="relative flex-1 max-w-[320px]">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-gray-500">
          <IcoSearch />
        </span>
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full h-8 pl-8 pr-2.5 text-[12.5px] bg-white border border-gray-400 rounded-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/10 transition-all duration-150"
        />
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button type="button" onClick={onExport} className={actionBtnCls("neutral")}>
          Exportar
        </button>
        {children}
      </div>
    </div>
  );
}

// ─── Modal estándar ─────────────────────────────────────────────────────────
// Standard compartido para toda accion de tabla que requiera un dialogo
// (Desarmes, Nivel/Tipo, Replicar, Cambia fases, Alta clientes, Lotes,
// Intercambio, y las que vengan despues). Overlay + panel centrado, header
// con titulo/subtitulo y boton X, body libre por contenido, footer con
// botones alineados a la derecha (mismo lenguaje que Buscar/Limpiar: neutral
// outline para cancelar, azul solido para la accion primaria). Cierra con X,
// click en el overlay o Escape.
const modalPrimaryBtnCls =
  "h-9 px-5 rounded-md text-body font-semibold text-white transition-all duration-150 active:scale-[0.99] hover:brightness-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none";
const modalNeutralBtnCls =
  "h-9 px-5 rounded-md text-body font-medium border-2 border-primary bg-white hover:bg-primary-tint transition-colors duration-150 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none";

function Modal({
  title,
  subtitle,
  open,
  onClose,
  size = "lg",
  footer,
  children,
}: {
  title: string;
  subtitle?: string;
  open: boolean;
  onClose: () => void;
  size?: "sm" | "lg" | "xl";
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/25" onClick={onClose} />
      <div
        className="fixed z-50 flex flex-col bg-white rounded-lg overflow-hidden"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: size === "sm" ? 480 : size === "xl" ? 1120 : 920,
          maxWidth: "calc(100vw - 40px)",
          maxHeight: "calc(100vh - 40px)",
          boxShadow: "var(--shadow-high)",
        }}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 shrink-0 flex items-center justify-between gap-3">
          <p className="min-w-0 truncate text-label font-semibold text-gray-900">
            {title}
            {subtitle && (
              <span
                className="ml-2 font-normal text-body text-[#7A95B8]"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {subtitle}
              </span>
            )}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-sm text-gray-600 hover:bg-[#EEF2F8] hover:text-gray-800 transition-all"
          >
            <IcoX />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-5 py-4 border-t border-gray-200 shrink-0 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </>
  );
}

// Lista con header, reusada dentro de modales para paneles tipo
// "Interrupción/Reclamo" / "Errores".
function ListBox({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col border border-gray-300 rounded-sm overflow-hidden" style={{ height: 160 }}>
      <div className="px-3 py-2 border-b border-gray-300 bg-gray-50 text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[#6B7E9A] shrink-0">
        {title}
      </div>
      <div className="flex-1 overflow-y-auto p-2">{children}</div>
    </div>
  );
}

// Checkbox custom (no accent-color nativo) — mismo lenguaje que el resto de
// la app: borde var(--color-gray-400) en reposo, relleno var(--color-primary) + check blanco al marcar.
// El <input> real queda oculto (sr-only) para mantener accesibilidad/teclado;
// el estado visual lo maneja React, nunca CSS nativo del navegador.
// Sin "checked"/"onChange" queda no-controlado (estado propio, como en
// Desarmes/Alta clientes); pasando ambos queda controlado por el padre
// (necesario cuando otra parte de la UI, como los botones Copiar/Mover en
// Intercambio, necesita leer que filas estan tildadas).
function ModalCheckbox({
  label,
  defaultChecked = false,
  checked: checkedProp,
  onChange,
}: {
  label: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const checked = checkedProp !== undefined ? checkedProp : internalChecked;
  const setChecked = (v: boolean) => {
    if (checkedProp === undefined) setInternalChecked(v);
    onChange?.(v);
  };
  return (
    <label className="inline-flex items-center gap-2 text-[12.5px] text-gray-700 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        className="sr-only"
      />
      <span
        className={`w-4 h-4 rounded-[3px] border flex items-center justify-center shrink-0 transition-colors duration-150 ${
          checked ? "bg-primary border-primary" : "bg-white border-gray-400 hover:border-[#97B0CF]"
        }`}
      >
        {checked && (
          <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
            <path d="M1.5 5.2l2.4 2.4L8.5 2.3" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {label}
    </label>
  );
}

// Radio custom, controlado desde el padre (seleccion mutuamente excluyente
// entre varios ModalRadio via checked/onSelect) — mismo motivo que el
// checkbox: nada de estilo nativo del navegador.
function ModalRadio({ label, checked, onSelect }: { label: string; checked: boolean; onSelect: () => void }) {
  return (
    <label
      onClick={onSelect}
      className="inline-flex items-center gap-1.5 text-[12.5px] text-gray-700 cursor-pointer select-none"
    >
      <span
        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-150 ${
          checked ? "border-primary" : "border-gray-400 hover:border-[#97B0CF]"
        }`}
      >
        <span className={`w-2 h-2 rounded-full bg-primary transition-transform duration-150 ${checked ? "scale-100" : "scale-0"}`} />
      </span>
      {label}
    </label>
  );
}

// ─── Modal: Desarmes ────────────────────────────────────────────────────────
function DesarmeModal({
  open,
  onClose,
  referencia,
}: {
  open: boolean;
  onClose: () => void;
  referencia: string;
}) {
  const [fileName, setFileName] = useState("No se eligió ningún archivo");
  const [desarmePor, setDesarmePor] = useState<"interrupcion" | "reclamo">("interrupcion");

  return (
    <Modal
      title="Desarme"
      open={open}
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className={modalNeutralBtnCls} style={{ color: "var(--color-secondary)" }}>
            Salir
          </button>
          <button type="button" onClick={onClose} className={modalPrimaryBtnCls} style={{ backgroundColor: "var(--color-primary)" }}>
            Procesar
          </button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <ListBox title="Interrupción/Reclamo">
          <div
            className="px-2 py-1.5 text-[12.5px] tabular-nums text-gray-800"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {referencia}
          </div>
        </ListBox>
        <ListBox title="Errores" />
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-5">
        <div className="flex flex-col gap-3.5">
          <div className="flex items-center gap-5 flex-wrap">
            <ModalCheckbox label="Reasigna" defaultChecked />
            <ModalCheckbox label="Alta reclamos faltantes" />
            <ModalCheckbox label="Solo MT/AT" />
          </div>
          <div className="flex items-center gap-2">
            <ModalCheckbox label="Reasigna por proximidad" />
            <input defaultValue="250" className={MOD_FIELD_CLS} style={{ width: 64 }} />
            <span className="text-[12.5px] text-gray-700">Mts.</span>
          </div>
          <div className="flex items-center gap-5">
            <ModalCheckbox label="Desarmo" defaultChecked />
            <ModalCheckbox label="Instalación cliente" defaultChecked />
          </div>
          <div className="flex items-center gap-5">
            <ModalRadio
              label="Por interrupción"
              checked={desarmePor === "interrupcion"}
              onSelect={() => setDesarmePor("interrupcion")}
            />
            <ModalRadio
              label="Por reclamo"
              checked={desarmePor === "reclamo"}
              onSelect={() => setDesarmePor("reclamo")}
            />
          </div>
          <ModalCheckbox label="Borra interrupción original" defaultChecked />
        </div>
        <div className="flex flex-col gap-3.5">
          <ModalCheckbox label="Carga reclamos faltantes" />
          <div className="flex items-center gap-2">
            <input
              type="file"
              id="desarme-file"
              className="hidden"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "No se eligió ningún archivo")}
            />
            <label
              htmlFor="desarme-file"
              className={actionBtnCls("neutral") + " cursor-pointer inline-flex items-center justify-center shrink-0"}
            >
              Elegir archivo
            </label>
            <span className="text-body-sm text-gray-600 truncate">{fileName}</span>
          </div>
          <div>
            <button type="button" className={actionBtnCls("neutral")}>
              Cargar archivo
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ─── Modal: Nivel/Tipo ──────────────────────────────────────────────────────
const NIVEL_TIPO_TIPOS = ["BFZ", "AFZ", "BPR", "MFZ"];

function NivelTipoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal
      title="Bajar nivel de interrupción"
      open={open}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <button type="button" onClick={onClose} className={modalNeutralBtnCls} style={{ color: "var(--color-secondary)" }}>
            Salir
          </button>
          <button type="button" onClick={onClose} className={modalPrimaryBtnCls} style={{ backgroundColor: "var(--color-primary)" }}>
            Generar
          </button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Nivel tensión</FieldLabel>
          <SelectWrap>
            <select className={MOD_SELECT_CLS + " w-full"}>
              <option>BT</option>
              <option>MT</option>
              <option>AT</option>
            </select>
          </SelectWrap>
        </div>
        <div>
          <FieldLabel>Tipo</FieldLabel>
          <SelectWrap>
            <select className={MOD_SELECT_CLS + " w-full"}>
              {NIVEL_TIPO_TIPOS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </SelectWrap>
        </div>
        <div>
          <FieldLabel>Nueva interrupción</FieldLabel>
          <div className="w-full h-8 px-2.5 flex items-center text-[12.5px] bg-[#F4F6F9] border border-gray-300 rounded-sm text-[#B8C8DC] select-none cursor-not-allowed">
            —
          </div>
        </div>
        <div>
          <FieldLabel>Cadena</FieldLabel>
          <input placeholder="NCBT" className={MOD_FIELD_CLS} />
        </div>
      </div>
    </Modal>
  );
}

// ─── Modal: Replicar ────────────────────────────────────────────────────────
function ReplicarModal({
  open,
  onClose,
  referencia,
}: {
  open: boolean;
  onClose: () => void;
  referencia: string;
}) {
  return (
    <Modal
      title="Replicar interrupción"
      subtitle={referencia}
      open={open}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <button type="button" onClick={onClose} className={modalNeutralBtnCls} style={{ color: "var(--color-secondary)" }}>
            Salir
          </button>
          <button type="button" onClick={onClose} className={modalPrimaryBtnCls} style={{ backgroundColor: "var(--color-primary)" }}>
            Generar
          </button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Período destino</FieldLabel>
          <SelectWrap>
            <select className={MOD_SELECT_CLS + " w-full"}>
              <option value="">Período</option>
              {PERIODS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </SelectWrap>
        </div>
        <div>
          <FieldLabel>Nueva interrupción</FieldLabel>
          <div className="w-full h-8 px-2.5 flex items-center text-[12.5px] bg-[#F4F6F9] border border-gray-300 rounded-sm text-[#B8C8DC] select-none cursor-not-allowed">
            —
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ─── Modal: Cambia fases ────────────────────────────────────────────────────
type FaseRow = { fase: number; fecha: string; idElemento: string; tipoElemento: string; cadena: string; cliente: number };

const CAMBIA_FASES_ROWS_INIT: FaseRow[] = [
  { fase: 1, fecha: "01/07/2026 00:43", idElemento: "@27947890", tipoElemento: "Proteccion de Toma/Acometida", cadena: "52705#B1#52705-TR1#1#3", cliente: 1 },
  { fase: 2, fecha: "01/07/2026 00:52", idElemento: "@27947891", tipoElemento: "Proteccion de Suministro", cadena: "52705#B1#52705-TR1#1#4", cliente: 3 },
  { fase: 1, fecha: "01/07/2026 01:10", idElemento: "@27947892", tipoElemento: "Proteccion de Toma/Acometida", cadena: "52705#B1#52705-TR1#1#5", cliente: 2 },
];

function CambiaFasesModal({
  open,
  onClose,
  referencia,
}: {
  open: boolean;
  onClose: () => void;
  referencia: string;
}) {
  const [rows, setRows] = useState(CAMBIA_FASES_ROWS_INIT);

  function move(i: number, dir: -1 | 1) {
    setRows((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  return (
    <Modal
      title="Cambia fases"
      subtitle={referencia}
      open={open}
      onClose={onClose}
      footer={
        <button type="button" onClick={onClose} className={modalNeutralBtnCls} style={{ color: "var(--color-secondary)" }}>
          Salir
        </button>
      }
    >
      <div className="border border-gray-300 rounded-sm overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {["Fase", "Fecha", "Id elemento", "Tipo elemento", "Cadena", "Cliente"].map((c) => (
                <th key={c} className="px-4 py-3 text-left text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[#6B7E9A] select-none whitespace-nowrap">
                  {c}
                </th>
              ))}
              <th className="px-3 py-3 w-16" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.idElemento} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-[12.5px] text-gray-700 tabular-nums">{r.fase}</td>
                <td className="px-4 py-3 text-[12.5px] text-gray-700 whitespace-nowrap">{r.fecha}</td>
                <td className="px-4 py-3 text-[12.5px] text-gray-700 whitespace-nowrap" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {r.idElemento}
                </td>
                <td className="px-4 py-3 text-[12.5px] text-gray-700 whitespace-nowrap">{r.tipoElemento}</td>
                <td className="px-4 py-3 text-[12.5px] text-gray-700 whitespace-nowrap" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "var(--text-caption)" }}>
                  {r.cadena}
                </td>
                <td className="px-4 py-3 text-[12.5px] text-gray-700 tabular-nums">{r.cliente}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      className="w-6 h-6 flex items-center justify-center rounded-sm text-gray-600 hover:bg-primary-tint hover:text-secondary disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                        <path d="M5.5 8.5V2.5M5.5 2.5L2.5 5.5M5.5 2.5l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      disabled={i === rows.length - 1}
                      className="w-6 h-6 flex items-center justify-center rounded-sm text-gray-600 hover:bg-primary-tint hover:text-secondary disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                        <path d="M5.5 2.5v6M5.5 8.5l-3-3M5.5 8.5l3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
}

// ─── Modal: Alta de clientes ────────────────────────────────────────────────
const ALTA_CLIENTES_ROWS = [
  { interrupcion: "BFZ202607056849", repo: 1, cadenaCuenta: "52705#B1#52705-TR1#1#3", t4: 1, t6: 0, t9: 1, t10: 107 },
];

function AltaClientesModal({
  open,
  onClose,
  referencia,
}: {
  open: boolean;
  onClose: () => void;
  referencia: string;
}) {
  const [filtroActivo, setFiltroActivo] = useState(false);
  const [periodicidad, setPeriodicidad] = useState<"mensual" | "semestral">("mensual");

  return (
    <Modal
      title="Alta de clientes BT"
      subtitle={referencia}
      open={open}
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className={modalNeutralBtnCls} style={{ color: "var(--color-secondary)" }}>
            Salir
          </button>
          <button type="button" onClick={onClose} className={modalPrimaryBtnCls} style={{ backgroundColor: "var(--color-primary)" }}>
            Procesar
          </button>
        </>
      }
    >
      <div className="flex items-center justify-end gap-2 mb-3">
        <span className="text-[11.5px] text-gray-600">Filtro</span>
        <button
          type="button"
          onClick={() => setFiltroActivo((v) => !v)}
          className={`h-7 px-3 rounded-sm text-[11.5px] font-medium border transition-colors ${
            filtroActivo ? "bg-primary-tint border-primary text-secondary" : "bg-white border-gray-400 text-gray-700 hover:border-[#97B0CF]"
          }`}
        >
          {filtroActivo ? "Activo" : "Inactivo"}
        </button>
      </div>

      <div className="border border-gray-300 rounded-sm overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {["Interrupción", "Repo", "Cadena/Cuenta", "Clientes T4", "Clientes T6", "Clientes T9", "Clientes T10"].map((c) => (
                <th key={c} className="px-4 py-3 text-left text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[#6B7E9A] select-none whitespace-nowrap">
                  {c}
                </th>
              ))}
              <th className="px-3 py-3 w-10" />
            </tr>
          </thead>
          <tbody>
            {ALTA_CLIENTES_ROWS.map((r) => (
              <tr key={r.interrupcion} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-[12.5px] tabular-nums" style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--color-gray-800)" }}>
                  {r.interrupcion}
                </td>
                <td className="px-4 py-3 text-[12.5px] text-gray-700 tabular-nums">{r.repo}</td>
                <td className="px-4 py-3 text-[12.5px] text-gray-700 whitespace-nowrap" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "var(--text-caption)" }}>
                  {r.cadenaCuenta}
                </td>
                <td className="px-4 py-3 text-[12.5px] text-gray-700 tabular-nums">{r.t4}</td>
                <td className="px-4 py-3 text-[12.5px] text-gray-700 tabular-nums">{r.t6}</td>
                <td className="px-4 py-3 text-[12.5px] text-gray-700 tabular-nums">{r.t9}</td>
                <td className="px-4 py-3 text-[12.5px] text-gray-700 tabular-nums">{r.t10}</td>
                <td className="px-3 py-3">
                  <ModalCheckbox label="" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="inline-flex rounded-md border border-gray-400 overflow-hidden">
          <button
            type="button"
            onClick={() => setPeriodicidad("mensual")}
            className={`h-8 px-4 text-[12.5px] font-medium transition-colors ${
              periodicidad === "mensual" ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-[#F4F7FC]"
            }`}
          >
            Mensual
          </button>
          <button
            type="button"
            onClick={() => setPeriodicidad("semestral")}
            className={`h-8 px-4 text-[12.5px] font-medium border-l border-gray-400 transition-colors ${
              periodicidad === "semestral" ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-[#F4F7FC]"
            }`}
          >
            Semestral
          </button>
        </div>
        <button type="button" className={actionBtnCls("neutral")}>
          Agregar
        </button>
      </div>
    </Modal>
  );
}

// ─── Modal: Lotes ───────────────────────────────────────────────────────────
// "extra" marca las opciones que traen un control adicional inline (select,
// sub-radios o checkbox) en la captura de referencia de ese Tipo.
type LotesOpcion = { label: string; extra?: "codigoFalla" | "causaAlta" | "conservaCausa" };
type LotesTipo = { key: string; opciones: LotesOpcion[]; desc: string; columns?: 2 };

const LOTES_TIPOS: LotesTipo[] = [
  {
    key: "0",
    desc: "Tipo 0 - Sin datos requeridos",
    opciones: [
      { label: "Elimina CT en 0 (excluye interrupciones)" },
      { label: "Completar con RST en T2/T4 (excluye interrupciones)" },
      { label: "Pasar texto a mayúscula (excluye interrupciones)" },
      { label: "Buscar CT por acometida en T10 Sem" },
      { label: "Nivelación automática" },
      { label: "Completa Cadenas Vacías en T9" },
      { label: "Carga Potencia de Cts en 0" },
    ],
  },
  {
    key: "1",
    desc: "Tipo 1 - REF",
    opciones: [
      { label: "Borra interrupción" },
      { label: "Coincidir fecha 1er reclamo" },
      { label: "Cambiar código de falla", extra: "codigoFalla" },
      { label: "Dividir interrupción" },
      { label: "Cambiar tipo" },
      { label: "Baja clientes sin reclamos" },
      { label: "Alta clientes por cercanía de reclamo" },
      { label: "Cambia a NCBT las interrupciones" },
    ],
  },
  {
    key: "2",
    desc: "Tipo 2 - Póliza/Tarifa",
    opciones: [{ label: "Asignar tarifa" }, { label: "Borrar pólizas" }],
  },
  {
    key: "3",
    desc: "Tipo 3 - REF/F/Fecha",
    opciones: [{ label: "Modificar horario de interrupción / F" }],
  },
  {
    key: "4",
    desc: "Tipo 4 - REF/F/Cuenta",
    opciones: [{ label: "Baja clientes en T9" }, { label: "Alta clientes en T9" }],
  },
  {
    key: "5",
    desc: "Tipo 5 - REF/F",
    opciones: [
      { label: "Alta en T3", extra: "causaAlta" },
      { label: "Copia en T4 datos de T2" },
      { label: "Elimina registros en T3" },
      { label: "Elimina duplicados en T3" },
      { label: "Elimina causa <= 3 a minutos en T3" },
      { label: "Elimina causa INSTALACION CLIENTE en T3" },
    ],
  },
  {
    key: "6",
    desc: "Tipo 6 - REF/REF o Reclamo/REF",
    opciones: [
      { label: "Pasaje de reclamos", extra: "conservaCausa" },
      { label: "Renombrar Interrupciones" },
    ],
  },
  {
    key: "7",
    desc: "Tipo 7 - REF/Null/Texto",
    columns: 2,
    opciones: [
      { label: "Completa id_elem en T2" },
      { label: "Cambia tipo elemento T2" },
      { label: "Completar CMTBT en T2" },
      { label: "Completa alim en T2" },
      { label: "Completa ssee en T2" },
      { label: "Completa id_elem en T4" },
      { label: "Cambia tipo elemento T4" },
      { label: "Completar CMTBT en T4" },
      { label: "Completa alim en T4" },
      { label: "Completa ssee en T4" },
    ],
  },
  {
    key: "8",
    desc: "Tipo 8 - REF/F/Cadena",
    opciones: [{ label: "Inserta registros en T5" }, { label: "Elimina Registros en T5" }],
  },
];

function LotesModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [fileName, setFileName] = useState("No se eligió ningún archivo");
  const [activeTipo, setActiveTipo] = useState("0");
  const [selectedOpcion, setSelectedOpcion] = useState<string | null>(null);
  const [causaAlta, setCausaAlta] = useState<"3min" | "instalacion" | null>(null);
  const [conservaCausa, setConservaCausa] = useState(false);
  const tipoData = LOTES_TIPOS.find((t) => t.key === activeTipo)!;

  return (
    <Modal
      title="Lotes"
      open={open}
      onClose={onClose}
      size="xl"
      footer={
        <>
          <button type="button" onClick={onClose} className={modalNeutralBtnCls} style={{ color: "var(--color-secondary)" }}>
            Salir
          </button>
          <button type="button" onClick={onClose} className={modalPrimaryBtnCls} style={{ backgroundColor: "var(--color-primary)" }}>
            Procesar
          </button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-6">
        {/* Izquierda: archivo + porcentajes */}
        <div className="flex flex-col gap-4">
          <div className="border border-gray-300 rounded-sm overflow-hidden" style={{ height: 160 }}>
            <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-300">
              {["Campo 1", "Campo 2", "Campo 3"].map((c) => (
                <div key={c} className="px-3 py-2 text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[#6B7E9A]">
                  {c}
                </div>
              ))}
            </div>
            <div className="h-full overflow-y-auto" />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              id="lotes-file"
              className="hidden"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "No se eligió ningún archivo")}
            />
            <label
              htmlFor="lotes-file"
              className={actionBtnCls("neutral") + " cursor-pointer inline-flex items-center justify-center shrink-0"}
            >
              Elegir archivo
            </label>
            <span className="text-body-sm text-gray-600 truncate">{fileName}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Porcentaje 1</FieldLabel>
              <div className="flex items-center gap-2">
                <input defaultValue="10" className={MOD_FIELD_CLS} style={{ width: 60 }} />
                <span className="text-[11.5px] text-gray-600">Intervalo mayor a 48hs</span>
              </div>
            </div>
            <div>
              <FieldLabel>Distancia del reclamo</FieldLabel>
              <div className="flex items-center gap-2">
                <input defaultValue="100" className={MOD_FIELD_CLS} style={{ width: 60 }} />
                <span className="text-[11.5px] text-gray-600">Mts.</span>
              </div>
            </div>
            <div>
              <FieldLabel>Porcentaje 2</FieldLabel>
              <div className="flex items-center gap-2">
                <input defaultValue="10" className={MOD_FIELD_CLS} style={{ width: 60 }} />
                <span className="text-[11.5px] text-gray-600">Intervalo menor a 48hs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Derecha: errores + tipos */}
        <div className="flex flex-col gap-4">
          <ListBox title="Errores" />

          <div>
            <div className="flex items-center gap-1 border-b border-gray-200 overflow-x-auto">
              {LOTES_TIPOS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActiveTipo(t.key)}
                  className={`px-3 py-2 text-body-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTipo === t.key ? "border-primary text-secondary" : "border-transparent text-gray-600 hover:text-gray-700"
                  }`}
                >
                  Tipo {t.key}
                </button>
              ))}
            </div>

            <div
              className={`gap-x-8 gap-y-2 py-3 overflow-y-auto ${tipoData.columns === 2 ? "grid grid-cols-2 grid-rows-5 grid-flow-col" : "flex flex-col"}`}
              style={{ height: 220 }}
            >
              {tipoData.opciones.map((op) => (
                <div key={op.label} className="flex items-center gap-4 flex-wrap">
                  <ModalRadio
                    label={op.label}
                    checked={selectedOpcion === op.label}
                    onSelect={() => setSelectedOpcion(op.label)}
                  />
                  {op.extra === "codigoFalla" && (
                    <SelectWrap className="w-44">
                      <select className={MOD_SELECT_CLS + " w-full"}>
                        <option value="">Seleccione código</option>
                      </select>
                    </SelectWrap>
                  )}
                  {op.extra === "causaAlta" && (
                    <div className="flex items-center gap-4">
                      <ModalRadio label="<= 3 minutos" checked={causaAlta === "3min"} onSelect={() => setCausaAlta("3min")} />
                      <ModalRadio
                        label="Instalación cliente"
                        checked={causaAlta === "instalacion"}
                        onSelect={() => setCausaAlta("instalacion")}
                      />
                    </div>
                  )}
                  {op.extra === "conservaCausa" && (
                    <ModalCheckbox label="Conserva la misma causa" checked={conservaCausa} onChange={setConservaCausa} />
                  )}
                </div>
              ))}
            </div>

            <div className="w-full h-8 px-2.5 flex items-center text-body-sm bg-[#F4F6F9] border border-gray-300 rounded-sm text-gray-600 select-none">
              {tipoData.desc}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ─── Modal: Intercambio ─────────────────────────────────────────────────────
type IntercambioRow = { id: number; fecha: string; clientes: number; repo: number };

function IntercambioModal({
  open,
  onClose,
  referencia,
}: {
  open: boolean;
  onClose: () => void;
  referencia: string;
}) {
  const [leftRows, setLeftRows] = useState<IntercambioRow[]>([{ id: 1, fecha: "01/07/2026 00:43", clientes: 1, repo: 1 }]);
  const [rightRows, setRightRows] = useState<IntercambioRow[]>([]);
  const [leftChecked, setLeftChecked] = useState<Set<number>>(new Set());
  const [seleccion, setSeleccion] = useState<"interrupcion" | "reclamos" | "cts" | "clientes">("interrupcion");
  const [tarifa, setTarifa] = useState<"todas" | "mtat" | "bt">("todas");
  const [ocultarExistentes, setOcultarExistentes] = useState(false);
  const nextRowId = useRef(2);

  function toggleLeftChecked(i: number, checked: boolean) {
    setLeftChecked((prev) => {
      const next = new Set(prev);
      if (checked) next.add(i);
      else next.delete(i);
      return next;
    });
  }

  function toggleSelectAll(checked: boolean) {
    setLeftChecked(checked ? new Set(leftRows.map((_, i) => i)) : new Set());
  }

  function copiar() {
    const selected = leftRows.filter((_, i) => leftChecked.has(i));
    if (selected.length === 0) return;
    setRightRows((prev) => [...prev, ...selected.map((r) => ({ ...r, id: nextRowId.current++ }))]);
  }

  function mover() {
    const selected = leftRows.filter((_, i) => leftChecked.has(i));
    if (selected.length === 0) return;
    setRightRows((prev) => [...prev, ...selected.map((r) => ({ ...r, id: nextRowId.current++ }))]);
    setLeftRows((prev) => prev.filter((_, i) => !leftChecked.has(i)));
    setLeftChecked(new Set());
  }

  function eliminar() {
    setLeftRows((prev) => prev.filter((_, i) => !leftChecked.has(i)));
    setLeftChecked(new Set());
  }

  function swap() {
    setLeftRows(rightRows);
    setRightRows(leftRows);
    setLeftChecked(new Set());
  }

  return (
    <Modal
      title="Intercambio entre 2 interrupciones"
      subtitle={referencia}
      open={open}
      onClose={onClose}
      size="xl"
      footer={
        <button type="button" onClick={onClose} className={modalPrimaryBtnCls} style={{ backgroundColor: "var(--color-primary)" }}>
          Salir
        </button>
      }
    >
      <div className="flex gap-5">
        {/* Sidebar izquierda */}
        <div className="flex flex-col gap-4 shrink-0" style={{ width: 190 }}>
          <div className="border border-gray-300 rounded-sm divide-y divide-gray-100 overflow-hidden">
            <div className="flex items-center justify-between gap-2 px-3 py-2">
              <span
                className="text-[11.5px] tabular-nums text-gray-800 truncate"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {referencia}
              </span>
              <ModalCheckbox label="" defaultChecked />
            </div>
            <div className="flex items-center justify-between gap-2 px-3 py-2">
              <span className="text-body-sm text-gray-700">Reposición 1</span>
              <ModalCheckbox label="" defaultChecked />
            </div>
          </div>

          <div>
            <FieldLabel>Selección</FieldLabel>
            <div className="flex flex-col gap-2 mt-1">
              <ModalRadio label="Interrupción" checked={seleccion === "interrupcion"} onSelect={() => setSeleccion("interrupcion")} />
              <ModalRadio label="Reclamos" checked={seleccion === "reclamos"} onSelect={() => setSeleccion("reclamos")} />
              <ModalRadio label="CTs" checked={seleccion === "cts"} onSelect={() => setSeleccion("cts")} />
              <ModalRadio label="Clientes" checked={seleccion === "clientes"} onSelect={() => setSeleccion("clientes")} />
            </div>
          </div>

          <div>
            <FieldLabel>Tarifas</FieldLabel>
            <div className="flex flex-col gap-2 mt-1">
              <ModalRadio label="Todas" checked={tarifa === "todas"} onSelect={() => setTarifa("todas")} />
              <ModalRadio label="MT/AT" checked={tarifa === "mtat"} onSelect={() => setTarifa("mtat")} />
              <ModalRadio label="BT" checked={tarifa === "bt"} onSelect={() => setTarifa("bt")} />
            </div>
          </div>
        </div>

        {/* Tabla origen */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <div className="border border-gray-300 rounded-sm overflow-y-auto" style={{ height: 240 }}>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {["Fecha", "Clientes", "Repo"].map((c) => (
                    <th key={c} className="px-3 py-2 text-left text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[#6B7E9A] whitespace-nowrap">
                      {c}
                    </th>
                  ))}
                  <th className="w-9 px-2 py-2">
                    <div className="flex justify-center">
                      <ModalCheckbox
                        label=""
                        checked={leftChecked.size > 0 && leftChecked.size === leftRows.length}
                        onChange={toggleSelectAll}
                      />
                    </div>
                  </th>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-1.5"><input className={MOD_FIELD_CLS} style={{ height: 26 }} /></td>
                  <td className="p-1.5"><input className={MOD_FIELD_CLS} style={{ height: 26 }} /></td>
                  <td className="p-1.5"><input className={MOD_FIELD_CLS} style={{ height: 26 }} /></td>
                  <td />
                </tr>
              </thead>
              <tbody>
                {leftRows.length === 0 ? (
                  <tr>
                    <td colSpan={4}>
                      <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
                        <span className="text-gray-400"><IcoInbox /></span>
                        <p className="text-[12.5px] font-medium text-gray-600">No hay registros</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  leftRows.map((r, i) => (
                    <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-2 text-[12.5px] text-gray-700 whitespace-nowrap">{r.fecha}</td>
                      <td className="px-3 py-2 text-[12.5px] text-gray-700 tabular-nums">{r.clientes}</td>
                      <td className="px-3 py-2 text-[12.5px] text-gray-700 tabular-nums">{r.repo}</td>
                      <td className="px-2 py-2">
                        <div className="flex justify-center">
                          <ModalCheckbox label="" checked={leftChecked.has(i)} onChange={(c) => toggleLeftChecked(i, c)} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between text-[11.5px] text-gray-600">
            <button className="px-2.5 py-1 rounded border border-[#D0DAE8] bg-white disabled:opacity-40" disabled>Anterior</button>
            <span>Página <span className="font-medium text-gray-800">1</span> de <span className="font-medium text-gray-800">1</span></span>
            <button className="px-2.5 py-1 rounded border border-[#D0DAE8] bg-white disabled:opacity-40" disabled>Siguiente</button>
          </div>
          <ModalCheckbox label="Ocultar existentes en ambas interrupciones" checked={ocultarExistentes} onChange={setOcultarExistentes} />
        </div>

        {/* Botones centrales */}
        <div className="flex flex-col gap-2 justify-center shrink-0" style={{ width: 150 }}>
          <button type="button" onClick={copiar} className={actionBtnCls("neutral")}>
            Copiar - {">>"}
          </button>
          <button type="button" onClick={mover} className={actionBtnCls("neutral")}>
            Mover - {">>"}
          </button>
          <button type="button" onClick={eliminar} className={actionBtnCls("neutral")}>
            Eliminar
          </button>
          <button type="button" className={actionBtnCls("neutral")}>
            Modifica en destino
          </button>
          <button type="button" onClick={swap} className={modalNeutralBtnCls} style={{ color: "var(--color-secondary)" }}>
            {"<< - >>"}
          </button>
        </div>

        {/* Tabla destino */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <div className="border border-gray-300 rounded-sm overflow-y-auto" style={{ height: 240 }}>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {["Fecha", "Clientes", "Repo"].map((c) => (
                    <th key={c} className="px-3 py-2 text-left text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[#6B7E9A] whitespace-nowrap">
                      {c}
                    </th>
                  ))}
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-1.5"><input className={MOD_FIELD_CLS} style={{ height: 26 }} /></td>
                  <td className="p-1.5"><input className={MOD_FIELD_CLS} style={{ height: 26 }} /></td>
                  <td className="p-1.5"><input className={MOD_FIELD_CLS} style={{ height: 26 }} /></td>
                </tr>
              </thead>
              <tbody>
                {rightRows.length === 0 ? (
                  <tr>
                    <td colSpan={3}>
                      <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
                        <span className="text-gray-400"><IcoInbox /></span>
                        <p className="text-[12.5px] font-medium text-gray-600">No hay registros</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  rightRows.map((r) => (
                    <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-2 text-[12.5px] text-gray-700 whitespace-nowrap">{r.fecha}</td>
                      <td className="px-3 py-2 text-[12.5px] text-gray-700 tabular-nums">{r.clientes}</td>
                      <td className="px-3 py-2 text-[12.5px] text-gray-700 tabular-nums">{r.repo}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between text-[11.5px] text-gray-600">
            <button className="px-2.5 py-1 rounded border border-[#D0DAE8] bg-white disabled:opacity-40" disabled>Anterior</button>
            <span>Página <span className="font-medium text-gray-800">1</span> de <span className="font-medium text-gray-800">1</span></span>
            <button className="px-2.5 py-1 rounded border border-[#D0DAE8] bg-white disabled:opacity-40" disabled>Siguiente</button>
          </div>
          <div className="relative">
            <input placeholder="Buscar destino" className={MOD_FIELD_CLS} style={{ paddingRight: 36 }} />
            <span className="absolute right-0 top-0 h-8 w-8 flex items-center justify-center text-gray-600">
              <IcoSearch />
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (usuario === "rdellamagiora" && password === "1234") {
      setLoading(true);
      setTimeout(onLogin, 600);
    } else {
      setError("Usuario o contraseña incorrectos.");
    }
  }

  const inputCls = "w-full px-[8px] py-[12px] border border-[#a1a1aa] rounded-sm bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all";
  const inputStyle: React.CSSProperties = { fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: 14, color: "#27272a", lineHeight: "20px", letterSpacing: "0.14px" };
  const labelStyle: React.CSSProperties = { fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: 14, color: "#52525b", lineHeight: "20px", letterSpacing: "0.14px" };

  return (
    <div className="relative w-full h-screen overflow-hidden flex">
      {/* Background image */}
      <img src={imgLoginBg} alt="" className="absolute inset-0 size-full object-cover pointer-events-none" />

      {/* Left half: branding */}
      <div className="relative flex-1 flex flex-col justify-center" style={{ padding: "100px" }}>
        <div style={{ filter: "brightness(0) invert(1)", width: 272 }}>
          <Logo />
        </div>
        <div style={{ marginTop: 50 }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "39.06px", color: "white", lineHeight: "46.87px" }}>SISENRE</p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "39.06px", color: "white", lineHeight: "46.87px" }}>Calidad de servicio</p>
        </div>
      </div>

      {/* Right half: 600px card, top aligned ~15px below logo */}
      <div className="relative flex-1 flex flex-col" style={{ paddingTop: "calc(38vh + 15px)" }}>
        <div className="bg-[#fafafa] rounded-tl-[12px] rounded-tr-[12px] flex flex-col overflow-hidden flex-1 min-h-0" style={{ width: 600, margin: "0 auto" }}>
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0" style={{ paddingTop: 60, paddingLeft: 32, paddingRight: 32, paddingBottom: 32 }}>
            {/* Header */}
            <div className="flex flex-col gap-[8px] shrink-0">
              <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 40, color: "var(--color-secondary)", lineHeight: "40px" }}>Bienvenido </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: 16, color: "#52525b", lineHeight: "20px", letterSpacing: "0.16px" }}>Ingresá tu usuario y contraseña</p>
            </div>

            {/* Inputs */}
            <div className="flex flex-col shrink-0" style={{ marginTop: 24, gap: 32 }}>
              <div className="flex flex-col gap-[4px]">
                <label style={labelStyle}>Usuario</label>
                <input type="text" autoComplete="username" value={usuario} onChange={e => { setUsuario(e.target.value); setError(""); }} className={inputCls} style={inputStyle} />
              </div>
              <div className="flex flex-col gap-[4px]">
                <label style={labelStyle}>Contraseña</label>
                <input type="password" autoComplete="current-password" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} className={inputCls} style={inputStyle} />
              </div>
            </div>

            {error && (
              <p className="mt-3 shrink-0 text-body-sm text-error bg-red-50 border border-red-200 rounded-sm px-3 py-2">{error}</p>
            )}

            {/* Button */}
            <div className="shrink-0" style={{ marginTop: 32 }}>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-sm text-white hover:brightness-110 disabled:opacity-70 disabled:pointer-events-none active:scale-[0.99] transition-all"
                style={{ backgroundColor: "var(--color-primary)", fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 16, lineHeight: "20px", padding: "12px 24px", boxShadow: "0px 1px 2px 0px rgba(16,24,40,0.05)" }}
              >
                {loading ? "Ingresando…" : "Confirmar"}
              </button>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Footer */}
            <div className="shrink-0 text-center">
              <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: "var(--text-body-sm)", lineHeight: "16px", letterSpacing: "1px", color: "#000" }}>© Desarrollos propios 2026</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Select screen ────────────────────────────────────────────────────────────

function SelectScreen({ onSelect }: { onSelect: (v: "clasico" | "nuevo") => void }) {
  const [hovered, setHovered] = useState<string | null>(null);

  const options = [
    {
      id: "clasico",
      title: "SISENRE clásico",
      desc: "El SISENRE de siempre, el que ya conocías.",
      disabled: true,
    },
    {
      id: "nuevo",
      title: "SISENRE 2.0",
      desc: "Nuevo SISENRE, nuevo motor de datos y framework moderno.",
      disabled: false,
    },
  ] as const;

  return (
    <div
      className="w-full h-screen flex items-center justify-center"
      style={{ fontFamily: "'Inter', system-ui, sans-serif", backgroundColor: "#F2F5FA" }}
    >
      <div className="w-full max-w-[520px] px-6">
        {/* Header */}
        <div className="mb-6 pb-5 border-b border-gray-300">
          <h1 className="text-title-sm font-bold text-gray-900 mb-1">Bienvenido a SISENRE</h1>
          <p className="text-[13.5px] text-[#6B7E9A]">Seleccioná con qué herramienta comenzarás a trabajar</p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3">
          {options.map((opt) => {
            const isHov = hovered === opt.id && !opt.disabled;
            return (
              <button
                key={opt.id}
                disabled={opt.disabled}
                onClick={() => !opt.disabled && onSelect(opt.id)}
                onMouseEnter={() => setHovered(opt.id)}
                onMouseLeave={() => setHovered(null)}
                className="w-full text-left px-5 py-4 rounded-lg border transition-all duration-150"
                style={{
                  backgroundColor: isHov ? "#fff" : "#fff",
                  borderColor: isHov ? "var(--color-primary)" : "var(--color-gray-300)",
                  boxShadow: isHov ? "0 4px 16px rgba(77,151,250,0.12)" : "0 1px 3px rgba(21,40,80,0.05)",
                  cursor: opt.disabled ? "not-allowed" : "pointer",
                  opacity: opt.disabled ? 0.55 : 1,
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-label font-semibold text-gray-900 mb-0.5">{opt.title}</p>
                    <p className="text-[12.5px] text-[#6B7E9A]">{opt.desc}</p>
                  </div>
                  {!opt.disabled && (
                    <span
                      className="shrink-0 ml-4 transition-transform duration-150"
                      style={{
                        color: isHov ? "var(--color-primary)" : "#B8C8DC",
                        transform: isHov ? "translateX(3px)" : "none",
                      }}
                    >
                      <ChevronRight />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-center text-caption text-[#B0BAC9] mt-8">© Desarrollos propios 2026</p>
      </div>
    </div>
  );
}

// ─── Welcome screen content ───────────────────────────────────────────────────

function WelcomeContent() {
  const quickLinks = [
    { code: "CDS2", label: "Interrupciones", desc: "Consulta y gestión de interrupciones computadas", icon: <IcoZap /> },
    { code: "CDS3", label: "Interrupciones no computables", desc: "Registro de interrupciones no imputables", icon: <IcoZapOff /> },
    { code: "CDS4", label: "Reposiciones", desc: "Seguimiento de reposiciones de servicio", icon: <IcoRefresh /> },
    { code: "CDS8", label: "Reclamos", desc: "Gestión de reclamos de calidad de servicio", icon: <IcoMsg /> },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-10 py-10">
      {/* Greeting */}
      <div className="mb-8">
        <p className="text-body-sm font-medium uppercase tracking-widest text-gray-500 mb-1">SISENRE 2.0 · Agosto 2026</p>
        <h2 className="text-title font-bold text-gray-900 leading-tight">Buenos días, Rdellamagiora</h2>
        <p className="text-[14px] text-[#6B7E9A] mt-1">Seleccioná una sección del menú o usá los accesos rápidos para comenzar.</p>
      </div>

      {/* Quick access */}
      <p className="text-caption font-semibold uppercase tracking-[0.09em] text-gray-500 mb-3">Accesos frecuentes</p>
      <div className="grid grid-cols-2 gap-4" style={{ maxWidth: 760 }}>
        {quickLinks.map((item) => (
          <div
            key={item.code}
            className="group bg-white rounded-[7px] border border-gray-300 px-5 py-4 cursor-pointer transition-all duration-150 hover:border-primary hover:shadow-[0_4px_16px_rgba(77,151,250,0.1)]"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-primary shrink-0">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-[13.5px] font-semibold text-gray-900">{item.label}</p>
                  <span
                    className="text-micro font-mono font-medium px-1.5 py-0.5 rounded-[3px] border border-gray-400 text-[#7A95B8]"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {item.code}
                  </span>
                </div>
                <p className="text-body-sm text-[#7A95B8] leading-snug">{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

// ─── Modal: Datos de la interrupción ───────────────────────────────────────
// Mismo chrome que el resto de los modales de la app (Modal genérico:
// header claro, X, footer con modalNeutralBtnCls/modalPrimaryBtnCls), sin
// excepciones de color — "Procesar" usa el mismo azul primario que el botón
// principal de cualquier otro modal.

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[9px] font-semibold uppercase tracking-[0.05em] text-gray-600 mb-1 truncate">{label}</p>
      <div className="h-7 px-2 flex items-center text-[11.5px] bg-[#F4F6F9] border border-gray-300 rounded-sm text-gray-700 truncate">
        {value || " "}
      </div>
    </div>
  );
}

const DATOS_INTERRUPCION_COLUMNS: { label: string; value: string }[][] = [
  [
    { label: "Repos", value: "1" },
    { label: "Usu_BT", value: "0" },
    { label: "Usu_MT", value: "0" },
    { label: "Pot Cont", value: "0" },
    { label: "CT", value: "0" },
    { label: "CT en 0", value: "0" },
    { label: "Usu BT CT", value: "0" },
    { label: "Rec", value: "0" },
    { label: "Reit", value: "0" },
    { label: "Rec ENRE", value: "0" },
  ],
  [
    { label: "Rec ATF", value: "0" },
    { label: "Rec ATP", value: "0" },
    { label: "Rec MTF", value: "0" },
    { label: "Rec MTP", value: "0" },
    { label: "Rec BTF", value: "0" },
    { label: "Rec BTP", value: "0" },
    { label: "Rec Otros", value: "0" },
    { label: "Hue Ini", value: "" },
    { label: "Max Fin", value: "" },
    { label: "Hue Fin", value: "" },
  ],
  [
    { label: "Hue Rec 180", value: "" },
    { label: "Rec 12", value: "0" },
    { label: "Rec AU", value: "0" },
    { label: "Hue Ini SR", value: "" },
    { label: "Max Med SR", value: "" },
    { label: "Hue Fin SR", value: "" },
    { label: "Hue Rec 180 SR", value: "" },
    { label: "Rec 12 SR", value: "0" },
    { label: "Rec Au SR", value: "0" },
    { label: "Cli T9", value: "0" },
  ],
  [
    { label: "T9 T3 MT", value: "0" },
    { label: "T9 T3 BT", value: "0" },
    { label: "Cli T9 no T3", value: "0" },
    { label: "Cli T9 AP", value: "0" },
    { label: "Dura Max", value: "" },
    { label: "Cli Int", value: "0" },
    { label: "Cli Min", value: "0" },
  ],
  [
    { label: "SAIFI", value: "0.00" },
    { label: "SAIDI", value: "0.00" },
    { label: "Energ no Suminist", value: "0" },
    { label: "Marginal", value: "0" },
    { label: "Marginal Aj", value: "0" },
  ],
];

function DatosInterrupcionModal({
  open,
  onClose,
  referencia,
  fechaInicio,
  fechaUltRepo,
}: {
  open: boolean;
  onClose: () => void;
  referencia: string;
  fechaInicio: string;
  fechaUltRepo: string;
}) {
  const topFields = [
    { label: "Interrupción", value: referencia },
    { label: "Fecha inicio", value: fechaInicio },
    { label: "Fecha ult. repo.", value: fechaUltRepo },
    { label: "Inicio del proceso", value: fechaInicio },
    { label: "Fin del proceso", value: fechaUltRepo },
    { label: "Usuario del proceso", value: "RDELLAMAGIORA" },
  ];

  return (
    <Modal
      title="Datos de la Interrupción"
      subtitle={referencia}
      open={open}
      onClose={onClose}
      size="xl"
      footer={
        <>
          <button type="button" onClick={onClose} className={modalNeutralBtnCls} style={{ color: "var(--color-secondary)" }}>
            Salir
          </button>
          <button type="button" onClick={onClose} className={modalPrimaryBtnCls} style={{ backgroundColor: "var(--color-primary)" }}>
            Procesar
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-6 gap-3">
          {topFields.map((f) => (
            <ReadOnlyField key={f.label} label={f.label} value={f.value} />
          ))}
        </div>

        <div className="grid grid-cols-5 gap-4">
          {DATOS_INTERRUPCION_COLUMNS.map((col, ci) => (
            <div key={ci} className="flex flex-col gap-2.5">
              {col.map((f) => (
                <ReadOnlyField key={f.label} label={f.label} value={f.value} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

// ─── Modificar content ────────────────────────────────────────────────────────

const RECORD = SAMPLE_ROWS[0]; // BFZ202607056849

const MOD_FIELD_CLS =
  "w-full h-8 px-2.5 text-[12.5px] bg-white border border-gray-400 rounded-sm text-gray-900 " +
  "placeholder:text-gray-500 focus:outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/10 transition-all duration-150";

const MOD_SELECT_CLS =
  "h-8 px-2.5 pr-7 text-[12.5px] bg-white border border-gray-400 rounded-sm text-gray-900 appearance-none " +
  "cursor-pointer focus:outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/10 transition-all duration-150 shrink-0";

// Campos del flyout "Más filtros" de la Card A. Cada uno se puede aplicar,
// mostrar como chip removible debajo de la filter bar, y contar para el
// badge del botón "Más filtros".
type FlyoutFilters = {
  fecha: string;
  codigoEquipo: string;
  descEquipo: string;
  cadenaElectrica: string;
  alimentadorMT: string;
  centroTransf: string;
  divisionRed: string;
};

const EMPTY_FLYOUT_FILTERS: FlyoutFilters = {
  fecha: "", codigoEquipo: "", descEquipo: "", cadenaElectrica: "", alimentadorMT: "", centroTransf: "", divisionRed: "",
};

const FLYOUT_FIELDS: { key: keyof FlyoutFilters; label: string; placeholder: string }[] = [
  { key: "fecha", label: "Fecha", placeholder: "dd/mm/aaaa hh:mm" },
  { key: "codigoEquipo", label: "Código equipo", placeholder: "@27947890" },
  { key: "descEquipo", label: "Descripción equipo operado", placeholder: "PROTECCION DE SUMINISTRO" },
  { key: "cadenaElectrica", label: "Cadena eléctrica", placeholder: "NCBT" },
  { key: "alimentadorMT", label: "Alimentador MT", placeholder: "NCBT" },
  { key: "centroTransf", label: "Centro de transformación", placeholder: "52705#B1#52705-TR1#1#3" },
  { key: "divisionRed", label: "División red normal", placeholder: "S" },
];

const ACTION_LABELS = ["Desarmes", "Nivel/Tipo", "Replicar", "Cambia fases", "Alta clientes", "Lotes", "Intercambio"];

const STATUS_ITEMS = [
  { label: "TABLA 3", value: "NO", alert: false, tabKey: "tabla3" },
  { label: "TABLA 5", value: "0", alert: false, tabKey: "tabla5" },
  { label: "TABLA 6", value: "0", alert: false, tabKey: "tabla6" },
  { label: "TABLA 8", value: "1", alert: true,  tabKey: "tabla8" },
  { label: "TABLA 9", value: "8", alert: true,  tabKey: "tabla9" },
];

// Fases de reposición de la interrupción seleccionada — hoy vive en
// DRAWER_TABS.tabla4, mostrada siempre visible en la Card B de Modificar
// interrupción (ya no detrás de un tab del drawer).
const FASES = [
  { nro: 1, horaRep: "01/07/2026 00:43", clientes: 1, clientesTA: 1 },
];

const DRAWER_TABS = [
  {
    key: "tabla4", label: "Tabla 4",
    subtitle: "Reposiciones",
    cols: ["Reposición", "Hora reposición", "Cant. clientes", "Cant. clientes T5"],
    rows: FASES.map((f) => [String(f.nro), f.horaRep, String(f.clientes), String(f.clientesTA)]),
  },
  {
    key: "tabla3", label: "Tabla 3",
    subtitle: "Existencia en tabla",
    cols: ["Existencia"],
    rows: [] as string[][],
  },
  {
    key: "tabla5", label: "Tabla 5",
    subtitle: "Transformadores MT/BT repuestos en interrupciones AT/MT (CDS5)",
    cols: ["Interrupción", "Fase", "Cadena eléctrica", "Potencia (Kva)", "Fase eléctrica", "Cant. clientes BT"],
    rows: [] as string[][],
  },
  {
    key: "tabla6", label: "Tabla 6",
    subtitle: "Clientes AT/MT afectados en interrupciones AT/MT (CDS6)",
    cols: ["Interrupción", "Fase", "Cliente", "Consumo", "CT T9", "CT T10", "Tarifa", "Demanda media", "Tensión"],
    rows: [] as string[][],
  },
  {
    key: "tabla8", label: "Tabla 8",
    subtitle: "Reclamos de clientes (CDS8)",
    cols: ["Reclamo", "Fecha", "Cliente", "Nombre", "Tarifa", "Causa", "Piso", "Dpto", "Partido"],
    rows: [["78291", "01/07/2026 00:05", "47291038", "GARCIA LUIS", "T1", "Falta de tensión", "3", "A", "SAN ISIDRO"]],
  },
  {
    key: "tabla9", label: "Tabla 9",
    subtitle: "Interrupciones por cliente (CDS9)",
    cols: ["Interrupción", "Fase", "Cliente", "Tarifa", "CT T9", "CT T10"],
    rows: [
      ["MFZ201911000003", "1", "0932073585", "1R", "9187#B1#9187-TR1", "9187#B1#9187-TR1#1#1"],
      ["MFZ201911000003", "1", "0420679018", "1R", "9552#B1#9552-TR1", "9552#B1#9552-TR1#1#1"],
      ["MFZ201911000003", "1", "8064795584", "1G", "9552#B1#9552-TR1", "9552#B1#9552-TR1#1#1"],
      ["MFZ201911000003", "1", "6332256529", "1R", "9187#B1#9187-TR1", "9187#B1#9187-TR1#1#1"],
      ["MFZ201911000003", "1", "9212796994", "1R", "9187#B1#9187-TR1", "9187#B1#9187-TR1#1#1"],
      ["MFZ201911000003", "1", "1835073321", "1R", "9187#B1#9187-TR1", "9187#B1#9187-TR1#1#2"],
      ["MFZ201911000003", "1", "7423312576", "1R", "9187#B1#9187-TR1", "9187#B1#9187-TR1#1#1"],
      ["MFZ201911000003", "1", "5265910967", "1R", "9187#B1#9187-TR1", "9187#B1#9187-TR1#1#2"],
    ],
  },
];

function CardHeader({ title, tag }: { title: string; tag?: string }) {
  return (
    <div className="px-5 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0 flex items-center gap-2">
      <span className="text-[11.5px] font-semibold text-gray-700">{title}</span>
      {tag && (
        <span className="text-micro font-medium px-1.5 py-0.5 rounded-[3px] border border-gray-400 text-[#7A95B8]"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}>{tag}</span>
      )}
    </div>
  );
}

// Selector tipo botón (single-select) — usado en el formulario de Modificar
// interrupción para Origen y Tipo. El estado seleccionado se marca con
// borde + relleno claro (mismo lenguaje que el toggle "Filtro" de
// AltaClientesModal), nunca el azul relleno reservado para botones de
// acción primarios.
function ButtonSelectGroup({
  options,
  selected,
  onToggle,
  disabled = false,
}: {
  options: string[];
  selected: string[];
  onToggle: (opt: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {options.map((opt) => {
        const isSel = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            disabled={disabled}
            aria-pressed={isSel}
            onClick={() => onToggle(opt)}
            className={`h-8 px-2.5 text-body-sm rounded-sm font-medium border transition-all duration-150 shrink-0 ${
              disabled
                ? "bg-[#F4F6F9] border-gray-300 text-[#B8C8DC] cursor-not-allowed"
                : isSel
                ? "bg-primary-tint border-primary text-secondary"
                : "bg-white border-gray-400 text-gray-700 hover:border-[#97B0CF] hover:bg-[#F4F7FC] active:scale-[0.98]"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// Barra de acciones contextual de la tabla "Interrupciones" (navegador
// compacto) en Modificar interrupción. Reusa actionBtnCls/ActionItem tal
// cual — mismos botones/variantes/colores que SelectionActionBar — pero en
// una única línea de altura fija: si los botones no entran en el ancho de
// la card, scrollean horizontalmente en vez de wrappear a varias líneas y
// comerse el espacio de la lista de referencias. Sin label/referencia — esa
// info ya se ve en el header "Interrupción" de la Card B de al lado.
// SelectionActionBar en sí no se toca y sigue igual en CDS2/CDS3/CDS4.
function CompactSelectionActionBar({ actions }: { actions: ActionItem[] }) {
  return (
    <div className="px-4 py-2 border-b border-gray-200 bg-white shrink-0 flex items-center gap-2 overflow-x-auto">
      {actions.map((a) => (
        <button key={a.label} onClick={a.onClick} className={actionBtnCls(a.variant) + " shrink-0"}>
          {a.label}
        </button>
      ))}
    </div>
  );
}

function ModificarContent() {
  const [hovFase, setHovFase] = useState<number | null>(null);
  const [modShowData, setModShowData] = useState(false);
  const [modSelectedRow, setModSelectedRow] = useState<number | null>(null);
  const [drawerTab, setDrawerTab] = useState<string | null>(null);
  const [origenSel, setOrigenSel] = useState<string | null>(null);
  const [tipoSel, setTipoSel] = useState<string | null>(null);
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const [flyoutFilters, setFlyoutFilters] = useState<FlyoutFilters>(EMPTY_FLYOUT_FILTERS);
  const [desarmeOpen, setDesarmeOpen] = useState(false);
  const [nivelTipoOpen, setNivelTipoOpen] = useState(false);
  const [replicarOpen, setReplicarOpen] = useState(false);
  const [cambiaFasesOpen, setCambiaFasesOpen] = useState(false);
  const [altaClientesOpen, setAltaClientesOpen] = useState(false);
  const [lotesOpen, setLotesOpen] = useState(false);
  const [intercambioOpen, setIntercambioOpen] = useState(false);
  const [datosInterrupcionOpen, setDatosInterrupcionOpen] = useState(false);
  const hasSelection = modSelectedRow !== null;
  const activeTabData = DRAWER_TABS.find(t => t.key === drawerTab);
  const selectedRecord = modSelectedRow !== null ? SAMPLE_ROWS[modSelectedRow] : null;

  // Filtros del flyout "Más filtros" con valor cargado — alimentan el badge
  // del botón y los chips removibles debajo de la filter bar.
  const activeFlyoutFields = FLYOUT_FIELDS.filter((f) => flyoutFilters[f.key].trim() !== "");

  function clearFlyoutField(key: keyof FlyoutFilters) {
    setFlyoutFilters((prev) => ({ ...prev, [key]: "" }));
  }

  const CARD_SHADOW = { boxShadow: "var(--shadow-low)" };

  // Tabla Referencia / Fecha (columna derecha)
  const modColumns = ["Referencia", "Fecha"];
  const modGetCells = (row: (typeof SAMPLE_ROWS)[number]) => [row.referencia, row.fecha];
  const { search: modSearch, setSearch: setModSearch, sortIdx: modSortIdx, sortDir: modSortDir, toggleSort: modToggleSort, visibleIndices: modVisibleIndices } =
    useTableToolbar(SAMPLE_ROWS, modGetCells);

  // Tabla del drawer de indicadores — se resetea al cambiar de tab
  const drawerRows = activeTabData?.rows ?? [];
  const drawerGetCells = (row: string[]) => row;
  const { search: drawerSearch, setSearch: setDrawerSearch, sortIdx: drawerSortIdx, sortDir: drawerSortDir, toggleSort: drawerToggleSort, visibleIndices: drawerVisibleIndices } =
    useTableToolbar(drawerRows, drawerGetCells, drawerTab);

  // Tabla 4 (Reposiciones) — siempre visible en la Card B, ya no vive detrás
  // de un tab del drawer.
  const tabla4Data = DRAWER_TABS.find(t => t.key === "tabla4")!;

  // Datos de la Interrupción (widget + modal, Card B) — usa la interrupción
  // seleccionada y la última reposición ya cargada en tabla4Data cuando hay
  // datos disponibles.
  const timelineReferencia = selectedRecord?.referencia ?? "MFZ202401000051";
  const timelineFechaInicio = selectedRecord?.fecha ?? "01/01/2024 00:27";
  const lastRepoRow = tabla4Data.rows[tabla4Data.rows.length - 1];
  const timelineFechaUltRepo = lastRepoRow ? lastRepoRow[1] : "01/01/2024 02:35";
  const timelineDuracion = "0 dias, 2 hs, 8 min";
  const timelineTicks = [0, 14, 22, 38, 47, 63, 81, 100];

  // Navegación por teclado en la tabla de Interrupciones: flecha abajo/arriba
  // mueve la selección entre filas visibles y actualiza en vivo la Card B,
  // igual que un click sobre la fila.
  const modListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modSelectedRow === null || !modListRef.current) return;
    modListRef.current
      .querySelector<HTMLElement>(`[data-row-index="${modSelectedRow}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [modSelectedRow]);

  function handleModListKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!modShowData || modVisibleIndices.length === 0) return;
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    if (modSelectedRow === null) {
      setModSelectedRow(e.key === "ArrowDown" ? modVisibleIndices[0] : modVisibleIndices[modVisibleIndices.length - 1]);
      return;
    }
    const currentPos = modVisibleIndices.indexOf(modSelectedRow);
    const nextPos =
      e.key === "ArrowDown"
        ? Math.min(currentPos + 1, modVisibleIndices.length - 1)
        : Math.max(currentPos - 1, 0);
    setModSelectedRow(modVisibleIndices[Math.max(nextPos, 0)]);
  }

  return (
    <div className="flex-1 overflow-y-auto p-5 relative">
    <div className="flex flex-col gap-5">

        {/* Card A — filter bar compacta, una sola fila, + flyout "Más filtros" */}
        <div className="relative shrink-0">
          <div
            className="relative z-30 flex items-center gap-2 rounded-sm border border-[#D8E4F0] bg-white px-3 py-2.5"
            style={CARD_SHADOW}
          >
            <SelectWrap className="w-[60px] shrink-0">
              <select className={MOD_SELECT_CLS + " w-full"} style={{ fontWeight: 600 }}>
                <option>BT</option><option>MT</option><option>AT</option>
              </select>
            </SelectWrap>

            <input
              placeholder={`Ej: ${RECORD.referencia}`}
              className={MOD_FIELD_CLS}
              style={{ width: 190, flexShrink: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5 }}
            />

            <SelectWrap className="w-[110px] shrink-0">
              <select className={MOD_SELECT_CLS + " w-full"} defaultValue="">
                <option value="" disabled>Fase</option>
                <option>R</option><option>S</option><option>T</option>
                <option>RS</option><option>RT</option><option>ST</option><option>RST</option>
              </select>
            </SelectWrap>

            <div className="w-px h-5 bg-gray-300 shrink-0" />

            <span className="text-micro font-semibold uppercase tracking-[0.08em] text-gray-500 shrink-0">Origen</span>
            <ButtonSelectGroup
              options={["Interno", "Externo"]}
              selected={origenSel ? [origenSel] : []}
              onToggle={(opt) => setOrigenSel(origenSel === opt ? null : opt)}
              disabled={modShowData}
            />

            <span className="text-micro font-semibold uppercase tracking-[0.08em] text-gray-500 shrink-0">Tipo</span>
            <ButtonSelectGroup
              options={["Forzado", "Programado"]}
              selected={tipoSel ? [tipoSel] : []}
              onToggle={(opt) => setTipoSel(tipoSel === opt ? null : opt)}
              disabled={modShowData}
            />

            <div className="ml-auto flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setFlyoutOpen((v) => !v)}
                className={`h-8 px-2.5 rounded-sm text-body-sm font-medium border flex items-center gap-1.5 transition-all duration-150 ${
                  activeFlyoutFields.length > 0
                    ? "bg-primary-tint border-primary text-secondary"
                    : "bg-white border-gray-400 text-gray-700 hover:border-[#97B0CF] hover:bg-[#F4F7FC]"
                }`}
              >
                <IcoFilter />
                Más filtros
                {activeFlyoutFields.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">
                    {activeFlyoutFields.length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setModShowData(false);
                  setModSelectedRow(null);
                  setOrigenSel(null);
                  setTipoSel(null);
                  setFlyoutFilters(EMPTY_FLYOUT_FILTERS);
                }}
                disabled={!modShowData}
                className="h-8 px-3.5 rounded-sm text-body-sm font-medium border-2 border-primary bg-white hover:bg-primary-tint transition-colors duration-150 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
                style={{ color: "var(--color-secondary)" }}
              >Limpiar</button>
              <button
                type="button"
                onClick={() => { setModShowData(true); setModSelectedRow(null); }}
                disabled={modShowData}
                className="h-8 px-4 rounded-sm text-body-sm font-semibold text-white transition-all duration-150 active:scale-[0.99] hover:brightness-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
                style={{ backgroundColor: "var(--color-primary)" }}
              >Buscar</button>
            </div>
          </div>

          {/* Chips de filtros aplicados (flyout) — franja propia, no texto suelto */}
          {activeFlyoutFields.length > 0 && (
            <div className="flex items-center flex-wrap gap-2 mt-2 px-3 py-2 rounded-sm border border-[#E4EAF4] bg-gray-50">
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.06em] text-gray-600 shrink-0">
                Filtros aplicados:
              </span>
              {activeFlyoutFields.map((f) => (
                <span
                  key={f.key}
                  className="inline-flex items-center gap-1.5 h-7 pl-3 pr-1.5 rounded-full bg-primary-tint border border-[#B9D2FB] text-secondary text-body-sm font-semibold"
                >
                  {f.label}: {flyoutFilters[f.key]}
                  <button
                    type="button"
                    onClick={() => clearFlyoutField(f.key)}
                    className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-[#D9E9FF] transition-colors"
                  >
                    <svg width="8" height="8" viewBox="0 0 14 14" fill="none">
                      <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Backdrop — no bloqueante, sólo cierra el flyout al click afuera */}
          {flyoutOpen && (
            <div className="fixed inset-0 z-20" onClick={() => setFlyoutOpen(false)} />
          )}

          {/* Flyout "Más filtros" */}
          {flyoutOpen && (
            <div
              className="absolute right-0 z-30 bg-white border border-[#D8E4F0] rounded-lg p-4"
              style={{ top: "calc(100% + 6px)", width: 520, boxShadow: "var(--shadow-high)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-body font-semibold text-gray-900">Más filtros</span>
                <button
                  type="button"
                  onClick={() => setFlyoutOpen(false)}
                  className="w-6 h-6 flex items-center justify-center rounded-sm text-gray-500 hover:bg-[#EEF2F8] hover:text-gray-800 transition-all"
                >
                  <IcoX />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-x-3.5 gap-y-3">
                {FLYOUT_FIELDS.map((f) => (
                  <div key={f.key}>
                    <FieldLabel>{f.label}</FieldLabel>
                    <input
                      placeholder={f.placeholder}
                      value={flyoutFilters[f.key]}
                      onChange={(e) => setFlyoutFilters((prev) => ({ ...prev, [f.key]: e.target.value }))}
                      className={MOD_FIELD_CLS}
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setFlyoutFilters(EMPTY_FLYOUT_FILTERS)}
                  className="text-body-sm font-medium text-primary hover:text-secondary transition-colors"
                >
                  Limpiar filtros
                </button>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setFlyoutOpen(false)}
                    className="h-8 px-3.5 rounded-sm text-body-sm font-medium border border-gray-400 bg-white text-gray-700 hover:bg-[#F4F7FC] transition-colors"
                  >
                    Cerrar
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlyoutOpen(false)}
                    className="h-8 px-4 rounded-sm text-body-sm font-semibold text-white hover:brightness-105 transition-all"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      {/* ── FILA INFERIOR — tabla de datos y Reposiciones (CDS4), una al lado de
          la otra, misma altura (stretch: ninguna de las dos fuerza una altura
          propia, ambas quedan del alto de la más alta) ── */}
      <div className={`flex items-stretch gap-5 transition-opacity duration-150 ${flyoutOpen ? "opacity-50 pointer-events-none" : ""}`}>

      {/* ── Tabla de datos — navegador de referencias, mismo alto y mismo
          tratamiento de card que Card B ── */}
      <div
        className="flex-1 flex flex-col rounded-sm border border-[#D8E4F0] bg-white overflow-hidden"
        style={CARD_SHADOW}
      >

        {/* Header — mismo componente/tratamiento que el de Card B (Reposiciones) */}
        <CardHeader title="Interrupciones" />

        {/* Table toolbar — buscador / exportar */}
        {modShowData && (
          <TableToolbar
            search={modSearch}
            onSearchChange={setModSearch}
            onExport={() =>
              exportRowsToCsv("interrupciones", modColumns, modVisibleIndices.map((i) => modGetCells(SAMPLE_ROWS[i])))
            }
          />
        )}

        {/* Contextual action bar — visible only when a row is selected. Altura
            fija de una sola línea (ver CompactSelectionActionBar) para no
            comerse el espacio de la lista de referencias de abajo. Sin label
            de referencia: ya se ve en el header "Interrupción" de Card B. */}
        {hasSelection && (
          <CompactSelectionActionBar
            actions={ACTION_LABELS.map((label) => {
              if (label === "Desarmes") return { label, onClick: () => setDesarmeOpen(true) };
              if (label === "Nivel/Tipo") return { label, onClick: () => setNivelTipoOpen(true) };
              if (label === "Replicar") return { label, onClick: () => setReplicarOpen(true) };
              if (label === "Cambia fases") return { label, onClick: () => setCambiaFasesOpen(true) };
              if (label === "Alta clientes") return { label, onClick: () => setAltaClientesOpen(true) };
              if (label === "Lotes") return { label, onClick: () => setLotesOpen(true) };
              if (label === "Intercambio") return { label, onClick: () => setIntercambioOpen(true) };
              return { label };
            })}
          />
        )}
        {/* Tabla Referencia / Fecha */}
        <div className="grid grid-cols-2 px-4 border-b border-[#EEF2F8] bg-[#FAFBFD] shrink-0">
          <SortableHeaderCell
            label="Referencia"
            active={modSortIdx === 0}
            dir={modSortDir}
            onClick={() => modToggleSort(0)}
            className="py-1.5 text-[9.5px]"
          />
          <SortableHeaderCell
            label="Fecha"
            active={modSortIdx === 1}
            dir={modSortDir}
            onClick={() => modToggleSort(1)}
            className="py-1.5 text-[9.5px]"
          />
        </div>
        <div
          ref={modListRef}
          tabIndex={modShowData ? 0 : -1}
          onKeyDown={handleModListKeyDown}
          className="flex-1 overflow-y-auto outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/30"
        >
          {!modShowData ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-center px-8">
              <span className="text-[#D5DEEC] scale-90"><IcoInbox /></span>
              <p className="text-body-sm font-medium text-gray-500">Sin resultados</p>
              <p className="text-caption text-[#B0BCCE]">Completá los filtros y presioná Buscar</p>
            </div>
          ) : modVisibleIndices.map((i) => {
            const row = SAMPLE_ROWS[i];
            const selected = modSelectedRow === i;
            return (
              <div
                key={i}
                data-row-index={i}
                className="grid grid-cols-2 px-4 border-b border-[#F4F7FC] transition-colors cursor-pointer hover:bg-[#F7F9FC]"
                style={{ backgroundColor: selected ? "var(--color-primary-tint)" : undefined, borderLeft: selected ? "3px solid var(--color-primary)" : "3px solid transparent" }}
                onClick={() => setModSelectedRow(selected ? null : i)}
              >
                <div className="py-1.5 text-caption tabular-nums pr-3"
                  style={{ fontFamily: "'JetBrains Mono', monospace", color: selected ? "var(--color-secondary)" : "#4A5C78", fontWeight: selected ? 600 : 400 }}>
                  {row.referencia}
                </div>
                <div className={`py-1.5 text-caption ${selected ? "text-secondary font-medium" : "text-[#8394AC]"}`}>{row.fecha}</div>
              </div>
            );
          })}
        </div>
        <div className="px-4 py-1.5 border-t border-[#EEF2F8] bg-[#FAFBFD] shrink-0 flex items-center justify-between">
          <button className="px-2 py-0.5 rounded border border-gray-300 bg-white text-[10.5px] text-gray-500 disabled:opacity-40" disabled>Anterior</button>
          <span className="text-[10.5px] text-gray-500">Página <span className="font-medium text-[#4A5C78]">1</span> de <span className="font-medium text-[#4A5C78]">2.213</span></span>
          <button className="px-2 py-0.5 rounded border border-gray-300 bg-white text-[10.5px] text-gray-500 hover:bg-[#F4F7FC] transition-colors">Siguiente</button>
        </div>
      </div>

        {/* Card B — Reposiciones (CDS4) */}
        <div
          className="flex-1 flex flex-col rounded-sm border border-[#D8E4F0] bg-white overflow-hidden"
          style={CARD_SHADOW}
        >
          <CardHeader title="Reposiciones (CDS4)" />
          <div>

            {/* Interrupción seleccionada — se actualiza en vivo con la fila activa de la derecha */}
            <div className="px-5 py-2.5 border-b border-[#EEF2F8] flex items-center gap-2">
              <span className="text-micro font-semibold uppercase tracking-[0.08em] text-gray-500">Interrupción</span>
              <span
                className="text-body-sm font-medium text-gray-800 tabular-nums"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {selectedRecord ? selectedRecord.referencia : "—"}
              </span>
            </div>

            {/* Tabla 4 — siempre visible, nunca detrás de un modal/drawer */}
            <div className="px-5 py-3 border-b border-[#EEF2F8]">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.07em] text-gray-600 mb-2">
                {tabla4Data.subtitle}
              </p>
              <div className="border border-gray-200 rounded-sm overflow-hidden overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      {tabla4Data.cols.map((c) => (
                        <th key={c} className="px-3 py-2 text-left text-micro font-semibold uppercase tracking-[0.06em] text-[#6B7E9A] whitespace-nowrap">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tabla4Data.rows.length === 0 ? (
                      <tr>
                        <td colSpan={tabla4Data.cols.length}>
                          <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
                            <span className="text-gray-400"><IcoInbox /></span>
                            <p className="text-[11.5px] text-gray-500">Sin reposiciones registradas</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      tabla4Data.rows.map((row, ri) => (
                        <tr
                          key={ri}
                          onMouseEnter={() => setHovFase(ri)}
                          onMouseLeave={() => setHovFase(null)}
                          className="border-b border-gray-100 last:border-b-0 transition-colors"
                          style={{ backgroundColor: hovFase === ri ? "var(--color-gray-50)" : undefined }}
                        >
                          {row.map((cell, ci) => (
                            <td key={ci} className="px-3 py-2.5 text-body-sm text-gray-700 whitespace-nowrap">{cell}</td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Indicadores de las tablas relacionadas — siguen abriendo el drawer */}
            <div className="px-5 py-3 border-b border-[#EEF2F8]">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.07em] text-gray-600 mb-2">Tablas relacionadas</p>
              <div className="grid grid-cols-3 gap-2">
                {STATUS_ITEMS.map((item) => (
                  <button
                    key={item.tabKey}
                    type="button"
                    disabled={!modShowData}
                    onClick={() => setDrawerTab(item.tabKey)}
                    className={`rounded-sm border px-2 py-2 flex flex-col gap-1 text-left transition-all duration-150 ${
                      !modShowData
                        ? "bg-[#F4F6F9] border-gray-300 cursor-not-allowed"
                        : `hover:ring-2 hover:ring-primary/30 active:scale-[0.97] ${item.alert ? "bg-[#FFFBEB] border-[#FCD34D]" : "bg-gray-50 border-gray-300"}`
                    }`}
                  >
                    <span className="text-[9.5px] text-gray-600 leading-tight">{item.label}</span>
                    <span className={`text-label font-semibold leading-none ${!modShowData ? "text-[#B8C8DC]" : item.alert ? "text-[#B45309]" : "text-gray-900"}`}>
                      {modShowData ? item.value : "–"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Datos de la Interrupción — abre el modal del mismo nombre */}
            <div className="px-5 py-4">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.07em] text-gray-600 mb-2.5">Datos de la Interrupción</p>
              <button
                type="button"
                onClick={() => setDatosInterrupcionOpen(true)}
                className="group w-full text-left rounded-sm border border-gray-300 overflow-hidden cursor-pointer transition-all duration-150 hover:border-primary hover:shadow-[0_2px_10px_rgba(77,151,250,0.1)]"
              >
                {/* Sparkline: ticks de reposición + apertura/cierre */}
                <div className="relative bg-white" style={{ height: 34 }}>
                  {timelineTicks.map((pct, i) => {
                    const isEdge = i === 0 || i === timelineTicks.length - 1;
                    return (
                      <div
                        key={i}
                        className="absolute top-1/2"
                        style={{
                          left: `${pct}%`,
                          width: isEdge ? 3 : 1.5,
                          height: isEdge ? 22 : 15,
                          backgroundColor: isEdge ? "var(--color-gray-900)" : "var(--color-primary)",
                          transform: "translate(-50%, -50%)",
                        }}
                      />
                    );
                  })}
                </div>
                {/* Barra de resumen */}
                <div className="px-3 py-2 text-center" style={{ backgroundColor: "var(--color-gray-700)" }}>
                  <span
                    className="text-caption font-medium text-white whitespace-nowrap"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {timelineFechaInicio}  -  {timelineReferencia}  -  {timelineFechaUltRepo}  -  {timelineDuracion}
                  </span>
                </div>
              </button>
            </div>

          </div>
        </div>

      </div>

      </div>

      {/* ── MODALES DE ACCIÓN ───────────────────────────────────── */}
      <DesarmeModal
        open={desarmeOpen}
        onClose={() => setDesarmeOpen(false)}
        referencia={selectedRecord?.referencia ?? ""}
      />
      <NivelTipoModal open={nivelTipoOpen} onClose={() => setNivelTipoOpen(false)} />
      <ReplicarModal
        open={replicarOpen}
        onClose={() => setReplicarOpen(false)}
        referencia={selectedRecord?.referencia ?? ""}
      />
      <CambiaFasesModal
        open={cambiaFasesOpen}
        onClose={() => setCambiaFasesOpen(false)}
        referencia={selectedRecord?.referencia ?? ""}
      />
      <AltaClientesModal
        open={altaClientesOpen}
        onClose={() => setAltaClientesOpen(false)}
        referencia={selectedRecord?.referencia ?? ""}
      />
      <LotesModal open={lotesOpen} onClose={() => setLotesOpen(false)} />
      <IntercambioModal
        open={intercambioOpen}
        onClose={() => setIntercambioOpen(false)}
        referencia={selectedRecord?.referencia ?? ""}
      />
      <DatosInterrupcionModal
        open={datosInterrupcionOpen}
        onClose={() => setDatosInterrupcionOpen(false)}
        referencia={timelineReferencia}
        fechaInicio={timelineFechaInicio}
        fechaUltRepo={timelineFechaUltRepo}
      />

      {/* ── DRAWER OVERLAY ──────────────────────────────────────── */}
      {drawerTab !== null && (
        <div
          className="fixed inset-0 z-40 bg-black/25"
          onClick={() => setDrawerTab(null)}
        />
      )}

      {/* ── DRAWER PANEL ────────────────────────────────────────── */}
      <div
        className="fixed top-0 right-0 h-full bg-white z-50 flex flex-col"
        style={{
          width: 900,
          boxShadow: "-4px 0 32px rgba(21,40,80,0.18)",
          transform: drawerTab !== null ? "translateX(0)" : "translateX(100%)",
          transition: "transform 280ms cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Drawer header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 shrink-0 flex items-center justify-between">
          <div>
            <p className="text-[10.5px] text-gray-600 uppercase tracking-[0.08em] font-semibold mb-0.5">Interrupción</p>
            <p className="text-[14px] font-semibold text-gray-900" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {selectedRecord ? selectedRecord.referencia : RECORD.referencia}
            </p>
          </div>
          <button
            onClick={() => setDrawerTab(null)}
            className="w-8 h-8 flex items-center justify-center rounded-sm text-gray-600 hover:bg-[#EEF2F8] hover:text-gray-800 transition-all"
          >
            <IcoX />
          </button>
        </div>

        {/* Tabs — Tabla 4 vive ahora siempre visible en la Card B, ya no acá */}
        <div className="flex border-b border-gray-200 px-6 shrink-0">
          {DRAWER_TABS.filter((tab) => tab.key !== "tabla4").map((tab) => (
            <button
              key={tab.key}
              onClick={() => setDrawerTab(tab.key)}
              className={`px-4 py-3 text-[12.5px] font-medium border-b-2 transition-colors ${
                drawerTab === tab.key
                  ? "border-primary text-secondary"
                  : "border-transparent text-gray-600 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {activeTabData && (
            <>
              {/* Subtitle */}
              {activeTabData.subtitle && (
                <div className="px-5 py-2.5 border-b border-[#EEF2F8] shrink-0">
                  <p className="text-[11.5px] text-gray-600 leading-snug">{activeTabData.subtitle}</p>
                </div>
              )}

              {/* Tabla 3: existencia simple */}
              {activeTabData.key === "tabla3" ? (() => {
                const existe = STATUS_ITEMS.find(i => i.tabKey === "tabla3")?.value === "SI";
                return (
                  <div className="flex flex-col items-center justify-center flex-1 gap-4 py-16">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: existe ? "#DCFCE7" : "#FEE2E2" }}
                    >
                      {existe ? (
                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                          <path d="M8 18l7 7 13-13" stroke="var(--color-success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                          <path d="M10 10l16 16M26 10L10 26" stroke="var(--color-error)" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-[16px] font-semibold mb-1" style={{ color: existe ? "#15803D" : "#B91C1C" }}>
                        {existe ? "SÍ existe en Tabla 3" : "NO existe en Tabla 3"}
                      </p>
                      <p className="text-body-sm text-gray-500">
                        {existe
                          ? "Esta interrupción tiene registro en la tabla"
                          : "Esta interrupción no tiene registro en la tabla"}
                      </p>
                    </div>
                  </div>
                );
              })() : (
                /* Tabla con scroll horizontal para columnas anchas */
                <div className="flex-1 flex flex-col overflow-hidden">
                  {activeTabData.rows.length > 0 && (
                    <TableToolbar
                      search={drawerSearch}
                      onSearchChange={setDrawerSearch}
                      onExport={() =>
                        exportRowsToCsv(
                          activeTabData.label.replace(/\s+/g, "_").toLowerCase(),
                          activeTabData.cols,
                          drawerVisibleIndices.map((i) => drawerGetCells(activeTabData.rows[i]))
                        )
                      }
                    />
                  )}
                  <div className="flex-1 overflow-x-auto overflow-y-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          {activeTabData.cols.map((col, ci) => (
                            <SortableTh
                              key={col}
                              label={col}
                              active={drawerSortIdx === ci}
                              dir={drawerSortDir}
                              onClick={() => drawerToggleSort(ci)}
                            />
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {activeTabData.rows.length === 0 ? (
                          <tr>
                            <td colSpan={activeTabData.cols.length}>
                              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                                <span className="text-gray-400"><IcoInbox /></span>
                                <p className="text-body font-medium text-gray-600">Sin registros</p>
                                <p className="text-body-sm text-gray-500">Esta tabla no tiene datos para esta interrupción</p>
                              </div>
                            </td>
                          </tr>
                        ) : drawerVisibleIndices.map((ri) => (
                          <tr key={ri} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            {activeTabData.rows[ri].map((cell, ci) => (
                              <td key={ci} className="px-4 py-3.5 text-[12.5px] text-gray-700 whitespace-nowrap">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

    </div>
  );
}

// ─── CDS3 screen ─────────────────────────────────────────────────────────────

function CDS3Content() {
  const [showData, setShowData] = useState(false);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const hasSelection = selectedRow !== null;
  const cds3Columns = ["Referencia", "Fase"];
  const cds3GetCells = (row: (typeof CDS3_ROWS)[number]) => [row.referencia, row.fase];
  const { search: cds3Search, setSearch: setCds3Search, sortIdx: cds3SortIdx, sortDir: cds3SortDir, toggleSort: cds3ToggleSort, visibleIndices: cds3VisibleIndices } =
    useTableToolbar(CDS3_ROWS, cds3GetCells);

  return (
    <div className="flex-1 flex overflow-hidden p-5 gap-5">

      {/* ── Left column: form ── */}
      <div
        className="flex flex-col rounded-sm border border-[#D8E4F0] bg-white shrink-0 overflow-hidden"
        style={{ width: "41%", boxShadow: "var(--shadow-low)" }}
      >
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">

          <div>
            <SectionDivider title="Identificación" />
            <div className="flex flex-col gap-3">
              <div>
                <FieldLabel>Código de interrupción</FieldLabel>
                <input className={inputCls} placeholder="Ej: BPR202607059383" />
              </div>
              <div style={{ width: "40%" }}>
                <FieldLabel>Fase de reposición</FieldLabel>
                <input className={inputCls} placeholder="1" />
              </div>
            </div>
          </div>

          <div>
            <SectionDivider title="Clasificación" />
            <div>
              <FieldLabel>Causa</FieldLabel>
              <SelectWrap>
                <select className={selectCls}>
                  <option value="">Seleccione</option>
                  {CAUSAS_NC.map((c) => <option key={c}>{c}</option>)}
                </select>
              </SelectWrap>
            </div>
          </div>

        </div>

        <div className="shrink-0 border-t border-gray-200 px-5 py-4 flex gap-3">
          <button
            onClick={() => { setShowData(false); setSelectedRow(null); }}
            disabled={!showData}
            className="flex-1 h-9 rounded-md text-body font-medium border-2 border-primary bg-white hover:bg-primary-tint transition-colors duration-150 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
            style={{ color: "var(--color-secondary)" }}
          >Limpiar</button>
          <button
            onClick={() => { setShowData(true); setSelectedRow(null); }}
            disabled={showData}
            className="flex-1 h-9 rounded-md text-body font-semibold text-white transition-all duration-150 active:scale-[0.99] hover:brightness-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
            style={{ backgroundColor: "var(--color-primary)" }}
          >Buscar</button>
        </div>
      </div>

      {/* ── Right column ── */}
      <div
        className="flex-1 flex flex-col border border-gray-300 rounded-sm bg-white overflow-hidden"
        style={{ boxShadow: "var(--shadow-low)" }}
      >
        {/* Table toolbar — buscador / exportar */}
        {showData && (
          <TableToolbar
            search={cds3Search}
            onSearchChange={setCds3Search}
            onExport={() =>
              exportRowsToCsv(
                "interrupciones_no_computables",
                cds3Columns,
                cds3VisibleIndices.map((i) => cds3GetCells(CDS3_ROWS[i]))
              )
            }
          />
        )}

        {/* Contextual action bar */}
        {hasSelection && (
          <SelectionActionBar
            recordLabel={CDS3_ROWS[selectedRow!].referencia}
            actions={[
              { label: "Auditoría" },
              { label: "Modificar" },
              { label: "Borrar", variant: "destructive" },
            ]}
          />
        )}

        {/* Header */}
        <div className="flex items-center border-b border-gray-300 bg-gray-50 px-4 shrink-0">
          <SortableHeaderCell
            label="Referencia"
            active={cds3SortIdx === 0}
            dir={cds3SortDir}
            onClick={() => cds3ToggleSort(0)}
            className="flex-1 py-2.5 text-caption"
          />
          <SortableHeaderCell
            label="Fase"
            active={cds3SortIdx === 1}
            dir={cds3SortDir}
            onClick={() => cds3ToggleSort(1)}
            className="w-20 py-2.5 text-caption justify-center"
          />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {!showData ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-[#B8C8DC]">
              <IcoInbox />
              <p className="text-[13.5px] font-medium text-[#6B7E9A] mt-1">
                No hay resultados para los filtros aplicados
              </p>
              <p className="text-body-sm text-gray-500">
                Completá los filtros y presioná{" "}
                <span className="font-semibold text-primary">Buscar</span>
              </p>
            </div>
          ) : cds3VisibleIndices.map((i) => {
            const row = CDS3_ROWS[i];
            const isSelected = selectedRow === i;
            const isHovered = hoveredRow === i;
            return (
              <div
                key={i}
                onClick={() => setSelectedRow(isSelected ? null : i)}
                onMouseEnter={() => setHoveredRow(i)}
                onMouseLeave={() => setHoveredRow(null)}
                className="flex items-center px-4 border-b border-gray-100 cursor-pointer transition-colors duration-100"
                style={{
                  backgroundColor: isSelected ? "var(--color-primary-tint)" : isHovered ? "#F5F8FD" : "#fff",
                  borderLeft: isSelected ? "3px solid var(--color-primary)" : "3px solid transparent",
                }}
              >
                <div
                  className="flex-1 py-2.5 text-[12.5px] tabular-nums"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: isSelected ? "var(--color-secondary)" : "#1F2D40",
                    fontWeight: isSelected ? 600 : 400,
                  }}
                >
                  {row.referencia}
                </div>
                <div className={`w-20 py-2.5 text-[12.5px] text-center ${isSelected ? "text-secondary font-medium" : "text-gray-700"}`}>
                  {row.fase}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        {showData && (
          <div className="px-4 py-2 border-t border-gray-300 bg-gray-50 shrink-0 flex items-center justify-between">
            <span className="text-[11.5px] text-gray-700">
              Registros encontrados:{" "}
              <span className="font-semibold text-secondary">
                {CDS3_TOTAL.toLocaleString("es-AR")}
              </span>
            </span>
            <div className="flex items-center gap-2 text-[11.5px] text-gray-600">
              <button className="px-2.5 py-1 rounded border border-[#D0DAE8] bg-white hover:bg-[#F4F7FC] disabled:opacity-40 transition-colors" disabled>
                Anterior
              </button>
              <span>
                Pág. <span className="font-medium text-gray-800">1</span> de{" "}
                <span className="font-medium text-gray-800">101</span>
              </span>
              <button className="px-2.5 py-1 rounded border border-[#D0DAE8] bg-white hover:bg-[#F4F7FC] transition-colors">
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CDS4 screen ─────────────────────────────────────────────────────────────

function CDS4Content() {
  const [showData, setShowData] = useState(false);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const hasSelection = selectedRow !== null;
  const cds4Columns = ["Referencia", "Fase", "Fecha"];
  const cds4GetCells = (row: (typeof CDS4_ROWS)[number]) => [row.referencia, row.fase, row.fecha];
  const { search: cds4Search, setSearch: setCds4Search, sortIdx: cds4SortIdx, sortDir: cds4SortDir, toggleSort: cds4ToggleSort, visibleIndices: cds4VisibleIndices } =
    useTableToolbar(CDS4_ROWS, cds4GetCells);

  return (
    <div className="flex-1 flex overflow-hidden p-5 gap-5">

      {/* ── Left column: form ── */}
      <div
        className="flex flex-col rounded-sm border border-[#D8E4F0] bg-white shrink-0 overflow-hidden"
        style={{ width: "41%", boxShadow: "var(--shadow-low)" }}
      >
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">

          {/* IDENTIFICACIÓN */}
          <div>
            <SectionDivider title="Identificación" />
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Código de interrupción</FieldLabel>
                  <input className={inputCls} placeholder="Ej: BPR202607059383" />
                </div>
                <div>
                  <FieldLabel>Fase de reposición</FieldLabel>
                  <input className={inputCls} placeholder="1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Fecha</FieldLabel>
                  <input className={inputCls} placeholder="dd/mm/aaaa hh:mm" />
                </div>
                <div>
                  <FieldLabel>Fase eléctrica</FieldLabel>
                  <input className={inputCls} placeholder="RST" />
                </div>
              </div>
            </div>
          </div>

          {/* DATOS DE RED */}
          <div>
            <SectionDivider title="Datos de red" />
            <div className="flex flex-col gap-3">
              <div>
                <FieldLabel>Código del equipo maniobrado</FieldLabel>
                <input className={inputCls} placeholder="@47309278" />
              </div>
              <div>
                <FieldLabel>Descripción del equipo maniobrado</FieldLabel>
                <input className={inputCls} placeholder="PROTECCION DE TOMA/ACOMETIDA" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Cadena eléctrica aguas arriba</FieldLabel>
                  <input className={inputCls} placeholder="NCBT" />
                </div>
                <div>
                  <FieldLabel>Alimentador MT</FieldLabel>
                  <input className={inputCls} placeholder="NCBT" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Cantidad de clientes BT repuestos</FieldLabel>
                  <input className={inputCls} placeholder="1" />
                </div>
                <div>
                  <FieldLabel>CT MT/BT maniobrado</FieldLabel>
                  <input className={inputCls} placeholder="NCBT" />
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="shrink-0 border-t border-gray-200 px-5 py-4 flex gap-3">
          <button
            onClick={() => { setShowData(false); setSelectedRow(null); }}
            disabled={!showData}
            className="flex-1 h-9 rounded-md text-body font-medium border-2 border-primary bg-white hover:bg-primary-tint transition-colors duration-150 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
            style={{ color: "var(--color-secondary)" }}
          >Limpiar</button>
          <button
            onClick={() => { setShowData(true); setSelectedRow(null); }}
            disabled={showData}
            className="flex-1 h-9 rounded-md text-body font-semibold text-white transition-all duration-150 active:scale-[0.99] hover:brightness-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
            style={{ backgroundColor: "var(--color-primary)" }}
          >Buscar</button>
        </div>
      </div>

      {/* ── Right column ── */}
      <div
        className="flex-1 flex flex-col border border-gray-300 rounded-sm bg-white overflow-hidden"
        style={{ boxShadow: "var(--shadow-low)" }}
      >
        {/* Table toolbar — buscador / exportar */}
        {showData && (
          <TableToolbar
            search={cds4Search}
            onSearchChange={setCds4Search}
            onExport={() =>
              exportRowsToCsv("reposiciones", cds4Columns, cds4VisibleIndices.map((i) => cds4GetCells(CDS4_ROWS[i])))
            }
          />
        )}

        {/* Contextual action bar */}
        {hasSelection && (
          <SelectionActionBar
            recordLabel={CDS4_ROWS[selectedRow!].referencia}
            actions={[
              { label: "Auditoría" },
              { label: "Modificar" },
              { label: "Borrar", variant: "destructive" },
            ]}
          />
        )}

        {/* Header */}
        <div className="flex items-center border-b border-gray-300 bg-gray-50 px-4 shrink-0">
          <SortableHeaderCell
            label="Referencia"
            active={cds4SortIdx === 0}
            dir={cds4SortDir}
            onClick={() => cds4ToggleSort(0)}
            className="flex-1 py-2.5 text-caption"
          />
          <SortableHeaderCell
            label="Fase"
            active={cds4SortIdx === 1}
            dir={cds4SortDir}
            onClick={() => cds4ToggleSort(1)}
            className="w-16 py-2.5 text-caption justify-center"
          />
          <SortableHeaderCell
            label="Fecha"
            active={cds4SortIdx === 2}
            dir={cds4SortDir}
            onClick={() => cds4ToggleSort(2)}
            className="w-40 py-2.5 text-caption"
          />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {!showData ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-[#B8C8DC]">
              <IcoInbox />
              <p className="text-[13.5px] font-medium text-[#6B7E9A] mt-1">
                No hay resultados para los filtros aplicados
              </p>
              <p className="text-body-sm text-gray-500">
                Completá los filtros y presioná{" "}
                <span className="font-semibold text-primary">Buscar</span>
              </p>
            </div>
          ) : cds4VisibleIndices.map((i) => {
            const row = CDS4_ROWS[i];
            const isSelected = selectedRow === i;
            const isHovered = hoveredRow === i;
            return (
              <div
                key={i}
                onClick={() => setSelectedRow(isSelected ? null : i)}
                onMouseEnter={() => setHoveredRow(i)}
                onMouseLeave={() => setHoveredRow(null)}
                className="flex items-center px-4 border-b border-gray-100 cursor-pointer transition-colors duration-100"
                style={{
                  backgroundColor: isSelected ? "var(--color-primary-tint)" : isHovered ? "#F5F8FD" : "#fff",
                  borderLeft: isSelected ? "3px solid var(--color-primary)" : "3px solid transparent",
                }}
              >
                <div
                  className="flex-1 py-2.5 text-[12.5px] tabular-nums"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: isSelected ? "var(--color-secondary)" : "#1F2D40",
                    fontWeight: isSelected ? 600 : 400,
                  }}
                >
                  {row.referencia}
                </div>
                <div className={`w-16 py-2.5 text-[12.5px] text-center ${isSelected ? "text-secondary font-medium" : "text-gray-700"}`}>
                  {row.fase}
                </div>
                <div className={`w-40 py-2.5 text-[12.5px] ${isSelected ? "text-secondary font-medium" : "text-gray-700"}`}>
                  {row.fecha}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        {showData && (
          <div className="px-4 py-2 border-t border-gray-300 bg-gray-50 shrink-0 flex items-center justify-between">
            <span className="text-[11.5px] text-gray-700">
              Registros encontrados:{" "}
              <span className="font-semibold text-secondary">
                {CDS4_TOTAL.toLocaleString("es-AR")}
              </span>
            </span>
            <div className="flex items-center gap-2 text-[11.5px] text-gray-600">
              <button className="px-2.5 py-1 rounded border border-[#D0DAE8] bg-white hover:bg-[#F4F7FC] disabled:opacity-40 transition-colors" disabled>
                Anterior
              </button>
              <span>
                Pág. <span className="font-medium text-gray-800">1</span> de{" "}
                <span className="font-medium text-gray-800">1</span>
              </span>
              <button className="px-2.5 py-1 rounded border border-[#D0DAE8] bg-white hover:bg-[#F4F7FC] disabled:opacity-40 transition-colors" disabled>
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// screens: login → select → welcome → cds2 → cds3 → cds4 → modificar
type Screen = "login" | "select" | "welcome" | "cds2" | "cds3" | "cds4" | "modificar";

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [collapsed, setCollapsed] = useState(false);
  const [showData, setShowData] = useState(false);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [nivelTension, setNivelTension] = useState<string | null>(null);
  if (screen === "login") return <LoginScreen onLogin={() => setScreen("select")} />;
  if (screen === "select") return <SelectScreen onSelect={(v) => setScreen(v === "nuevo" ? "welcome" : "select")} />;

  function handleLimpiar() {
    setShowData(false);
    setSelectedRow(null);
  }

  return (
    <div style={{
      width: "100%", height: "100vh", display: "flex",
      fontFamily: "'Inter', system-ui, sans-serif",
      backgroundColor: "#EEF2F8",
      overflow: "hidden",
    }}>

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside style={{
        width: collapsed ? 60 : 256,
        transition: "width 220ms cubic-bezier(0.4,0,0.2,1)",
        backgroundColor: "#F7F9FC",
        display: "flex", flexDirection: "column",
        flexShrink: 0, overflow: "hidden",
        borderRight: "1px solid var(--color-gray-300)",
      }}>
        {/* Logo + collapse */}
        <div className="flex items-center gap-2 px-3 border-b border-gray-300" style={{ minHeight: 60, paddingTop: 10, paddingBottom: 10 }}>
          {!collapsed ? (
            <>
              <div
                className="flex-1 flex items-center overflow-hidden"
                style={{ height: 38 }}
              >
                <div style={{ zoom: 0.68, transformOrigin: "left center", pointerEvents: "none" }}>
                  <Logo />
                </div>
              </div>
              <button
                onClick={() => setCollapsed(true)}
                className="shrink-0 w-7 h-7 flex items-center justify-center rounded text-[#7A95B8] hover:text-gray-800 hover:bg-[#E4EBF7] transition-colors"
                title="Colapsar"
              >
                <ChevronLeft />
              </button>
            </>
          ) : (
            /* Collapsed: small E monogram matching brand blue */
            <button
              onClick={() => setCollapsed(false)}
              className="mx-auto w-8 h-8 flex items-center justify-center rounded transition-colors hover:bg-[#E4EBF7]"
              title="Expandir"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-body text-white"
                style={{ background: "linear-gradient(135deg,#1565C0,#1E3A8A)" }}
              >E</div>
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2" style={{ scrollbarWidth: "none" }}>
          {/* ABM group label */}
          {!collapsed
            ? <p className="px-1 pt-4 pb-1.5 text-micro font-semibold uppercase tracking-[0.1em] text-gray-500 select-none">ABM</p>
            : <div className="h-4" />
          }

          <div className="flex flex-col gap-0.5">
            {ABM_ITEMS.map((item, i) => (
              <NavItem
                key={item.key ?? item.code + i}
                label={item.label}
                code={item.code}
                icon={item.icon}
                active={item.screen !== undefined && item.screen === screen}
                collapsed={collapsed}
                onClick={item.screen ? () => setScreen(item.screen!) : undefined}
              />
            ))}
          </div>

          {/* Modificar interrupción — separated */}
          <div className={`my-2 border-t border-gray-300 ${collapsed ? "mx-auto w-8" : "mx-1"}`} />
          <NavItem
            label="Modificar interrupción"
            icon={<IcoEdit />}
            active={screen === "modificar"}
            collapsed={collapsed}
            onClick={() => setScreen("modificar")}
          />

          {/* Otros group */}
          {!collapsed
            ? <p className="px-1 pt-5 pb-1.5 text-micro font-semibold uppercase tracking-[0.1em] text-gray-500 select-none">Otros</p>
            : <div className="my-3 border-t border-gray-300 mx-auto w-8" />
          }
          <div className="flex flex-col gap-0.5">
            {OTROS_ITEMS.map((item) => (
              <NavItem
                key={item.label}
                label={item.label}
                icon={item.icon}
                active={false}
                collapsed={collapsed}
              />
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-300 px-2 py-2.5">
          <UserMenu collapsed={collapsed} onLogout={() => setScreen("login")} />
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header
          className="flex items-center px-6 border-b border-[#D5DEEE] shrink-0"
          style={{ minHeight: 52, backgroundColor: "#FFFFFF", boxShadow: "0 1px 0 #D5DEEE" }}
        >
          <div className="flex items-center gap-2.5 flex-1">
            {screen === "cds2" && (
              <>
                <h1 className="text-label font-semibold text-gray-900 leading-none">Interrupciones</h1>
                <span className="px-1.5 py-0.5 text-micro font-mono font-medium rounded-[3px] border border-[#BDD4EF] text-[#1565C0]"
                  style={{ backgroundColor: "#EBF2FC", fontFamily: "'JetBrains Mono', monospace" }}>CDS2</span>
              </>
            )}
            {screen === "cds3" && (
              <>
                <h1 className="text-label font-semibold text-gray-900 leading-none">Interrupciones no computables</h1>
                <span className="px-1.5 py-0.5 text-micro font-mono font-medium rounded-[3px] border border-[#BDD4EF] text-[#1565C0]"
                  style={{ backgroundColor: "#EBF2FC", fontFamily: "'JetBrains Mono', monospace" }}>CDS3</span>
              </>
            )}
            {screen === "cds4" && (
              <>
                <h1 className="text-label font-semibold text-gray-900 leading-none">Reposiciones</h1>
                <span className="px-1.5 py-0.5 text-micro font-mono font-medium rounded-[3px] border border-[#BDD4EF] text-[#1565C0]"
                  style={{ backgroundColor: "#EBF2FC", fontFamily: "'JetBrains Mono', monospace" }}>CDS4</span>
              </>
            )}
            {screen === "modificar" && (
              <h1 className="text-label font-semibold text-gray-900 leading-none">Modificar interrupción</h1>
            )}
            {screen === "welcome" && (
              <h1 className="text-label font-semibold text-gray-900 leading-none">Inicio</h1>
            )}
          </div>
          <PeriodSelector />
        </header>

        {/* Content */}
        {screen === "welcome" && <WelcomeContent />}
        {screen === "cds3" && <CDS3Content />}
        {screen === "cds4" && <CDS4Content />}
        {screen === "modificar" && <ModificarContent />}

        {/* Two-column content — only CDS2 */}
        {screen === "cds2" && <div className="flex-1 flex overflow-hidden p-5 gap-5">

          {/* ── Left column: form ── */}
          <div
            className="flex flex-col rounded-sm border border-[#D8E4F0] bg-white shrink-0 overflow-hidden"
            style={{ width: "41%", boxShadow: "var(--shadow-low)" }}
          >
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">

              {/* IDENTIFICACIÓN */}
              <div>
                <SectionDivider title="Identificación" />
                <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                  <div>
                    <FieldLabel>Código de interrupción</FieldLabel>
                    <input className={inputCls} placeholder="Ej: BFZ202607056849" />
                  </div>
                  <div>
                    <FieldLabel>Fecha</FieldLabel>
                    <input type="date" className={inputCls} />
                  </div>
                  <div className="col-span-2">
                    <FieldLabel>Nivel de tensión</FieldLabel>
                    <div className="flex gap-2 mt-0.5">
                      {["BT", "MT", "AT"].map((nivel) => {
                        const active = nivelTension === nivel;
                        return (
                          <button
                            key={nivel}
                            type="button"
                            onClick={() => setNivelTension(active ? null : nivel)}
                            className={`flex-1 flex items-center justify-center h-8 rounded-sm border cursor-pointer select-none text-[12.5px] font-medium transition-all duration-150 ${
                              active
                                ? "border-primary bg-primary-tint text-secondary"
                                : "border-gray-400 bg-white text-[#4A6080] hover:border-[#97B0CF] hover:bg-[#F5F8FD]"
                            }`}
                          >
                            {nivel}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* CLASIFICACIÓN */}
              <div>
                <SectionDivider title="Clasificación" />
                <div className="flex flex-col gap-3">
                  {/* Origen / Tipo — 2 cols */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <FieldLabel>Origen</FieldLabel>
                      <SelectWrap>
                        <select className={selectCls}>
                          <option value="">Seleccione</option>
                          <option value="I">Interno</option>
                          <option value="E">Externo</option>
                        </select>
                      </SelectWrap>
                    </div>
                    <div>
                      <FieldLabel>Tipo</FieldLabel>
                      <SelectWrap>
                        <select className={selectCls}>
                          <option value="">Seleccione</option>
                          <option value="F">Forzado</option>
                          <option value="P">Programado</option>
                        </select>
                      </SelectWrap>
                    </div>
                  </div>
                  {/* Fase eléctrica */}
                  <div className="w-1/2">
                    <FieldLabel>Fase eléctrica</FieldLabel>
                    <SelectWrap>
                      <select className={selectCls}>
                        <option value="">Seleccione</option>
                        <option value="M">M — Monofásica</option>
                        <option value="B">B — Bifásica</option>
                        <option value="T">T — Trifásica</option>
                      </select>
                    </SelectWrap>
                  </div>
                </div>
              </div>

              {/* DATOS DE RED */}
              <div>
                <SectionDivider title="Datos de red" />
                <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                  <div>
                    <FieldLabel>Código de equipo operado</FieldLabel>
                    <input className={inputCls} />
                  </div>
                  <div>
                    <FieldLabel>Descripción equipo operado</FieldLabel>
                    <input className={inputCls} />
                  </div>
                  <div>
                    <FieldLabel>División red normal?</FieldLabel>
                    <SelectWrap>
                      <select className={selectCls}>
                        <option value="">Seleccione</option>
                        <option>Sí</option>
                        <option>No</option>
                      </select>
                    </SelectWrap>
                  </div>
                  <div>
                    <FieldLabel>Cadena eléctrica aguas arriba</FieldLabel>
                    <input className={inputCls} />
                  </div>
                  <div>
                    <FieldLabel>Alimentador MT</FieldLabel>
                    <input className={inputCls} />
                  </div>
                  <div>
                    <FieldLabel>CT MT/BT del equipo operado</FieldLabel>
                    <input className={inputCls} />
                  </div>
                </div>
              </div>

            </div>

            {/* Form footer — Limpiar / Buscar */}
            <div className="shrink-0 border-t border-gray-200 px-5 py-4 flex gap-3">
              <button
                onClick={handleLimpiar}
                disabled={!showData}
                className="flex-1 h-9 rounded-md text-body font-medium border-2 border-primary bg-white transition-colors duration-150 active:scale-[0.99] hover:bg-primary-tint disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
                style={{ color: "var(--color-secondary)" }}
              >Limpiar</button>
              <button
                onClick={() => { setShowData(true); setSelectedRow(null); }}
                disabled={showData}
                className="flex-1 h-9 rounded-md text-body font-semibold text-white transition-all duration-150 active:scale-[0.99] hover:brightness-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
                style={{ backgroundColor: "var(--color-primary)" }}
              >Buscar</button>
            </div>
          </div>

          {/* ── Right column: results ── */}
          <ResultsTable
            hasData={showData}
            selectedRow={selectedRow}
            onSelect={setSelectedRow}
            selectionActions={[
              { label: "Auditoría" },
              { label: "Modificar" },
              { label: "Borrar", variant: "destructive" },
            ]}
          />
        </div>}
      </div>
    </div>
  );
}
