import { useState } from "react";
import {
  actionBtnCls,
  FieldLabel,
  ListBox,
  MOD_FIELD_CLS,
  Modal,
  ModalCheckbox,
  modalNeutralBtnCls,
  modalPrimaryBtnCls,
  ModalRadio,
  ValuePicker,
} from "@/components/ui";

// ─── Modal: Lotes ───────────────────────────────────────────────────────────
// "extra" marca las opciones que traen un control adicional inline (select,
// sub-radios o checkbox) en la captura de referencia de ese Tipo.
type LotesOpcion = { label: string; extra?: "codigoFalla" | "causaAlta" | "conservaCausa" };
type LotesTipo = { key: string; opciones: LotesOpcion[]; desc: string; columns?: 2 };

const LOTES_TIPOS: LotesTipo[] = [
  {
    key: "0",
    desc: "Tipo 0 - Sin datos requeridos",
    opciones: [
      { label: "Elimina CT en 0 (excluye interrupciones)" },
      { label: "Completar con RST en T2/T4 (excluye interrupciones)" },
      { label: "Pasar texto a mayúscula (excluye interrupciones)" },
      { label: "Buscar CT por acometida en T10 Sem" },
      { label: "Nivelación automática" },
      { label: "Completa cadenas vacías en T9" },
      { label: "Carga potencia de CTs en 0" },
    ],
  },
  {
    key: "1",
    desc: "Tipo 1 - REF",
    opciones: [
      { label: "Borra interrupción" },
      { label: "Coincidir fecha 1er reclamo" },
      { label: "Cambiar código de falla", extra: "codigoFalla" },
      { label: "Dividir interrupción" },
      { label: "Cambiar tipo" },
      { label: "Baja clientes sin reclamos" },
      { label: "Alta clientes por cercanía de reclamo" },
      { label: "Cambia a NCBT las interrupciones" },
    ],
  },
  {
    key: "2",
    desc: "Tipo 2 - Póliza/Tarifa",
    opciones: [{ label: "Asignar tarifa" }, { label: "Borrar pólizas" }],
  },
  {
    key: "3",
    desc: "Tipo 3 - REF/F/Fecha",
    opciones: [{ label: "Modificar horario de interrupción / F" }],
  },
  {
    key: "4",
    desc: "Tipo 4 - REF/F/Cuenta",
    opciones: [{ label: "Baja clientes en T9" }, { label: "Alta clientes en T9" }],
  },
  {
    key: "5",
    desc: "Tipo 5 - REF/F",
    opciones: [
      { label: "Alta en T3", extra: "causaAlta" },
      { label: "Copia en T4 datos de T2" },
      { label: "Elimina registros en T3" },
      { label: "Elimina duplicados en T3" },
      { label: "Elimina causa <= 3 a minutos en T3" },
      { label: "Elimina causa INSTALACION CLIENTE en T3" },
    ],
  },
  {
    key: "6",
    desc: "Tipo 6 - REF/REF o Reclamo/REF",
    opciones: [
      { label: "Pasaje de reclamos", extra: "conservaCausa" },
      { label: "Renombrar interrupciones" },
    ],
  },
  {
    key: "7",
    desc: "Tipo 7 - REF/Null/Texto",
    columns: 2,
    opciones: [
      { label: "Completa id_elem en T2" },
      { label: "Cambia tipo elemento T2" },
      { label: "Completar CMTBT en T2" },
      { label: "Completa alim en T2" },
      { label: "Completa ssee en T2" },
      { label: "Completa id_elem en T4" },
      { label: "Cambia tipo elemento T4" },
      { label: "Completar CMTBT en T4" },
      { label: "Completa alim en T4" },
      { label: "Completa ssee en T4" },
    ],
  },
  {
    key: "8",
    desc: "Tipo 8 - REF/F/Cadena",
    opciones: [{ label: "Inserta registros en T5" }, { label: "Elimina registros en T5" }],
  },
];

export default function LotesModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [fileName, setFileName] = useState("No se eligió ningún archivo");
  const [activeTipo, setActiveTipo] = useState("0");
  const [selectedOpcion, setSelectedOpcion] = useState<string | null>(null);
  const [causaAlta, setCausaAlta] = useState<"3min" | "instalacion" | null>(null);
  const [conservaCausa, setConservaCausa] = useState(false);
  const tipoData = LOTES_TIPOS.find((t) => t.key === activeTipo)!;

  return (
    <Modal
      title="Lotes"
      open={open}
      onClose={onClose}
      size="xl"
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
      <div className="grid grid-cols-2 gap-6">
        {/* Izquierda: archivo + porcentajes */}
        <div className="flex flex-col gap-4">
          <div className="border border-border rounded-md overflow-hidden" style={{ height: 160 }}>
            <div className="grid grid-cols-3 bg-fill-subtle rounded-t-md border-b border-border">
              {["Campo 1", "Campo 2", "Campo 3"].map((c) => (
                <div key={c} className="px-3 py-2 text-heading-xs uppercase text-text-muted">
                  {c}
                </div>
              ))}
            </div>
            <div className="h-full overflow-y-auto" />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              id="lotes-file"
              className="hidden"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "No se eligió ningún archivo")}
            />
            <label
              htmlFor="lotes-file"
              className={actionBtnCls("neutral") + " cursor-pointer inline-flex items-center justify-center shrink-0"}
            >
              Elegir archivo
            </label>
            <span className="text-body-sm text-text-muted truncate">{fileName}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Porcentaje 1</FieldLabel>
              <div className="flex items-center gap-2">
                <input defaultValue="10" className={MOD_FIELD_CLS} style={{ width: 60 }} />
                <span className="text-body-sm text-text-muted">Intervalo mayor a 48hs</span>
              </div>
            </div>
            <div>
              <FieldLabel>Distancia del reclamo</FieldLabel>
              <div className="flex items-center gap-2">
                <input defaultValue="100" className={MOD_FIELD_CLS} style={{ width: 60 }} />
                <span className="text-body-sm text-text-muted">Mts.</span>
              </div>
            </div>
            <div>
              <FieldLabel>Porcentaje 2</FieldLabel>
              <div className="flex items-center gap-2">
                <input defaultValue="10" className={MOD_FIELD_CLS} style={{ width: 60 }} />
                <span className="text-body-sm text-text-muted">Intervalo menor a 48hs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Derecha: errores + tipos */}
        <div className="flex flex-col gap-4">
          <ListBox title="Errores" />

          <div>
            <div className="flex items-center gap-1 border-b border-border overflow-x-auto">
              {LOTES_TIPOS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActiveTipo(t.key)}
                  className={`px-3 py-2 text-label border-b-2 transition-colors whitespace-nowrap ${
                    activeTipo === t.key ? "border-primary text-secondary" : "border-transparent text-text-muted hover:text-text"
                  }`}
                >
                  Tipo {t.key}
                </button>
              ))}
            </div>

            <div
              className={`gap-x-8 gap-y-2 py-3 overflow-y-auto ${tipoData.columns === 2 ? "grid grid-cols-2 grid-rows-5 grid-flow-col" : "flex flex-col"}`}
              style={{ height: 220 }}
            >
              {tipoData.opciones.map((op) => (
                <div key={op.label} className="flex items-center gap-4 flex-wrap">
                  <ModalRadio
                    name="lotes-opcion"
                    label={op.label}
                    checked={selectedOpcion === op.label}
                    onSelect={() => setSelectedOpcion(op.label)}
                  />
                  {/* Sin más opciones que el placeholder — siempre muestra
                      "Seleccioná código" (mismo criterio que AbmCampo: sin
                      value real, el trigger queda fijo en text-muted). */}
                  {op.extra === "codigoFalla" && (
                    <ValuePicker opts={[]} placeholder="Seleccioná código" wrapClassName="w-44" />
                  )}
                  {op.extra === "causaAlta" && (
                    <div role="radiogroup" aria-label="Causa de alta" className="flex items-center gap-4">
                      <ModalRadio name="lotes-causa-alta" label="<= 3 minutos" checked={causaAlta === "3min"} onSelect={() => setCausaAlta("3min")} />
                      <ModalRadio
                        name="lotes-causa-alta"
                        label="Instalación cliente"
                        checked={causaAlta === "instalacion"}
                        onSelect={() => setCausaAlta("instalacion")}
                      />
                    </div>
                  )}
                  {op.extra === "conservaCausa" && (
                    <ModalCheckbox label="Conserva la misma causa" checked={conservaCausa} onChange={setConservaCausa} />
                  )}
                </div>
              ))}
            </div>

            <div className="w-full h-(--control-md) px-2.5 flex items-center text-body-sm bg-fill-muted border border-border rounded-sm text-text-muted select-none">
              {tipoData.desc}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
