# DESIGN_SYSTEM.md

Fuente de verdad de los tokens: `src/index.css` (bloque `@theme`). Nada de hex
sueltos ni tamaños fuera de esa escala — si un valor no está ahí, no se usa.
Este archivo documenta *patrones de composición* (cómo se arman pantallas con
esos tokens), no repite los tokens en sí.

## `Modal` extendido: header propio y body sin padding

`Modal` (`src/App.tsx`) es el estándar para toda acción que requiera un
diálogo. Por default arma su propio header (título `text-label` + subtítulo +
cerrar) y un body con `p-5` que crece con el contenido hasta el tope de
`maxHeight`. Cuatro props opcionales lo extienden sin tocar cómo se ven los
modales que no las pasan:

- **`headerExtra`**: una segunda línea de contenido debajo de título/cerrar,
  todavía dentro del mismo bloque con borde inferior del header — para
  contexto adicional (ej. "Interrupción `<ref>`" + `CopyButton`) que no entra
  en la línea de título. Cuando viene, el título recorta su padding inferior
  (`pb-1.5` en vez de `pb-4`) para que el gap con esa segunda línea quede
  compacto (4-6px) — `headerExtra` aporta su propio `pb-4` para que el
  padding total de arriba+abajo del bloque siga parejo.
- **`titleSize="title-sm"`** (default `"label"`, 15px): sube el título al
  siguiente escalón de la escala (`--text-title-sm`, 22px) — para cuando el
  título tiene que ser el elemento más fuerte del header, por encima de un
  `headerExtra` con su propio dato destacado (ej. una referencia mono). El
  dato de `headerExtra` va entonces un paso MÁS ABAJO que el título en la
  escala (ej. título `title-sm` + referencia `text-body`), nunca al mismo
  nivel — si compiten en peso, el header no tiene un elemento más fuerte que
  el otro y la jerarquía no se lee.
- **`bodyPadding={false}`**: saca el `p-5` del body — para modales que arman
  su propio layout interno (barras fijas, tabs, tablas de borde a borde) en
  vez de dejar que `Modal` les imponga el padding estándar.
- **`height`**: un alto CSS fijo (ej. `"min(720px, calc(100vh - 40px))"`) en
  vez del alto-según-contenido de siempre — para cuando el contenido interno
  tiene una única zona de scroll propia y el panel no puede saltar de tamaño
  entre estados (ej. cambiar de tab). Combinarla con `bodyPadding={false}` y
  un layout interno `h-full flex flex-col min-h-0`: las franjas fijas
  (`shrink-0`) arriba, la única zona que scrollea (`flex-1 min-h-0
  overflow-y-auto`) al final.

## Tabs de contenido: `UnderlineTabs`

`UnderlineTabs` (`src/App.tsx`) es EL patrón de tabs de contenido de la
app — para elegir qué vista mostrar dentro de un mismo contenedor (ej. qué
tabla se muestra en el modal "Tablas relacionadas" de Modificar
interrupción). Reemplaza al `SegmentedSwitch` (riel + pastilla) que se usó
brevemente para este mismo propósito — se volvió al lenguaje de tabs
subrayados, más estándar para contenido tabular con varias vistas anchas.

- El contenedor respeta el padding horizontal del resto del contenedor que lo
  aloja (ej. `px-5` en el modal "Tablas relacionadas") — el primer tab tiene
  que quedar alineado en la misma vertical que el resto del contenido de ese
  contenedor (ficha, descripción, toolbar), no pegado al borde del panel. El
  borde inferior (línea de base) sigue yendo de lado a lado igual: el padding
  mueve el contenido, no el borde. Cada botón usa `px-4` parejo — el primero
  suma `first:-ml-4` para cancelar su propio `pl-4` y que el TEXTO (no el
  padding) quede exactamente en el borde de contenido.
- Botones `h-10 min-w-24 px-4 text-body`.
  - Reposo: `text-gray-600`, hover `bg-gray-50`.
  - Activo: `text-secondary font-medium` + `border-b-2 border-primary`
    superpuesto a la línea de base vía `-mb-px`.
- `role="tablist"` en el contenedor, `role="tab"` + `aria-selected` en cada
  botón, flechas izquierda/derecha para moverse entre opciones.
- Es para cambiar de **VISTA** — la selección de fila, chip o filtro sigue
  siendo el estado "seleccionado persistente" (tint `--color-primary-tint` +
  borde `--color-chip-border` + texto `--color-secondary`, ver
  `ButtonSelectGroup` — Origen/Tipo, tiles con cantidad `STATUS_ITEMS`). No
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
