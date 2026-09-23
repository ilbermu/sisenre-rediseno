Revertir el efecto magnético del sidebar — no funcionó, fuera.

## 1) `NavItem` (App.tsx, ~línea 568-613)

Sacá el `<MagneticWrapper radius={50} strength={0.25} className="w-full">` que envuelve el `<button>` y su cierre — que `NavItem` vuelva a devolver el `<button>` directo, como raíz, sin wrapper.

## 2) Borrar `MagneticWrapper` (App.tsx, ~línea 495-553)

Toda la función, el comentario que la explica, y el listener global de `mousemove` que registra. Confirmá que no queda usada en ningún otro lado del archivo antes de borrarla (buscá `MagneticWrapper` — no debería aparecer más que en su propia definición, ya eliminada).

## 3) Import de `motion` (App.tsx, línea 5)

`import { motion, useMotionValue, useSpring } from "motion/react";` — confirmá que ninguno de los tres (`motion`, `useMotionValue`, `useSpring`) se usa en otro lado del archivo, y si no, borrá la línea completa.

## 4) Desinstalar la dependencia

Si quedó sin ningún uso en el proyecto: `pnpm remove motion`.

No toques nada de `lucide-react` ni el reemplazo de íconos — eso queda como está, el problema fue puntualmente el efecto magnético.

Build limpio, confirmame consola sin errores. No hace falta captura para esto.
