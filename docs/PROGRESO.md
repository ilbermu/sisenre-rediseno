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
