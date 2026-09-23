Dos ajustes al estado activo del sidebar, ambos ya charlados/decididos — aplicá directo.

## 1) Pill del ítem activo: de azul-tinte a azul secundario sólido y tenue

Hoy (`NavItem`, ~línea 371-377) el pill usa el MISMO tratamiento que la selección de datos en el resto de la app (`bg-primary-tint border border-primary`) — eso es justo lo que no queremos: la navegación tiene que leerse distinta de "esto está seleccionado en una lista/tabla".

Cambiá las clases del pill de:
```
className="absolute inset-0 rounded-sm bg-primary-tint border border-primary"
```
a:
```
className="absolute inset-0 rounded-sm bg-secondary/10"
```
(`--color-secondary` es el azul oscuro que ya existe en `index.css` línea 17, `#1D558C` — a 10% de opacidad da un relleno sólido pero apagado, sin necesitar borde. Si al verlo se siente muy débil o muy fuerte, es la única perilla que hay que tocar: probá `/8` o `/14` y quedate con lo que se vea mejor, sin volver a preguntarme por esto puntual.)

El texto del label ya usa `text-secondary` en el branch activo — dejalo, combina bien con el nuevo fondo.

**Mismo cambio en el ítem padre "Alta, Baja y Modificación"** (el `<button>` hecho a mano en la zona de ~línea 6756-6781, que NO usa `NavItem` — es aparte). Su estado activo hoy es:
```
${isAbmTableKey(screen)
  ? "border-primary bg-primary-tint text-secondary"
  : "border-transparent text-gray-700 hover:text-gray-800 hover:bg-gray-100"
}
```
Cambialo a:
```
${isAbmTableKey(screen)
  ? "border-transparent bg-secondary/10 text-secondary"
  : "border-transparent text-gray-700 hover:text-gray-800 hover:bg-gray-100"
}
```
(mismo color/opacidad que el pill de `NavItem`, para que todo el sidebar quede consistente — este botón no tiene el mecanismo de `layoutId`/Motion, es un fondo estático nomás, eso queda igual por ahora, no hace falta meterlo en la animación compartida.)

## 2) Ícono: outline → relleno cuando el ítem está activo

Afecta a los `NavItem` que sí tienen ícono (Inicio, Consultas de interrupción, los 5 de "Otros") y al `Pencil` del botón "Alta, Baja y Modificación" de arriba.

En `NavItem`, el ícono llega ya renderizado como prop (`icon={<Home size={15} strokeWidth={1.5} />}`, etc.) — para no tener que tocar cada lugar donde se llama a `NavItem`, clonalo con `React.cloneElement` agregándole `fill` según `active`. Reemplazá:
```tsx
{icon && <span className="shrink-0">{icon}</span>}
```
por:
```tsx
{icon && (
  <span className="shrink-0">
    {cloneElement(icon as React.ReactElement<any>, { fill: active ? "currentColor" : "none" })}
  </span>
)}
```
(vas a necesitar importar `cloneElement` de `react` junto a `useState`/`useRef`/`useEffect` en la línea 1.)

Para el botón "Alta, Baja y Modificación" (no pasa por `NavItem`), aplicá el mismo criterio directo sobre su propio ícono:
```tsx
<span className="shrink-0"><Pencil size={15} strokeWidth={1.5} fill={isAbmTableKey(screen) ? "currentColor" : "none"} /></span>
```

Probalo visualmente en los ~7 íconos afectados (Home, Search, FileText, Clipboard, Pencil, UserPlus, Shield) — la mayoría de los íconos de Lucide rellenan bien con este truco, pero si alguno se ve raro/desbalanceado al quedar sólido (por su forma particular), decime cuál puntualmente en vez de descartar el enfoque general.

## Verificación

Build limpio, sin errores de consola. Capturá el sidebar con al menos 2 ítems distintos activos (uno normal, uno de "Otros", y el estado con una Tabla del ABM seleccionada para ver el header padre) para confirmar color + ícono relleno.
