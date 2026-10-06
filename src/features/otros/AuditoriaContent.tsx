import { useState } from "react";
import {
  CardHeader,
  FieldLabel,
  ModalCheckbox,
  modalPrimaryBtnCls,
  ValuePicker,
} from "@/components/ui";
import { ABM_ITEMS } from "@/data/dominio";
import { USUARIOS_SISENRE_DEMO } from "@/data/mocks";
import { AbmTableKey } from "@/data/types";

// ─── Reporte de auditoría ───────────────────────────────────────────────────

export function AuditoriaContent() {
  const [usuario, setUsuario] = useState("");
  const [tablasSel, setTablasSel] = useState<Set<AbmTableKey>>(new Set());

  function toggleTabla(k: AbmTableKey) {
    setTablasSel((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k); else next.add(k);
      return next;
    });
  }

  function handleExportar() {
    // mock: sin backend real conectado todavía
  }

  return (
    <div className="flex-1 overflow-y-auto px-10 py-10">
      <div className="bg-surface rounded-lg border border-border" style={{ maxWidth: 720 }}>
        <CardHeader title="Filtros" padX="px-6" />
        <div className="p-6 grid grid-cols-2 gap-6">
          <div>
            <ValuePicker
              label="Seleccioná usuario"
              opts={USUARIOS_SISENRE_DEMO}
              value={usuario}
              onChange={setUsuario}
              searchable
            />
          </div>
          <div>
            <FieldLabel>Seleccioná tablas</FieldLabel>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {ABM_ITEMS.map((item) => (
                <ModalCheckbox
                  key={item.key ?? item.code + item.label}
                  label={item.label}
                  checked={item.screen ? tablasSel.has(item.screen as AbmTableKey) : false}
                  onChange={() => item.screen && toggleTabla(item.screen as AbmTableKey)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end px-6 pb-6">
          <button
            type="button"
            disabled={!usuario || tablasSel.size === 0}
            onClick={handleExportar}
            className={modalPrimaryBtnCls}
          >
            Exportar
          </button>
        </div>
      </div>
    </div>
  );
}
