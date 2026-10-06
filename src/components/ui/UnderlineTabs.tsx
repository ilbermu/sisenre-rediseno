// Tabs subrayados — EL patrón de tabs de contenido de la app (elegir qué
// vista mostrar dentro de un mismo contenedor, ej. qué tabla se muestra en
// el modal "Tablas relacionadas" de Modificar interrupción). El
// contenedor respeta el padding horizontal del resto de ese contenedor
// (px-5, el mismo que el header y el resto del contenido del modal) — el
// borde inferior (border) sigue yendo de lado a lado igual: el padding
// mueve el contenido, no el borde. El borde activo (2px primary) se
// superpone a esa línea de base vía -mb-px. role="tablist"/"tab" +
// flechas izquierda/derecha para moverse entre opciones.
export default function UnderlineTabs({
  options,
  activeKey,
  onSelect,
  ariaLabel,
}: {
  options: { key: string; label: string }[];
  activeKey: string | null;
  onSelect: (key: string) => void;
  ariaLabel: string;
}) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const idx = options.findIndex((o) => o.key === activeKey);
    if (idx === -1) return;
    const next = e.key === "ArrowRight" ? (idx + 1) % options.length : (idx - 1 + options.length) % options.length;
    onSelect(options[next].key);
  }

  return (
    <div role="tablist" aria-label={ariaLabel} onKeyDown={handleKeyDown} className="flex border-b border-border shrink-0 px-5">
      {options.map((opt) => {
        const active = opt.key === activeKey;
        return (
          <button
            key={opt.key}
            type="button"
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onSelect(opt.key)}
            // px-4 es igual en TODOS los tabs (pareja) — el primero suma
            // first:-ml-4 para cancelar su propio pl-4 y que el texto quede
            // alineado al borde de contenido del contenedor (px-5), en la
            // misma vertical que el resto del contenido del modal.
            className={`h-10 min-w-24 px-4 first:-ml-4 text-body border-b-2 -mb-px transition-colors ${
              active ? "border-primary text-secondary font-medium" : "border-transparent text-text-muted hover:bg-fill-muted"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
