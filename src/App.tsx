import { useState, useRef, useEffect, useMemo, useId } from "react";
import { createPortal } from "react-dom";
import {
  ChevronLeft, ChevronRight, ChevronDown, FileText, Pencil, Clipboard, UserPlus, Shield, Search,
  X, Filter, Inbox, Plus, Download, ChevronsUp, ChevronsDown, Home, Clock, Users, ClipboardList,
  Wrench,
} from "lucide-react";
import Logo from "@/imports/Logo/index";
import { NavItem } from "@/components/layout/NavItem";
import { UserMenu } from "@/components/layout/UserMenu";
import {
  actionBtnCls,
  ActionItem,
  BTN_MD,
  BTN_SEG_MD,
  BTN_SM,
  ButtonSelectGroup,
  CampoEstado,
  CardHeader,
  CodeBadge,
  CopyButton,
  DateTimeField,
  dropdownAnchorStyle,
  ESTADO_CLASES,
  FaseIndicador,
  FIELD_FOCUS,
  FieldLabel,
  FilterTrigger,
  FOCUS_RING,
  FOCUS_RING_INSET,
  ICON,
  ICON_BTN_SM,
  ICON_BTN_XS,
  ListBox,
  MOD_FIELD_CLS,
  MOD_SELECT_CLS,
  Modal,
  ModalCheckbox,
  modalDestructiveBtnCls,
  modalNeutralBtnCls,
  modalPrimaryBtnCls,
  ModalRadio,
  parseDateTimeStr,
  PeriodSelector,
  RangoFecha,
  ReadOnlyField,
  rowActionBtnCls,
  SectionDivider,
  SelectionActionBar,
  SelectWrap,
  SortableHeaderCell,
  SortableTh,
  TableCounter,
  TableToolbar,
  UnderlineTabs,
  useDropdownDirection,
  useTableToolbar,
  ValuePicker,
} from "@/components/ui";
import { ABM_TABLE_CONFIGS, ABM_TABLE_ORDER, isAbmTableKey } from "@/data/abmTables";
import {
  ABM_ITEMS,
  DRAWER_TAB_TO_ABM,
  DRAWER_TABS,
  NOTA_OPCIONES,
  PERIODS,
  STATUS_ITEMS,
} from "@/data/dominio";
import {
  ALTA_CLIENTES_ROWS,
  CAMBIA_FASES_ROWS_INIT,
  NOTAS_INICIALES,
  USUARIOS_SISENRE_DEMO,
} from "@/data/mocks";
import { crearRng, hashSemilla } from "@/data/rng";
import {
  generarConsolidacionSintetica,
  generarFasesSinteticas,
  generarFilasTabla5,
  generarFilasTabla6,
  generarFilasTabla8,
  generarFilasTabla9,
  generarReclamosSinteticos,
  generarTablasRelacionadas,
  RECORD,
  SAMPLE_ROWS,
} from "@/data/sinteticos";
import {
  AbmDeepLink,
  AbmMode,
  AbmTableKey,
  CampoBusqueda,
  CampoTipo,
  FaseReposicion,
  ReclamosInterrupcion,
  Screen,
} from "@/data/types";
import { LotesModal } from "@/features/herramientas/LotesModal";
import { WelcomeContent } from "@/features/inicio/WelcomeContent";
import { LoginScreen } from "@/features/login/LoginScreen";
import { SelectScreen } from "@/features/login/SelectScreen";
import {
  fmtDelta,
  fmtDuracion,
  fmtHoraCorta,
  formatFecha,
  formatFechaHora,
  formatHora,
  formatNumero,
  partesDuracion,
  VALOR_VACIO,
} from "@/lib/format";
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

// "dd/mm/aaaa hh:mm" → Date, sobre parseDateTimeStr (null si no parsea).
function fechaHoraDeStr(v: string): Date | null {
  const { date, time } = parseDateTimeStr(v);
  if (!date) return null;
  const [hh, mm] = time.split(":").map(Number);
  const d = new Date(date);
  d.setHours(hh || 0, mm || 0, 0, 0);
  return d;
}

// Rango inclusivo; se permite un solo extremo. Sin rango, todo pasa.
function fechaEnRango(d: Date | null, r: RangoFecha | null): boolean {
  if (!r) return true;
  if (!d) return false;
  if (r.desde && d < r.desde) return false;
  if (r.hasta && d > r.hasta) return false;
  return true;
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
          <button type="button" onClick={onClose} className={modalNeutralBtnCls}>
            Salir
          </button>
          <button type="button" onClick={onClose} className={modalPrimaryBtnCls}>
            Procesar
          </button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <ListBox title="Interrupción/Reclamo">
          <div
            className="px-2 py-1.5 text-code tabular-nums text-text font-mono"
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
            <span className="text-body text-text">Mts.</span>
          </div>
          <div className="flex items-center gap-5">
            <ModalCheckbox label="Desarmo" defaultChecked />
            <ModalCheckbox label="Instalación cliente" defaultChecked />
          </div>
          <div role="radiogroup" aria-label="Desarme por" className="flex items-center gap-5">
            <ModalRadio
              name="desarme-por"
              label="Por interrupción"
              checked={desarmePor === "interrupcion"}
              onSelect={() => setDesarmePor("interrupcion")}
            />
            <ModalRadio
              name="desarme-por"
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
            <span className="text-body-sm text-text-muted truncate">{fileName}</span>
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
          <button type="button" onClick={onClose} className={modalNeutralBtnCls}>
            Salir
          </button>
          <button type="button" onClick={onClose} className={modalPrimaryBtnCls}>
            Generar
          </button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Nivel tensión</FieldLabel>
          <ValuePicker opts={["BT", "MT", "AT"]} defaultValue="BT" />
        </div>
        <div>
          <FieldLabel>Tipo</FieldLabel>
          <ValuePicker opts={NIVEL_TIPO_TIPOS} defaultValue={NIVEL_TIPO_TIPOS[0]} />
        </div>
        <div>
          <FieldLabel>Nueva interrupción</FieldLabel>
          <div className="w-full h-(--control-md) px-2.5 flex items-center text-body bg-fill-muted border border-border rounded-sm text-text-faint select-none cursor-not-allowed">
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
          <button type="button" onClick={onClose} className={modalNeutralBtnCls}>
            Salir
          </button>
          <button type="button" onClick={onClose} className={modalPrimaryBtnCls}>
            Generar
          </button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Período destino</FieldLabel>
          <ValuePicker opts={PERIODS} placeholder="Período" />
        </div>
        <div>
          <FieldLabel>Nueva interrupción</FieldLabel>
          <div className="w-full h-(--control-md) px-2.5 flex items-center text-body bg-fill-muted border border-border rounded-sm text-text-faint select-none cursor-not-allowed">
            —
          </div>
        </div>
      </div>
    </Modal>
  );
}

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
        <button type="button" onClick={onClose} className={modalNeutralBtnCls}>
          Salir
        </button>
      }
    >
      <div className="border border-border rounded-md overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-fill-subtle border-b border-border">
              {["Fase", "Fecha", "Id elemento", "Tipo elemento", "Cadena", "Cliente"].map((c) => (
                <th key={c} className="px-4 py-3 text-left text-heading-xs uppercase text-text-muted select-none whitespace-nowrap">
                  {c}
                </th>
              ))}
              <th className="px-3 py-3 w-16" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.idElemento} className="border-b border-border-subtle hover:bg-fill-muted transition-colors">
                <td className="px-4 py-3 text-body text-text tabular-nums">{r.fase}</td>
                <td className="px-4 py-3 text-body text-text whitespace-nowrap">{r.fecha}</td>
                <td className="px-4 py-3 text-code text-text whitespace-nowrap font-mono">
                  {r.idElemento}
                </td>
                <td className="px-4 py-3 text-body text-text whitespace-nowrap">{r.tipoElemento}</td>
                <td className="px-4 py-3 text-code text-text whitespace-nowrap font-mono">
                  {r.cadena}
                </td>
                <td className="px-4 py-3 text-body text-text tabular-nums">{r.cliente}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      className={`${ICON_BTN_XS} flex items-center justify-center rounded-sm text-icon hover:bg-primary-tint hover:text-secondary disabled:opacity-30 disabled:pointer-events-none transition-colors`}
                    >
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                        <path d="M5.5 8.5V2.5M5.5 2.5L2.5 5.5M5.5 2.5l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      disabled={i === rows.length - 1}
                      className={`${ICON_BTN_XS} flex items-center justify-center rounded-sm text-icon hover:bg-primary-tint hover:text-secondary disabled:opacity-30 disabled:pointer-events-none transition-colors`}
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
          <button type="button" onClick={onClose} className={modalNeutralBtnCls}>
            Salir
          </button>
          <button type="button" onClick={onClose} className={modalPrimaryBtnCls}>
            Procesar
          </button>
        </>
      }
    >
      <div className="flex items-center justify-end gap-2 mb-3">
        <span className="text-body-sm text-text-muted">Filtro</span>
        <button
          type="button"
          onClick={() => setFiltroActivo((v) => !v)}
          className={`${BTN_SM} border transition-colors ${
            filtroActivo ? "bg-primary-tint border-primary text-secondary" : "bg-surface border-border-strong text-text hover:border-primary hover:bg-primary-tint hover:text-secondary"
          }`}
        >
          {filtroActivo ? "Activo" : "Inactivo"}
        </button>
      </div>

      <div className="border border-border rounded-md overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-fill-subtle border-b border-border">
              {["Interrupción", "Repo", "Cadena/Cuenta", "Clientes T4", "Clientes T6", "Clientes T9", "Clientes T10"].map((c) => (
                <th key={c} className="px-4 py-3 text-left text-heading-xs uppercase text-text-muted select-none whitespace-nowrap">
                  {c}
                </th>
              ))}
              <th className="px-3 py-3 w-10" />
            </tr>
          </thead>
          <tbody>
            {ALTA_CLIENTES_ROWS.map((r) => (
              <tr key={r.interrupcion} className="border-b border-border-subtle hover:bg-fill-muted transition-colors">
                <td className="px-4 py-3 text-code text-text tabular-nums font-mono">
                  {r.interrupcion}
                </td>
                <td className="px-4 py-3 text-body text-text tabular-nums">{r.repo}</td>
                <td className="px-4 py-3 text-code text-text whitespace-nowrap font-mono">
                  {r.cadenaCuenta}
                </td>
                <td className="px-4 py-3 text-body text-text tabular-nums">{r.t4}</td>
                <td className="px-4 py-3 text-body text-text tabular-nums">{r.t6}</td>
                <td className="px-4 py-3 text-body text-text tabular-nums">{r.t9}</td>
                <td className="px-4 py-3 text-body text-text tabular-nums">{r.t10}</td>
                <td className="px-3 py-3">
                  <ModalCheckbox label="" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="inline-flex rounded-sm border border-border-strong overflow-hidden">
          <button
            type="button"
            onClick={() => setPeriodicidad("mensual")}
            className={`h-(--control-sm) px-2.5 text-label transition-colors ${
              periodicidad === "mensual" ? "bg-primary-tint text-secondary ring-1 ring-inset ring-primary" : "bg-surface text-text hover:bg-fill-muted"
            }`}
          >
            Mensual
          </button>
          <button
            type="button"
            onClick={() => setPeriodicidad("semestral")}
            className={`h-(--control-sm) px-2.5 text-label border-l border-border-strong transition-colors ${
              periodicidad === "semestral" ? "bg-primary-tint text-secondary ring-1 ring-inset ring-primary" : "bg-surface text-text hover:bg-fill-muted"
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
        <button type="button" onClick={onClose} className={modalPrimaryBtnCls}>
          Salir
        </button>
      }
    >
      <div className="flex gap-5">
        {/* Sidebar izquierda */}
        <div className="flex flex-col gap-4 shrink-0" style={{ width: 190 }}>
          <div className="border border-border rounded-md divide-y divide-border-subtle overflow-hidden">
            <div className="flex items-center justify-between gap-2 px-3 py-2">
              <span
                className="text-code tabular-nums text-text truncate font-mono"
              >
                {referencia}
              </span>
              <ModalCheckbox label="" defaultChecked />
            </div>
            <div className="flex items-center justify-between gap-2 px-3 py-2">
              <span className="text-body-sm text-text">Reposición 1</span>
              <ModalCheckbox label="" defaultChecked />
            </div>
          </div>

          <div>
            <FieldLabel>Selección</FieldLabel>
            <div role="radiogroup" aria-label="Selección" className="flex flex-col gap-2 mt-1">
              <ModalRadio name="intercambio-seleccion" label="Interrupción" checked={seleccion === "interrupcion"} onSelect={() => setSeleccion("interrupcion")} />
              <ModalRadio name="intercambio-seleccion" label="Reclamos" checked={seleccion === "reclamos"} onSelect={() => setSeleccion("reclamos")} />
              <ModalRadio name="intercambio-seleccion" label="CTs" checked={seleccion === "cts"} onSelect={() => setSeleccion("cts")} />
              <ModalRadio name="intercambio-seleccion" label="Clientes" checked={seleccion === "clientes"} onSelect={() => setSeleccion("clientes")} />
            </div>
          </div>

          <div>
            <FieldLabel>Tarifas</FieldLabel>
            <div role="radiogroup" aria-label="Tarifas" className="flex flex-col gap-2 mt-1">
              <ModalRadio name="intercambio-tarifa" label="Todas" checked={tarifa === "todas"} onSelect={() => setTarifa("todas")} />
              <ModalRadio name="intercambio-tarifa" label="MT/AT" checked={tarifa === "mtat"} onSelect={() => setTarifa("mtat")} />
              <ModalRadio name="intercambio-tarifa" label="BT" checked={tarifa === "bt"} onSelect={() => setTarifa("bt")} />
            </div>
          </div>
        </div>

        {/* Tabla origen */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <div className="border border-border rounded-md overflow-y-auto" style={{ height: 240 }}>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-fill-subtle border-b border-border">
                  {["Fecha", "Clientes", "Repo"].map((c) => (
                    <th key={c} className="px-3 py-2 text-left text-heading-xs uppercase text-text-muted whitespace-nowrap">
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
                <tr className="border-b border-border">
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
                        <span className="text-text-faint"><Inbox size={ICON.xl} strokeWidth={1.25} /></span>
                        <p className="text-heading-sm text-text-muted">No hay registros</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  leftRows.map((r, i) => (
                    <tr key={r.id} className="border-b border-border-subtle hover:bg-fill-muted transition-colors">
                      <td className="px-3 py-2 text-body text-text whitespace-nowrap">{r.fecha}</td>
                      <td className="px-3 py-2 text-body text-text tabular-nums">{r.clientes}</td>
                      <td className="px-3 py-2 text-body text-text tabular-nums">{r.repo}</td>
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
          <div className="flex items-center justify-between text-body-sm text-text-muted">
            <button className={`${BTN_SM} border border-border-strong bg-surface disabled:opacity-40`} disabled>Anterior</button>
            <span>Página <span className="font-medium text-text">1</span> de <span className="font-medium text-text">1</span></span>
            <button className={`${BTN_SM} border border-border-strong bg-surface disabled:opacity-40`} disabled>Siguiente</button>
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
          <button type="button" onClick={swap} className={modalNeutralBtnCls}>
            {"<< - >>"}
          </button>
        </div>

        {/* Tabla destino */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <div className="border border-border rounded-md overflow-y-auto" style={{ height: 240 }}>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-fill-subtle border-b border-border">
                  {["Fecha", "Clientes", "Repo"].map((c) => (
                    <th key={c} className="px-3 py-2 text-left text-heading-xs uppercase text-text-muted whitespace-nowrap">
                      {c}
                    </th>
                  ))}
                </tr>
                <tr className="border-b border-border">
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
                        <span className="text-text-faint"><Inbox size={ICON.xl} strokeWidth={1.25} /></span>
                        <p className="text-heading-sm text-text-muted">No hay registros</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  rightRows.map((r) => (
                    <tr key={r.id} className="border-b border-border-subtle hover:bg-fill-muted transition-colors">
                      <td className="px-3 py-2 text-body text-text whitespace-nowrap">{r.fecha}</td>
                      <td className="px-3 py-2 text-body text-text tabular-nums">{r.clientes}</td>
                      <td className="px-3 py-2 text-body text-text tabular-nums">{r.repo}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between text-body-sm text-text-muted">
            <button className={`${BTN_SM} border border-border-strong bg-surface disabled:opacity-40`} disabled>Anterior</button>
            <span>Página <span className="font-medium text-text">1</span> de <span className="font-medium text-text">1</span></span>
            <button className={`${BTN_SM} border border-border-strong bg-surface disabled:opacity-40`} disabled>Siguiente</button>
          </div>
          <div className="relative">
            <input placeholder="Buscar destino" className={MOD_FIELD_CLS} style={{ paddingRight: 36 }} />
            <span className="absolute right-0 top-0 h-8 w-8 flex items-center justify-center text-icon">
              <Search size={ICON.md} strokeWidth={1.5} />
            </span>
          </div>
        </div>
      </div>
    </Modal>
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
  reclamos,
}: {
  open: boolean;
  onClose: () => void;
  referencia: string;
  fechaInicio: string;
  fechaUltRepo: string;
  // Misma data que el gráfico de reclamos de la Card B (null = sin selección).
  reclamos: ReclamosInterrupcion | null;
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
      title="Datos de la interrupción"
      subtitle={referencia}
      open={open}
      onClose={onClose}
      size="xl"
      footer={
        <>
          <button type="button" onClick={onClose} className={modalNeutralBtnCls}>
            Salir
          </button>
          <button type="button" onClick={onClose} className={modalPrimaryBtnCls}>
            Procesar
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        {/* Gráfico de reclamos — el mismo ReclamosTimeline de la Card B,
            ampliado, siempre visible arriba de la grilla de campos. */}
        {reclamos && <ReclamosTimeline datos={reclamos} />}
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
  { key: "cadenaElectrica", label: "Cadena eléctrica", placeholder: "NCBT" },
  { key: "alimentadorMT", label: "Alimentador MT", placeholder: "NCBT" },
  { key: "centroTransf", label: "Centro de transformación", placeholder: "52705#B1#52705-TR1#1#3" },
  { key: "codigoEquipo", label: "Código equipo", placeholder: "@27947890" },
  { key: "descEquipo", label: "Descripción equipo operado", placeholder: "PROTECCION DE SUMINISTRO" },
  { key: "divisionRed", label: "División red normal", placeholder: "S" },
];

// Subtítulo "etiqueta + valor" de las cards con secciones: etiqueta en
// heading-xs mayúscula y el valor en text-code font-mono (ej. "INTERRUPCIÓN
// SELECCIONADA BFZ…", "REPOSICIÓN 1 de 5 · 22/07/2026 14:50"). Hereda el
// text-muted del subtítulo de CardHeader.
function SubtituloEtiquetado({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  return (
    <>
      <span className="text-heading-xs uppercase mr-1.5">{etiqueta}</span>
      <span className="text-code font-mono tabular-nums">{children}</span>
    </>
  );
}

// Alto fijo de fila de ReposicionesLista, en px — una sola línea (text-body
// 20px) con aire; fuera de la escala --spacing, así las filas quedan parejas
// entre tiers (la tipografía no cambia entre tiers).
const REPOSICIONES_ROW_H = 44;

// Lista de Reposiciones (Tabla 4/CDS4) de la Card B "Reposiciones" (Modificar
// interrupción) — única instancia. Lista de filas, no tabla (ver
// DESIGN_SYSTEM.md, "Lista de filas"): cada reposición tiene pocos campos y
// un identificador principal, así que va en UNA línea sin thead:
//   izquierda (min-w-0 flex-1, trunca) → "Reposición {nro}" + código de
//     equipo (font-mono) + descripción del equipo, todo muted salvo el nro.
//   derecha (shrink-0, gap fijo)       → FaseIndicador · hora · "{n} usuarios BT".
// modSelectedFase sigue siendo la única fuente de verdad, compartida con el
// modal "Tablas relacionadas" — acá solo viven hover y ref. Alto flexible:
// el contenedor y el área scrolleable son min-h-0, así que la lista llena el
// alto que le deja su padre (mismo mecanismo que la lista de Interrupciones)
// y scrollea sola. Semántica: role="listbox" (aria-label "Reposiciones") con
// filas role="option"/aria-selected; navegación por teclado (flechas
// arriba/abajo) interna.
// El acento de fila seleccionada usa una sombra inset
// (inset-shadow-row-selected): no ocupa espacio en el layout, el texto queda
// en la misma posición seleccionado o no.
function ReposicionesLista({
  rows,
  selectedIndex,
  onSelect,
}: {
  rows: FaseReposicion[];
  selectedIndex: number | null;
  onSelect: (index: number | null) => void;
}) {
  const [hovIndex, setHovIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedIndex === null || !listRef.current) return;
    listRef.current
      .querySelector<HTMLElement>(`[data-fase-index="${selectedIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (rows.length === 0) return;
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    if (selectedIndex === null) {
      onSelect(e.key === "ArrowDown" ? 0 : rows.length - 1);
      return;
    }
    const next = e.key === "ArrowDown" ? selectedIndex + 1 : selectedIndex - 1;
    onSelect(Math.min(Math.max(next, 0), rows.length - 1));
  }

  return (
    <div className="min-h-0 flex flex-col">
      <div
        ref={listRef}
        role="listbox"
        aria-label="Reposiciones"
        tabIndex={rows.length > 0 ? 0 : -1}
        onKeyDown={handleKeyDown}
        className={`min-h-0 overflow-y-auto overflow-x-hidden ${FOCUS_RING_INSET}`}
      >
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
            <span className="text-text-faint"><Inbox size={ICON.xl} strokeWidth={1.25} /></span>
            <p className="text-body-sm text-text-muted">Sin reposiciones registradas</p>
          </div>
        ) : (
          rows.map((fila, ri) => {
            const seleccionada = selectedIndex === ri;
            const esUltima = ri === rows.length - 1;
            return (
              <div
                key={ri}
                role="option"
                aria-selected={seleccionada}
                data-fase-index={ri}
                onClick={() => onSelect(seleccionada ? null : ri)}
                onMouseEnter={() => setHovIndex(ri)}
                onMouseLeave={() => setHovIndex(null)}
                className={`flex items-center gap-4 px-(--card-px) transition-colors cursor-pointer ${esUltima ? "" : "border-b border-border-subtle"} ${seleccionada ? "inset-shadow-row-selected" : ""}`}
                style={{ height: REPOSICIONES_ROW_H, backgroundColor: seleccionada ? "var(--color-primary-tint)" : hovIndex === ri ? "var(--color-fill-muted)" : undefined }}
              >
                <div className="min-w-0 flex-1 flex items-baseline gap-2">
                  <span className={`shrink-0 text-body whitespace-nowrap ${seleccionada ? "text-secondary font-medium" : "text-text"}`}>
                    Reposición {fila.nro}
                  </span>
                  <span className="shrink-0 text-code font-mono text-text-muted">{fila.equipoCodigo}</span>
                  <span className="min-w-0 truncate text-body-sm text-text-muted" title={fila.equipoDesc}>{fila.equipoDesc}</span>
                </div>
                <div className="shrink-0 flex items-center justify-end gap-4">
                  <FaseIndicador fase={fila.fase} />
                  <span className="text-code font-mono tabular-nums text-text-muted">{fila.horaRep}</span>
                  <span className="text-body-sm tabular-nums text-text-muted whitespace-nowrap">{fila.usuariosBT} usuarios BT</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// Chip de "Tablas relacionadas" (Modificar interrupción) — etiqueta arriba,
// valor abajo. `raw` es el valor tal cual sale de generarTablasRelacionadas
// ("SI"/"NO" para la booleana, conteo como string para el resto);
// undefined = sin interrupción seleccionada ("—").
// En reposo NUNCA lleva tint ni borde celeste: el azul relleno queda
// reservado para la fila seleccionada de ReposicionesLista, justo arriba.
// Con contenido (conteo > 0 o "Sí"): <button> blanco + borde de card +
// valor navy, abre el modal en ese tab; el azul aparece solo en hover
// (tint + borde primary) y foco. Sin contenido (0, "No" o sin selección):
// <div> NO interactivo (fuera del orden de tabulación), borde punteado
// border, sin fondo ni hover, label y valor text-muted — nunca opacidad
// reducida: el valor es información (ver DESIGN_SYSTEM.md, regla 6).
// El ancho lo fija la etiqueta: el valor tiene w-0 + min-w-full, así no
// aporta al ancho intrínseco y los chips quedan parejos entre sí.
function RelacionadaChip({
  label,
  raw,
  booleana,
  onClick,
}: {
  label: string;
  raw: string | undefined;
  booleana: boolean;
  onClick: () => void;
}) {
  let valor = VALOR_VACIO;
  let conContenido = false;
  if (raw !== undefined) {
    if (booleana) {
      conContenido = raw === "SI";
      valor = conContenido ? "Sí" : "No";
    } else {
      const n = Number(raw);
      conContenido = n > 0;
      valor = formatNumero(n);
    }
  }
  const baseCls = "inline-flex flex-col items-start px-[14px] py-[6px] rounded-sm border text-left";
  const etiqueta = (
    <span className="text-caption caps whitespace-nowrap text-text-muted">{label}</span>
  );
  if (!conContenido) {
    return (
      <div className={`${baseCls} border-dashed border-border bg-transparent cursor-default`}>
        {etiqueta}
        <span className="w-0 min-w-full text-body-lg whitespace-nowrap text-text-muted">{valor}</span>
      </div>
    );
  }
  // "TABLA 5" → "Tabla 5"
  const nombre = label.charAt(0) + label.slice(1).toLowerCase();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={booleana ? `${nombre}: ${valor}, abrir` : `${nombre}: ${valor} registros, abrir`}
      className={`${baseCls} bg-surface border-border hover:bg-primary-tint hover:border-primary active:bg-chip-border-hover transition-[background-color,border-color] duration-(--duration-fast) ${FOCUS_RING}`}
    >
      {etiqueta}
      <span className="w-0 min-w-full text-body-lg whitespace-nowrap font-medium text-secondary">{valor}</span>
    </button>
  );
}

// ── Reclamos durante la interrupción ─────────────────────────────────
// Dos piezas: el gráfico completo (ReclamosTimeline) en el modal "Datos de
// la Interrupción" — un solo patrón para todos los volúmenes: línea de la
// interrupción con un hito por reclamo, con marcas de hora sobre el eje — y
// un resumen compacto de una línea, sin gráfico, en la card Interrupciones
// de Modificar interrupción, debajo de su tabla (ReclamosResumenCompacto),
// que abre ese modal.
//
// Estructura: header + chip DURACIÓN → KPIs → pista → INICIO/FIN. Colores
// por token:
//   textos → text-muted · borde de la card → border
//   pista → viz-track · hito dentro del 80% → viz-milestone · fuera →
//   viz-milestone-muted · marcas de hora → viz-tick (geometría del gráfico:
//   tokens --color-viz-* de index.css, sobre la escala neutral)
//   primer reclamo y valores → secondary · banda de densidad → primary
//   chip de duración → primary-tint / chip-border
//   rótulos del chip y de la banda → color-mix sobre secondary / primary.
// La X no sale de un viewBox fijo: el viewBox usa el ancho real medido, la
// pista va de x=8 a ancho−8 y cada reclamo se ubica proporcional a su
// tiempo desde el inicio — así la separación mínima de 5px es en px reales.
//
// Qué se dibuja en la pista:
//   1 reclamo  → pista base + hito del primer reclamo.
//   2+         → banda del 80% (del primer reclamo al percentil 80), pista
//                base y un hito por reclamo (más oscuro y alto dentro de la
//                banda).
//   saturado   → cuando los hitos ya no entran separados (desplazamientos en
//                cadena o se pasan del final), la pista sube de alto y se tiñe
//                con un degradé cuyos stops salen de la densidad real por tramo.
// El primer reclamo (barra 3×N + círculo blanco con borde navy) es siempre
// igual y es lo único navy de la pista; el celeste queda solo para la banda
// (y hover/foco del bloque).

type GeometriaTimeline = {
  alto: number;
  pistaY: number; pistaH: number;
  satY: number; satH: number;
  bandaY: number; bandaH: number; rotuloY: number;
  dentroY: number; dentroH: number;
  fueraY: number; fueraH: number;
  hitoW: number;
  primeroY: number; primeroH: number; circuloY: number; circuloR: number;
  ejeY: number | null; // y de las marcas de hora (solo modal)
};

// Geometría del modal: la composición de la referencia (SVG de 52px: pista
// y=33 h=5, banda y=14 h=24, hitos 14/12, primer reclamo 3×20 + r 3.5)
// ampliada — pista e hitos más altos, todo apoyado en la misma base — más
// marcas de hora debajo de la pista.
const TIMELINE_MODAL: GeometriaTimeline = {
  alto: 78,
  pistaY: 50, pistaH: 7,
  satY: 39, satH: 18,
  bandaY: 21, bandaH: 36, rotuloY: 16,
  dentroY: 35, dentroH: 22,
  fueraY: 39, fueraH: 18,
  hitoW: 3,
  primeroY: 27, primeroH: 30, circuloY: 24, circuloR: 4.5,
  ejeY: 73,
};

const TIMELINE_X0 = 8;
const TIMELINE_SEP_MIN = 5; // px mínimos entre hitos consecutivos
const TIMELINE_CADENA_SATURADA = 3; // desplazamientos seguidos → modo saturado

// Ancho en px de un elemento, en vivo (ResizeObserver).
function useAncho<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [ancho, setAncho] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setAncho(Math.floor(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, ancho] as const;
}

type ResumenReclamos = {
  duracionMin: number;
  ordenados: number[]; // minutos desde el inicio, ascendente
  total: number;
  primero: number;
  p80: number; // minuto del reclamo en el percentil 80 (nearest-rank)
};

function resumirReclamos(datos: ReclamosInterrupcion): ResumenReclamos {
  const duracionMin = Math.max(1, Math.round((datos.fin.getTime() - datos.inicio.getTime()) / 60000));
  const ordenados = [...datos.minutos].sort((a, b) => a - b);
  const total = ordenados.length;
  const primero = ordenados[0] ?? 0;
  const p80 = total > 0 ? ordenados[Math.ceil(0.8 * total) - 1] : 0;
  return { duracionMin, ordenados, total, primero, p80 };
}

// Posiciones X de los hitos (centro), con la separación mínima forzada, y
// si la pista pasa a modo saturado.
function layoutHitos(ordenados: number[], duracionMin: number, x0: number, x1: number) {
  const xs: number[] = [];
  let cadena = 0;
  let saturado = false;
  for (const m of ordenados) {
    const natural = x0 + (m / duracionMin) * (x1 - x0);
    const previo = xs[xs.length - 1];
    if (previo !== undefined && natural < previo + TIMELINE_SEP_MIN) {
      xs.push(previo + TIMELINE_SEP_MIN);
      if (++cadena >= TIMELINE_CADENA_SATURADA) saturado = true;
    } else {
      xs.push(natural);
      cadena = 0;
    }
  }
  if (xs.length && xs[xs.length - 1] > x1) saturado = true;
  return { xs, saturado };
}

// Stops del degradé de densidad (modo saturado): la pista se parte en
// tramos (~1 cada 48px, entre 6 y 14), se cuentan los reclamos de cada uno,
// se suaviza con dos pasadas de [1,2,1] (sin eso el degradé queda rayado
// tipo código de barras) y cada stop mezcla navy con el gris de la pista
// según la densidad relativa (más reclamos = más oscuro).
function stopsDensidad(ordenados: number[], duracionMin: number, anchoPista: number) {
  const tramos = Math.max(6, Math.min(14, Math.floor(anchoPista / 48)));
  let cuentas = new Array<number>(tramos).fill(0);
  for (const m of ordenados) cuentas[Math.min(tramos - 1, Math.floor((m / duracionMin) * tramos))]++;
  for (let pasada = 0; pasada < 2; pasada++) {
    cuentas = cuentas.map((c, i) => (cuentas[Math.max(0, i - 1)] + 2 * c + cuentas[Math.min(tramos - 1, i + 1)]) / 4);
  }
  const max = Math.max(...cuentas, 1);
  const color = (c: number) => `color-mix(in srgb, var(--color-secondary) ${Math.round((c / max) * 100)}%, var(--color-viz-track))`;
  // Extremos en 0% y 100% con el valor del primer/último tramo.
  return [
    { offset: "0%", color: color(cuentas[0]) },
    ...cuentas.map((c, i) => ({ offset: `${((i + 0.5) / tramos) * 100}%`, color: color(c) })),
    { offset: "100%", color: color(cuentas[tramos - 1]) },
  ];
}

// Marcas de hora intermedias (solo modal): el paso "redondo" más chico que
// deja ≤5 marcas, alineadas al reloj; se saltean las pegadas a los bordes.
const TIMELINE_PASOS_MIN = [5, 10, 15, 30, 60, 120, 180, 360, 720, 1440, 2880];
function marcasHora(inicio: Date, duracionMin: number, px: (m: number) => number, x0: number, x1: number) {
  const paso = TIMELINE_PASOS_MIN.find((p) => duracionMin / p <= 5) ?? 10080;
  const inicioMin = inicio.getHours() * 60 + inicio.getMinutes();
  const marcas: number[] = [];
  for (let t = paso - (inicioMin % paso); t < duracionMin; t += paso) {
    if (px(t) - x0 > 36 && x1 - px(t) > 36) marcas.push(t);
  }
  return marcas;
}

function ReclamosTimeline({ datos }: { datos: ReclamosInterrupcion | null }) {
  const g = TIMELINE_MODAL;
  const [pistaRef, ancho] = useAncho<HTMLDivElement>();
  const idBase = useId().replace(/:/g, "");
  const resumen = useMemo(() => (datos ? resumirReclamos(datos) : null), [datos]);

  const total = resumen?.total ?? 0;
  const conDia = !!resumen && resumen.duracionMin > 1440;
  const x0 = TIMELINE_X0;
  const x1 = Math.max(x0, ancho - TIMELINE_X0);
  const px = (m: number) => x0 + (m / (resumen?.duracionMin ?? 1)) * (x1 - x0);
  const { xs, saturado } = useMemo(
    () => (resumen && ancho > 0 ? layoutHitos(resumen.ordenados, resumen.duracionMin, x0, x1) : { xs: [], saturado: false }),
    [resumen, ancho, x0, x1],
  );
  const hayBanda = total >= 2;
  // Banda: 4px antes del primer hito hasta 4px después del hito del p80.
  const indiceP80 = Math.ceil(0.8 * total) - 1;
  const bandaX = xs.length ? Math.max(x0, xs[0] - 4) : x0;
  const bandaFin = xs.length ? Math.min(x1, (saturado ? px(resumen!.p80) : xs[indiceP80]) + g.hitoW / 2 + 4) : x0;
  const rotuloX = Math.min(bandaX + 6, x1 - 112);

  const kLabel = "block text-caption caps text-text-muted mb-[3px]";
  const kValor = "text-heading-md text-secondary tabular-nums";
  const kSufijo = "text-caption text-text-muted";

  const contenido = (
    <>
      {/* Header: label + chip DURACIÓN */}
      <div className="flex items-center justify-between gap-[12px] mb-[14px]">
        <span className="text-caption caps text-text-muted">RECLAMOS DURANTE LA INTERRUPCIÓN</span>
        {resumen && <ChipDuracion minutos={resumen.duracionMin} />}
      </div>

      {/* KPIs: TOTAL + RECLAMO (1) · TOTAL + PRIMER RECLAMO + 80% LLEGÓ EN (2+) */}
      <div className="flex gap-[26px] mb-[14px]">
        <div>
          <span className={kLabel}>TOTAL</span>
          <span className={kValor}>{resumen ? formatNumero(total) : VALOR_VACIO}</span>
        </div>
        {resumen && total >= 1 && (
          <div>
            <span className={kLabel}>{total === 1 ? "RECLAMO" : "PRIMER RECLAMO"}</span>
            <span className={kValor}>
              {fmtHoraCorta(new Date(datos!.inicio.getTime() + resumen.primero * 60000), conDia)}{" "}
              <span className={kSufijo}>{fmtDelta(resumen.primero)}</span>
            </span>
          </div>
        )}
        {resumen && total >= 2 && (() => {
          const [num, unidad] = partesDuracion(resumen.p80 - resumen.primero);
          return (
            <div>
              <span className={kLabel}>80% LLEGÓ EN</span>
              <span className={kValor}>
                {num} <span className={kSufijo}>{unidad}</span>
              </span>
            </div>
          );
        })()}
      </div>

      {/* Pista */}
      <div ref={pistaRef} style={{ height: g.alto }}>
        {resumen && total > 0 && ancho > 0 ? (
          <svg viewBox={`0 0 ${ancho} ${g.alto}`} width="100%" height={g.alto} role="img" className="block overflow-visible">
            <title>{`${formatNumero(total)} ${total === 1 ? "reclamo" : "reclamos"} sobre la línea de la interrupción`}</title>
            <defs>
              <linearGradient id={`${idBase}-banda`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" style={{ stopColor: "var(--color-primary)", stopOpacity: 0.14 }} />
                <stop offset="100%" style={{ stopColor: "var(--color-primary)", stopOpacity: 0 }} />
              </linearGradient>
              {saturado && (
                <linearGradient id={`${idBase}-densidad`} x1="0" y1="0" x2="1" y2="0">
                  {stopsDensidad(resumen.ordenados, resumen.duracionMin, x1 - x0).map((s, i) => (
                    <stop key={i} offset={s.offset} style={{ stopColor: s.color }} />
                  ))}
                </linearGradient>
              )}
            </defs>

            {/* Banda de concentración (2+ reclamos) */}
            {hayBanda && (
              <>
                <rect x={bandaX} y={g.bandaY} width={Math.max(0, bandaFin - bandaX)} height={g.bandaH} rx={4} fill={`url(#${idBase}-banda)`} />
                <text x={rotuloX} y={g.rotuloY} letterSpacing="0.04em" className="text-caption fill-text-muted">
                  80% DE LOS RECLAMOS
                </text>
              </>
            )}

            {/* Pista: base (con hitos) o teñida por densidad (saturada) */}
            {saturado ? (
              <rect x={x0} y={g.satY} width={x1 - x0} height={g.satH} rx={g.satH / 2} fill={`url(#${idBase}-densidad)`} />
            ) : (
              <>
                <rect x={x0} y={g.pistaY} width={x1 - x0} height={g.pistaH} rx={g.pistaH / 2} className="fill-viz-track" />
                {xs.slice(1).map((x, j) => {
                  const dentro = j + 1 <= indiceP80;
                  return (
                    <rect
                      key={j}
                      x={x - g.hitoW / 2}
                      y={dentro ? g.dentroY : g.fueraY}
                      width={g.hitoW}
                      height={dentro ? g.dentroH : g.fueraH}
                      rx={g.hitoW / 2}
                      className={dentro ? "fill-viz-milestone" : "fill-viz-milestone-muted"}
                    />
                  );
                })}
              </>
            )}

            {/* Hito del primer reclamo — siempre igual */}
            <rect x={xs[0] - 1.5} y={g.primeroY} width={3} height={g.primeroH} rx={1.5} className="fill-secondary" />
            <circle cx={xs[0]} cy={g.circuloY} r={g.circuloR} strokeWidth={2} className="fill-surface stroke-secondary" />

            {/* Marcas de hora (modal) */}
            {g.ejeY !== null &&
              marcasHora(datos!.inicio, resumen.duracionMin, px, x0, x1).map((t) => (
                <g key={t}>
                  <line x1={px(t)} x2={px(t)} y1={g.pistaY + g.pistaH + 2} y2={g.pistaY + g.pistaH + 6} strokeWidth={1} className="stroke-viz-tick" />
                  <text x={px(t)} y={g.ejeY!} textAnchor="middle" className="text-caption fill-text-muted tabular-nums">
                    {fmtHoraCorta(new Date(datos!.inicio.getTime() + t * 60000), conDia)}
                  </text>
                </g>
              ))}
          </svg>
        ) : (
          <div className="h-full flex items-center text-body-sm text-text-muted">
            {!datos ? "Seleccioná una interrupción" : resumen && total === 0 ? "Sin reclamos registrados" : ""}
          </div>
        )}
      </div>

      {/* Footer: INICIO / FIN */}
      <div className="flex justify-between text-caption text-text mt-[7px] tabular-nums">
        <span>
          <span className="block text-caption caps text-text-muted mb-[1px]">INICIO</span>
          {datos ? formatFechaHora(datos.inicio) : VALOR_VACIO}
        </span>
        <span className="text-right">
          <span className="block text-caption caps text-text-muted mb-[1px]">FIN</span>
          {datos ? formatFechaHora(datos.fin) : VALOR_VACIO}
        </span>
      </div>
    </>
  );

  return (
    <section className="block w-full text-left bg-surface border border-border rounded-md px-[18px] py-[16px]">
      {contenido}
    </section>
  );
}

// Chip DURACIÓN del gráfico del modal (en el resumen compacto de la card
// la duración es una columna más, sin chip).
function ChipDuracion({ minutos }: { minutos: number }) {
  return (
    <span className="inline-flex items-center gap-[6px] bg-primary-tint border border-chip-border rounded-full px-[12px] py-[4px] whitespace-nowrap">
      <span className="text-caption caps" style={{ color: "color-mix(in srgb, var(--color-secondary) 70%, white)" }}>DURACIÓN</span>
      <span className="text-body font-medium text-secondary">{fmtDuracion(minutos)}</span>
    </span>
  );
}

// Resumen de reclamos (card Interrupciones de Modificar interrupción,
// debajo de la tabla de Interrupciones) — sin gráfico. Sección clickeable
// que abre "Datos de la interrupción" (ahí está el gráfico completo,
// ReclamosTimeline): patrón stretched button (ver el JSX), con hover
// primary-tint + texto navy sobre toda la sección y foco con --color-focus.
// Sin estilos propios: todo copiado de elementos del mismo panel —
//   contenedor → sección de la card (border-t), sin borde, radio ni fondo;
//   header     → CardHeader, como toda card: título + subtítulo
//                "Interrupción <ref>" (mismo patrón que Reposiciones, solo
//                con selección) + ChevronRight decorativo en `actions`
//                como señal de que la sección se abre;
//   etiquetas  → las etiquetas de RelacionadaChip ("TABLA 3"…);
//   valores    → los valores de RelacionadaChip en estado con contenido.
// De los chips se copia la tipografía (tamaño, leading, tracking, peso,
// color), no su `whitespace-nowrap`: el chip toma su ancho de la etiqueta,
// acá las columnas tienen ancho fijo y el texto tiene que poder partir.
// Los spans de texto van `block` (en el chip son ítems flex, que se
// comportan igual): inline heredarían el line-height de la celda.
// Cuatro columnas de ancho parejo (grid-cols-4 = minmax(0,1fr)) con divisor
// hairline: RECLAMOS / INICIO INTERRUPCIÓN / FIN INTERRUPCIÓN / DURACIÓN
// TOTAL. Fechas completas dd/mm/aaaa hh:mm; si la columna es angosta parten
// entre fecha y hora, nunca a mitad de la fecha.
function ReclamosResumenCompacto({
  datos,
  referencia,
  onClick,
}: {
  // null = sin interrupción seleccionada (bloque deshabilitado).
  datos: ReclamosInterrupcion | null;
  // Referencia de la interrupción, para el subtítulo del header; null = sin selección.
  referencia: string | null;
  onClick: () => void;
}) {
  const resumen = useMemo(() => (datos ? resumirReclamos(datos) : null), [datos]);
  const fecha = (d: Date) => (
    <>
      <span className="whitespace-nowrap">{formatFecha(d)}</span>{" "}
      <span className="whitespace-nowrap">{formatHora(d)}</span>
    </>
  );
  const columnas: { etiqueta: string; valor: React.ReactNode }[] = [
    { etiqueta: "RECLAMOS", valor: resumen ? formatNumero(resumen.total) : VALOR_VACIO },
    { etiqueta: "INICIO INTERRUPCIÓN", valor: datos ? fecha(datos.inicio) : VALOR_VACIO },
    { etiqueta: "FIN INTERRUPCIÓN", valor: datos ? fecha(datos.fin) : VALOR_VACIO },
    { etiqueta: "DURACIÓN TOTAL", valor: resumen ? fmtDuracion(resumen.duracionMin) : VALOR_VACIO },
  ];

  const habilitada = datos !== null;
  return (
    // Sección de la card Interrupciones (no una card anidada): sin borde,
    // radio ni fondo propios, separada de la tabla por border-t.
    // Stretched button: la sección NO es un <button> (CardHeader adentro de
    // un botón sería HTML inválido). El botón vive en `right` del header y
    // su ::after (absolute inset-0) cubre toda la sección, que es `relative`.
    // Hover (con datos): fondo primary-tint sobre TODA la sección, también
    // en el header (CardHeader es transparente) + textos del cuerpo a
    // secondary. Foco: el focus-visible del botón se pinta en la sección
    // entera (has-[:focus-visible], outline hacia adentro para que no lo
    // recorte la card).
    <div
      data-habilitada={habilitada || undefined}
      className="group relative shrink-0 rounded-b-md border-t border-border transition-colors data-[habilitada]:hover:bg-primary-tint has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-focus has-[:focus-visible]:-outline-offset-2"
    >
      <CardHeader
        title="Reclamos durante la interrupción"
        level="section"
        chrome
        reserveSubtitle
        subtitle={habilitada && referencia ? <>Interrupción <span className="text-code font-mono tabular-nums">{referencia}</span></> : undefined}
        actions={
          <button
            type="button"
            disabled={!habilitada}
            onClick={onClick}
            aria-label="Abrir datos de la interrupción"
            title={habilitada ? "Ver datos de la interrupción" : "Seleccioná una interrupción"}
            className="flex items-center text-icon cursor-pointer disabled:cursor-not-allowed focus-visible:outline-none after:absolute after:inset-0"
          >
            <ChevronRight size={ICON.sm} strokeWidth={1.5} aria-hidden />
          </button>
        }
      />
      {/* Etiquetas en la fila 1 y valores en la fila 2 de la misma grilla:
          si una etiqueta parte en dos líneas (card angosta), los valores
          siguen alineados. El divisor va en ambas celdas de cada columna,
          así la línea es continua. */}
      <div className="grid grid-cols-4 px-(--card-px) pt-1 pb-(--card-section-py)">
        {columnas.map((c, i) => (
          <span key={`l-${c.etiqueta}`} className={`min-w-0 self-end pb-1.5 ${i === 0 ? "pr-3" : "px-3 border-l border-border"}`}>
            <span className="block text-caption caps text-text-muted group-data-[habilitada]:group-hover:text-secondary">{c.etiqueta}</span>
          </span>
        ))}
        {columnas.map((c, i) => (
          <span key={`v-${c.etiqueta}`} className={`min-w-0 self-end ${i === 0 ? "pr-3" : "px-3 border-l border-border"}`}>
            <span className="block text-body-lg font-medium text-secondary">{c.valor}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// Reposición activa — primer elemento del body del modal "Tablas
// relacionadas", en fondo blanco arriba de UnderlineTabs (antes vivía en
// headerExtra). Barra de contexto de registro (DESIGN_SYSTEM.md, regla 7):
// identifica la reposición de CDS4 a la que pertenecen todos los tabs de
// abajo. Contenedor único, estilo "latest commit": "Reposición {n}" en
// semibold + CodeBadge CDS4 (el tag de CardHeader) + metadatos como texto
// plano separados por "·" (el separador del `context` de CardHeader),
// valores text y labels/unidades text-muted; sin chips adentro salvo
// FaseIndicador (estado de solo lectura). Botón "Copiar datos de la
// reposición" al final del grupo izquierdo, paginador ‹ › a la derecha.
//
// Destello: useMatchMedia sigue prefers-reduced-motion en vivo — con
// reduce-motion activo, directamente no destella. prevNroRef guarda la
// última reposición mostrada para detectar un cambio REAL — no el montaje
// inicial: este bloque vive dentro del modal (Modal directamente no
// renderiza nada si `open` es false), así que un cambio de interrupción
// con el modal cerrado nunca lo deja "premontado" — al reabrir, este
// componente vuelve a montar de cero y prevNroRef arranca ya en el valor
// actual, sin comparación previa que dispare un destello espurio. El
// timeout se limpia tanto al re-disparar como al desmontar. El destello
// se aplica al contenedor entero (datos + botón copiar + paginador).
function FaseReposicionFicha({
  fila,
  reposicionIndex,
  totalReposiciones,
  onChangeReposicion,
}: {
  fila: FaseReposicion;
  reposicionIndex: number;
  totalReposiciones: number;
  onChangeReposicion: (next: number) => void;
}) {
  const reduceMotion = useMatchMedia("(prefers-reduced-motion: reduce)");
  const [flash, setFlash] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevNroRef = useRef(fila.nro);

  useEffect(() => {
    const prevNro = prevNroRef.current;
    prevNroRef.current = fila.nro;
    if (prevNro === fila.nro || reduceMotion) return;
    setFlash(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setFlash(false), 250);
  }, [fila.nro, reduceMotion]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Botón sin comportamiento todavía — solo el icono/estilo/aria están
  // definidos. No simula feedback de "copiado": como no copia nada de
  // verdad, mostrar un check acá sería mentirle al usuario.
  // TODO: definir contenido y formato del copiado (pendiente de definición)
  function handleCopiarDatosReposicion() {}

  const sep = <span className="text-text-faint">·</span>;
  return (
    // Wrapper px-5 py-3 (el de antes: mismo margen horizontal que el resto
    // del modal y misma separación con los tabs) + contenedor único con
    // borde/radio de card y fondo blanco — el destello pinta este
    // contenedor. Sin cajas adentro salvo los badges de Fase (estado de
    // solo lectura). La navegación va self-start: con el grupo izquierdo
    // en wrap queda anclada arriba a la derecha.
    <div aria-live="polite" className="px-5 py-3 shrink-0">
      <div
        className={`border border-border rounded-md px-4 py-2.5 flex items-center gap-3 transition-colors duration-(--duration-slow) ${flash ? "bg-primary-tint" : "bg-surface"}`}
      >
      <div className="flex items-center flex-wrap gap-x-2 gap-y-1 min-w-0 text-body-sm">
        <span className="font-semibold text-text whitespace-nowrap">Reposición {fila.nro}</span>
        <CodeBadge code="CDS4" />
        {sep}
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <span className="text-icon"><Clock size={ICON.sm} strokeWidth={1.5} /></span>
          <span className="text-text tabular-nums">{fila.horaRep}</span>
        </span>
        {sep}
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <span className="text-text-muted">Fase</span>
          <FaseIndicador fase={fila.fase} />
        </span>
        {sep}
        <span className="inline-flex items-center gap-1.5 min-w-0">
          <span className="text-code font-mono text-text">{fila.equipoCodigo}</span>
          <span className="text-text-muted truncate max-w-[220px]" title={fila.equipoDesc}>
            {fila.equipoDesc}
          </span>
        </span>
        {sep}
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <span className="text-icon"><Users size={ICON.sm} strokeWidth={1.5} /></span>
          <span className="text-text font-medium tabular-nums">{fila.usuariosBT}</span>
          <span className="text-text-muted">usuarios BT</span>
        </span>
        {/* Sin borde en reposo, hover secundario de la app. Hoy no copia
            nada (handler vacío, ver TODO arriba) y por eso tampoco tiene
            feedback de "copiado" — se conserva tal cual. */}
        <button
          type="button"
          onClick={handleCopiarDatosReposicion}
          aria-label="Copiar datos de la reposición"
          title="Copiar datos de la reposición"
          className={`${ICON_BTN_SM} flex items-center justify-center rounded-sm border border-transparent text-icon hover:bg-primary-tint hover:border-primary hover:text-secondary ${FOCUS_RING} transition-colors shrink-0`}
        >
          <ClipboardList size={ICON.sm} strokeWidth={1.5} />
        </button>
      </div>
      {totalReposiciones > 1 && (
        <div className="ml-auto self-start shrink-0 flex items-center gap-1">
          <span className="text-caption text-text-muted tabular-nums mr-1">
            <span className="font-semibold text-text">{reposicionIndex + 1}</span> de {totalReposiciones}
          </span>
          <button
            type="button"
            onClick={() => onChangeReposicion(reposicionIndex - 1)}
            disabled={reposicionIndex <= 0}
            aria-label="Reposición anterior"
            className={`${ICON_BTN_SM} flex items-center justify-center rounded-sm text-icon hover:bg-fill-muted hover:text-text transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none`}
          >
            <ChevronLeft size={ICON.sm} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => onChangeReposicion(reposicionIndex + 1)}
            disabled={reposicionIndex >= totalReposiciones - 1}
            aria-label="Reposición siguiente"
            className={`${ICON_BTN_SM} flex items-center justify-center rounded-sm text-icon hover:bg-fill-muted hover:text-text transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none`}
          >
            <ChevronRight size={ICON.sm} strokeWidth={1.5} />
          </button>
        </div>
      )}
      </div>
    </div>
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

function ModificarContent({
  onIrAAbm,
  initialRelTab = null,
  initialReferencia = null,
  initialReposicion = null,
}: {
  onIrAAbm: (link: AbmDeepLink) => void;
  // Tab del modal "Tablas relacionadas" a reabrir al montar — lo usa el
  // botón "Volver" de AbmScreen para restaurar el contexto desde el que se
  // saltó a ABM.
  initialRelTab?: string | null;
  // Referencia (SAMPLE_ROWS) a re-seleccionar al montar — misma fuente que
  // initialRelTab, para volver exactamente a la interrupción que se estaba
  // mirando, no solo a la pantalla.
  initialReferencia?: string | null;
  // Número de reposición (.nro) a re-seleccionar al montar — misma fuente
  // que initialRelTab/initialReferencia, para que "Volver" restaure
  // exactamente la reposición que se estaba mirando, no siempre la
  // primera. Se resuelve una sola vez, en el useState inicial de
  // modSelectedFase más abajo — el efecto que resetea esa selección al
  // cambiar de interrupción se salta su primera corrida para no pisarlo.
  initialReposicion?: number | null;
}) {
  const initialRowIndex = initialReferencia ? SAMPLE_ROWS.findIndex((r) => r.referencia === initialReferencia) : -1;
  const [modShowData, setModShowData] = useState(initialRowIndex >= 0);
  const [modSelectedRow, setModSelectedRow] = useState<number | null>(initialRowIndex >= 0 ? initialRowIndex : null);
  const [relTab, setRelTab] = useState<string | null>(initialRelTab);
  const [origenSel, setOrigenSel] = useState<string | null>(null);
  const [tipoSel, setTipoSel] = useState<string | null>(null);
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const [flyoutFilters, setFlyoutFilters] = useState<FlyoutFilters>(EMPTY_FLYOUT_FILTERS);
  // Campos de la barra principal de Búsqueda que antes quedaban sin
  // controlar — ahora necesitan estado propio para poder autocompletarse
  // con los datos de la interrupción seleccionada en la tabla de abajo.
  const [nivelSel, setNivelSel] = useState("");
  const [codigoBusqueda, setCodigoBusqueda] = useState("");
  const [faseSel, setFaseSel] = useState("");
  const [desarmeOpen, setDesarmeOpen] = useState(false);
  const [nivelTipoOpen, setNivelTipoOpen] = useState(false);
  const [replicarOpen, setReplicarOpen] = useState(false);
  const [cambiaFasesOpen, setCambiaFasesOpen] = useState(false);
  const [altaClientesOpen, setAltaClientesOpen] = useState(false);
  const [intercambioOpen, setIntercambioOpen] = useState(false);
  const [datosInterrupcionOpen, setDatosInterrupcionOpen] = useState(false);
  const hasSelection = modSelectedRow !== null;
  const activeTabData = DRAWER_TABS.find(t => t.key === relTab);
  const selectedRecord = modSelectedRow !== null ? SAMPLE_ROWS[modSelectedRow] : null;
  // Tabla ABM equivalente al tab activo del modal "Tablas relacionadas"
  // (solo CDS5/6/8/9) — si existe, las filas de la tabla y el estado vacío
  // ofrecen el deep-link hacia AbmScreen.
  const abmMapping = relTab ? DRAWER_TAB_TO_ABM[relTab] : undefined;
  // Interrupción (SAMPLE_ROWS) que se está mirando ahora mismo — viaja en
  // todo deep-link como `referenciaOrigen` para que "Volver" restaure
  // exactamente esta selección.
  const interrupcionActualRef = selectedRecord?.referencia ?? RECORD.referencia;

  // Autocompleta el formulario de Búsqueda con los datos de la interrupción
  // seleccionada en la tabla — solo para mostrar contexto, nunca dispara
  // una búsqueda ni toca modShowData/resultados. A diferencia de ABM, acá
  // no hay modo Modificar propio: mientras haya una fila seleccionada el
  // formulario entero queda fijo en placeholder/no editable (ver
  // `disabled={hasSelection}` en cada campo más abajo) — no editable "por
  // si el usuario quiere ajustar y volver a buscar", nomás de consulta.
  // Cubre selección por click, por teclado (flechas) y la restauración
  // inicial al volver desde ABM, ya que todas pasan por modSelectedRow. Al
  // deseleccionar, el formulario vuelve a su estado en blanco y editable —
  // mismo criterio que ya usan "Datos de la interrupción" y "Tablas
  // relacionadas" para su estado vacío.
  useEffect(() => {
    if (selectedRecord) {
      setNivelSel(selectedRecord.nivel);
      setCodigoBusqueda(selectedRecord.referencia);
      setFaseSel(selectedRecord.fase);
      setOrigenSel(selectedRecord.origen);
      setTipoSel(selectedRecord.tipo);
      setFlyoutFilters((prev) => ({ ...prev, fecha: selectedRecord.fecha }));
    } else {
      setNivelSel("");
      setCodigoBusqueda("");
      setFaseSel("");
      setOrigenSel(null);
      setTipoSel(null);
      setFlyoutFilters((prev) => ({ ...prev, fecha: "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modSelectedRow]);

  // Filtros del flyout "Más filtros" con valor cargado — alimentan el badge
  // del botón y los chips removibles debajo de la filter bar.
  const activeFlyoutFields = FLYOUT_FIELDS.filter((f) => flyoutFilters[f.key].trim() !== "");

  function clearFlyoutField(key: keyof FlyoutFilters) {
    setFlyoutFilters((prev) => ({ ...prev, [key]: "" }));
  }


  // Tabla Referencia / Fecha (columna derecha). El buscador cubre solo
  // Referencia (searchCols [0]); la fecha se filtra con el FilterTrigger
  // date-range. El filtro se aplica DESPUÉS del hook, sobre los índices de
  // SAMPLE_ROWS (mismo criterio que las filas borradas de ABM): así
  // modVisibleIndices sigue indexando SAMPLE_ROWS, que es lo que usan
  // modSelectedRow, data-row-index y la navegación por teclado. Si la
  // interrupción seleccionada queda fuera del filtro, NO se deselecciona.
  const modGetCells = (row: (typeof SAMPLE_ROWS)[number]) => [row.referencia, row.fecha];
  const [modFiltroFecha, setModFiltroFecha] = useState<RangoFecha | null>(null);
  const { search: modSearch, setSearch: setModSearch, sortIdx: modSortIdx, sortDir: modSortDir, toggleSort: modToggleSort, visibleIndices: modVisibleIndicesBusqueda } =
    useTableToolbar(SAMPLE_ROWS, modGetCells, undefined, [0]);
  const modVisibleIndices = modFiltroFecha
    ? modVisibleIndicesBusqueda.filter((i) => fechaEnRango(fechaHoraDeStr(SAMPLE_ROWS[i].fecha), modFiltroFecha))
    : modVisibleIndicesBusqueda;

  // Tabla 4 (Reposiciones) — siempre visible en la Card B, ya no vive detrás
  // de un tab del drawer. Sin interrupción seleccionada no hay reposiciones
  // que mostrar. Con selección, se generan (seed = referencia) filas
  // propias de esa interrupción — cantidad y valores varían de una a otra,
  // pero siempre las mismas para la misma interrupción.
  const tabla4Rows: FaseReposicion[] = selectedRecord ? generarFasesSinteticas(selectedRecord.referencia) : [];

  // Fila de Reposiciones seleccionada (tabla interactiva, igual que
  // Interrupciones) — "Tablas relacionadas" y "Datos de la interrupción"
  // reflejan la reposición puntual seleccionada acá, no siempre la primera
  // ni la última. Al cambiar de interrupción se preselecciona la primera
  // reposición de la lista (si tiene alguna) — ver efecto más abajo. Al
  // MONTAR, en cambio, arranca en `initialReposicion` si vino uno (viaja
  // desde el botón "Volver" de AbmScreen) — el useState inicial la busca
  // por .nro en vez de asumir índice 0, porque la posición de una
  // reposición dentro de tabla4Rows no tiene por qué coincidir con su
  // número (ver DRAWER_TABS.tabla4).
  const [modSelectedFase, setModSelectedFase] = useState<number | null>(() => {
    if (tabla4Rows.length === 0) return null;
    if (initialReposicion !== null) {
      const idx = tabla4Rows.findIndex((f) => f.nro === initialReposicion);
      if (idx >= 0) return idx;
    }
    return 0;
  });
  // Se salta su primera corrida (el useState de arriba ya resolvió el
  // valor inicial, initialReposicion incluido) — si no, este efecto corre
  // igual en el primer render (todo useEffect corre después del montaje,
  // "cambió" o no) y pisaría esa restauración con 0 antes de que el
  // usuario llegue a verla.
  const isFirstFaseReset = useRef(true);
  useEffect(() => {
    if (isFirstFaseReset.current) {
      isFirstFaseReset.current = false;
      return;
    }
    setModSelectedFase(tabla4Rows.length > 0 ? 0 : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modSelectedRow]);
  const filaFaseSeleccionada = modSelectedFase !== null ? tabla4Rows[modSelectedFase] : undefined;

  // Valores de "Tablas relacionadas" para la reposición seleccionada —
  // mismo generador (ver generarTablasRelacionadas), pero semilla = la
  // interrupción + el número de esa reposición puntual (no solo la
  // interrupción), así cada reposición tiene sus propios valores,
  // deterministicos: volver a seleccionar la misma reposición siempre da
  // los mismos valores.
  const valoresRelacionadas = selectedRecord && filaFaseSeleccionada
    ? generarTablasRelacionadas(`${selectedRecord.referencia}#${filaFaseSeleccionada.nro}`)
    : null;

  // Filas de cada tab del modal "Tablas relacionadas" (5/6/8/9) —
  // generadas por reposición seleccionada (ver generarFilasTabla5/6/8/9),
  // cantidad exactamente igual al tile correspondiente en
  // valoresRelacionadas. Tabla 3 no pasa por acá (usa
  // valoresRelacionadas.tabla3 directo, ver JSX).
  const relTabRows: string[][] = (() => {
    if (!relTab || !selectedRecord || !filaFaseSeleccionada || !valoresRelacionadas) return [];
    const referencia = selectedRecord.referencia;
    const nroReposicion = filaFaseSeleccionada.nro;
    const seedBase = `${referencia}#${nroReposicion}`;
    switch (relTab) {
      case "tabla5": return generarFilasTabla5(seedBase, referencia, nroReposicion, Number(valoresRelacionadas.tabla5));
      case "tabla6": return generarFilasTabla6(seedBase, referencia, nroReposicion, Number(valoresRelacionadas.tabla6));
      case "tabla8": return generarFilasTabla8(seedBase, Number(valoresRelacionadas.tabla8));
      case "tabla9": return generarFilasTabla9(seedBase, referencia, nroReposicion, Number(valoresRelacionadas.tabla9));
      default: return [];
    }
  })();

  // Filtros por columna del toolbar (FilterTrigger): columna → valor, null
  // o ausente = sin filtro. Viven acá y no en useTableToolbar (compartido
  // con los ABM). Se resetean con la misma clave que el buscador.
  const relResetKey = `${relTab}#${modSelectedFase}`;
  const [relFiltros, setRelFiltros] = useState<Record<string, string | null>>({});
  useEffect(() => {
    setRelFiltros({});
  }, [relResetKey]);
  const relFiltrables = activeTabData?.filtrables ?? [];
  const relColIdx = (col: string) => activeTabData?.cols.indexOf(col) ?? -1;
  // Filas que pasan todos los filtros activos (AND, igualdad exacta),
  // salvo el de `excepto` — para calcular las opciones de cada trigger
  // sobre los DEMÁS filtros.
  const relFiltrarFilas = (excepto?: string) =>
    relTabRows.filter((row) =>
      relFiltrables.every((col) => {
        const v = relFiltros[col];
        return col === excepto || v == null || row[relColIdx(col)] === v;
      })
    );
  const relFilteredRows = relFiltrarFilas();
  const relFiltrosActivos = relFiltrables.filter((col) => relFiltros[col] != null).length;
  const relOpcionesFiltro = (col: string) => {
    const ci = relColIdx(col);
    const conteo = new Map<string, number>();
    for (const row of relFiltrarFilas(col)) conteo.set(row[ci], (conteo.get(row[ci]) ?? 0) + 1);
    return [...conteo.entries()]
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => a.value.localeCompare(b.value, "es", { numeric: true }));
  };

  // Buscador con alcance explícito: las columnas de `cols` que NO son
  // filtrables (el buscador cubre identificadores, los triggers
  // categorías; no se superponen). Placeholder: el de DRAWER_TABS, o uno
  // armado con los nombres si son 1 o 2 columnas.
  const relSearchCols = (activeTabData?.cols ?? [])
    .map((col, ci) => (relFiltrables.includes(col) ? -1 : ci))
    .filter((ci) => ci >= 0);
  const relSearchNombres = relSearchCols.map((ci) => activeTabData!.cols[ci].toLowerCase());
  const relSearchPlaceholder =
    activeTabData?.searchPlaceholder ??
    (relSearchNombres.length <= 1
      ? `Buscar ${relSearchNombres[0] ?? ""}…`
      : `Buscar ${relSearchNombres.slice(0, -1).join(", ")} o ${relSearchNombres[relSearchNombres.length - 1]}…`);

  // Tabla del tab activo — se resetea al cambiar de tab O de reposición
  // seleccionada (el contenido de cada tab depende de ambas). Recibe las
  // filas YA filtradas: relVisibleIndices indexa relFilteredRows, no
  // relTabRows.
  const relGetCells = (row: string[]) => row;
  const { search: relSearch, setSearch: setRelSearch, sortIdx: relSortIdx, sortDir: relSortDir, toggleSort: relToggleSort, visibleIndices: relVisibleIndices } =
    useTableToolbar(relFilteredRows, relGetCells, relResetKey, relSearchCols);

  // Datos de la interrupción (widget + modal, Card B) — solo tiene sentido
  // con una interrupción seleccionada; sin selección, la sección completa
  // muestra un estado vacío (ver JSX) y estos valores no se usan.
  // "Fecha última reposición" ahora refleja la reposición seleccionada en
  // la Tabla 4 (no siempre la última de la lista).
  const timelineReferencia = selectedRecord?.referencia ?? "";
  const timelineFechaInicio = selectedRecord?.fecha ?? "";
  const timelineFechaUltRepo = filaFaseSeleccionada ? filaFaseSeleccionada.horaRep : "";
  // Reclamos de la interrupción seleccionada (gráfico debajo de la
  // Tabla 4) — por interrupción, no por reposición.
  const reclamosInterrupcion = useMemo(
    () => (selectedRecord ? generarReclamosSinteticos(selectedRecord.referencia, selectedRecord.fecha) : null),
    [selectedRecord],
  );

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

  // Más filtros / Limpiar / Buscar — mismo lugar (pegados a la derecha de la
  // fila de filtros) en cualquier tamaño de ventana.
  const masFiltrosBtn = (
    <button
      type="button"
      onClick={() => setFlyoutOpen((v) => !v)}
      className={`${BTN_MD} border flex items-center gap-1.5 transition-colors duration-(--duration-base) ${
        activeFlyoutFields.length > 0
          ? "bg-primary-tint border-primary text-secondary"
          : "bg-surface border-border-strong text-text hover:bg-primary-tint hover:border-primary hover:text-secondary"
      }`}
    >
      <Filter size={ICON.sm} strokeWidth={1.5} />
      Más filtros
      {activeFlyoutFields.length > 0 && (
        <span className="w-4 h-4 rounded-full bg-primary-strong text-white text-caption flex items-center justify-center">
          {activeFlyoutFields.length}
        </span>
      )}
    </button>
  );
  const limpiarBuscarBtns = (
    <>
      <button
        type="button"
        onClick={() => {
          setModShowData(false);
          setModSelectedRow(null);
          setOrigenSel(null);
          setTipoSel(null);
          setFlyoutFilters(EMPTY_FLYOUT_FILTERS);
          setNivelSel("");
          setCodigoBusqueda("");
          setFaseSel("");
        }}
        disabled={!modShowData}
        className={`${BTN_MD} border border-border-strong bg-surface text-text hover:bg-primary-tint hover:border-primary hover:text-secondary transition-[color,background-color,border-color,transform] duration-(--duration-base) active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none`}
      >Limpiar</button>
      <button
        type="button"
        onClick={() => { setModShowData(true); setModSelectedRow(null); }}
        disabled={modShowData}
        className={`${BTN_MD} text-white transition-[color,background-color,border-color,transform] duration-(--duration-base) active:scale-[0.99] bg-primary-strong hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none`}
      >Buscar</button>
    </>
  );

  return (
    <div className="flex-1 min-h-0 flex flex-col px-(--page-px) pt-(--page-pt) pb-(--page-pt) relative overflow-hidden">
    <div className="flex-1 min-h-0 flex flex-col gap-(--page-gap)">

        {/* Búsqueda — sin contenedor: la fila de filtros se apoya directo
            en el fondo de la página, debajo del título del encabezado. Una
            sola fila + flyout "Más filtros" anclado a la derecha. */}
        <div className="relative shrink-0">
          <div className="relative">
            <div className="relative z-(--z-raised) flex items-center gap-2 [@media(max-height:760px)]:flex-wrap">
            {/* Ancho fijo (no crece a ocupar el sobrante) para que se vea
                proporcionado contra Nivel/Fase — 190px en tamaño normal,
                bastante más chico en tier 760px vía el `!` important de
                abajo (el ancho normal es inline, gana a una clase sin
                important). */}
            <input
              disabled={hasSelection}
              placeholder={`Ej: ${RECORD.referencia}`}
              className={MOD_FIELD_CLS + " !text-code font-mono" + (hasSelection ? " !bg-fill-subtle !text-text" : "") + " [@media(max-height:760px)]:!w-[112px]"}
              style={{ width: 190, flexShrink: 0 }}
              value={codigoBusqueda}
              onChange={(e) => setCodigoBusqueda(e.target.value)}
            />

            <DateTimeField
              value={flyoutFilters.fecha}
              onChange={(v) => setFlyoutFilters((prev) => ({ ...prev, fecha: v }))}
              disabled={hasSelection}
              muted={false}
              className="[@media(max-height:760px)]:!w-[128px]"
            />

            <ValuePicker
              isDisabled={hasSelection}
              triggerExtraClassName={hasSelection ? " !bg-fill-subtle !text-text" : ""}
              triggerStyle={{ fontWeight: nivelSel ? 600 : 400 }}
              value={nivelSel}
              onChange={setNivelSel}
              opts={["BT", "MT", "AT"]}
              placeholder="Nivel"
              wrapClassName="w-[88px] shrink-0"
            />

            <ValuePicker
              isDisabled={hasSelection}
              triggerExtraClassName={hasSelection ? " !bg-fill-subtle !text-text" : ""}
              value={faseSel}
              onChange={setFaseSel}
              opts={["R", "S", "T", "RS", "RT", "ST", "RST"]}
              placeholder="Fase"
              wrapClassName="w-[84px] shrink-0"
            />

            <div className="w-px h-5 bg-border shrink-0" />

            {/* Toggle Origen/Tipo — tamaño normal. En tier 760px pasan a
                <select> nativo (ver más abajo): ocupan menos ancho por lo
                que aportan, justo lo que le faltaba a esta fila. */}
            <div className="contents [@media(max-height:760px)]:hidden">
              <span className="text-heading-xs uppercase text-text-muted shrink-0">Origen</span>
              <ButtonSelectGroup
                options={["Interno", "Externo"]}
                selected={origenSel ? [origenSel] : []}
                onToggle={(opt) => setOrigenSel(origenSel === opt ? null : opt)}
                disabled={modShowData || hasSelection}
                sizeCls={BTN_SEG_MD}
              />

              <span className="text-heading-xs uppercase text-text-muted shrink-0">Tipo</span>
              <ButtonSelectGroup
                options={["Forzado", "Programado"]}
                selected={tipoSel ? [tipoSel] : []}
                onToggle={(opt) => setTipoSel(tipoSel === opt ? null : opt)}
                disabled={modShowData || hasSelection}
                sizeCls={BTN_SEG_MD}
              />
            </div>

            <ValuePicker
              isDisabled={modShowData || hasSelection}
              value={origenSel ?? ""}
              onChange={(v) => setOrigenSel(v || null)}
              opts={["Interno", "Externo"]}
              placeholder="Origen"
              wrapClassName="hidden [@media(max-height:760px)]:block w-[92px] shrink-0"
            />

            <ValuePicker
              isDisabled={modShowData || hasSelection}
              value={tipoSel ?? ""}
              onChange={(v) => setTipoSel(v || null)}
              opts={["Forzado", "Programado"]}
              placeholder="Tipo"
              wrapClassName="hidden [@media(max-height:760px)]:block w-[112px] shrink-0"
            />

            {/* Más filtros / Limpiar / Buscar juntos, pegados a la derecha —
                mismo lugar en cualquier tamaño de ventana. */}
            <div className="ml-auto flex items-center gap-2 shrink-0">
              {masFiltrosBtn}
              {limpiarBuscarBtns}
            </div>
            </div>

            {/* Backdrop — no bloqueante, sólo cierra el flyout al click afuera.
                Vive junto al flyout (no en el wrapper externo que también
                contiene los chips) para que su posición no se vea afectada
                por si hay o no una fila de chips debajo. */}
            {flyoutOpen && (
              <div className="fixed inset-0 z-(--z-dismiss)" onClick={() => setFlyoutOpen(false)} />
            )}

            {/* Flyout "Más filtros" */}
            {flyoutOpen && (
              <div
                className="shadow-md absolute right-0 z-(--z-dropdown) bg-surface border border-border rounded-md p-4"
                style={{ top: "calc(100% + 6px)", width: 520 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-heading-sm text-text">Más filtros</span>
                  <button
                    type="button"
                    onClick={() => setFlyoutOpen(false)}
                    className={`${ICON_BTN_XS} flex items-center justify-center rounded-sm text-icon hover:bg-fill-muted hover:text-text transition-colors`}
                  >
                    <X size={ICON.sm} strokeWidth={1.5} />
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
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setFlyoutFilters(EMPTY_FLYOUT_FILTERS)}
                    className="text-label text-secondary hover:underline"
                  >
                    Limpiar filtros
                  </button>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setFlyoutOpen(false)}
                      className={`${BTN_MD} border border-border-strong bg-surface text-text hover:bg-fill-muted transition-colors`}
                    >
                      Cerrar
                    </button>
                    <button
                      type="button"
                      onClick={() => setFlyoutOpen(false)}
                      className={`${BTN_MD} text-white bg-primary-strong hover:bg-primary-hover transition-colors`}
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chips de filtros aplicados (flyout) — franja propia, no texto suelto */}
          {activeFlyoutFields.length > 0 && (
            <div className="flex items-center flex-wrap gap-2 mt-4 px-3 py-2 rounded-sm border border-border bg-fill-subtle">
              <span className="text-heading-xs uppercase text-text-muted shrink-0">
                Filtros aplicados:
              </span>
              {activeFlyoutFields.map((f) => (
                <span
                  key={f.key}
                  className="inline-flex items-center gap-1.5 h-(--control-sm) pl-3 pr-1.5 rounded-full bg-primary-tint border border-chip-border text-secondary text-label"
                >
                  {f.label}: {flyoutFilters[f.key]}
                  <button
                    type="button"
                    onClick={() => clearFlyoutField(f.key)}
                    className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-chip-border-hover transition-colors"
                  >
                    <svg width="8" height="8" viewBox="0 0 14 14" fill="none">
                      <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

      {/* ── FILA INFERIOR — Interrupciones y Reposiciones (CDS4), una al lado
          de la otra. Cada card se ajusta a su contenido (items-start, no se
          fuerza el mismo alto) con tope en el alto disponible (max-h-full):
          si el contenido no entra, la tabla se achica y scrollea adentro,
          nunca la página. Las cards NO llevan overflow-hidden: recortaría
          el panel del filtro de Fecha y cualquier otro popover. ── */}
      <div className={`flex-1 min-h-0 flex items-start gap-(--cards-gap) transition-opacity duration-(--duration-base) ${flyoutOpen ? "opacity-50 pointer-events-none" : ""}`}>

      {/* ── Card Interrupciones — card con secciones (ver DESIGN_SYSTEM.md,
          "Card con secciones"): header con divisor → toolbar → tabla al ras
          con paginación al pie → sección Reclamos. Split 50/50 con
          Reposiciones (flex-1 en las dos). ── */}
      <div
        className="shadow-sm flex-1 min-w-0 max-h-full flex flex-col rounded-md border border-border bg-surface"
      >

        {/* Header — sin subtítulo (el contador va en el toolbar). Sin
            acciones: "Datos de la interrupción" se abre desde la sección
            Reclamos. */}
        <CardHeader title="Interrupciones" tag="CDS2" divider chrome />

        {/* Toolbar de tabla — FUERA del contenedor de la tabla, sin fondo ni
            línea divisoria con la tabla (ver DESIGN_SYSTEM.md, "Patrones
            de contenedor y tabla"): buscador de Referencia → divisor → filtro de Fecha →
            (derecha) Limpiar filtros + contador. Se renderiza SIEMPRE: sin
            resultados, buscador y filtro quedan deshabilitados y el contador
            dice "0 registros" — así el divisor del header nunca queda pegado
            al thead. "Limpiar filtros" quita el filtro, no el texto del
            buscador. */}
        <div className="px-(--card-px) py-3 shrink-0 flex items-center flex-wrap gap-2">
          <div className="w-60 shrink-0">
            <TableToolbar search={modSearch} onSearchChange={setModSearch} searchPlaceholder="Buscar referencia…" hideExport bare disabled={!modShowData} />
          </div>
          <div className="w-px h-5 bg-border shrink-0" />
          <FilterTrigger variant="date-range" label="Fecha" value={modFiltroFecha} onChange={setModFiltroFecha} disabled={!modShowData} />
          <div className="ml-auto shrink-0 flex items-center gap-4">
            {modShowData && modFiltroFecha && (
              <button
                type="button"
                onClick={() => setModFiltroFecha(null)}
                className="text-label text-secondary hover:underline"
              >
                Limpiar filtros
              </button>
            )}
            {modShowData
              ? <TableCounter visibles={modVisibleIndices.length} total={SAMPLE_ROWS.length} />
              : <TableCounter visibles={0} />}
          </div>
        </div>

        {/* Body — tabla Referencia / Fecha al ras de la card (el aire de
            arriba lo da el py-3 del toolbar), y debajo el resumen de
            reclamos. Los paddings horizontales de header, toolbar, celdas
            extremas, paginador y secciones salen todos de --card-px para
            quedar alineados. */}
        <div className="min-h-0 flex flex-col">
          {/* Tabla: header bg-fill-subtle de alto fijo (32px), celdas
              px-3 py-2 text-body-sm, separador border-subtle, acento de
              selección con sombra inset en la primera celda, paginación como
              pie (fill-subtle). El toolbar de arriba siempre está, así que
              la tabla lleva su propia línea superior. */}
          <div className="min-h-0 flex flex-col">
            <div className="grid grid-cols-2 items-center shrink-0 bg-fill-subtle border-y border-border" style={{ height: 32 }}>
              <SortableHeaderCell
                label="Referencia"
                active={modSortIdx === 0}
                dir={modSortDir}
                onClick={() => modToggleSort(0)}
                className="pl-(--card-px) pr-3"
              />
              <SortableHeaderCell
                label="Fecha"
                active={modSortIdx === 1}
                dir={modSortDir}
                onClick={() => modToggleSort(1)}
                className="pl-3 pr-(--card-px)"
              />
            </div>
            {/* La card tiene altura fija (arriba) — esta lista ocupa todo el
                espacio que queda dentro de ese alto fijo (flex-1) y scrollea
                internamente, en vez de empujar el scroll general de la página.
                min-h-0 es necesario para que un hijo flex con overflow pueda
                angostarse por debajo de su alto de contenido natural. */}
            <div
              ref={modListRef}
              tabIndex={modShowData ? 0 : -1}
              onKeyDown={handleModListKeyDown}
              className={`min-h-0 overflow-y-auto ${FOCUS_RING_INSET}`}
            >
              {!modShowData ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2 text-center px-8">
                  <span className="text-text-faint scale-90"><Inbox size={ICON.xl} strokeWidth={1.25} /></span>
                  <p className="text-label text-text-muted">Sin resultados</p>
                  <p className="text-caption text-text-muted">Completá los filtros y presioná Buscar</p>
                </div>
              ) : modFiltroFecha && modVisibleIndices.length === 0 ? (
                /* El filtro dejó 0 filas — mismo empty state de arriba. */
                <div className="flex flex-col items-center justify-center py-10 gap-2 text-center px-8">
                  <span className="text-text-faint scale-90"><Inbox size={ICON.xl} strokeWidth={1.25} /></span>
                  <p className="text-label text-text-muted">Sin resultados para los filtros aplicados</p>
                </div>
              ) : modVisibleIndices.map((i, vi) => {
                const row = SAMPLE_ROWS[i];
                const selected = modSelectedRow === i;
                const esUltima = vi === modVisibleIndices.length - 1;
                const textCls = selected ? "text-secondary font-medium" : "text-text";
                return (
                  <div
                    key={i}
                    data-row-index={i}
                    className={`grid grid-cols-2 transition-colors cursor-pointer hover:bg-fill-muted ${esUltima ? "" : "border-b border-border-subtle"}`}
                    style={{ backgroundColor: selected ? "var(--color-primary-tint)" : undefined }}
                    onClick={() => setModSelectedRow(selected ? null : i)}
                  >
                    <div
                      className={`pl-(--card-px) pr-3 py-2 text-code tabular-nums whitespace-nowrap font-mono ${textCls} ${selected ? "inset-shadow-row-selected" : ""}`}
                    >
                      {row.referencia}
                    </div>
                    <div className={`pl-3 pr-(--card-px) py-2 text-body-sm tabular-nums whitespace-nowrap ${textCls}`}>{row.fecha}</div>
                  </div>
                );
              })}
            </div>
            <div className="shrink-0 border-t border-border bg-fill-subtle px-(--card-px) py-1.5 flex items-center justify-between">
              <button className={`${BTN_SM} border border-border bg-surface text-text-muted disabled:opacity-40`} disabled>Anterior</button>
              <span className="text-caption text-text-muted">Página <span className="font-medium text-text">1</span> de <span className="font-medium text-text">2.213</span></span>
              <button className={`${BTN_SM} border border-border bg-surface text-text-muted hover:bg-fill-muted transition-colors`}>Siguiente</button>
            </div>
          </div>
          <ReclamosResumenCompacto
            datos={reclamosInterrupcion}
            referencia={selectedRecord?.referencia ?? null}
            onClick={() => setDatosInterrupcionOpen(true)}
          />
        </div>
      </div>

        {/* Card B — Reposiciones (CDS4). Mismo criterio que la card de
            Interrupciones: nunca crece con el contenido (banner de
            selección, filas de la Tabla 4, etc.) — body scrolleable propio
            en vez de empujar el scroll de la página. Split de la fila 50/50
            en todos los tamaños (flex-1 acá y en Interrupciones) — antes era
            40/60 a favor de esta card, pero el resumen de reclamos pasó a
            vivir en Interrupciones. */}
        <div
          className="shadow-sm flex-1 min-w-0 max-h-full flex flex-col rounded-md border border-border bg-surface"
        >
          {/* La interrupción seleccionada (registro padre de las
              reposiciones) va como subtítulo del header: "INTERRUPCIÓN
              SELECCIONADA" + ID. El divisor del header hace de línea
              superior de la tabla. */}
          <CardHeader
            title="Reposiciones"
            tag="CDS4"
            divider
            chrome
            reserveSubtitle
            subtitle={selectedRecord ? <SubtituloEtiquetado etiqueta="Interrupción seleccionada">{selectedRecord.referencia}</SubtituloEtiquetado> : undefined}
          />

          <div className="min-h-0 flex flex-col">

            {/* Tabla 4 — siempre visible, nunca detrás de un modal/drawer.
                Vacía hasta que se selecciona una interrupción. Toma el alto
                de su contenido (la card no se estira); si no entra en el
                alto disponible se achica con scroll propio + header sticky,
                ver ReposicionesLista. min-h-0 en este wrapper: sin él la
                tabla no puede achicarse y Tablas relacionadas quedaría
                cortada. */}
            <div className="min-h-0 flex flex-col">
              <ReposicionesLista
                rows={tabla4Rows}
                selectedIndex={modSelectedFase}
                onSelect={setModSelectedFase}
              />
              {/* Sección "Tablas relacionadas" de la card (no una card
                  anidada): separada por border-t a todo el ancho, sin
                  borde, fondo ni radio propios. Los chips abren el modal
                  "Tablas relacionadas", preseleccionado en la reposición
                  actual (modSelectedFase es la única fuente de verdad,
                  compartida entre esta card y el modal) y en el tab del
                  chip clickeado. La reposición activa va como subtítulo:
                  "REPOSICIÓN" + "X de N · hora". */}
              <div className="shrink-0 border-t border-border">
                <CardHeader
                  title="Tablas relacionadas"
                  level="section"
                  chrome
                  reserveSubtitle
                  subtitle={
                    filaFaseSeleccionada
                      ? <SubtituloEtiquetado etiqueta="Reposición">{modSelectedFase !== null ? modSelectedFase + 1 : VALOR_VACIO} de {tabla4Rows.length} · {filaFaseSeleccionada.horaRep}</SubtituloEtiquetado>
                      : undefined
                  }
                />
                <div className="flex flex-wrap gap-[6px] px-(--card-px) pt-1 pb-(--card-section-py)">
                  {STATUS_ITEMS.map((item) => (
                    <RelacionadaChip
                      key={item.tabKey}
                      label={item.label}
                      raw={hasSelection ? valoresRelacionadas?.[item.tabKey] : undefined}
                      booleana={item.tabKey === "tabla3"}
                      onClick={() => setRelTab(item.tabKey)}
                    />
                  ))}
                </div>
              </div>
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
        reclamos={reclamosInterrupcion}
      />

      {/* ── MODAL "Tablas relacionadas" ─────────────────────────── */}
      {/* Alto FIJO (min(720px, 100vh−40px)): el modal no puede saltar de
          tamaño al cambiar de tab o de reposición. bodyPadding={false} +
          bodyOverflow="hidden": sin cards ni fondo gris — el contenido va
          de borde a borde del modal (mismo px-5 que el header), con un
          wrapper interno `h-full flex flex-col min-h-0` propio (tabs
          shrink-0, área de tabla flex-1 min-h-0 — la única zona con
          scroll). headerExtra agrega, debajo de título/cerrar: la línea
          de Interrupción + CopyButton, y — si hay una reposición
          seleccionada — la línea de metadatos de esa reposición
          (FaseReposicionFicha, separados por "·") + el paginador ‹ ›.
          Ninguna de estas props toca el header de los demás modales de la
          app (ninguno las pasa). El título va en heading-md, como en
          todos los modales. */}
      <Modal
        title="Tablas relacionadas"
        open={relTab !== null}
        onClose={() => setRelTab(null)}
        size="xl"
        bodyPadding={false}
        bodyOverflow="hidden"
        height="min(720px, calc(100vh - 40px))"
        headerExtra={
          // Solo la Interrupción: es la identidad del modal, no cambia
          // mientras está abierto (a diferencia de la reposición activa,
          // que ahora vive en el body — ver abajo). pb-3.5 fijo (ya no
          // condicional): sin una segunda línea debajo, el header siempre
          // cierra parejo.
          <div className="px-5 mt-0.5 pb-3.5 flex items-center gap-2">
            <span className="text-heading-xs uppercase text-text-muted">Interrupción</span>
            <span className="text-code font-mono tabular-nums text-text">
              {selectedRecord ? selectedRecord.referencia : RECORD.referencia}
            </span>
            <CopyButton value={selectedRecord ? selectedRecord.referencia : RECORD.referencia} label="interrupción" />
          </div>
        }
      >
        <div className="h-full flex flex-col min-h-0">
          {/* Reposición activa — primer elemento del body, en fondo
              blanco (el body no tiene bg propio, hereda el bg-surface del
              panel). Sin border-b propio: lo pone la barra de tabs de
              abajo. */}
          {filaFaseSeleccionada && (
            <FaseReposicionFicha
              fila={filaFaseSeleccionada}
              reposicionIndex={modSelectedFase ?? 0}
              totalReposiciones={tabla4Rows.length}
              onChangeReposicion={setModSelectedFase}
            />
          )}
          <UnderlineTabs
            ariaLabel="Tablas relacionadas"
            options={DRAWER_TABS.filter((tab) => tab.key !== "tabla4").map((tab) => ({ key: tab.key, label: tab.label }))}
            activeKey={relTab}
            onSelect={setRelTab}
          />

          {/* Descripción del tab activo, sola en su fila. Tabla 3 no
              repite descripción, el resultado (Sí/No existe) ya la dice. */}
          <div className="px-5 pt-3 pb-3 shrink-0">
            <p className="text-body-sm text-text-muted">
              {activeTabData && activeTabData.key !== "tabla3" ? activeTabData.subtitle : null}
            </p>
          </div>

          {/* Toolbar de la tabla (ver DESIGN_SYSTEM.md, "Patrones de
              contenedor y tabla"): FUERA del contenedor de la tabla, sin
              fondo ni líneas (px-5 pb-3, alineado con el resto del modal).
              Buscador (TableToolbar `bare`, solo columnas no filtrables) →
              divisor (el de PersistentActionsBar) → un FilterTrigger por
              columna filtrable del tab → a la derecha "Limpiar filtros"
              (clases del flyout "Más filtros", solo con ≥1 filtro activo) +
              contador. Tabla 3 no tiene toolbar. */}
          {relTabRows.length > 0 && (
            <div className="px-5 pb-3 shrink-0 flex items-center gap-2">
              <div className="w-64 shrink-0">
                <TableToolbar search={relSearch} onSearchChange={setRelSearch} searchPlaceholder={relSearchPlaceholder} hideExport bare />
              </div>
              {relFiltrables.length > 0 && (
                <>
                  <div className="w-px h-5 bg-border shrink-0" />
                  {relFiltrables.map((col) => (
                    <FilterTrigger
                      key={col}
                      label={col}
                      options={relOpcionesFiltro(col)}
                      value={relFiltros[col] ?? null}
                      onChange={(v) => setRelFiltros((prev) => ({ ...prev, [col]: v }))}
                    />
                  ))}
                </>
              )}
              <div className="ml-auto shrink-0 flex items-center gap-4">
                {relFiltrosActivos > 0 && (
                  <button
                    type="button"
                    onClick={() => setRelFiltros({})}
                    className="text-label text-secondary hover:underline"
                  >
                    Limpiar filtros
                  </button>
                )}
                <TableCounter visibles={relVisibleIndices.length} total={relTabRows.length} />
              </div>
            </div>
          )}

          {/* Área de la tabla — única zona con scroll del modal (los dos
              ejes). Tabla 3 y los estados vacíos viven ACÁ ADENTRO,
              centrados vertical y horizontalmente. Header de tabla sticky
              con fondo opaco (ver SortableTh) — la tabla pasa a
              border-separate y los separadores de fila se mueven de <tr>
              a <td>, porque bajo border-collapse un borde de fila se
              pinta en la capa de bordes de la tabla y puede quedar por
              encima del <th> sticky al scrollear (mismo criterio que
              usaba la tabla de Reposiciones). mx-5/mb-5 (antes mx-4/mb-4 dentro de
              la card, ya sin card) para alinear con el padding del resto
              del modal. */}
          <div className="flex-1 min-h-0 mx-5 mb-5 border border-border rounded-md overflow-auto">
            {activeTabData && (
              activeTabData.key === "tabla3" ? (() => {
                const existe = valoresRelacionadas?.tabla3 === "SI";
                return (
                  <div className="h-full min-h-[180px] flex items-center justify-center p-6">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: existe ? "var(--color-success-bg)" : "var(--color-error-bg)" }}
                      >
                        {existe ? (
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M4.5 10.5l3.5 3.5 7.5-7.5" stroke="var(--color-success)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M5.5 5.5l9 9M14.5 5.5l-9 9" stroke="var(--color-error)" strokeWidth="2.2" strokeLinecap="round" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="text-heading-sm" style={{ color: existe ? "var(--color-success-text-strong)" : "var(--color-error-text-strong)" }}>
                          {existe ? "Sí existe en Tabla 3" : "No existe en Tabla 3"}
                        </p>
                        <p className="text-body-sm text-text-muted">
                          {existe
                            ? "Esta reposición tiene registro en la tabla"
                            : "Esta reposición no tiene registro en la tabla"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })() : relTabRows.length === 0 ? (
                <div className="h-full min-h-[180px] flex items-center justify-center p-6">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <span className="text-text-faint"><Inbox size={ICON.xl} strokeWidth={1.25} /></span>
                    <p className="text-heading-sm text-text-muted">Sin registros</p>
                    <p className="text-body-sm text-text-muted">Sin registros para la reposición {filaFaseSeleccionada?.nro ?? VALOR_VACIO}</p>
                    {abmMapping && (
                      <button
                        type="button"
                        onClick={() =>
                          onIrAAbm({
                            tableKey: abmMapping.tableKey,
                            campo: abmMapping.campoCodigoInterrupcion,
                            columna: abmMapping.columnaCodigoInterrupcion,
                            valor: interrupcionActualRef,
                            modo: "alta",
                            relTabOrigen: relTab ?? undefined,
                            referenciaOrigen: interrupcionActualRef,
                            reposicionOrigen: filaFaseSeleccionada?.nro,
                          })
                        }
                        className="mt-1 text-label text-secondary hover:underline"
                      >
                        Ir a {ABM_TABLE_CONFIGS[abmMapping.tableKey].code} a insertar →
                      </button>
                    )}
                  </div>
                </div>
              ) : relFiltrosActivos > 0 && relVisibleIndices.length === 0 ? (
                /* Los filtros dejaron 0 filas — mismo empty state (Inbox)
                   que "Sin registros". */
                <div className="h-full min-h-[180px] flex items-center justify-center p-6">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <span className="text-text-faint"><Inbox size={ICON.xl} strokeWidth={1.25} /></span>
                    <p className="text-heading-sm text-text-muted">Sin resultados para los filtros aplicados</p>
                  </div>
                </div>
              ) : (
                <table className="w-full border-separate" style={{ borderSpacing: 0 }}>
                  <thead>
                    <tr>
                      {activeTabData.cols.map((col, ci) => (
                        <SortableTh
                          key={col}
                          label={col}
                          active={relSortIdx === ci}
                          dir={relSortDir}
                          onClick={() => relToggleSort(ci)}
                        />
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {relVisibleIndices.map((ri) => {
                      const row = relFilteredRows[ri];
                      // Cuando la tabla mapea a ABM y la primera columna es
                      // "Interrupción", esa celda es el valor más confiable
                      // para el deep-link; si no, se usa la interrupción
                      // actual como fallback. Con filas generadas (ver
                      // generarFilasTabla5/6/8/9) este valor no está
                      // garantizado a existir en ABM_TABLE_CONFIGS —
                      // soft-fail aceptado, ver comentario en DRAWER_TABS.
                      const valorDeepLink =
                        activeTabData.cols[0] === "Interrupción" ? row[0] : interrupcionActualRef;
                      const esUltima = ri === relVisibleIndices[relVisibleIndices.length - 1];
                      return (
                        <tr
                          key={ri}
                          onClick={
                            abmMapping
                              ? () =>
                                  onIrAAbm({
                                    tableKey: abmMapping.tableKey,
                                    campo: abmMapping.campoCodigoInterrupcion,
                                    columna: abmMapping.columnaCodigoInterrupcion,
                                    valor: valorDeepLink,
                                    modo: "buscar",
                                    relTabOrigen: relTab ?? undefined,
                                    referenciaOrigen: interrupcionActualRef,
                                    reposicionOrigen: filaFaseSeleccionada?.nro,
                                  })
                              : undefined
                          }
                          className={`transition-colors ${abmMapping ? "cursor-pointer hover:bg-primary-tint" : "hover:bg-fill-muted"}`}
                        >
                          {row.map((cell, ci) => (
                            <td
                              key={ci}
                              className={`px-4 py-3.5 text-body text-text whitespace-nowrap ${esUltima ? "" : "border-b border-border-subtle"}`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )
            )}
          </div>
        </div>
      </Modal>

    </div>
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
