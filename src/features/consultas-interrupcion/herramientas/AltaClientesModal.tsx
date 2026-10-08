import { useState } from "react";
import {
  actionBtnCls,
  BTN_SM,
  ContextoRegistro,
  Modal,
  ModalCheckbox,
  modalNeutralBtnCls,
  modalPrimaryBtnCls,
} from "@/components/ui";
import { ALTA_CLIENTES_ROWS } from "@/data/mocks";

// ─── Modal: Alta de clientes ────────────────────────────────────────────────
export default function AltaClientesModal({
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
      <ContextoRegistro etiqueta="Interrupción" valor={referencia} copiable bleed />
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
