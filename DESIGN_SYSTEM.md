# DESIGN_SYSTEM.md

Fuente de verdad de los tokens: `src/index.css` (bloque `@theme`). Nada de hex
sueltos ni tamaños fuera de esa escala — si un valor no está ahí, no se usa.
Este archivo documenta *patrones de composición* (cómo se arman pantallas con
esos tokens), no repite los tokens en sí.

## Secciones dentro de drawers (`DrawerSection`)

Un drawer con más de una zona de contenido (ej. "Tablas relacionadas" en
Modificar interrupción) NO se arma con franjas de borde a borde separadas por
líneas divisorias — así el contenido flota y la jerarquía no se lee. Cada zona
es una card propia:

- **Panel del drawer**: `flex-col` con tres partes — header (`shrink-0`,
  fijo, fondo blanco, borde inferior — el único elemento de borde a borde del
  drawer), body (`flex-1 overflow-y-auto`, el único scroll principal) y,
  si hace falta, footer con acciones globales.
- **Body**: fondo `gray-50`, `padding: var(--spacing) * 5` (`p-5`), las
  secciones (`DrawerSection`) apiladas con `gap-4`.
- **`DrawerSection`** (`src/App.tsx`): `bg-white`, borde `gray-200`, radio
  `--radius-lg` (8px), sombra `--shadow-low` (la más baja de la escala),
  `overflow-hidden`.
  - Fila de título: `px-4 pt-4 pb-3`, `items-center justify-between`.
    Izquierda: título (`text-label font-semibold text-gray-900`) + `CodeBadge`
    opcional + un "meta" opcional — texto plano (`text-body-sm text-gray-500`,
    ej. "4 registros") o un nodo con su propio estilo para un dato que es
    SELECCIÓN DE DATOS, no descripción (ver `ContextChip`/`ReposicionStepper`
    abajo). Derecha (`right`): un control — `SegmentedSwitch` para elegir
    VISTA, o un `ReposicionStepper` para navegar un dato secuencial; nunca
    los dos al mismo tiempo por el mismo motivo (ver "no mezclar" más abajo).
  - Descripción opcional debajo del título: `text-body-sm text-gray-600`,
    `px-4 pb-3`. Si la card tiene un bloque propio más abajo que ya la
    contextualiza (ej. una ficha de detalle), la descripción se corre como
    `children` junto a ese bloque en vez de vivir pegada al título — la idea
    es que quede cerca de lo que describe, no que la prop se use siempre.
  - Contenido (`children`): **sin padding propio**. Tablas y toolbars van de
    borde a borde dentro de la card, con un borde superior (`border-t
    border-gray-100`) que las separa del título — la card ya aporta el borde
    exterior, no hace falta repetirlo adentro de cada tabla. Un bloque con su
    propio padding (ej. una ficha de detalle) puede convivir ahí también,
    siempre que gestione su propio `mx`/`mb`.
- **Ninguna card se estira con `flex-1`** para llenar el alto del drawer — cada
  una mide lo que mide su contenido.
- **`DrawerSection` lleva `shrink-0` en su contenedor raíz — no es
  cosmético.** El body es un flex column con `overflow-y-auto` y cada
  `DrawerSection` tiene `overflow-hidden`. Con overflow distinto de
  `visible`, el min-height automático de un flex item pasa a `0` (regla CSS
  `min-size: auto` de flexbox), así que si el contenido total supera el alto
  disponible, flex **achica las cards** en vez de dejar que el body
  scrollee — sin `shrink-0` esto pasó de verdad: elegir un tab con más
  contenido en "Tablas relacionadas" comprimía y recortaba la tabla de
  Reposiciones de al lado. Regla: **dentro de un contenedor flex con
  scroll, las secciones no se achican nunca — el que scrollea es el
  contenedor, no ellas.** Aplica a cualquier hijo directo de un contenedor
  `flex-col overflow-y-auto` que tenga su propio `overflow` no-visible, no
  solo a `DrawerSection`.

## `SegmentedSwitch` vs. selección persistente — no mezclar

Dos lenguajes visuales distintos para dos cosas distintas:

- **`SegmentedSwitch`** (riel gris `bg-gray-100` + pastilla blanca elevada
  `bg-white` + `--shadow-low` en la opción activa) es para cambiar de **VISTA**
  dentro de un mismo contenedor — tabs de contenido, ej. qué tabla se muestra
  en la card de "Tablas relacionadas". La opción activa no lleva conteos ni
  otro dato — es un selector de vista, no un indicador.
- El estado **"seleccionado persistente"** (tint `--color-primary-tint` +
  borde `--color-chip-border` + texto `--color-secondary`) sigue siendo para
  **SELECCIÓN DE DATOS**: filas de tabla, chips de contexto (`ContextChip`),
  filtros, toggles de valor (`ButtonSelectGroup` — Origen/Tipo), tiles con
  cantidad (`STATUS_ITEMS`), y su variante navegable, `ReposicionStepper`
  (ver abajo).

Si algo representa "esto es lo que estoy mirando ahora" entre varias vistas
posibles → `SegmentedSwitch`. Si representa "esto es lo que elegí/tengo
seleccionado" como dato → tint + borde celeste + texto navy. No usar
`bg-primary` relleno para ninguno de los dos (reservado a botones de acción
primarios).

### `ReposicionStepper` — variante navegable de `ContextChip` activa

Mismo lenguaje visual que `ContextChip` variant="activa" (fondo
`--color-primary-tint`, borde `--color-chip-border`, texto `--color-secondary`)
pero con flechas ‹ › adentro (`ChevronLeft`/`ChevronRight`, 24×24, radio
`--radius-sm`) para recorrer un dato SECUENCIAL sin salir del contenedor — ej.
las reposiciones de una interrupción en el drawer de "Tablas relacionadas".
Sigue siendo SELECCIÓN DE DATOS (actualiza el mismo estado que la selección
de fila de una tabla — `modSelectedFase`, no un tab/vista), por eso hereda el
tint en vez del lenguaje de `SegmentedSwitch`.

- Botones a los extremos, alto `h-6` dentro de una chip `h-8`: reposo sin
  fondo (hereda el `text-secondary` de la chip), hover `bg-white`. En el
  primer/último valor quedan `disabled` — opacidad reducida, `cursor-default`,
  sin hover — nunca ocultos, para que el centro (label + "n de N") no salte
  de posición al llegar a un extremo.
- Se usa cuando el dato en sí ES la navegación (no hay una "vista" separada
  que elegir) — si en cambio hay varias vistas de contenido para un mismo
  dato fijo, es `SegmentedSwitch`, no esto.
