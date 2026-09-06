# 📡 Citri-Fresh API Documentation

> **Versión:** 1.0.0  
> **Base URL:** `http://localhost:3000` (Desarrollo) | `https://tu-dominio.com` (Producción)  
> **Formato:** JSON  
> **Autenticación:** JWT Bearer Token (para rutas protegidas)

---

## 📋 Tabla de Contenidos

1. [Autenticación](#-autenticación)
2. [Usuarios](#-usuarios)
3. [Productos](#-productos)
4. [Pedidos](#-pedidos)
5. [Zonas](#-zonas)
6. [Métricas](#-métricas-admin)
7. [Códigos de Estado HTTP](#-códigos-de-estado-http)
8. [Ejemplos de Uso](#-ejemplos-de-uso)

---

## 🔑 Autenticación

Todas las rutas protegidas requieren un token JWT válido en el header `Authorization`.

### Headers de Autenticación
```http
Authorization: Bearer <tu_token_jwt>
Content-Type: application/json
```

### Endpoints

#### POST /api/auth/register
Registro de nuevo usuario.

**Request:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "nombre": "Nombre del Usuario",
  "email": "usuario@ejemplo.com",
  "password": "contraseñaSegura123",
  "rol": "cliente"  // Opciones: "admin", "productor", "cliente"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "nombre": "Nombre del Usuario",
  "email": "usuario@ejemplo.com",
  "rol": "cliente",
  "creado_en": "2026-09-05T10:00:00.000Z"
}
```

**Errores comunes:**
- `400` - Email ya existe o datos inválidos
- `400` - Contraseña muy corta (mínimo 8 caracteres)

---

#### POST /api/auth/login
Iniciar sesión y obtener token JWT.

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseñaSegura123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nombre": "Nombre del Usuario",
    "email": "usuario@ejemplo.com",
    "rol": "cliente"
  }
}
```

**Errores comunes:**
- `401` - Credenciales inválidas

---

#### POST /api/auth/logout
Cerrar sesión (invalida token en el cliente).

**Request:**
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{"message": "Sesión cerrada correctamente"}
```

---

#### GET /api/auth/me
Obtener información del usuario autenticado.

**Request:**
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "nombre": "Nombre del Usuario",
  "email": "usuario@ejemplo.com",
  "rol": "cliente",
  "creado_en": "2026-09-05T10:00:00.000Z"
}
```

---

#### GET /api/auth/usuarios
**Solo Admin** - Listar todos los usuarios.

**Request:**
```http
GET /api/auth/usuarios
Authorization: Bearer <token_admin>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "nombre": "Administrador",
    "email": "admin@citrifresh.com",
    "rol": "admin",
    "creado_en": "2026-09-05T10:00:00.000Z"
  },
  {
    "id": 2,
    "nombre": "Productor",
    "email": "productor@citrifresh.com",
    "rol": "productor",
    "creado_en": "2026-09-05T10:00:00.000Z"
  }
]
```

---

---

## 👥 Usuarios

### GET /api/usuarios
**Solo Admin** - Listar todos los usuarios (alternativa a /api/auth/usuarios).

**Request:**
```http
GET /api/auth/usuarios
Authorization: Bearer <token_admin>
```

**Response:** Igual que /api/auth/usuarios

---

---

## 🍊 Productos

### GET /api/productos
Listar todos los productos disponibles con filtros opcionales.

**Parámetros de Query:**
| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| zona | number | Filtrar por ID de zona | ?zona=1 |
| busqueda | string | Búsqueda por nombre | ?busqueda=naranja |
| minPrecio | number | Precio mínimo | ?minPrecio=100 |
| maxPrecio | number | Precio máximo | ?maxPrecio=500 |

**Request:**
```http
GET /api/productos?zona=1&busqueda=naranja&minPrecio=100&maxPrecio=500
```

**Response (200 OK):**
```json
{
  "productos": [
    {
      "id": 1,
      "nombre": "Naranja Valencia",
      "descripcion": "Naranja jugosa y dulce",
      "precio": 350.00,
      "unidad": "cien",
      "stock": 45,
      "zona": 1,
      "productor_id": 2,
      "imagen": "/public/images/n-comer.jpg",
      "creado_en": "2026-09-05T10:00:00.000Z",
      "productor": {
        "id": 2,
        "nombre": "Finca Cítricos San Carlos"
      },
      "zona_nombre": "León"
    }
  ],
  "total": 1,
  "filtrosAplicados": {
    "zona": 1,
    "busqueda": "naranja",
    "minPrecio": 100,
    "maxPrecio": 500
  }
}
```

---

### GET /api/productos/:id
Obtener detalles de un producto específico.

**Request:**
```http
GET /api/productos/1
```

**Response (200 OK):**
```json
{
  "id": 1,
  "nombre": "Naranja Valencia",
  "descripcion": "Naranja jugosa y dulce, ideal para consumo fresco o jugos.",
  "precio": 350.00,
  "unidad": "cien",
  "stock": 45,
  "zona": 1,
  "productor_id": 2,
  "imagen": "/public/images/n-comer.jpg",
  "creado_en": "2026-09-05T10:00:00.000Z",
  "productor": {
    "id": 2,
    "nombre": "Finca Cítricos San Carlos",
    "email": "productor@citrifresh.com"
  },
  "zona_nombre": "León"
}
```

**Errores:**
- `404` - Producto no encontrado
- `400` - ID inválido

---

### POST /api/productos
**Requiere autenticación** - Crear nuevo producto (solo productor o admin).

**Request:**
```http
POST /api/productos
Authorization: Bearer <token_productor>
Content-Type: application/json

{
  "nombre": "Naranja Valencia",
  "descripcion": "Naranja jugosa y dulce",
  "precio": 350.00,
  "unidad": "cien",
  "stock": 45,
  "zona": 1,
  "imagen": "/public/images/n-comer.jpg"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "nombre": "Naranja Valencia",
  "descripcion": "Naranja jugosa y dulce",
  "precio": 350.00,
  "unidad": "cien",
  "stock": 45,
  "zona": 1,
  "productor_id": 2,
  "imagen": "/public/images/n-comer.jpg",
  "creado_en": "2026-09-05T10:00:00.000Z"
}
```

**Validaciones:**
- nombre: requerido, string
- precio: requerido, number, > 0
- stock: requerido, number, >= 0
- zona: requerido, number, zona existente

---

### PUT /api/productos/:id
**Requiere autenticación** - Actualizar producto (solo productor dueño o admin).

**Request:**
```http
PUT /api/productos/1
Authorization: Bearer <token_productor>
Content-Type: application/json

{
  "nombre": "Naranja Valencia Premium",
  "descripcion": "Naranja premium jugosa y dulce",
  "precio": 400.00,
  "stock": 50
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "nombre": "Naranja Valencia Premium",
  "descripcion": "Naranja premium jugosa y dulce",
  "precio": 400.00,
  "unidad": "cien",
  "stock": 50,
  "zona": 1,
  "productor_id": 2,
  "imagen": "/public/images/n-comer.jpg",
  "creado_en": "2026-09-05T10:00:00.000Z",
  "actualizado_en": "2026-09-05T11:00:00.000Z"
}
```

---

### DELETE /api/productos/:id
**Requiere autenticación** - Eliminar producto (solo productor dueño o admin).

**Request:**
```http
DELETE /api/productos/1
Authorization: Bearer <token_productor>
```

**Response (200 OK):**
```json
{"message": "Producto eliminado correctamente", "id": 1}
```

---

---

## 📦 Pedidos

### GET /api/pedidos
**Requiere autenticación** - Listar pedidos del usuario (admin ve todos).

**Parámetros de Query:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| estado | string | Filtrar por estado | ?estado=pendiente |

**Request:**
```http
GET /api/pedidos?estado=pendiente
Authorization: Bearer <token>
```

**Response (200 OK) - Usuario normal:**
```json
{
  "pedidos": [
    {
      "id": 1,
      "usuario_id": 1,
      "total": 1050.00,
      "estado": "pendiente",
      "fecha": "2026-09-05T10:00:00.000Z",
      "items": [
        {
          "id": 1,
          "producto_id": 1,
          "nombre": "Naranja Valencia",
          "cantidad": 3,
          "precio_unitario": 350.00,
          "subtotal": 1050.00
        }
      ]
    }
  ],
  "total": 1
}
```

**Response (200 OK) - Admin:**
```json
{
  "pedidos": [
    {
      "id": 1,
      "usuario_id": 1,
      "usuario_nombre": "Cliente 1",
      "total": 1050.00,
      "estado": "pendiente",
      "fecha": "2026-09-05T10:00:00.000Z",
      "items": [...]
    }
  ],
  "total": 1
}
```

---

### GET /api/pedidos/:id
**Requiere autenticación** - Obtener detalle de un pedido específico.

**Request:**
```http
GET /api/pedidos/1
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "usuario_id": 1,
  "usuario": {
    "id": 1,
    "nombre": "Cliente 1",
    "email": "cliente@ejemplo.com"
  },
  "total": 1050.00,
  "estado": "pendiente",
  "fecha": "2026-09-05T10:00:00.000Z",
  "items": [
    {
      "id": 1,
      "producto_id": 1,
      "producto": {
        "id": 1,
        "nombre": "Naranja Valencia",
        "precio": 350.00
      },
      "cantidad": 3,
      "precio_unitario": 350.00,
      "subtotal": 1050.00
    }
  ]
}
```

---

### POST /api/pedidos
**Requiere autenticación** - Crear nuevo pedido.

**Request:**
```http
POST /api/pedidos
Authorization: Bearer <token_cliente>
Content-Type: application/json

{
  "items": [
    {
      "producto_id": 1,
      "cantidad": 3
    },
    {
      "producto_id": 2,
      "cantidad": 2
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "usuario_id": 1,
  "total": 1150.00,
  "estado": "pendiente",
  "fecha": "2026-09-05T10:00:00.000Z",
  "items": [
    {
      "id": 1,
      "pedido_id": 1,
      "producto_id": 1,
      "cantidad": 3,
      "precio_unitario": 350.00,
      "subtotal": 1050.00
    },
    {
      "id": 2,
      "pedido_id": 1,
      "producto_id": 2,
      "cantidad": 2,
      "precio_unitario": 50.00,
      "subtotal": 100.00
    }
  ]
}
```

**Validaciones:**
- producto_id: debe existir
- cantidad: debe ser > 0
- stock: debe haber suficiente stock

---

### PATCH /api/pedidos/:id/estado
**Requiere autenticación** - Actualizar estado del pedido (solo admin o productor).

**Request:**
```http
PATCH /api/pedidos/1/estado
Authorization: Bearer <token_admin>
Content-Type: application/json

{
  "estado": "enviado"
}
```

**Estados válidos:** `pendiente`, `pagado`, `enviado`, `completado`, `cancelado`

**Response (200 OK):**
```json
{
  "id": 1,
  "estado": "enviado",
  "actualizado_en": "2026-09-05T11:00:00.000Z"
}
```

---

---

## 🗺️ Zonas

### GET /api/zonas
Listar todas las zonas geográficas disponibles.

**Request:**
```http
GET /api/zonas
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "nombre": "León"
  },
  {
    "id": 2,
    "nombre": "Chinandega"
  },
  {
    "id": 3,
    "nombre": "Carazo"
  },
  {
    "id": 4,
    "nombre": "Rivas"
  }
]
```

---

---

## 📊 Métricas (Admin)

### GET /api/metricas
**Solo Admin** - Obtener métricas generales del sistema.

**Request:**
```http
GET /api/metricas
Authorization: Bearer <token_admin>
```

**Response (200 OK):**
```json
{
  "resumen": {
    "total_productos": 15,
    "total_usuarios": 50,
    "total_pedidos": 250,
    "total_ventas": 150000.00,
    "productos_por_zona": {
      "León": 8,
      "Chinandega": 4,
      "Carazo": 2,
      "Rivas": 1
    },
    "usuarios_por_rol": {
      "admin": 1,
      "productor": 5,
      "cliente": 44
    },
    "pedidos_por_estado": {
      "pendiente": 50,
      "pagado": 100,
      "enviado": 75,
      "completado": 25,
      "cancelado": 0
    }
  },
  "fechas": {
    "primer_pedido": "2026-08-01",
    "ultimo_pedido": "2026-09-05"
  }
}
```

---

---

## 📌 Códigos de Estado HTTP

| Código | Descripción | Ejemplo de Uso |
|--------|-------------|----------------|
| 200 | OK | Respuesta exitosa |
| 201 | Created | Recurso creado |
| 400 | Bad Request | Datos inválidos |
| 401 | Unauthorized | Token inválido o ausente |
| 403 | Forbidden | Sin permisos (rol insuficiente) |
| 404 | Not Found | Recurso no encontrado |
| 409 | Conflict | Email ya existe |
| 500 | Internal Server Error | Error del servidor |

---

---

## 🚀 Ejemplos de Uso con cURL

### Autenticación
```bash
# Registrar usuario
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test User","email":"test@ejemplo.com","password":"test1234","rol":"cliente"}'

# Iniciar sesión
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@ejemplo.com","password":"test1234"}'

# Obtener productos (público)
curl http://localhost:3000/api/productos

# Obtener producto por ID (público)
curl http://localhost:3000/api/productos/1

# Crear producto (requiere token de productor)
TOKEN="tu_token_jwt"
curl -X POST http://localhost:3000/api/productos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Limón Criollo","descripcion":"Limón agrio","precio":40,"unidad":"docena","stock":100,"zona":1}'

# Obtener zonas (público)
curl http://localhost:3000/api/zonas

# Obtener mis pedidos (requiere token)
curl http://localhost:3000/api/pedidos \
  -H "Authorization: Bearer $TOKEN"
```

---

---

## 📝 Notas Adicionales

### Autenticación
- Los tokens JWT expiran después de 24 horas (configurable)
- Para rutas protegidas, incluye el token en el header `Authorization: Bearer <token>`
- El sistema soporta autenticación con Google OAuth 2.0

### Roles y Permisos
| Rol | Permisos |
|-----|----------|
| admin | Acceso total (usuarios, productos, pedidos, métricas) |
| productor | Crear/editar/eliminar sus propios productos, ver pedidos relacionados |
| cliente | Ver productos, crear pedidos, ver sus propios pedidos |

### Validaciones
- Todos los campos requeridos son validados
- Las contraseñas deben tener mínimo 8 caracteres
- Los precios deben ser positivos
- El stock debe ser >= 0
- Las cantides de pedido deben ser > 0

### Rate Limiting
- 100 peticiones por 15 minutos por IP (configurable)
- 5 peticiones por minuto para endpoints de autenticación

---

*Documentación generada automáticamente para Citri-Fresh API v1.0.0*
