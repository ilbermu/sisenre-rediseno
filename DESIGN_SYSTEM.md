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
    ej. "4 registros") o un nodo con su propio estilo, ej. un `ContextChip`
    variant="activa" para un dato que es SELECCIÓN DE DATOS, no descripción
    (ej. "Reposición 2 de 4 · fecha"). Derecha (`right`): un control o
    acción — ej. un `SegmentedSwitch` para elegir qué muestra la card.
  - Descripción opcional debajo del título: `text-body-sm text-gray-600`,
    `px-4 pb-3`.
  - Contenido (`children`): **sin padding propio**. Tablas y toolbars van de
    borde a borde dentro de la card, con un borde superior (`border-t
    border-gray-100`) que las separa del título — la card ya aporta el borde
    exterior, no hace falta repetirlo adentro de cada tabla (ver prop `bare`
    de `ReposicionesTable`).
- **Ninguna card se estira con `flex-1`** para llenar el alto del drawer — cada
  una mide lo que mide su contenido. La única excepción al scroll único del
  body es una lista navegable por teclado con su propio tope de filas (ej.
  `ReposicionesTable`, ver su prop `heightMode`), documentada como tal en el
  componente.
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
  cantidad (`STATUS_ITEMS`).

Si algo representa "esto es lo que estoy mirando ahora" entre varias vistas
posibles → `SegmentedSwitch`. Si representa "esto es lo que elegí/tengo
seleccionado" como dato → tint + borde celeste + texto navy. No usar
`bg-primary` relleno para ninguno de los dos (reservado a botones de acción
primarios).
