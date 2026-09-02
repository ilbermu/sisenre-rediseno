Necesito que armes en Figma Make la pantalla "Interrupciones" (CDS2) de una aplicación interna web de escritorio, en español (Argentina). Generá SOLO la pantalla: un frame de 1440px de ancho, sin marco de laptop, sin barra de navegador, sin bisel ni ningún elemento decorativo alrededor — el fondo de página empieza en el borde del frame.

Tomá la estética de la imagen de referencia que adjunto (paleta navy/azul, tipografía, radios de borde, sombras suaves, estilo de inputs y botones) pero llevala a un nivel más profesional/pulido — pensá en sistemas de diseño enterprise tipo Carbon (IBM) o Fluent (Microsoft): buen uso de espaciado, iconografía consistente, estados de hover/focus/activo bien definidos, jerarquía tipográfica clara. No es un cambio de paleta, es subir la calidad de ejecución.

SIDEBAR (columna izquierda fija, ~260px expandido)
Recreá el menú original de la app punto por punto, no inventes nombres:

Header del sidebar:
- Logo "edenor" + indicador de estado (punto verde) como en la referencia
- Botón de colapsar/expandir (ícono tipo flecha o "<<"), que reduce el sidebar a una franja angosta solo con íconos (con tooltip al hacer hover) y lo vuelve a expandir al tocarlo de nuevo

Grupo "ABM" (mismo peso visual entre todos los ítems, ninguno se destaca más que otro salvo el activo):
- Avisos — CDS1
- Interrupciones — CDS2 (este es el ítem activo/seleccionado, con fondo o borde distintivo de estado — no de jerarquía)
- Interrupciones no computables — CDS3
- Reposiciones — CDS4
- Trafos repuestos — CDS5
- Clientes MT afectados — CDS6
- Instalaciones — CDS7
- Reclamos — CDS8
- Interrupciones x cliente — CDS9
- Interrupciones x cliente NM — CDS9

Debajo del grupo ABM, como ítem aparte y con tratamiento visual levemente distinto (no es una tabla ABM, es una acción/pantalla distinta):
- Modificar interrupción

Grupo "Otros" (separado del grupo ABM, con menor jerarquía visual — encabezado de grupo en mayúsculas chico, como en la referencia):
- Generación de txt
- Planilla consolidada
- Gestor de notas
- Inserta clientes
- Auditoría

Pie del sidebar (fijo abajo, separado del resto por una línea divisoria):
- Bloque de usuario: avatar circular con inicial, nombre de usuario, y un ícono de flecha/chevron que al clickear despliega un menú con opciones de cuenta (ej. "Mi perfil", "Configuración") y, al final, "Cerrar sesión" con tratamiento visual diferenciado (color de alerta o separado por una línea)

CONTENIDO PRINCIPAL — pantalla CDS2 (Interrupciones), layout de dos columnas

Barra superior (ancho completo): título "Interrupciones" + tag "CDS2" a la izquierda. A la derecha, un selector de período: muestra el período activo (ej. "Agosto 2026") con ícono de calendario y flecha, funciona como dropdown para cambiar de período — es un control persistente, visible en todas las pantallas de ABM, no solo en esta.

Debajo de la barra superior, dos columnas lado a lado que ocupan el resto de la altura disponible:

COLUMNA IZQUIERDA (~45% del ancho) — formulario de búsqueda, compacto:

IDENTIFICACIÓN
- Código de interrupción (input texto, placeholder "Ej: 00123456")
- Fecha (input tipo fecha, formato dd/mm/aaaa)
- Nivel de tensión (select, placeholder "Seleccione")

CLASIFICACIÓN
- Origen (select corto + input de descripción al lado)
- Tipo (select corto + input de descripción al lado)
- Fase eléctrica (select, placeholder "Seleccione")

DATOS DE RED
- Código de equipo operado (input texto)
- Descripción equipo operado (input texto)
- División red normal? (select, placeholder "Seleccione")
- Cadena eléctrica aguas arriba (input texto)
- Alimentador MT (input texto)
- CT MT/BT del equipo operado (input texto)

Organizá los campos simples en 2 columnas dentro de este formulario angosto, para no desperdiciar espacio vertical; los campos compuestos (select + descripción, como Origen y Tipo) ocupan la fila completa. Al final del formulario, dentro de la misma columna: los botones "Buscar" (primario, color sólido navy) y "Limpiar" (secundario, outline).

COLUMNA DERECHA (~55% del ancho) — resultados en formato tabla, con scroll vertical propio si el contenido supera la altura visible:
- Encabezado de tabla con columnas representativas de una interrupción (por ejemplo: Código, Fecha, Nivel de tensión, Estado — son un placeholder razonable, ajustalas si tenés el detalle real de qué muestra la tabla hoy)
- Estado vacío inicial: en vez de filas, un mensaje centrado dentro del área de la tabla — ícono simple + "No hay resultados para los filtros aplicados" + texto secundario "Completá los filtros de búsqueda y presioná Buscar"
- Cada fila de resultado (una vez que haya datos) tiene que mostrar una acción al hacer hover, para pasar a modificar esa interrupción

No uses un drawer, modal ni panel flotante para los resultados — el formulario y la tabla conviven en la misma vista, uno al lado del otro, sin superponerse ni apilarse verticalmente.

No agregues pantallas, campos ni menús que no estén en esta lista.