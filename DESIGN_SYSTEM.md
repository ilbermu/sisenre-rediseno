# DESIGN_SYSTEM.md

Fuente de verdad de los tokens: `src/index.css` (bloque `@theme`). Nada de hex
sueltos ni tamaños fuera de esa escala — si un valor no está ahí, no se usa.
Este archivo documenta *patrones de composición* (cómo se arman pantallas con
esos tokens), no repite los tokens en sí — salvo la escala tipográfica, que
se documenta acá abajo porque elegir token es una decisión de rol, no de
tamaño.

## Tipografía

Escala única, definida en `@theme` de `src/index.css`. Cada token es
**compuesto**: la clase `text-<token>` aplica tamaño + interlineado + peso
juntos. Se elige por **rol** (qué es el texto), nunca por tamaño.

| Token | Tamaño / interlineado | Peso | Cuándo usarlo |
|---|---|---|---|
| `text-heading-lg` | 24 / 32 | semibold | Título principal de una pantalla de entrada: saludo del Inicio, "Bienvenido" (login y selector de herramienta) |
| `text-heading-md` | 16 / 24 | semibold | Título de pantalla (`h1` del top bar), título de modal y de card, valor destacado de un KPI o tile |
| `text-heading-sm` | 13 / 20 | semibold | Título de sección dentro de un panel o popover ("Más filtros", mes del calendario), título de estado vacío ("No hay registros"), ítem destacado del sidebar |
| `text-heading-xs` | 11 / 16 | semibold | Encabezado de columna, overline de sección, rótulo de grupo del sidebar, día de la semana del calendario |
| `text-body-lg` | 14 / 20 | regular | Texto corrido: párrafos, descripciones, subtítulos, inputs del login, valor de tile |
| `text-body` | 13 / 20 | regular | Base densa: celdas de tabla, inputs, botones, ítems de menú |
| `text-body-sm` | 12 / 16 | regular | Celdas de tablas compactas, texto auxiliar, metadatos, tooltip |
| `text-label` | 12 / 16 | medium | Label de campo, filter trigger, tab, chip, botón `sm` (`BTN_SM`), link de acción, día del calendario, valor en un par dato/valor |
| `text-caption` | 11 / 16 | regular | Contadores, paginación, error de campo, label de tile y de KPI, ejes y rótulos de gráfico |
| `text-code` | 12 / 16 | regular | Datos: IDs, referencias, fechas, códigos. Siempre junto a `font-mono` |
| `text-display` | 40 / 48 | semibold | **Solo marca del login. No usar en el producto.** |

### Reglas

- **Rol, no tamaño.** Si dudás entre dos tokens, preguntate qué es el texto
  (¿título?, ¿dato?, ¿etiqueta?), no cuánto debería medir.
- **No hay otros tamaños.** `--text-*: initial` borra la escala default de
  Tailwind: `text-xs`, `text-sm`, `text-base`, etc. no existen. Tampoco se
  usan tamaños arbitrarios (`text-[13px]`), ni `font-size` / `line-height` /
  `font-weight` inline, ni en `classNames` de librerías (DayPicker).
- **Nada por debajo de 11px.**
- **Tres pesos:** regular (400), medium (500), semibold (600). `font-bold`
  no se usa.
- **El peso viene del token.** No se agrega `font-semibold` / `font-medium`
  sobre un token. Excepciones:
  - **Botones** — la única excepción de peso del sistema: todos usan
    `text-body font-medium`, primario y secundario por igual (`BTN_MD`, los
    botones de modal y el del login). El botón `sm` usa `text-label`, que ya
    es medium.
  - **Estado seleccionado/activo** (fila elegida, tab activo, valor elegido
    en un picker): `font-medium` condicional, como marca de estado y no de
    jerarquía.
  - **Énfasis dentro de una oración** (el número en "3 de 20 registros", el
    nombre de la tabla en un mensaje de confirmación): un `<span>` con
    `font-medium` o `font-semibold` sin clase de tamaño.
- **El interlineado viene del token** (múltiplos de 4px). No se usa
  `leading-*`.
- **Un único valor por token en todos los tamaños de pantalla.** Los
  `@media (max-height: …)` de `index.css` solo redefinen `--spacing`, que es
  la única palanca de densidad; no redefinen `--text-*`.
- **La jerarquía se lee con tamaño y peso, no con mayúsculas.** Los
  `uppercase` + `tracking-*` que ya existen sobre `heading-xs` y `caption` se
  mantienen, pero no se agregan nuevos para "subir" un texto de nivel.
- **`font-mono` es una familia, no un tamaño.** Tiene dos combinaciones
  documentadas y ninguna más:
  - `text-code font-mono` — el rol para **datos**: IDs, referencias, fechas,
    códigos de equipo. Va a 12px porque JetBrains Mono a 12 empareja
    ópticamente con Inter a 13 en la misma fila.
  - `text-caption font-mono` — **badges y contadores**: código de tabla
    (CDS4, etc.), contadores del sidebar, letra de fase.

## Superficies: fondos, bordes y sombras

Tokens en `@theme` de `src/index.css`. Se eligen por **rol**; las clases
`bg-gray-*`, `border-gray-*`, `text-gray-*` y `bg-white` no se usan.

| Token | Clase | Uso |
|---|---|---|
| `--color-bg-app` | `bg-bg-app` | Fondo de página: shell de la app, selector de herramienta, sidebar, top bar |
| `--color-surface` | `bg-surface` | Todo lo que se apoya sobre el fondo: cards, modales, popovers, dropdowns, inputs, botones secundarios, paginadores, headers de card y de modal |
| `--color-border` | `border-border`, `bg-border` | Borde de contenedores (cards, popovers, dropdowns), divisores (bajo un header, bajo el `thead`, pie de tabla) y líneas de 1px (`h-px` / `w-px bg-border`) |
| `--color-border-strong` | `border-border-strong` | Controles: inputs, selects, botones secundarios, checkbox y radio, badges de código. Tienen que seguir leyéndose como campos |
| `--color-border-subtle` | `border-border-subtle` | Separador entre filas de una tabla o de una lista |
| `--color-fill-subtle` | `bg-fill-subtle` | Relleno de `thead`, pie de tabla, barra de filtros activos, filas de "Resumen de cambios", campos bloqueados |
| `--color-fill-muted` | `bg-fill-muted` | Hover neutro (filas, ítems de menú, botones del sidebar y de ícono), campos de solo lectura o deshabilitados, celdas vacías del mini calendario, fondo del badge de tabla |

Reglas:

- **Los rellenos neutros son siempre translúcidos** (`fill-subtle`,
  `fill-muted`): negro cálido con alfa, no un gris opaco. Así toman la
  temperatura de lo que tienen debajo (blanco en una card, crema en el
  sidebar) y nunca aparece un gris azulado sobre un fondo cálido. No se
  agregan grises opacos de relleno.
- **Excepción — elementos `sticky`:** un `th` sticky necesita fondo opaco,
  porque con el relleno translúcido se ve pasar el contenido que scrollea
  por debajo. Para eso existe `bg-fill-subtle-solid` (mismo color que
  `bg-fill-subtle` sobre `surface`, sin transparencia). El fondo va en los
  `th`, no en el `<tr>`: si van los dos, el alfa se suma.
- **Los bordes también son translúcidos**, por la misma razón.
- **Headers de card y de modal** son `bg-surface` con `border-b
  border-border`: se separan del cuerpo con la línea, no con un relleno.
- **Los estados de interacción no usan estos tokens:** hover de acción,
  seleccionado y foco siguen en celeste/tint/navy (`border-primary`,
  `bg-primary-tint`, `text-secondary`, `focus`). `fill-muted` es solo el
  hover *neutro*.

### Sombras

Una por nivel de elevación, como clase (`shadow-sm` / `shadow-md` /
`shadow-lg`). No hay `box-shadow` inline ni sombras arbitrarias.

| Token | Uso |
|---|---|
| `--shadow-sm` | Cards |
| `--shadow-md` | Popovers, dropdowns, menús; cards de acceso en hover |
| `--shadow-lg` | Modales |

Ningún botón lleva sombra. `--inset-shadow-row-selected`
(`inset-shadow-row-selected`) no es elevación: es el acento de 3px de la
fila seleccionada.

## Celeste de marca: dos tonos, dos usos

El celeste no es un solo color. Son dos tokens del mismo hue (214°) y no
son intercambiables:

| Token | Hex | Blanco encima | Uso |
|---|---|---|---|
| `--color-primary` | `#4D97FA` | 2.95:1 — no alcanza | Bordes (`border-primary`), tints (`bg-primary-tint`), foco, estado seleccionado, hover de acción, acentos decorativos (puntos, ícono de accesos). **Nunca como relleno con contenido blanco encima** |
| `--color-primary-strong` | `#076AEE` | 4.88:1 | Rellenos con contenido blanco: botón primario, badge contador de "Más filtros", checkbox marcado, punto y borde del radio seleccionado |
| `--color-primary-hover` | `#0663DF` | 5.44:1 | Hover de `primary-strong` |

- **Botón primario:** `bg-primary-strong hover:bg-primary-hover text-white`,
  sin sombra y sin `hover:brightness-*`. El fondo va por clase, no por
  `style`.
- **Deshabilitado y cargando son dos estados distintos** y no se ven igual:
  - **Deshabilitado** — la acción no está disponible todavía (falta
    completar algo): `disabled:opacity-40 disabled:cursor-not-allowed
    disabled:pointer-events-none`. Se lee como inactivo.
  - **Cargando** — la acción ya se disparó y está en curso: el botón
    mantiene el color pleno (`bg-primary-strong`, sin opacidad ni
    `cursor-not-allowed`), muestra un spinner (`Loader2` de lucide con
    `animate-spin`, 16px) a la izquierda del texto en gerundio
    ("Ingresando…"), lleva `aria-busy="true"` y bloquea clics con
    `disabled` + `disabled:pointer-events-none`. Ej.: botón del login.
- **Botón destructivo relleno** ("Eliminar"): `bg-error
  hover:bg-error-text-strong text-white`.
- **Seleccionado** (toggles, segmented, filas, chips) es siempre el patrón
  tint: `bg-primary-tint` + `border-primary` (o `ring-1 ring-inset
  ring-primary` en un segmented de bordes compartidos) + `text-secondary`.
  Un seleccionado nunca es un relleno `primary-strong` con texto blanco: ese
  lenguaje queda reservado a la acción primaria.
- Checkbox y radio marcados usan `primary-strong` porque son componentes de
  estado y necesitan 3:1 contra el fondo.

## Colores de texto

Neutros cálidos, coherentes con `--color-bg-app` y con la base de los
bordes. `text-gray-*` y `text-black` no se usan.

| Token | Clase | Hex | Uso |
|---|---|---|---|
| `--color-text` | `text-text` | `#1F1E1D` | Texto principal: títulos, valores, celdas de tabla, contenido de inputs, ítems de menú, botones secundarios. Es el único color de texto principal: la jerarquía se arma con tamaño y peso (ver "Tipografía"), no con grises intermedios |
| `--color-text-muted` | `text-text-muted` | `#63625D` | Labels, descripciones, headers de columna, overlines, pies de tabla, metadatos, placeholders, contenido de campos de solo lectura, ejes y rótulos de gráfico |
| `--color-icon` | `text-icon` | `#7D7C77` | Íconos funcionales: botones de ícono (cerrar, copiar, colapsar, paginar), íconos de trigger (lupa, calendario, chevron) |
| `--color-text-faint` | `text-text-faint` | `#8F8E89` | **Solo dos usos**, ambos exentos de contraste por WCAG: (1) controles deshabilitados; (2) elementos decorativos sin información — ícono `Inbox` de estado vacío, separadores "·" y "→". Nunca para texto que haya que leer |

`text-secondary` es otra cosa: es el **navy de marca** (`--color-secondary`),
no un gris. El gris secundario es `text-text-muted`.

### Reglas

- **Celeste = relleno y borde; navy = texto.** `text-primary` no se usa como
  color de texto: links, valores destacados y texto en estado
  hover/seleccionado van en `text-secondary` (navy). Única excepción: el
  ícono decorativo de las cards de "Accesos frecuentes" del Inicio, que
  acompaña a un texto.
- **Links de acción** ("Limpiar"): `text-label text-secondary
  hover:underline`.
- **Semánticos:** sobre `surface`, `text-error`. Sobre un fondo teñido
  (`red-50`, `fill-muted`) o en hover con `bg-red-50`,
  `text-error-text-strong`. El verde de éxito como texto es siempre
  `text-success-text-strong` (`--color-success` no llega a 4.5:1).
- **Sin opacidad en el texto** (`text-secondary/60`, etc.): baja el contraste
  de forma impredecible según el fondo.
- **Sin `color` inline con hex.**

### Contraste

Mínimos: `text` 7:1, `text-muted` 4.5:1, `icon` 3:1 (componente no textual),
`text-faint` 2.5:1 (exento). El peor fondo es `fill-muted` apoyado sobre
`bg-app`.

| Color | surface | bg-app | fill-subtle | fill-muted | fill-subtle sobre bg-app | fill-muted sobre bg-app | primary-tint |
|---|---|---|---|---|---|---|---|
| `text` `#1F1E1D` | 16.64 | 15.80 | 15.67 | 14.72 | 14.88 | 13.99 | 14.99 |
| `text-muted` `#63625D` | 6.11 | 5.80 | 5.75 | 5.41 | 5.46 | 5.14 | 5.51 |
| `icon` `#7D7C77` | 4.18 | 3.97 | 3.94 | 3.70 | 3.74 | 3.51 | 3.77 |
| `text-faint` `#8F8E89` | 3.28 | 3.12 | 3.09 | 2.90 | 2.93 | 2.76 | 2.96 |
| `secondary` (navy) `#1D558C` | 7.69 | 7.30 | 7.24 | 6.80 | 6.87 | 6.46 | 6.93 |

## Radios

`--radius-*: initial` borra la escala default de Tailwind: solo existen
estos seis, y `rounded` sin sufijo no se usa. Se elige por rol del elemento.

| Token | Valor | Uso |
|---|---|---|
| `rounded-xs` | 4px | Badges de código, checkbox, celdas del mini calendario, leyenda del cronograma, chips cuadrados |
| `rounded-sm` | 6px | Inputs, selects, todos los botones (`sm`, `md`, paginación, ícono), segmented, ítems de menú |
| `rounded-md` | 8px | Dropdowns, popovers (calendario, "Más filtros"), tiles de Tablas relacionadas, contenedores anidados dentro de una card (wrapper de tabla, card de Reclamos) |
| `rounded-lg` | 12px | Todas las cards (de trabajo y de contenido), cards del selector de herramienta, card del login |
| `rounded-xl` | 16px | Modales |
| `rounded-full` | 9999px | Avatares, chips redondos, días del calendario, badges contadores |

- **Regla de anidado:** un elemento dentro de otro con padding usa un radio
  menor (radio interno ≈ radio externo − padding). Una caja con borde dentro
  de una card (`lg`) es `md`; un input dentro de esa caja es `sm`.
- Los `rx` de los SVG (timeline de reclamos) son geometría del gráfico, no
  tokens de UI.

## `Modal`: header = mismo tratamiento que `CardHeader`

El bloque de header de `Modal` (título/cerrar + `headerExtra`, si viene) es
`bg-surface` con `border-b border-border` como divisor con el body — EL
MISMO tratamiento que `CardHeader` (Búsqueda/Interrupciones/Reposiciones:
`bg-surface border-b border-border`), para que headers de card y headers de
modal se lean como el mismo elemento en toda la app. No es una prop opt-in:
aplica a los 13 usos de `Modal` del archivo por igual. El body sigue en
`bg-surface` (default de `Modal`, ver `bodyClassName` si un modal puntual
necesita otra cosa); el footer no cambia.

## `Modal` extendido: header propio, body sin scroll propio

`Modal` (`src/App.tsx`) es el estándar para toda acción que requiera un
diálogo. Por default arma su propio header (`bg-surface`, título
`text-heading-md` + subtítulo + cerrar) y un body con `p-5` que crece con el contenido y
scrollea (`overflow-y-auto`) hasta el tope de `maxHeight`. Props opcionales lo
extienden sin tocar cómo se ven los modales que no las pasan:

- **`headerExtra`**: una segunda línea de contenido debajo de título/cerrar,
  todavía dentro del mismo bloque con borde inferior del header — para
  contexto adicional (ej. "Interrupción `<ref>`" + `CopyButton`) que no entra
  en la línea de título. Cuando viene, el título pasa a `pt-3.5 pb-0` (en vez
  de `py-4`) y `headerExtra` aporta su propio `mt-0.5 pb-3.5`: el gap entre
  las dos líneas queda compacto (mt-0.5) y el padding total de arriba+abajo
  del bloque sigue parejo (`pt-3.5` arriba, `pb-3.5` abajo).
- El tamaño del título es fijo (`text-heading-md`) en todos los modales:
  no hay prop para cambiarlo. Si el header lleva un dato propio en
  `headerExtra` (ej. una referencia mono), ese dato va en un token más
  liviano que el título (`text-code`, `text-body-sm`), nunca al mismo nivel.
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
  momento (la barra de contexto de registro, ver regla 7 de "Patrones de
  contenedor y tabla"), sin `border-b` propio (lo
  pone la fila de tabs de abajo) — la zona de contenido de trabajo (`flex-1
  min-h-0`) al final.
- **El scroll vive DENTRO de un contenedor propio** con su propio borde
  (`border border-border rounded-md overflow-auto`, `mx-5 mb-5` para
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

## `FaseIndicador`: fases de solo lectura

`FaseIndicador` (`src/App.tsx`, junto a `FaseReposicionFicha`) es un
indicador compuesto de 3 mini-cajas fijas R/S/T (`18×18` — tamaño pedido
explícitamente, sin paso de la escala de spacing que dé ese valor) — SIEMPRE
en ese orden, resaltando con tint + `border-chip-border` + `text-secondary`
las letras presentes en el valor real (ej. "RS" resalta R y S) y
`gray-300`/`border-border` las ausentes. Es de **solo lectura** (la
selección de fase existe en ABM y consultas, no acá): `<span>`, sin hover ni
cursor, fuera del orden de tabulación. Cada caja es `aria-hidden` y un
`sr-only` describe el estado con las fases presentes (ej. "Fases: R, S y T").
Es la única excepción a "sin cajas dentro de la caja" en la barra de
contexto: cada letra es un estado.

## `CopyButton`: acción de copiar con feedback real

`CopyButton` (`src/App.tsx`) es el botón de copiar al portapapeles de toda la
app (ej. la referencia de Interrupción en el header del modal "Tablas
relacionadas") — `w-8 h-8 rounded-sm text-text-muted hover:bg-fill-muted`, ícono
`Copy` (14px). Usa `navigator.clipboard.writeText` con fallback a
`document.execCommand("copy")` vía un `<textarea>` oculto para navegadores/
contextos sin Clipboard API. Solo si la copia realmente ocurrió (`ok === true`)
cambia el ícono a `Check` (`text-success`) por 1.5s y anuncia "\<label\>
copiada" en un `sr-only aria-live="polite"` — nunca simula el estado de éxito
si la operación falló o no está implementada.

Ese último punto es la razón por la que el botón "Copiar datos de la
reposición" (ícono `ClipboardList`, al final de los datos de la barra de
contexto de la reposición en "Tablas relacionadas"; sin borde en reposo, con
el hover secundario de la app) es una EXCEPCIÓN
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
  - Reposo: `text-text-muted`, hover `bg-fill-muted`.
  - Activo: `text-secondary font-medium` + `border-b-2 border-primary`
    superpuesto a la línea de base vía `-mb-px`.
- `role="tablist"` en el contenedor, `role="tab"` + `aria-selected` en cada
  botón, flechas izquierda/derecha para moverse entre opciones.
- Es para cambiar de **VISTA** — la selección de fila, chip o filtro sigue
  siendo el estado "seleccionado persistente" (tint `--color-primary-tint` +
  borde `--color-chip-border` + texto `--color-secondary`, ver
  `ButtonSelectGroup` — Origen/Tipo, tiles con cantidad `RelacionadaChip`). No
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

## Patrones de contenedor y tabla

1. **Header de contenedor** (`CardHeader`) = título + tag de código
   (`CodeBadge`) + contexto opcional (el registro padre de los datos de la
   card, prop `context`: `· RÓTULO valor`, ej. "· INTERRUPCIÓN `<ref>`" en
   Reposiciones) + acciones de alcance **TABLA** en `right` (Insertar,
   Exportar, Auditoría). **Nunca** acciones sobre el registro seleccionado.
   Toda card lleva `CardHeader`, también las de resumen (ej. Reclamos,
   Tablas relacionadas). El fondo gris es exclusivo del header; el cuerpo
   es siempre blanco. El tag es opcional. `size="compact"` achica el header
   (`py-2` con alto según contenido, en vez del `h-14` fijo) solo en el tier
   ≤760px — hoy, en las dos cards de detalle.
2. **Registro seleccionado**: se marca como fila resaltada en su tabla
   (`--color-primary-tint` + acento `inset 3px 0 0 var(--color-primary)`).
   En paneles que muestran datos hijos de ese registro, el registro va como
   `context` en el header. El detalle completo se abre desde la card de
   detalle clickeable (ej. `ReclamosResumenCompacto` → "Datos de la
   Interrupción"), sin un botón duplicado en ningún header. La card de
   detalle clickeable usa el patrón **stretched button**: el botón vive en
   el header (`right` de `CardHeader`, con `aria-label`) y su `::after`
   (`after:absolute after:inset-0`) cubre la card, que es `relative`; nunca
   se envuelve la card en un `<button>` (un heading dentro de un botón es
   HTML inválido). Hover y foco sobre toda la card (`hover:` en la card,
   `has-[:focus-visible]:outline-*`), y `ChevronRight` decorativo en el
   header como señal de que se abre.
3. **Trigger de filtro sin borde** (`FilterTrigger`): es el **ÚNICO** uso
   permitido de un botón sin borde en reposo, y solo como trigger de filtro
   dentro del toolbar de una tabla. Hover = el hover secundario de la app
   (`border-primary` + `bg-primary-tint` + `text-secondary`, el de
   `actionBtnCls`), nunca gris. Abierto = seleccionado persistente. Con filtro
   aplicado queda **siempre pintado** ("`{columna}: {valor}`" + ×, la × como
   botón hermano, nunca anidado). Las acciones siempre son outline
   (`actionBtnCls`). Existe en dos variantes con **el mismo trigger**
   (`FilterTriggerButton`):
   - **`list`** (default): lista de valores con conteo, selección única;
     elegir un valor aplica y cierra.
   - **`date-range`**: panel con atajos (Hoy / Últimas 24 h / Últimos 7
     días, que solo completan los campos), Desde y Hasta (fecha + hora), y
     pie con "Limpiar" + "Aplicar". Es la **única** variante con botón
     Aplicar, porque un rango se arma en dos pasos. Se permite un solo
     extremo; desde > hasta deshabilita Aplicar. Texto aplicado:
     `dd/mm hh:mm – dd/mm hh:mm`, `desde …` o `hasta …`.
4. **Toolbar de tabla**: va **FUERA** del contenedor de la tabla, sin fondo
   propio y **sin línea divisoria** entre el toolbar y la tabla; se vincula
   a la tabla por proximidad (toolbar `px-4 py-3`, contenedor de tabla
   `mx-4 mb-4`; en el modal "Tablas relacionadas", `px-5 pb-3` y
   `mx-5 mb-5`). Orden: buscador → divisor vertical (`w-px h-5
   bg-border`, el de `PersistentActionsBar`) → triggers de filtro →
   (derecha, `ml-auto`) "Limpiar filtros" (solo con ≥1 filtro activo; quita
   los filtros, no el texto del buscador) + contador "`N` de `M` registros"
   (`TableCounter`, siempre visible, también sin filtros, para que el layout
   no salte). El `thead` mantiene su fondo gris.
5. **Búsqueda con alcance explícito**: el buscador declara sus columnas
   (`searchCols` de `useTableToolbar`) y el placeholder las nombra (ej.
   "Buscar referencia…"; el `aria-label` es el mismo texto sin los puntos
   suspensivos). Prohibido "Buscar en la tabla…" en tablas nuevas. Con
   filtros por columna, el buscador cubre solo las columnas no filtrables.
6. **Estados sin datos**: nunca con opacidad reducida si el elemento muestra
   un valor (el valor es información, no decoración). Si no es interactivo,
   se renderiza como elemento no interactivo (`<div>`, fuera del orden de
   tabulación, `cursor-default`, sin hover) con borde punteado
   (`border-dashed border-border`, sin fondo) y texto `gray-500` — ej.
   los tiles de "Tablas relacionadas" con 0, "No" o sin selección.
7. **Barra de contexto de registro**: cuando una vista (modal, drawer) opera
   sobre un registro, arriba va un contenedor único (borde de card, fondo
   blanco) con identificador en semibold + tag de código de origen
   (`CodeBadge`, el de `CardHeader`) + metadatos como texto plano separados
   por "·", valor en `gray-700` y unidades/labels en `gray-500`. Sin chips
   internos, salvo estados de solo lectura (p. ej. fases, `FaseIndicador`)
   o controles. Navegación entre registros anclada a la derecha
   (`ml-auto self-start`: con el grupo izquierdo en wrap, queda arriba a la
   derecha; nunca scroll horizontal). Todo el contenido debajo pertenece a
   ese registro. Ej.: `FaseReposicionFicha` en "Tablas relacionadas"
   ("Reposición 1 `CDS4` · hora · Fase R S T · equipo · usuarios BT").
