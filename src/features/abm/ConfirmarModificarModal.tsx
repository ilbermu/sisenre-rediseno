import { useEffect } from "react";
import { Modal, modalNeutralBtnCls, modalPrimaryBtnCls } from "@/components/ui";
import RevisarCambiosContent, { useMotivoCambio } from "@/features/abm/RevisarCambiosContent";

// ─── Modal: Confirmar modificación ─────────────────────────────────────────
// Layout split del ABM. El contenido (Resumen de cambios + Motivo) vive en
// RevisarCambiosContent, compartido con el paso 2 del modal de edición de
// registro del layout barra.
export default function ConfirmarModificarModal({
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
  const motivo = useMotivoCambio();

  // Reset cada vez que se abre — para que la próxima vez no arranque con la
  // nota de la edición anterior ya seleccionada.
  useEffect(() => {
    if (open) motivo.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            onClick={() => onConfirmar(motivo.notaFinal)}
            disabled={!motivo.notaFinal}
            className={modalPrimaryBtnCls}
          >
            Guardar
          </button>
        </>
      }
    >
      <RevisarCambiosContent cambios={cambios} motivo={motivo} />
    </Modal>
  );
}
