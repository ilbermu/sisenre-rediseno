@AGENTS.md

# Rutinas de jornada

## "Buen día" → sincronizar desde el remoto

Cuando el usuario escriba "buen día" (o "buen dia", "buenos días"), antes de cualquier otra cosa:

1. `git fetch` y `git status` para ver la rama actual y si está atrasada o adelantada respecto del remoto.
2. Si hay commits nuevos en el remoto → comparar los archivos que llegan (`git diff --stat HEAD origin/main`) con los cambios locales sin commitear.
   - Si no hay cambios locales, o no se superponen con los archivos entrantes → `git pull --ff-only`.
3. Si algún cambio local toca un archivo que también viene del remoto, o la rama divergió → **no** hacer pull; explicar la situación y preguntar cómo seguir.
4. Informar un resumen breve: rama, commits bajados (hash + mensaje), archivos tocados, y si quedó algo pendiente.

## "Listo por hoy" → subir el trabajo al remoto

Cuando el usuario escriba "listo por hoy":

1. `git status` y `git diff` para revisar qué cambió.
2. Si hay cambios → stagear los archivos del proyecto (nunca secretos, `.env` ni archivos temporales) y commitear con un mensaje descriptivo en español, siguiendo el estilo de los commits existentes.
3. `git push` (si la rama no tiene upstream, `git push -u origin <rama>`).
4. Si el push es rechazado porque el remoto avanzó → `git pull --rebase`, y si hay conflictos, frenar y preguntar.
5. Informar un resumen: commits creados, qué se subió, y estado final (working tree limpio y sincronizado).
