Reemplazo del highlight estático del ítem activo del sidebar por un "pill" animado que se desliza/morphea entre ítems — el mismo mecanismo que usa Vaquita (otro proyecto, confirmado por inspección de su DOM en vivo) tanto en su menú lateral como en su toggle USD/ARS.

## Contexto (por qué este prompt, no el anterior)

Ojo: al revisar el archivo veo que `prompt-revertir-magnetic.md` (el que pedía sacar el `MagneticWrapper`) **todavía no se aplicó** — `MagneticWrapper`, el import de `motion/react` con `useMotionValue`/`useSpring`, y su uso envolviendo `NavItem` (línea ~580) siguen ahí. Este prompt ya incluye ese revert como paso 1 — no hace falta correr el prompt viejo por separado, este lo reemplaza.

## 1) Sacar `MagneticWrapper` (igual que el prompt anterior)

- Borrar la función completa `MagneticWrapper` (~línea 495-553, incluyendo el comentario que la explica).
- En `NavItem` (~línea 568-613): sacar el `<MagneticWrapper radius={50} strength={0.25} className="w-full">` que envuelve el `<button>` y su cierre — que `NavItem` vuelva a devolver el `<button>` directo, como raíz.
- Del import de la línea 5 (`import { motion, useMotionValue, useSpring } from "motion/react";`): confirmá que `useMotionValue` y `useSpring` no se usan en ningún otro lado del archivo (deberían quedar sin uso después de borrar `MagneticWrapper`) y si es así, sacalos del import — pero **dejá `motion`**, lo vamos a usar en el paso 2. Si terminás con `import { motion } from "motion/react";` solo, es lo esperado.

## 2) El pill animado del ítem activo

Hoy el estado activo de `NavItem` es puramente estático — un cambio directo de clases en el propio `<button>`:
```
${active
  ? "border-primary bg-primary-tint text-secondary"
  : "border-transparent text-gray-700 hover:text-gray-800 hover:bg-gray-100"
}
```
Esto no cambia — el texto/ícono siguen coloreándose igual. Lo que se agrega es un elemento de fondo animado, separado, que es lo que en Vaquita se ve como que "el selector se desliza" al navegar.

Mecanismo (confirmado inspeccionando el DOM de Vaquita en vivo, no es una suposición): cada ítem es `position: relative`; SOLO el ítem activo en un momento dado renderiza, como primer hijo, un `motion.span` absoluto con un `layoutId` compartido entre todos los ítems del menú (ej. `"nav-active-pill"`). Motion detecta que ese `layoutId` "se mudó" de un botón a otro entre renders y anima la transición (posición + tamaño) automáticamente — no hace falta que vos calcules ninguna posición a mano.

Aplicá en `NavItem`:
- El `<button>` ya tiene `style={{ position: "relative" }}` — dejalo.
- Sacá `border-primary bg-primary-tint` de las clases del branch `active` (el color de fondo/borde ahora lo da el pill, no el botón) — dejá `text-secondary` en el texto.
- Como primer hijo del `<button>` (antes del ícono), agregá, solo cuando `active` es true:
```tsx
{active && (
  <motion.span
    layoutId="nav-active-pill"
    className="absolute inset-0 rounded-sm bg-primary-tint border border-primary"
    transition={{ type: "spring", stiffness: 500, damping: 40 }}
  />
)}
```
- El ícono y el resto del contenido (label, code, tooltip) tienen que quedar visualmente por encima del pill — envolvelos en un `<span className="relative z-10 flex items-center gap-2 ...">` (o el equivalente mínimo necesario) si no lo están ya, para que el pill (que es `absolute inset-0`, z-index natural del flujo) no los tape. Ajustá el layout interno lo mínimo necesario para lograr esto sin romper el `truncate` del label ni el ancho colapsado (`w-9` cuando `collapsed`).

No toques: el branch `!active` (hover sigue siendo `hover:bg-gray-100` de CSS puro, sin pill), el tooltip de sidebar colapsado, el acordeón de tier 2, el `boldLabel`, ni el chip de `code`.

## 3) Alcance — solo el sidebar por ahora

No lo apliques a ningún otro componente (`ButtonSelectGroup`, toggles de Origen/Tipo en Card A, etc.) todavía — si el resultado se ve bien lo vemos para esos casos después, por separado.

## 4) Verificación

Build limpio, sin errores de TypeScript ni de consola. Como es un cambio de movimiento (no se aprecia en una captura fija), levantá el server y grabá un gif/video corto navegando entre 3-4 ítems del sidebar (Inicio → Alta, Baja y Modificación → Otros, por ejemplo) para que se vea la transición — es la forma más rápida de confirmar que el pill se desliza en vez de aparecer/desaparecer de golpe. Probá también en sidebar colapsado (tier 2) para confirmar que el pill se ve bien en el botón cuadrado sin desbordar.
