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
  (`src/features/consultas-interrupcion/ModificarContent.tsx`).
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
