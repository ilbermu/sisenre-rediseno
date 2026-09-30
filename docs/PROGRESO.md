# PROGRESO.md

Bitácora de sesiones de trabajo sobre `src/App.tsx` (SISENRE_REDISEÑO). Cada
entrada es un cierre de jornada: qué se hizo, qué queda pendiente y cómo
retomar. Fuente de verdad de patrones de UI: `DESIGN_SYSTEM.md`.

## 2026-09-23

### Qué se hizo

- **Card "Reposiciones" (CDS4, Modificar interrupción)**: la tabla (Tabla 4)
  suma columnas `Fase`, `Equipo` y `Usuarios BT` a las ya existentes
  (`ReposicionesTable`, `src/App.tsx`). La franja con la interrupción
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

- **Botón "Copiar datos de la reposición"** (`src/App.tsx:3505`,
  `handleCopiarDatosReposicion`): handler intencionalmente vacío, con
  `// TODO: definir contenido y formato del copiado (pendiente de
  definición)` en `src/App.tsx:3504`. No simula feedback de "copiado" a
  propósito (ver `DESIGN_SYSTEM.md`, sección `CopyButton`) hasta que se
  defina qué copia y en qué formato.
- **Choque de nombre "Fase"**: la columna `"Fase"` de las Tablas 5/6/9
  (`src/App.tsx:3111`, `3119`, `3133`, junto al comentario de aviso en
  `3092`-`3093`) hoy guarda el número de reposición, y choca semánticamente
  con "Fase" = fase eléctrica (R/S/T/RS/RT/ST/RST), que es el sentido que
  tiene la columna homónima de la Tabla 4 (`3097`) y el chip `MetaChip
  label="Fase"` del modal. Falta decidir un nombre sin ambigüedad para la
  columna de Tablas 5/6/9 (ej. "Reposición" en vez de "Fase") y aplicarlo.
- **Otros `TODO` encontrados en el código** (búsqueda de `// TODO` en
  `src/App.tsx`):
  - `src/App.tsx:3504` — el del botón de copiar, ya detallado arriba.
  - `src/App.tsx:6343` (`handleConfirmarModificar`) — `config.rows` es mock
    derivado de la configuración, todavía no hay persistencia real del
    cambio ni de la nota de modificación (mismo caso pendiente que
    "Borrar"); por ahora el flujo solo cierra el modal.

### Cómo levantar el proyecto en otra máquina

```
pnpm install
pnpm dev        # sirve en el puerto 8443 (PORT env var lo puede sobreescribir)
```

Login del prototipo (`src/App.tsx`, ~línea 2147): usuario `rdellamagiora`,
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

- **Botón "Copiar datos de la reposición"** (`src/App.tsx:4418`,
  `handleCopiarDatosReposicion`, `TODO` en `4417`): sigue sin copiar nada,
  pero su aria-label promete hacerlo. Definir qué copia o sacarlo.
- **Placeholders de Tablas relacionadas** (`src/App.tsx:3476`, `3486`,
  `3495`, `3504`): ninguno nombra todas sus columnas buscables, porque la
  regla "todo lo no filtrable es buscable" mete Consumo, Potencia y (en
  Tabla 8) Fecha en el buscador. Evaluar `searchCols` explícito por tab.
- **Tiles de Tablas relacionadas en 0** (`RelacionadaChip`,
  `src/App.tsx:3785`): al ser `<div>` ya no abren el modal en ese tab (donde
  está "Ir a CDS… a insertar"); si todos están en 0, no hay forma de abrir
  el modal.
- **Choque de nombre "Fase"**: sigue abierto. La columna "Fase" de las
  Tablas 5/6/9 (`src/App.tsx:3470`, `3484`, `3502`) guarda el número de
  reposición; en la Tabla 4 (`3454`) y en la barra de contexto del modal,
  "Fase" es la fase eléctrica.
- **Desfase de 4px**: `CardHeader` y el body de Reposiciones usan `px-5`;
  el toolbar y la tabla de Interrupciones y del ABM, `px-4`/`mx-4`.
- **Sin probar en el navegador**: tier ≤760px (incluido el header
  compacto), navegación con Tab/Shift+Tab por toolbar y filtros, que cada
  tile abra su tab, Enter sobre la card de Reclamos y la barra de contexto
  del modal.
- **Código sin uso** (preexistente): `DataTile` y
  `CompactSelectionActionBar` (aparecen con `tsc --noUnusedLocals`).
- `src/App.tsx:7383` (`handleConfirmarModificar`): sin persistencia real,
  igual que en la entrada anterior.

### Cómo levantar el proyecto

Sin cambios (ver entrada del 2026-09-23). Login del prototipo:
`src/App.tsx:2488` (`LoginScreen`).
