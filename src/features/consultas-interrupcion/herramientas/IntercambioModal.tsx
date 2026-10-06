import { useState, useRef } from "react";
import { Search, Inbox } from "lucide-react";
import {
  actionBtnCls,
  BTN_SM,
  FieldLabel,
  ICON,
  MOD_FIELD_CLS,
  Modal,
  ModalCheckbox,
  modalNeutralBtnCls,
  modalPrimaryBtnCls,
  ModalRadio,
} from "@/components/ui";

// ─── Modal: Intercambio ─────────────────────────────────────────────────────
type IntercambioRow = { id: number; fecha: string; clientes: number; repo: number };

export default function IntercambioModal({
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
