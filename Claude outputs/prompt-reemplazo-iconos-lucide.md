Reemplazo real de los íconos custom por Lucide. Reviso el código y `lucide-react` ya está instalado (`package.json`, `^1.45.0`) pero no se usa en ningún lado de `App.tsx` — el prompt anterior (`prompt-iconos-microinteracciones.md`) instalaba la librería y pedía un inventario antes de reemplazar, pero el reemplazo en sí nunca se aplicó (por eso seguís viendo los mismos íconos de siempre). Este prompt ya resuelve el mapeo — no hace falta que me pases ninguna lista, aplicá directo.

## 1) Import

Al principio de `App.tsx` (cerca de la línea 5, junto al resto de imports), agregá:
```tsx
import {
  ChevronLeft, ChevronRight, ChevronDown,
  Zap, FileText, Pencil, Clipboard, UserPlus, Shield, Calendar, Search, X,
  Filter, Inbox, User, Settings, LogOut, Plus, Download, ChevronsUp, ChevronsDown, Home,
} from "lucide-react";
```

## 2) Borrar los componentes custom

Borrá TODAS las definiciones de íconos custom entre las líneas ~11-177 (el bloque completo bajo el comentario `// ─── Icons ───`): `ChevronLeft`, `ChevronRight`, `ChevronDown`, `IcoTable`, `IcoZap`, `IcoZapOff`, `IcoRefresh`, `IcoCpu`, `IcoUsers`, `IcoBuilding`, `IcoMsg`, `IcoFile`, `IcoEdit`, `IcoClipboard`, `IcoUserPlus`, `IcoShield`, `IcoCalendar`, `IcoSearch`, `IcoX`, `IcoFilter`, `IcoInbox`, `IcoUser`, `IcoSettings`, `IcoLogOut`, `IcoPlus`, `IcoDownload`, `IcoChevronsUp`, `IcoChevronsDown`, `IcoExternalLink`, `IcoHome`.

Ojo: `IcoTable`, `IcoZapOff`, `IcoRefresh`, `IcoCpu`, `IcoUsers`, `IcoBuilding`, `IcoMsg` e `IcoExternalLink` están definidos pero **no se usan en ningún lado del archivo** (confirmé con grep) — se borran directo, no hay que reemplazar sus usos porque no existen.

## 3) Reemplazar cada uso

Mapeo 1 a 1 (nombre viejo → componente Lucide), con el `size` igual al `width` que tenía el SVG original en cada caso, y `strokeWidth={1.5}` en todos (los íconos actuales son finos — Lucide por defecto usa 2, se ve más pesado; 1.5 es el punto medio más parecido al trazo actual):

| Uso viejo | Reemplazo |
|---|---|
| `<ChevronLeft />` | `<ChevronLeft size={16} strokeWidth={1.5} />` |
| `<ChevronRight />` | `<ChevronRight size={16} strokeWidth={1.5} />` |
| `<ChevronDown />` | `<ChevronDown size={16} strokeWidth={1.5} />` |
| `<IcoZap />` | `<Zap size={15} strokeWidth={1.5} />` |
| `<IcoFile />` | `<FileText size={15} strokeWidth={1.5} />` |
| `<IcoEdit />` | `<Pencil size={15} strokeWidth={1.5} />` |
| `<IcoClipboard />` | `<Clipboard size={15} strokeWidth={1.5} />` |
| `<IcoUserPlus />` | `<UserPlus size={15} strokeWidth={1.5} />` |
| `<IcoShield />` | `<Shield size={15} strokeWidth={1.5} />` |
| `<IcoCalendar />` | `<Calendar size={15} strokeWidth={1.5} />` |
| `<IcoSearch />` | `<Search size={15} strokeWidth={1.5} />` |
| `<IcoX />` | `<X size={14} strokeWidth={1.5} />` |
| `<IcoFilter />` | `<Filter size={14} strokeWidth={1.5} />` |
| `<IcoInbox />` (grande, ilustración de estado vacío) | `<Inbox size={44} strokeWidth={1.2} />` |
| `<IcoUser />` | `<User size={15} strokeWidth={1.5} />` |
| `<IcoSettings />` | `<Settings size={15} strokeWidth={1.5} />` |
| `<IcoLogOut />` | `<LogOut size={15} strokeWidth={1.5} />` |
| `<IcoPlus />` | `<Plus size={13} strokeWidth={1.6} />` |
| `<IcoDownload />` | `<Download size={15} strokeWidth={1.5} />` |
| `<IcoChevronsUp />` | `<ChevronsUp size={13} strokeWidth={1.6} />` |
| `<IcoChevronsDown />` | `<ChevronsDown size={13} strokeWidth={1.6} />` |
| `<IcoHome />` | `<Home size={15} strokeWidth={1.5} />` |

Hay un caso especial: línea ~6570, `icon: <span className="inline-flex rotate-180"><ChevronDown /></span>` (usa `ChevronDown` rotado 180° para simular una flecha hacia arriba, en vez de un ícono propio) — dejalo igual, solo actualizá el `<ChevronDown />` de adentro con el mismo reemplazo de la tabla.

Todos los usos actuales ya están envueltos en `<span>`/`<button>` con clases de color (`text-gray-400`, `text-secondary`, etc.) — no hace falta tocar nada de eso, los íconos de Lucide también heredan color via `currentColor` por defecto, igual que los SVG custom de antes.

## 4) No toques

El `motion` import de la línea 5 (ya lo estás usando para el pill del sidebar) — dejalo como está, esto es un cambio independiente. Tampoco toques nada del layout/spacing alrededor de cada ícono, solo el ícono en sí.

## 5) Verificación

Build limpio, sin errores de TypeScript ni de consola (especial atención a que ningún ícono viejo quede importado/usado sin definición). Capturá al menos: el sidebar completo (Inicio + Otros, para ver `Home`/`FileText`/`Clipboard`/`Pencil`/`UserPlus`/`Shield`), un modal con botón de cerrar (`X`), y una pantalla con el estado vacío (`Inbox` grande) — para confirmar que el tamaño/trazo se ve prolijo y no más pesado que antes.
