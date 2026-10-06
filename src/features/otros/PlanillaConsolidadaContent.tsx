import { useState } from "react";
import {
  CardHeader,
  ESTADO_CLASES,
  FieldLabel,
  MOD_FIELD_CLS,
  Modal,
  modalNeutralBtnCls,
  modalPrimaryBtnCls,
} from "@/components/ui";
import { crearRng, hashSemilla } from "@/data/rng";
import { generarConsolidacionSintetica } from "@/data/sinteticos";
import { formatFechaHora } from "@/lib/format";

// ─── Planilla consolidada ───────────────────────────────────────────────────

export default function PlanillaConsolidadaContent() {
  const [datos, setDatos] = useState(() => generarConsolidacionSintetica(crearRng(hashSemilla("planilla-consolidada"))));
  const [fechaProceso, setFechaProceso] = useState("12/08/2026 09:19");
  const [usuarioProceso] = useState("Rdellamagiora");
  const [procesando, setProcesando] = useState(false);
  const [progresoAbierto, setProgresoAbierto] = useState(false);

  function handleProcesar() {
    setProcesando(true);
    setTimeout(() => {
      setDatos(generarConsolidacionSintetica(crearRng(Date.now())));
      setFechaProceso(formatFechaHora(new Date()));
      setProcesando(false);
    }, 900);
  }

  function handleGenerarCsv() {
    const filas: [string, string][] = [
      ["Fecha último proceso", fechaProceso],
      ["Usuario último proceso", usuarioProceso],
      ["Reclamos", String(datos.reclamos)],
      ["Reiteraciones", String(datos.reiteraciones)],
      ["SAIDI", datos.saidi],
      ["SAIFI", datos.saifi],
      ["Máxima duración — Interrupción", datos.maxDuracionRef],
      ["Máxima duración — Valor", String(datos.maxDuracionValor)],
      ["Máximo marginal ajustado — Interrupción", datos.maxMarginalRef],
      ["Máximo marginal ajustado — Valor", datos.maxMarginalValor],
    ];
    const csv = filas.map((f) => f.join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `planilla_consolidada_${fechaProceso.replace(/[/: ]/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex-1 overflow-y-auto px-10 py-10">
      <div className="bg-surface rounded-lg border border-border" style={{ maxWidth: 760 }}>
        <CardHeader title="Consolidación" />
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div><FieldLabel>Fecha último proceso</FieldLabel><input readOnly value={fechaProceso} className={MOD_FIELD_CLS + ESTADO_CLASES.disabled} /></div>
            <div><FieldLabel>Usuario último proceso</FieldLabel><input readOnly value={usuarioProceso} className={MOD_FIELD_CLS + ESTADO_CLASES.disabled} /></div>
            <div><FieldLabel>Reclamos</FieldLabel><input readOnly value={String(datos.reclamos)} className={MOD_FIELD_CLS + ESTADO_CLASES.disabled} /></div>
            <div><FieldLabel>Reiteraciones</FieldLabel><input readOnly value={String(datos.reiteraciones)} className={MOD_FIELD_CLS + ESTADO_CLASES.disabled} /></div>
            <div><FieldLabel>SAIDI</FieldLabel><input readOnly value={datos.saidi} className={MOD_FIELD_CLS + ESTADO_CLASES.disabled} /></div>
            <div><FieldLabel>SAIFI</FieldLabel><input readOnly value={datos.saifi} className={MOD_FIELD_CLS + ESTADO_CLASES.disabled} /></div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <p className="text-heading-xs uppercase text-text-muted mb-1.5">Máxima duración</p>
              <div className="grid grid-cols-2 gap-3">
                <div><FieldLabel>Interrupción</FieldLabel><input readOnly value={datos.maxDuracionRef} className={MOD_FIELD_CLS + ESTADO_CLASES.disabled} /></div>
                <div><FieldLabel>Valor</FieldLabel><input readOnly value={String(datos.maxDuracionValor)} className={MOD_FIELD_CLS + ESTADO_CLASES.disabled} /></div>
              </div>
            </div>
            <div>
              <p className="text-heading-xs uppercase text-text-muted mb-1.5">Máximo marginal ajustado</p>
              <div className="grid grid-cols-2 gap-3">
                <div><FieldLabel>Interrupción</FieldLabel><input readOnly value={datos.maxMarginalRef} className={MOD_FIELD_CLS + ESTADO_CLASES.disabled} /></div>
                <div><FieldLabel>Valor</FieldLabel><input readOnly value={datos.maxMarginalValor} className={MOD_FIELD_CLS + ESTADO_CLASES.disabled} /></div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-border">
            <button type="button" onClick={() => setProgresoAbierto(true)} className={modalNeutralBtnCls}>Ver progreso</button>
            <button type="button" disabled={procesando} onClick={handleProcesar} className={modalPrimaryBtnCls}>
              {procesando ? "Procesando…" : "Procesar"}
            </button>
            <button type="button" onClick={handleGenerarCsv} className={modalPrimaryBtnCls}>Generar CSV</button>
          </div>
        </div>
      </div>

      <Modal
        title="Progreso del proceso"
        open={progresoAbierto}
        onClose={() => setProgresoAbierto(false)}
        size="sm"
        footer={<button type="button" onClick={() => setProgresoAbierto(false)} className={modalNeutralBtnCls}>Cerrar</button>}
      >
        <div className="flex flex-col gap-3">
          {["Recepción de tablas", "Cálculo de indicadores", "Consolidación final"].map((paso, i) => (
            <div key={paso} className="flex items-center gap-2.5">
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white text-caption"
                style={{ backgroundColor: i < 2 ? "var(--color-success)" : "var(--color-neutral-200)" }}
              >
                {i < 2 ? "✓" : ""}
              </span>
              <span className="text-body text-text">{paso}</span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
