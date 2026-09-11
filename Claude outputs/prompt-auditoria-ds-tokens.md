Necesito que hagas un RELEVAMIENTO, no una corrección. No cambies nada todavía — el objetivo es un reporte que le voy a llevar a otra persona antes de decidir qué se toca. Vamos a preparar `App.tsx`/`index.css` para entregarlo a un dev, así que necesito ver toda la deriva respecto al Design System antes de limpiarla.

Corré estas búsquedas sobre `src/App.tsx` (y `src/index.css` si aplica) y compilame los resultados en una lista, cada ítem con archivo:línea, el valor encontrado, y si podés inferirlo, el componente/pantalla al que pertenece:

## 1) Colores hardcodeados fuera de los tokens
Buscá cualquier hex (`#RRGGBB` o `#RGB`) en `App.tsx` que no sea parte de un `style={{...}}` ya documentado como excepción legítima (los tokens sólidos de error/warning/success no tienen clase Tailwind bare, así que ESOS `style` con hex son esperados — igual listalos, pero marcalos aparte de los que parecen accidentales).

## 2) Valores en píxeles sueltos en clases Tailwind arbitrarias
Buscá patrones tipo `w-[Npx]`, `h-[Npx]`, `p-[Npx]`, `m-[Npx]`, `gap-[Npx]`, `text-[Npx]` en `App.tsx`. Ya sé que hay un par de excepciones documentadas a propósito (Nivel `w-[88px]`, Fase `w-[84px]` en Card A) — listalas igual, pero separalas de cualquier otra que encuentres y que no recuerde haber pedido a propósito.

## 3) Todos los `style={{...}}` inline
Listalos todos con qué propiedad setean. Quiero ver cuántos son tokens sólidos legítimos (error/warning/success sin clase bare) vs. cuántos son valores calculados en JS vs. cuántos son simplemente hex/px que podrían haber sido una clase del DS.

## 4) Implementaciones distintas para el mismo tipo de componente
Buscá `<select`, `AbmCombobox`, y cualquier botón/div que actúe como selector o dropdown. Quiero un conteo: ¿cuántas combinaciones de clases DISTINTAS existen hoy para lo que visualmente debería ser "la familia dropdown"? (esto es insumo directo para el fix de unificación de estilo que ya está en curso, no lo toques todavía, solo contalo).

## 5) `--spacing`/`--text-*` duplicados fuera de `index.css`
Confirmame que las únicas definiciones/overrides de `--spacing` y `--text-*` viven en los dos bloques `@media (max-height: 900px)` / `(max-height: 760px)` de `index.css`, y que no hay un override suelto de esos mismos tokens metido en un `style` o en otro media query dentro de `App.tsx`. Si encontrás alguno, listalo.

## 6) Comentarios/marcadores viejos
Buscá `TODO`, `FIXME`, `HACK`, `XXX` en `App.tsx` — listá los que queden, puede haber alguno de rondas anteriores que ya no aplica.

No corrijas nada de esto todavía. Pasame la lista completa (aunque sea larga) tal cual la encuentres, agrupada por los 6 puntos, para que la revisemos antes de decidir qué se limpia y cómo.
