Bug real en tier 2 (`max-height: 760px`), pantalla de login: la card blanca queda desproporcionadamente alta, llegando casi al borde superior de la pantalla.

## Causa

`--login-top-offset` (en `index.css`, bloque `@media (max-height: 760px)`) hoy vale `calc(8vh + 10px)`. Ese valor es el `paddingTop` del contenedor que envuelve la card (`App.tsx`, `LoginScreen`, el `<div className="relative flex-1 flex flex-col" style={{ paddingTop: ... }}>`), y la card en sí está en `flex-1 min-h-0` — se estira para ocupar TODO lo que quede debajo de ese offset. Como el offset quedó muy chico, la card se estira casi a pantalla completa, con mucho espacio vacío adentro (el contenido ya está compactado, pero el "Spacer" `flex-1` dentro del form empuja el footer al fondo de una card gigante).

## Fix

Subí `--login-top-offset` en tier 2 a un valor que deje un margen superior proporcionado (algo visualmente parecido a cómo se ve en tamaño normal, no necesariamente los mismos vh pero en ese espíritu — probá algo como `calc(16vh + 10px)` como punto de partida). NO toques el mecanismo de `flex-1`/Spacer — sigue siendo necesario para que el footer quede al fondo de la card, sea cual sea su alto final.

Importante: esto no puede volver a romper lo que se arregló en la ronda anterior (el botón "Confirmar" cortado/pegado al borde inferior). Levantá el server, redimensioná la ventana del navegador a ~730-750px de alto (el rango real de tier 2), y ajustá el valor a ojo hasta que la card se vea proporcionada (margen visible arriba, no tocando el borde superior) Y el botón Confirmar + el footer sigan completamente visibles sin scroll. Iterá el valor las veces que haga falta antes de darlo por bueno — no me lo mandes hasta que lo hayas visto bien en el navegador.

Build limpio, capturá el resultado final (ventana en ~730-750px de alto), confirmame consola sin errores antes de que pruebe.
