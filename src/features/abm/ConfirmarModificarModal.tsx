import { useState, useEffect } from "react";
import {
  ButtonSelectGroup,
  FIELD_FOCUS,
  Modal,
  modalNeutralBtnCls,
  modalPrimaryBtnCls,
} from "@/components/ui";
import { NOTA_OPCIONES } from "@/data/dominio";

// ─── Modal: Confirmar modificación ─────────────────────────────────────────
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
  const [nota, setNota] = useState("");
  const [notaManual, setNotaManual] = useState("");
  const esManual = nota === "__manual__";
  const notaFinal = (esManual ? notaManual : nota).trim();
  const seleccionBoton = esManual ? "Otra (especificar)" : nota;

  // Reset cada vez que se abre — para que la próxima vez no arranque con la
  // nota de la edición anterior ya seleccionada.
  useEffect(() => {
    if (open) { setNota(""); setNotaManual(""); }
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
            onClick={() => onConfirmar(notaFinal)}
            disabled={!notaFinal}
            className={modalPrimaryBtnCls}
          >
            Guardar
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-heading-xs uppercase text-text-muted mb-3">Resumen de cambios</p>
          {cambios.length === 0 ? (
            <p className="text-body-sm text-text-muted">No se detectaron cambios respecto al registro original.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {cambios.map((c) => (
                <div key={c.label} className="flex items-center gap-3 px-3 py-2 rounded-sm bg-fill-subtle border border-border">
                  <span className="w-[38%] shrink-0 text-label text-text">{c.label}</span>
                  <span className="flex-1 min-w-0 text-body-sm text-text-muted line-through truncate">{c.anterior || "(vacío)"}</span>
                  <span className="shrink-0 text-text-faint">→</span>
                  <span className="flex-1 min-w-0 text-label text-text truncate">{c.nuevo || "(vacío)"}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-md border border-primary bg-primary-tint p-4">
          <p className="text-heading-xs uppercase text-secondary mb-1">Motivo</p>
          <p className="text-body-sm text-text-muted mb-3">
            Seleccioná una nota o ingresá una manual para justificar este cambio.
          </p>
          <ButtonSelectGroup
            options={NOTA_OPCIONES}
            selected={seleccionBoton ? [seleccionBoton] : []}
            onToggle={(opt) => setNota(opt === "Otra (especificar)" ? "__manual__" : opt)}
          />
          {esManual && (
            <input
              autoFocus
              value={notaManual}
              onChange={(e) => setNotaManual(e.target.value)}
              placeholder="Escribí el motivo de la modificación"
              className={`mt-2 w-full h-(--control-md) px-2.5 text-body bg-surface border border-border-strong rounded-sm text-text placeholder:text-text-muted ${FIELD_FOCUS}`}
            />
          )}
        </div>
      </div>
    </Modal>
  );
}
