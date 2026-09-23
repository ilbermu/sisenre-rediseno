# DESIGN_SYSTEM.md

Fuente de verdad de los tokens: `src/index.css` (bloque `@theme`). Nada de hex
sueltos ni tamaños fuera de esa escala — si un valor no está ahí, no se usa.
Este archivo documenta *patrones de composición* (cómo se arman pantallas con
esos tokens), no repite los tokens en sí.

## `Modal` extendido: header propio, body sin scroll propio

`Modal` (`src/App.tsx`) es el estándar para toda acción que requiera un
diálogo. Por default arma su propio header (título `text-label` + subtítulo +
cerrar) y un body con `p-5` que crece con el contenido y scrollea
(`overflow-y-auto`) hasta el tope de `maxHeight`. Props opcionales lo
extienden sin tocar cómo se ven los modales que no las pasan:

- **`headerExtra`**: una segunda línea de contenido debajo de título/cerrar,
  todavía dentro del mismo bloque con borde inferior del header — para
  contexto adicional (ej. "Interrupción `<ref>`" + `CopyButton`) que no entra
  en la línea de título. Cuando viene, el título pasa a `pt-3.5 pb-0` (en vez
  de `py-4`) y `headerExtra` aporta su propio `mt-0.5 pb-3.5`: el gap entre
  las dos líneas queda compacto (mt-0.5) y el padding total de arriba+abajo
  del bloque sigue parejo (`pt-3.5` arriba, `pb-3.5` abajo).
- **`titleSize="title-sm"`** (default `"label"`, 15px): sube el título al
  siguiente escalón de la escala (`--text-title-sm`, 22px) — para cuando el
  título tiene que ser el elemento más fuerte del header, por encima de un
  `headerExtra` con su propio dato destacado (ej. una referencia mono). El
  dato de `headerExtra` va entonces uno o más pasos MÁS ABAJO que el título
  en la escala (ej. título `title-sm`/22px + referencia `text-body-sm`/12px),
  nunca al mismo nivel — si compiten en peso, el header no tiene un elemento
  más fuerte que el otro y la jerarquía no se lee. **No hay un escalón de
  ~20px en la escala** (micro/caption/body-sm/body/label=15/title-sm=22/
  title=26) — para un título que "debería" rondar los 20px, `title-sm` (22,
  a 2 de distancia) es la opción más cercana frente a `label` (15, a 5).
- **`bodyPadding={false}`**: saca el `p-5` del body — para modales que arman
  su propio layout interno (barras fijas, tabs, tablas de borde a borde) en
  vez de dejar que `Modal` les imponga el padding estándar.
- **`bodyOverflow="hidden"`** (default `"auto"`): el body deja de ser la zona
  que scrollea — ver "Patrón de modal de trabajo" abajo.
- **`bodyClassName`**: clases extra para el body (ej. `"bg-gray-50 flex
  flex-col gap-4"` para el patrón de abajo).
- **`height`**: un alto CSS fijo (ej. `"min(720px, calc(100vh - 40px))"`) en
  vez del alto-según-contenido de siempre — para cuando el panel no puede
  saltar de tamaño entre estados (ej. cambiar de tab o de reposición).

## Patrón de modal de trabajo: header + cards sobre fondo gris

Para un modal con contenido propio de trabajo (no un formulario de acción
puntual) — ej. "Tablas relacionadas" de Modificar interrupción — nada va de
borde a borde del modal. Todo vive contenido en cards:

- **Header**: blanco, compacto, `headerExtra` para el dato de contexto
  secundario (ver arriba). Único elemento de borde a borde.
- **Body**: `bodyOverflow="hidden"` + `bodyClassName="bg-gray-50 flex
  flex-col gap-4"` (+ `p-5` del `bodyPadding` default) — el body EN SÍ nunca
  scrollea. Sus hijos directos son cards (`bg-white border border-gray-200
  rounded-lg`, sombra `--shadow-low`): las de alto fijo llevan `shrink-0`,
  la que contiene la tabla de trabajo lleva `flex-1 min-h-0`.
- **El scroll vive DENTRO de la card de contenido**, en un contenedor propio
  con su propio borde (`border border-gray-200 rounded-md overflow-auto`,
  `mx-4 mb-4` dentro de esa card) — nunca en el body del modal. Ese
  contenedor es la única zona con scroll de todo el modal; todo lo demás
  (header de card, tabs, fila de descripción/buscador) es `shrink-0`.
- El header de tabla dentro de ese contenedor necesita ser `sticky top-0` con
  fondo opaco puesto en el propio `<th>` (no en el `<tr>` padre — un fondo en
  el padre no sigue al hijo posicionado). La tabla pasa a `border-separate` +
  `border-spacing:0` con los separadores de fila en `<td>` en vez de `<tr>`:
  bajo `border-collapse`, un borde de fila se pinta en la capa de bordes de
  la tabla y puede quedar por encima del `<th>` sticky al scrollear (mismo
  fix que ya usa `ReposicionesTable`).
- Estados especiales de esa zona (un resultado compacto tipo Sí/No, un vacío
  con ícono+texto+acción) van DENTRO del mismo contenedor con borde,
  centrados vertical y horizontalmente (`h-full flex items-center
  justify-center`) — nunca sueltos en el body ni en la card.

## `DataTile`: dato de solo lectura, label + valor

`DataTile` (`src/App.tsx`, junto a `FaseReposicionFicha`) es el tile
compartido para mostrar un dato en una grilla — `rounded-sm border px-2 py-2`,
label `text-micro text-gray-600` arriba, valor `text-label font-semibold`
abajo. Dos modos, mismo aspecto:

- **Sin `onClick`**: `<div>` estática, de solo lectura (ej. la grilla de
  datos de la reposición activa — Hora reposición/Fase/Equipo/Usuarios BT).
- **Con `onClick`**: `<button>` interactivo, con `disabled` (atenuado,
  `cursor-not-allowed`) y `alert` (fondo/borde/texto warning) — mismo
  comportamiento que ya tenían los tiles de "Tablas relacionadas" en la Card
  B de Modificar interrupción (ahora construidos con este componente).
- `mono` para valores de código (ej. Fase, el código de un equipo).
  `description` agrega una tercera línea opcional (`text-body-sm
  text-gray-600`, `line-clamp-2` + `title`) — muestra el texto completo si
  entra en 2 líneas, solo trunca con "…" si lo excede. `className` para
  ajustes del propio grid item (ej. `col-span-2`).

## Tabs de contenido: `UnderlineTabs`

`UnderlineTabs` (`src/App.tsx`) es EL patrón de tabs de contenido de la
app — para elegir qué vista mostrar dentro de un mismo contenedor (ej. qué
tabla se muestra en la card "Tablas relacionadas" del modal del mismo
nombre). Reemplaza al `SegmentedSwitch` (riel + pastilla) que se usó
brevemente para este mismo propósito — se volvió al lenguaje de tabs
subrayados, más estándar para contenido tabular con varias vistas anchas.

- El contenedor respeta el padding horizontal del resto del contenedor que lo
  aloja (ej. `px-4`, el mismo que el resto del contenido de esa card) — el
  primer tab tiene que quedar alineado en la misma vertical que el resto del
  contenido, no pegado al borde de lo que lo contiene. El borde inferior
  (línea de base) sigue yendo de lado a lado de ESE contenedor igual: el
  padding mueve el contenido, no el borde. Cada botón usa `px-4` parejo — el
  primero suma `first:-ml-4` para cancelar su propio `pl-4` y que el TEXTO
  (no el padding) quede exactamente en el borde de contenido.
- Botones `h-10 min-w-24 px-4 text-body`.
  - Reposo: `text-gray-600`, hover `bg-gray-50`.
  - Activo: `text-secondary font-medium` + `border-b-2 border-primary`
    superpuesto a la línea de base vía `-mb-px`.
- `role="tablist"` en el contenedor, `role="tab"` + `aria-selected` en cada
  botón, flechas izquierda/derecha para moverse entre opciones.
- Es para cambiar de **VISTA** — la selección de fila, chip o filtro sigue
  siendo el estado "seleccionado persistente" (tint `--color-primary-tint` +
  borde `--color-chip-border` + texto `--color-secondary`, ver
  `ButtonSelectGroup` — Origen/Tipo, tiles con cantidad `DataTile`). No
  mezclar los dos lenguajes ni usar `bg-primary` relleno para ninguno
  (reservado a botones de acción primarios).

## Dentro de un contenedor flex con scroll, las secciones no se achican

Regla general para cualquier layout `flex-col` con `overflow-y-auto` que
contenga hijos con su propio `overflow` no-visible (ej. `overflow-hidden` en
una card, o una tabla con su propio scroll interno): esos hijos necesitan
`shrink-0`. Sin eso, el min-height automático de un flex item pasa a `0`
(regla CSS `min-size: auto` de flexbox) y, si el contenido total supera el
alto disponible, flex **achica los hijos** en vez de dejar que el
contenedor scrollee — un bug real que ya pasó acá: sin `shrink-0`, elegir un
tab con más contenido comprimía y recortaba una tabla vecina en vez de
activar el scroll del contenedor. El que scrollea es siempre el contenedor
exterior, nunca sus secciones.
