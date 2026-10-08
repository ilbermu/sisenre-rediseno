import CopyButton from "@/components/ui/CopyButton";

// Contexto del registro (ver DESIGN_SYSTEM.md, "Header de modal"): el
// header de un modal lleva solo el título y la ✕; si el modal necesita decir
// a qué registro se refiere, ese contexto es el PRIMER bloque del cuerpo:
// etiqueta en text-caption neutral-500, el identificador en mono 18px
// font-medium (con CopyButton si `copiable`) y, debajo, una línea de meta en
// text-caption neutral-600 tabular-nums. El mismo lenguaje que el header de la
// hoja de Consulta de interrupciones.
// `bleed`: para modales con el padding p-5 estándar en el body; el bloque se
// extiende de borde a borde (-mx-5 -mt-5) y deja mb-5 hasta el contenido.
// Sin `bleed` (body con bodyPadding={false}), el bloque ya es de borde a borde.
export default function ContextoRegistro({
  etiqueta,
  valor,
  meta,
  copiable = false,
  etiquetaCopia,
  bleed = false,
  sinMarco = false,
  className = "",
}: {
  etiqueta: string;
  valor: string;
  meta?: React.ReactNode;
  copiable?: boolean;
  // Qué se copia, para el CopyButton ("código" → "Copiar código").
  etiquetaCopia?: string;
  bleed?: boolean;
  // Sin padding ni borde: para componer el bloque dentro de una grilla propia.
  sinMarco?: boolean;
  className?: string;
}) {
  return (
    <div className={`${sinMarco ? "" : "px-6 py-4 border-b border-border"} ${bleed ? "-mx-5 -mt-5 mb-5" : ""} ${className}`}>
      <p className="text-caption text-neutral-500">{etiqueta}</p>
      <div className="flex items-center gap-1.5 min-w-0">
        <p className="font-mono text-[18px] leading-[26px] font-medium tabular-nums text-neutral-900 truncate">{valor}</p>
        {copiable && <CopyButton value={valor} label={etiquetaCopia ?? "código"} />}
      </div>
      {meta && <p className="text-caption text-neutral-600 tabular-nums">{meta}</p>}
    </div>
  );
}
