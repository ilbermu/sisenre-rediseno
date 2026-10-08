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
  `TopBar` con "Búsqueda de interrupciones" (desde el 08/10/2026,
  "Consulta de interrupciones", igual que su ítem del menú), como Inicio y
  "Otros".

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

Vigesimocuarta pasada (también 06/10/2026):

- **Formulario de edición sin títulos de sección:** el paso 1 del modal de
  Modificar (CDS2) es una lista continua de `FormRow`, con el mismo ritmo y
  separador entre todas las filas.

Vigesimoquinta pasada (también 06/10/2026):

- **Toggles de igual ancho:** en `ButtonSelectGroup` y en el toggle de
  `AbmCampo`, todas las opciones de un grupo miden lo que la más larga
  (`inline-grid grid-flow-col auto-cols-fr`). El Motivo de
  `RevisarCambiosContent` conserva la fila con wrap (`igualAncho={false}`).

Vigesimosexta pasada (también 06/10/2026):

- **Fase (R/S/T):** nuevo tipo de campo `"fase"` en la config del ABM —
  tres botones de selección múltiple, valor ordenado R-S-T, mínimo una
  letra en edición, ninguna = sin filtro en búsqueda. Reemplaza el select
  R/S/T/RST de `faseElectrica` en CDS2. Regla: un campo de pocas opciones
  cortas se resuelve con botones, no con un dropdown.

**07/10/2026**

- **ABM — encabezados de columna cortos y unificados:** `labelColumna` por
  campo; mismo nombre real = mismo encabezado en todas las tablas ("Cant.",
  contexto omitido, "Nro. X"), con excepciones documentadas (Tabla 7: SSEE,
  POT, POTENCIA); los chips usan el mismo texto; verificación de desarrollo
  (`encabezadosInconsistentes`).

- **ABM — columnas de Resultados = estructura de la tabla real:** todos los
  campos con `nombreReal`, en el orden real (`ordenTablaReal`), con el
  campoId primero y fijo; sin campos sin nombreReal ni auditoría; sin
  máximo; "Nro. cuenta" para POL / CUENTA (`labelColumna`). Se derivan
  (`columnasDeResultados`) y se elimina `columnasResultadoBarra`. Scroll
  horizontal solo si no entran, con el ID fijo (sección nueva "Tabla de
  resultados").

- **Tipografía en tablas:** `font-mono` solo en el valor del identificador
  del registro (columna del `campoId` en el ABM, Referencia en
  Interrupciones de Consultas); todo lo demás en fuente de texto; cifras
  con `tabular-nums`. Se elimina la prop `mono` de las columnas.
- **`ColumnHeaderHint`:** sin subrayado (el título pasa a `text-secondary`
  con hover o foco), tag arriba del título con `primary-tint` /
  `chip-border` / `text-secondary` en fuente de texto.

- **`ColumnHeaderHint`** (nuevo): tag con el nombre real de la columna
  (hover/foco, 300 ms). Los campos del ABM suman
  `nombreReal`; los encabezados de Resultados usan el label del formulario
  ("Código de interrupción" también en Tabla 2) y muestran el nombre real
  como pista.

- **ABM — regla de chips:** hasta 5 chips visibles (prioridad fecha →
  listas cerradas → orden del formulario); con 5 filtros o menos no hay
  "Agregar filtro". `filtrosBarra.fijos` pasa a `visibles`; columnas:
  campoId, fecha y los campos de los chips visibles (máximo 7).

- **ABM — patrón único:** todas las tablas usan la pantalla y el modal de
  Tabla 2; el formulario y las reglas de edición siguen siendo de cada
  tabla. Config: `campoId`, `filtrosBarra` (regla de fijos y agregables;
  el editor sale del tipo del campo), `columnasResultadoBarra` con labels
  completos, `tituloModificar`; se quitan `layout`, `columnasResultado` y
  el layout split. Insertar (tablas con `hasInsertar`) en el mismo modal:
  "Insertar en Tabla N", Completar → Revisar. Se eliminan `SectionDivider`,
  `AbmFila` y `ConfirmarModificarModal`.

- **Nomenclatura "Tabla N":** cada tabla suma `nombre` en su config; tags,
  badges, selector, accesos del Inicio y links muestran "Tabla N". El
  código CDS queda como dato interno (exportaciones, archivos, tooltip del
  selector). Reemplaza la decisión de mostrar el código como tag.
- **ABM con `TopBar`:** deja su encabezado propio; "Alta, baja y
  modificación" + `PeriodSelector` controlado (`TopBar` suma `periodo` /
  `onPeriodoChange`).
- **`AbmTableSelector`, variante título:** "Tabla 2 · Interrupciones" en
  `heading-md` + chevron, sin borde ni fondo en reposo; primer elemento del
  contenido en los dos layouts del ABM.

- **Modal `form` a 704px** (token `--modal-form-w`, antes 640): los chips
  de Motivo entran en una sola fila en el paso Revisar; mismo ancho en los
  dos pasos. La columna de controles del paso 1 no cambia (280px).

- **Toggle de solo lectura = segmentado estático** (`SegmentadoSoloLectura`,
  nuevo): una caja `READONLY_FIELD_CLS` con segmentos de texto y divisores,
  la opción elegida con `Check`. Regla: un control que no se puede usar no
  conserva la forma de botón. Se quita `readonlyOpcionCls`.
- **Revisar cambios:** Motivo deja la caja azul (`border-primary` +
  `primary-tint`) y pasa a ser una sección separada por `border-t`; ningún
  bloque del modal lleva fondo de color.

- **Estado de solo lectura unificado:** `READONLY_FIELD_CLS` y
  `readonlyOpcionCls` (`tokens.ts`) — fondo `fill-subtle`, borde `border`,
  contenido a contraste completo, sin hover; la opción seleccionada de un
  toggle en solo lectura usa `border-chip-border`. Tabla editable / solo
  lectura / deshabilitado en Fundamentos; regla: un dato no editable se
  muestra en solo lectura, nunca como control normal ni deshabilitado.
  `ReadOnlyField` pierde la variante `plain`.
- **Modal de edición de registro:** el identificador es el primer campo,
  de solo lectura, con copiar adentro; el header queda en una línea
  (título + paso). `Modal` pierde la prop `label`.

- **`ChipFilterBar` — correcciones:** etiqueta corta de chip
  (`chipLabel`) y `soloValor` (regla: solo-valor únicamente para valores
  que se explican solos); `title` / `aria-label` siempre con el label
  completo. Chip vacío = texto + chevron; con valor = texto + ✕ (sin
  chevron), con la ✕ en su propio espacio. Editor de fecha nuevo
  (`RangoFechaCalendario`): atajos Hoy / Ayer / Últimos 7 días / Período
  completo, calendario en modo rango con el skin de `DateTimeField` y hora
  en `HoraCombobox` (nuevo). "Período completo" ligado al `PeriodSelector`,
  que pasa a ser controlable (`value` / `onChange`).

- **`ChipFilterBar`** (nuevo, `components/ui`): barra de filtros híbrida —
  input de ID directo + chips fijos y agregables que aplican al instante,
  sin botón Buscar; editores por tipo (lista, lista con buscador, texto,
  rango de fecha con hora opcional); chips de 200px máx. con valor truncado
  y `title`; desborde en una línea ("+N filtros", modo compacto).
- **`AnchoredPopover`** (nuevo): popover en portal anclado a su
  disparador. Regla: un popover se ancla a su disparador.
- **`FilterTrigger`:** exporta `FilterTriggerButton` (`size="md"`,
  `maxWidth`, `valorDestacado`, `quitarSiempre`) y `RangoFechaEditor`; su
  aspecto no cambia. `ICON_BTN_MD` se exporta; `FieldLabel` suma `htmlFor`.
- **Patrón "Barra de filtros híbrida"** para la búsqueda principal de
  pantallas de datos. **ABM Tabla 2** pasa de `FilterBar` a
  `ChipFilterBar` (`config.filtrosBarra`); se elimina
  `barraBusqueda.campos`. Consultas sigue con `FilterBar`.

- **ABM, variante barra — buscar y refinar:** Buscar filtra de verdad las
  filas de muestra (`filtrarFilas`); Enter en un input y Aplicar del flyout
  ejecutan la búsqueda; estado vacío "No hay registros con estos filtros" +
  "Limpiar filtros". `FilterBar` nunca se bloquea por haber resultados
  (Buscar siempre habilitado, Origen/Tipo ya no quedan fijos); Consultas
  conserva solo el bloqueo por interrupción seleccionada.

- **Fase eléctrica vuelve a dropdown:** se elimina el tipo de campo
  `"fase"` (botones R/S/T de selección múltiple) y su sección del DS;
  `faseElectrica` de CDS2 es un select con R, S, T, RS, RT, ST, RST, también
  en el modal de Modificar (`--form-control-w`). `FaseIndicador` no cambia.
- **Regla de botones vs dropdown** (reemplaza "un campo de pocas opciones
  cortas se resuelve con botones"): dropdown en barras de filtro y zonas
  densas; toggle en formularios de edición solo para elegir una opción
  entre 2–3 cortas; dropdown para valores combinados o listas; indicadores
  de solo lectura sin interacción. Ver [Formulario de
  edición](#formulario-de-edición).

- **`FilterBar`** (nuevo, `components/ui`): la barra de búsqueda general
  de Consultas de interrupción sale de `ModificarContent` a un componente
  controlado por la pantalla. Regla: toda pantalla con barra de búsqueda
  general usa `FilterBar`; nunca se copia el markup.
- **Flyout "Más filtros":** Descripción equipo operado pasa a combobox con
  la lista completa en modal (`ValuePicker` `searchable` + `modal`) y
  División red normal a toggle Sí / No de igual ancho.
- **ABM, variante barra:** Tabla 2 deja `AbmBarraBusqueda` (campos de la
  config renderizados con `AbmCampo`) y usa `FilterBar`, idéntica a la de
  Consultas. `barraBusqueda` pasa a ser un mapeo filtro → campo
  (`campos`); se eliminan `seccionesBarra`, `seccionesMasFiltros`, `anchos`
  y la prop `controlado` de `AbmCampo`.

**08/10/2026**

- **ABM — título de la tabla:** "Tabla N" pasa a ser un chip (píldora de
  22px, `primary-tint` / `chip-border` / `text-secondary`) delante del
  nombre en `heading-md text-neutral-900`, sin "·"; chip, nombre y chevron
  siguen siendo un único botón. Las opciones del dropdown repiten el formato.
- **ABM — sin contador:** se elimina "N de M registros" y la franja entre la
  barra de filtros y la tabla; el estado vacío va dentro de la caja, debajo
  del `thead`. Espaciados: `--page-gap` entre el header y los filtros, `gap-3`
  entre los filtros y la tabla.
- **ABM — toolbar de tabla persistente:** entre la barra de filtros y la
  tabla va una toolbar que **siempre existe** (patrón de toolbar de Carbon:
  cambia el contenido, no el layout), sin fondo en ninguno de los dos estados.
  Sin selección: contexto de los datos ("Período 08/2026 · Actualizado
  10:42") + Exportar y Auditoría; con selección: texto plano "<id>
  seleccionado" (o "N registros seleccionados") + link Deseleccionar, y
  Modificar (solo con 1) / Borrar a la derecha. Crossfade de 120ms, sin
  cambio de alto: la tabla no se mueve nunca. La selección ya es una
  colección de ids (múltiple preparada, no habilitada). Se
  probaron y descartaron una barra superpuesta al `thead` y una franja
  condicional animada; se elimina `SelectionActionBar`. Exportar (CSV
  client-side) y Auditoría vuelven al ABM.
- **`ChipFilterBar` — input de ID:** ancho fijo (`--filter-id-w`, 224px);
  placeholder en fuente de texto = encabezado de la columna del ID (se
  elimina `idPlaceholder` de la config); el valor tipeado sigue en mono.
- **Chips = encabezado de columna:** los `chipLabel` de las 9 tablas son
  exactamente el encabezado de su columna ("Fase de reposición", "Nro.
  cuenta", "Alimentador MT"…); `encabezadosInconsistentes` también lo
  verifica.
- **Consultas de interrupción — maestro-detalle sin cards:** se sacan las
  cards Interrupciones/Reposiciones, la sección "Tablas relacionadas", el
  buscador de referencia y la barra `FilterBar`. Split persistente 52/48:
  Tabla 2 a la izquierda (sobre el fondo de la app) y la interrupción
  seleccionada como hoja blanca a la derecha (header, franja de cifras,
  línea de tiempo de reposiciones y reclamos). Patrón nuevo:
  [Maestro-detalle](#maestro-detalle).
- **`ChipFilterBar` — un solo overflow:** la barra es siempre una sola fila
  y los chips que no entran se ocultan por prioridad (del último al primero)
  hacia un botón final "Más filtros" (o "Agregar filtro" si no se oculta
  ninguno), con contador de ocultos activos. Reemplaza al "+N filtros" y al
  modo compacto; no hay variante compacta. "Limpiar filtros" borra todo.
- **Consulta de interrupciones:** la pantalla y su ítem de menú se llaman
  igual ("Consulta de interrupciones"). La sección Reclamos de la hoja usa
  `ReclamosTimeline variant="embebido"` (el gráfico del modal, sin card ni
  datos repetidos) y se saca "Ver detalle".
- **Componentes nuevos:** [`Timeline`](#timeline) (línea de tiempo vertical
  genérica) y [`TablaChip`](#tablachip) (el chip "Tabla N", que sale de
  `AbmTableSelector` para reusarse).

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
[Estados: editable, solo lectura, deshabilitado](#estados-editable-solo-lectura-deshabilitado)

**2. Componentes** (`src/components/ui/`)
[tokens.ts](#tokensts) ·
[AbmTableSelector](#abmtableselector) ·
[AnchoredPopover](#anchoredpopover) ·
[Botones](#botones) ·
[ButtonSelectGroup](#buttonselectgroup) ·
[CardHeader](#cardheader) ·
[ChipFilterBar](#chipfilterbar) ·
[CodeBadge](#codebadge) ·
[ColumnHeaderHint](#columnheaderhint) ·
[CopyButton](#copybutton) ·
[DateTimeField](#datetimefield) ·
[Dropdowns flotantes](#dropdowns-flotantes-dropdownts) ·
[FaseIndicador](#faseindicador) ·
[FieldLabel](#fieldlabel) ·
[FloatingPanel](#floatingpanel) ·
[FormRow](#formrow) ·
[HoraCombobox](#horacombobox) ·
[FilterBar](#filterbar) ·
[FilterTrigger](#filtertrigger) ·
[ListBox](#listbox) ·
[Modal](#modal) ·
[ModalCheckbox](#modalcheckbox) ·
[ModalRadio](#modalradio) ·
[PeriodSelector](#periodselector) ·
[ReadOnlyField](#readonlyfield) ·
[SegmentadoSoloLectura](#segmentadosololectura) ·
[SelectWrap](#selectwrap) ·
[SortableHeaderCell / SortableTh](#sortableheadercell--sortableth) ·
[TablaChip](#tablachip) ·
[Tabla de resultados](#tabla-de-resultados) ·
[TableCounter](#tablecounter) ·
[TableToolbar y useTableToolbar](#tabletoolbar-y-usetabletoolbar) ·
[Timeline](#timeline) ·
[TopBar](#topbar) ·
[UnderlineTabs](#underlinetabs) ·
[ValuePicker](#valuepicker)

**3. Patrones**
[Card con secciones](#card-con-secciones) ·
[Lista de filas](#lista-de-filas) ·
[Toolbar de tabla y filtros](#toolbar-de-tabla-y-filtros) ·
[Barra de filtros híbrida](#barra-de-filtros-híbrida) ·
[Maestro-detalle](#maestro-detalle) ·
[Registro seleccionado y detalle](#registro-seleccionado-y-detalle) ·
[Orden de botones](#orden-de-botones) ·
[Aire: chrome vs datos](#aire-chrome-vs-datos) ·
[Modal de trabajo](#modal-de-trabajo) ·
[Formulario de edición](#formulario-de-edición) ·
[Modal de edición de registro](#modal-de-edición-de-registro) ·
[Nunca un modal sobre otro](#nunca-un-modal-sobre-otro) ·
[ABM](#abm) ·
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
  - `text-caption font-mono` — **badges y contadores**: nombre de tabla
    ("Tabla 4"), contadores del sidebar, letra de fase.
- **En tablas, mono solo para el identificador del registro.**
  `font-mono` (`text-code`) va **únicamente en el valor del identificador**:
  la columna del `campoId` en todos los ABM y la columna Referencia en la
  tabla de Interrupciones de Consultas. Todo lo demás en una tabla — cadenas
  eléctricas, CT, códigos de equipo, cliente, póliza, alimentador (salvo
  cuando es el `campoId`), encabezados, tags, contador y paginación — usa la
  fuente de texto (`font-sans`). **Números, fechas y horas:** fuente de
  texto + `tabular-nums`, para que las cifras alineen en columna. En la
  config del ABM no se declara: el mono se **deriva** (la columna del
  `campoId`), no hay prop `mono` por columna.

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
| `--z-raised` | 20 | barra de `FilterBar` |
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

## Estados: editable, solo lectura, deshabilitado

Tres estados de un campo o control, cada uno con un solo tratamiento:

| | Editable | Solo lectura | Deshabilitado |
|---|---|---|---|
| Significa | Se puede cambiar | El valor es un **dato fijo** del registro: se lee completo, no se edita | El control **no está disponible todavía** (falta completar algo, depende de otra acción) |
| Campo | `MOD_FIELD_CLS`: `bg-surface`, `border-border-strong`, `text-text`, foco de campo (`FIELD_FOCUS`) | `READONLY_FIELD_CLS`: `bg-fill-subtle`, `border-border` (no `border-strong`), `text-text` (contraste completo) | Atenuado (`fill-muted` + `text-faint` en campos) |
| Toggle | Opción en reposo `bg-surface` + `border-border-strong`; seleccionada `bg-primary-tint` + `border-primary` + `text-secondary`; hover tint | **Segmentado estático** (`SegmentadoSoloLectura`): una sola caja con `READONLY_FIELD_CLS`, ancho intrínseco; opciones como segmentos de texto de igual ancho separados por divisores de 1px (`bg-border`, `h-4`), sin borde ni fondo por segmento; la elegida en `text-text font-medium` con `Check` (`ICON.xs`), las demás en `text-text-faint`; `title` "No editable" | `fill-muted` + `text-faint`; botones `opacity-40` |
| Interacción | Hover y foco | Sin hover, `cursor-default`, no responde a clic ni a teclado para cambiar el valor; solo el anillo de foco estándar (`FOCUS_RING`) si es enfocable. Un campo de texto se puede seleccionar y copiar | Sin eventos, `cursor-not-allowed` |
| Señal | — | Ícono `Lock` (`ICON.xs`, `text-icon`, "No editable") junto al label | — |
| Accesibilidad | — | Campo: `<input readOnly>`. Toggle: grupo `role="radiogroup"` con `aria-readonly="true"` y el valor en su `aria-label`, enfocable una vez; opciones `role="radio"` con `aria-checked`, no tabulables | `disabled` |

- **Regla:** un dato que no se puede editar se muestra con el estado de
  **solo lectura** — nunca como control normal ni como deshabilitado.
  Deshabilitado es solo para "todavía no disponible".
- **Regla:** un control que no se puede usar no puede conservar la forma de
  botón. Por eso el toggle de solo lectura es un segmentado estático: el
  mismo lenguaje que un campo de solo lectura (una caja gris que contiene
  un dato).
- Solo lectura aplica igual a campos (`READONLY_FIELD_CLS`; en el ABM,
  `AbmCampo` con `readOnly`) y a toggles (`ButtonSelectGroup` y el toggle
  de `AbmCampo`, prop `readOnly`, que dibujan `SegmentadoSoloLectura`), con
  el mismo ancho por opción que cualquier toggle.

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
| `READONLY_FIELD_CLS` | Estado de solo lectura de un campo (y la caja de `SegmentadoSoloLectura`), ver [Estados](#estados-editable-solo-lectura-deshabilitado) |
| `ESTADO_CLASES` | Clases por estado de campo (`CampoEstado`: editable, bloqueado, solo lectura…) |
| `ActionItem` | Tipo de una acción (label, variante, handler) |

**Qué no hacer:** estilar un botón nuevo con su propio alto, radio o tamaño
de texto; escribir clases de foco a mano.

**Archivo:** `src/components/ui/tokens.ts`.

## AbmTableSelector

**Para qué:** variante **título** de un selector: nombra la vista y
permite cambiarla. Es el título de la pantalla de ABM (no hay otro título
de tabla), primer elemento del contenido debajo del `TopBar`, en todos los
layouts.

**Anatomía:** un único botón con, de izquierda a derecha, el **chip "Tabla
2"**, 8px (`gap-2`) y el **nombre** ("Interrupciones", sin "·") en
`text-heading-md text-neutral-900`, y un chevron (`ICON.md`, `text-icon`).
El chip es una píldora de 22px de alto (`h-5.5`, `px-2`, `rounded-full`,
`bg-primary-tint`, `border border-chip-border`, `text-secondary text-caption
font-semibold`): el mismo idioma visual que los chips de "Tablas
relacionadas". Sin borde ni fondo en reposo del botón; alto mínimo
`--control-md`, `px-1.5` y `-ml-1.5` para que el chip quede alineado con el
borde de la página. A la izquierda, solo con un deep-link, el "←" para
volver a Consultas. Panel: "Cambiar de tabla" con la lista de tablas; cada
opción repite el formato (chip "Tabla N" con ancho mínimo común, para que
los nombres alineen + nombre en `text-body`), la activa en tint.

**Estados:** reposo (título plano); hover `bg-fill-muted` `rounded-sm`
sobre todo el bloque (chip, nombre y chevron); abierto = seleccionado
persistente (`bg-primary-tint` + `border-primary`, nombre y chevron
`text-secondary`, chevron rotado). Foco `FOCUS_RING`.

**Accesibilidad:** `<button>` con `aria-haspopup` y `aria-expanded`;
`title` con el código interno ("Tabla 2 · Interrupciones (CDS2)").

**Qué no hacer:** darle borde o fondo al botón en reposo (no es un botón);
separar el chip del nombre en dos controles; sumar otro título de tabla en
la pantalla.

**Archivo:** `src/features/abm/AbmTableSelector.tsx`.

## AnchoredPopover

**Para qué:** popover anclado a **su** disparador (editores y menús de
[`ChipFilterBar`](#chipfilterbar)). **Regla:** un popover se ancla a su
disparador, nunca al borde de la barra o del contenedor que lo tiene.

**Anclaje:** portal a `document.body`, `position: fixed`, a 5px del
disparador. Horizontal: alineado al borde izquierdo del disparador; si no
entra a la derecha del viewport (margen 8px), al borde derecho del
disparador. Vertical: debajo; arriba solo si abajo no entra y arriba hay más
lugar. Se recalcula con scroll, resize, cambios de tamaño del panel y
`reposicionar` (cuando el disparador se movió sin scroll ni resize).

**Aspecto:** el de los dropdowns del sistema — `bg-surface`, `rounded-md`,
`border-border`, `shadow-md`, capa `--z-dropdown`.

**Props:** `anchorRef`, `open`, `onClose`, `role?` (`menu`, `dialog`,
`listbox`; sin role la semántica la pone el contenido), `ariaLabel?`,
`className?`, `style?`, `reposicionar?`.

**Accesibilidad:** clic afuera (fuera del panel y del disparador) cierra;
Escape cierra, corta la propagación (no cierra un `Modal` ni deselecciona
una fila detrás) y devuelve el foco al disparador.

**Archivo:** `src/components/ui/AnchoredPopover.tsx`.

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
patrón tint (`bg-primary-tint border-primary text-secondary`). **Todas las
opciones de un grupo miden lo mismo**, el ancho de la más larga
(`inline-grid grid-flow-col auto-cols-fr`, cada botón `w-full` con el texto
centrado). Vale igual para el toggle de `AbmCampo` (BT/MT/AT, Sí/No,
Interno/Externo, Forzado/Programado); con
`expandirBotones` el grupo ocupa todo el ancho y las opciones se reparten
parejo. Única excepción: `igualAncho={false}` (fila con wrap) para listas
largas de opciones que no entran en una línea, como el Motivo de
`RevisarCambiosContent`.

**Props:** `options: string[]`, `selected: string[]`, `onToggle(opt)`,
`disabled?`, `sizeCls?` (default `BTN_SM`; `BTN_SEG_MD` en filas de campos),
`readOnly?`, `ariaLabel?`, `igualAncho?` (default `true`).

**Estados:** reposo, hover (tint), seleccionado (tint persistente),
deshabilitado (`fill-muted` + `text-faint`; si estaba seleccionado,
tint atenuado), **read-only** (ver [Estados: editable, solo lectura,
deshabilitado](#estados-editable-solo-lectura-deshabilitado)).

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
│ Título [Tabla 4] · ETIQUETA valor-en-mono       [acciones]│  h-(--card-header-h), px-(--card-px)
├──────────────────────────────────────────────────────────┤  border-b border-border, siempre
```

| Slot | Prop | Tokens | Contenido |
|---|---|---|---|
| Título | `title` | `text-heading-md text-text` (`heading-sm` con `level="section"`) | Nombre de la card. No trunca |
| Badge | `tag` | `CodeBadge` | Nombre de la tabla de origen (`config.nombre`: "Tabla 2", "Tabla 4"…), **en línea con el título**. Opcional |
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

## ChipFilterBar

**Para qué:** la [barra de filtros híbrida](#barra-de-filtros-híbrida):
ID directo + chips de filtro que aplican al instante, sin botón Buscar. Hoy,
todas las tablas del ABM.

**Anatomía:** una sola línea (`flex flex-nowrap gap-2`), todo a
`--control-md`, en este orden:

```
[🔍 Código de interrupción ✕] Fecha ▾  Nivel de tensión: MT ✕  Fase eléctrica ▾ │ Código equipo: @27… ✕  [⚙ Más filtros ②⌄]      Limpiar filtros
[🔍 Código de interrupción ✕] Fecha ▾  Nivel de tensión ▾  Fase eléctrica ▾  Origen ▾  Tipo ▾  [+ Agregar filtro]              ← sin ocultos
```

1. **Input de ID:** lupa a la izquierda, ✕ interno (`ICON_BTN_XS`) con
   valor. El **valor tipeado** va en `text-code font-mono` (es el
   identificador); el **placeholder**, en fuente de texto
   (`placeholder:font-sans`), y es el encabezado de la columna del ID
   ("Código de interrupción", "Alimentador MT", "Nro. reclamo"). **Ancho
   fijo** (`--filter-id-w`, 224px, sin redefinir por tier): entra el
   placeholder más largo completo en todos los tiers y no se achica con el
   desborde. Aplica con Enter o a los 500 ms de dejar de tipear; busca
   "contiene" sin distinguir mayúsculas.
2. **Chips visibles** (hasta 5, en su orden de prioridad; los que no entran
   pasan a "Más filtros", ver Overflow): `FilterTriggerButton` `md`
   (`chevronConValor={false}`). Vacío = trigger sin borde, **texto +
   chevron, sin ✕**; con valor = pintado (`primary-tint`, `border-primary`,
   `text-secondary`), "chipLabel: **valor**" (valor en semibold) o solo
   **valor** (`soloValor`), **+ ✕, sin chevron**. La ✕ tiene su propio
   espacio dentro del chip (`pl-1 pr-2`): el texto trunca antes de llegar a
   ella, nunca se superponen.
3. **Separador vertical** (solo con agregados) + **chips agregados**, mismo
   aspecto (un agregado vacío solo existe con su editor abierto).
4. **Botón final**, un solo disparador con dos nombres:
   - **"Más filtros"** (`SlidersHorizontal` + chevron) cuando hay chips
     ocultos. Popover de 300px (ver Overflow).
   - **"Agregar filtro"** (`ghostBtnCls("neutral")` a `--control-md`, ícono
     +) cuando no se oculta ninguno y hay agregables (sin agregables no se
     renderiza). Menú solo con los agregables que no están en la barra.
   Elegir un agregable agrega su chip y abre su editor; si el editor se
   cierra sin valor, el chip se quita.
5. **"Limpiar filtros":** link (`text-label text-secondary
   hover:underline`, `ml-auto`), solo con algún filtro o ID cargado. Borra
   **todo**: el ID y todos los filtros, visibles, agregados u ocultos.

**Etiquetas:** cada filtro (`ChipFiltroDef`) tiene `label` (nombre
completo: menú "Agregar filtro", editor, `title` y `aria-label`),
`chipLabel` (el texto del chip) y opcionalmente `soloValor`. El `title` y
el `aria-label` del chip son **siempre** "label completo: valor".
**Regla:** en el ABM, el `chipLabel` es **exactamente el encabezado de la
columna** del campo ("Fase de reposición", no "Fase rep."; "Nro. cuenta",
no "Cliente" ni "Póliza"), así el chip y la columna se llaman igual. Los
chips pueden ser largos: miden como máximo 200px y truncan el valor, no la
etiqueta. Solo-valor únicamente para campos cuyos valores se explican solos
(descripciones, nombres) — nunca para Sí/No, códigos o números — y también
lleva `chipLabel` (es el texto del chip vacío).

**Props:** `id`, `onIdChange`, `idPlaceholder` (el encabezado de la
columna del ID), `visibles` y `agregables`
(`ChipFiltroDef[]`: `campo`, `label`, `chipLabel?`, `soloValor?`,
`editor`, `opciones?`), `valores` (campo → valor, `""` = sin filtro),
`onChange(campo, valor)`, `onLimpiar`, `periodo?` (el del
[`PeriodSelector`](#periodselector) de la pantalla). Controlada desde la
pantalla; qué agregados hay en la barra es estado propio. El valor de un
filtro de fecha viaja como texto (`valorDeRango` / `rangoDeValor`, con una
marca si vino de "Período completo").

**Editores** (en [`AnchoredPopover`](#anchoredpopover), anclados a su
disparador: el chip, o "+N" si el chip está oculto):
- **`lista`** (Nivel, Fase, Origen, Tipo, División red normal): ítems con
  el estilo de la lista de `FilterTrigger`; el elegido marcado
  (`primary-tint`); elegir aplica y cierra.
- **`busqueda`** (Descripción equipo operado): la lista completa con un
  buscador arriba que filtra mientras se escribe; scroll propio (máx.
  320px). Elegir aplica y cierra.
- **`texto`** (Código equipo, Cadena eléctrica, Alimentador MT, CT MT/BT):
  input con label; Enter aplica y cierra; vacío quita el filtro.
- **`fecha`** (`RangoFechaCalendario`):
  - **Atajos** en una columna a la izquierda: Hoy, Ayer, Últimos 7 días,
    Período completo. Completan el borrador, no aplican.
  - **Calendario** con el skin y los componentes de `DateTimeField`
    (react-day-picker, locale `es`, selector de mes/año propio), en
    `mode="range"`: primer clic = desde, segundo = hasta (si es anterior,
    se invierten), días intermedios con la banda `primary-tint`; extremos
    con el círculo de "seleccionado".
  - **Hora desde / Hora hasta** debajo, con
    [`HoraCombobox`](#horacombobox). Vacío = sin hora (día completo).
    Nada de `input type="time"` ni `type="date"`.
  - **Pie:** Limpiar (link) a la izquierda, Aplicar a la derecha — el único
    editor con botón, porque el rango se arma en dos pasos.
  - **Período completo** = el período del `PeriodSelector` de la pantalla
    (Agosto 2026 → 01/08/2026 00:00 – 31/08/2026 23:59). Un filtro aplicado
    con este atajo sigue al período: si el período cambia, se actualiza.
  - Calendario, selector de mes/año y lista de horas se abren **dentro**
    del popover del chip (sin popovers anidados afuera).
  - Texto del chip: "dd/mm hh:mm – dd/mm hh:mm", "desde …" o "hasta …",
    sin la hora si no se cargó.

**Valores largos:** cada chip mide como máximo 200px; el valor trunca con "…" antes de la ✕ y el texto completo va en
el `title` del chip.

**Overflow** (el mismo en el ABM y en Consulta de interrupciones; la barra
nunca pasa de una línea):
- Se muestran el input de ID (ancho fijo, no se achica) y los chips en su
  orden de prioridad (los visibles y después los agregados) **mientras
  entren** en el ancho disponible.
- Los que no entran se ocultan **empezando por el último** y pasan al botón
  final **"Más filtros"**. Su popover (300px, anclado al botón) lista
  primero los ocultos —fila: nombre del chip a la izquierda y valor
  (`text-secondary font-semibold`) o "Todos" (`text-muted`) a la derecha,
  con ✕ ghost (`ICON_BTN_XS`) si tiene valor—, luego un separador, el
  rótulo "Más campos" y los agregables. Clic en una fila abre **el mismo
  editor** que su chip, anclado a "Más filtros".
- Sin ocultos, el botón se llama **"Agregar filtro"** y abre solo los
  agregables.
- Con algún filtro oculto con valor, el botón toma el estilo seleccionado
  (`primary-tint` + `chip-border` + `text-secondary`) y muestra un
  **contador** de ocultos activos (círculo `bg-secondary`, texto blanco,
  18px).
- **Medición:** los anchos naturales salen de una fila invisible e inerte.
  Se recalcula con `ResizeObserver` sobre la barra y cuando cambia un filtro
  (un chip con valor cambia de ancho), pero **no mientras hay un popover
  abierto**: los chips no se mueven debajo del cursor.

**Accesibilidad:** el input de ID lleva `aria-label`; cada chip, un botón
con `aria-haspopup` y `aria-expanded` (con valor, `aria-label` "label
completo: valor"; vacío con etiqueta corta, `aria-label` con el label
completo) y su × como botón hermano ("Quitar filtro X"); menús con
`role="menu"` / `menuitem`; listas con `role="listbox"` / `option` +
`aria-selected`; editores de texto, búsqueda y fecha con `role="dialog"`.
Al abrir un editor, el foco va a su primer control (el ítem elegido en las
listas). Escape cierra y devuelve el foco al disparador (con la lista de
horas abierta, cierra solo esa lista); clic afuera cierra.

**Qué no hacer:** anclar un editor al borde de la barra; dejar que la
barra pase a dos líneas; agregar un botón Buscar;
mostrar chevron y ✕ juntos; usar `soloValor` en un campo de códigos,
números o Sí/No.

**Archivo:** `src/components/ui/ChipFilterBar.tsx`.

## CodeBadge

**Para qué:** dejar explícito sobre qué tabla se trabaja, con su nombre
("Tabla 2", "Tabla 4" — `config.nombre`, nunca el código CDS; ver
[Voz y formatos](#voz-y-formatos), "Nombres de tabla"), en `CardHeader` y
en la barra de contexto de registro.

**Anatomía:** `text-caption font-mono`, `px-1.5 py-0.5`, `rounded-xs`,
`border-border-strong`, `text-text-muted`.

**Props:** `code: string`.

**Estados:** ninguno (no interactivo).

**Accesibilidad:** texto plano, se lee como parte del título.

**Qué no hacer:** usarlo como chip de filtro o como botón.

**Archivo:** `src/components/ui/CodeBadge.tsx`.

## ColumnHeaderHint

**Para qué:** dar una pista sobre el título de una columna sin ocupar
lugar: hoy, el **nombre real** de la columna en la base (`nombreReal` del
campo: REF, F, FAS…) en los encabezados de Resultados del ABM, cuyo título
es el label del formulario. No es el Tooltip general de la app (queda para
la fase de componentes nuevos), pero está pensado para evolucionar hacia él.

**Anatomía:**
- **Título:** se ve igual que cualquier otro encabezado — mismo color, peso
  y tamaño, **sin subrayado ni decoración**. Para que se note que tiene
  información, con hover o foco pasa a `text-secondary` (los encabezados sin
  `nombreReal` no cambian en hover). El cursor es el del encabezado
  (pointer en uno ordenable); nunca `help`.
- **Tag** **arriba** del título, a 4px, alineado a la izquierda con su
  texto; solo si no hay lugar arriba (borde superior del viewport) se abre
  abajo. Mismo idioma que los chips de la app: `bg-primary-tint`,
  `border-chip-border` (1px), `text-secondary`, `text-caption
  font-semibold caps`, `rounded-sm`, `px-1.5`, alto 20px, **fuente de
  texto** (no mono). Capa `--z-tooltip` (70), `position: fixed` en un
  portal (el contenedor con scroll de la tabla lo recortaría). Aparece con
  hover o foco tras **300 ms**; se va al instante, y también con scroll o
  resize.

**Props:** `hint?` y `children` como render-prop `(trigger)`: el título
sigue siendo su propio elemento enfocable (ej. el botón de orden de
`SortableHeaderCell`, que suma la prop `hint` y pinta el hover) y recibe
las props del disparador. **Sin `hint`: sin tag, sin cambio de hover y sin
envoltorio.**

**Accesibilidad:** el disparador es enfocable; la descripción (`sr-only`,
siempre en el DOM) se asocia con `aria-describedby`; Escape cierra el tag
(sin deseleccionar la fila de la tabla).

**Qué no hacer:** subrayar el título; usarlo para texto largo o con
contenido interactivo; poner el tag dentro del contenedor con scroll.

**Archivo:** `src/components/ui/ColumnHeaderHint.tsx`.

## CopyButton

**Para qué:** copiar un valor al portapapeles (ej. la referencia de
Interrupción en el header del modal "Tablas relacionadas").

**Anatomía:** botón de ícono `ICON_BTN_SM`, `text-icon`, hover
`bg-fill-muted` + `text-text`; ícono `Copy` (`ICON.sm`).

**Props:** `value: string`, `label: string` (qué se copia, en minúscula y
sin artículo: arma "Copiar interrupción" / "Interrupción copiada"),
`size?` (`"sm"` default, `ICON_BTN_SM` + `ICON.sm`; `"xs"`, `ICON_BTN_XS` +
`ICON.xs`, para ir junto a un texto chico o dentro de un campo).

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
la derecha del label; el control en su estado read-only (ver [Estados: editable,
solo lectura, deshabilitado](#estados-editable-solo-lectura-deshabilitado)).

**Accesibilidad:** el label es un `<label htmlFor>` apuntando al id del
control; un grupo de toggles usa `aria-labelledby={labelId}`. En el ABM,
`AbmCampo` con `labelExterno` renderiza solo el control con esos ids.

**Qué no hacer:** label arriba (`FieldLabel`) dentro de una `FormRow`;
controles de anchos distintos en la columna derecha; más de un campo por
fila.

**Archivo:** `src/components/ui/FormRow.tsx`.

## FilterBar

**Sin uso desde el 08/10/2026:** Consultas de interrupción pasó a
`ChipFilterBar`. El componente se conserva.

**Para qué:** la barra de búsqueda general con botón Buscar y flyout "Más
filtros". Para la búsqueda principal
de una pantalla de datos, ver [Barra de filtros
híbrida](#barra-de-filtros-híbrida) ([`ChipFilterBar`](#chipfilterbar)).
**Regla:** una pantalla con esta barra usa `FilterBar`; los campos cambian
por configuración (props, mapeo de la pantalla), nunca se copia el markup.

**Anatomía:** fila única sin contenedor, apoyada en el fondo de la página
(`relative z-(--z-raised)`, `flex items-center gap-2`):

```
[Ej: BFZ…      ] [dd/mm/aaaa hh:mm 📅] [Nivel ▾] [Fase ▾] │ ORIGEN [Interno|Externo] TIPO [Forzado|Programado]   [⚲ Más filtros (2)] [Limpiar] [Buscar]
FILTROS APLICADOS: (Cadena eléctrica: NCBT ×) (División red normal: Sí ×)      ← solo con filtros del flyout
```

- **Código:** input `MOD_FIELD_CLS` en mono (`text-code`), 190px fijo,
  placeholder "Ej: …" (`placeholderCodigo`).
- **Fecha:** `DateTimeField`.
- **Nivel** (BT/MT/AT, 88px; el valor elegido en semibold) y **Fase**
  (R/S/T/RS/RT/ST/RST, 84px): `ValuePicker` sin label, el placeholder hace
  de label. Barra de filtro = zona densa: dropdown, no botones (ver
  [Formulario de edición](#formulario-de-edición), "Botones o dropdown").
- **Divisor** vertical (`w-px h-5 bg-border`).
- **Origen y Tipo:** label inline (`text-heading-xs` uppercase,
  `text-text-muted`) + `ButtonSelectGroup` `BTN_SEG_MD`, selección única
  que se apaga con un segundo clic.
- **A la derecha** (`ml-auto`): Más filtros (outline `md`, ícono `Filter`,
  badge `primary-strong` con la cantidad de filtros del flyout con valor;
  con alguno activo queda pintado `primary-tint`) · Limpiar · Buscar
  (primario, último).
- **Flyout "Más filtros":** anclado a la derecha, 520px, a 6px de la barra
  (`--z-dropdown`), con backdrop no bloqueante en `--z-dismiss` (debajo de
  la barra: los controles siguen clickeables). Título + ✕, grilla de 2
  columnas: Cadena eléctrica · Alimentador MT · Centro de transformación ·
  Código equipo (texto) · Descripción equipo operado (combobox,
  `ValuePicker` `searchable` + `modal`, lista completa en modal, opciones
  por `opcionesDescEquipo`) · División red normal (toggle Sí / No de igual
  ancho; sin selección = sin filtro). Pie: Limpiar filtros (link, solo
  vacía el flyout) · Cerrar
  · Aplicar.
- **Chips de filtros aplicados:** franja `bg-fill-subtle` con borde debajo
  de la barra, un chip removible por filtro del flyout con valor
  ("`{label}: {valor}`" + ×).

**Props:** `valores` (`FilterBarValores`, todos string, `""` = sin filtro;
Origen y Tipo con su etiqueta), `onChange(cambios)` (solo los campos que
cambiaron), `onBuscar`, `onLimpiar`, `buscado`, `disabled?`,
`placeholderCodigo`, `opcionesDescEquipo`, `flyoutAbierto` y
`onFlyoutAbiertoChange` (la pantalla atenúa su contenido con el flyout
abierto). `FILTER_BAR_VACIO` es el estado en blanco. Sin lógica de negocio
de ninguna pantalla adentro: si el dato de la pantalla es otro (ABM: "I" /
"E"), traduce la pantalla.

**Estados:**
- **Nunca se bloquea por haber resultados:** con resultados en pantalla
  todos los campos y Buscar siguen habilitados (la barra busca y refina).
  `buscado` solo habilita Limpiar.
- `disabled`: solo por un motivo propio de la pantalla (Consultas con una
  interrupción seleccionada) — toda la fila no editable con los valores a
  contraste completo (`!bg-fill-subtle !text-text`). El flyout no se
  deshabilita.
- **Enter** en un input de la barra busca; en un input del flyout, igual
  que **Aplicar**: cierra el flyout y busca.
- Limpiar deshabilitado (sin resultados) con `opacity-40`.

**Tier 760px:** la fila hace wrap; código a 112px y fecha a 128px; Origen
y Tipo pasan de toggles con label a `ValuePicker` ("Origen" 92px, "Tipo"
112px).

**Qué no hacer:** copiar el markup de la barra en una pantalla; agregarle
labels arriba (`FieldLabel`); importar desde `features/`.

**Archivo:** `src/components/ui/FilterBar.tsx`.

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

**Piezas exportadas:** `FilterTriggerButton` (el trigger solo; lo reusa
[`ChipFilterBar`](#chipfilterbar); suma `size="md"`, `maxWidth` con el
valor truncado y el texto completo en `title`, `valorDestacado`,
`etiqueta` corta, `soloValor`, `chevronConValor` y `buttonRef`) y
`RangoFechaEditor` (el contenido del panel de rango con inputs nativos, que
usa la variante `date-range`; `RangoTexto`, `fechaDeExtremo`). El editor de
fecha de `ChipFilterBar` es otro: `RangoFechaCalendario`.

**Archivo:** `src/components/ui/FilterTrigger.tsx`.

## HoraCombobox

**Para qué:** elegir una hora (24 h) sin `input type="time"`. Hoy, Hora
desde / Hora hasta del editor de fecha de [`ChipFilterBar`](#chipfilterbar).

**Anatomía:** input de texto (`MOD_FIELD_CLS`: mismo alto, borde y foco
`FIELD_FOCUS` que el resto de los campos) con máscara `hh:mm` + lista
desplegable debajo (pasos de 15 minutos, 00:00 … 23:45) que se filtra al
escribir. La lista se abre dentro del contenedor (sin portal).

**Comportamiento:** se escribe con o sin ":" ("930" → 09:30, "9" → 09:00);
al salir o con Enter se normaliza; un valor inválido vuelve al anterior.
Vacío = sin hora. Flechas recorren la lista, Enter elige, Escape la cierra
(sin cerrar el popover que la contiene: `data-escape-local`).

**Props:** `value` (`"hh:mm"` o `""`), `onChange`, `id?`, `ariaLabel?`.

**Accesibilidad:** `role="combobox"` con `aria-expanded`, `aria-controls`,
`aria-autocomplete="list"` y `aria-activedescendant`; lista `listbox` /
`option` con `aria-selected`.

**Archivo:** `src/components/ui/HoraCombobox.tsx`.

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
`"form"` `--modal-form-w` 704 / `"lg"` 920 / `"xl"` 1120), `footer?`, `children`, y para
extenderlo sin tocar a los demás:
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

**Props:** `value?` y `onChange?` — controlado cuando la pantalla necesita
el período (ABM: el atajo "Período completo" de `ChipFilterBar`); sin
props, estado propio (`TopBar`).

**Estados:** reposo, hover (tint), abierto (tint persistente), opción
seleccionada (tint).

**Accesibilidad:** cierra con clic afuera.

**Archivo:** `src/components/ui/PeriodSelector.tsx`.

## ReadOnlyField

**Para qué:** par etiqueta/valor de solo lectura.

**Anatomía:** para grillas densas de datos (datos de la interrupción):
etiqueta `text-heading-xs uppercase text-text-muted` + caja
`h-(--control-sm)` con el tratamiento de solo lectura (`bg-fill-subtle`,
`border-border`, `text-text`) y el valor en `text-body-sm`. Un campo de solo
lectura dentro de un formulario no usa este componente: es un `<input
readOnly>` con `READONLY_FIELD_CLS`.

**Props:** `label`, `value`.

**Qué no hacer:** usarlo para un campo editable deshabilitado (eso es el
campo con su estado disabled).

**Archivo:** `src/components/ui/ReadOnlyField.tsx`.

## SegmentadoSoloLectura

**Para qué:** un toggle en solo lectura (Origen y Tipo en el modal de
edición de registro). Lo dibujan `ButtonSelectGroup` y el toggle de
`AbmCampo` con `readOnly`; no se usa suelto.

**Anatomía:** una caja con `READONLY_FIELD_CLS` (alto `--control-md`,
`bg-fill-subtle`, `border-border`, `rounded-sm`), ancho intrínseco. Adentro,
segmentos de texto de igual ancho (`inline-grid auto-cols-fr`) separados
por divisores de 1px (`bg-border`, `h-4`), sin borde ni fondo propios. La
opción elegida en `text-text font-medium` con `Check` (`ICON.xs`) a la
izquierda; las demás en `text-text-faint`.

**Props:** `opciones` (`{ value, label }[]`), `valor`, `ariaLabel` (nombre
del campo), `id?`.

**Estados:** ninguno (sin hover, `cursor-default`, `title` "No editable").

**Accesibilidad:** `role="radiogroup"` con `aria-readonly="true"` y el
valor en el `aria-label` ("Origen: Interno"), enfocable una vez; cada
opción `role="radio"` con `aria-checked`.

**Qué no hacer:** darle forma de botón a una opción (borde o fondo por
segmento); usarlo para un toggle deshabilitado.

**Archivo:** `src/components/ui/SegmentadoSoloLectura.tsx`.

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

**Props:** `label`, `active`, `dir: SortDir`, `onClick`, `className?` y
`hint?` (solo `SortableHeaderCell`; con `hint`, el título lleva la pista de
[`ColumnHeaderHint`](#columnheaderhint)).

**Estados:** reposo, hover (`text-text`), activo asc/desc.

**Qué no hacer:** poner el fondo del sticky en el `<tr>`.

**Archivo:** `src/components/ui/SortableHeader.tsx`.

## TablaChip

**Para qué:** el nombre de una tabla tal como lo conoce el usuario ("Tabla
2"), al lado del título de la tabla o de la sección que la muestra.

**Anatomía:** píldora de 22px (`h-5.5`), `px-2`, `rounded-full`,
`bg-primary-tint` + `border-chip-border`, `text-secondary text-caption
font-semibold`. `ancho`: ancho mínimo parejo (`min-w-20`) para listas.

**Dónde:** título de los ABM (`AbmTableSelector`, también en su dropdown);
títulos de sección de Consultas de interrupción ("Tabla 2" Interrupciones,
"Tabla 4" Reposiciones). Estático: no es un botón.

**Archivo:** `src/components/ui/TablaChip.tsx`.

## Tabla de resultados

**Para qué:** la tabla de Resultados del ABM (`AbmScreen`): muchas columnas
que no siempre entran en la caja.

**Anatomía:** caja (`border border-border rounded-md bg-surface shadow-sm`,
`min-w-0`) con tres capas: el contenedor con scroll (`overflow-auto`,
`rounded-t-md`) que lleva la `<table>`, y el pie de paginación **fuera** del
scroll. La tabla es `border-separate` con `borderSpacing: 0`: bajo
`border-collapse`, los bordes de una celda sticky se pintan en la capa de la
tabla y quedan mal al scrollear; por eso los separadores de fila (`border-b
border-border-subtle`) van en cada `<td>`.

**Ancho y scroll horizontal:**
- Celdas y encabezados en `whitespace-nowrap`; ningún valor se trunca.
- Si no entran, el contenedor scrollea en horizontal (**no la página**); el
  `thead` acompaña (`sticky top-0`, `bg-fill-subtle-solid`).
- **Columna fija:** la del identificador del registro (`campoId`) es
  `sticky left-0` con `z-(--z-sticky)`; su encabezado, además de sticky
  arriba, queda sobre las demás celdas sticky (`--z-sticky` + 1). Su fondo es
  **opaco** en todos los estados (la fila pasa por detrás al scrollear):
  `surface`, con el hover (`fill-muted`, translúcido) como degradé encima, o
  `primary-tint` si la fila está seleccionada.
- **Indicador:** mientras haya contenido desplazado a la izquierda
  (`scrollLeft > 0`), la columna fija muestra un borde derecho
  (`border-border`); sin scroll el borde es transparente (sin borde extra).
- La paginación es **fija** al ancho de la caja (no scrollea).
- El tag de [`ColumnHeaderHint`](#columnheaderhint) va en un portal (fixed),
  así que el `overflow` no lo recorta.

**Encabezado:** el `thead` está siempre visible, también con una fila
seleccionada (`ColumnHeaderHint` funciona normal).

**Toolbar de tabla (persistente):** entre la barra de filtros y la caja
(`filtros → gap-3 → toolbar → gap-2 → tabla`), **siempre presente**: alto
`--control-sm`, ancho completo, `px-2`. **Regla: el layout no cambia al
seleccionar** — solo cambia el contenido; la tabla no se mueve nunca.
- **Sin selección** (sin fondo):
  - Izquierda, contexto de los datos: "Período 08/2026 · Actualizado 10:42"
    (`text-caption text-neutral-600 tabular-nums`, fuente de texto). El
    período sale del `PeriodSelector` controlado (mm/aaaa); "Actualizado" es
    la hora (hh:mm) de la última vez que se resolvieron los resultados (cada
    aplicación de filtros o cambio de período o de tabla).
  - Derecha, acciones **de tabla** en `ghostBtnCls("neutral")` `sm` con ícono
    (`ICON.sm`): **Exportar** (`Download`) y **Auditoría** (`History`).
    Exportar descarga un CSV (`descargarCsv`, `src/lib/csv.ts`: Blob,
    client-side) de las filas que se ven con los filtros actuales, con los
    encabezados de columna en el orden de la tabla; archivo
    `<exportFilename>_<aaaamm>.csv` (ej.
    `interrupciones_no_computables_202608.csv`). Sin resultados queda
    `disabled` con el tooltip nativo "No hay registros para exportar" (en el
    contenedor: un botón deshabilitado no recibe el hover). Auditoría es una
    acción de la tabla, no de un registro; todavía no abre nada (como en el
    ABM original).
- **Con selección** (mismo alto, padding y posición; **sin fondo de color**
  ni `rounded`: la toolbar se ve igual en los dos estados, el celeste queda
  solo en la fila seleccionada de la tabla): el contexto y Exportar /
  Auditoría **no se muestran**.
  - Izquierda, **texto plano en el estilo del contexto** (`text-caption
    text-neutral-600`, una sola línea): con **1 registro**, el valor del
    `campoId` en `font-mono text-neutral-900` + " seleccionado" ("AFZ2026…
    seleccionado"); con **2 o más**, "N registros seleccionados" (sin
    códigos).
  - Después, un separador vertical (`w-px h-4 bg-neutral-300`) y
    **Deseleccionar** como link (`text-caption text-secondary underline
    underline-offset-3`). Sin ✕.
  - Derecha, en el mismo lugar que Exportar y Auditoría y con el mismo
    tamaño y estilo (`ghostBtnCls` `sm` + ícono): **Modificar** (`Pencil`) y
    **Borrar** (`Trash2`, destructivo).
- **Selección múltiple (preparada, no habilitada):** la selección es una
  colección de ids de fila; hoy la tabla selecciona de a una (clic en otra
  fila la reemplaza) y no hay checkboxes. Reglas ya implementadas: Modificar
  solo con exactamente 1 registro; Borrar aplica a todos los seleccionados;
  `ConfirmarBorrarModal` acepta N registros y pluraliza ("Vas a borrar 3
  registros", con los códigos listados si son 5 o menos); el texto de la
  izquierda pluraliza como arriba.
- **Transición:** las dos capas ocupan la misma celda de un grid y hacen
  crossfade de **120ms** (solo opacidad). Con
  `prefers-reduced-motion` el cambio es directo (regla global). La capa
  oculta es `inert`. Al cambiar de una fila a otra solo se actualiza el valor
  del `campoId`; durante la salida conserva los últimos registros.
- **Teclado:** Escape deselecciona. Si el foco estaba en las acciones de
  registro al deseleccionar, vuelve a la tabla.

**Estado vacío:** con filtros que no dejan filas, el `thead` sigue y, dentro
de la caja y debajo de él, va "No hay registros con estos filtros"
(`text-body-sm text-neutral-600`) + el link "Limpiar filtros" (`py-10`,
centrado). Sin pie de paginación.

**Tipografía:** mono solo en la columna del ID; el resto en fuente de texto
con `tabular-nums` (ver [Tipografía](#tipografía)).

**Archivo:** `src/features/abm/AbmScreen.tsx` (tabla `resultados`); la
toolbar es `src/features/abm/AbmToolbar.tsx`.

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

## Timeline

**Para qué:** una secuencia de eventos en el tiempo, uno debajo del otro,
cuando lo que importa es el orden y la distancia entre ellos (ej. las fases
de reposición de una interrupción). Genérica: el contenido y el estado de
cada ítem los pone quien la usa.

**Anatomía:**

```
●  Inicio de la interrupción 08:10        ← dot "inicio" (fill-muted, borde neutral-400)
│  05/07/2026 · MT · fase RST
◉  Fase 1 08:52 +42 min     12 clientes repuestos   ← dot "activo" (secondary + anillo tint)
│  Fase eléctrica R · @27… · SECCIONADOR
│  ┌ Tablas relacionadas de la fase 1 ┐
○  Fase 2 10:24 +1 h 32 min   8 clientes repuestos  ← dot "normal" (blanco, borde 2px neutral-300)
```

- `<ol>`; cada ítem con `padding-left` de 28px y el **dot de 16px** en
  `left 0`, centrado con la primera línea del contenido (el contenido
  arranca con `TIMELINE_CONTENIDO_PY`, 8px, y una primera línea de 20px).
- **Línea conectora** de 2px `bg-border` del pie de un dot al tope del
  siguiente; el último ítem no la tiene.
- Medidas en px, fuera de la escala `--spacing`: no cambian entre tiers.
- Dots: `"inicio"` (ítem fijo, no seleccionable), `"normal"`, `"activo"`
  (el seleccionado).

**Uso: `ReposicionesTimeline`** (Consultas de interrupción): primer ítem
fijo "Inicio de la interrupción"; un ítem por fase, en orden de FEC, con
"Fase N" · hh:mm · "+X min" (desde el ítem anterior) · "N clientes
repuestos" y, debajo, fase eléctrica · código · descripción del equipo
(fuente de texto). Cada fase es un `<button>` (Enter o Espacio la
seleccionan); hover `fill-subtle rounded-lg`; la seleccionada suma borde y
se expande para mostrar solo sus chips de Tablas relacionadas. Sin fases:
el inicio y "Sin reposiciones registradas".

**Qué no hacer:** meter acciones o fichas completas en el ítem expandido;
usarla para registros que se comparan por columnas (va tabla).

**Archivo:** `src/components/ui/Timeline.tsx`; uso en
`src/features/consultas-interrupcion/ReposicionesTimeline.tsx`.

## TopBar

**Para qué:** el encabezado de pantalla. **Todas las pantallas** usan
`TopBar`, incluido el ABM ("Alta, baja y modificación"). El título es la
sección del menú. No hay breadcrumb ni encabezados de página propios: en el
ABM, la tabla se nombra con el [selector-título](#abmtableselector) debajo
del `TopBar`, como primer elemento del contenido.

**Anatomía:** `<header>` con título `h1 text-heading-md text-text` a la
izquierda y `PeriodSelector` a la derecha; `px-6`, `border-b border-border`,
fondo `bg-bg-app` y alto mínimo `var(--header-min-height, 60px)` (44px en
el tier de 760px). El contenido de la pantalla arranca debajo con su propio
padding (`pt-(--page-pt)` en Consultas de interrupción).

**Props:** `title`; `periodo?` y `onPeriodoChange?` para un
`PeriodSelector` controlado (el ABM, que usa el período en el atajo
"Período completo" de `ChipFilterBar`), con el mismo aspecto; sin ellos,
estado propio. El título de cada pantalla sale del mapa `TITULOS_PANTALLA`
de `src/App.tsx`; el del ABM lo pone `AbmScreen`.

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

Anatomía de las cards de la vista de trabajo (antes, Interrupciones y
Reposiciones en Consultas de interrupción, que desde el 08/10/2026 es un
[maestro-detalle](#maestro-detalle) sin cards): **un único contenedor**
dividido en franjas por líneas `border-border` a todo el ancho.

```
┌──────────────────────────────────────────────────────────┐
│ Título (heading-md) [Tabla 4] · ETIQUETA valor [acciones] │  header (alto fijo --card-header-h)
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
  `heading-md` con el badge de tabla en línea, acciones (si hay) a la derecha,
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
  debajo del `TopBar` ("Consulta de interrupciones"), con
  `pt-(--page-pt)` y `px-(--page-px)`.
- **Acciones del registro** (Desarmes, Lotes, Nivel/Tipo, Replicar,
  Cambia fases, Alta clientes, Intercambio) no viven en la pantalla: son
  los ítems del grupo desplegable "Herramientas" del menú lateral (mismo
  patrón que "Alta, Baja y Modificación"; un solo grupo desplegado a la
  vez). Los que dependen de la interrupción seleccionada quedan
  deshabilitados (`text-faint`) hasta definir cómo se resuelven.

## Lista de filas

Alternativa a la tabla para registros con **pocos campos**, un
**identificador principal** y metadatos secundarios (ej.
`ReposicionesLista`, hoy sin uso: las reposiciones de Consultas de
interrupción pasaron a una [`Timeline`](#timeline)). Si el usuario necesita
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

## Barra de filtros híbrida

La búsqueda principal de una **pantalla de datos** (una tabla que se
consulta y se refina), con [`ChipFilterBar`](#chipfilterbar):

- **ID directo:** el identificador se tipea en un input propio, sin abrir
  nada (es lo más buscado).
- **Chips:** hasta 5 filtros visibles, siempre en la barra; el resto se
  suma con "Agregar filtro" (si no hay más de 5, no hay "Agregar
  filtro"). Cada chip abre su editor en un popover.
- **Aplicar al instante:** cada cambio filtra en el momento, vuelve a la
  página 1 y deselecciona el registro si quedó afuera. **Sin botón
  Buscar** ni Limpiar: "Limpiar filtros" es un link, solo con filtros.
- **Estado inicial:** sin filtros, la tabla muestra todos los registros del
  período (paginados). Sin resultados: "No hay registros con estos
  filtros" + "Limpiar filtros" dentro de la caja de la tabla.
- **Una línea:** nunca hace wrap; lo que no entra pasa a "Más filtros".
- **Regla:** un popover se ancla a su disparador
  ([`AnchoredPopover`](#anchoredpopover)), nunca al borde de la barra.

**Relación con [`FilterBar`](#filterbar):** `FilterBar` (formulario en una
fila + Buscar + flyout "Más filtros") queda, por ahora, en Consultas de
interrupción. Una pantalla nueva de datos usa la barra híbrida.

## Maestro-detalle

Una lista de registros y, al lado, el detalle del seleccionado, sin cards.
Hoy: Consultas de interrupción (Tabla 2 → la interrupción, sus
reposiciones y sus reclamos).

```
┌ TopBar ───────────────────────────────────────────────────────────────────┐
├ maestro (52%, fondo de la app, padding de página) ─┬ hoja (48%, surface) ──┤
│ [Tabla 2] Interrupciones                           │ Interrupción seleccionada
│ [🔍 Código…] Fecha ▾ [Filtros ⌄]                   │ BFZ202607056849        │
│ Período 08/2026 · Actualizado 10:42                ├───────────────────────┤
│ ┌───────────────────────────────────────────┐      │ Duración │ Repos. │ … │
│ │ CÓDIGO ▏ FECHA ▏ NIVEL ▏ FASE ▏ ORIGEN ▏ TIPO│    ├───────────────────────┤
│ │▌BFZ…   │ …                              › │◀────│ [Tabla 4] Reposiciones │
│ │ …                                          │     │ ● ◉ ○ línea de tiempo  │
│ └ Anterior · Pág. 1 de 2.284 · Siguiente ────┘     │───────────────────────│
│                                                    │ Reclamos (gráfico)     │
└────────────────────────────────────────────────────┴───────────────────────┘
```

- **Split persistente 52/48** (`flex-[52_1_0%]` / `flex-[48_1_0%]`), del
  alto disponible. Cada columna scrollea por dentro; **la página no
  scrollea** en ningún tier.
- **Maestro sobre el fondo de la app** (`bg-app`, padding `--page-px` /
  `--page-pt`): título de sección (`TablaChip` + nombre en `heading-sm`,
  estático), [`ChipFilterBar`](#chipfilterbar) estándar (los filtros de
  Tabla 2),
  toolbar de tabla con **solo el contexto** ("Período 08/2026 · Actualizado
  hh:mm"; sin Exportar, Auditoría ni modo selección) y la tabla en su caja
  (estilo de los ABM, pocas columnas, paginación al pie).
- **Selección siempre activa (auto-selección):** siempre hay un registro
  seleccionado. Al cargar y al cambiar filtros o período, si el
  seleccionado no está en los resultados, pasa a la primera fila. Clic en
  el seleccionado no deselecciona; con foco en la tabla, ↑/↓ mueven la
  selección. **El layout no se mueve al seleccionar.**
- **Fila seleccionada:** fondo tint, texto secondary, barra interna de 3px
  `bg-secondary` en el borde izquierdo de la primera celda y un chevron de
  6px (trazo secondary) a la derecha de la última, que apunta al detalle.
- **Detalle como hoja blanca:** `bg-surface`, `border-l`, alto completo, sin
  padding exterior ni radio, sin sombra. De arriba abajo:
  - **Header de registro** (fijo, `16px 24px 14px`, `border-b`): "X
    seleccionada" (`text-caption neutral-500`) + el identificador en mono
    18px `font-medium`. Sin chips, botones ni metadatos que ya se ven en la
    fila.
  - **Franja de cifras** (fija, `border-b`): grilla de 4 columnas iguales
    separadas por `border-l`, `12px 24px`; label 11px `neutral-500
    medium` y valor 17px `semibold tabular-nums`. Con menos de 440px de
    ancho (container query) pasa a 2×2.
  - **Cuerpo** (scroll propio, `4px 24px 24px`): **secciones con título**
    (`heading-xs`, con `TablaChip` si muestran una tabla) separadas por
    `border-t`. Acciones de sección (si las hay) ghost `sm` a la
    derecha del título.
  - **Sección Reclamos:** reutiliza el gráfico existente, `ReclamosTimeline`
    con `variant="embebido"` (el default `"modal"` es el de "Datos de la
    interrupción", sin cambios). Sin card (sin borde, radio, fondo ni
    padding), sin header propio (el título lo pone la sección, igual que
    "Reposiciones de esta interrupción"), sin chip DURACIÓN ni pie
    INICIO / FIN (ya están en la franja de cifras y en la línea de tiempo).
    Los KPIs (TOTAL, PRIMER RECLAMO, 80% LLEGÓ EN) mantienen su lógica y
    valores, más chicos (`text-body font-semibold text-secondary
    tabular-nums`). La pista (banda, hitos, primer reclamo, estado
    saturado) es la misma, a todo el ancho de la sección; debajo, solo las
    horas de los extremos (`text-caption text-muted tabular-nums`). Estados
    vacíos iguales a los del modal. Sin "Ver detalle": el gráfico ya se ve.
  - Al cambiar de registro, el contenido hace un **fade de 140ms**
    (`animate-[hoja-fade_140ms_ease-out]`; directo con movimiento
    reducido).
  - **Sin resultados:** estado vacío centrado ("No hay interrupciones con
    estos filtros", `text-body-sm neutral-600`).
- **Sin cards:** ni `CardHeader`, ni bordes o sombras contenedoras; la
  separación es el divisor vertical entre columnas y las secciones con
  título.

**Archivos:** `src/features/consultas-interrupcion/ModificarContent.tsx`
(estado y modales), `InterrupcionesMaestro.tsx`, `InterrupcionHoja.tsx`,
`ReposicionesTimeline.tsx`, `ReclamosTimeline.tsx`.

## Registro seleccionado y detalle

- **Registro seleccionado:** fila resaltada en su tabla
  (`bg-primary-tint` + `inset-shadow-row-selected`). En paneles que muestran
  datos hijos de ese registro, el registro va como contexto del header
  (ej. "Interrupción `<ref>`").
- **Detalle:** se abre desde la sección que lo resume, con un único
  disparador: en la hoja de un [maestro-detalle](#maestro-detalle), "Ver
  detalle" (ghost `sm`) a la derecha del título de la sección (ej.
  "Reclamos durante la interrupción" → "Datos de la interrupción"); en una
  card, la sección clickeable (stretched button, abajo).
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

## ABM

**Un solo patrón de pantalla y de modal para todas las tablas** (Tabla 2 …
Tabla 9 NM), en `AbmScreen`. El patrón es la estructura y la presentación;
**el formulario y las reglas de edición son de cada tabla**: campos, orden,
labels, placeholders, tipos, opciones, `expandirBotones`, `listaLarga`,
dependencias (`limpiaAlCambiar`, opciones en función de otro campo),
`camposReadonlyEnModificar` y `mapeoFilaACampos` salen de su config en
`src/data/abmTables.ts`, sin excepciones por tabla en el código.

```
┌ TopBar: Alta, baja y modificación                          [Período ▾] ┐
│ (Tabla 3) Interrupciones no computables ▾                  [+ Insertar] │  selector-título: chip + nombre (+ Insertar si hasInsertar)
│                                                                (gap --page-gap)
│ [🔍 Código de interrupción ] Causa ▾ │ (agregados) [+ Agregar filtro]  Limpiar filtros │  ChipFilterBar
│                                                                (gap-3)
│ Período 08/2026 · Actualizado 10:42        [⭳ Exportar] [↺ Auditoría] │  toolbar de tabla, SIEMPRE (--control-sm) …
│ BPR… seleccionado │ Deseleccionar           [✎ Modificar] [🗑 Borrar] │  … con una fila seleccionada: mismo alto, sin fondo
│                                                                (gap-2)
│ ┌───────────────────────────────────────────────────────────────────┐   │  caja de la tabla (borde, md, surface, shadow-sm)
│ │ CÓDIGO DE INTERRUPCIÓN   CAUSA   FASE DE REPOSICIÓN                │   │  thead fill-subtle-solid, sticky …
│ │ fila…                                                              │   │
│ │ Registros encontrados: N           Anterior  Pág. 1 de N  Siguiente │   │  paginación fill-subtle, border-t
│ └───────────────────────────────────────────────────────────────────┘   │
```

**Pantalla:**
- **Encabezado:** el `TopBar` común ("Alta, baja y modificación" +
  `PeriodSelector` controlado; en tablas sin fecha sigue acotando el
  período) y, como primer elemento del contenido, el [selector de tabla
  como título](#abmtableselector). Con `hasInsertar`, **Insertar** (botón
  primario `md`, ícono +) a la derecha de esa fila.
- **Barra de filtros:** [`ChipFilterBar`](#chipfilterbar) con la config de
  la tabla (ver abajo): aplica al instante, "Limpiar filtros", desborde hacia
  "Más filtros", popovers anclados, chevron o ✕. Estado propio por
  nombre de campo (no comparte valores con el modal); cada filtro se
  traduce a su columna de `rows` con `mapeoFilaACampos` y se aplica con
  `filtrarFilas` (`src/features/abm/filtrarFilas.ts`): filtros con valor en
  AND; el ID y los de texto por "contiene" sin distinguir mayúsculas; lista
  y lista con búsqueda por igualdad; fecha por rango (extremos inclusivos,
  sin hora = día completo). Sin filtros se ven todos los registros.
  Vuelve a la página 1 y deselecciona el registro si quedó afuera. Nunca se bloquea (no hay estado
  "consultando").
- **Sin contador ni espacio reservado:** no hay "N de M registros" (el pie
  de la caja ya cuenta los "Registros encontrados") y no se reserva ningún
  espacio para un estado que no está visible.
- **Espaciado vertical:** header de página (selector + Insertar) → barra de
  filtros: `--page-gap`; barra de filtros → caja de la tabla: `gap-3` (escala
  con los tiers de `--spacing`); entre ambas, la toolbar de tabla
  (`--control-sm`) y `gap-2` hasta la caja.
- **Tabla en su caja:** `border border-border rounded-md bg-surface
  shadow-sm`, `thead` sticky `bg-fill-subtle-solid`, filas con hover
  `fill-muted` y seleccionada `primary-tint` + `inset-shadow-row-selected`,
  paginación al pie dentro de la caja ("Registros encontrados" cuenta las
  filas encontradas con algún filtro; sin filtros, el total de la tabla). Sin
  `overflow-hidden`: el radio lo resuelven el wrapper con scroll
  (`rounded-t-md`) y el pie.
- **Toolbar de tabla persistente** entre la barra de filtros y la tabla,
  con dos estados del mismo alto y sin fondo: sin selección, el contexto
  ("Período 08/2026 · Actualizado 10:42") y las acciones de tabla Exportar
  (CSV de las filas visibles) y Auditoría; con selección, texto plano
  ("<id> seleccionado" / "N registros seleccionados") + link Deseleccionar y,
  a la derecha, las acciones de registro Modificar (solo con 1) y Borrar. El
  layout no cambia al seleccionar. Escape también deselecciona y las flechas
  mueven la selección. Sin columna de acciones por fila. Detalle en [Tabla de
  resultados](#tabla-de-resultados).
- **Estado vacío dentro de la tabla:** sin resultados, el `thead` sigue y
  debajo, dentro de la caja, va "No hay registros con estos filtros" +
  "Limpiar filtros" (sin pie). Un solo buscador: la tabla no lleva
  `TableToolbar` ni `FilterTrigger`; el orden por columna se mantiene.
- **Columnas: la estructura de la tabla real.** Se **derivan** de la config
  (`columnasDeResultados`, `src/features/abm/columnasDeResultados.ts`), no
  se declaran a mano por tabla:
  - son **todos los campos del formulario con `nombreReal`** (o sea, que
    existen en la tabla real), en el **orden de la tabla real**
    (`ordenTablaReal` de la config);
  - el **`campoId` va siempre primero** (mono) y fijo a la izquierda, aunque
    en la tabla real no sea el primero (Tablas 9 y 9 NM);
  - **no se muestran** los campos sin `nombreReal` (Consumo y los CT de
    Tabla 6, Reclamos de Tabla 8), que siguen en el modal, ni los campos de
    auditoría de la tabla real;
  - **sin máximo de columnas**.
- **Encabezados de columna** (solo encabezados y chips; los labels del
  formulario y del modal **no** cambian). El título sale del label del
  campo, o de su `labelColumna` cuando hace falta uno más corto o uno que se
  comparta entre tablas. Reglas:
  - **Un mismo nombre real lleva el mismo encabezado en todas las
    tablas** ("Código equipo" para ID_ELEM en Tablas 2 y 4; "Cant. clientes"
    para CLI en Tablas 4, 5 y 7; "Fase de reposición" para F en todas las
    que la tienen; "Código de interrupción" para REF, también el campo
    Interrupción de Tabla 8).
  - **"Cantidad" → "Cant."** ("Cant. clientes", "Cant. trafos MT/BT").
  - **Se omite el contexto que ya da la tabla** ("Potencia" y no "Potencia
    en KVA del trafo" en Tabla 5; "Capacidad", "Tensión" y "Longitud" en
    Tabla 7; "Fecha" en Tabla 8).
  - **Identificadores como "Nro. X"**: "Nro. cuenta" (POL y CUENTA, mismo
    título aunque el nombre real difiera), "Nro. reclamo" (REC).
  - **Excepciones**, solo cuando el dato es distinto aunque el nombre
    coincida o dos campos de una tabla quedarían con el mismo título:
    SSEE de Tabla 7 ("Subestación": es la subestación, no la cadena
    eléctrica de "Cadena eléctrica" en Tablas 2 y 4) y POT / POTENCIA de
    Tabla 7 ("Potencia trafos" / "Potencia clientes MT", porque ambas
    serían "Potencia").
  - Los **chips** de esos campos usan **exactamente el mismo texto**
    (`chipLabel` = encabezado de la columna); el label largo queda solo en el
    formulario, el modal y el menú "Agregar filtro". Lo mismo el
    placeholder del input de ID (el encabezado de la columna del `campoId`;
    ya no hay `idPlaceholder` en la config). Un filtro de un campo sin
    columna (Consumo y los CT de Tabla 6, Reclamos de Tabla 8) queda fuera de
    la regla.
  - **Verificación de desarrollo:** `encabezadosInconsistentes`
    (`columnasDeResultados.ts`) agrupa por nombre real y falla (se reporta
    con `console.error` al cargar `AbmScreen` en DEV) si dos tablas titulan
    distinto un mismo nombre real fuera de las excepciones, o si una tabla
    repite un título, o si el chip de un filtro no se llama como el
    encabezado de su columna.
  - El nombre real va en la pista del encabezado
    ([`ColumnHeaderHint`](#columnheaderhint)). Una columna de toggle,
    select o combobox muestra la etiqueta de la opción.
- **Ancho:** celdas y encabezados en `whitespace-nowrap`, ningún valor se
  trunca. Solo si las columnas no entran en la caja hay **scroll horizontal
  dentro de la caja**, con la columna del ID fija (ver [Tabla de
  resultados](#tabla-de-resultados)); la paginación no
  scrollea. Nunca scroll horizontal de la página.
- **Borrar** abre `ConfirmarBorrarModal` (acepta N registros y pluraliza).

**Config de la barra (por tabla):**
- `campoId`: el campo del input de ID ("contiene"). No se repite como chip.
- `filtrosBarra.visibles` y `filtrosBarra.agregables` (`AbmFiltroBarra`:
  `campo`, `label?`, `chipLabel?`, `soloValor?`).
- **Regla de chips** (igual para todas las tablas):
  - Se cuentan los campos filtrables de la tabla, **sin contar el
    `campoId`**.
  - **5 o menos:** todos son chips visibles y **no hay "Agregar filtro"**.
  - **Más de 5:** se ven **5** y el resto va a **"Agregar filtro"**.
  - **Prioridad** para elegir los visibles (y su orden): 1) la fecha; 2)
    los campos de lista cerrada (toggle, select, combobox con opciones); 3)
    el orden del formulario.
  - El desborde responsive (hacia "Más filtros") sigue igual. Sin chips
    vacíos ni placeholders inventados.
- **El editor sale del tipo actual del campo:** texto / readonly → input
  "contiene"; toggle / select → lista; combobox → lista con búsqueda;
  fecha → rango con hora. Las opciones, el `emptyMessage` y las
  dependencias son las del campo (Partido → Localidad en Tabla 8: sin
  Partido, Localidad muestra el `emptyMessage`; al cambiar Partido se
  limpia).

**Modal:** el [modal de edición de registro](#modal-de-edición-de-registro),
el mismo para **Modificar** y para **Insertar**, recorriendo los campos de
la tabla activa en su orden.

## Formulario de edición

Formulario **horizontal en filas** (patrón de pantallas de configuración),
hoy en el paso 1 del [modal de edición de
registro](#modal-de-edición-de-registro):

- **Un campo por fila** ([`FormRow`](#formrow)): label a la izquierda
  (`text-body`), control a la derecha.
- **Los controles forman una columna fija a la derecha:** inputs, fecha,
  select y combobox de ancho `--form-control-w` (280px), todos iguales;
  toggles a su ancho intrínseco, alineados a la derecha.
- **Lista continua de filas, sin títulos de sección:** todas con el mismo
  ritmo y el mismo separador suave (`border-b border-border-subtle`, la
  última sin borde), filas de `min-h 56px`. Campos en el orden de la config
  de la tabla.
- Read-only con candado junto al label y el control en su estado read-only.
- **Botones o dropdown:**
  - **Barras de filtro y zonas densas:** dropdown (`ValuePicker`) — compacta
    más que botones con padding propio.
  - **Formularios de edición:** toggle de botones solo para elegir **una**
    opción entre 2–3 opciones cortas (Origen, Tipo, Sí/No, Nivel); dropdown
    para valores combinados o listas (Fase, Descripción).
  - **Indicadores de solo lectura** ([`FaseIndicador`](#faseindicador)):
    letras que se marcan según el valor, sin interacción.

## Modal de edición de registro

Para editar o crear un registro desde una tabla (Modificar e Insertar en el
ABM). Un solo modal con dos pasos: **Editar → Revisar** (Modificar) o
**Completar → Revisar** (Insertar). Los campos se recorren desde las
secciones de la tabla activa, en su orden; cada control con el tipo de su
config (`AbmCampo`). Nada de una tabla puntual vive en el modal.

- **Tamaño `form`** (`--modal-form-w`, 704px), el mismo en los dos pasos
  (Editar y Revisar); el ancho sale de los chips de Motivo en una sola línea
  (~642px con Inter 500 12px) + el `p-5` del body + margen para una barra de
  scroll clásica, redondeado a múltiplo de 8. En el paso 1 la columna de
  controles sigue en `--form-control-w` (280px): solo crece la de labels y
  ninguna fila cambia de alto. El alto se ajusta al
  contenido.
- **Header** de una línea: título (`text-heading-md`) + "Paso N de 2"
  (`text-body-sm text-text-muted`, prop `paso`) + ✕. Sin label de contexto.
- **Título:** Modificar → `tituloModificar` de la tabla (Tabla 2:
  "Modificar interrupción") o "Modificar en Tabla N"; Insertar → "Insertar
  en Tabla N".
- **Lo bloqueado es de cada tabla:** en Modificar, `camposReadonlyEnModificar`
  + los campos tipo `"readonly"`; en Insertar no se bloquea nada (lo que
  hace `AbmCampo` en modo alta). Una tabla sin campos bloqueados (Tabla 7)
  no muestra ningún candado.
- **El identificador (`campoId`) bloqueado** es una fila de solo lectura con
  candado, igual que los otros campos bloqueados: `FormRow` con candado;
  `<input readOnly>` con `READONLY_FIELD_CLS`, ancho `--form-control-w`, valor
  en `text-code font-mono`, seleccionable y copiable con mouse y teclado. Sin
  botón de copiar. No se edita: nunca aparece en "Revisar cambios".
- **Paso 1 — Editar / Completar:** el [formulario de
  edición](#formulario-de-edición) horizontal en filas: los campos de la
  config de la tabla en su orden, en una lista continua sin títulos de
  sección. Toggles a su ancho, con opciones de igual ancho; con
  `expandirBotones`, al menos el ancho de la columna de controles
  (`--form-control-w`).
  - **No editables en solo lectura** (ver [Estados: editable, solo
    lectura, deshabilitado](#estados-editable-solo-lectura-deshabilitado)):
    campos con `READONLY_FIELD_CLS`, toggles como `SegmentadoSoloLectura`, y un
    candado junto al label — **nunca como controles deshabilitados**.
  - Pie: Cancelar · **Revisar cambios** (Modificar: habilitado solo si
    algún campo es distinto del original) o **Revisar** (Insertar:
    habilitado con algún valor cargado).
- **Paso 2 — Revisar (Insertar):** `ResumenValoresContent` — los campos en
  orden con su valor, sin diff y sin Motivo. Pie: Volver · **Insertar**
  (agrega la fila a la data local y la deja seleccionada; si los filtros la
  dejarían afuera, se limpian).
- **Paso 2 — Revisar (Modificar):** mismo modal y mismo header; el body
  pasa a `RevisarCambiosContent`, con dos **secciones, no cajas**: Resumen de cambios (overline
  `text-heading-xs`) y Motivo, separado por `border-t border-border` con el
  mismo espaciado — título "Motivo" en `text-heading-sm text-text` + "·
  obligatorio" en `text-body-sm text-text-muted`, ayuda en `text-body-sm
  text-text-muted` y los chips de `NOTA_OPCIONES` **en una sola fila**
  (`flex-wrap` queda de respaldo: si hay más opciones de las que entran,
  pasan a una segunda línea; nunca se achican ni se truncan). **Ningún
  bloque del modal lleva fondo de color.** Pie: **Volver** (outline, vuelve al
  paso 1 con todo lo editado) · **Guardar** (primario, habilitado solo con
  un motivo válido). Guardar cierra (todavía sin persistencia).
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
`FaseReposicionFicha` en "Tablas relacionadas" ("Reposición 1 `Tabla 4` · hora
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
  ("Datos de la interrupción"), salvo siglas y nombres propios
  (BT/MT/AT, Edenor, CTs). Los labels abreviados heredados de la base
  ("Hue Ini SR", "Max Med SR"…) no se tocan.
- **Nombres de tabla:** en la UI las tablas se nombran **"Tabla N"**
  ("Tabla 2" … "Tabla 9 NM", `config.nombre`, los mismos labels del menú
  lateral): tags, badges, selector, accesos del Inicio, links. El código
  CDS (`config.code`) es un **dato interno** — datos, exportaciones,
  nombres de archivo — y solo se muestra en el tooltip del selector de
  tabla ("Tabla 2 · Interrupciones (CDS2)"). Reemplaza la decisión anterior
  de mostrar el código como tag.
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
