import { Modal, modalNeutralBtnCls } from "@/components/ui";
import { ReclamosInterrupcion } from "@/data/types";
import ReclamosTimeline from "@/features/consultas-interrupcion/ReclamosTimeline";

// Modal "Reclamos de la interrupción": abre "Ver reclamos" de la hoja de
// Consulta de interrupciones. Solo la línea de tiempo de reclamos
// (ReclamosTimeline) de la interrupción seleccionada, ampliada. No es
// "Datos de la interrupción" (DatosInterrupcionModal: datos generales y
// "Procesar"), que ya no se abre desde esta pantalla.
export default function ReclamosModal({
  open,
  onClose,
  referencia,
  reclamos,
}: {
  open: boolean;
  onClose: () => void;
  referencia: string;
  reclamos: ReclamosInterrupcion | null;
}) {
  return (
    <Modal
      title="Reclamos de la interrupción"
      subtitle={referencia}
      open={open}
      onClose={onClose}
      size="xl"
      footer={
        <button type="button" onClick={onClose} className={modalNeutralBtnCls}>
          Cerrar
        </button>
      }
    >
      <ReclamosTimeline datos={reclamos} />
    </Modal>
  );
}
