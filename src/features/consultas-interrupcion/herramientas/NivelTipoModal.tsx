import {
  FieldLabel,
  MOD_FIELD_CLS,
  Modal,
  modalNeutralBtnCls,
  modalPrimaryBtnCls,
  ValuePicker,
} from "@/components/ui";

// ─── Modal: Nivel/Tipo ──────────────────────────────────────────────────────
const NIVEL_TIPO_TIPOS = ["BFZ", "AFZ", "BPR", "MFZ"];

export default function NivelTipoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
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
