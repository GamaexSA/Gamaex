# Prompt para Claude Design — App de Administración Gamaex

Diseñá una app de administración web para **Gamaex**, una casa de cambio de divisas chilena. La app ya existe funcionalmente — el objetivo es rediseñar la interfaz para que sea más moderna, limpia y profesional, manteniendo la identidad de marca.

---

## Identidad de marca

- **Nombre:** Gamaex
- **Tipo de negocio:** Casa de cambio de divisas en Chile
- **Tono:** Serio, profesional, financiero. No minimalista extremo — tiene que transmitir confianza y precisión.
- **Paleta actual (mantener):**
  - Fondo principal: `#0A0F0D` (negro con tinte verde muy oscuro)
  - Fondo cards: `#111916`
  - Fondo elementos: `#1A2320`
  - Dorado (acento principal): `#C9A84C`
  - Verde (precios / positivo): `#2ECC71`
  - Rojo (alertas / negativo): `#E74C3C`
  - Naranja (manual / warning): `#F39C12`
  - Texto principal: `#E8E6E1`
  - Texto secundario: `#8A8780`
  - Bordes: `#2A3330`
- **Tipografía:** DM Sans (interfaz) + DM Mono (números y precios)

---

## Páginas a diseñar

### 1. Login
- Fondo oscuro, card centrada
- Logo "GAMAEX" en dorado
- Campos: Email + Contraseña
- Botón de acceso en dorado
- Mensaje de error inline

### 2. Dashboard
- Header con estado del sistema (badge: Sistema OK / Degradado / Sin sync) + botón "Sync ahora"
- 4 stat cards: Monedas activas, Auto, Manual, Cache TTL
- Tabla de tasas actuales con columnas: Divisa (emoji + nombre), Modo (AUTO/MANUAL badge), Compra CLP, Venta CLP, Actualizado

### 3. Monedas (página principal de gestión de precios)
- Tabla con columnas: Flag, Moneda, Modo, Precio Compra, Precio Venta, Alerta, Activa (toggle), Acciones (Editar + Sync)
- Modal de edición con:
  - Tabs: "AUTO + Márgenes" / "Manual"
  - Modo AUTO: inputs para margen compra y venta (en CLP)
  - Modo Manual: inputs para precio compra y precio venta fijos
  - Botón "Volver a AUTO" (si está en manual)
  - Botón guardar en dorado

### 4. Usuarios
- Tabla de administradores: Nombre, Email, Rol (SUPER_ADMIN / OPERATOR badge), Estado (Activo/Inactivo), Último acceso, Acciones
- Botón "Nuevo usuario" 
- Modal crear/editar usuario: nombre, email, contraseña, rol
- Botón reset contraseña por usuario

### 5. Auditoría
- Tabla de logs inmutables: Fecha, Acción, Entidad, Actor (email), Valores antes/después
- Filtros por: acción, entidad, actor
- Paginación

---

## Layout general

- **Sidebar izquierdo** (220px): Logo GAMAEX en dorado arriba, navegación con íconos, info del usuario logueado + rol + botón logout abajo
- **Contenido principal**: área scrolleable a la derecha del sidebar
- Nav items: Dashboard 📊, Monedas 💱, Usuarios 👥, Auditoría 📋
- Item activo: fondo dorado semitransparente + texto dorado

---

## Notas de diseño

- Todos los precios usan fuente monoespaciada (DM Mono)
- Precios de compra en verde `#2ECC71`
- Badges de modo: AUTO → verde, MANUAL → naranja
- Filas inactivas con `opacity: 0.45`
- Bordes redondeados: cards 12px, botones 8px, badges 20px
- Espaciado consistente: padding interno de cards 16-28px
- Scrollbar personalizado: delgado (6px), tono oscuro

---

## Qué NO cambiar

- La paleta de colores (es la identidad de la marca)
- El layout sidebar + contenido
- Los badges redondeados para AUTO/MANUAL/roles
- Los precios en monoespaciada
