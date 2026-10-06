import { useState } from "react";
import {
  FieldLabel,
  MOD_FIELD_CLS,
  modalNeutralBtnCls,
  modalPrimaryBtnCls,
  ValuePicker,
} from "@/components/ui";
import { PERIODS } from "@/data/dominio";

// ─── Inserta clientes en BDTH ───────────────────────────────────────────────

export default function InsertaClientesContent() {
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
