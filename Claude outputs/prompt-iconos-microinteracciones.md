Esto es independiente del prompt de unificación de dropdowns que tenés pendiente — no toca esas mismas líneas, podés correr este antes, después o en paralelo, como te convenga.

## 1) Instalar las librerías

```
pnpm add lucide-react motion
```

(`motion` es el paquete nuevo de lo que era `framer-motion` — mismo proyecto, se renombró.)

## 2) Inventario de iconos actuales — solo relevamiento, no reemplaces nada todavía

Listame todos los componentes de ícono custom que hay hoy en `App.tsx` (los `Ico*` como `IcoZap`, `IcoDownload`, etc.) y cualquier SVG inline suelto que actúe como ícono. Para cada uno, decime si existe un equivalente directo y obvio en `lucide-react` (por nombre/forma — ej. `IcoZap` → `Zap`) o si no tiene un match claro. Pasame la lista antes de reemplazar nada — los que tengan match obvio los reemplazamos directo, los ambiguos los vemos juntos antes de decidir.

## 3) Componente `MagneticWrapper` reutilizable

Usando `motion`, armá un componente genérico que envuelva cualquier elemento interactivo y le dé el efecto magnético: al mover el mouse cerca (dentro de un radio configurable, arrancá con ~40-60px de margen alrededor del elemento), el elemento se desplaza levemente siguiendo la posición del cursor; al salir el mouse, vuelve a su posición original. Usá `useMotionValue` + `useSpring` (no `quickTo` de GSAP, no lo estamos usando) con un feel suave/fluido — arrancá con algo como `stiffness: 150, damping: 15` y ajustamos a ojo si no se siente bien. Que el radio de atracción y la intensidad del desplazamiento sean props configurables, no hardcodeadas, porque lo vamos a aplicar en más de un lugar más adelante.

## 4) Aplicarlo al selector de menú del sidebar

Envolvé los ítems de navegación del sidebar (`NavItem` — los de "Alta, Baja y Modificación", "Otros", e "Inicio") con el `MagneticWrapper`. Importante: que no rompa ni pelee con el comportamiento que ya tienen (estado activo/seleccionado, el acordeón de tier 2, el tooltip que aparece cuando el sidebar está colapsado) — el magnetismo es un extra visual sobre el hover, no debería interferir con el click ni con el estado seleccionado.

No toques nada de la unificación de dropdowns pendiente ni reemplaces iconos fuera del inventario del punto 2 todavía.

Aplicá esto, build limpio, pasame primero el inventario del punto 2 antes de tocar código de reemplazo de iconos — para el `MagneticWrapper` sí podés aplicarlo directo al sidebar y capturar/grabar cómo se ve (un gif o video corto del hover sobre los ítems del menú sería ideal para que lo vea sin tener que levantar el server yo). Confirmame consola sin errores antes de que pruebe.
