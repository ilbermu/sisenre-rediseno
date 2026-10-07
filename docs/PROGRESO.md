# PROGRESO.md

Bitácora de sesiones de trabajo sobre el código de `src/` (SISENRE_REDISEÑO). Cada
entrada es un cierre de jornada: qué se hizo, qué queda pendiente y cómo
retomar. Fuente de verdad de patrones de UI: `DESIGN_SYSTEM.md`.

## 2026-09-23

### Qué se hizo

- **Card "Reposiciones" (CDS4, Modificar interrupción)**: la tabla (Tabla 4)
  suma columnas `Fase`, `Equipo` y `Usuarios BT` a las ya existentes
  (`ReposicionesTable`, hoy `ReposicionesLista` en
  `src/features/consultas-interrupcion/ReposicionesLista.tsx`). La franja con la interrupción
  seleccionada (+ reposición activa, si hay más de una) pasó a ser fija
  (`shrink-0`, fuera del body con scroll — antes vivía adentro y se perdía al
  scrollear la tabla). El header de la card suma el botón "Ver datos de
  interrupción" (ícono `Activity`), que abre el detalle de la interrupción
  aparte. La línea de tiempo de la interrupción, que antes vivía en esta
  card, se movió al modal "Tablas relacionadas".
- **Drawer → Modal "Tablas relacionadas"**: el viejo drawer lateral fue
  reemplazado por un modal (`Modal` con `bodyPadding={false}` +
  `bodyOverflow="hidden"` + `height` fijo), enfocado en una reposición a la
  vez, con paginador propio (‹ ›) sobre `modSelectedFase`.
- **Header gris en modales**: el bloque de header de `Modal` pasa a
  `bg-gray-50` + `border-b border-gray-200` (mismo tratamiento que
  `CardHeader`), aplicado automáticamente a los 13 usos de `Modal` de la app
  (no es opt-in). Auditados los `headerExtra` existentes: ninguno tiene
  fondo blanco propio que quedara como parche sobre el nuevo header gris.
- **Chips de la reposición activa**: en "Tablas relacionadas", el
  `headerExtra` quedó reducido a solo la identidad fija del modal
  (Interrupción + `CopyButton`); el dato de la reposición activa
  (`FaseReposicionFicha`) se movió al body, como primera fila, renderizado
  con el nuevo componente `MetaChip` (variantes `neutral`/`accent`) — chips:
  Reposición N (accent), hora, Fase (con el nuevo indicador `FaseIndicador`
  de 3 cajas R/S/T), Equipo, Usuarios BT — más un botón "Copiar datos de la
  reposición" (ver pendiente abajo).
- `DESIGN_SYSTEM.md` actualizado para reflejar todo lo anterior: header gris
  de `Modal`, patrón de "modal de trabajo" con identidad fija en
  `headerExtra`, secciones nuevas para `MetaChip`/`FaseIndicador` y
  `CopyButton` (incluyendo la excepción deliberada del botón de copiar datos
  de la reposición, que no usa su patrón de feedback). Se confirmó que no
  quedan menciones a componentes ya eliminados (`DrawerSection`,
  `ReposicionStepper`, `SegmentedSwitch` como patrón vigente, `ContextChip`,
  el drawer original) — `UnderlineTabs` es hoy el único patrón de tabs de
  contenido.

### Pendientes abiertos

- **Botón "Copiar datos de la reposición"** (`src/features/consultas-interrupcion/FaseReposicionFicha.tsx`,
  `handleCopiarDatosReposicion`): handler intencionalmente vacío, con
  `// TODO: definir contenido y formato del copiado (pendiente de
  definición)` en el mismo archivo. No simula feedback de "copiado" a
  propósito (ver `DESIGN_SYSTEM.md`, sección `CopyButton`) hasta que se
  defina qué copia y en qué formato.
- **Choque de nombre "Fase"**: la columna `"Fase"` de las Tablas 5/6/9
  (`DRAWER_TABS` en `src/data/dominio.ts`, junto al comentario de aviso)
  hoy guarda el número de reposición, y choca semánticamente
  con "Fase" = fase eléctrica (R/S/T/RS/RT/ST/RST), que es el sentido que
  tiene la columna homónima de la Tabla 4 (mismo archivo) y el chip `MetaChip
  label="Fase"` del modal. Falta decidir un nombre sin ambigüedad para la
  columna de Tablas 5/6/9 (ej. "Reposición" en vez de "Fase") y aplicarlo.
- **Otros `TODO` encontrados en el código** (búsqueda de `// TODO` en
  `src/`):
  - `src/features/consultas-interrupcion/FaseReposicionFicha.tsx` — el del botón de copiar, ya detallado arriba.
  - `src/features/abm/AbmScreen.tsx` (`handleConfirmarModificar`) — `config.rows` es mock
    derivado de la configuración, todavía no hay persistencia real del
    cambio ni de la nota de modificación (mismo caso pendiente que
    "Borrar"); por ahora el flujo solo cierra el modal.

### Cómo levantar el proyecto en otra máquina

```
pnpm install
pnpm dev        # sirve en el puerto 8443 (PORT env var lo puede sobreescribir)
```

Login del prototipo (`src/features/login/LoginScreen.tsx`): usuario `rdellamagiora`,
contraseña `1234`.

## 2026-09-30

### Qué se hizo

- **Rutinas de jornada** (`CLAUDE.md`): "buen día" sincroniza desde el
  remoto (pull solo si los cambios locales no chocan con los entrantes);
  "listo por hoy" actualiza esta bitácora, commitea y pushea.
- **Fila inferior de Modificar interrupción**: split 50/50 entre
  Interrupciones y Reposiciones. La tabla de Interrupciones copia el estilo
  de `ReposicionesTable`; `ReposicionesTable` pasa de alto fijo de 5 filas a
  `flex-1` (se sacaron sus props `maxHeight` y `footer`).
- **Registro seleccionado**: se eliminó el botón "Ver datos de
  interrupción"; "Datos de la Interrupción" se abre solo desde la card de
  Reclamos. `CardHeader` suma `context` ("· INTERRUPCIÓN <ref>" en
  Reposiciones, reemplaza a la franja que se ocultaba en tier 760px).
- **Cards de detalle** (Reclamos y Tablas relacionadas): usan `CardHeader`
  (header gris, cuerpo blanco). Reclamos es clickeable con patrón stretched
  button (hover y foco sobre toda la card). Los tiles de Tablas
  relacionadas sin datos pasan a `<div>` punteado no interactivo (sin
  opacidad reducida). `CardHeader` suma `size="compact"` (solo tier
  ≤760px).
- **Toolbar de tabla**: fuera del contenedor de la tabla, sin línea
  divisoria (Interrupciones, Resultados del ABM y modal Tablas
  relacionadas). Contador "N de M registros" siempre visible
  (`TableCounter`). Se probó dejar `CardHeader` sin fondo ni border-b y se
  revirtió en el mismo día (`b727148`).
- **Búsqueda y filtros**: `useTableToolbar` suma `searchCols` (el ABM no
  cambia). Interrupciones busca solo Referencia y suma filtro de Fecha;
  Tablas relacionadas busca solo columnas no filtrables, con
  `searchPlaceholder` por tab. Nuevo `FilterTrigger` (variantes `list` y
  `date-range`, mismo trigger `FilterTriggerButton`): único botón sin borde
  en reposo, siempre pintado con filtro aplicado.
- **Modal Tablas relacionadas**: la fila de la reposición activa pasa a
  barra de contexto de registro (contenedor único, "Reposición N" + CDS4 +
  metadatos como texto con "·"). `FaseIndicador` queda de solo lectura con
  texto `sr-only`. `MetaChip` se eliminó.
- `DESIGN_SYSTEM.md`: nueva sección "Patrones de contenedor y tabla"
  (reglas 1–7) y secciones de `MetaChip`/`FaseIndicador`/`CopyButton`
  actualizadas.

### Pendientes abiertos

- **Botón "Copiar datos de la reposición"** (`src/features/consultas-interrupcion/FaseReposicionFicha.tsx`,
  `handleCopiarDatosReposicion`, con su `TODO`): sigue sin copiar nada,
  pero su aria-label promete hacerlo. Definir qué copia o sacarlo.
- **Placeholders de Tablas relacionadas** (`relSearchPlaceholder` en
  `src/features/consultas-interrupcion/ModificarContent.tsx`): ninguno nombra todas sus columnas buscables, porque la
  regla "todo lo no filtrable es buscable" mete Consumo, Potencia y (en
  Tabla 8) Fecha en el buscador. Evaluar `searchCols` explícito por tab.
- **Tiles de Tablas relacionadas en 0** (`RelacionadaChip`,
  `src/features/consultas-interrupcion/RelacionadaChip.tsx`): al ser `<div>` ya no abren el modal en ese tab (donde
  está "Ir a CDS… a insertar"); si todos están en 0, no hay forma de abrir
  el modal.
- **Choque de nombre "Fase"**: sigue abierto. La columna "Fase" de las
  Tablas 5/6/9 (`DRAWER_TABS`, `src/data/dominio.ts`) guarda el número de
  reposición; en la Tabla 4 (mismo archivo) y en la barra de contexto del modal,
  "Fase" es la fase eléctrica.
- **Sin probar en el navegador**: tier ≤760px (incluido el header
  compacto), navegación con Tab/Shift+Tab por toolbar y filtros, que cada
  tile abra su tab, Enter sobre la card de Reclamos y la barra de contexto
  del modal.
- `src/features/abm/AbmScreen.tsx` (`handleConfirmarModificar`): sin persistencia real,
  igual que en la entrada anterior.

### Cómo levantar el proyecto

Sin cambios (ver entrada del 2026-09-23). Login del prototipo:
`src/features/login/LoginScreen.tsx` (`LoginScreen`).

## 2026-10-01

### Qué se hizo

- **Sistema tipográfico** (`28e45ae`, `7b5d88e`): 10 tokens compuestos por
  rol (`heading-lg/md/sm/xs`, `body-lg`, `body`, `body-sm`, `label`,
  `caption`, `code`) + `display` solo para la marca del login;
  `--text-*: initial`. Sin tamaños arbitrarios, `leading-*` ni `font-bold`.
  Los `@media` por alto ya no redefinen `--text-*` (`--spacing` es la única
  palanca de densidad). `Modal` perdió la prop `titleSize` (título fijo en
  `heading-md`); se eliminaron `DataTile` y `CompactSelectionActionBar`.
- **Superficies, sombras y radios** (`d2342c1`, `fdafc17`, `89cb1ba`):
  `bg-app` / `surface`, bordes `border` / `border-strong` / `border-subtle`,
  rellenos translúcidos `fill-subtle` / `fill-muted` (+
  `bg-fill-subtle-solid` para `th` sticky), sombras `sm/md/lg` como clases,
  radios `xs/sm/md/lg/xl/full` con `--radius-*: initial`. Sin `bg-gray-*`,
  `border-gray-*`, `bg-white`, `boxShadow` inline ni radios arbitrarios.
- **Colores de texto** (`58d5f9b`, `5677bbf`): `text`, `text-muted`,
  `text-faint`, `icon` (neutros cálidos, con tabla de contraste en el DS).
  Un solo color de texto principal. `text-primary` ya no se usa como texto
  (salvo el ícono de accesos del Inicio).
- **Celeste en dos tonos** (`1f5b778`): `primary` para bordes, tints, foco y
  seleccionado; `primary-strong` (#076AEE) para rellenos con contenido
  blanco, con hover `primary-hover`. Se eliminó `--color-secondary-hover`.
  El segmented mensual/semestral usa el patrón tint de seleccionado.
- **Login** (`3b6667b`): estado de carga con spinner y color pleno,
  distinto del deshabilitado (documentado en el DS).
- **Headers** (`cca465e`, `3ee3b7b`): `CardHeader` sin fondo ni divisor, con
  `title` + `tag` + `subtitle` + `actions` (se fueron `context`, `right` y
  `size`), `px-4`, `reserveSubtitle` y `padX`. El contexto pasó a subtítulo
  en Interrupciones, Reposiciones, Reclamos y Tablas relacionadas.
  `REPOSICIONES_HEADER_H` = 32.
- **Modificar interrupción** (`8fe6ec6`, `4afc087`): cards de trabajo en
  `rounded-md`; tablas apoyadas en la card sin contenedor propio; Reclamos y
  Tablas relacionadas como secciones (`border-t`); las 7 acciones como
  segunda fila de la card de Búsqueda; `gap-4` único. A 1366×768 la lista de
  Interrupciones pasó de 3,9 a 5,9 filas visibles.
- `DESIGN_SYSTEM.md`: secciones nuevas "Tipografía", "Superficies: fondos,
  bordes y sombras", "Celeste de marca: dos tonos, dos usos", "Colores de
  texto", "Radios", "Header de card" y regla 8 de "Patrones de contenedor y
  tabla".

### Pendientes abiertos

- **Ancho a 1366px**: la fila de filtros de Búsqueda (Modificar
  interrupción) no entra; el botón "Buscar" queda cortado contra el borde
  derecho y la card de Reposiciones se pasa unos píxeles. Preexistente.
  (Sigue abierto, ver entrada del 2026-10-05.)
- **Cards con `overflow-hidden`** (las de Consultas de interrupción, hoy en
  `src/features/consultas-interrupcion/ModificarContent.tsx`; las del ABM en
  `src/features/abm/AbmScreen.tsx`; la de Notas en
  `src/features/otros/GestorNotasContent.tsx`): la regla del DS dice que las cards no lo usan (recorta
  popovers). No se sacó porque hay que verificar el scroll interno en el
  navegador. (Las dos de Modificar interrupción se resolvieron el
  2026-10-05; quedan las de ABM y Notas, ver esa entrada.)
- **Tabla de Resultados del ABM** (`src/features/abm/AbmScreen.tsx`): conserva su
  contenedor con borde; la regla 8 ("una card, una superficie") solo se
  aplicó a Modificar interrupción.
- **"Procesar" de Planilla consolidada**: se deshabilita mientras procesa
  con el tratamiento de deshabilitado (`opacity-40`), no con el patrón de
  cargando del login.
- **Sin probar en el navegador** (solo se capturó Modificar interrupción a
  1366×768 y 1366×657 con Edge headless): el resto de las pantallas con los
  tokens nuevos, textos de 9–10px que pasaron a 11px en cajas de alto fijo
  (badge de "Más filtros", casilla de fase de 18×18, rótulos del SVG de la
  timeline), login, modales, navegación con teclado.
- **Botón "Copiar datos de la reposición"** (`src/features/consultas-interrupcion/FaseReposicionFicha.tsx`,
  `handleCopiarDatosReposicion`): sigue sin copiar nada.
- **Placeholders de Tablas relacionadas**, **tiles en 0 que no abren el
  modal** (`RelacionadaChip`, `src/features/consultas-interrupcion/RelacionadaChip.tsx`) y **choque de nombre
  "Fase"**: siguen abiertos, igual que en la entrada del 2026-09-30.
- `src/features/abm/AbmScreen.tsx` (`handleConfirmarModificar`): sin persistencia real.

### Cómo levantar el proyecto

Sin cambios (ver entrada del 2026-09-23). Login del prototipo:
`src/features/login/LoginScreen.tsx` (`LoginScreen`).

## 2026-10-05

### Qué se hizo

- **Fondo y encabezado de página** (`737edeb`): `--color-bg-app` pasa de
  `#FAF9F5` (crema) a `#FAFAFA`; la tabla de contraste del DS se recalculó
  (text-muted 5.18:1 e icon 3.55:1 en el peor caso, `fill-muted` sobre el
  fondo). Consultas de interrupción tiene encabezado propio, apoyado en el
  fondo y sin borde: breadcrumb Inicio > Consultas de interrupción, título
  "Búsqueda de interrupciones" (`heading-lg`) y selector de período a la
  derecha. El top bar del resto de las pantallas no cambió.
- **Búsqueda sin contenedor** (`737edeb`): la fila de filtros ya no es una
  card (sin header "Búsqueda" + CDS2). Se sacó de la pantalla la fila de
  acciones (Desarmes…Intercambio) y su dropdown de tier 760px; los modales
  y su estado quedaron intactos.
- **Cards con secciones** (`7eed177`): `CardHeader` suma props opt-in
  `divider`, `tagAlign="end"` y `level="section"`, más el componente
  `SubtituloEtiquetado`. Interrupciones: header con divisor y badge a la
  derecha, sin subtítulo; toolbar con buscador, Fecha y contador; paginación
  con fondo `fill-subtle`. Reposiciones: subtítulo "INTERRUPCIÓN
  SELECCIONADA" + ID. Reclamos y Tablas relacionadas, secciones con título
  `heading-sm` ("REPOSICIÓN X de N · hora"). Las cards se ajustan a su
  contenido (`items-start`, `max-h-full`) y ya no usan `overflow-hidden` (el
  panel de Fecha ya no se recorta). Nueva sección "Card con secciones" en el
  DS.
- **Grupo "Herramientas" en el menú lateral** (`ca0aa3d`): desplegable
  (ícono `Wrench`) entre ABM y Otros, con un solo grupo abierto a la vez
  (ABM/Herramientas; en el acordeón compacto también Otros). Lotes abre su
  modal desde cualquier pantalla (el modal pasó a `App`). `NavItem` suma
  `disabled`.
- A 1366×768 las cards arrancan 100px más arriba (y=255 → y=155); sin
  búsqueda terminan en y=549 / 489 en vez de estirarse hasta y=751.

### Pendientes abiertos

- **Herramientas sin conectar** (`HERRAMIENTAS_ITEMS`, `src/App.tsx`):
  Desarmes, Nivel/Tipo, Replicar, Cambia fases, Alta clientes e Intercambio
  dependen de la interrupción seleccionada en Consultas de interrupción
  (referencia del modal o habilitación por selección). Quedan
  deshabilitados en el menú y, al no estar más la fila de botones, hoy no se
  pueden abrir desde ningún lado. Falta definir cómo se resuelven desde el
  menú.
- **`PersistentActionsBar`** (`src/features/abm/PersistentActionsBar.tsx`) quedó sin usar; borrarlo
  cuando se resuelva el punto anterior.
- **Headers desalineados**: Interrupciones no lleva subtítulo y su header
  mide 16px menos que el de Reposiciones (`reserveSubtitle`), así que los
  divisores de las dos cards no quedan a la misma altura
  (`src/features/consultas-interrupcion/ModificarContent.tsx`). **Resuelto el 2026-10-06** (`20de44d`): `CardHeader` con alto fijo
  `--card-header-h`; las dos cards miden lo mismo.
- **Ancho a 1366px**: "Buscar" sigue cortado contra el borde derecho y los
  toggles Origen/Tipo se apilan en dos renglones. Preexistente.
- **"Orden por Fecha"**: en Interrupciones es un filtro por rango
  (`FilterTrigger` `date-range`), no un orden. Confirmar si se quiere un
  orden.
- **Cards con `overflow-hidden`** fuera de Modificar interrupción: ABM
  (`src/features/abm/AbmScreen.tsx`) y Notas
  (`src/features/otros/GestorNotasContent.tsx`).
- **Sin probar en el navegador**: tier ≤760px del encabezado nuevo, del
  grupo Herramientas y de las cards con alto según contenido; sidebar
  colapsado (el ícono de Herramientas expande el sidebar y abre el grupo).
- **Botón "Copiar datos de la reposición"** (`src/features/consultas-interrupcion/FaseReposicionFicha.tsx`,
  `handleCopiarDatosReposicion`): sigue sin copiar nada.
- **Placeholders de Tablas relacionadas**, **tiles en 0 que no abren el
  modal** (`RelacionadaChip`, `src/features/consultas-interrupcion/RelacionadaChip.tsx`), **choque de nombre
  "Fase"**, **tabla de Resultados del ABM con contenedor propio** y
  **"Procesar" de Planilla consolidada con `opacity-40`**: siguen abiertos.
- `src/features/abm/AbmScreen.tsx` (`handleConfirmarModificar`): sin persistencia real.

### Cómo levantar el proyecto

Sin cambios (ver entrada del 2026-09-23). Login del prototipo:
`src/features/login/LoginScreen.tsx` (`LoginScreen`).

## 2026-10-06

### Qué se hizo

- **Aire de chrome y Consultas de interrupción** (`f9d05c5`): variables
  `--card-px`, `--page-px/pt/gap`, `--cards-gap`… (más aire solo en
  pantallas > 900px de alto; en notebooks, mismos valores que antes).
  Reposiciones pasa de tabla a lista de filas (`ReposicionesLista`); el
  toolbar de Interrupciones se renderiza siempre.
- **Fundamentos del DS** (`3be848c` … `b5fe113`, un commit por tema): escala
  neutra única (`--color-neutral-*`, sin `gray-*`) y tokens `--color-viz-*`;
  foco único (`FOCUS_RING`, `FOCUS_RING_INSET`, `FIELD_FOCUS`,
  `PEER_FOCUS_RING`); alto de controles fuera de `--spacing`
  (`--control-xs/sm/md`, mínimo 24px) y `ICON_BTN_*`; tracking en el token y
  utilidad `caps`; constante `ICON`; capas `--z-*` (incluye `raised`,
  `dismiss`); movimiento (`--duration-*`, `--ease-standard`, reduced motion,
  `MotionConfig`); semánticos completos (+ `error-bg-subtle`); scrim y
  gradiente de marca como tokens; voseo y helpers de formato
  (`formatNumero`, `formatFecha`, `formatFechaHora`, `VALOR_VACIO`); radios
  reales con `name` y foco visible en checkbox/radio.
- **Refactor estructural** (`750d1ad` … `96daf55`): `src/App.tsx` (~8.700
  líneas) partido en `components/ui/` (design system + `tokens.ts` +
  `index.ts`), `components/layout/`, `features/<herramienta>/`, `data/` y
  `lib/`, sin cambios de comportamiento (CSS generado idéntico en cada
  paso). Export default por componente (AGENTS.md). `DESIGN_SYSTEM.md`
  reorganizado en Fundamentos / Componentes / Patrones; la narrativa
  histórica pasó a "Historia de decisiones del DS" (abajo).
- **Headers** (`4d9e1c7` … `a34ce75`): `CardHeader` con anatomía fija (alto
  `--card-header-h`, línea siempre, `px-(--card-px)`, contexto en la misma
  línea); cuerpos de card a `px-(--card-px)`; header de `Modal` con los
  mismos tokens. `TopBar` compartido: Consultas de interrupción deja su
  encabezado con breadcrumb.
- **ABM Tabla 2, prueba de layout "barra"** (`dd45d6c` … `7210868`): barra
  de búsqueda con el formato de la de Consultas y los campos de cds2
  (`AbmCampo`); tabla de resultados en su caja, sin card; barra de
  herramientas con contador o, con selección, Modificar / Borrar (ghost) y
  ✕; un solo buscador; Auditoría y Exportar deprecados en esta variante.
  El resto de las tablas sigue con el layout split.
- **Botones** (`2a841b0`, `ef2569d`, `21a2d13`): variante ghost
  (`ghostBtnCls`, solo sm) y regla de jerarquía (página: md con borde;
  tabla/registro: sm ghost); acciones de fila del split a ghost;
  `rowActionBtnCls` eliminado; sin letter-spacing fuera de `heading-xs` y
  `caps`.
- **Modal de edición de registro** (`9056195` … `28cebc9`, ABM Tabla 2):
  `size="form"` (640px), label de contexto arriba del título (referencia +
  `CopyButton` xs), formulario horizontal en filas (`FormRow` nuevo, label a
  la izquierda, controles en una columna fija `--form-control-w`), Origen y
  Tipo en estado read-only (nuevo, distinto de disabled), flujo Editar →
  Revisar en el mismo modal (`RevisarCambiosContent`, "Paso N de 2"), y
  dropdowns en portal dentro de modales (`FloatingPanel`,
  `--z-modal-popover`). Regla: nunca un modal sobre otro.
- **Toggles y fase** (`5302904`, `404a067`): opciones de un grupo con igual
  ancho (`ButtonSelectGroup` y toggle de `AbmCampo`); campo tipo `"fase"`
  (R/S/T de selección múltiple, valor ordenado) para `faseElectrica` de
  cds2.

### Pendientes abiertos

- **Sin probar en el navegador**: todo lo de hoy. En particular: tiers
  ≤900/≤760px (alto de controles, `--card-px` ≈13px en notebooks, menos que
  antes), layout barra de Tabla 2, modal de Modificar (filas, read-only,
  portal de fecha/select alineado a la derecha, paso 2), igual ancho de los
  toggles y botones de fase.
- **Modal sobre modal que queda**: el combobox de lista larga (Descripción
  equipo operado) abre su lista como modal centrado encima del modal de
  Modificar (`src/components/ui/ValuePicker.tsx`, variante `modal`).
- **Popovers de `FilterTrigger` dentro de "Tablas relacionadas"** no usan
  `FloatingPanel` (`src/components/ui/FilterTrigger.tsx`).
- **ABM**: Auditoría y Exportar pendientes de reubicar (ver 2026-10-07; la
  búsqueda filtra, hay Insertar y la barra tiene estado propio).
- **Campos de texto que convendría cambiar de tipo** (no aplicado): Fase
  eléctrica en Tablas 4 y 5 (select), Tarifa en Tablas 6 y 8 (select), Nivel
  de tensión en Tabla 6 y Tensión en Tabla 7 (toggle), Código falla en
  Tabla 8 (select/combobox); cantidades sin filtro por rango.
- **Desalineaciones horizontales**: el título de `TopBar` (`px-6`) no
  coincide con `--page-px` del contenido de Consultas; en `Modal`, el header
  (`--card-px`) no coincide con el `p-5` del body.
- **Código sin uso**: `--field-w-sm/md/lg` (`src/index.css`),
  `SubtituloEtiquetado`
  (`src/features/consultas-interrupcion/SubtituloEtiquetado.tsx`) y
  `PersistentActionsBar` (ver pendientes del 2026-10-05).
- **Archivos grandes** (candidatos a partir): `ModificarContent.tsx` (~860
  líneas), `AbmScreen.tsx` (~750), `data/abmTables.ts` (~750).
- **Tailwind escanea los `.md`**: una clase mencionada en `DESIGN_SYSTEM.md`
  o en esta bitácora se genera en el CSS aunque la app no la use.
- Siguen abiertos de días anteriores: herramientas sin conectar,
  `PersistentActionsBar`, ancho a 1366px, "Orden por Fecha", cards del ABM
  y Notas con `overflow-hidden`, botón "Copiar datos de la reposición",
  placeholders y tiles en 0 de Tablas relacionadas, choque de nombre
  "Fase", "Procesar" con `opacity-40` y `handleConfirmarModificar` sin
  persistencia real.

### Cómo levantar el proyecto

Mismos comandos (ver entrada del 2026-09-23). Cambió la estructura: el
paquete se llama `sisenre` y el código ya no vive todo en `src/App.tsx`
(ver "Project Structure" en `AGENTS.md`). Login del prototipo:
`src/features/login/LoginScreen.tsx`.

## 2026-10-07

### Qué se hizo

- **Barra de búsqueda** (`b83c018` … `4dcb8a6`): `FilterBar` se extrae de
  Consultas a `components/ui` (flyout con combobox de Descripción equipo
  operado y toggle Sí/No) y se usa un tiempo en Tabla 2; después Tabla 2
  pasa a la barra híbrida `ChipFilterBar` (ID directo + chips que aplican al
  instante, popovers anclados con `AnchoredPopover`, desborde "+N" y modo
  compacto, editor de fecha con calendario en rango y `HoraCombobox`;
  `PeriodSelector` controlable). Consultas conserva `FilterBar`. El tipo de
  campo "fase" (botones R/S/T) se creó y se eliminó el mismo día: Fase
  eléctrica vuelve a dropdown (regla botones vs dropdown en el DS).
- **Modal de edición de registro** (`5998cdd` … `b4dfea3`): estado de solo
  lectura unificado (`READONLY_FIELD_CLS`, `SegmentadoSoloLectura` para
  toggles), código de interrupción como primer campo con copiar, Motivo como
  sección sin caja de color, `--modal-form-w` 704px.
- **Nomenclatura y encabezado del ABM** (`8cf504c` … `c79f7a1`): "Tabla N" en
  la UI (el código CDS queda interno), ABM con el `TopBar` común y
  `AbmTableSelector` como título.
- **ABM — patrón único de pantalla y modal** (`4c6bfb5`, `9758308`): las 9
  tablas usan el patrón aprobado en Tabla 2. Se adapta el patrón, no se
  copia el formulario: campos, tipos, opciones, dependencias,
  `camposReadonlyEnModificar` y `mapeoFilaACampos` siguen saliendo de la
  config de cada tabla, sin cambios.
  - Config (`src/data/abmTables.ts`): sin `layout` ni `columnasResultado`;
    cada tabla suma `campoId`, `filtrosBarra` (fijos = fecha + campos de
    lista cerrada; el resto, agregables; el editor sale del tipo del
    campo) y `columnasResultadoBarra` con labels completos.
    `barraBusqueda.tituloModificar` pasa a `tituloModificar`.
  - `AbmScreen` reescrito solo con el layout barra: TopBar, selector-título
    (+ Insertar primario si `hasInsertar`), `ChipFilterBar` (estado por
    nombre de campo, traducido a columnas con `mapeoFilaACampos`),
    barra de la tabla y caja. `ChipFilterBar` suma opciones dependientes y
    `emptyMessage` (Partido → Localidad en Tabla 8).
  - Modal único para Modificar e Insertar ("Insertar en Tabla N":
    Completar → Revisar con resumen de valores; la fila nueva va a la data
    local y queda seleccionada). Lo bloqueado en solo lectura con candado;
    el `campoId` bloqueado con copiar.
  - Borrados: layout split, `AbmFila`, `ConfirmarModificarModal`,
    `SectionDivider` y la prop `consultando` de `AbmCampo`.
  - `filtrarFilas` verificado contra la data sintética de las 9 tablas
    (ID, cada chip y valores de lista dentro de las opciones).
- **ABM — regla de chips** (`bb58a3f`, `f958f5a`): hasta 5 chips visibles
  por tabla (prioridad: fecha → listas cerradas → orden del formulario);
  con 5 filtros o menos no hay "Agregar filtro" (Tablas 3, 5, 9 y 9 NM).
  `filtrosBarra.fijos` pasa a `visibles` (también la prop de
  `ChipFilterBar`, que ya no renderiza "Agregar filtro" sin agregables).
  Regla, filtros e ID verificados con un script contra la data sintética
  de las 9 tablas. (Las columnas de esta pasada se reemplazaron más tarde
  por las de la tabla real, ver abajo.)
- **Nombre real de las columnas** (`eba2766`, `ab63a39`): `ColumnHeaderHint`
  (nuevo, `components/ui`) y `SortableHeaderCell` `hint`; cada campo suma
  `nombreReal` (exportes 202608), mostrado como pista del encabezado. Sin
  nombreReal: Consumo, CT (Tabla 9), CT (Tabla 10) en Tabla 6 y Reclamos en
  Tabla 8.
- **`ColumnHeaderHint` ajustado y tipografía de tablas** (`fb03f82`,
  `43e6469`): sin subrayado (el título pasa a `text-secondary` con hover o
  foco), tag arriba del título (portal, `primary-tint` / `chip-border` /
  `text-secondary`, fuente de texto). `font-mono` solo en el identificador
  del registro: se elimina `mono` de las columnas del ABM (derivado del
  `campoId`) y de Reposiciones; cifras con `tabular-nums`.
- **Columnas de Resultados = tabla real, con scroll horizontal** (`6ae1150`):
  columnas derivadas de la config (`columnasDeResultados`): campos con
  `nombreReal` en el orden real (`ordenTablaReal`), campoId primero y fijo
  (sticky, borde solo con contenido desplazado), "Nro. cuenta" para POL /
  CUENTA (`labelColumna`), sin máximo ni auditoría; se quita
  `columnasResultadoBarra`. Tabla en `border-separate`, celdas nowrap y
  scroll horizontal dentro de la caja (paginación y barra fijas).
- **Encabezados de columna unificados** (`4b56722`): `labelColumna` en 28
  campos; mismo nombre real = mismo título en todas las tablas ("Cant.
  clientes", "Código equipo", "Fase de reposición"…), "Nro. reclamo" para
  REC, chips con el mismo texto. Excepciones en Tabla 7 (SSEE, POT,
  POTENCIA). Verificación `encabezadosInconsistentes` (console.error en
  DEV) y script de comprobación contra las 9 configs: sin problemas.
- `DESIGN_SYSTEM.md`: Patrones → "ABM" (patrón único; el formulario y las
  reglas de edición son de cada tabla; regla de chips: hasta 5 visibles,
  el resto en "Agregar filtro"; labels de columna = label del form),
  "Modal de edición de registro" con Insertar, `ColumnHeaderHint` y la regla
  de tipografía en tablas.

### Pendientes abiertos

- **Sin probar en el navegador:** las 8 tablas nuevas en el patrón,
  Insertar, el desborde de la barra con 5 chips de valores largos (Tabla
  6: CTs; Tabla 7: chips numéricos) y los toggles con `expandirBotones` en
  el modal (Causa ≈ 323px, Zona ≈ 297px: más anchos que
  `--form-control-w`).
- **Tablas anchas sin probar:** Tabla 2 (12 columnas), Tabla 7 (11) y
  Tabla 8 (13) probablemente scrolleen en horizontal en notebooks: falta
  ver el ID fijo, su borde y el fondo en hover y selección.
- **Piso y Depto. (Tabla 8)** tienen filas vacías en la data sintética
  (10 y 5 de 40): son valores legítimos (casa, sin depto), no se completaron.
- **Tabla 9 NM:** la tabla real tiene CT pero el formulario no; sin columna
  ni chip de CT.
- **Chips con etiqueta larga:** con los encabezados unificados, algunos
  chips superan los ~10 caracteres previstos ("Potencia clientes MT",
  "Código de interrupción" en Tabla 8) y truncan a 200px.
- **Chips y columnas con nombres distintos:** Tabla 8 (chip "Póliza" /
  columna "Nro. cuenta"), Tablas 6 y 9 (chip "Cliente"), Tabla 6 (chip
  "Potencia" / campo "Demanda media del cliente (KW)").
- **Paginación del ABM fija** (siempre página 1) y filas nuevas de Insertar
  solo en la sesión.
- **Pista de nombre real sin probar:** el tag va en un portal (fixed), así
  que no se recorta; falta ver su posición real sobre el `th` sticky y el
  cierre con scroll.
- **`font-mono` fuera de tablas** sin revisar: ver el listado del reporte
  del 2026-10-07 (modales, fichas, chips, inputs).
- **Deep-link de alta a Tabla 8** ("Ir a Tabla 8 a insertar" desde Tablas
  relacionadas): Tabla 8 no tiene Insertar, así que se aplica como
  búsqueda por Interrupción. Revisar si el link debería ocultarse.
- **Modificar y Borrar sin persistencia:** Guardar cierra sin cambiar la
  fila (`handleConfirmarModificar`); Borrar solo la oculta en la sesión.
  Insertar sí agrega la fila a la data local de la sesión.
- **Auditoría y Exportar** siguen sin renderizarse en el ABM;
  `exportFilename` queda en la config sin uso.
- **No hay script `lint`** en `package.json`: se verificó con
  `tsc --noEmit` y `pnpm build`.

## Historia de decisiones del DS

Narrativa que antes vivía en `DESIGN_SYSTEM.md`. Ahí queda solo la regla
vigente; acá, de dónde salió.

- **Fondo de página:** `--color-bg-app` era `#FAF9F5` (crema) y pasó a
  `#FAFAFA` (gris neutro) el 2026-10-05; la tabla de contraste se
  recalculó con el valor nuevo.
- **Rellenos translúcidos:** se eligieron para que nunca apareciera un gris
  azulado sobre un fondo cálido, cuando todavía existía la escala
  `--color-gray-*` (grises azulados). Esa escala se eliminó el 2026-10-06 y
  la reemplazó `--color-neutral-*` (cálida).
- **Tabs de contenido:** `UnderlineTabs` reemplazó al `SegmentedSwitch`
  (riel + pastilla), que se usó brevemente para elegir la tabla del modal
  "Tablas relacionadas". Se volvió a tabs subrayados por ser más estándar
  para contenido tabular con varias vistas anchas.
- **`shrink-0` en contenedores flex con scroll:** la regla salió de un bug
  real: sin `shrink-0`, elegir un tab con más contenido comprimía y
  recortaba una tabla vecina en vez de activar el scroll del contenedor.
- **`th` sticky con `border-separate`:** el fix (separadores de fila en
  `<td>` en vez de `<tr>`, para que un borde no se pinte sobre el `th`
  sticky) nació en la tabla de Reposiciones (`ReposicionesTable`), que hoy
  es una lista de filas (`ReposicionesLista`) y ya no lo necesita; el modal
  "Tablas relacionadas" lo conserva.
- **Acciones del registro:** Desarmes, Lotes, Nivel/Tipo, Replicar, Cambia
  fases, Alta clientes e Intercambio vivían como fila de botones (y
  dropdown en tier 760px) en la pantalla de Consultas de interrupción;
  pasaron al grupo "Herramientas" del menú lateral el 2026-10-05.
- **Gap entre cards:** era `gap-4` fijo en todos los tiers; desde el
  2026-10-06 es `--cards-gap` (24px en pantallas altas, el mismo `gap-4` en
  los tiers compactos).
- **Variables de chrome:** en los tiers de 900px y 760px se definieron para
  dar exactamente los valores que ya tenía la app (las notebooks de 14" no
  vieron ningún cambio); solo las pantallas altas ganaron aire.
- **Header de card:** pasó por varias formas — header gris
  (`bg-gray-50`), `context` con "·", `size="compact"`, sin fondo ni
  divisor, y `tagAlign="end"` con el badge a la derecha — hasta la vigente:
  badge en línea, divisor siempre visible en las cards con secciones y
  derecha solo para acciones.
- **`CopyButton`:** medía `w-8 h-8` con `text-text-muted`; hoy usa
  `ICON_BTN_SM` y `text-icon`.
- **Hover destructivo:** usaba los rojos 50 y 200 de la paleta default de
  Tailwind; desde el 2026-10-06, `error-bg-subtle` / `error-border-subtle`
  con los mismos valores.
- **Estructura de archivos:** hasta el 2026-10-06 todo vivía en
  `src/App.tsx` (~8.700 líneas). Se partió en `components/ui/`,
  `components/layout/`, `features/`, `data/` y `lib/` sin cambiar
  comportamiento.
