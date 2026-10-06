import { VALOR_VACIO } from "@/lib/format";

// Indicador de fase eléctrica — 3 mini-cajas fijas R/S/T (18×18, tamaño
// pedido explícitamente, no hay un paso de la escala de spacing que dé
// justo ese valor). Siempre las 3 en ese orden, resalta las presentes en
// `fase` (ej. "RS" resalta R y S) con el mismo tint+borde celeste que el
// resto de los indicadores "accent" del sistema; las ausentes quedan en
// text-faint/border-border. Es un indicador compuesto de SOLO LECTURA (la
// selección de fase existe en ABM y consultas, no acá): <span>, sin hover
// ni cursor, fuera del orden de tabulación. Cada caja es aria-hidden y un
// sr-only describe el estado con las fases presentes (ej. "Fases: R, S y T").
export function FaseIndicador({ fase }: { fase: string }) {
  const letras = ["R", "S", "T"] as const;
  const presentes = letras.filter((l) => fase.includes(l));
  const textoFases =
    presentes.length <= 1
      ? `Fase: ${presentes[0] ?? VALOR_VACIO}`
      : `Fases: ${presentes.slice(0, -1).join(", ")} y ${presentes[presentes.length - 1]}`;
  return (
    <span className="flex items-center gap-0.5">
      <span className="sr-only">{textoFases}</span>
      {letras.map((letra) => {
        const presente = fase.includes(letra);
        return (
          <span
            key={letra}
            aria-hidden="true"
            className={`w-[18px] h-[18px] flex items-center justify-center rounded-xs border text-caption font-mono ${
              presente ? "bg-primary-tint border-chip-border text-secondary" : "border-border text-text-faint"
            }`}
          >
            {letra}
          </span>
        );
      })}
    </span>
  );
}
