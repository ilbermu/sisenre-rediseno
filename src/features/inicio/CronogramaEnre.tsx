import { useState } from "react";
import { FieldLabel } from "@/components/ui";
import DiaDelMesField from "@/features/inicio/DiaDelMesField";
import { VALOR_VACIO } from "@/lib/format";

export default function CronogramaEnre() {
  // El cronograma marca el MES DE ENTREGA/CORRECCIÓN (cuando IT hace el
  // trabajo) — que es un mes POSTERIOR al período que se está procesando.
  // Ej.: IT entrega las tablas de Agosto 2026 recién en septiembre — por
  // eso la grilla muestra septiembre pero la leyenda de período dice
  // "Período Agosto 2026". El período se calcula como el mes anterior al
  // de entrega (con rollover de año si hace falta), no se hardcodea.
  const ANIO_ENTREGA = 2026;
  const MES_ENTREGA = 8; // 0=enero..11=diciembre → 8=septiembre

  const MESES_ES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  const fechaEntregaMes = new Date(ANIO_ENTREGA, MES_ENTREGA, 1);
  const fechaPeriodo = new Date(ANIO_ENTREGA, MES_ENTREGA - 1, 1);
  const nombreMesEntrega = MESES_ES[fechaEntregaMes.getMonth()];
  const nombrePeriodo = `${MESES_ES[fechaPeriodo.getMonth()].replace(/^./, (c) => c.toUpperCase())} ${fechaPeriodo.getFullYear()}`;
  const DIAS_MES = new Date(ANIO_ENTREGA, MES_ENTREGA + 1, 0).getDate();

  // Entrega y entrega tentativa son puntuales y EDITABLES; la ventana de
  // corrección se autocompleta con todos los días entre las dos.
  const [diaEntrega, setDiaEntrega] = useState(11);
  const [diaTentativa, setDiaTentativa] = useState(29);

  const hoyReal = new Date();
  const HOY = (hoyReal.getFullYear() === ANIO_ENTREGA && hoyReal.getMonth() === MES_ENTREGA) ? hoyReal.getDate() : null;

  const hayCorreccion = diaTentativa - diaEntrega > 1;
  const correccionDesde = diaEntrega + 1;
  const correccionHasta = diaTentativa - 1;

  function etapaDelDia(dia: number): "entrega" | "correccion" | "tentativa" | null {
    if (dia === diaEntrega) return "entrega";
    if (dia === diaTentativa) return "tentativa";
    if (hayCorreccion && dia > diaEntrega && dia < diaTentativa) return "correccion";
    return null;
  }

  // Swatches de la referencia (solo lectura) — acá sí van sólidos, es una
  // leyenda de color puntual, no una celda de calendario completa.
  const COLOR_ETAPA = {
    entrega: "var(--color-primary)",
    correccion: "var(--color-warning)",
    tentativa: "var(--color-error)",
  } as const;

  const LEYENDA = [
    { etapa: "entrega" as const, label: "Entrega de tablas" },
    { etapa: "correccion" as const, label: "Ventana de corrección" },
    { etapa: "tentativa" as const, label: "Entrega tentativa final" },
  ];

  const primerDiaSemana = (fechaEntregaMes.getDay() + 6) % 7; // Lun=0..Dom=6
  const celdas: { dia: number | null; col: number; row: number }[] = [];
  for (let i = 0; i < primerDiaSemana; i++) celdas.push({ dia: null, col: i, row: 0 });
  for (let dia = 1; dia <= DIAS_MES; dia++) {
    const idx = primerDiaSemana + dia - 1;
    celdas.push({ dia, col: idx % 7, row: Math.floor(idx / 7) });
  }
  const totalFilas = Math.max(...celdas.map((c) => c.row)) + 1;

  // Calendario con ancho PROPIO, acotado — no estira a lo ancho de la card
  // (eso hacía que cada celda quedara un rectángulo achatado en vez de un
  // día). 34px de celda × 7 columnas + gaps ≈ 256px, proporción real de
  // calendario.
  const CAL_CELL = 34;
  const CAL_WIDTH = CAL_CELL * 7 + 3 * 6;

  const claseCeldaBase = "rounded-xs flex items-center justify-center text-caption border";

  return (
    <div className="bg-surface rounded-lg border border-border px-5 py-4" style={{ maxWidth: 760 }}>
      <div className="mb-4">
        <span className="inline-flex items-center gap-1.5 h-(--control-sm) pl-2.5 pr-3 rounded-full bg-primary-tint border border-chip-border text-secondary text-label">
          <span className="shrink-0 rounded-full bg-primary" style={{ width: 6, height: 6 }} />
          Período {nombrePeriodo}
        </span>
      </div>

      <div className="flex gap-6 items-start">
        {/* Calendario — ancho fijo, celdas casi cuadradas, colores tenues */}
        <div className="shrink-0" style={{ width: CAL_WIDTH }}>
          <div className="grid gap-[3px] mb-1" style={{ gridTemplateColumns: `repeat(7, ${CAL_CELL}px)` }}>
            {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
              <span key={i} className="text-caption text-center text-text-muted">{d}</span>
            ))}
          </div>
          <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(7, ${CAL_CELL}px)`, gridTemplateRows: `repeat(${totalFilas}, 30px)` }}>
            {celdas.map((c, i) => {
              if (c.dia === null) return <div key={i} style={{ gridColumn: c.col + 1, gridRow: c.row + 1 }} />;
              const esFinDeSemana = c.col >= 5;
              const etapaReal = etapaDelDia(c.dia);
              const etapa = esFinDeSemana ? null : etapaReal;
              const esHoy = c.dia === HOY;

              let clase = claseCeldaBase + " border-transparent bg-fill-muted text-text-muted";
              let estiloExtra: React.CSSProperties = {};
              if (etapa === "entrega") {
                clase = claseCeldaBase + " bg-primary-tint border-primary text-secondary";
              } else if (etapa === "correccion") {
                clase = claseCeldaBase + " bg-warning-bg border-warning-border text-warning-text-strong";
              } else if (etapa === "tentativa") {
                clase = claseCeldaBase + " border-error-border text-error";
                estiloExtra.backgroundColor = "var(--color-error-bg)";
              }

              return (
                <div
                  key={i}
                  title={`${c.dia} de ${nombreMesEntrega}${etapa ? " — " + LEYENDA.find((l) => l.etapa === etapa)?.label : ""}`}
                  className={clase + (esHoy ? " ring-2 ring-secondary" : "")}
                  style={{
                    gridColumn: c.col + 1,
                    gridRow: c.row + 1,
                    ...estiloExtra,
                  }}
                >
                  {c.dia}
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel derecho — referencia de solo lectura arriba, fechas clave editables abajo, separadas */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="shrink-0 rounded-xs" style={{ width: 10, height: 10, backgroundColor: COLOR_ETAPA.entrega }} />
              <span className="text-body-sm text-text-muted flex-1 min-w-0">Entrega de tablas</span>
              <span className="text-label text-text shrink-0">{diaEntrega} de {nombreMesEntrega}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="shrink-0 rounded-xs" style={{ width: 10, height: 10, backgroundColor: COLOR_ETAPA.correccion }} />
              <span className="text-body-sm text-text-muted flex-1 min-w-0">Ventana de corrección</span>
              <span className="text-label text-text shrink-0">
                {hayCorreccion ? `${correccionDesde} – ${correccionHasta} de ${nombreMesEntrega}` : VALOR_VACIO}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="shrink-0 rounded-xs" style={{ width: 10, height: 10, backgroundColor: COLOR_ETAPA.tentativa }} />
              <span className="text-body-sm text-text-muted flex-1 min-w-0">Entrega tentativa final</span>
              <span className="text-label text-text shrink-0">{diaTentativa} de {nombreMesEntrega}</span>
            </div>
          </div>

          <div className="border-t border-border my-3" />

          <p className="text-heading-xs uppercase text-text-muted mb-2">Fechas clave</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Entrega de tablas</FieldLabel>
              <div className="flex items-center gap-1.5">
                <DiaDelMesField value={diaEntrega} onChange={setDiaEntrega} anio={ANIO_ENTREGA} mes={MES_ENTREGA} />
                <span className="text-body-sm text-text-muted truncate">de {nombreMesEntrega}</span>
              </div>
            </div>
            <div>
              <FieldLabel>Entrega tentativa</FieldLabel>
              <div className="flex items-center gap-1.5">
                <DiaDelMesField value={diaTentativa} onChange={setDiaTentativa} anio={ANIO_ENTREGA} mes={MES_ENTREGA} />
                <span className="text-body-sm text-text-muted truncate">de {nombreMesEntrega}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
