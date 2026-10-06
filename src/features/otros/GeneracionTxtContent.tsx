import { useState } from "react";
import { CardHeader, modalPrimaryBtnCls, ValuePicker } from "@/components/ui";
import { ABM_ITEMS } from "@/data/dominio";

// ─── Generación de txt ──────────────────────────────────────────────────────

export default function GeneracionTxtContent() {
  const [tabla, setTabla] = useState("");

  function handleExportar() {
    // mock: sin backend real conectado todavía (mismo alcance que Borrar/Guardar)
  }

  return (
    <div className="flex-1 overflow-y-auto px-10 py-10">
      <div className="bg-surface rounded-lg border border-border" style={{ maxWidth: 640 }}>
        <CardHeader title="Exportación" />
        <div className="p-6 flex items-end gap-3">
          <div className="flex-1 min-w-0" style={{ maxWidth: 320 }}>
            <ValuePicker
              label="Tabla a exportar"
              value={tabla}
              onChange={setTabla}
              opts={ABM_ITEMS.map((item) => ({ value: item.screen as string, label: item.label }))}
              placeholder="Seleccioná tabla a exportar"
            />
          </div>
          <button type="button" disabled={!tabla} onClick={handleExportar} className={modalPrimaryBtnCls}>
            Exportar
          </button>
        </div>
      </div>
    </div>
  );
}
