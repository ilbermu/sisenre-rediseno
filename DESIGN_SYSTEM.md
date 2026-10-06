# DESIGN_SYSTEM.md

Fuente de verdad de los tokens: `src/index.css` (bloque `@theme`). Nada de hex
sueltos ni tamaños fuera de esa escala — si un valor no está ahí, no se usa.
Este archivo documenta *patrones de composición* (cómo se arman pantallas con
esos tokens), no repite los tokens en sí — salvo la escala tipográfica, que
se documenta acá abajo porque elegir token es una decisión de rol, no de
tamaño.

## Cambios

**06/10/2026** — limpieza de fundamentos (cada línea es un commit
independiente):

1. **Escala neutra única:** `--color-gray-*` (grises azulados) reemplazado
   por `--color-neutral-50…900` (cálida); tokens `--color-viz-*` para el
   timeline de reclamos.
2. **Foco único:** `--color-focus` = `#076AEE`; constantes `FOCUS_RING`,
   `FOCUS_RING_INSET` y `FIELD_FOCUS`.
3. **Alto de controles:** `--control-sm` / `--control-md` en px por tier,
   fuera de `--spacing` (mínimo 24px, WCAG 2.5.8).
4. **Tracking en el token:** `--text-heading-xs--letter-spacing`.
5. **Íconos:** constante `ICON` (xs 12 · sm 14 · md 16 · xl 40) y trazo 1.5.
6. **Capas:** tokens `--z-*` por rol.
7. **Movimiento:** `--duration-*`, `--ease-standard`, transiciones por
   propiedad, `prefers-reduced-motion`.
8. **Semánticos:** success / warning / error / info / neutral con el mismo
   esquema (base, bg, border, text-strong).
9. **Voz y formatos:** voseo, mayúscula solo en la primera palabra,
   `formatNumero` / `formatFecha` / `formatFechaHora` y `VALOR_VACIO`.
10. **Limpieza:** comentario de botones, Inter sin peso 700, nombre del
    paquete `sisenre`.

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
- **La jerarquía se lee con tamaño y peso, no con mayúsculas.** El
  `uppercase` sobre `heading-xs` se mantiene, pero no se agregan nuevos para
  "subir" un texto de nivel. El tracking de `heading-xs` (0.06em) viene del
  token (`--text-heading-xs--letter-spacing`): no se escribe `tracking-[…]`
  junto a `text-heading-xs`. Los `tracking-[…]` que quedan sobre `caption`
  son heredados y no se agregan nuevos.
- **`font-mono` es una familia, no un tamaño.** Tiene dos combinaciones
  documentadas y ninguna más:
  - `text-code font-mono` — el rol para **datos**: IDs, referencias, fechas,
    códigos de equipo. Va a 12px porque JetBrains Mono a 12 empareja
    ópticamente con Inter a 13 en la misma fila.
  - `text-caption font-mono` — **badges y contadores**: código de tabla
    (CDS4, etc.), contadores del sidebar, letra de fase.

## Superficies: fondos, bordes y sombras

Tokens en `@theme` de `src/index.css`. Se eligen por **rol**; las clases
`bg-gray-*` (la escala ya no existe), `bg-neutral-*` fuera de los tokens de rol, `border-gray-*`, `text-gray-*` y `bg-white` no se usan.

| Token | Clase | Uso |
|---|---|---|
| `--color-bg-app` | `bg-bg-app` | `#FAFAFA` (gris neutro; antes `#FAF9F5`, crema). Fondo de página: shell de la app, selector de herramienta, sidebar, top bar y encabezado de página |
| `--color-surface` | `bg-surface` | Todo lo que se apoya sobre el fondo: cards, modales, popovers, dropdowns, inputs, botones secundarios, paginadores |
| `--color-border` | `border-border`, `bg-border` | Borde de contenedores (cards, popovers, dropdowns), divisores (bajo un header, bajo el `thead`, pie de tabla) y líneas de 1px (`h-px` / `w-px bg-border`) |
| `--color-border-strong` | `border-border-strong` | Controles: inputs, selects, botones secundarios, checkbox y radio, badges de código. Tienen que seguir leyéndose como campos |
| `--color-border-subtle` | `border-border-subtle` | Separador entre filas de una tabla o de una lista |
| `--color-fill-subtle` | `bg-fill-subtle` | Relleno de `thead`, pie de tabla, barra de filtros activos, filas de "Resumen de cambios", campos bloqueados |
| `--color-fill-muted` | `bg-fill-muted` | Hover neutro (filas, ítems de menú, botones del sidebar y de ícono), campos de solo lectura o deshabilitados, celdas vacías del mini calendario, fondo del badge de tabla |

Reglas:

- **Los rellenos neutros son siempre translúcidos** (`fill-subtle`,
  `fill-muted`): negro cálido con alfa, no un gris opaco. Así toman la
  temperatura de lo que tienen debajo (blanco en una card, el gris
  `#FAFAFA` del fondo en el sidebar) y nunca aparece un gris azulado sobre un fondo cálido. No se
  agregan grises opacos de relleno.
- **Excepción — elementos `sticky`:** un `th` sticky necesita fondo opaco,
  porque con el relleno translúcido se ve pasar el contenido que scrollea
  por debajo. Para eso existe `bg-fill-subtle-solid` (mismo color que
  `bg-fill-subtle` sobre `surface`, sin transparencia). El fondo va en los
  `th`, no en el `<tr>`: si van los dos, el alfa se suma.
- **Los bordes también son translúcidos**, por la misma razón.
- **Headers de card y de modal no llevan fondo propio:** son transparentes
  con `border-b border-border`. Se separan del cuerpo con la línea, y al no
  pintar nada dejan ver el radio del contenedor.
- **Todo elemento con fondo que toca una esquina de un contenedor
  redondeado lleva el radio de ese contenedor** en ese lado: `rounded-t-md`
  / `rounded-b-md` dentro de un wrapper `md`, `rounded-t-lg` / `rounded-b-lg`
  en una card, `rounded-t-xl` en un modal. Ej.: headers "de lista" y pies
  de tabla con `bg-fill-subtle`.
- **Las cards no usan `overflow-hidden` para recortar esquinas:** recorta
  también dropdowns, popovers y flyouts. El recorte por `overflow` queda
  solo para wrappers de tabla (el `<tr>`/`<th>` no admite radio y adentro
  no hay popovers).
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
bordes. `text-gray-*`, `text-neutral-*` y `text-black` no se usan: el texto sale de los tokens de rol.

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
`bg-app`. Valores con `bg-app` = `#FAFAFA`.

| Color | surface | bg-app | fill-subtle | fill-muted | fill-subtle sobre bg-app | fill-muted sobre bg-app | primary-tint |
|---|---|---|---|---|---|---|---|
| `text` `#1F1E1D` | 16.64 | 15.95 | 15.67 | 14.72 | 15.01 | 14.11 | 14.99 |
| `text-muted` `#63625D` | 6.11 | 5.86 | 5.75 | 5.41 | 5.51 | 5.18 | 5.51 |
| `icon` `#7D7C77` | 4.18 | 4.01 | 3.94 | 3.70 | 3.77 | 3.55 | 3.77 |
| `text-faint` `#8F8E89` | 3.28 | 3.14 | 3.09 | 2.90 | 2.96 | 2.78 | 2.96 |
| `secondary` (navy) `#1D558C` | 7.69 | 7.37 | 7.24 | 6.80 | 6.94 | 6.52 | 6.93 |

## Radios

`--radius-*: initial` borra la escala default de Tailwind: solo existen
estos seis, y `rounded` sin sufijo no se usa. Se elige por rol del elemento.

| Token | Valor | Uso |
|---|---|---|
| `rounded-xs` | 4px | Badges de código, checkbox, celdas del mini calendario, leyenda del cronograma, chips cuadrados |
| `rounded-sm` | 6px | Inputs, selects, todos los botones (`sm`, `md`, paginación, ícono), segmented, ítems de menú. Contenedores anidados dentro de una card de trabajo (tiles de Tablas relacionadas, barra de filtros aplicados) |
| `rounded-md` | 8px | **Cards de trabajo** (Búsqueda, Interrupciones, Reposiciones y los paneles del ABM): pantallas densas donde las cards se tocan entre sí. Dropdowns y popovers (calendario, "Más filtros"). Contenedores anidados dentro de una card de contenido o de un modal |
| `rounded-lg` | 12px | **Cards de contenido** (Inicio, cronograma, Generación de txt, Planilla consolidada, Gestor de notas, Auditoría), cards del selector de herramienta, card del login |
| `rounded-xl` | 16px | Modales |
| `rounded-full` | 9999px | Avatares, chips redondos, días del calendario, badges contadores |

- **Regla de anidado:** un elemento dentro de otro con padding usa un radio
  menor (radio interno ≈ radio externo − padding). Una caja con borde dentro
  de una card de contenido (`lg`) es `md`; dentro de una card de trabajo
  (`md`) es `sm`.
- **Cards de trabajo = `md`, cards de contenido = `lg`.** La vista de
  trabajo (Consultas de interrupción y ABM) usa un token menos que el resto:
  más cards por pantalla, más juntas, y un radio grande les come espacio
  útil en las esquinas.
- Los `rx` de los SVG (timeline de reclamos) son geometría del gráfico, no
  tokens de UI.

## `Modal`: header = mismo tratamiento que `CardHeader`

El bloque de header de `Modal` (título/cerrar + `headerExtra`, si viene) es
transparente, con `border-b border-border` como divisor con el body — EL
MISMO tratamiento que `CardHeader` (Búsqueda/Interrupciones/Reposiciones:
sin fondo propio + `border-b border-border`), para que headers de card y headers de
modal se lean como el mismo elemento en toda la app. No es una prop opt-in:
aplica a los 13 usos de `Modal` del archivo por igual. El body sigue en
`bg-surface` (default de `Modal`, ver `bodyClassName` si un modal puntual
necesita otra cosa); el footer no cambia.

## `Modal` extendido: header propio, body sin scroll propio

`Modal` (`src/App.tsx`) es el estándar para toda acción que requiera un
diálogo. Por default arma su propio header (sin fondo propio, título
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
  fix que usaba la tabla de Reposiciones, hoy `ReposicionesLista`).
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
`text-text-faint`/`border-border` las ausentes. Es de **solo lectura** (la
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

## Escala neutra y tokens de datos

Una sola escala de grises: `--color-neutral-50…900`, cálida (stone).

| Paso | Hex | Paso | Hex |
|---|---|---|---|
| 50 | `#FAFAF9` | 500 | `#78716C` |
| 100 | `#F5F5F4` | 600 | `#57534E` |
| 200 | `#E7E5E4` | 700 | `#44403C` |
| 300 | `#D6D3D1` | 800 | `#292524` |
| 400 | `#A8A29E` | 900 | `#1C1917` |

- **No se usa la escala directamente en componentes:** el fondo, el borde y
  el texto salen de los tokens de rol (`surface`, `border`, `text-muted`…);
  la escala es la base de la que se derivan los semánticos neutrales y los
  tokens de datos. `--color-gray-*` no existe.
- **Tokens de datos (`--color-viz-*`)** — geometría de gráficos, por rol,
  no por tono (hoy, `ReclamosTimeline`):

  | Token | Valor | Uso |
  |---|---|---|
  | `--color-viz-track` | `neutral-200` | pista del gráfico y extremo "vacío" del degradé de densidad |
  | `--color-viz-milestone` | `neutral-400` | hito de reclamo dentro del 80% |
  | `--color-viz-milestone-muted` | `viz-milestone` al 70% sobre blanco | hito fuera del 80% |
  | `--color-viz-tick` | `neutral-300` | marcas del eje de horas |

  Los colores de marca del gráfico (primer reclamo, banda de densidad)
  siguen saliendo de `secondary` / `primary`.
- El tooltip del sidebar usa `--color-text` de fondo.

## Foco

Un solo color de foco, `--color-focus` = `#076AEE` (mismo valor que
`primary-strong`, 4.88:1 sobre blanco), y tres constantes en `App.tsx`:

| Constante | Para qué | Clases |
|---|---|---|
| `FOCUS_RING` | anillo de un control (botón, trigger de filtro, link, ícono) | `focus-visible:outline-2 outline-focus outline-offset-2` |
| `FOCUS_RING_INSET` | elementos que tocan el borde de su contenedor: filas, secciones, listas navegables (`role="listbox"`) | mismo anillo con `-outline-offset-2` (hacia adentro, el `overflow` del padre no lo recorta) |
| `FIELD_FOCUS` | **campos** de texto (input, select, textarea) | `focus:outline-none focus:border-focus focus:ring-2 focus:ring-focus/10` |

- El foco de un campo (borde + halo) es distinto del anillo de un control:
  por eso `FIELD_FOCUS` es aparte y se usa en **todos** los campos
  (`MOD_FIELD_CLS`, `MOD_SELECT_CLS`, buscador de tabla, login…).
- Nada de `focus-visible:outline-*` ni `ring-primary/30` sueltos: se usa la
  constante.
- **Ningún elemento interactivo queda con `outline-none` sin reemplazo
  visible.** Una sección con stretched button (`has-[:focus-visible]`) pinta
  el mismo anillo inset en la sección entera; el panel de un modal
  (`tabIndex=-1`, foco programático, no interactivo) es la única excepción.

## Alto de controles

Los controles tienen alto en px fijo, **fuera de `--spacing`**: en los tiers
compactos nunca bajan de 24px (WCAG 2.5.8, tamaño mínimo del objetivo).

| Token | > 900px de alto | ≤ 900px | ≤ 760px |
|---|---|---|---|
| `--control-sm` | 28px | 26px | 24px |
| `--control-md` | 36px | 32px | 30px |

`BTN_SM` usa `h-(--control-sm)` y `BTN_MD` `h-(--control-md)`. Mapeo por
control — **elementos que comparten fila usan el mismo token**:

| Control | Token |
|---|---|
| Botones `BTN_SM` (acciones de fila, toggles), segmented compacto (`ButtonSelectGroup` por defecto), periodicidad | `sm` |
| Buscador de tabla (`TableToolbar`) y `FilterTrigger` (viven juntos en el toolbar) | `sm` |
| Chips redondeados (rango, filtros aplicados), campo de solo lectura compacto (`ReadOnlyField`), buscador de listas del selector | `sm` |
| Botones `BTN_MD` (Buscar, Limpiar, Guardar, pie de modal), `PeriodSelector`, botón de calendario | `md` |
| Campos: `MOD_FIELD_CLS` / `MOD_SELECT_CLS` (input, select, `ValuePicker`, `DateTimeField`), campos de solo lectura estilo campo, nota manual | `md` |
| Segmented en filas de campos con botones md (`BTN_SEG_MD`: filter bar, grillas ABM) | `md` |

Íconos-botón cuadrados (`w-7 h-7`, `w-8 h-8`) y tabs (`h-10`) siguen con alto
fijo propio.

## Íconos

Constante `ICON` en `App.tsx`: `xs` 12 · `sm` 14 · `md` 16 · `xl` 40.

- Se usa siempre `size={ICON.sm}`, nunca un número suelto. Un ícono de 13px
  pasa a `sm`, de 15px a `md`.
- `strokeWidth` 1.5 en todos, salvo `xl` (estado vacío, `Inbox`), que usa
  1.25.
- Íconos SVG propios (check del checkbox, ×, flechas de orden) son
  geometría del componente y llevan su trazo propio.

## Capas

Tokens de z-index por rol, `z-(--z-…)`:

| Token | Valor | Elementos |
|---|---|---|
| `--z-sticky` | 10 | `th` sticky de tablas, contenido sobre el pill del sidebar |
| `--z-raised` | 20 | filter bar de Consultas de interrupción y backdrop del flyout "Más filtros" |
| `--z-dropdown` | 30 | dropdowns, popovers, flyouts (el menú del sidebar colapsado queda siempre sobre el filter bar) |
| `--z-overlay` | 40 | scrim de modales |
| `--z-modal` | 50 | panel de modal |
| `--z-toast` | 60 | notificaciones (sin uso todavía) |
| `--z-tooltip` | 70 | tooltip del sidebar |

El flyout "Más filtros" (`dropdown`) queda sobre su backdrop y sobre el
filter bar (`raised`); el backdrop está en la misma capa que el filter bar y,
por ir después en el DOM, lo cubre mientras el flyout está abierto.

## Movimiento

| Token | Valor | Uso |
|---|---|---|
| `--duration-fast` | 100ms | hover de filas y chips |
| `--duration-base` | 150ms | default: botones, campos, toggles, íconos que rotan |
| `--duration-slow` | 250ms | destello de la ficha de reposición, colapso del sidebar |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0.38, 0.9)` | curva única |

- Las utilidades `transition-*` toman estos valores por default
  (`--default-transition-*`); las duraciones explícitas se escriben
  `duration-(--duration-base)`.
- **Nada de `transition-all`:** se transiciona la propiedad que cambia —
  `transition-colors`, `transition-opacity`, `transition-transform` o
  `transition-[…]` con las propiedades exactas (ej. botón con
  `active:scale-*`: `transition-[color,background-color,border-color,transform]`).
- `@media (prefers-reduced-motion: reduce)` lleva transiciones y animaciones
  a ~0ms. El spinner de carga (`animate-spin`) queda afuera: es información.

## Semánticos

Cinco familias con el mismo esquema (`src/index.css`):

| Familia | base | bg | border | text-strong |
|---|---|---|---|---|
| `success` | `#16A34A` | `#DCFCE7` | `#86EFAC` | `#15803D` |
| `warning` | `#D97706` | `#FFFBEB` | `#FCD34D` | `#B45309` |
| `error` | `#DC2626` | `#FEE2E2` | `#FCA5A5` | `#B91C1C` |
| `info` | `#076AEE` | `#EBF4FF` | `#B9D2FB` | `#1D558C` |
| `neutral` | `#78716C` | `#F5F5F4` | `#D6D3D1` | `#44403C` |

- Clases: `bg-<familia>-bg`, `border-<familia>-border`,
  `text-<familia>-text-strong`, y la base como `text-<familia>` / `bg-<familia>`.
- `error` suma `--color-error-border-hover` (hover del botón destructivo).
- `success`, `warning` y `error` llevan significado; `neutral` es para
  estados sin carga semántica; `info` está en la familia azul de la marca.
  **`info` y `neutral` todavía no se usan en ningún componente.**

## Voz y formatos

- **Voseo en toda la app:** "Seleccioná", "Ingresá", "Completá",
  "Presioná" — nunca la forma de usted ("Seleccione", "Ingrese").
- **Mayúscula solo en la primera palabra** de labels, títulos y botones
  ("Datos de la interrupción"), salvo siglas y nombres propios (CDS2,
  BT/MT/AT, Edenor, CTs). Los labels abreviados heredados de la base
  ("Hue Ini SR", "Max Med SR"…) no se tocan.
- **Helpers únicos** (`App.tsx`), sin `toLocaleString` ni armado a mano:

  | Helper | Resultado |
  |---|---|
  | `formatNumero(n)` | es-AR, miles con punto desde 1.000 ("1.234.567") |
  | `formatFecha(d)` | `dd/mm/aaaa` |
  | `formatHora(d)` | `hh:mm`, 24 h |
  | `formatFechaHora(d)` | `dd/mm/aaaa hh:mm`, 24 h |
  | `VALOR_VACIO` | `"—"`, para todo valor ausente o no aplicable |

## Aire: chrome vs datos

`--spacing` es la palanca de densidad de toda la app y achica todo por
igual. Para dar más aire a las pantallas altas sin tocar las notebooks se
separa el **chrome** de los **datos**:

- **Chrome (estructura):** padding de página, gaps entre bloques de la
  página (encabezado, filter bar, fila de cards), gap entre cards, y el
  padding de las cards (header, toolbar, extremos de tabla, paginador,
  secciones). Usa las variables de chrome.
- **Datos:** filas de tabla, celdas, inputs, botones, filter bar. Siguen con
  `--spacing`, sin variables de chrome.

| Variable | Qué controla | > 900px de alto | ≤ 900px y ≤ 760px |
|---|---|---|---|
| `--card-px` | padding horizontal de card (header, toolbar, extremos de tabla, paginador, secciones) | 24px | `calc(var(--spacing) * 4)` |
| `--card-header-py` | padding vertical del header con divisor | 16px | `calc(var(--spacing) * 3)` |
| `--card-section-py` | aire superior de una sección y inferior de su cuerpo | 20px | `calc(var(--spacing) * 3)` |
| `--page-px` | padding horizontal de la página | 32px | `calc(var(--spacing) * 5)` |
| `--page-pt` | padding superior (e inferior) de la página | 24px | `calc(var(--spacing) * 5)` |
| `--page-gap` | gap vertical entre encabezado, filter bar y fila de cards | 24px | `calc(var(--spacing) * 4)` |
| `--cards-gap` | gap entre cards | 24px | `calc(var(--spacing) * 4)` |

Se definen en `:root` de `src/index.css`: en px fijos por defecto y, en los
dos tiers `max-height` (900px y 760px), en términos de `--spacing` para dar
**exactamente** los valores de antes. Se usan con la sintaxis de Tailwind v4:
`px-(--card-px)`, `gap-(--cards-gap)`.

**Regla: el aire va en la estructura, nunca en las filas de datos.** Más
espacio entre cards, headers y secciones; las filas, celdas y controles no
crecen (más filas visibles por pantalla). Una columna que se alinea con el
header (primera/última celda) usa `--card-px` solo en ese borde.

Aplicado hoy en Consultas de interrupción. Otras pantallas migran de a una.

## Orden de botones

Aplica a header de página, header de card, filter bar, toolbar y pie de modal:

1. **Secundarios** (outline) primero.
2. **Primario** después — máximo uno por zona, siempre el último a la
   derecha de los botones normales.
3. **Overflow ⋯** (si existe) en el extremo derecho, después del primario.

Las acciones de una zona se alinean a la derecha de esa zona (`ml-auto` /
`justify-end`). Ejemplo: `[Limpiar] [Buscar] [⋯]`; pie de modal:
`[Cancelar] [Guardar]`.

## Lista de filas

Alternativa a la tabla para registros con **pocos campos**, un
**identificador principal** y metadatos secundarios (ej. Reposiciones en
Consultas de interrupción). Si el usuario necesita comparar columnas u
ordenarlas, va tabla.

```
┌──────────────────────────────────────────────────────────┐
│ Reposición 1  EQ-0042  Transformador 13,2/0,4 kV…  [RST] 14:50  32 usuarios BT │
├──────────────────────────────────────────────────────────┤  border-b border-border-subtle
│ Reposición 2  …                                           │  (la última, sin borde)
└──────────────────────────────────────────────────────────┘
```

- **Sin `thead`.** Cada registro es una fila de **una línea**, de alto fijo
  (44px, fuera de `--spacing`) y `px-(--card-px)`.
- **Izquierda (identidad, `min-w-0 flex-1`, trunca):** identificador en
  `text-body text-text` (seleccionada: `text-secondary font-medium`),
  seguido de código en `text-code font-mono text-text-muted` y descripción
  en `text-body-sm text-text-muted` truncada, con `title` del texto completo.
- **Derecha (metadatos, `shrink-0`, `gap` fijo, alineada a la derecha):**
  indicadores y datos en orden fijo — `FaseIndicador` → hora en `text-code
  font-mono tabular-nums text-text-muted` → conteo en `text-body-sm
  tabular-nums text-text-muted`.
- **Comportamiento:** igual que una tabla seleccionable — hover
  `fill-muted`, seleccionada `primary-tint` + `inset-shadow-row-selected`,
  scroll propio (`min-h-0`), flechas arriba/abajo, foco visible inset.
- **Semántica:** contenedor `role="listbox"` con `aria-label`, filas
  `role="option"` con `aria-selected`.
- **Sin acciones por fila** (ni menú ⋯): las acciones son de la card.
- **Vacío:** el mismo estado de las tablas (Inbox + texto).

## Header de card

Un solo componente, `CardHeader` (`src/App.tsx`), para toda card y toda
sección de card.

```
┌──────────────────────────────────────────────────────────┐
│ Título [CDS4]                                   [acciones]│
│ subtítulo en gris, con el ID en mono                      │
└──────────────────────────────────────────────────────────┘
```

Con `divider` (header de una card con secciones) se suma la línea inferior:

```
┌──────────────────────────────────────────────────────────┐
│ Título [CDS4]                                   [acciones]│  py-(--card-header-py)
│ subtítulo en gris, con el ID en mono                      │
├──────────────────────────────────────────────────────────┤  divisor, siempre visible
```

| Slot | Prop | Tokens | Contenido |
|---|---|---|---|
| Título | `title` | `text-heading-md text-text` | Nombre de la card. Una línea, trunca |
| Badge | `tag` | `CodeBadge` (`text-caption font-mono`) | Código de origen (CDS2, CDS4…), **en línea con el título**. Opcional |
| Subtítulo | `subtitle` | `text-body-sm text-text-muted`; IDs y fechas en `text-code font-mono` | Contexto de los datos, debajo del título. Opcional |
| Acciones | `actions` | botones `actionBtnCls` / `BTN_MD` | A la derecha, centradas en vertical. Opcional |

- **Sin fondo.** Por defecto tampoco lleva línea divisoria: la separación
  con el contenido la da el espaciado (`pt-3 pb-2`) y el alto sale del
  contenido (no hay alto fijo). El header de una **card con secciones**
  (ver la sección siguiente) lleva siempre el divisor (`divider`), que
  nunca queda pegado al `thead` (el toolbar va en el medio).
- **Badge en línea, derecha solo para acciones.** El badge CDS va siempre
  junto al título; el lado derecho del header queda reservado para
  `actions`. No hay variante con el badge a la derecha.
- **Mismo padding horizontal que el cuerpo de la card.** En las cards con
  secciones de la vista de trabajo todo sale de `--card-px` (`chrome`, ver
  "Aire: chrome vs datos"): header, toolbar, primera y última celda de la
  tabla, paginador y secciones. En el resto, si el cuerpo de una card usa
  otro padding, el header lo iguala con `padX` (`px-4` por defecto, `px-5`
  en los paneles del ABM y Notas, `px-6` en Exportación, Consolidación y
  Filtros).
- **`chrome`:** el padding sale de las variables de chrome en vez de
  `--spacing`: `px-(--card-px)` (pisa `padX`), `py-(--card-header-py)` con
  `divider` y `pt-(--card-section-py)` en `level="section"`.
- **Cuándo lleva subtítulo:** cuando los datos de la card dependen de algo
  que no está a la vista en la propia card —
  - el **registro padre** ("INTERRUPCIÓN SELECCIONADA `AFZ…`" en
    Reposiciones, "Interrupción `AFZ…`" en Reclamos; "REPOSICIÓN `1 de 5 ·
    22/07/2026 14:50`" en Tablas relacionadas);
  - el **alcance** de lo que se muestra, cuando no hay un toolbar donde
    ponerlo (en Interrupciones el contador "40 de 40 registros" va en el
    toolbar, no en el header).

  No lleva subtítulo si solo repetiría el título o describiría la card.
- **Cómo se escribe:** en minúsculas (sin `uppercase`), sin "·" inicial; el
  "·" solo separa fragmentos dentro del subtítulo. Un ID, una referencia o
  una fecha va en `text-code font-mono`; el resto, en el `body-sm` del
  subtítulo.
- **`reserveSubtitle`:** reserva la línea aunque todavía no haya nada que
  mostrar (sin selección, sin resultados), para que el header no cambie de
  alto cuando el subtítulo aparece y dos cards lado a lado queden alineadas.
- **Subtítulo etiquetado** (`SubtituloEtiquetado`): en las cards con
  secciones, el registro padre va como etiqueta + valor: etiqueta en
  `text-heading-xs uppercase` y valor en `text-code font-mono`, los dos en
  el `text-muted` del subtítulo.
- **Header de tabla (`thead`):** alto fijo de 32px,
  borde incluido, con el texto centrado en vertical y sin padding vertical.

## Card con secciones

Anatomía de las cards de la vista de trabajo (Interrupciones y
Reposiciones en Consultas de interrupción): **un único contenedor**
dividido en franjas por líneas `border-border` a todo el ancho.

```
┌──────────────────────────────────────────────────────────┐
│ Título (heading-md) [CDS4]                   [acciones]  │  header
│ ETIQUETA (heading-xs) valor-en-mono                      │
├──────────────────────────────────────────────────────────┤  divisor del header (siempre)
│ [Buscar referencia…] | Fecha ▾              40 de 40 reg. │  toolbar (siempre; sin datos: deshabilitado, "0 registros")
├──────────────────────────────────────────────────────────┤  línea superior de la tabla
│ COLUMNA           COLUMNA                    (fill-subtle)│  thead
│ fila…                                                     │
├──────────────────────────────────────────────────────────┤
│ Anterior       Página 1 de N           Siguiente (fill-s.)│  paginación (opcional)
├──────────────────────────────────────────────────────────┤  línea de sección
│ Título de sección (heading-sm)                            │  sección
│ contenido de la sección                                   │
└──────────────────────────────────────────────────────────┘
```

- **Header de card:** `CardHeader` con `divider` y `chrome` — título
  `heading-md` con el badge CDS en línea, acciones (si hay) a la derecha,
  línea inferior `border-b border-border` a todo el ancho, siempre visible.
- **Toolbar siempre presente:** se renderiza aunque no haya resultados.
  Sin resultados, el buscador y el filtro quedan deshabilitados (estado
  disabled del sistema: `fill-muted` + `text-faint`, sin hover) y el
  contador dice "0 registros". Así el divisor del header nunca queda pegado
  al `thead`.
- **Tablas al ras:** sin margen lateral, sin borde ni radio propios. Llevan
  una línea superior `border-border` (si la tabla va justo debajo del
  header, esa línea es el divisor del header — nunca dos líneas juntas) y
  el `thead` en `fill-subtle`. La paginación va al pie de la tabla, con
  `border-t` y fondo `fill-subtle`.
- **Secciones** (Reclamos durante la interrupción, Tablas relacionadas):
  separadas por `border-t border-border` a todo el ancho, sin borde, fondo
  ni radio propios. Título en `heading-sm` (`CardHeader` con
  `level="section"`, sin divisor). Si la sección pinta un fondo (hover) y
  es la última de la card, lleva el radio inferior de la card
  (`rounded-b-md`).
- **No se anidan contenedores con borde dentro de una card:** nada de
  cards dentro de cards, ni tablas con borde/radio propios, ni bloques con
  fondo y borde. Todo lo que necesite separarse es una sección.
- **Alto:** cada card se ajusta a su contenido; dos cards lado a lado no
  se fuerzan al mismo alto (`items-start` en la fila). El tope es el alto
  disponible (`max-h-full`): si el contenido no entra, la tabla se achica y
  scrollea adentro (`min-h-0 overflow-y-auto`), nunca la página.
- **Sin `overflow-hidden` en la card:** recortaría el panel del filtro de
  Fecha y cualquier otro popover (ver "Superficies").

## Patrones de contenedor y tabla

1. **Header de contenedor** (`CardHeader`): ver "Header de card" más
   abajo. Toda card y toda sección de card lleva `CardHeader`, también las
   de resumen (Reclamos, Tablas relacionadas); ningún header se arma a
   mano. En `actions` van solo acciones de alcance **TABLA** (Insertar,
   Exportar, Auditoría), **nunca** acciones sobre el registro seleccionado.
2. **Registro seleccionado**: se marca como fila resaltada en su tabla
   (`--color-primary-tint` + acento `inset 3px 0 0 var(--color-primary)`).
   En paneles que muestran datos hijos de ese registro, el registro va como
   subtítulo del header (ej. "Interrupción `<ref>`"). El detalle completo se abre desde la card de
   detalle clickeable (ej. `ReclamosResumenCompacto` → "Datos de la
   Interrupción"), sin un botón duplicado en ningún header. La card de
   detalle clickeable usa el patrón **stretched button**: el botón vive en
   el header (`actions` de `CardHeader`, con `aria-label`) y su `::after`
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
   a la tabla por proximidad (toolbar `px-(--card-px) py-3` en la vista de trabajo, `px-4 py-3` en el resto; en la vista de trabajo
   la tabla va apoyada en la card, sin contenedor propio — ver regla 8; en
   el modal "Tablas relacionadas", `px-5 pb-3` y contenedor `mx-5 mb-5`). Orden: buscador → divisor vertical (`w-px h-5
   bg-border`) → triggers de filtro → (derecha, `ml-auto`) "Limpiar
   filtros" (solo con ≥1 filtro activo; quita los filtros, no el texto del
   buscador) + contador "`N` de `M` registros" (`TableCounter`), tanto en
   las cards (Interrupciones) como en los modales. El `thead` mantiene su
   relleno `fill-subtle`.
5. **Búsqueda con alcance explícito**: el buscador declara sus columnas
   (`searchCols` de `useTableToolbar`) y el placeholder las nombra (ej.
   "Buscar referencia…"; el `aria-label` es el mismo texto sin los puntos
   suspensivos). Prohibido "Buscar en la tabla…" en tablas nuevas. Con
   filtros por columna, el buscador cubre solo las columnas no filtrables.
6. **Estados sin datos**: nunca con opacidad reducida si el elemento muestra
   un valor (el valor es información, no decoración). Si no es interactivo,
   se renderiza como elemento no interactivo (`<div>`, fuera del orden de
   tabulación, `cursor-default`, sin hover) con borde punteado
   (`border-dashed border-border`, sin fondo) y texto `text-text-muted` — ej.
   los tiles de "Tablas relacionadas" con 0, "No" o sin selección.
7. **Barra de contexto de registro**: cuando una vista (modal, drawer) opera
   sobre un registro, arriba va un contenedor único (borde de card, fondo
   blanco) con identificador en semibold + tag de código de origen
   (`CodeBadge`, el de `CardHeader`) + metadatos como texto plano separados
   por "·", valor en `text-text` y unidades/labels en `text-text-muted`. Sin chips
   internos, salvo estados de solo lectura (p. ej. fases, `FaseIndicador`)
   o controles. Navegación entre registros anclada a la derecha
   (`ml-auto self-start`: con el grupo izquierdo en wrap, queda arriba a la
   derecha; nunca scroll horizontal). Todo el contenido debajo pertenece a
   ese registro. Ej.: `FaseReposicionFicha` en "Tablas relacionadas"
   ("Reposición 1 `CDS4` · hora · Fase R S T · equipo · usuarios BT").
8. **Una card, una superficie** (vista de trabajo): dentro de una card no
   hay cajas con borde, radio o fondo propios.
   - **Tablas:** van apoyadas directamente en la card, de borde a borde; el
     `thead` (`fill-subtle`) es su único relleno. Si el scroll interno
     necesita un wrapper, no lleva borde ni fondo. La primera y la última
     celda de cada fila usan el padding horizontal de la card (`pl-(--card-px)` /
     `pr-(--card-px)`) para alinear con el header y el toolbar; el pie con paginador
     va con `border-t` y fondo `fill-subtle`. Ver "Card con secciones".
   - **Bloques secundarios** (Reclamos durante la interrupción, Tablas
     relacionadas): son **secciones** de su card, separadas por `border-t
     border-border`. No son cards anidadas.
   - **Búsqueda sin contenedor:** en Consultas de interrupción la fila de
     filtros no es una card: se apoya directo en el fondo de la página,
     debajo del encabezado de página (breadcrumb + título `heading-lg` +
     selector de período a la derecha, sin borde inferior).
   - **Acciones del registro** (Desarmes, Lotes, Nivel/Tipo, Replicar,
     Cambia fases, Alta clientes, Intercambio): ya no viven en la pantalla;
     son los ítems del grupo desplegable "Herramientas" del menú lateral
     (mismo patrón que "Alta, Baja y Modificación"; un solo grupo
     desplegado a la vez). Los que dependen de la interrupción seleccionada
     quedan deshabilitados (`text-faint`) hasta definir cómo se resuelven.
   - **Gap entre cards:** un único valor en toda la pantalla (`gap-4`),
     vertical y horizontal, en todos los tiers.
