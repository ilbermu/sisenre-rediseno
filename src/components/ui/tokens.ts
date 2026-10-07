// Tamaños de ícono (lucide) — ver DESIGN_SYSTEM.md, "Íconos". strokeWidth
// 1.5 en todos, salvo xl (estado vacío), que usa 1.25.
export const ICON = { xs: 12, sm: 14, md: 16, xl: 40 } as const;

// Foco del sistema (ver DESIGN_SYSTEM.md, "Foco"):
//   FOCUS_RING        → anillo de un control (botón, trigger, link).
//   FOCUS_RING_INSET  → mismo anillo hacia adentro, para elementos que tocan
//                       el borde de su contenedor (filas, secciones, listas
//                       navegables): el overflow del padre no lo recorta.
//   FIELD_FOCUS       → estado de foco de un CAMPO (input, select, textarea):
//                       borde + halo, distinto del anillo de un control.
export const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2";
export const FOCUS_RING_INSET = "focus-visible:outline-2 focus-visible:outline-focus focus-visible:-outline-offset-2";
// Controles con <input> oculto (sr-only, checkbox/radio): el input lleva
// `peer` y su representación visible (la caja o el círculo) recibe el mismo
// anillo que FOCUS_RING cuando el input tiene foco de teclado.
export const PEER_FOCUS_RING = "peer-focus-visible:outline-2 peer-focus-visible:outline-focus peer-focus-visible:outline-offset-2";
export const FIELD_FOCUS = "focus:outline-none focus:border-focus focus:ring-2 focus:ring-focus/10";

// Botones de ícono cuadrados — alto/ancho de control, nunca de la escala
// --spacing. Mismo token que los controles con los que comparten fila; sueltos,
// sm. xs (24px fijo en todos los tiers, mínimo WCAG 2.5.8) para controles
// dentro de componentes densos (calendario, flechas de orden, cerrar flyout).
export const ICON_BTN_XS = "size-(--control-xs)";
export const ICON_BTN_SM = "size-(--control-sm)";
export const ICON_BTN_MD = "size-(--control-md)";

// ─── Sistema de tamaños de botón ────────────────────────────────────────────
// Los 2 únicos tamaños de botón de toda la app — ver documentación completa
// en index.css, junto a los tokens que los anclan (--radius-sm/md,
// text-label/text-body + font-medium). No hay un componente <Button/> compartido (la app
// es un solo archivo grande con botones ad hoc por instancia), así que la
// forma de reusarlos es esta: BTN_SM/BTN_MD (o los helpers que ya los
// consumen, actionBtnCls/ghostBtnCls) definen tamaño/padding/tipografía/
// radius; cada botón solo suma por afuera su propio color/variante/hover.
// Nunca estilar un botón nuevo escribiendo su propio alto/radius/tamaño de
// texto a mano — eso es exactamente lo que generó las inconsistencias
// (ghost vs outline, headers de tabla desproporcionados) que esto corrige.
//   sm — acciones inline de fila (Modificar/Borrar en tablas ABM) y
//        toggles/chips (BT/MT/AT, Interno/Externo, etc.)
//   md — acciones de panel (Buscar, Limpiar, Cancelar, Guardar, Insertar,
//        Exportar, Auditoría) y botones dropdown-trigger (selector de
//        período, "Cambiar de tabla")
// Alto: --control-sm / --control-md (index.css), en px fijos por tier — no
// dependen de --spacing, así nunca bajan de 24px (WCAG 2.5.8). Los campos
// que comparten fila con un botón md usan el mismo token.
export const BTN_SM = "h-(--control-sm) px-2.5 rounded-sm text-label";
export const BTN_MD = "h-(--control-md) px-4 rounded-sm text-body font-medium";
// Segmented (ButtonSelectGroup) en filas con campos y botones md: alto de campo.
export const BTN_SEG_MD = "h-(--control-md) px-2.5 rounded-sm text-label";

export type ActionItem = {
  label: string;
  onClick?: () => void;
  variant?: "neutral" | "destructive";
  disabled?: boolean;
};

export function actionBtnCls(variant?: ActionItem["variant"]) {
  if (variant === "destructive") {
    return `${BTN_MD} border border-error-border bg-surface text-error hover:text-error-text-strong hover:bg-error-bg-subtle hover:border-error-border-hover transition-[color,background-color,border-color,transform] active:scale-[0.98] whitespace-nowrap`;
  }
  return `${BTN_MD} border border-border-strong bg-surface text-text hover:bg-primary-tint hover:border-primary hover:text-secondary transition-[color,background-color,border-color,transform] active:scale-[0.98] whitespace-nowrap`;
}

// Variante ghost — acciones de tabla o de registro (barras de selección,
// toolbars de tabla, filas): siempre tamaño sm (BTN_SM), sin borde visible
// ni fondo en reposo, para no competir con las acciones de página (md, con
// borde). `border-transparent` mantiene el mismo alto que un botón con
// borde. Hover y activo: relleno neutro (fill-muted) o error suave en la
// destructiva; sin escala. Ver DESIGN_SYSTEM.md, "Botones".
export function ghostBtnCls(tone: "neutral" | "destructive") {
  const base = `${BTN_SM} border border-transparent bg-transparent inline-flex items-center justify-center whitespace-nowrap transition-colors duration-(--duration-base) ${FOCUS_RING} disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none`;
  if (tone === "destructive") {
    return `${base} text-error hover:bg-error-bg-subtle hover:text-error-text-strong active:bg-error-bg-subtle active:text-error-text-strong`;
  }
  return `${base} text-text hover:bg-fill-muted active:bg-fill-muted`;
}

const modalFilledBtnBase =
  "h-(--control-md) px-5 rounded-sm text-body font-medium text-white transition-[color,background-color,border-color,transform] duration-(--duration-base) active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none";
export const modalPrimaryBtnCls = modalFilledBtnBase + " bg-primary-strong hover:bg-primary-hover";
export const modalDestructiveBtnCls = modalFilledBtnBase + " bg-error hover:bg-error-text-strong";
export const modalNeutralBtnCls =
  "h-(--control-md) px-5 rounded-sm text-body font-medium border border-border-strong bg-surface text-text hover:bg-primary-tint hover:border-primary hover:text-secondary transition-[color,background-color,border-color,transform] duration-(--duration-base) active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none";

// Clases únicas para todo <input>/<select> de texto simple de la app —
// Modificar, Alta/Búsqueda ABM y ValuePicker comparten estas dos (antes
// existían por separado como inputCls/selectCls, ya unificadas acá).
export const MOD_FIELD_CLS =
  "w-full h-(--control-md) px-2.5 text-body bg-surface border border-border-strong rounded-sm text-text " +
  "placeholder:text-text-muted " + FIELD_FOCUS + " transition-[border-color,box-shadow,background-color] duration-(--duration-base)";

export const MOD_SELECT_CLS =
  "h-(--control-md) px-2.5 pr-7 text-body bg-surface border border-border-strong rounded-sm text-text appearance-none " +
  "cursor-pointer " + FIELD_FOCUS + " transition-[border-color,box-shadow,background-color] duration-(--duration-base) shrink-0";

// Los 4 estados visuales que puede tener un campo de camposBusqueda, sin
// excepción por tabla ni por tipo de campo (select/toggle/fecha/texto,
// readonly de config incluidos):
//   - "empty": formulario recién abierto, sin búsqueda ni selección — se ve
//     como un input normal (fondo blanco, borde normal) con placeholder de
//     ejemplo. Sin controlar (Buscar/Limpiar no leen ni resetean lo tipeado).
//   - "enabled": se puede escribir con un valor real detrás — tipeando en
//     buscar, o en alta, o en modificar sobre un campo no bloqueado. Mismo
//     look que "empty", pero controlado (value/onChange reales).
//   - "placeholder": hay una fila seleccionada en Resultados en modo buscar
//     ("consultando") — muestra el dato real de esa fila, legible (buen
//     contraste), no editable. Es una vista de lectura, no una prohibición.
//   - "disabled": modo Modificar sobre un campo que la tabla marca como no
//     editable (readonly de config, o en camposReadonlyEnModificar) — el
//     clásico look atenuado, comunicando "esto no se puede tocar".
// "placeholder" y "disabled" comparten `disabled=true` en el input real,
// pero llevan clases distintas a propósito: no deben verse igual.
export type CampoEstado = "empty" | "enabled" | "placeholder" | "disabled";

// `!` (important) es necesario en ambas: MOD_FIELD_CLS/MOD_SELECT_CLS ya traen
// bg-surface/text-text, y en el CSS compilado esas reglas quedan DESPUÉS
// de las de fill-subtle/fill-muted (orden interno de Tailwind, no el orden en que
// se concatenan los strings acá), así que sin !important terminan ganando
// igual y el campo se ve "habilitado" pese al atributo disabled.
export const ESTADO_CLASES: Record<CampoEstado, string> = {
  empty: "",
  enabled: "",
  // Legible: texto con contraste normal, apenas un tinte de fondo para
  // distinguirlo de un campo editable — nunca el gris apagado de disabled.
  placeholder: " !bg-fill-subtle !border-border !text-text",
  disabled: " !bg-fill-muted !border-border !text-text-faint",
};
