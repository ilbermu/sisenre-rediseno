import { Modal, modalNeutralBtnCls, modalPrimaryBtnCls, ReadOnlyField } from "@/components/ui";
import { ReclamosInterrupcion } from "@/data/types";
import { ReclamosTimeline } from "@/features/consultas-interrupcion/ReclamosTimeline";

const DATOS_INTERRUPCION_COLUMNS: { label: string; value: string }[][] = [
  [
    { label: "Repos", value: "1" },
    { label: "Usu_BT", value: "0" },
    { label: "Usu_MT", value: "0" },
    { label: "Pot Cont", value: "0" },
    { label: "CT", value: "0" },
    { label: "CT en 0", value: "0" },
    { label: "Usu BT CT", value: "0" },
    { label: "Rec", value: "0" },
    { label: "Reit", value: "0" },
    { label: "Rec ENRE", value: "0" },
  ],
  [
    { label: "Rec ATF", value: "0" },
    { label: "Rec ATP", value: "0" },
    { label: "Rec MTF", value: "0" },
    { label: "Rec MTP", value: "0" },
    { label: "Rec BTF", value: "0" },
    { label: "Rec BTP", value: "0" },
    { label: "Rec Otros", value: "0" },
    { label: "Hue Ini", value: "" },
    { label: "Max Fin", value: "" },
    { label: "Hue Fin", value: "" },
  ],
  [
    { label: "Hue Rec 180", value: "" },
    { label: "Rec 12", value: "0" },
    { label: "Rec AU", value: "0" },
    { label: "Hue Ini SR", value: "" },
    { label: "Max Med SR", value: "" },
    { label: "Hue Fin SR", value: "" },
    { label: "Hue Rec 180 SR", value: "" },
    { label: "Rec 12 SR", value: "0" },
    { label: "Rec Au SR", value: "0" },
    { label: "Cli T9", value: "0" },
  ],
  [
    { label: "T9 T3 MT", value: "0" },
    { label: "T9 T3 BT", value: "0" },
    { label: "Cli T9 no T3", value: "0" },
    { label: "Cli T9 AP", value: "0" },
    { label: "Dura Max", value: "" },
    { label: "Cli Int", value: "0" },
    { label: "Cli Min", value: "0" },
  ],
  [
    { label: "SAIFI", value: "0.00" },
    { label: "SAIDI", value: "0.00" },
    { label: "Energ no Suminist", value: "0" },
    { label: "Marginal", value: "0" },
    { label: "Marginal Aj", value: "0" },
  ],
];

export function DatosInterrupcionModal({
  open,
  onClose,
  referencia,
  fechaInicio,
  fechaUltRepo,
  reclamos,
}: {
  open: boolean;
  onClose: () => void;
  referencia: string;
  fechaInicio: string;
  fechaUltRepo: string;
  // Misma data que el gráfico de reclamos de la Card B (null = sin selección).
  reclamos: ReclamosInterrupcion | null;
}) {
  const topFields = [
    { label: "Interrupción", value: referencia },
    { label: "Fecha inicio", value: fechaInicio },
    { label: "Fecha ult. repo.", value: fechaUltRepo },
    { label: "Inicio del proceso", value: fechaInicio },
    { label: "Fin del proceso", value: fechaUltRepo },
    { label: "Usuario del proceso", value: "RDELLAMAGIORA" },
  ];

  return (
    <Modal
      title="Datos de la interrupción"
      subtitle={referencia}
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
      <div className="flex flex-col gap-5">
        {/* Gráfico de reclamos — el mismo ReclamosTimeline de la Card B,
            ampliado, siempre visible arriba de la grilla de campos. */}
        {reclamos && <ReclamosTimeline datos={reclamos} />}
        <div className="grid grid-cols-6 gap-3">
          {topFields.map((f) => (
            <ReadOnlyField key={f.label} label={f.label} value={f.value} />
          ))}
        </div>

        <div className="grid grid-cols-5 gap-4">
          {DATOS_INTERRUPCION_COLUMNS.map((col, ci) => (
            <div key={ci} className="flex flex-col gap-2.5">
              {col.map((f) => (
                <ReadOnlyField key={f.label} label={f.label} value={f.value} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
