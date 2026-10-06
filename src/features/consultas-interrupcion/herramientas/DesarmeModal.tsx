import { useState } from "react";
import {
  actionBtnCls,
  ListBox,
  MOD_FIELD_CLS,
  Modal,
  ModalCheckbox,
  modalNeutralBtnCls,
  modalPrimaryBtnCls,
  ModalRadio,
} from "@/components/ui";

// ─── Modal: Desarmes ────────────────────────────────────────────────────────
export default function DesarmeModal({
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
