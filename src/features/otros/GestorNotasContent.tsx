import { useState } from "react";
import { ChevronDown, Pencil, Inbox, ChevronsUp, ChevronsDown } from "lucide-react";
import {
  BTN_SM,
  CardHeader,
  FieldLabel,
  ICON,
  ICON_BTN_SM,
  MOD_FIELD_CLS,
  MOD_SELECT_CLS,
  Modal,
  modalNeutralBtnCls,
  modalPrimaryBtnCls,
  SelectWrap,
} from "@/components/ui";
import { NOTAS_INICIALES } from "@/data/mocks";

// ─── Gestor de notas ────────────────────────────────────────────────────────

export function GestorNotasContent() {
  const [notas, setNotas] = useState(NOTAS_INICIALES);
  const [filtro, setFiltro] = useState("");
  const [seleccionada, setSeleccionada] = useState<string | null>(null);
  const [porPagina, setPorPagina] = useState(10);
  const [pagina, setPagina] = useState(1);
  const [modalAbierto, setModalAbierto] = useState<string | null>(null); // "nueva" o el id a editar
  const [textoModal, setTextoModal] = useState("");

  const ordenadas = [...notas].sort((a, b) => a.posicion - b.posicion);
  const filtradas = filtro ? ordenadas.filter((n) => n.texto.toLowerCase().includes(filtro.toLowerCase())) : ordenadas;
  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / porPagina));
  const paginaSegura = Math.min(pagina, totalPaginas);
  const visibles = filtradas.slice((paginaSegura - 1) * porPagina, paginaSegura * porPagina);

  function mover(id: string, direccion: "top" | "up" | "down" | "bottom") {
    const orden = [...notas].sort((a, b) => a.posicion - b.posicion);
    const idx = orden.findIndex((n) => n.id === id);
    if (idx === -1) return;
    const [item] = orden.splice(idx, 1);
    if (direccion === "top") orden.unshift(item);
    else if (direccion === "bottom") orden.push(item);
    else if (direccion === "up") orden.splice(Math.max(0, idx - 1), 0, item);
    else orden.splice(Math.min(orden.length, idx + 1), 0, item);
    setNotas(orden.map((n, i) => ({ ...n, posicion: i + 1 })));
  }

  function abrirNueva() { setTextoModal(""); setModalAbierto("nueva"); }
  function abrirEditar(id: string, texto: string) { setTextoModal(texto); setModalAbierto(id); }
  function guardarModal() {
    const texto = textoModal.trim();
    if (!texto) return;
    if (modalAbierto === "nueva") {
      setNotas((prev) => [...prev, { id: `n${Date.now()}`, texto, posicion: prev.length + 1 }]);
    } else if (modalAbierto) {
      setNotas((prev) => prev.map((n) => (n.id === modalAbierto ? { ...n, texto } : n)));
    }
    setModalAbierto(null);
  }

  return (
    <div className="flex-1 overflow-y-auto px-10 py-10">
      <div className="flex gap-4 items-start" style={{ maxWidth: 900 }}>
        <div className="flex-1 bg-surface rounded-lg border border-border overflow-hidden">
          <CardHeader
            title="Notas"
            padX="px-5"
            actions={
              <button type="button" onClick={abrirNueva} className={modalPrimaryBtnCls}>
                Agregar nota
              </button>
            }
          />
          <div className="p-5">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-fill-subtle border-b border-border">
                  <th className="px-3 py-2 text-left text-heading-xs uppercase text-text-muted">Nota</th>
                  <th className="w-24 px-3 py-2 text-left text-heading-xs uppercase text-text-muted">Posición</th>
                  <th className="w-14 px-2 py-2" />
                </tr>
                <tr className="border-b border-border">
                  <td className="p-1.5">
                    <input
                      value={filtro}
                      onChange={(e) => { setFiltro(e.target.value); setPagina(1); }}
                      placeholder="Buscar nota..."
                      className={MOD_FIELD_CLS}
                    />
                  </td>
                  <td /><td />
                </tr>
              </thead>
              <tbody>
                {visibles.length === 0 ? (
                  <tr><td colSpan={3}>
                    <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
                      <span className="text-text-faint"><Inbox size={ICON.xl} strokeWidth={1.25} /></span>
                      <p className="text-heading-sm text-text-muted">No hay notas</p>
                    </div>
                  </td></tr>
                ) : visibles.map((n) => (
                  <tr
                    key={n.id}
                    onClick={() => setSeleccionada(n.id)}
                    className={`border-b border-border-subtle cursor-pointer transition-colors ${seleccionada === n.id ? "bg-primary-tint" : "hover:bg-fill-muted"}`}
                  >
                    <td className="px-3 py-2.5 text-body text-text">{n.texto}</td>
                    <td className="px-3 py-2.5 text-body text-text-muted tabular-nums">{n.posicion}</td>
                    <td className="px-2 py-2.5">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); abrirEditar(n.id, n.texto); }}
                        className={`${ICON_BTN_SM} flex items-center justify-center rounded-sm text-icon hover:bg-primary-tint hover:text-secondary transition-colors`}
                        title="Editar"
                      >
                        <Pencil size={ICON.md} strokeWidth={1.5} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2 text-body-sm text-text-muted">
                <span>Mostrar</span>
                <SelectWrap>
                  <select
                    value={porPagina}
                    onChange={(e) => { setPorPagina(Number(e.target.value)); setPagina(1); }}
                    className={MOD_SELECT_CLS}
                  >
                    {[10, 25, 50].map((n) => <option key={n} value={n}>{n} registros</option>)}
                  </select>
                </SelectWrap>
              </div>
              <div className="flex items-center gap-3 text-body-sm text-text-muted">
                <button disabled={paginaSegura <= 1} onClick={() => setPagina((p) => p - 1)} className={`${BTN_SM} border border-border-strong bg-surface disabled:opacity-40`}>Anterior</button>
                <span>Pág. <span className="font-medium text-text">{paginaSegura}</span> de <span className="font-medium text-text">{totalPaginas}</span></span>
                <button disabled={paginaSegura >= totalPaginas} onClick={() => setPagina((p) => p + 1)} className={`${BTN_SM} border border-border-strong bg-surface disabled:opacity-40`}>Siguiente</button>
              </div>
            </div>
          </div>
        </div>

        {/* Reordenar — actúa sobre la fila seleccionada de la tabla (click en la fila) */}
        <div className="flex flex-col gap-1.5 pt-14 shrink-0">
          {([
            { dir: "top" as const, icon: <ChevronsUp size={ICON.sm} strokeWidth={1.5} />, title: "Mover al principio" },
            { dir: "up" as const, icon: <span className="inline-flex rotate-180"><ChevronDown size={ICON.md} strokeWidth={1.5} /></span>, title: "Subir" },
            { dir: "down" as const, icon: <ChevronDown size={ICON.md} strokeWidth={1.5} />, title: "Bajar" },
            { dir: "bottom" as const, icon: <ChevronsDown size={ICON.sm} strokeWidth={1.5} />, title: "Mover al final" },
          ]).map((b) => (
            <button
              key={b.dir}
              type="button"
              title={b.title}
              disabled={!seleccionada}
              onClick={() => seleccionada && mover(seleccionada, b.dir)}
              className={`${ICON_BTN_SM} flex items-center justify-center rounded-sm border border-border-strong bg-surface text-icon hover:bg-primary-tint hover:border-primary hover:text-secondary disabled:opacity-30 disabled:pointer-events-none transition-colors`}
            >
              {b.icon}
            </button>
          ))}
        </div>
      </div>

      <Modal
        title={modalAbierto === "nueva" ? "Agregar nota" : "Editar nota"}
        open={modalAbierto !== null}
        onClose={() => setModalAbierto(null)}
        size="sm"
        footer={
          <>
            <button type="button" onClick={() => setModalAbierto(null)} className={modalNeutralBtnCls}>Cancelar</button>
            <button type="button" disabled={!textoModal.trim()} onClick={guardarModal} className={modalPrimaryBtnCls}>Guardar</button>
          </>
        }
      >
        <FieldLabel>Nota</FieldLabel>
        <input value={textoModal} onChange={(e) => setTextoModal(e.target.value.toUpperCase())} className={MOD_FIELD_CLS} placeholder="Ej. DATOS INCOMPLETOS/ INCORRECTOS" autoFocus />
      </Modal>
    </div>
  );
}
