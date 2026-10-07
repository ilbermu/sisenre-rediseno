import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, Users, ClipboardList } from "lucide-react";
import { CodeBadge, FaseIndicador, FOCUS_RING, ICON, ICON_BTN_SM } from "@/components/ui";
import { FaseReposicion } from "@/data/types";
import { useMatchMedia } from "@/lib/useMatchMedia";
import { ABM_TABLE_CONFIGS } from "@/data/abmTables";

// Reposición activa — primer elemento del body del modal "Tablas
// relacionadas", en fondo blanco arriba de UnderlineTabs (antes vivía en
// headerExtra). Barra de contexto de registro (DESIGN_SYSTEM.md, regla 7):
// identifica la reposición de CDS4 a la que pertenecen todos los tabs de
// abajo. Contenedor único, estilo "latest commit": "Reposición {n}" en
// semibold + CodeBadge CDS4 (el tag de CardHeader) + metadatos como texto
// plano separados por "·" (el separador del `context` de CardHeader),
// valores text y labels/unidades text-muted; sin chips adentro salvo
// FaseIndicador (estado de solo lectura). Botón "Copiar datos de la
// reposición" al final del grupo izquierdo, paginador ‹ › a la derecha.
//
// Destello: useMatchMedia sigue prefers-reduced-motion en vivo — con
// reduce-motion activo, directamente no destella. prevNroRef guarda la
// última reposición mostrada para detectar un cambio REAL — no el montaje
// inicial: este bloque vive dentro del modal (Modal directamente no
// renderiza nada si `open` es false), así que un cambio de interrupción
// con el modal cerrado nunca lo deja "premontado" — al reabrir, este
// componente vuelve a montar de cero y prevNroRef arranca ya en el valor
// actual, sin comparación previa que dispare un destello espurio. El
// timeout se limpia tanto al re-disparar como al desmontar. El destello
// se aplica al contenedor entero (datos + botón copiar + paginador).
export default function FaseReposicionFicha({
  fila,
  reposicionIndex,
  totalReposiciones,
  onChangeReposicion,
}: {
  fila: FaseReposicion;
  reposicionIndex: number;
  totalReposiciones: number;
  onChangeReposicion: (next: number) => void;
}) {
  const reduceMotion = useMatchMedia("(prefers-reduced-motion: reduce)");
  const [flash, setFlash] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevNroRef = useRef(fila.nro);

  useEffect(() => {
    const prevNro = prevNroRef.current;
    prevNroRef.current = fila.nro;
    if (prevNro === fila.nro || reduceMotion) return;
    setFlash(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setFlash(false), 250);
  }, [fila.nro, reduceMotion]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Botón sin comportamiento todavía — solo el icono/estilo/aria están
  // definidos. No simula feedback de "copiado": como no copia nada de
  // verdad, mostrar un check acá sería mentirle al usuario.
  // TODO: definir contenido y formato del copiado (pendiente de definición)
  function handleCopiarDatosReposicion() {}

  const sep = <span className="text-text-faint">·</span>;
  return (
    // Wrapper px-5 py-3 (el de antes: mismo margen horizontal que el resto
    // del modal y misma separación con los tabs) + contenedor único con
    // borde/radio de card y fondo blanco — el destello pinta este
    // contenedor. Sin cajas adentro salvo los badges de Fase (estado de
    // solo lectura). La navegación va self-start: con el grupo izquierdo
    // en wrap queda anclada arriba a la derecha.
    <div aria-live="polite" className="px-5 py-3 shrink-0">
      <div
        className={`border border-border rounded-md px-4 py-2.5 flex items-center gap-3 transition-colors duration-(--duration-slow) ${flash ? "bg-primary-tint" : "bg-surface"}`}
      >
      <div className="flex items-center flex-wrap gap-x-2 gap-y-1 min-w-0 text-body-sm">
        <span className="font-semibold text-text whitespace-nowrap">Reposición {fila.nro}</span>
        <CodeBadge code={ABM_TABLE_CONFIGS.cds4.nombre} />
        {sep}
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <span className="text-icon"><Clock size={ICON.sm} strokeWidth={1.5} /></span>
          <span className="text-text tabular-nums">{fila.horaRep}</span>
        </span>
        {sep}
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <span className="text-text-muted">Fase</span>
          <FaseIndicador fase={fila.fase} />
        </span>
        {sep}
        <span className="inline-flex items-center gap-1.5 min-w-0">
          <span className="text-code font-mono text-text">{fila.equipoCodigo}</span>
          <span className="text-text-muted truncate max-w-[220px]" title={fila.equipoDesc}>
            {fila.equipoDesc}
          </span>
        </span>
        {sep}
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <span className="text-icon"><Users size={ICON.sm} strokeWidth={1.5} /></span>
          <span className="text-text font-medium tabular-nums">{fila.usuariosBT}</span>
          <span className="text-text-muted">usuarios BT</span>
        </span>
        {/* Sin borde en reposo, hover secundario de la app. Hoy no copia
            nada (handler vacío, ver TODO arriba) y por eso tampoco tiene
            feedback de "copiado" — se conserva tal cual. */}
        <button
          type="button"
          onClick={handleCopiarDatosReposicion}
          aria-label="Copiar datos de la reposición"
          title="Copiar datos de la reposición"
          className={`${ICON_BTN_SM} flex items-center justify-center rounded-sm border border-transparent text-icon hover:bg-primary-tint hover:border-primary hover:text-secondary ${FOCUS_RING} transition-colors shrink-0`}
        >
          <ClipboardList size={ICON.sm} strokeWidth={1.5} />
        </button>
      </div>
      {totalReposiciones > 1 && (
        <div className="ml-auto self-start shrink-0 flex items-center gap-1">
          <span className="text-caption text-text-muted tabular-nums mr-1">
            <span className="font-semibold text-text">{reposicionIndex + 1}</span> de {totalReposiciones}
          </span>
          <button
            type="button"
            onClick={() => onChangeReposicion(reposicionIndex - 1)}
            disabled={reposicionIndex <= 0}
            aria-label="Reposición anterior"
            className={`${ICON_BTN_SM} flex items-center justify-center rounded-sm text-icon hover:bg-fill-muted hover:text-text transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none`}
          >
            <ChevronLeft size={ICON.sm} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => onChangeReposicion(reposicionIndex + 1)}
            disabled={reposicionIndex >= totalReposiciones - 1}
            aria-label="Reposición siguiente"
            className={`${ICON_BTN_SM} flex items-center justify-center rounded-sm text-icon hover:bg-fill-muted hover:text-text transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none`}
          >
            <ChevronRight size={ICON.sm} strokeWidth={1.5} />
          </button>
        </div>
      )}
      </div>
    </div>
  );
}
