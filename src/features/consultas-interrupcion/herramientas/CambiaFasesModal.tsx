import { useState } from "react";
import { ICON_BTN_XS, Modal, modalNeutralBtnCls } from "@/components/ui";
import { CAMBIA_FASES_ROWS_INIT } from "@/data/mocks";

// ─── Modal: Cambia fases ────────────────────────────────────────────────────
export default function CambiaFasesModal({
  open,
  onClose,
  referencia,
}: {
  open: boolean;
  onClose: () => void;
  referencia: string;
}) {
  const [rows, setRows] = useState(CAMBIA_FASES_ROWS_INIT);

  function move(i: number, dir: -1 | 1) {
    setRows((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  return (
    <Modal
      title="Cambia fases"
      subtitle={referencia}
      open={open}
      onClose={onClose}
      footer={
        <button type="button" onClick={onClose} className={modalNeutralBtnCls}>
          Salir
        </button>
      }
    >
      <div className="border border-border rounded-md overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-fill-subtle border-b border-border">
              {["Fase", "Fecha", "Id elemento", "Tipo elemento", "Cadena", "Cliente"].map((c) => (
                <th key={c} className="px-4 py-3 text-left text-heading-xs uppercase text-text-muted select-none whitespace-nowrap">
                  {c}
                </th>
              ))}
              <th className="px-3 py-3 w-16" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.idElemento} className="border-b border-border-subtle hover:bg-fill-muted transition-colors">
                <td className="px-4 py-3 text-body text-text tabular-nums">{r.fase}</td>
                <td className="px-4 py-3 text-body text-text whitespace-nowrap">{r.fecha}</td>
                <td className="px-4 py-3 text-code text-text whitespace-nowrap font-mono">
                  {r.idElemento}
                </td>
                <td className="px-4 py-3 text-body text-text whitespace-nowrap">{r.tipoElemento}</td>
                <td className="px-4 py-3 text-code text-text whitespace-nowrap font-mono">
                  {r.cadena}
                </td>
                <td className="px-4 py-3 text-body text-text tabular-nums">{r.cliente}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      className={`${ICON_BTN_XS} flex items-center justify-center rounded-sm text-icon hover:bg-primary-tint hover:text-secondary disabled:opacity-30 disabled:pointer-events-none transition-colors`}
                    >
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                        <path d="M5.5 8.5V2.5M5.5 2.5L2.5 5.5M5.5 2.5l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      disabled={i === rows.length - 1}
                      className={`${ICON_BTN_XS} flex items-center justify-center rounded-sm text-icon hover:bg-primary-tint hover:text-secondary disabled:opacity-30 disabled:pointer-events-none transition-colors`}
                    >
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                        <path d="M5.5 2.5v6M5.5 8.5l-3-3M5.5 8.5l3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
}
