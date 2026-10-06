import { AbmMode, CampoBusqueda, CampoTipo } from "@/data/types";
import { AbmCampo } from "@/features/abm/AbmCampo";

export function AbmFila({
  fila,
  mode,
  valores,
  setValor,
  camposLocked,
  consultando,
  columnasCompartidas,
}: {
  fila: CampoBusqueda[];
  mode: AbmMode;
  valores: Record<string, string>;
  setValor: (nombre: string, v: string) => void;
  // Nombres de campo bloqueados en modo Modificar para la tabla activa.
  camposLocked: string[];
  // Ver AbmCampo — fila seleccionada en Resultados en modo buscar.
  consultando?: boolean;
  // true si otra(s) fila(s) de la misma sección tienen la misma cantidad de
  // columnas — en ese caso las columnas deben quedar parejas (1fr) entre
  // todas para que se alineen visualmente, sin importar si alguna tiene un
  // toggle angosto. Solo una fila que es la única de su longitud en la
  // sección puede darse el lujo de ajustar sus columnas por tipo de campo.
  columnasCompartidas?: boolean;
}) {
  const isMulti = fila.length > 1;
  // Fila de un solo campo: por default el campo define su propio ancho
  // (w-full en texto/select/fecha, ya se ve bien) y la fila no necesita
  // estilo propio. El toggle es la excepción — su grupo de botones es
  // angosto por naturaleza (shrink-to-fit, ver AbmCampo), así que sin esto
  // la fila (100% del panel) deja un espacio muerto grande a la derecha.
  // `ancho` explícito en el campo, si lo hay, sigue ganando por sobre esto.
  const soloCampo = !isMulti ? fila[0] : undefined;
  const soloAncho = soloCampo?.ancho ?? (soloCampo?.tipo === "toggle" && !soloCampo?.expandirBotones ? "fit-content" : undefined);
  // Columnas parejas (1fr cada una) dejan un hueco cuando alguna es un
  // control de opciones acotadas (toggle/select, angosto por naturaleza)
  // — esa columna se ajusta a su contenido (auto); texto/fecha/combobox
  // son de contenido abierto y absorben el espacio sobrante. Pero eso solo
  // vale cuando la fila no tiene con quién alinearse dentro de la sección:
  // si otra fila hermana comparte la misma cantidad de columnas (ver
  // `columnasCompartidas`, calculado por sección en AbmScreen), todas esas
  // filas deben usar la misma grilla pareja para que sus columnas queden
  // alineadas entre sí, aunque alguna tenga un toggle/select. Si TODOS los
  // campos de una fila "no compartida" quedan compactos (ningún campo
  // abierto que absorba el sobrante), ese sobrante se reparte como espacio
  // entre los campos (space-between) en vez de amontonarse al final.
  const esCompacto = (tipo: CampoTipo) => tipo === "toggle" || tipo === "select";
  const gridTemplate = isMulti
    ? columnasCompartidas
      ? `repeat(${fila.length}, 1fr)`
      : fila.map((c) => (esCompacto(c.tipo) ? "auto" : "1fr")).join(" ")
    : undefined;
  const todosCompactos = isMulti && !columnasCompartidas && fila.every((c) => esCompacto(c.tipo));
  // A partir de 3 campos la fila ya usa casi todo el ancho del panel — en el
  // grid de 2 columnas de la sección (ver AbmScreen, tier 760px) tiene que
  // ocupar las 2 para no aplastar sus campos a la mitad. Filas de 1-2 campos
  // sí pueden emparejarse una al lado de la otra.
  const spanTodas = fila.length >= 3;
  return (
    <div
      className={`${isMulti ? "grid gap-3 items-end" : ""}${spanTodas ? " [@media(max-height:760px)]:col-span-2" : ""}`}
      style={
        isMulti
          ? { gridTemplateColumns: gridTemplate, justifyContent: todosCompactos ? "space-between" : undefined }
          : soloAncho
            ? { width: soloAncho }
            : undefined
      }
    >
      {fila.map((campo) => (
        <AbmCampo
          key={campo.nombre}
          campo={campo}
          mode={mode}
          value={valores[campo.nombre]}
          onChange={(v) => setValor(campo.nombre, v)}
          lockedEnModificar={camposLocked.includes(campo.nombre)}
          consultando={consultando}
          valoresFormulario={valores}
        />
      ))}
    </div>
  );
}
