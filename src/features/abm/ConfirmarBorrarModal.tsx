import { Modal, modalDestructiveBtnCls, modalNeutralBtnCls } from "@/components/ui";

// ─── Modal: Confirmar borrado ───────────────────────────────────────────────
// Confirmación antes de eliminar un registro de una tabla ABM — mismo Modal
// compartido, tamaño "sm". Botón primario en color de error (no el azul de
// acciones normales) con el verbo de la acción ("Eliminar"), nunca "Sí/No" —
// así el compromiso queda claro sin releer la pregunta.
export default function ConfirmarBorrarModal({
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
