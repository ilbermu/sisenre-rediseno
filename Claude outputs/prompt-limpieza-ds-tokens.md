Basado en el relevamiento que ya hiciste (gracias, quedó muy completo — la causa raíz de `selectCls`/`MOD_SELECT_CLS` e `inputCls`/`MOD_FIELD_CLS` duplicados fue el hallazgo más importante). Esta ronda es solo lo mecánico/de bajo riesgo, ya decidido — no toques la parte visual de los 9 triggers de dropdown todavía, eso va en un paso aparte una vez que esto esté aplicado y confirmado limpio.

## 1) Unificar `selectCls`/`MOD_SELECT_CLS` y `inputCls`/`MOD_FIELD_CLS`

Son pares casi idénticos definidos en dos puntos distintos del archivo (línea ~477/482 vs ~2968/2972). Dejá UNA sola definición de cada uno (el que sea más completo/reciente) y actualizá todos los call-sites que hoy usan la otra variante para que apunten a la única que queda. Esto es la base para el fix de estilo de dropdown que viene después — necesitamos que exista una sola fuente de verdad antes de tocar el estilo visual.

## 2) `fontFamily` inline → clases `font-mono`/`font-sans`

`index.css` ya define `--font-mono` y `--font-sans` en `@theme`, lo que genera automáticamente las clases `font-mono`/`font-sans` en Tailwind v4. Reemplazá:
- Todo `style={{ fontFamily: "'JetBrains Mono', monospace" }}` (y combinaciones que solo agregan eso más otra propiedad) por `className="font-mono"` — si el `style` tenía además `fontSize`/`color` vía `var(--...)`, esos se quedan, solo sale el `fontFamily`.
- Todo `style={{ fontFamily: "'Inter', sans-serif" }}` (o `system-ui, sans-serif`) por `className="font-sans"`, o simplemente sacá la propiedad si el elemento ya hereda `font-sans` del body/contenedor padre (chequealo antes de asumir).

## 3) Bug del ternario muerto

`App.tsx:2384` (`SelectScreen`, Clásico/Nuevo): `backgroundColor: isHov ? "#fff" : "#fff"` — las dos ramas son iguales, no puede ser intencional. Mirá el contexto de esa card: probablemente la rama `isHov` debería usar un tinte sutil (`var(--color-gray-50)` o `var(--color-primary-tint)`, lo que visualmente tenga más sentido con el resto del hover de esa pantalla) en vez del mismo blanco que el estado normal.

## 4) `.sidebar-item-tooltip` (index.css) sin tokens

Reemplazá `#1E3560` por el gris oscuro más cercano del theme (`var(--color-gray-800)`), `rgba(255,255,255,0.12)` por lo mismo pero con la opacidad (o dejalo si no hay equivalente limpio), y los px de padding/radius por los tokens correspondientes (`var(--radius-sm)` para el `border-radius: 4px`). El blanco (`#fff`) del texto puede quedar como está — no hace falta tokenizar blanco puro.

## 5) Nuevos tokens para el par de colores de chip repetidos

`#B9D2FB` se repite 3 veces idéntico (borde de chip/badge) y `#D9E9FF` una vez (hover del botón cerrar del chip). Agregalos a `@theme` en `index.css` como:
```
--color-chip-border: #B9D2FB;
--color-chip-border-hover: #D9E9FF;
```
Y reemplazá los `border-[#B9D2FB]` por `border-chip-border`, y `hover:bg-[#D9E9FF]` por `hover:bg-chip-border-hover`, en las 4 líneas donde aparecen (2541, 3781, 3787, 4057).

## 6) `rounded-[7px]` → `rounded-md`

Confirmado: bajalo a `rounded-md` (6px, el token que ya existe) en las 7 apariciones. La diferencia de 1px no se nota.

## 7) Header del sidebar (logo + colapsar) no se achica en tier 2

`App.tsx:6828` usa `style={{ minHeight: 60, ... }}` hardcodeado. Los otros dos headers de la app (línea ~5821 y ~6995) usan `style={{ minHeight: "var(--header-min-height, 60px)", ... }}`, que en tier 2 (`max-height: 760px`) baja a 44px. Sumá esta fila al mismo mecanismo: que use `var(--header-min-height, 60px)` en vez del `60` fijo, así se achica junto con el resto en 14".

## 8) `zoom: 0.68` → `transform: scale(0.68)`

`App.tsx:6838`, el wrapper del logo en el sidebar expandido. `zoom` no es una propiedad CSS estándar. Reemplazalo por `transform: "scale(0.68)"` manteniendo el `transformOrigin: "left center"` que ya tiene — visualmente debería quedar idéntico.

---

Dejamos afuera de esta ronda (van al documento de referencia del DS más adelante, no requieren código): los `text-[Npx]` que casi coinciden con `--text-body`/`--text-label` (14/16/9px), los anchos/altos mágicos repetidos en modales (160/220/240/26/60/64px), la inconsistencia de `maxWidth` entre modales (280 a 900px), y el sistema paralelo de tokens `--login-*` de LoginScreen (ya documentado y aceptado como excepción).

Aplicá los 8 puntos, build limpio, confirmame consola sin errores antes de que pruebe. No hace falta captura para esto — es limpieza estructural, no debería cambiarse nada visualmente salvo el radius (7→6px, imperceptible) y el hover roto del punto 3 (ese sí cambia, capturalo si querés que lo vea).
