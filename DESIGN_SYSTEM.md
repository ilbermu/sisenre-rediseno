# DESIGN_SYSTEM.md

Fuente de verdad de los tokens: `src/index.css` (bloque `@theme` y `:root`).
Nada de hex sueltos ni tamaños fuera de esa escala — si un valor no está ahí,
no se usa. Las constantes de clase (botones, foco, íconos, campos) viven en
`src/components/ui/tokens.ts`; los componentes reutilizables, en
`src/components/ui/` (todos reexportados por `src/components/ui/index.ts`).

Este archivo documenta solo la regla vigente. La historia de cada decisión
(qué había antes, qué se descartó, qué bug la motivó) está en
`docs/PROGRESO.md`, "Historia de decisiones del DS".

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

Segunda pasada (también 06/10/2026):

- **Capas:** `--z-raised` (20) para el filter bar; el backdrop del flyout pasó a `--z-dismiss` (15).
- **Botones de ícono:** `ICON_BTN_SM` / `ICON_BTN_MD` (`size-(--control-*)`).
- **Movimiento reducido:** la app va dentro de `<MotionConfig
  reducedMotion="user">`.
- **Rojos:** `--color-error-bg-subtle` y `--color-error-border-subtle`
  reemplazan `red-50` / `red-200`.
- **Mayúsculas:** utilidad `caps`; sin `tracking-[…]` arbitrario.
- **Gradiente de marca:** `--color-brand-gradient-from/to` y `bg-brand-gradient`.
- **Limpieza:** comentario de `ReclamosTimeline` sin hex de referencia.

Tercera pasada (también 06/10/2026):

- **Capas:** `--z-dismiss` (15) para backdrops que cierran un panel sin tapar su barra.
- **Controles de 24px:** `--control-xs` e `ICON_BTN_XS`; regla de que ningún interactivo usa `--spacing` para su tamaño.
- **Colores sueltos:** `--color-scrim` / `bg-scrim` para los scrims de modal; `fill-surface` en el círculo del timeline.

Cuarta pasada (también 06/10/2026):

- **Botones por token:** los botones de paginación con alto por padding (`px-2.5 py-1`, `px-2 py-0.5`) pasan a `BTN_SM`. Ningún botón de texto define su alto con `py-*`.
- **Checkbox y radio:** control y texto siempre dentro del mismo `<label>`, así el área clickeable incluye el texto; `ModalRadio` ahora lleva un `<input type="radio">` oculto (`sr-only`) dentro del label, en vez de un `onClick` sobre el label.

Quinta pasada (también 06/10/2026):

- **Grupos de radio reales:** `ModalRadio` recibe `name` (obligatorio), compartido por las opciones del grupo; el contenedor lleva `role="radiogroup"` y `aria-label`.
- **Foco en checkbox y radio:** `PEER_FOCUS_RING`. Regla: todo control con `<input>` oculto (`sr-only`) muestra el foco en su representación visible — el input lleva `peer` y la caja o el círculo recibe `peer-focus-visible:outline-*` (mismo aspecto que `FOCUS_RING`).

Sexta pasada (también 06/10/2026):

- **Estructura de archivos:** `src/App.tsx` se partió en `components/ui/`
  (design system + `tokens.ts`), `components/layout/`, `features/<herramienta>/`,
  `data/` y `lib/`. Sin cambios de comportamiento ni de aspecto.
- **Este documento:** reorganizado en Fundamentos / Componentes / Patrones;
  la narrativa histórica pasó a `docs/PROGRESO.md`.

Séptima pasada (también 06/10/2026):

- **Header de card con anatomía fija:** token `--card-header-h` (56 / 48 /
  44px por tier); `CardHeader` con alto fijo, línea siempre (salvo
  `level="section"`), `px-(--card-px)` y una sola línea con el contexto
  inline (`context: { label, value }`). Se eliminaron las props `divider`,
  `padX`, `chrome`, `subtitle` y `reserveSubtitle`, y el token
  `--card-header-py`.
- **Cuerpos de card:** pasan a `px-(--card-px)` (paneles ABM, Exportación,
  Consolidación, Filtros, Notas) para alinear con el header.
- **`Modal`:** sin `headerExtra`, su línea de título usa `--card-header-h` y
  `--card-px`.

Octava pasada (también 06/10/2026):

- **`TopBar`:** el top bar sale de `App.tsx` a `src/components/layout/TopBar.tsx`
  (prop `title`, mapa pantalla → título). Consultas de interrupción deja su
  encabezado propio (breadcrumb + título `heading-lg` + período) y usa
  `TopBar` con "Búsqueda de interrupciones", como Inicio y "Otros".

Novena pasada (también 06/10/2026):

- **ABM, variante barra (prueba, solo Tabla 2):** `layout: "barra"` en la
  config de CDS2 — barra de búsqueda copiada de Consultas de interrupción
  (`AbmBarraBusqueda`), Resultados a ancho completo con
  `columnasResultadoBarra` y Modificar en un modal. El resto de las tablas
  sigue con el layout split.

Décima pasada (también 06/10/2026):

- **ABM, variante barra:** la barra deja de copiar los controles de
  Consultas (input de código, `ValuePicker` de Nivel/Fase, Origen/Tipo con
  sus selects del tier 760, inputs de texto del flyout). Ahora todos los
  campos se renderizan con `AbmCampo` desde la config de la tabla (secciones
  de identificación/clasificación en la fila, el resto en "Más filtros"),
  con el estado `valores` del ABM; de Consultas queda solo el formato.

Undécima pasada (también 06/10/2026):

- **ABM, variante barra:** Resultados sin contenedor (tabla sobre el fondo,
  `thead` sticky en `bg-bg-app`, paginación con `border-t`); barra de
  herramientas de alto fijo con modo selección (`SelectionActionBar` con
  `actions` y `bare`); Modificar / Borrar solo con un registro seleccionado
  (sin columna de acciones; ✕ o Escape deseleccionan); Auditoría y Exportar
  deprecados en esta variante, pendientes de reubicar.

Duodécima pasada (también 06/10/2026):

- **ABM, variante barra:** la tabla recupera su contenedor (la caja del
  panel Resultados del split: borde, radio, surface, `shadow-sm`, `thead`
  `fill-subtle-solid`, paginación al pie con `fill-subtle`); la barra de
  herramientas queda afuera, sobre el fondo, a `gap-2` de la caja. Sigue
  sin card de Resultados y sin Auditoría/Exportar.

Decimotercera pasada (también 06/10/2026):

- **Botón ghost:** `ghostBtnCls("neutral" | "destructive")` en `tokens.ts`,
  solo `sm`, sin borde ni fondo en reposo. Regla de jerarquía: acciones de
  página `md` con borde; acciones de tabla o de registro `sm` ghost; nunca
  se mezclan en una zona. `FilterTrigger` deja de ser el único botón sin
  borde (también los ghost y los de ícono).
- **ABM, variante barra:** Modificar / Borrar de la barra de selección pasan
  a ghost, con separador antes de ✕.
- **Mayúsculas:** `SelectionActionBar` y `FieldLabel` sin `tracking-wide`.

Decimocuarta pasada (también 06/10/2026):

- **ABM, variante barra — un solo buscador:** la barra de herramientas de
  la tabla pierde su buscador; sin selección muestra solo el contador. La
  búsqueda y los filtros viven únicamente en la barra general.

Decimoquinta pasada (también 06/10/2026):

- **Botones de fila ghost:** Modificar / Borrar por fila del layout split
  del ABM pasan de `rowActionBtnCls` (outline `sm`) a `ghostBtnCls`
  (`neutral` / `destructive`), según la regla de jerarquía. `rowActionBtnCls`
  queda sin uso.
- **Mayúsculas:** el overline del saludo del Inicio (`WelcomeContent`) pierde
  `tracking-widest`; el tracking viene del token `heading-xs`.

Decimosexta pasada (también 06/10/2026):

- **ABM, variante barra — contador:** antes de la primera búsqueda (y
  después de Limpiar) la barra de herramientas de la tabla queda vacía, con
  su alto fijo; después de Buscar muestra "N de M registros" o "0
  registros".

Decimoséptima pasada (también 06/10/2026):

- **Letter-spacing:** el login pierde todos sus `letterSpacing` inline
  (inputs, labels, "Ingresá…" y el pie); el rótulo "80% DE LOS RECLAMOS"
  del timeline pasa a `0.06em`. Regla: no hay letter-spacing fuera de
  `heading-xs` y `caps`, tampoco inline.
- **`rowActionBtnCls` eliminado** (las acciones de fila son ghost).

Decimoctava pasada (también 06/10/2026):

- **Modal de edición de registro** (ABM Tabla 2, layout barra): ancho `sm`,
  mismos campos y grilla que el panel de Búsqueda (`renderSecciones`
  compartido), campos no editables como contexto en el header (Referencia +
  `CopyButton` · Origen · Tipo) y Guardar habilitado solo con cambios.
  Patrón nuevo en Patrones.

Decimonovena pasada (también 06/10/2026):

- **`CopyChip`** (nuevo, `components/ui`): identificador copiable en la
  línea del título de un modal; la lógica de copia de `CopyButton` pasa a
  `useCopiar`, compartida. `Modal` suma `titleExtra`; `ReadOnlyField` suma
  la variante `plain`.
- **Modal de edición de registro** (ABM Tabla 2): reemplaza la línea de
  contexto en `headerExtra` por un header de una línea con la referencia
  como `CopyChip`; Origen y Tipo vuelven a "Clasificación" como dato fijo.

Vigésima pasada (también 06/10/2026):

- **Modal de edición de registro** (ABM Tabla 2): reemplaza el `CopyChip`
  junto al título, Origen/Tipo como texto plano y la grilla de `AbmFila`.
  Header con label de contexto arriba del título (`label` de `Modal`,
  referencia + `CopyButton` `xs`), `size="form"` (640px), grilla única de 2
  columnas con `col-span-2` para combobox de lista larga y flujo denso;
  Origen y Tipo como toggles read-only.
- **Estados disabled vs read-only:** nuevo estado `readOnly` en
  `ButtonSelectGroup` y en el toggle de `AbmCampo`, documentado en
  Fundamentos.
- **`FloatingPanel` + `--z-modal-popover` (55):** dentro de un `Modal`, los
  paneles de `ValuePicker` y `DateTimeField` (y la variante `modal` de
  `ValuePicker`) van en un portal a `document.body`.
- **Limpieza:** se eliminan `CopyChip` y la prop `titleExtra` de `Modal`;
  `CopyButton` suma `size="xs"`.

Vigesimoprimera pasada (también 06/10/2026):

- **Modal de edición de registro** (ABM Tabla 2): layout por sección con
  dos columnas independientes (izquierda campos, derecha toggles) — sin
  `grid-auto-flow: dense`, que movía campos entre secciones; Descripción
  equipo operado vuelve a una columna. Flujo de dos pasos en el mismo modal
  (Editar → Revisar, "Paso N de 2"): ya no abre `ConfirmarModificarModal`
  encima; su contenido pasa a `RevisarCambiosContent` (compartido con el
  split).
- **Regla nueva:** nunca un modal sobre otro. `Modal` suma la prop `paso`.

Vigesimosegunda pasada (también 06/10/2026):

- **Formulario de edición** (patrón nuevo): una columna, labels arriba,
  filas de 1 a 3 campos que van juntos, ancho de campo por token
  (`--field-w-sm` 160 / `md` 240 / `lg` 360, `full`, toggles intrínsecos),
  16px entre filas y 24px entre secciones, layout declarado por tabla
  (`formLayout`). Reemplaza la grilla de 2 columnas y la regla "izquierda
  campos / derecha botones" del modal de edición de registro (CDS2).

Vigesimotercera pasada (también 06/10/2026):

- **Formulario de edición horizontal en filas** (reemplaza la grilla de 2
  columnas y el `formLayout` con anchos half/full): `FormRow` nuevo en
  `components/ui` — label a la izquierda, control a la derecha en una
  columna fija (`--form-control-w`, 280px; toggles a su ancho), separador
  suave entre filas, secciones con overline. Se elimina `formLayout` de la
  config. `ValuePicker` suma `triggerId`, `DateTimeField` suma `id` y
  `alinearPanel`, `AbmCampo` suma `labelExterno`.

## Índice

**1. Fundamentos**
[Color](#color) ·
[Tipografía](#tipografía) ·
[Espaciado y densidad](#espaciado-y-densidad) ·
[Alto de controles](#alto-de-controles) ·
[Radios](#radios) ·
[Superficies y sombras](#superficies-y-sombras) ·
[Íconos](#íconos) ·
[Capas](#capas) ·
[Movimiento](#movimiento) ·
[Foco](#foco) ·
[Estados: disabled vs read-only](#estados-disabled-vs-read-only)

**2. Componentes** (`src/components/ui/`)
[tokens.ts](#tokensts) ·
[Botones](#botones) ·
[ButtonSelectGroup](#buttonselectgroup) ·
[CardHeader](#cardheader) ·
[CodeBadge](#codebadge) ·
[CopyButton](#copybutton) ·
[DateTimeField](#datetimefield) ·
[Dropdowns flotantes](#dropdowns-flotantes-dropdownts) ·
[FaseIndicador](#faseindicador) ·
[FieldLabel](#fieldlabel) ·
[FloatingPanel](#floatingpanel) ·
[FormRow](#formrow) ·
[FilterTrigger](#filtertrigger) ·
[ListBox](#listbox) ·
[Modal](#modal) ·
[ModalCheckbox](#modalcheckbox) ·
[ModalRadio](#modalradio) ·
[PeriodSelector](#periodselector) ·
[ReadOnlyField](#readonlyfield) ·
[SectionDivider](#sectiondivider) ·
[SelectionActionBar](#selectionactionbar) ·
[SelectWrap](#selectwrap) ·
[SortableHeaderCell / SortableTh](#sortableheadercell--sortableth) ·
[TableCounter](#tablecounter) ·
[TableToolbar y useTableToolbar](#tabletoolbar-y-usetabletoolbar) ·
[TopBar](#topbar) ·
[UnderlineTabs](#underlinetabs) ·
[ValuePicker](#valuepicker)

**3. Patrones**
[Card con secciones](#card-con-secciones) ·
[Lista de filas](#lista-de-filas) ·
[Toolbar de tabla y filtros](#toolbar-de-tabla-y-filtros) ·
[Registro seleccionado y detalle](#registro-seleccionado-y-detalle) ·
[Orden de botones](#orden-de-botones) ·
[Aire: chrome vs datos](#aire-chrome-vs-datos) ·
[Modal de trabajo](#modal-de-trabajo) ·
[Formulario de edición](#formulario-de-edición) ·
[Modal de edición de registro](#modal-de-edición-de-registro) ·
[Nunca un modal sobre otro](#nunca-un-modal-sobre-otro) ·
[Layout de ABM — variante barra](#layout-de-abm--variante-barra-en-prueba-solo-tabla-2) ·
[Barra de contexto de registro](#barra-de-contexto-de-registro) ·
[Contenedores flex con scroll](#contenedores-flex-con-scroll) ·
[Voz y formatos](#voz-y-formatos)

---

# 1. Fundamentos

## Color

### Celeste de marca: dos tonos, dos usos

El celeste no es un solo color. Son dos tokens del mismo hue (214°) y no
son intercambiables:

| Token | Hex | Blanco encima | Uso |
|---|---|---|---|
| `--color-primary` | `#4D97FA` | 2.95:1 — no alcanza | Bordes (`border-primary`), tints (`bg-primary-tint`), estado seleccionado, hover de acción, acentos decorativos (puntos, ícono de accesos). **Nunca como relleno con contenido blanco encima** |
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
    `animate-spin`, `ICON.md`) a la izquierda del texto en gerundio
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
- **Gradiente de marca** (avatares): `bg-brand-gradient`, sobre
  `--color-brand-gradient-from` / `--color-brand-gradient-to`.

### Escala neutra y tokens de datos

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
  tokens de datos.
- **Tokens de datos (`--color-viz-*`)** — geometría de gráficos, por rol,
  no por tono (hoy, `ReclamosTimeline`):

  | Token | Valor | Uso |
  |---|---|---|
  | `--color-viz-track` | `neutral-200` | pista del gráfico y extremo "vacío" del degradé de densidad |
  | `--color-viz-milestone` | `neutral-400` | hito de reclamo dentro del 80% |
  | `--color-viz-milestone-muted` | `viz-milestone` al 70% sobre blanco | hito fuera del 80% |
  | `--color-viz-tick` | `neutral-300` | marcas del eje de horas |

  Los colores de marca del gráfico (primer reclamo, banda de densidad)
  salen de `secondary` / `primary`.
- **Scrim de modal:** `bg-scrim` (`--color-scrim`, negro cálido al 25%).
- El tooltip del sidebar usa `--color-text` de fondo.
- **No se usan clases de la paleta default de Tailwind** (`gray-*`, `red-*`,
  `blue-*`, `slate-*`…) ni `bg-white` / `text-black`.

### Colores de texto

Neutros cálidos, coherentes con `--color-bg-app` y con la base de los
bordes. El texto sale de los tokens de rol; `text-neutral-*` no se usa.

| Token | Clase | Hex | Uso |
|---|---|---|---|
| `--color-text` | `text-text` | `#1F1E1D` | Texto principal: títulos, valores, celdas de tabla, contenido de inputs, ítems de menú, botones secundarios. Es el único color de texto principal: la jerarquía se arma con tamaño y peso (ver "Tipografía"), no con grises intermedios |
| `--color-text-muted` | `text-text-muted` | `#63625D` | Labels, descripciones, headers de columna, overlines, pies de tabla, metadatos, placeholders, contenido de campos de solo lectura, ejes y rótulos de gráfico |
| `--color-icon` | `text-icon` | `#7D7C77` | Íconos funcionales: botones de ícono (cerrar, copiar, colapsar, paginar), íconos de trigger (lupa, calendario, chevron) |
| `--color-text-faint` | `text-text-faint` | `#8F8E89` | **Solo dos usos**, ambos exentos de contraste por WCAG: (1) controles deshabilitados; (2) elementos decorativos sin información — ícono `Inbox` de estado vacío, separadores "·" y "→". Nunca para texto que haya que leer |

`text-secondary` es otra cosa: es el **navy de marca** (`--color-secondary`),
no un gris. El gris secundario es `text-text-muted`.

- **Celeste = relleno y borde; navy = texto.** `text-primary` no se usa como
  color de texto: links, valores destacados y texto en estado
  hover/seleccionado van en `text-secondary` (navy). Única excepción: el
  ícono decorativo de las cards de "Accesos frecuentes" del Inicio, que
  acompaña a un texto.
- **Links de acción** ("Limpiar"): `text-label text-secondary
  hover:underline`.
- **Semánticos como texto:** sobre `surface`, `text-error`. Sobre un fondo
  teñido (`error-bg-subtle`, `fill-muted`) o en hover con
  `bg-error-bg-subtle`, `text-error-text-strong`. El verde de éxito como
  texto es siempre `text-success-text-strong` (`--color-success` no llega a
  4.5:1).
- **Sin opacidad en el texto** (`text-secondary/60`, etc.): baja el contraste
  de forma impredecible según el fondo.
- **Sin `color` inline con hex.**

**Contraste.** Mínimos: `text` 7:1, `text-muted` 4.5:1, `icon` 3:1
(componente no textual), `text-faint` 2.5:1 (exento). El peor fondo es
`fill-muted` apoyado sobre `bg-app`. Valores con `bg-app` = `#FAFAFA`.

| Color | surface | bg-app | fill-subtle | fill-muted | fill-subtle sobre bg-app | fill-muted sobre bg-app | primary-tint |
|---|---|---|---|---|---|---|---|
| `text` `#1F1E1D` | 16.64 | 15.95 | 15.67 | 14.72 | 15.01 | 14.11 | 14.99 |
| `text-muted` `#63625D` | 6.11 | 5.86 | 5.75 | 5.41 | 5.51 | 5.18 | 5.51 |
| `icon` `#7D7C77` | 4.18 | 4.01 | 3.94 | 3.70 | 3.77 | 3.55 | 3.77 |
| `text-faint` `#8F8E89` | 3.28 | 3.14 | 3.09 | 2.90 | 2.96 | 2.78 | 2.96 |
| `secondary` (navy) `#1D558C` | 7.69 | 7.37 | 7.24 | 6.80 | 6.94 | 6.52 | 6.93 |

### Semánticos

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
- `error` suma `--color-error-border-hover` (hover del botón destructivo) y
  dos tokens suaves: `--color-error-bg-subtle` (`#FEF2F2`) y
  `--color-error-border-subtle` (`#FECACA`). **Criterio:** `error-bg` es para
  estado/badge ("no existe"); `error-bg-subtle` para el hover destructivo y
  los fondos de aviso (con `error-border-subtle`).
- `success`, `warning` y `error` llevan significado; `neutral` es para
  estados sin carga semántica; `info` está en la familia azul de la marca.
  **`info` y `neutral` todavía no se usan en ningún componente.**

## Tipografía

Escala única, definida en `@theme` de `src/index.css`. Cada token es
**compuesto**: la clase `text-<token>` aplica tamaño + interlineado + peso
juntos. Se elige por **rol** (qué es el texto), nunca por tamaño.

| Token | Tamaño / interlineado | Peso | Cuándo usarlo |
|---|---|---|---|
| `text-heading-lg` | 24 / 32 | semibold | Título principal de una pantalla de entrada: saludo del Inicio, "Bienvenido" (login y selector de herramienta) |
| `text-heading-md` | 16 / 24 | semibold | Título de pantalla (`h1` del top bar), título de modal y de card, valor destacado de un KPI o tile |
| `text-heading-sm` | 13 / 20 | semibold | Título de sección dentro de un panel o popover ("Más filtros", mes del calendario), título de estado vacío ("No hay registros"), ítem destacado del sidebar |
| `text-heading-xs` | 11 / 16 | semibold, tracking 0.06em | Encabezado de columna, overline de sección, rótulo de grupo del sidebar, día de la semana del calendario |
| `text-body-lg` | 14 / 20 | regular | Texto corrido: párrafos, descripciones, subtítulos, inputs del login, valor de tile |
| `text-body` | 13 / 20 | regular | Base densa: celdas de tabla, inputs, botones, ítems de menú |
| `text-body-sm` | 12 / 16 | regular | Celdas de tablas compactas, texto auxiliar, metadatos, tooltip |
| `text-label` | 12 / 16 | medium | Label de campo, filter trigger, tab, chip, botón `sm` (`BTN_SM`), link de acción, día del calendario, valor en un par dato/valor |
| `text-caption` | 11 / 16 | regular | Contadores, paginación, error de campo, label de tile y de KPI, ejes y rótulos de gráfico |
| `text-code` | 12 / 16 | regular | Datos: IDs, referencias, fechas, códigos. Siempre junto a `font-mono` |
| `text-display` | 40 / 48 | semibold | **Solo marca del login. No usar en el producto.** |

- **Rol, no tamaño.** Si dudás entre dos tokens, preguntate qué es el texto
  (¿título?, ¿dato?, ¿etiqueta?), no cuánto debería medir.
- **No hay otros tamaños.** `--text-*: initial` borra la escala default de
  Tailwind: `text-xs`, `text-sm`, `text-base`, etc. no existen. Tampoco se
  usan tamaños arbitrarios (`text-[13px]`), ni `font-size` / `line-height` /
  `font-weight` inline, ni en `classNames` de librerías (DayPicker).
- **Nada por debajo de 11px.**
- **Tres pesos:** regular (400), medium (500), semibold (600). `font-bold`
  no se usa (Inter se carga sin el peso 700).
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
  `@media (max-height: …)` de `index.css` no redefinen `--text-*`.
- **La jerarquía se lee con tamaño y peso, no con mayúsculas.** No se
  agregan `uppercase` nuevos para "subir" un texto de nivel.
- **Mayúsculas:** todo texto en mayúsculas usa `uppercase` sobre
  `text-heading-xs` (el tracking ya viene del token,
  `--text-heading-xs--letter-spacing`) o la utilidad `caps` (`uppercase` +
  `letter-spacing: 0.06em`) sobre cualquier otro token, como `caption`.
  Nunca `tracking-[…]` arbitrario ni `tracking-*` junto a `text-heading-xs`.
- **No hay letter-spacing fuera de `heading-xs` y `caps`**, tampoco inline
  (`style={{ letterSpacing }}`). Única excepción: un `<text>` de SVG en
  mayúsculas, donde la utilidad no aplica, lleva el mismo valor como
  atributo (`letterSpacing="0.06em"`).
- **`font-mono` es una familia, no un tamaño.** Tiene dos combinaciones
  documentadas y ninguna más:
  - `text-code font-mono` — el rol para **datos**: IDs, referencias, fechas,
    códigos de equipo. Va a 12px porque JetBrains Mono a 12 empareja
    ópticamente con Inter a 13 en la misma fila.
  - `text-caption font-mono` — **badges y contadores**: código de tabla
    (CDS4, etc.), contadores del sidebar, letra de fase.

## Espaciado y densidad

- **`--spacing` es la palanca de densidad de la app.** Tailwind v4 resuelve
  todas las utilidades numéricas de espaciado (`p-*`, `gap-*`, `w-*`,
  `h-*`) vía `calc(var(--spacing) * N)`. Los dos tiers de `index.css`
  redefinen `--spacing` para compactar la app en ventanas bajas:
  `@media (max-height: 900px)` y `@media (max-height: 760px)` (notebooks de
  14"; el tier 760 va después en el archivo para ganar cuando se cumplen
  los dos). El objetivo es cero scroll de página; las tablas scrollean
  adentro.
- **Lo que no achica:** tipografía (un valor por token), alto de controles
  (`--control-*`, ver abajo), filas de alto fijo (`ReposicionesLista`, 44px;
  `thead` de 32px) y el aire de chrome en pantallas altas (ver
  [Aire: chrome vs datos](#aire-chrome-vs-datos)).
- **Variables propias por tier:** `--header-min-height` (franja de título
  de pantalla) y las `--login-*` del login, que usa `style` inline en px y
  no participa de `--spacing`.

## Alto de controles

Los controles tienen alto en px fijo, **fuera de `--spacing`**: en los tiers
compactos nunca bajan de 24px (WCAG 2.5.8, tamaño mínimo del objetivo).

| Token | > 900px de alto | ≤ 900px | ≤ 760px |
|---|---|---|---|
| `--control-xs` | 24px | 24px | 24px |
| `--control-sm` | 28px | 26px | 24px |
| `--control-md` | 36px | 32px | 30px |

`BTN_SM` usa `h-(--control-sm)` y `BTN_MD` `h-(--control-md)`. Mapeo por
control — **elementos que comparten fila usan el mismo token**:

| Control | Token |
|---|---|
| Botones `BTN_SM` (acciones de fila, toggles, paginación), segmented compacto (`ButtonSelectGroup` por defecto), periodicidad | `sm` |
| Buscador de tabla (`TableToolbar`) y `FilterTrigger` (viven juntos en el toolbar) | `sm` |
| Chips redondeados (rango, filtros aplicados), campo de solo lectura compacto (`ReadOnlyField`), buscador de listas del selector | `sm` |
| Botones `BTN_MD` (Buscar, Limpiar, Guardar, pie de modal), `PeriodSelector`, botón de calendario | `md` |
| Campos: `MOD_FIELD_CLS` / `MOD_SELECT_CLS` (input, select, `ValuePicker`, `DateTimeField`), campos de solo lectura estilo campo, nota manual | `md` |
| Segmented en filas de campos con botones md (`BTN_SEG_MD`: filter bar, grillas ABM) | `md` |

Botones de ícono cuadrados: `ICON_BTN_XS` / `ICON_BTN_SM` / `ICON_BTN_MD`
(`size-(--control-*)`). Si comparten fila con botones o campos, usan el mismo
token que ellos; sueltos, `sm`. `xs` (24px fijo, **sin redefinir en ningún
tier**: es el mínimo de WCAG 2.5.8) es para controles dentro de componentes
densos: navegación del calendario, flechas de orden de columnas, cerrar del
flyout, botón de mes/año del calendario.

- **Ningún elemento interactivo usa tamaños de la escala `--spacing` para
  su alto o ancho** (`w-6`, `h-8`…): siempre `--control-xs/sm/md`. El área
  clickeable de un avatar la define el botón que lo contiene, no el avatar.
- Tabs (`h-10`) tienen alto propio.
- **Un botón de texto con borde nunca define su alto con `py-*`:** usa
  `BTN_SM` / `BTN_MD`. Las filas de menú y de lista, que son ítems de ancho
  completo, sí toman su alto del contenido.

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

## Superficies y sombras

Tokens en `@theme` de `src/index.css`. Se eligen por **rol**.

| Token | Clase | Uso |
|---|---|---|
| `--color-bg-app` | `bg-bg-app` | `#FAFAFA`, gris neutro. Fondo de página: shell de la app, selector de herramienta, sidebar y top bar |
| `--color-surface` | `bg-surface` | Todo lo que se apoya sobre el fondo: cards, modales, popovers, dropdowns, inputs, botones secundarios, paginadores |
| `--color-border` | `border-border`, `bg-border` | Borde de contenedores (cards, popovers, dropdowns), divisores (bajo un header, bajo el `thead`, pie de tabla) y líneas de 1px (`h-px` / `w-px bg-border`) |
| `--color-border-strong` | `border-border-strong` | Controles: inputs, selects, botones secundarios, checkbox y radio, badges de código. Tienen que seguir leyéndose como campos |
| `--color-border-subtle` | `border-border-subtle` | Separador entre filas de una tabla o de una lista |
| `--color-fill-subtle` | `bg-fill-subtle` | Relleno de `thead`, pie de tabla, barra de filtros activos, filas de "Resumen de cambios", campos bloqueados |
| `--color-fill-muted` | `bg-fill-muted` | Hover neutro (filas, ítems de menú, botones del sidebar y de ícono), campos de solo lectura o deshabilitados, celdas vacías del mini calendario, fondo del badge de tabla |

- **Los rellenos neutros son siempre translúcidos** (`fill-subtle`,
  `fill-muted`): negro cálido con alfa, no un gris opaco. Así toman la
  temperatura de lo que tienen debajo (blanco en una card, el `#FAFAFA` del
  fondo en el sidebar). No se agregan grises opacos de relleno.
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

**Sombras.** Una por nivel de elevación, como clase (`shadow-sm` /
`shadow-md` / `shadow-lg`). No hay `box-shadow` inline ni sombras
arbitrarias.

| Token | Uso |
|---|---|
| `--shadow-sm` | Cards |
| `--shadow-md` | Popovers, dropdowns, menús; cards de acceso en hover |
| `--shadow-lg` | Modales |

Ningún botón lleva sombra. `--inset-shadow-row-selected`
(`inset-shadow-row-selected`) no es elevación: es el acento de 3px de la
fila seleccionada.

## Íconos

Constante `ICON` en `src/components/ui/tokens.ts`: `xs` 12 · `sm` 14 ·
`md` 16 · `xl` 40.

- Se usa siempre `size={ICON.sm}`, nunca un número suelto.
- `strokeWidth` 1.5 en todos, salvo `xl` (estado vacío, `Inbox`), que usa
  1.25.
- Íconos SVG propios (check del checkbox, ×, flechas de orden) son
  geometría del componente y llevan su trazo propio.

## Capas

Tokens de z-index por rol, `z-(--z-…)`:

| Token | Valor | Elementos |
|---|---|---|
| `--z-sticky` | 10 | `th` sticky de tablas, contenido sobre el pill del sidebar |
| `--z-dismiss` | 15 | backdrops que cierran un panel con clic afuera sin tapar la barra que lo abrió (flyout "Más filtros") |
| `--z-raised` | 20 | filter bar de Consultas de interrupción |
| `--z-dropdown` | 30 | dropdowns, popovers, flyouts (el menú del sidebar colapsado queda siempre sobre el filter bar) |
| `--z-overlay` | 40 | scrim de modales |
| `--z-modal` | 50 | panel de modal |
| `--z-modal-popover` | 55 | dropdowns y popovers abiertos desde un modal (en portal a `document.body`, ver `FloatingPanel`) |
| `--z-toast` | 60 | notificaciones (sin uso todavía) |
| `--z-tooltip` | 70 | tooltip del sidebar |

El flyout "Más filtros" (`dropdown`) queda sobre el filter bar (`raised`),
y su backdrop (`dismiss`) queda debajo del filter bar: con el flyout abierto
los controles del filter bar siguen siendo clickeables y un clic en las
cards lo cierra.

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
- **Movimiento reducido:** `@media (prefers-reduced-motion: reduce)` lleva
  transiciones y animaciones CSS a ~0ms; el spinner de carga
  (`animate-spin`) queda afuera porque es información. Las animaciones de
  `motion/react` respetan la preferencia vía `<MotionConfig
  reducedMotion="user">` en `src/main.tsx`.

## Foco

Un solo color de foco, `--color-focus` = `#076AEE` (mismo valor que
`primary-strong`, 4.88:1 sobre blanco), y cuatro constantes en
`src/components/ui/tokens.ts`:

| Constante | Para qué | Clases |
|---|---|---|
| `FOCUS_RING` | anillo de un control (botón, trigger de filtro, link, ícono) | `focus-visible:outline-2 outline-focus outline-offset-2` |
| `FOCUS_RING_INSET` | elementos que tocan el borde de su contenedor: filas, secciones, listas navegables (`role="listbox"`) | mismo anillo con `-outline-offset-2` (hacia adentro, el `overflow` del padre no lo recorta) |
| `PEER_FOCUS_RING` | representación visible de un control con `<input>` oculto (checkbox, radio) | `peer-focus-visible:outline-2 outline-focus outline-offset-2` |
| `FIELD_FOCUS` | **campos** de texto (input, select, textarea) | `focus:outline-none focus:border-focus focus:ring-2 focus:ring-focus/10` |

- El foco de un campo (borde + halo) es distinto del anillo de un control:
  por eso `FIELD_FOCUS` es aparte y se usa en **todos** los campos
  (`MOD_FIELD_CLS`, `MOD_SELECT_CLS`, buscador de tabla, login…).
- Nada de `focus-visible:outline-*` ni `ring-primary/30` sueltos: se usa la
  constante.
- **Todo control con `<input>` oculto (`sr-only`) muestra el foco en su
  representación visible:** el input lleva `peer` y la caja o el círculo
  recibe `PEER_FOCUS_RING` (mismo aspecto que `FOCUS_RING`; no aparece al
  hacer clic con mouse).
- **Ningún elemento interactivo queda con `outline-none` sin reemplazo
  visible.** Una sección con stretched button (`has-[:focus-visible]`) pinta
  el mismo anillo inset en la sección entera; el panel de un modal
  (`tabIndex=-1`, foco programático, no interactivo) es la única excepción.

## Estados: disabled vs read-only

Dos estados distintos de un control que no se puede cambiar:

| | Disabled | Read-only |
|---|---|---|
| Significa | El control **no está disponible todavía** (falta completar algo, depende de otra acción) | El valor es un **dato fijo** del registro: se lee completo, no se edita |
| Aspecto | Atenuado (`opacity-40`, o `fill-muted` + `text-faint` en campos) | **Contraste completo**: el seleccionado con su aspecto de siempre (`bg-primary-tint` + `border-primary` + `text-secondary`), los no seleccionados en reposo (`bg-surface` + `border-border-strong` + `text-text`) |
| Interacción | Sin eventos, `cursor-not-allowed` | Sin hover, `cursor-default`, no responde a clic ni a teclado para cambiar el valor |
| Señal | — | Ícono `Lock` (`ICON.xs`, `text-icon`, "No editable") junto al label |
| Accesibilidad | `disabled` | Grupo `role="radiogroup"` con `aria-readonly="true"`, enfocable una vez; opciones no tabulables |

- Read-only **aplica a toggles** (`ButtonSelectGroup` y el toggle de
  `AbmCampo`, prop `readOnly`). Un input, select o fecha read-only se
  muestra con `ReadOnlyField` (variante `plain` dentro de un formulario).
- Un dato fijo **nunca** se muestra como control deshabilitado.

---

# 2. Componentes

Todos viven en `src/components/ui/` y se importan desde `@/components/ui`.
Ninguno conoce la lógica de negocio de SISENRE: los datos les llegan por
props. Esquema de cada sección: para qué sirve, anatomía, props, estados,
accesibilidad, qué no hacer y archivo.

## tokens.ts

**Para qué:** constantes de clase compartidas — la forma de reusar el
sistema sin un componente `<Button/>`. Cada botón suma por afuera solo su
color/variante/hover.

| Constante | Contenido |
|---|---|
| `BTN_SM`, `BTN_MD` | Los dos únicos tamaños de botón: alto `--control-sm`/`md`, padding, tipografía (`text-label` / `text-body font-medium`), `rounded-sm` |
| `BTN_SEG_MD` | Segmented con alto de campo, para filas con campos y botones md |
| `actionBtnCls(variant)` | Botón outline de panel (`md`), variante neutral o `destructive` |
| `ghostBtnCls(tone)` | Botón ghost (`sm`, sin borde ni fondo en reposo), tono `neutral` o `destructive` — ver [Botones](#botones) |
| `modalPrimaryBtnCls`, `modalNeutralBtnCls`, `modalDestructiveBtnCls` | Botones del pie de modal |
| `ICON`, `ICON_BTN_XS/SM/MD` | Tamaños de ícono y de botón de ícono |
| `FOCUS_RING`, `FOCUS_RING_INSET`, `PEER_FOCUS_RING`, `FIELD_FOCUS` | Foco (ver [Foco](#foco)) |
| `MOD_FIELD_CLS`, `MOD_SELECT_CLS` | Clases únicas para todo `<input>` / `<select>` de texto simple |
| `ESTADO_CLASES` | Clases por estado de campo (`CampoEstado`: editable, bloqueado, solo lectura…) |
| `ActionItem` | Tipo de una acción (label, variante, handler) |

**Qué no hacer:** estilar un botón nuevo con su propio alto, radio o tamaño
de texto; escribir clases de foco a mano.

**Archivo:** `src/components/ui/tokens.ts`.

## Botones

**Para qué:** las acciones. No hay un componente `<Button/>`: cada botón
arma su clase con las constantes de `tokens.ts` y suma solo su
color/variante.

| Variante | Clase | Tamaño | Uso |
|---|---|---|---|
| Primario | `bg-primary-strong text-white` sobre `BTN_MD` (o `modalPrimaryBtnCls`) | `md` | La acción principal de una zona (Buscar, Guardar). Máximo uno por zona |
| Secundario outline | `actionBtnCls("neutral")`, `modalNeutralBtnCls` | `md` | Acciones de página: Limpiar, Más filtros, Cancelar |
| Destructivo outline | `actionBtnCls("destructive")` | `md` | Acción destructiva de página |
| **Ghost** | `ghostBtnCls("neutral" \| "destructive")` | **solo `sm`** | Acciones de tabla o de registro: barras de selección, toolbars de tabla, filas |
| Ícono | `ICON_BTN_XS/SM/MD` | por control | Cerrar, copiar, deseleccionar, paginar |

**Ghost — anatomía:** `BTN_SM` (`h-(--control-sm)`, `px-2.5`, `text-label`,
`rounded-sm`), `border border-transparent` (mismo alto que un botón con
borde) y sin fondo.

**Ghost — estados:**

| Estado | `neutral` | `destructive` |
|---|---|---|
| Reposo | `text-text`, sin borde visible ni fondo | `text-error`, sin borde visible ni fondo |
| Hover / activo | `bg-fill-muted` | `bg-error-bg-subtle` + `text-error-text-strong` |
| Foco | `FOCUS_RING` | `FOCUS_RING` |
| Deshabilitado | `opacity-40`, `cursor-not-allowed`, sin eventos | igual |

Sin escala al presionar; `transition-colors` con `--duration-base`.

**Jerarquía:**
- **Acciones de página** (buscar, limpiar, filtros, guardar): `md`, con
  borde; el primario, relleno.
- **Acciones de tabla o de registro** (barras de selección, toolbars de
  tabla, filas): `sm`, ghost.
- **Nunca se mezclan tamaños ni variantes dentro de una misma zona.** Si
  una zona necesita separar grupos, un separador vertical (`w-px h-4
  bg-border`).
- **Sin borde en reposo** solo hay tres casos: `FilterTrigger`, los botones
  ghost y los botones de ícono. Todo otro botón de texto lleva borde.

**Accesibilidad:** botones con texto; un botón de ícono lleva `aria-label`.

**Qué no hacer:** ghost en `md`; ghost para una acción de página; un
primario relleno en una barra de selección.

**Archivo:** `src/components/ui/tokens.ts`.

## ButtonSelectGroup

**Para qué:** selector tipo botón de selección única (Origen y Tipo en el
filter bar de Consultas de interrupción, opciones de confirmación del ABM).

**Anatomía:** fila de botones outline con bordes; el seleccionado usa el
patrón tint (`bg-primary-tint border-primary text-secondary`).

**Props:** `options: string[]`, `selected: string[]`, `onToggle(opt)`,
`disabled?`, `sizeCls?` (default `BTN_SM`; `BTN_SEG_MD` en filas de campos),
`readOnly?`, `ariaLabel?`.

**Estados:** reposo, hover (tint), seleccionado (tint persistente),
deshabilitado (`fill-muted` + `text-faint`; si estaba seleccionado,
tint atenuado), **read-only** (ver [Estados: disabled vs
read-only](#estados-disabled-vs-read-only)).

**Accesibilidad:** cada opción es un `<button>` con `aria-pressed`. En
read-only, el grupo es `role="radiogroup"` con `aria-readonly="true"` y
`aria-label`, enfocable una sola vez; las opciones no son tabulables.

**Qué no hacer:** marcar el seleccionado con relleno `primary-strong` (es
el lenguaje de la acción primaria).

**Archivo:** `src/components/ui/ButtonSelectGroup.tsx`.

## CardHeader

**Para qué:** el header de card — de toda card y de toda sección de card,
y la referencia del header de `Modal`. Ningún header se arma a mano.

**Anatomía fija** — una sola línea, alto por token, línea siempre:

```
┌──────────────────────────────────────────────────────────┐
│ Título [CDS4] · ETIQUETA valor-en-mono          [acciones]│  h-(--card-header-h), px-(--card-px)
├──────────────────────────────────────────────────────────┤  border-b border-border, siempre
```

| Slot | Prop | Tokens | Contenido |
|---|---|---|---|
| Título | `title` | `text-heading-md text-text` (`heading-sm` con `level="section"`) | Nombre de la card. No trunca |
| Badge | `tag` | `CodeBadge` | Código de origen (CDS2, CDS4…), **en línea con el título**. Opcional |
| Contexto | `context: { label, value }` | "·" en `text-text-faint`; etiqueta `text-heading-xs uppercase text-text-muted`; valor `text-code font-mono text-text-muted` | En la **misma línea**, después del título. Trunca antes que el título. Opcional |
| Acciones | `actions` | botones `actionBtnCls` / `BTN_MD` | A la derecha (`ml-auto`), centradas en vertical. Opcional |

**Props:** `title`, `tag?`, `context?`, `actions?`, `level?` (`"card"` |
`"section"`).

| Token | > 900px de alto | ≤ 900px | ≤ 760px |
|---|---|---|---|
| `--card-header-h` (alto) | 56px | 48px | 44px |
| `--card-px` (padding horizontal, header y cuerpo) | 24px | `calc(var(--spacing) * 4)` ≈ 13.6px | `calc(var(--spacing) * 4)` ≈ 12.8px |

- **Ningún header define su alto o su padding a mano.** Alto
  `h-(--card-header-h)` sin padding vertical, contenido centrado;
  `px-(--card-px)` siempre. Así dos cards lado a lado (Interrupciones y
  Reposiciones) tienen exactamente el mismo alto, con o sin contexto.
- **Línea siempre** (`border-b border-border`) en `level="card"`. Con
  `level="section"` (Reclamos durante la interrupción, Tablas relacionadas)
  el header tiene el mismo alto y padding, título en `heading-sm` y **sin**
  línea: la sección ya se separa con su `border-t`.
- **El cuerpo de la card usa el mismo `px-(--card-px)`** para alinear con el
  header; su padding vertical es propio de cada card.
- **Sin fondo.** El header es transparente y deja ver el radio de la card.
- **Badge en línea, derecha solo para acciones.**
- **Cuándo lleva contexto:** cuando los datos de la card dependen de algo
  que no está a la vista en la propia card — el **registro padre**
  ("· INTERRUPCIÓN `AFZ…`" en Reposiciones y en Reclamos; "· REPOSICIÓN
  `1 de 5 · 22/07/2026 14:50`" en Tablas relacionadas). Sin registro, no se
  muestra (el alto no cambia). No lleva contexto si solo repetiría el título.

**Estados:** sin estados propios. Dentro de una sección clickeable (patrón
stretched button) hereda el hover de la sección porque es transparente.

**Accesibilidad:** el "·" separador es `aria-hidden`. Las acciones son
botones con texto o `aria-label`.

**Qué no hacer:** alto o padding propios; un subtítulo en segunda línea;
acciones sobre el registro seleccionado en `actions` (solo alcance tabla:
Insertar, Exportar, Auditoría); badge a la derecha; fondo propio.

**Archivo:** `src/components/ui/CardHeader.tsx`.

## CodeBadge

**Para qué:** dejar explícito sobre qué tabla se trabaja (CDS2, CDS4…), en
`CardHeader` y en la barra de contexto de registro.

**Anatomía:** `text-caption font-mono`, `px-1.5 py-0.5`, `rounded-xs`,
`border-border-strong`, `text-text-muted`.

**Props:** `code: string`.

**Estados:** ninguno (no interactivo).

**Accesibilidad:** texto plano, se lee como parte del título.

**Qué no hacer:** usarlo como chip de filtro o como botón.

**Archivo:** `src/components/ui/CodeBadge.tsx`.

## CopyButton

**Para qué:** copiar un valor al portapapeles (ej. la referencia de
Interrupción en el header del modal "Tablas relacionadas").

**Anatomía:** botón de ícono `ICON_BTN_SM`, `text-icon`, hover
`bg-fill-muted` + `text-text`; ícono `Copy` (`ICON.sm`).

**Props:** `value: string`, `label: string` (qué se copia, en minúscula y
sin artículo: arma "Copiar interrupción" / "Interrupción copiada"),
`size?` (`"sm"` default, `ICON_BTN_SM` + `ICON.sm`; `"xs"`, `ICON_BTN_XS` +
`ICON.xs`, para ir junto a un texto chico como el label de contexto de un
modal).

**Estados:** reposo; copiado — **solo si la copia realmente ocurrió**, el
ícono pasa a `Check` (`text-success-text-strong`) por 1.5s. Usa
`navigator.clipboard.writeText` con fallback a `document.execCommand("copy")`
vía un `<textarea>` oculto.

**Accesibilidad:** `aria-label` y `title` "Copiar \<label\>"; anuncio
"\<Label\> copiada" en un `sr-only aria-live="polite"`.

**Qué no hacer:** simular el estado de éxito si la operación falló o no
está implementada. Por eso el botón "Copiar datos de la reposición" (ícono
`ClipboardList`, handler vacío pendiente de definición) no usa este
componente ni su feedback.

**Archivo:** `src/components/ui/CopyButton.tsx`. La copia y el estado
`copied` salen de `useCopiar` (`src/components/ui/useCopiar.ts`).

## DateTimeField

**Para qué:** campo de fecha y hora con calendario (`dd/mm/aaaa hh:mm`).
Interfaz pública de input de texto (`value` / `onChange` con string).

**Anatomía:** trigger con el chrome de `MOD_SELECT_CLS` (alto
`--control-md`) + popover con `DayPicker` (locale `es`), selector de mes y
año (`DateTimeCaptionLabel` / `MiniCaptionDropdown`), input de hora y botón
Aplicar. Exporta también las piezas reutilizables (`DAY_PICKER_CLASSNAMES`,
`DateTimeChevron`, `DateTimeCaptionLabel`, `MESES_ES`,
`parseDateTimeStr`), que usa el selector de día del cronograma del Inicio.

**Props:** `value`, `onChange`, `disabled?`, `muted?` (default =
`disabled`), `fullWidth?` (ancho 100% de la columna vs. 170px fijo),
`className?` (clases extra para el trigger).

**Estados:** editable; deshabilitado `muted` (atenuado: `fill-muted` +
`text-muted`); deshabilitado sin `muted` (dato real de una fila
seleccionada, legible: `fill-subtle` + `text`); abierto.

**Accesibilidad:** el popover abre con smart-direction
(`useDropdownDirection`) y cierra con clic afuera; los botones de
navegación del calendario miden `ICON_BTN_XS`.

**Qué no hacer:** usar `<input type="date">` nativo en formularios (solo el
panel de rango de `FilterTrigger` los usa); tamaños o pesos en las
`classNames` del DayPicker.

**Archivo:** `src/components/ui/DateTimeField.tsx`.

## Dropdowns flotantes (`dropdown.ts`)

**Para qué:** mecanismo único de dirección de todo panel flotante
(`ValuePicker`, `PeriodSelector`, `DateTimeField`, `FilterTrigger`,
`UserMenu`, selector de tabla del ABM, selector de día del cronograma).

**API:** `useDropdownDirection(ref, open, alturaPanel)` devuelve `"down"` |
`"up"`: abre hacia abajo por default y solo invierte cuando el panel no
entra entre el trigger y el borde inferior del viewport.
`dropdownAnchorStyle(direction, gap)` devuelve el `style` de anclaje.

**Qué no hacer:** hardcodear la dirección de un panel.

**Archivo:** `src/components/ui/dropdown.ts`.

## FaseIndicador

**Para qué:** mostrar las fases eléctricas presentes (R, S, T) de un
registro, en solo lectura (lista de Reposiciones, barra de contexto de la
reposición).

**Anatomía:** 3 mini-cajas fijas de `18×18` — siempre R, S, T en ese orden.
Presentes: `bg-primary-tint border-chip-border text-secondary`; ausentes:
`border-border text-text-faint`. Letra en `text-caption font-mono`.

**Props:** `fase: string` (ej. `"RS"`).

**Estados:** ninguno (no interactivo).

**Accesibilidad:** `<span>` fuera del orden de tabulación; cada caja
`aria-hidden` y un `sr-only` describe el estado ("Fases: R, S y T").

**Qué no hacer:** usarlo como selector de fase (eso es un control de
formulario del ABM); darle hover o cursor.

**Archivo:** `src/components/ui/FaseIndicador.tsx`.

## FieldLabel

**Para qué:** label de campo de formulario.

**Anatomía:** `<label>` `block mb-1 text-label text-text`.

**Props:** `children`.

**Accesibilidad:** asociarlo al campo (envolviéndolo o con `htmlFor`)
cuando el campo es nativo.

**Qué no hacer:** usar `text-heading-xs` uppercase como label de campo.

**Archivo:** `src/components/ui/FieldLabel.tsx`.

## FloatingPanel

**Para qué:** el panel de un dropdown o popover (`ValuePicker`,
`DateTimeField`), para que nunca lo recorte el contenedor donde vive.

**Anatomía y comportamiento:**
- **Fuera de un modal:** como siempre — `absolute` junto al trigger, en
  `--z-dropdown`, con la dirección de `useDropdownDirection`.
- **Dentro de un `Modal`** (lo sabe por `DentroDeModalContext`, que provee
  `Modal`): en un portal a `document.body`, `position: fixed` calculada
  desde el rect del trigger (abre arriba o abajo según el espacio), en
  `--z-modal-popover`. Se recalcula con scroll y resize.

**Props:** `anchorRef`, `panelRef?`, `open`, `direction`, `gap`, `align?`
(`"left"` | `"right"`), `matchWidth?`, `className` (solo aspecto, nunca
posición), `style?`.

**Accesibilidad / cierre:** quien lo usa cuenta `panelRef` como "adentro"
en su cierre por clic afuera (con el portal el panel ya no es descendiente
del trigger). La variante `modal` de `ValuePicker` (listas largas) también
va en un portal dentro de un `Modal`, y su Escape cierra solo la lista.

**Qué no hacer:** posicionar el panel con clases (`left-0`, `w-full`) en
`className`; abrir un popover dentro de un modal sin `FloatingPanel`.

**Archivo:** `src/components/ui/FloatingPanel.tsx`.

## FormRow

**Para qué:** una fila de un formulario horizontal (patrón de pantallas de
configuración): un campo por fila, label a la izquierda y control a la
derecha. Ver [Formulario de edición](#formulario-de-edición).

**Anatomía:**

```
│ Fecha                                   [dd/mm/aaaa hh:mm      📅] │  min-h 56px, py-3
│─────────────────────────────────────────────────────────────────────│  border-b border-border-subtle
│ Nivel de tensión                                     [BT][MT][AT] │  toggle a su ancho, alineado a la derecha
│─────────────────────────────────────────────────────────────────────│
│ Origen 🔒                                   [Interno][Externo]    │  read-only (última fila: sin borde)
```

- **Fila:** `flex items-center justify-between gap-4`, `min-h-[56px] py-3`,
  `border-b border-border-subtle`; la última del contenedor sin borde
  (`last:border-b-0`).
- **Label (izquierda):** `text-body text-text` — no `FieldLabel`: va al
  costado, no arriba. Trunca, con `title` del texto completo.
- **Control (derecha):** alineado al borde derecho. Inputs, fecha, select y
  combobox con ancho fijo **`--form-control-w` (280px)**, todos iguales;
  toggles a su ancho intrínseco (su borde derecho coincide con el de los
  inputs). Los popovers (fecha) se alinean al borde derecho del control.

**Props:** `label`, `labelId`, `htmlFor?`, `readOnly?`, `anchoControl?`
(`"fijo"` | `"intrinseco"`), `children` (el control).

**Estados:** read-only → candado (`ICON.xs`, `text-icon`, "No editable") a
la derecha del label; el control en su estado read-only (ver [Estados:
disabled vs read-only](#estados-disabled-vs-read-only)).

**Accesibilidad:** el label es un `<label htmlFor>` apuntando al id del
control; un grupo de toggles usa `aria-labelledby={labelId}`. En el ABM,
`AbmCampo` con `labelExterno` renderiza solo el control con esos ids.

**Qué no hacer:** label arriba (`FieldLabel`) dentro de una `FormRow`;
controles de anchos distintos en la columna derecha; más de un campo por
fila.

**Archivo:** `src/components/ui/FormRow.tsx`.

## FilterTrigger

**Para qué:** filtro por columna en el toolbar de una tabla
(Interrupciones, modal "Tablas relacionadas").

**Anatomía:** trigger `FilterTriggerButton` + panel. Dos variantes con el
mismo trigger:
- **`list`** (default): lista de valores con conteo, selección única;
  elegir un valor aplica y cierra.
- **`date-range`**: panel con atajos (Hoy / Últimas 24 h / Últimos 7 días,
  que solo completan los campos), Desde y Hasta (fecha + hora) y pie con
  "Limpiar" + "Aplicar". Es la **única** variante con Aplicar, porque un
  rango se arma en dos pasos. Se permite un solo extremo; desde > hasta
  deshabilita Aplicar. Texto aplicado: `dd/mm hh:mm – dd/mm hh:mm`,
  `desde …` o `hasta …`.

**Props:** `label`, `value`, `onChange`, `disabled?`, y según variante
`options: { value, count }[]` (`list`) o `variant="date-range"` con
`value: RangoFecha | null`.

**Estados:** reposo **sin borde ni fondo** (`h-(--control-sm)`); hover =
hover secundario de la app (`border-primary` + `bg-primary-tint` +
`text-secondary`), nunca gris; abierto = seleccionado persistente; con
filtro aplicado queda **siempre pintado** ("`{columna}: {valor}`" + ×, la ×
como botón hermano); deshabilitado (`text-faint`, sin hover).

**Accesibilidad:** trigger con `aria-haspopup="dialog"` y `aria-expanded`;
la × tiene `aria-label="Quitar filtro <columna>"`; lista con
`role="listbox"` / `role="option"` + `aria-selected`; panel de rango con
`role="dialog"`. Escape cierra solo el panel (corta la propagación para no
cerrar el `Modal` que lo contiene). Foco `FOCUS_RING`.

**Qué no hacer:** usar su tratamiento (sin borde en reposo, hover tint)
fuera de un trigger de filtro — los otros botones sin borde son los ghost y
los de ícono, ver [Botones](#botones); anidar la × dentro del botón.

**Archivo:** `src/components/ui/FilterTrigger.tsx`.

## ListBox

**Para qué:** lista con header dentro de modales (paneles
"Interrupción/Reclamo", "Errores").

**Anatomía:** contenedor `border border-border rounded-md`, alto fijo de
160px; header `bg-fill-subtle` con `text-heading-xs uppercase`; cuerpo con
scroll propio.

**Props:** `title`, `children?`.

**Qué no hacer:** usarlo dentro de una card de trabajo (ahí no se anidan
contenedores con borde).

**Archivo:** `src/components/ui/ListBox.tsx`.

## Modal

**Para qué:** el estándar de toda acción que requiera un diálogo.

**Anatomía:** scrim `bg-scrim` (`--z-overlay`) + panel centrado
`rounded-xl shadow-lg` (`--z-modal`). Header transparente con
`border-b border-border` — el mismo tratamiento que `CardHeader`, en todos
los modales por igual —, título `text-heading-md` + subtítulo mono
opcional + cerrar (`ICON_BTN_SM`). Sin `headerExtra`, la línea del título
usa los tokens de `CardHeader`: alto `h-(--card-header-h)` sin padding
vertical y `px-(--card-px)`. Body `bg-surface` con `p-5` que crece
con el contenido y scrollea hasta el tope de alto. Footer con botones a la
derecha (`modalNeutralBtnCls` + `modalPrimaryBtnCls`).

**Props:** `title`, `subtitle?`, `open`, `onClose`, `size?` (`"sm"` 480 /
`"form"` 640 / `"lg"` 920 / `"xl"` 1120), `footer?`, `children`, y para
extenderlo sin tocar a los demás:
- **`label`**: label de contexto ARRIBA del título (Carbon "modal label"):
  el registro sobre el que actúa el modal (ej. la referencia en
  `text-code font-mono text-text-muted` + `CopyButton` `xs`). El header
  pasa a dos líneas (`px-(--card-px) py-3`), con ✕ centrado en el bloque.
  Es la excepción documentada a la regla de header de una línea.
- **`paso`** (`{ actual, total }`): indicador "Paso N de M" junto al título,
  para un modal de varios pasos (ver [Nunca un modal sobre
  otro](#nunca-un-modal-sobre-otro)).
- **`headerExtra`**: segunda línea dentro del bloque del header (ej.
  "Interrupción `<ref>`" + `CopyButton`). Con ella, la línea del título
  no usa el alto fijo: va `px-5 pt-3.5 pb-0` y `headerExtra` aporta
  `mt-0.5 pb-3.5`.
- **`bodyPadding={false}`**: saca el `p-5` del body (layouts propios de
  borde a borde).
- **`bodyOverflow="hidden"`** (default `"auto"`): el body deja de
  scrollear — ver [Modal de trabajo](#modal-de-trabajo).
- **`bodyClassName`**: clases extra para el body.
- **`height`**: alto CSS fijo, para que el panel no salte de tamaño entre
  estados (ej. `"min(720px, calc(100vh - 40px))"`).

**Estados:** abierto / cerrado (cerrado no renderiza nada).

**Accesibilidad:** `role="dialog"`, `aria-modal="true"`, `aria-label` con
el título; al abrir enfoca el panel (`tabIndex=-1`) y al cerrar devuelve el
foco al elemento previo; cierra con X, clic en el scrim o Escape.

Los dropdowns y popovers que se abren dentro de un `Modal` salen en un
portal (ver [FloatingPanel](#floatingpanel)): el overflow del body no los
recorta.

**Qué no hacer:** cambiar el tamaño del título (es fijo en todos los
modales; un dato propio en `headerExtra` va en un token más liviano,
`text-code` o `text-body-sm`); fondo en el header.

**Archivo:** `src/components/ui/Modal.tsx`.

## ModalCheckbox

**Para qué:** checkbox de formularios y tablas de modales.

**Anatomía:** `<label>` que envuelve un `<input type="checkbox">` oculto
(`peer sr-only`), la caja visible (`w-4 h-4 rounded-xs`, borde
`border-strong`, marcada `bg-primary-strong` + check blanco) y el texto.

**Props:** `label`, `defaultChecked?`, `checked?`, `onChange?`. Sin
`checked`/`onChange` es no controlado; con ambos, controlado por el padre.

**Estados:** reposo, hover (borde `primary`), marcado, foco de teclado
(`PEER_FOCUS_RING` en la caja).

**Accesibilidad:** input nativo, así que teclado y lector de pantalla
funcionan; el texto está dentro del mismo `<label>`, el área clickeable lo
incluye.

**Qué no hacer:** usar `accent-color` o el checkbox nativo visible; sacar
el texto del `<label>`.

**Archivo:** `src/components/ui/ModalCheckbox.tsx`.

## ModalRadio

**Para qué:** opción de un grupo de radio en modales.

**Anatomía:** `<label>` con `<input type="radio">` oculto (`peer sr-only`),
círculo visible (`w-4 h-4 rounded-full`, seleccionado con borde y punto
`primary-strong`) y texto.

**Props:** `name` (**obligatorio**, compartido por todas las opciones del
grupo), `label`, `checked`, `onSelect`.

**Estados:** reposo, hover (borde `primary`), seleccionado, foco de teclado
(`PEER_FOCUS_RING` en el círculo).

**Accesibilidad:** el `name` compartido hace que el navegador maneje Tab
(entra al grupo una sola vez, en la opción elegida) y flechas. El
contenedor del grupo lleva `role="radiogroup"` y `aria-label`, salvo que
mezcle otros controles.

**Qué no hacer:** grupos sin `name`; `onClick` sobre el label en vez del
input.

**Archivo:** `src/components/ui/ModalRadio.tsx`.

## PeriodSelector

**Para qué:** selector del período de trabajo, a la derecha del `TopBar` (y en el encabezado del ABM).

**Anatomía:** trigger `BTN_MD` outline con ícono `Calendar`, período y
chevron que rota; panel con overline "Seleccioná el período" y la lista de
`PERIODS`.

**Props:** ninguna (estado propio).

**Estados:** reposo, hover (tint), abierto (tint persistente), opción
seleccionada (tint).

**Accesibilidad:** cierra con clic afuera.

**Archivo:** `src/components/ui/PeriodSelector.tsx`.

## ReadOnlyField

**Para qué:** par etiqueta/valor de solo lectura.

**Anatomía — dos variantes:**
- **`box`** (default) — grillas densas (datos de la interrupción): etiqueta
  `text-heading-xs uppercase text-text-muted` + caja `h-(--control-sm)`
  `bg-fill-muted` `border-border` con el valor en `text-body-sm`.
- **`plain`** — dato fijo dentro de un formulario: `FieldLabel` (igual que
  los campos vecinos) + valor en `text-body text-text`, sin caja ni borde,
  centrado en `h-(--control-md)` para que la fila quede alineada con los
  controles. En el ABM lo arma `AbmCampo` con `readOnly` para un campo
  que no es toggle.

**Props:** `label`, `value`, `variant?` (`"box"` | `"plain"`).

**Qué no hacer:** usarlo para un campo editable deshabilitado (eso es el
campo con su estado disabled).

**Archivo:** `src/components/ui/ReadOnlyField.tsx`.

## SectionDivider

**Para qué:** separador titulado entre grupos de campos de un formulario
largo (ABM).

**Anatomía:** overline `text-heading-xs uppercase text-text-muted` + línea
`h-px bg-border` que ocupa el resto del ancho.

**Props:** `title`.

**Archivo:** `src/components/ui/SectionDivider.tsx`.

## SelectionActionBar

**Para qué:** confirmar qué registro está seleccionado en el ABM
("REGISTRO SELECCIONADO `<id>`").

**Anatomía:** punto `bg-primary`, overline `text-heading-xs uppercase
text-secondary`, id en `text-code font-mono`; `border-b border-border`.

**Props:** `recordLabel`, `actions?` (slot a la derecha, `ml-auto`), `bare?`
(sin padding ni `border-b` propios, para vivir dentro de otra barra).

**Qué no hacer:** acciones en el layout split del ABM (ahí Modificar/Borrar
viven en la fila y Auditoría en el header del panel). En el layout barra,
`actions` lleva Modificar, Borrar y Deseleccionar.

**Archivo:** `src/components/ui/SelectionActionBar.tsx`.

## SelectWrap

**Para qué:** envoltorio de un `<select>` nativo que le agrega el chevron
(`ICON.md`, `text-icon`) a la derecha.

**Props:** `children`, `className?`.

**Qué no hacer:** usarlo para selects nuevos: el dropdown de valor estándar
es `ValuePicker`.

**Archivo:** `src/components/ui/SelectWrap.tsx`.

## SortableHeaderCell / SortableTh

**Para qué:** encabezado de columna ordenable. `SortableHeaderCell` para
tablas armadas con `div` (flex/grid); `SortableTh` para `<table>` (tabs de
"Tablas relacionadas").

**Anatomía:** `text-heading-xs uppercase`, `text-text-muted` (activo
`text-secondary`), indicador de orden (`SortIndicator`). `SortableTh` es
`sticky top-0 z-(--z-sticky)` con `bg-fill-subtle-solid` en el propio `th`.

**Props:** `label`, `active`, `dir: SortDir`, `onClick`, `className?`
(solo `SortableHeaderCell`).

**Estados:** reposo, hover (`text-text`), activo asc/desc.

**Qué no hacer:** poner el fondo del sticky en el `<tr>`.

**Archivo:** `src/components/ui/SortableHeader.tsx`.

## TableCounter

**Para qué:** contador del toolbar de tabla: "`N` de `M` registros", o
"`N` registros" sin total (toolbar sin resultados).

**Anatomía:** `text-caption text-text-muted tabular-nums`, el número
visible en `font-semibold text-text`.

**Props:** `visibles`, `total?`.

**Qué no hacer:** ocultarlo sin filtros: siempre visible, así el layout no
salta.

**Archivo:** `src/components/ui/TableCounter.tsx`.

## TableToolbar y useTableToolbar

**Para qué:** buscador cliente-side de una tabla, con Exportar opcional.
`useTableToolbar(rows, getCells, resetKey?, searchCols?)` mantiene el
estado de búsqueda y orden de cada tabla.

**Anatomía:** buscador con lupa (`h-(--control-sm)`, `FIELD_FOCUS`) +
Exportar (`actionBtnCls`) y botones extra como `children`. Con `bare`, solo
el buscador, para vivir dentro de un toolbar que arma su propio layout.

**Props:** `search`, `onSearchChange`, `onExport?`, `hideExport?`,
`searchPlaceholder?`, `children?`, `bare?`, `disabled?`.

**Estados:** editable, foco de campo, deshabilitado (`fill-muted` +
`text-faint`).

**Accesibilidad:** el `aria-label` del buscador es el placeholder sin los
puntos suspensivos.

**Qué no hacer:** el placeholder genérico "Buscar en la tabla…" en tablas
nuevas: el buscador declara sus columnas (`searchCols`) y el placeholder las
nombra (ver [Toolbar de tabla y filtros](#toolbar-de-tabla-y-filtros)).

**Archivo:** `src/components/ui/TableToolbar.tsx`,
`src/components/ui/useTableToolbar.ts`.

## TopBar

**Para qué:** el encabezado de pantalla. **Todas las pantallas salvo el
ABM** (que tiene su encabezado propio con el selector de tabla) usan
`TopBar`. No hay breadcrumb ni encabezados de página propios.

**Anatomía:** `<header>` con título `h1 text-heading-md text-text` a la
izquierda y `PeriodSelector` a la derecha; `px-6`, `border-b border-border`,
fondo `bg-bg-app` y alto mínimo `var(--header-min-height, 60px)` (44px en
el tier de 760px). El contenido de la pantalla arranca debajo con su propio
padding (`pt-(--page-pt)` en Consultas de interrupción).

**Props:** `title`. El título de cada pantalla sale del mapa
`TITULOS_PANTALLA` de `src/App.tsx`.

**Accesibilidad:** el título es el `h1` de la pantalla.

**Qué no hacer:** agregarle algo más que el título y el período; títulos
`heading-lg`; breadcrumbs.

**Archivo:** `src/components/layout/TopBar.tsx`.

## UnderlineTabs

**Para qué:** EL patrón de tabs de contenido — elegir qué vista se muestra
dentro de un mismo contenedor (ej. qué tabla en el modal "Tablas
relacionadas").

**Anatomía:** contenedor `flex border-b border-border px-5`; botones
`h-10 min-w-24 px-4 text-body`, el primero con `first:-ml-4` para que el
texto quede alineado con el resto del contenido. El borde inferior va de
lado a lado: el padding mueve el contenido, no el borde.

**Props:** `options: { key, label }[]`, `activeKey`, `onSelect`,
`ariaLabel`.

**Estados:** reposo `text-text-muted` (hover `bg-fill-muted`); activo
`text-secondary font-medium` + `border-b-2 border-primary` superpuesto a la
línea de base vía `-mb-px`.

**Accesibilidad:** `role="tablist"` con `aria-label`, `role="tab"` +
`aria-selected` en cada botón, flechas izquierda/derecha.

**Qué no hacer:** usarlo para seleccionar filas, chips o filtros (eso es el
seleccionado persistente con tint); relleno `bg-primary`.

**Archivo:** `src/components/ui/UnderlineTabs.tsx`.

## ValuePicker

**Para qué:** el dropdown de valor estándar — reemplaza al `<select>`
nativo y al combobox buscable con un solo chrome.

**Anatomía:** trigger `<button>` con el chrome de `MOD_SELECT_CLS` (alto
`--control-md`) y chevron; panel inline (smart-direction) o, con `modal`,
centrado con backdrop para listas largas (~20+ opciones). La única pieza
que varía es el buscador arriba de la lista (`searchable`).

**Props:** `label?`, `opts: CampoOpcion[]`, `value?` / `defaultValue?` /
`onChange?` (sin `value` queda no controlado), `isDisabled?`, `estadoCls?`,
`searchable?`, `modal?`, `modalTitle?`, `emptyMessage?`,
`searchPlaceholder?`, `placeholder?` (default "Seleccioná"),
`wrapClassName?`, `triggerExtraClassName?`, `triggerStyle?`.

**Estados:** sin valor (placeholder `text-muted`), con valor, abierto,
deshabilitado (si pasa a deshabilitado con el panel abierto, el panel se
cierra), sin opciones (`emptyMessage`).

**Accesibilidad:** Escape cierra el panel. Pendiente: roles ARIA de
listbox/option en el panel.

**Qué no hacer:** `<select>` nativo nuevo; un combobox con chrome propio.

**Archivo:** `src/components/ui/ValuePicker.tsx`.

---

# 3. Patrones

## Card con secciones

Anatomía de las cards de la vista de trabajo (Interrupciones y
Reposiciones en Consultas de interrupción): **un único contenedor**
dividido en franjas por líneas `border-border` a todo el ancho.

```
┌──────────────────────────────────────────────────────────┐
│ Título (heading-md) [CDS4] · ETIQUETA valor  [acciones] │  header (alto fijo --card-header-h)
├──────────────────────────────────────────────────────────┤  línea del header (siempre)
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

- **Header de card:** `CardHeader` — título
  `heading-md` con el badge CDS en línea, acciones (si hay) a la derecha,
  línea inferior a todo el ancho, siempre visible.
- **Toolbar siempre presente:** se renderiza aunque no haya resultados.
  Sin resultados, el buscador y el filtro quedan deshabilitados y el
  contador dice "0 registros". Así el divisor del header nunca queda pegado
  al `thead`.
- **Tablas al ras:** sin margen lateral, sin borde ni radio propios. Llevan
  una línea superior `border-border` (si la tabla va justo debajo del
  header, esa línea es el divisor del header — nunca dos líneas juntas) y
  el `thead` en `fill-subtle`, de alto fijo de 32px (borde incluido, texto
  centrado, sin padding vertical). La primera y la última celda de cada
  fila usan el padding de la card (`pl-(--card-px)` / `pr-(--card-px)`).
  La paginación va al pie, con `border-t` y fondo `fill-subtle`.
- **Secciones** (Reclamos durante la interrupción, Tablas relacionadas):
  separadas por `border-t border-border` a todo el ancho, sin borde, fondo
  ni radio propios. Título en `heading-sm` (`CardHeader` con
  `level="section"`, sin divisor). Si la sección pinta un fondo (hover) y
  es la última de la card, lleva el radio inferior de la card
  (`rounded-b-md`).
- **Una card, una superficie:** no se anidan contenedores con borde dentro
  de una card — nada de cards dentro de cards, ni tablas con borde/radio
  propios, ni bloques con fondo y borde. Si el scroll interno necesita un
  wrapper, no lleva borde ni fondo. Todo lo que necesite separarse es una
  sección.
- **Alto:** cada card se ajusta a su contenido; dos cards lado a lado no
  se fuerzan al mismo alto (`items-start` en la fila). El tope es el alto
  disponible (`max-h-full`): si el contenido no entra, la tabla se achica y
  scrollea adentro (`min-h-0 overflow-y-auto`), nunca la página.
- **Sin `overflow-hidden` en la card:** recortaría el panel del filtro de
  Fecha y cualquier otro popover.
- **Gap entre cards:** `gap-(--cards-gap)`, un único valor por pantalla.
- **Búsqueda sin contenedor:** en Consultas de interrupción la fila de
  filtros no es una card: se apoya directo en el fondo de la página,
  debajo del `TopBar` ("Búsqueda de interrupciones"), con
  `pt-(--page-pt)` y `px-(--page-px)`.
- **Acciones del registro** (Desarmes, Lotes, Nivel/Tipo, Replicar,
  Cambia fases, Alta clientes, Intercambio) no viven en la pantalla: son
  los ítems del grupo desplegable "Herramientas" del menú lateral (mismo
  patrón que "Alta, Baja y Modificación"; un solo grupo desplegado a la
  vez). Los que dependen de la interrupción seleccionada quedan
  deshabilitados (`text-faint`) hasta definir cómo se resuelven.

## Lista de filas

Alternativa a la tabla para registros con **pocos campos**, un
**identificador principal** y metadatos secundarios (ej. Reposiciones en
Consultas de interrupción, `ReposicionesLista`). Si el usuario necesita
comparar columnas u ordenarlas, va tabla.

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
  scroll propio (`min-h-0`), flechas arriba/abajo, foco `FOCUS_RING_INSET`.
- **Semántica:** contenedor `role="listbox"` con `aria-label`, filas
  `role="option"` con `aria-selected`.
- **Sin acciones por fila** (ni menú ⋯): las acciones son de la card.
- **Vacío:** el mismo estado de las tablas (`Inbox` + texto).

## Toolbar de tabla y filtros

- **Ubicación:** el toolbar va **fuera** del contenedor de la tabla, sin
  fondo propio y **sin línea divisoria** con la tabla; se vincula por
  proximidad. Padding `px-(--card-px) py-3` en la vista de trabajo,
  `px-4 py-3` en el resto; en el modal "Tablas relacionadas", `px-5 pb-3`
  con el contenedor de la tabla en `mx-5 mb-5`.
- **Orden:** buscador → divisor vertical (`w-px h-5 bg-border`) → triggers
  de filtro (`FilterTrigger`) → a la derecha (`ml-auto`) "Limpiar filtros"
  (solo con ≥1 filtro activo; quita los filtros, no el texto del buscador)
  + `TableCounter`. Mismo esquema en cards y modales.
- **Búsqueda con alcance explícito:** el buscador declara sus columnas
  (`searchCols` de `useTableToolbar`) y el placeholder las nombra (ej.
  "Buscar referencia…"). Con filtros por columna, el buscador cubre solo
  las columnas no filtrables.
- **Estados sin datos:** nunca con opacidad reducida si el elemento muestra
  un valor (el valor es información, no decoración). Si no es interactivo,
  se renderiza como elemento no interactivo (`<div>`, fuera del orden de
  tabulación, `cursor-default`, sin hover) con borde punteado
  (`border-dashed border-border`, sin fondo) y texto `text-text-muted` — ej.
  los tiles de "Tablas relacionadas" con 0, "No" o sin selección.

## Registro seleccionado y detalle

- **Registro seleccionado:** fila resaltada en su tabla
  (`bg-primary-tint` + `inset-shadow-row-selected`). En paneles que muestran
  datos hijos de ese registro, el registro va como contexto del header
  (ej. "Interrupción `<ref>`").
- **Detalle:** se abre desde la sección de detalle clickeable (ej.
  `ReclamosResumenCompacto` → "Datos de la interrupción"), sin un botón
  duplicado en ningún header.
- **Stretched button:** la sección clickeable no es un `<button>` (un
  heading dentro de un botón es HTML inválido). El botón vive en `actions`
  de `CardHeader`, con `aria-label`, y su `::after` (`after:absolute
  after:inset-0`) cubre la sección, que es `relative`. Hover y foco sobre
  toda la sección (`hover:` en la sección, `has-[:focus-visible]` con el
  anillo inset), y `ChevronRight` decorativo en el header como señal de que
  se abre.

## Orden de botones

Aplica a top bar, header de card, filter bar, toolbar y pie de modal:

1. **Secundarios** (outline) primero.
2. **Primario** después — máximo uno por zona, siempre el último a la
   derecha de los botones normales.
3. **Overflow ⋯** (si existe) en el extremo derecho, después del primario.

Las acciones de una zona se alinean a la derecha de esa zona (`ml-auto` /
`justify-end`). Ejemplo: `[Limpiar] [Buscar] [⋯]`; pie de modal:
`[Cancelar] [Guardar]`.

## Aire: chrome vs datos

Para dar más aire a las pantallas altas sin tocar las notebooks se separa
el **chrome** de los **datos**:

- **Chrome (estructura):** padding de página, gaps entre bloques de la
  página (encabezado, filter bar, fila de cards), gap entre cards, y el
  padding de las cards (header, toolbar, extremos de tabla, paginador,
  secciones). Usa las variables de chrome.
- **Datos:** filas de tabla, celdas, inputs, botones, filter bar. Siguen con
  `--spacing`, sin variables de chrome.

| Variable | Qué controla | > 900px de alto | ≤ 900px y ≤ 760px |
|---|---|---|---|
| `--card-px` | padding horizontal de card (header, toolbar, extremos de tabla, paginador, secciones) | 24px | `calc(var(--spacing) * 4)` |
| `--card-section-py` | aire superior de una sección y inferior de su cuerpo | 20px | `calc(var(--spacing) * 3)` |
| `--page-px` | padding horizontal de la página | 32px | `calc(var(--spacing) * 5)` |
| `--page-pt` | padding superior (e inferior) de la página | 24px | `calc(var(--spacing) * 5)` |
| `--page-gap` | gap vertical entre filter bar y fila de cards | 24px | `calc(var(--spacing) * 4)` |
| `--cards-gap` | gap entre cards | 24px | `calc(var(--spacing) * 4)` |

Se definen en `:root` de `src/index.css`. Se usan con la sintaxis de
Tailwind v4: `px-(--card-px)`, `gap-(--cards-gap)`.

**Regla: el aire va en la estructura, nunca en las filas de datos.** Más
espacio entre cards, headers y secciones; las filas, celdas y controles no
crecen (más filas visibles por pantalla). Una columna que se alinea con el
header (primera/última celda) usa `--card-px` solo en ese borde.

Aplicado hoy en Consultas de interrupción. Otras pantallas migran de a una.

## Modal de trabajo

Para un modal con contenido propio de trabajo (no un formulario de acción
puntual) — ej. "Tablas relacionadas" de Consultas de interrupción — el
contenido va de borde a borde del modal, alineado al mismo `px-5` que el
header. Sin cards ni fondo gris en el body.

- **Header:** `headerExtra` lleva SOLO la identidad del modal, el dato que
  no cambia mientras está abierto (ej. Interrupción + `CopyButton`), con
  `pb-3.5` fijo. Un dato que SÍ cambia con la interacción (ej. qué
  reposición está activa) va en el body, no en el header.
- **Body:** `bodyPadding={false}` + `bodyOverflow="hidden"` — el body nunca
  scrollea ni tiene padding/fondo propios. Su único hijo es un wrapper
  `h-full flex flex-col min-h-0`: filas fijas (`shrink-0`, con su propio
  `px-5`) arriba — la primera, la [barra de contexto de
  registro](#barra-de-contexto-de-registro), sin `border-b` propio (lo pone
  la fila de tabs) — y la zona de trabajo (`flex-1 min-h-0`) al final.
- **El scroll vive dentro de un contenedor propio** con borde (`border
  border-border rounded-md overflow-auto`, `mx-5 mb-5`) — la única zona con
  scroll del modal; todo lo demás (tabs, descripción, toolbar) es
  `shrink-0`.
- **Tabla dentro de ese contenedor:** `thead` `sticky top-0` con fondo
  opaco en el propio `<th>`; la tabla va `border-separate` +
  `border-spacing:0` con los separadores de fila en `<td>` (bajo
  `border-collapse` un borde de fila puede pintarse sobre el `<th>`
  sticky).
- **Estados especiales** (resultado Sí/No, vacío con ícono+texto+acción)
  van dentro del mismo contenedor con borde, centrados (`h-full flex
  items-center justify-center`) — nunca sueltos en el body.

## Layout de ABM — variante barra (en prueba, solo Tabla 2)

El ABM tiene dos layouts, elegidos por tabla con `layout` en
`src/data/abmTables.ts` (`AbmLayout`). El masthead (selector de tabla +
período) es el mismo en los dos.

- **`split`** (default, CDS3…CDS9-NM): panel de Búsqueda/formulario a la
  izquierda (41%; ~47% en el tier de 760px) y panel de Resultados a la
  derecha. Seleccionar una fila vuelca sus datos en el formulario
  ("consultando"); Insertar y Modificar usan el mismo panel de la izquierda
  y atenúan Resultados.
- **`barra`** (en prueba, solo CDS2): el formato de la búsqueda de
  Consultas de interrupción con los campos de la tabla.

```
┌ masthead: [Tabla 2 · CDS2 ▾]                                [Período ▾] ┐
│                                                                         │
│ Código de interrupción  Fecha     Nivel de tensión  Fase eléctrica  Origen              Tipo                      │  labels (FieldLabel)
│ [               ]       [      ]  [BT|MT|AT]        [     ▾]        [Interno|Externo]   [Forzado|Programado]  [Más filtros] [Limpiar] [Buscar] │  barra, sin contenedor
│ FILTROS APLICADOS: (chip ×) (chip ×)                                     │  solo si hay filtros del flyout
│                                                                (gap --page-gap)
│ 40 de 40 registros                                                     │  barra de herramientas, sobre el fondo (sin selección)
│ • REGISTRO SELECCIONADO BFZ…        [Modificar] [Borrar] [✕]            │  … o con un registro seleccionado
│                                                                (gap-2)
│ ┌───────────────────────────────────────────────────────────────────┐   │  caja de la tabla (borde, md, surface, shadow-sm)
│ │ REFERENCIA  FECHA  NIVEL  FASE  ORIGEN  TIPO  CÓD. EQUIPO  ALIM. MT │   │  thead fill-subtle-solid, sticky
│ │ fila…                                                              │   │
│ │ Registros encontrados: N           Anterior  Pág. 1 de N  Siguiente │   │  paginación fill-subtle, border-t
│ └───────────────────────────────────────────────────────────────────┘   │
```

- **Formato compartido con Consultas, campos de la tabla.** De Consultas se
  copia solo el formato (`AbmBarraBusqueda`): fila única apoyada en el
  fondo (`--z-raised`), "Más filtros" con badge y flyout anclado a la
  derecha (`--z-dropdown`, backdrop en `--z-dismiss`), chips de filtros
  aplicados, y Limpiar + Buscar a la derecha (`ml-auto`, Buscar primario
  último). Los campos y controles salen **siempre** de la config de la
  tabla: cada uno se renderiza con `AbmCampo` — mismo label (`FieldLabel`
  arriba), control, opciones, placeholder y estado (`valores` / `setValor`)
  que en el panel de Búsqueda del split.
  - **Fila:** las secciones de identificación y clasificación
    (`barraBusqueda.seccionesBarra`; en CDS2, "Identificación" y
    "Clasificación"), en su orden.
  - **"Más filtros":** el resto (`seccionesMasFiltros`; en CDS2, "Datos de
    red"). El badge cuenta esos campos con valor.
  - **Alineación y anchos:** la fila alinea por la base (`items-end`): los
    botones quedan a la altura de los controles, no de los labels. Cada
    campo tiene ancho fijo acorde a su contenido (`barraBusqueda.anchos`;
    los toggles, el de sus opciones) y no se estira. En el tier de 760px la
    fila hace wrap; los toggles no se reemplazan por selects.
  - **Controlados:** los inputs de texto van controlados también en modo
    buscar (`AbmCampo` con `controlado`), así el badge y los chips cuentan
    sus valores y Limpiar los vacía.
- **Diferencia con Consultas y con el split:** seleccionar una fila **no**
  deshabilita la barra ni le vuelca datos (no hay estado "consultando").
- **Sin card de Resultados:** no hay card ni `CardHeader` "Resultados".
  Debajo de la barra de búsqueda (`gap-(--page-gap)`), en la misma vertical
  (`--page-px`):
  - **Barra de herramientas de la tabla**, afuera de la caja, apoyada sobre
    el fondo, sin fondo ni borde propios, de alto fijo (`--control-md`) con
    dos modos que no cambian su alto: sin selección, solo `TableCounter`
    a la izquierda — vacío antes de la primera búsqueda (y después de
    Limpiar), "N de M registros" después de Buscar, "0 registros" si la
    búsqueda no trajo resultados; con un registro seleccionado, `SelectionActionBar`
    (`bare`) con Modificar y Borrar (`ghostBtnCls` neutral y destructivo,
    `sm`), un separador vertical y un botón de ícono ✕ (`ICON_BTN_SM`,
    "Deseleccionar"). Son acciones de registro: no compiten con Más filtros
    / Limpiar / Buscar, que son acciones de página.
  - **La tabla conserva su contenedor**, a `gap-2` de la barra de
    herramientas: la misma caja que dentro del panel Resultados del split
    (`border border-border rounded-md bg-surface shadow-sm`), `thead`
    sticky en `bg-fill-subtle-solid`, filas con hover `fill-muted` y
    seleccionada `primary-tint` + `inset-shadow-row-selected`, paginación al
    pie dentro de la caja (`border-t`, `bg-fill-subtle`, `rounded-b-md`).
    Sin `overflow-hidden` en la caja: el radio lo resuelven el wrapper con
    scroll (`rounded-t-md`) y el pie. El scroll es del body de la tabla,
    nunca de la página.
  - **Estado vacío** antes de buscar: el de Interrupciones en Consultas
    ("Completá los filtros y presioná Buscar"), centrado dentro de la caja.
  - Columnas propias (`columnasResultadoBarra`); una columna con `campo`
    muestra la etiqueta de la opción (Interno/Externo, Forzado/Programado),
    también para buscar y ordenar. Se atenúa con el flyout abierto.
- **Un solo buscador:** cuando la pantalla tiene barra de búsqueda
  general, la tabla no lleva buscador ni filtros propios (ni `TableToolbar`
  ni `FilterTrigger`): las filas visibles salen solo de Buscar. Su barra de
  herramientas muestra el contador o, con selección, las acciones del
  registro. El orden por columna se mantiene (es ordenar, no buscar).
- **Acciones de registro solo con selección:** no hay columna de acciones
  por fila (ni en reposo ni en hover). Modificar y Borrar aparecen en la
  barra de herramientas solo con un registro seleccionado; ✕ o Escape lo
  deseleccionan. Las flechas siguen moviendo la selección.
- **Auditoría y Exportar: deprecados en esta variante** (no se renderizan;
  pendientes de reubicar). Siguen en el layout split.
- **Modificar en modal:** abre un [modal de edición de
  registro](#modal-de-edición-de-registro). Guardar abre el mismo
  `ConfirmarModificarModal`; Borrar abre `ConfirmarBorrarModal`, como en el
  split.
- **Sin Insertar:** el layout barra no tiene formulario de alta; solo sirve
  para tablas sin `hasInsertar` (CDS2).

## Formulario de edición

Formulario **horizontal en filas** (patrón de pantallas de configuración),
hoy en el paso 1 del [modal de edición de
registro](#modal-de-edición-de-registro):

- **Un campo por fila** ([`FormRow`](#formrow)): label a la izquierda
  (`text-body`), control a la derecha.
- **Los controles forman una columna fija a la derecha:** inputs, fecha,
  select y combobox de ancho `--form-control-w` (280px), todos iguales;
  toggles a su ancho intrínseco, alineados a la derecha.
- **Separador suave entre filas** (`border-b border-border-subtle`, la
  última de cada sección sin borde), filas de `min-h 56px`.
- **Secciones con overline** (`text-heading-xs uppercase text-text-muted`,
  sin línea): 24px respecto de la sección anterior, 4px antes de la primera
  fila. Campos en el orden y las secciones de la config de la tabla.
- Read-only con candado junto al label y el control en su estado read-only.

## Modal de edición de registro
## Modal de edición de registro

Para editar un registro desde una tabla cuando el formulario no está a la
vista (ej. Modificar en el layout barra del ABM). Un solo modal con dos
pasos: **Editar → Revisar**.

- **Tamaño `form`** (640px), el mismo en los dos pasos; el alto se ajusta al
  contenido.
- **Header:** label de contexto arriba del título (Carbon "modal label",
  prop `label` de `Modal`) con el registro sobre el que actúa — la
  referencia en `text-code font-mono text-text-muted` + `CopyButton` `xs` —;
  debajo el título (`text-heading-md`) con el indicador "Paso N de 2"
  (`text-body-sm text-text-muted`, prop `paso`); ✕ a la derecha, centrado en
  el bloque. Los headers de modal con label son la excepción documentada a
  la regla de header de una línea. El identificador no aparece en el body.
- **Paso 1 — Editar:** el [formulario de edición](#formulario-de-edición)
  horizontal en filas, con los campos de la config de la tabla agrupados
  por sección (en CDS2: Identificación, Clasificación, Datos de red; sin el
  código de interrupción, que va en el header).
  - **No editables en read-only** (ver [Estados: disabled vs
    read-only](#estados-disabled-vs-read-only)): el toggle con su valor
    marcado a contraste completo y un candado junto al label — **nunca como
    controles deshabilitados**.
  - Pie: Cancelar · **Revisar cambios** (primario, habilitado solo si algún
    campo es distinto del original).
- **Paso 2 — Revisar:** mismo modal y mismo header; el body pasa a
  `RevisarCambiosContent` (Resumen de cambios + Motivo, el mismo contenido
  que la confirmación del layout split). Pie: **Volver** (outline, vuelve al
  paso 1 con todo lo editado) · **Guardar** (primario, habilitado solo con
  un motivo válido). Guardar hace exactamente lo que hacía la confirmación
  y cierra.
- Al pasar de paso, el foco va al primer elemento interactivo del body
  nuevo. Escape, ✕ y Cancelar cierran todo el flujo sin guardar, en
  cualquier paso.
- Los dropdowns del formulario se abren en un portal
  ([FloatingPanel](#floatingpanel)): la lista completa de un combobox nunca
  queda recortada por el body.

## Nunca un modal sobre otro

**Nunca se abre un modal desde otro modal.** Si una acción dentro de un
modal necesita un paso extra (revisar, justificar, confirmar), es un
**paso del mismo modal**: el body cambia, el header indica "Paso N de M"
(prop `paso` de `Modal`) y el pie ofrece Volver junto al primario. El ancho
no cambia entre pasos.

## Barra de contexto de registro

Cuando una vista (modal, drawer) opera sobre un registro, arriba va un
contenedor único (borde de card, fondo blanco) con:

- identificador en semibold + `CodeBadge` + metadatos como texto plano
  separados por "·", valor en `text-text` y unidades/labels en
  `text-text-muted`;
- sin chips internos, salvo estados de solo lectura (`FaseIndicador`, la
  única caja dentro de la caja: cada letra es un estado) o controles;
- navegación entre registros anclada a la derecha (`ml-auto self-start`:
  con el grupo izquierdo en wrap, queda arriba a la derecha; nunca scroll
  horizontal).

Todo el contenido debajo pertenece a ese registro. Ej.:
`FaseReposicionFicha` en "Tablas relacionadas" ("Reposición 1 `CDS4` · hora
· Fase R S T · equipo · usuarios BT"), con destello `primary-tint` al
cambiar de reposición (sin destello con movimiento reducido).

## Contenedores flex con scroll

En un layout `flex-col` con `overflow-y-auto`, los hijos con su propio
`overflow` no visible (una card con `overflow-hidden`, una tabla con scroll
interno) llevan `shrink-0`. Sin eso, el `min-height` automático de un flex
item pasa a `0` y, si el contenido supera el alto disponible, flex achica
los hijos en vez de dejar que el contenedor scrollee. El que scrollea es
siempre el contenedor exterior, nunca sus secciones.

## Voz y formatos

- **Voseo en toda la app:** "Seleccioná", "Ingresá", "Completá",
  "Presioná" — nunca la forma de usted ("Seleccione", "Ingrese").
- **Mayúscula solo en la primera palabra** de labels, títulos y botones
  ("Datos de la interrupción"), salvo siglas y nombres propios (CDS2,
  BT/MT/AT, Edenor, CTs). Los labels abreviados heredados de la base
  ("Hue Ini SR", "Max Med SR"…) no se tocan.
- **Helpers únicos** (`src/lib/format.ts`), sin `toLocaleString` ni armado a
  mano:

  | Helper | Resultado |
  |---|---|
  | `formatNumero(n)` | es-AR, miles con punto desde 1.000 ("1.234.567") |
  | `formatFecha(d)` | `dd/mm/aaaa` |
  | `formatHora(d)` | `hh:mm`, 24 h |
  | `formatFechaHora(d)` | `dd/mm/aaaa hh:mm`, 24 h |
  | `VALOR_VACIO` | `"—"`, para todo valor ausente o no aplicable |

  Formatos cortos del mismo archivo: `fmtDiaHora` (`dd/mm hh:mm`, rango de
  filtro), `fmtHoraCorta` (`hh:mm` o `dd/mm hh:mm`, ejes del timeline),
  `fmtDuracion` / `fmtDelta` / `partesDuracion` (duraciones "1 h 14 min").
