import {
  ContextoRegistro,
  FieldLabel,
  Modal,
  modalNeutralBtnCls,
  modalPrimaryBtnCls,
  ValuePicker,
} from "@/components/ui";
import { PERIODS } from "@/data/dominio";

// ─── Modal: Replicar ────────────────────────────────────────────────────────
export default function ReplicarModal({
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
      <ContextoRegistro etiqueta="Interrupción" valor={referencia} copiable bleed />
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
