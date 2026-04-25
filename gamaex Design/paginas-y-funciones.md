# Páginas y Funciones — Gamaex Admin

## Estructura de navegación

```
/login              → Pantalla de acceso
/dashboard          → Vista general del sistema
/currencies         → Gestión de precios de monedas  ← MÁS IMPORTANTE
/users              → Gestión de administradores
/audit              → Log de auditoría inmutable
```

---

## Monedas disponibles (ejemplos reales)
Cada moneda tiene: emoji de bandera, código, nombre, precio compra y venta en CLP

| Flag | Código | Nombre        |
|------|--------|---------------|
| 🇺🇸  | USD    | Dólar         |
| 🇪🇺  | EUR    | Euro          |
| 🇬🇧  | GBP    | Libra         |
| 🇧🇷  | BRL    | Real          |
| 🇦🇷  | ARS    | Peso Argentino|
| 🇨🇦  | CAD    | Dólar Canadiense |

---

## Tipos de datos importantes

### Currency (Moneda)
```
id, code, name, flag_emoji, is_active, display_order
quote_config:
  mode: "AUTO" | "MANUAL"
  buy_margin: number      ← margen en CLP sobre precio base
  sell_margin: number     ← margen en CLP sobre precio base
  manual_buy: number      ← precio fijo compra
  manual_sell: number     ← precio fijo venta
  current_buy: number     ← precio actual calculado
  current_sell: number    ← precio actual calculado
  last_base_price: number ← precio base de mercado
  price_alert_active: boolean
  price_alert_reason: string
```

### AdminUser (Usuario)
```
id, email, name
role: "SUPER_ADMIN" | "OPERATOR"
is_active: boolean
last_login_at: datetime
```

### AuditItem (Log)
```
entity, entity_id, action, actor_ref (email)
before, after (snapshot JSON)
ip_address, created_at
```

---

## Flujo de edición de precios

1. Usuario hace click en **Editar** en una moneda
2. Se abre modal con dos tabs:
   - **AUTO + Márgenes**: ingresa margen compra y margen venta en CLP
     - Precio final = precio base del mercado + margen
   - **Manual**: ingresa precio compra y precio venta fijos en CLP
     - El cron de sincronización NO toca estos valores
3. Si la moneda estaba en MANUAL y se selecciona AUTO, aparece botón "Volver a AUTO"
4. Click Guardar → se actualiza en tiempo real

---

## Roles y permisos
- **SUPER_ADMIN**: acceso completo a todas las páginas
- **OPERATOR**: acceso a Dashboard y Monedas (no puede gestionar usuarios)
