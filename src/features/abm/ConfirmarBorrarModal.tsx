import { Modal, modalDestructiveBtnCls, modalNeutralBtnCls } from "@/components/ui";

// ─── Modal: Confirmar borrado ───────────────────────────────────────────────
// Confirmación antes de eliminar uno o varios registros de una tabla ABM —
// mismo Modal compartido, tamaño "sm". Botón primario en color de error (no
// el azul de acciones normales) con el verbo de la acción ("Eliminar"),
// nunca "Sí/No" — así el compromiso queda claro sin releer la pregunta.
// Acepta N registros y pluraliza: con uno, "Se eliminará el registro X de
// Tabla N"; con varios, "Vas a borrar N registros de Tabla N", listando los
// códigos si son 5 o menos.
const MAX_CODIGOS_LISTADOS = 5;

export default function ConfirmarBorrarModal({
  open,
  registros,
  tabla,
  onCancelar,
  onConfirmar,
}: {
  open: boolean;
  // Código (campoId) de cada registro a borrar.
  registros: string[];
  // Nomenclatura de la tabla ABM activa tal como la conoce el usuario
  // ("Tabla 2".."Tabla 9 NM", ver ABM_ITEMS) — no el nombre descriptivo de
  // config.titulo ("Interrupciones", etc.), que es una etiqueta interna.
  tabla: string;
  onCancelar: () => void;
  onConfirmar: () => void;
}) {
  const n = registros.length;
  const codigoCls = "text-code font-medium text-text tabular-nums font-mono";
  return (
    <Modal
      title={n > 1 ? `¿Eliminar ${n} registros?` : "¿Eliminar el registro?"}
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
      {n > 1 ? (
        <div className="text-body text-text">
          <p>
            Vas a borrar <span className="font-medium">{n} registros</span> de <span className="font-medium">{tabla}</span>.
            Esta acción no se puede deshacer.
          </p>
          {n <= MAX_CODIGOS_LISTADOS && (
            <ul className="mt-3 flex flex-col gap-1">
              {registros.map((r) => (
                <li key={r} className={codigoCls}>{r}</li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <p className="text-body text-text">
          Se eliminará el registro <span className={codigoCls}>{registros[0] ?? ""}</span> de{" "}
          <span className="font-medium text-text">{tabla}</span>. Esta acción no se puede deshacer.
        </p>
      )}
    </Modal>
  );
}
