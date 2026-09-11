Dos cosas, transversales a toda la app (no solo tier 2):

## 1) Unificar el estilo visual entre `<select>` nativo y `AbmCombobox`

Hoy conviven dos estéticas distintas para elegir un valor: el `<select>` nativo (envuelto en `SelectWrap`/`MOD_SELECT_CLS`, ej. "Tarifa") con header oscuro "Seleccione" y filas planas, y `AbmCombobox` (ej. "Localidad"/"Partido") con input de búsqueda arriba, lista con fila resaltada, otro tratamiento de borde/sombra. Tienen que verse como la misma familia de componente, tenga o no buscador.

Definí UN solo "chrome" visual para el panel desplegable y aplicalo a los dos:
- Mismo borde, radio y sombra del panel flotante.
- Mismo alto de fila, padding, tipografía.
- Mismo estado hover y mismo estado seleccionado/activo (color de fondo, ni el `<select>` nativo ni `AbmCombobox` deberían tener un criterio propio distinto).
- Mismo tratamiento de header: si `AbmCombobox` tiene un header/label arriba del buscador, definí si el `<select>` nativo lo replica o lo omite a propósito (pero que sea una decisión consciente, no que hoy sea "oscuro" en uno y no exista en el otro).
- El único elemento que puede diferir entre ambos es la presencia del input de búsqueda arriba (eso es funcional, no estético) — todo lo demás debe salir de un mismo set de clases/tokens reutilizado por los dos componentes.

## 2) Modal picker — SOLO para listas largas, el resto queda inline

Ya evaluamos la opción de modal para todos los campos con buscador vs. ninguno, y la decisión es: aplicarlo únicamente a los combobox con listas largas (Localidad confirmado — 50+ opciones cascadeando de Partido). El resto (`<select>` nativo de pocas opciones tipo Tarifa/Nivel/Fase, y cualquier `AbmCombobox` con lista corta) se queda con el panel inline de siempre, solo con el estilo unificado del punto 1.

Criterio para decidir qué campos pasan a modal: cualquier `AbmCombobox` cuya lista de opciones supere ~15-20 ítems en uso normal. Confirmado: Localidad. Revisá si "Partido" u otros combobox de la app (ej. "Descripción equipo operado" en CDS2) también superan ese umbral — si sí, aplicales el mismo tratamiento; si tienen pocas opciones, déjalos inline.

Para los campos que sí pasan a modal:
- Al hacer click en el campo, en vez de abrir el panel inline (que hoy puede tapar otros campos o necesitar scroll), abrí un modal centrado sobre la pantalla (overlay con backdrop) con el mismo input de búsqueda y lista que ya tiene `AbmCombobox` — reusá toda la lógica de filtro/selección existente, solo cambia el contenedor de "panel posicionado junto al input" a "modal centrado".
- El modal cierra al seleccionar un valor, al hacer click afuera (backdrop) o con Escape.
- Mismo chrome visual definido en el punto 1 (borde, radio, tipografía, hover/seleccionado), adaptado al tamaño de modal.
- Esto de paso resuelve el tema de "dirección de apertura" para estos campos puntuales (un modal centrado no necesita flipear arriba/abajo).

No toques la lógica de smart-positioning (abre abajo, flipea arriba si no hay espacio) que ya se implementó para los combobox/selects que se quedan inline — esa sigue vigente para todo lo que no pase a modal.

Aplicá los 2, build limpio, capturá: un `<select>` nativo y un `AbmCombobox` inline lado a lado mostrando el mismo estilo (ej. Tarifa y Partido si Partido queda inline, o el que corresponda), y Localidad abriendo el modal. Confirmame consola sin errores antes de que pruebe.
