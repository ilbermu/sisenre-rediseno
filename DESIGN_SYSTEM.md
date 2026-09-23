# DESIGN_SYSTEM.md

Fuente de verdad de los tokens: `src/index.css` (bloque `@theme`). Nada de hex
sueltos ni tamaños fuera de esa escala — si un valor no está ahí, no se usa.
Este archivo documenta *patrones de composición* (cómo se arman pantallas con
esos tokens), no repite los tokens en sí.

## `Modal`: header = mismo tratamiento que `CardHeader`

El bloque de header de `Modal` (título/cerrar + `headerExtra`, si viene) es
`bg-gray-50` con `border-b border-gray-200` como divisor con el body — EL
MISMO tratamiento que `CardHeader` (Búsqueda/Interrupciones/Reposiciones:
`bg-gray-50 border-b border-gray-200`), para que headers de card y headers de
modal se lean como el mismo elemento en toda la app. No es una prop opt-in:
aplica a los 13 usos de `Modal` del archivo por igual. El body sigue en
`bg-white` (default de `Modal`, ver `bodyClassName` si un modal puntual
necesita otra cosa); el footer no cambia.

## `Modal` extendido: header propio, body sin scroll propio

`Modal` (`src/App.tsx`) es el estándar para toda acción que requiera un
diálogo. Por default arma su propio header (`bg-gray-50`, título `text-label`
+ subtítulo + cerrar) y un body con `p-5` que crece con el contenido y
scrollea (`overflow-y-auto`) hasta el tope de `maxHeight`. Props opcionales lo
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
- **`bodyClassName`**: clases extra para el body, cuando `bodyPadding`/
  `bodyOverflow` no alcanzan (ej. un fondo o un layout propio puntual).
- **`height`**: un alto CSS fijo (ej. `"min(720px, calc(100vh - 40px))"`) en
  vez del alto-según-contenido de siempre — para cuando el panel no puede
  saltar de tamaño entre estados (ej. cambiar de tab o de reposición).

## Patrón de modal de trabajo: header con identidad fija, contenido de borde a borde

Para un modal con contenido propio de trabajo (no un formulario de acción
puntual) — ej. "Tablas relacionadas" de Modificar interrupción — el contenido
va de borde a borde del modal, alineado al mismo `px-5` que el header. Sin
cards ni fondo gris en el body: el header (`headerExtra`) lleva SOLO la
identidad del modal, el dato que no cambia mientras está abierto (ej. la
Interrupción) — un dato que SÍ cambia con la interacción (ej. qué reposición
está activa) va en el body, como primer elemento, en fondo blanco, arriba del
contenido de trabajo — no en el header ni en una card.

- **Header**: `headerExtra` apila, debajo del título, la línea de identidad
  fija — ej. Interrupción + `CopyButton` — con `pb-3.5` fijo (sin una segunda
  línea condicional, cierra parejo siempre).
- **Body**: `bodyPadding={false}` + `bodyOverflow="hidden"` — el body EN SÍ
  nunca scrollea ni tiene padding/fondo propios (queda blanco, heredado del
  panel). Su único hijo es un wrapper `h-full flex flex-col min-h-0` que arma
  el layout interno: filas fijas (`shrink-0`, con su propio `px-5` para
  alinear con el header) arriba — la primera de ellas el dato interactivo del
  momento (ver `MetaChip`/`FaseIndicador` abajo), sin `border-b` propio (lo
  pone la fila de tabs de abajo) — la zona de contenido de trabajo (`flex-1
  min-h-0`) al final.
- **El scroll vive DENTRO de un contenedor propio** con su propio borde
  (`border border-gray-200 rounded-md overflow-auto`, `mx-5 mb-5` para
  alinear con el padding del resto del modal) — nunca en el body. Ese
  contenedor es la única zona con scroll de todo el modal; todo lo demás
  (tabs, fila de descripción/buscador) es `shrink-0`.
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
  justify-center`) — nunca sueltos en el body.

## `DataTile`: tile de dato en una grilla, con o sin acción

`DataTile` (`src/App.tsx`) es el tile compartido para mostrar un dato DENTRO
DE UNA GRILLA de tiles (borde propio, fondo propio, radio) — `rounded-sm
border px-2 py-2`, label `text-micro text-gray-600` arriba, valor
`text-label font-semibold` abajo. Hoy lo usan los indicadores de "Tablas
relacionadas" en la Card B de Modificar interrupción (`onClick`+`disabled` —
abren el modal en ese tab; `alert` fondo/borde/texto warning) — admite
también un modo de solo lectura (sin `onClick`, `<div>` en vez de `<button>`)
para otra grilla de tiles que lo necesite. `mono` para valores de código.
`description` agrega una tercera línea opcional (`text-body-sm
text-gray-600`, `line-clamp-2` + `title`) — muestra el texto completo si
entra en 2 líneas, solo trunca con "…" si lo excede. `className` para
ajustes del propio grid item (ej. `col-span-2`).

**No es el patrón para un grupo de chips sutiles** (más liviano que un tile
de grilla, para datos alineados en una fila — ver `MetaChip` abajo).

## `MetaChip`: chip sutil de metadato en una fila

`MetaChip` (`src/App.tsx`, junto a `FaseReposicionFicha`) es un chip más
liviano que `DataTile` — `inline-flex h-7 px-2.5 rounded-md border
text-body-sm`, para datos de solo lectura alineados en una FILA (no una
grilla) — ej. el grupo de datos de la reposición activa en el modal "Tablas
relacionadas". Label opcional + valor + ícono opcional a la izquierda (el
ícono se pasa sin color propio — solo la forma — `MetaChip` lo envuelve con
el color de la variante). Dos variantes:

- **`"neutral"`** (default): fondo `gray-50`, borde `gray-200`, label
  `gray-500`, valor `gray-800 font-medium tabular-nums`, ícono `gray-400`. La
  mayoría de los datos.
- **`"accent"`**: fondo `--color-primary-tint`, borde `--color-chip-border`,
  texto `secondary` (label a `/60` de opacidad) — el mismo lenguaje del
  estado "seleccionado persistente" del sistema (ver `UnderlineTabs` abajo).
  Para la ENTIDAD seleccionada del grupo (ej. "Reposición {n}"), no para un
  dato cualquiera — no mezclar con `"neutral"` dentro del mismo grupo salvo
  para marcar justo esa diferencia.

`FaseIndicador` (mismo archivo) es un indicador compuesto de 3 mini-cajas
fijas R/S/T (`18×18` — tamaño pedido explícitamente, sin paso de la escala de
spacing que dé ese valor) — SIEMPRE en ese orden, resaltando con el mismo
tint+borde celeste de `"accent"` las letras presentes en el valor real (ej.
"RS" resalta R y S) y `gray-300`/`border-gray-200` las ausentes. Es un
indicador ÚNICO, no 3 datos independientes: `role="img"` + `aria-label` con
el valor real en el contenedor, cada caja individual `aria-hidden`. Se usa
como `value` de un `MetaChip` (ej. `label="Fase"`).

## `CopyButton`: acción de copiar con feedback real

`CopyButton` (`src/App.tsx`) es el botón de copiar al portapapeles de toda la
app (ej. la referencia de Interrupción en el header del modal "Tablas
relacionadas") — `w-8 h-8 rounded-sm text-gray-600 hover:bg-gray-100`, ícono
`Copy` (14px). Usa `navigator.clipboard.writeText` con fallback a
`document.execCommand("copy")` vía un `<textarea>` oculto para navegadores/
contextos sin Clipboard API. Solo si la copia realmente ocurrió (`ok === true`)
cambia el ícono a `Check` (`text-success`) por 1.5s y anuncia "\<label\>
copiada" en un `sr-only aria-live="polite"` — nunca simula el estado de éxito
si la operación falló o no está implementada.

Ese último punto es la razón por la que el botón "Copiar datos de la
reposición" (mismo estilo visual, ícono `ClipboardList`, junto a los
`MetaChip` de la reposición activa en "Tablas relacionadas") es una EXCEPCIÓN
deliberada: su `onClick` está vacío (`TODO` en el código, pendiente de definir
qué copia y en qué formato) y por eso NO usa el patrón de feedback de
`CopyButton` — mostrar el ícono de "copiado" sin haber copiado nada sería
mentirle al usuario. Ver `docs/PROGRESO.md` para el estado de este pendiente.

## Tabs de contenido: `UnderlineTabs`

`UnderlineTabs` (`src/App.tsx`) es EL patrón de tabs de contenido de la
app — para elegir qué vista mostrar dentro de un mismo contenedor (ej. qué
tabla se muestra en el modal "Tablas relacionadas" de Modificar
interrupción). Reemplaza al `SegmentedSwitch` (riel + pastilla) que se usó
brevemente para este mismo propósito — se volvió al lenguaje de tabs
subrayados, más estándar para contenido tabular con varias vistas anchas.

- El contenedor respeta el padding horizontal del resto del contenedor que lo
  aloja (ej. `px-5`, el mismo que el header y el resto del contenido del
  modal "Tablas relacionadas") — el primer tab tiene que quedar alineado en
  la misma vertical que el resto del contenido, no pegado al borde de lo que
  lo contiene. El borde inferior (línea de base) sigue yendo de lado a lado
  de ESE contenedor igual: el padding mueve el contenido, no el borde. Cada
  botón usa `px-4` parejo — el primero suma `first:-ml-4` para cancelar su
  propio `pl-4` y que el TEXTO (no el padding) quede exactamente en el borde
  de contenido.
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
