import { ReclamosInterrupcion } from "@/data/types";
import { formatHora, formatNumero } from "@/lib/format";

// Intervalos iguales en los que se agrupan los reclamos.
const INTERVALOS = 18;
const ALTO_GRAFICO = 44;

// Resumen de los reclamos de la interrupción seleccionada (sección
// "Reclamos durante la interrupción" de la hoja): una frase y un mini
// gráfico de barras sobre el tramo de la interrupción. Sin cifras repetidas:
// inicio, fin y duración ya están en la hoja.
//   - Frase (text-body-sm neutral-700, datos en neutral-900 semibold
//     tabular-nums): "N reclamos mientras duró la interrupción. El primero
//     llegó a las hh:mm y el pico fue cerca de las hh:mm."; con 1 reclamo,
//     "1 reclamo mientras duró la interrupción, a las hh:mm."; con 0, "Sin
//     reclamos durante la interrupción." y sin gráfico.
//   - Gráfico: 44px de alto y ancho completo; los reclamos se agrupan en 18
//     intervalos iguales entre el inicio y `fin` (la última reposición).
//     Barras --color-chip-border, la máxima --color-primary, radio 2px
//     arriba. Debajo, un eje con border-t: "hh:mm inicio" a la izquierda y
//     "hh:mm <etiquetaFin>" a la derecha.
// Los reclamos vienen de `datos.minutos` (minutos desde el inicio de la
// interrupción = la fecha de cada reclamo).
export default function ReclamosResumen({
  datos,
  fin,
  etiquetaFin = "última reposición",
}: {
  datos: ReclamosInterrupcion | null;
  // Fin del tramo del gráfico: la última reposición.
  fin: Date | null;
  etiquetaFin?: string;
}) {
  const dato = "font-semibold tabular-nums text-neutral-900";
  if (!datos || datos.minutos.length === 0) {
    return <p className="text-body-sm text-neutral-700">Sin reclamos durante la interrupción.</p>;
  }
  const inicio = datos.inicio;
  const tramoMin = Math.max(1, Math.round(((fin ?? datos.fin).getTime() - inicio.getTime()) / 60000));
  const horaDe = (min: number) => formatHora(new Date(inicio.getTime() + min * 60000));
  const total = datos.minutos.length;
  const primero = Math.min(...datos.minutos);

  const conteos = Array.from({ length: INTERVALOS }, () => 0);
  for (const m of datos.minutos) conteos[Math.min(INTERVALOS - 1, Math.max(0, Math.floor((m / tramoMin) * INTERVALOS)))]++;
  const maximo = Math.max(...conteos);
  const iMax = conteos.indexOf(maximo);
  const ancho = tramoMin / INTERVALOS;
  // Pico: el centro del intervalo con más reclamos.
  const pico = horaDe(Math.round((iMax + 0.5) * ancho));

  const frase =
    total === 1 ? (
      <>
        <span className={dato}>1 reclamo</span> mientras duró la interrupción, a las <span className={dato}>{horaDe(primero)}</span>.
      </>
    ) : (
      <>
        <span className={dato}>{formatNumero(total)} reclamos</span> mientras duró la interrupción. El primero llegó a las{" "}
        <span className={dato}>{horaDe(primero)}</span> y el pico fue cerca de las <span className={dato}>{pico}</span>.
      </>
    );

  return (
    <div>
      <p className="text-body-sm text-neutral-700">{frase}</p>
      <div
        role="img"
        aria-label={`Reclamos por intervalo entre el inicio y la ${etiquetaFin}; el máximo cerca de las ${pico}`}
        className="mt-3 flex items-end gap-[2px]"
        style={{ height: ALTO_GRAFICO }}
      >
        {conteos.map((n, i) => (
          <div
            key={i}
            className="flex-1 min-w-0 rounded-t-[2px]"
            style={{
              height: n === 0 ? 0 : Math.max(2, Math.round((n / maximo) * ALTO_GRAFICO)),
              backgroundColor: i === iMax ? "var(--color-primary)" : "var(--color-chip-border)",
            }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between gap-3 pt-1 border-t border-border text-caption text-neutral-500 tabular-nums">
        <span>{formatHora(inicio)} inicio</span>
        <span>{formatHora(fin ?? datos.fin)} {etiquetaFin}</span>
      </div>
    </div>
  );
}
