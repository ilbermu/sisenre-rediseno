import { useState } from "react";
import { ButtonSelectGroup, FIELD_FOCUS } from "@/components/ui";
import { NOTA_OPCIONES } from "@/data/dominio";

// Estado del motivo de una modificación (nota predefinida u "Otra
// (especificar)" con texto manual). `notaFinal` vacío = motivo inválido
// (Guardar deshabilitado). `reset` lo vuelve al estado inicial.
export function useMotivoCambio() {
  const [nota, setNota] = useState("");
  const [notaManual, setNotaManual] = useState("");
  const esManual = nota === "__manual__";
  const notaFinal = (esManual ? notaManual : nota).trim();
  return {
    nota,
    setNota,
    notaManual,
    setNotaManual,
    esManual,
    notaFinal,
    reset: () => {
      setNota("");
      setNotaManual("");
    },
  };
}

// Contenido de "revisar cambios" — Resumen de cambios (anterior → nuevo) +
// Motivo (NOTA_OPCIONES u "Otra (especificar)"). Sin modal propio: lo usan
// ConfirmarModificarModal (layout split del ABM) y el paso 2 del modal de
// edición de registro (layout barra), con el mismo aspecto.
export default function RevisarCambiosContent({
  cambios,
  motivo,
}: {
  cambios: { label: string; anterior: string; nuevo: string }[];
  motivo: ReturnType<typeof useMotivoCambio>;
}) {
  const seleccionBoton = motivo.esManual ? "Otra (especificar)" : motivo.nota;
  return (
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
          onToggle={(opt) => motivo.setNota(opt === "Otra (especificar)" ? "__manual__" : opt)}
        />
        {motivo.esManual && (
          <input
            autoFocus
            value={motivo.notaManual}
            onChange={(e) => motivo.setNotaManual(e.target.value)}
            placeholder="Escribí el motivo de la modificación"
            className={`mt-2 w-full h-(--control-md) px-2.5 text-body bg-surface border border-border-strong rounded-sm text-text placeholder:text-text-muted ${FIELD_FOCUS}`}
          />
        )}
      </div>
    </div>
  );
}
