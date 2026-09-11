Esta ronda unifica la familia "dropdown de valor" en dos capas: el trigger cerrado y el panel que se abre. Ya no hace falta que audites nada más — las decisiones están tomadas, aplicá directo.

## Capa 1 — Trigger cerrado

Convergé estos 3 en el chrome de `MOD_SELECT_CLS` (h-8, borde `border-gray-400`, `rounded-sm`, fondo blanco, `text-body-sm`):
1. Select nativo — ya usa `MOD_SELECT_CLS`, sin cambios.
2. `AbmCombobox` — ya reusa `MOD_SELECT_CLS` tras la limpieza anterior, confirmá que el botón-trigger (antes de abrir el panel) queda visualmente idéntico a un `<select>` nativo (mismo alto, mismo borde, mismo padding). Si hay algo que lo hace ver distinto (ej. el ícono de lupa ocupando espacio que el select no tiene), ajustalo para que la altura y el borde coincidan exacto.
3. Selector mes/año del Cronograma (línea ~2442) — pasa de `h-7` a `h-8`, y su padding/borde al mismo patrón de `MOD_SELECT_CLS`.

`DateTimeField` (línea ~796) — hoy usa el chrome de `MOD_FIELD_CLS` (estilo input). Cambialo al chrome de `MOD_SELECT_CLS` (mismo alto/borde/radius que los de arriba) — el contenido interno (texto de fecha + ícono de calendario) no cambia, solo el chrome del contenedor.

**No toques**: `PeriodSelector`, `AbmTableSelector` (son la familia de botones `BTN_MD`, con su propio `rounded-md` ya documentado — no son parte de esta familia), `MiniCaptionDropdown` (variante compacta a propósito, dentro del calendario chico), `UserMenu` (variante transparente a propósito, fila de nav del sidebar).

## Capa 2 — Panel abierto (select nativo vs. AbmCombobox)

El `<select>` nativo no puede tener un panel custom sin convertirlo en un componente controlado por JS. Para los selects nativos que hoy tienen POCAS opciones (Tarifa, Nivel, Fase, y similares — listalos todos los que encuentres) convertilos en el mismo mecanismo de `AbmCombobox` pero SIN el input de búsqueda arriba (mismo panel flotante, misma lista de opciones, mismo hover/selected, solo que no hay caja de texto para filtrar). Así los dos comparten un solo chrome de panel: mismo borde/radius/sombra del panel flotante, mismo alto de fila, mismo padding, misma tipografía, mismo estado hover y seleccionado. El único elemento que puede diferir es la presencia del input de búsqueda arriba.

## Capa 3 — Modal para listas largas

Para `AbmCombobox` con listas largas (confirmado: Localidad, 50+ opciones cascadeando de Partido — revisá si Partido u otros como "Descripción equipo operado" en CDS2 también superan ~15-20 opciones): al hacer click, en vez de abrir el panel inline, abrí un modal centrado con backdrop, mismo buscador/lista/lógica de filtro que ya tiene `AbmCombobox`, solo cambia el contenedor de "panel posicionado junto al input" a "modal centrado". Cierra con selección, click afuera o Escape. El resto (selects convertidos de la Capa 2, y cualquier `AbmCombobox` de lista corta) se queda con el panel inline + smart-positioning que ya existe (abre abajo, flipea arriba si no hay espacio — mecanismo ya unificado, no lo toques).

---

Aplicá las 3 capas, build limpio, capturá: (a) un select-convertido (ej. Tarifa) y `AbmCombobox` de lista corta lado a lado mostrando el mismo chrome de trigger y de panel, (b) `DateTimeField` con el nuevo chrome, (c) Localidad abriendo el modal. Confirmame consola sin errores antes de que pruebe.
