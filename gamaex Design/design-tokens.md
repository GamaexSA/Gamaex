# Design Tokens — Gamaex Admin

## Colores
```css
--bg:         #0A0F0D   /* fondo principal */
--bg2:        #111916   /* fondo cards y sidebar */
--bg3:        #1A2320   /* fondo inputs y elementos */
--gold:       #C9A84C   /* acento principal, logo, CTAs */
--gold-dim:   rgba(201,168,76,0.12)   /* fondo botones/badges dorados */
--green:      #2ECC71   /* precios compra, estado OK, activo */
--green-dim:  rgba(46,204,113,0.10)   /* fondo badges verdes */
--red:        #E74C3C   /* alertas, errores, inactivo */
--red-dim:    rgba(231,76,60,0.10)    /* fondo badges rojos */
--orange:     #F39C12   /* modo MANUAL, warnings */
--text:       #E8E6E1   /* texto principal */
--text-dim:   #8A8780   /* texto secundario, labels */
--text-faint: #4A5350   /* texto deshabilitado, hints */
--border:     #2A3330   /* bordes de cards e inputs */
```

## Tipografía
- **Interfaz:** DM Sans (300, 400, 500, 600, 700)
- **Números y precios:** DM Mono (400, 500)
- Tamaño base: 14px
- Line height: 1.5

## Espaciado
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 28-32px

## Bordes redondeados
- Badges/pills: 20px
- Botones: 8px
- Cards: 12px
- Modales: 16px
- Inputs: 8px

## Sombras
- Modal overlay: `rgba(0,0,0,0.7)`
- Toast: `0 4px 24px rgba(0,0,0,0.4)`

## Sidebar
- Ancho: 220px
- Fondo: `--bg2`
- Borde derecho: `1px solid --border`

## Estados de modo
| Modo   | Color fondo           | Color texto | Borde                   |
|--------|-----------------------|-------------|-------------------------|
| AUTO   | `--green-dim`         | `--green`   | `rgba(46,204,113,0.3)`  |
| MANUAL | `rgba(243,156,18,0.1)`| `--orange`  | `rgba(243,156,18,0.3)`  |

## Estados del sistema
| Estado   | Color   |
|----------|---------|
| ok       | `--green` |
| degraded | `--orange` |
| stale    | `--red` |
