# 🧪 Citri-Fresh - Documentación de Pruebas

> **Versión:** 1.0.0  
> **Última actualización:** 2026-09-05  
> **Autor:** Equipo Citri-Fresh

---

## 📋 Tabla de Contenidos

1. [Introducción](#-introducción)
2. [Entorno de Pruebas](#-entorno-de-pruebas)
3. [Casos de Prueba por Endpoint](#-casos-de-prueba-por-endpoint)
4. [Pruebas de Autenticación](#-pruebas-de-autenticación)
5. [Pruebas de Productos](#-pruebas-de-productos)
6. [Pruebas de Pedidos](#-pruebas-de-pedidos)
7. [Pruebas de Usuarios](#-pruebas-de-usuarios)
8. [Pruebas de Zonas](#-pruebas-de-zonas)
9. [Pruebas de Métricas](#-pruebas-de-métricas)
10. [Pruebas de Seguridad](#-pruebas-de-seguridad)
11. [Resultados y Métricas](#-resultados-y-métricas)
12. [Bugs Encontrados](#-bugs-encontrados)

---

## 🎯 Introducción

Este documento contiene todos los casos de prueba manual y automática para la API de **Citri-Fresh**. Incluye pruebas de:
- ✅ Funcionalidad (éxito)
- ✅ Manejo de errores
- ✅ Edge cases
- ✅ Seguridad
- ✅ Rendimiento

---

## 📡 Entorno de Pruebas

### Configuración
```bash
# Variables de entorno para pruebas
NODE_ENV=testing
PORT=3000
JWT_SECRET=test_secret_1234567890
DATABASE_PATH=./db/test-citrifresh.db
```

### Herramientas Utilizadas
- **Postman** - Pruebas manuales de API
- **cURL** - Pruebas desde terminal
- **SQLite Browser** - Verificación de datos en base de datos
- **Node.js** - Para scripts de prueba automatizados

### Datos de Prueba
Los datos de prueba se cargan usando el script `scripts/seed.js`:
```bash
node scripts/seed.js
```

**Usuarios de prueba creados:**
| ID | Email | Contraseña | Rol |
|----|-------|------------|-----|
| 1 | admin@citrifresh.com | admin123 | admin |
| 2 | productor@citrifresh.com | productor123 | productor |
| 3 | cliente@citrifresh.com | cliente123 | cliente |

---

---

## 📋 Casos de Prueba por Endpoint

---

## 🔐 Pruebas de Autenticación

### **Endpoint: POST /api/auth/register**

#### ✅ Caso 1: Registro de usuario válido
- **Descripción:** Registrar un nuevo usuario con datos válidos
- **Datos de entrada:**
  ```json
  {
    "nombre": "Test User",
    "email": "test@ejemplo.com",
    "password": "test1234",
    "rol": "cliente"
  }
  ```
- **Resultado esperado:**
  - Código HTTP: `201 Created`
  - Response: Objeto de usuario sin password
  - Token JWT generado
- **Estado:** ⏳ *Pendiente de ejecución*

#### ✅ Caso 2: Registro con email duplicado
- **Descripción:** Intentar registrar usuario con email ya existente
- **Datos de entrada:**
  ```json
  {
    "nombre": "Test User 2",
    "email": "admin@citrifresh.com",  // Ya existe
    "password": "test1234",
    "rol": "cliente"
  }
  ```
- **Resultado esperado:**
  - Código HTTP: `400 Bad Request` o `409 Conflict`
  - Mensaje: "Email ya está en uso"
- **Estado:** ⏳ *Pendiente de ejecución*

#### ✅ Caso 3: Registro con contraseña corta
- **Descripción:** Intentar registrar con contraseña menor a 8 caracteres
- **Datos de entrada:**
  ```json
  {
    "nombre": "Test User",
    "email": "test2@ejemplo.com",
    "password": "123",  // Menos de 8 caracteres
    "rol": "cliente"
  }
  ```
- **Resultado esperado:**
  - Código HTTP: `400 Bad Request`
  - Mensaje: "La contraseña debe tener al menos 8 caracteres"
- **Estado:** ⏳ *Pendiente de ejecución*

#### ✅ Caso 4: Registro con datos incompletos
- **Descripción:** Intentar registrar sin campos requeridos
- **Datos de entrada:**
  ```json
  {
    "nombre": "Test User"
    // Faltan email, password, rol
  }
  ```
- **Resultado esperado:**
  - Código HTTP: `400 Bad Request`
  - Mensaje: "Campos requeridos: email, password, rol"
- **Estado:** ⏳ *Pendiente de ejecución*

#### ✅ Caso 5: Registro con email inválido
- **Descripción:** Intentar registrar con formato de email incorrecto
- **Datos de entrada:**
  ```json
  {
    "nombre": "Test User",
    "email": "email-invalido",
    "password": "test1234",
    "rol": "cliente"
  }
  ```
- **Resultado esperado:**
  - Código HTTP: `400 Bad Request`
  - Mensaje: "Formato de email inválido"
- **Estado:** ⏳ *Pendiente de ejecución*

---

### **Endpoint: POST /api/auth/login**

#### ✅ Caso 1: Login con credenciales válidas
- **Descripción:** Iniciar sesión con usuario existente
- **Datos de entrada:**
  ```json
  {
    "email": "admin@citrifresh.com",
    "password": "admin123"
  }
  ```
- **Resultado esperado:**
  - Código HTTP: `200 OK`
  - Response: Objeto con token JWT y datos del usuario
- **Estado:** ⏳ *Pendiente de ejecución*

#### ✅ Caso 2: Login con credenciales inválidas
- **Descripción:** Intentar iniciar sesión con credenciales incorrectas
- **Datos de entrada:**
  ```json
  {
    "email": "admin@citrifresh.com",
    "password": "password_incorrecto"
  }
  ```
- **Resultado esperado:**
  - Código HTTP: `401 Unauthorized`
  - Mensaje: "Credenciales inválidas"
- **Estado:** ⏳ *Pendiente de ejecución*

#### ✅ Caso 3: Login con usuario inexistente
- **Descripción:** Intentar iniciar sesión con usuario que no existe
- **Datos de entrada:**
  ```json
  {
    "email": "noexiste@ejemplo.com",
    "password": "cualquier_cosa"
  }
  ```
- **Resultado esperado:**
  - Código HTTP: `401 Unauthorized`
  - Mensaje: "Credenciales inválidas" (genérico para evitar enumeración de usuarios)
- **Estado:** ⏳ *Pendiente de ejecución*

#### ✅ Caso 4: Login con datos incompletos
- **Descripción:** Intentar login sin email o password
- **Datos de entrada:**
  ```json
  {
    "email": "admin@citrifresh.com"
    // Falta password
  }
  ```
- **Resultado esperado:**
  - Código HTTP: `400 Bad Request`
  - Mensaje: "email y password son requeridos"
- **Estado:** ⏳ *Pendiente de ejecución*

---

### **Endpoint: GET /api/auth/me**

#### ✅ Caso 1: Obtener datos de usuario autenticado
- **Descripción:** Obtener información del usuario con token válido
- **Headers:** `Authorization: Bearer <token_valido>`
- **Resultado esperado:**
  - Código HTTP: `200 OK`
  - Response: Datos del usuario (sin password)
- **Estado:** ⏳ *Pendiente de ejecución*

#### ❌ Caso 2: Acceder sin token
- **Descripción:** Intentar acceder sin token de autenticación
- **Headers:** Ninguno
- **Resultado esperado:**
  - Código HTTP: `401 Unauthorized`
  - Mensaje: "Token no proporcionado"
- **Estado:** ⏳ *Pendiente de ejecución*

#### ❌ Caso 3: Acceder con token inválido
- **Descripción:** Intentar acceder con token JWT inválido
- **Headers:** `Authorization: Bearer token.invalido.123`
- **Resultado esperado:**
  - Código HTTP: `401 Unauthorized`
  - Mensaje: "Token inválido"
- **Estado:** ⏳ *Pendiente de ejecución*

#### ❌ Caso 4: Acceder con token expirado
- **Descripción:** Intentar acceder con token JWT expirado
- **Headers:** `Authorization: Bearer <token_expirado>`
- **Resultado esperado:**
  - Código HTTP: `401 Unauthorized`
  - Mensaje: "Token expirado"
- **Estado:** ⏳ *Pendiente de ejecución*

---

### **Endpoint: GET /api/auth/usuarios**

#### ✅ Caso 1: Admin obtiene lista de usuarios
- **Descripción:** Admin solicita lista de todos los usuarios
- **Headers:** `Authorization: Bearer <token_admin>`
- **Resultado esperado:**
  - Código HTTP: `200 OK`
  - Response: Array de usuarios (sin passwords)
- **Estado:** ⏳ *Pendiente de ejecución*

#### ❌ Caso 2: Usuario no admin intenta acceder
- **Descripción:** Usuario con rol "cliente" intenta acceder a lista de usuarios
- **Headers:** `Authorization: Bearer <token_cliente>`
- **Resultado esperado:**
  - Código HTTP: `403 Forbidden`
  - Mensaje: "No tienes permisos para esta acción"
- **Estado:** ⏳ *Pendiente de ejecución*

#### ❌ Caso 3: Acceder sin autenticación
- **Descripción:** Intentar acceder sin token
- **Headers:** Ninguno
- **Resultado esperado:**
  - Código HTTP: `401 Unauthorized`
- **Estado:** ⏳ *Pendiente de ejecución*

---

---

## 🍊 Pruebas de Productos

### **Endpoint: GET /api/productos**

#### ✅ Caso 1: Obtener todos los productos
- **Descripción:** Listar todos los productos disponibles
- **Request:** `GET /api/productos`
- **Resultado esperado:**
  - Código HTTP: `200 OK`
  - Response: Array de productos con paginación
- **Estado:** ⏳ *Pendiente de ejecución*

#### ✅ Caso 2: Filtrar por zona
- **Descripción:** Filtrar productos por ID de zona
- **Request:** `GET /api/productos?zona=1`
- **Resultado esperado:**
  - Código HTTP: `200 OK`
  - Response: Solo productos de la zona 1 (León)
- **Estado:** ⏳ *Pendiente de ejecución*

#### ✅ Caso 3: Buscar por nombre
- **Descripción:** Buscar productos por término de búsqueda
- **Request:** `GET /api/productos?busqueda=naranja`
- **Resultado esperado:**
  - Código HTTP: `200 OK`
  - Response: Solo productos que coincidan con "naranja"
- **Estado:** ⏳ *Pendiente de ejecución*

#### ✅ Caso 4: Filtrar por rango de precio
- **Descripción:** Filtrar productos entre 100 y 500 córdobas
- **Request:** `GET /api/productos?minPrecio=100&maxPrecio=500`
- **Resultado esperado:**
  - Código HTTP: `200 OK`
  - Response: Solo productos en rango de precio
- **Estado:** ⏳ *Pendiente de ejecución*

#### ✅ Caso 5: Combinar múltiples filtros
- **Descripción:** Usar múltiples filtros simultáneamente
- **Request:** `GET /api/productos?zona=1&busqueda=naranja&minPrecio=100&maxPrecio=500`
- **Resultado esperado:**
  - Código HTTP: `200 OK`
  - Response: Productos que cumplen todos los filtros
- **Estado:** ⏳ *Pendiente de ejecución*

#### ❌ Caso 6: Zona inexistente
- **Descripción:** Filtrar por ID de zona que no existe
- **Request:** `GET /api/productos?zona=9999`
- **Resultado esperado:**
  - Código HTTP: `200 OK`
  - Response: Array vacío
- **Estado:** ⏳ *Pendiente de ejecución*

---

### **Endpoint: GET /api/productos/:id**

#### ✅ Caso 1: Obtener producto existente
- **Descripción:** Obtener detalles de un producto válido
- **Request:** `GET /api/productos/1`
- **Resultado esperado:**
  - Código HTTP: `200 OK`
  - Response: Objeto con detalles del producto
- **Estado:** ⏳ *Pendiente de ejecución*

#### ❌ Caso 2: Obtener producto inexistente
- **Descripción:** Intentar obtener producto con ID que no existe
- **Request:** `GET /api/productos/9999`
- **Resultado esperado:**
  - Código HTTP: `404 Not Found`
  - Mensaje: "Producto no encontrado"
- **Estado:** ⏳ *Pendiente de ejecución*

#### ❌ Caso 3: ID inválido (no numérico)
- **Descripción:** Intentar obtener producto con ID no numérico
- **Request:** `GET /api/productos/abc`
- **Resultado esperado:**
  - Código HTTP: `400 Bad Request`
  - Mensaje: "ID debe ser un número"
- **Estado:** ⏳ *Pendiente de ejecución*

---

### **Endpoint: POST /api/productos**

#### ✅ Caso 1: Crear producto válido (como productor)
- **Descripción:** Productor crea un nuevo producto
- **Headers:** `Authorization: Bearer <token_productor>`
- **Datos de entrada:**
  ```json
  {
    "nombre": "Limón Criollo Premium",
    "descripcion": "Limón agrio de alta calidad",
    "precio": 45.00,
    "unidad": "docena",
    "stock": 150,
    "zona": 1,
    "imagen": "/public/images/limon.jpg"
  }
  ```
- **Resultado esperado:**
  - Código HTTP: `201 Created`
  - Response: Objeto del producto creado
- **Estado:** ⏳ *Pendiente de ejecución*

#### ❌ Caso 2: Crear producto sin autenticación
- **Descripción:** Intentar crear producto sin token
- **Headers:** Ninguno
- **Datos de entrada:** Válidos
- **Resultado esperado:**
  - Código HTTP: `401 Unauthorized`
- **Estado:** ⏳ *Pendiente de ejecución*

#### ❌ Caso 3: Crear producto sin permisos (rol cliente)
- **Descripción:** Cliente intenta crear producto
- **Headers:** `Authorization: Bearer <token_cliente>`
- **Datos de entrada:** Válidos
- **Resultado esperado:**
  - Código HTTP: `403 Forbidden`
  - Mensaje: "No tienes permisos"
- **Estado:** ⏳ *Pendiente de ejecución*

#### ❌ Caso 4: Crear producto con datos incompletos
- **Descripción:** Intentar crear producto sin campos requeridos
- **Headers:** `Authorization: Bearer <token_productor>`
- **Datos de entrada:**
  ```json
  {
    "nombre": "Producto sin precio"
    // Faltan campos requeridos
  }
  ```
- **Resultado esperado:**
  - Código HTTP: `400 Bad Request`
  - Mensaje: "Campos requeridos: precio, stock, zona"
- **Estado:** ⏳ *Pendiente de ejecución*

#### ❌ Caso 5: Crear producto con precio negativo
- **Descripción:** Intentar crear producto con precio inválido
- **Headers:** `Authorization: Bearer <token_productor>`
- **Datos de entrada:**
  ```json
  {
    "nombre": "Producto",
    "precio": -100,
    "stock": 50,
    "zona": 1
  }
  ```
- **Resultado esperado:**
  - Código HTTP: `400 Bad Request`
  - Mensaje: "El precio debe ser positivo"
- **Estado:** ⏳ *Pendiente de ejecución*

#### ❌ Caso 6: Crear producto con zona inexistente
- **Descripción:** Intentar crear producto con zona que no existe
- **Headers:** `Authorization: Bearer <token_productor>`
- **Datos de entrada:**
  ```json
  {
    "nombre": "Producto",
    "precio": 100,
    "stock": 50,
    "zona": 9999
  }
  ```
- **Resultado esperado:**
  - Código HTTP: `400 Bad Request` o `404 Not Found`
  - Mensaje: "Zona no encontrada"
- **Estado:** ⏳ *Pendiente de ejecución*

---

### **Endpoint: PUT /api/productos/:id**

#### ✅ Caso 1: Actualizar producto existente (propio)
- **Descripción:** Productor actualiza su propio producto
- **Headers:** `Authorization: Bearer <token_productor>`
- **Request:** `PUT /api/productos/1`
- **Datos de entrada:**
  ```json
  {
    "precio": 400.00,
    "stock": 60
  }
  ```
- **Resultado esperado:**
  - Código HTTP: `200 OK`
  - Response: Objeto del producto actualizado
- **Estado:** ⏳ *Pendiente de ejecución*

#### ❌ Caso 2: Actualizar producto de otro productor
- **Descripción:** Productor intenta actualizar producto de otro
- **Headers:** `Authorization: Bearer <token_productor_1>`
- **Request:** `PUT /api/productos/999` (ID de producto de productor_2)
- **Datos de entrada:** Válidos
- **Resultado esperado:**
  - Código HTTP: `403 Forbidden`
  - Mensaje: "No tienes permisos para actualizar este producto"
- **Estado:** ⏳ *Pendiente de ejecución*

#### ❌ Caso 3: Actualizar producto inexistente
- **Descripción:** Intentar actualizar producto que no existe
- **Headers:** `Authorization: Bearer <token_productor>`
- **Request:** `PUT /api/productos/9999`
- **Datos de entrada:** Válidos
- **Resultado esperado:**
  - Código HTTP: `404 Not Found`
  - Mensaje: "Producto no encontrado"
- **Estado:** ⏳ *Pendiente de ejecución*

---

### **Endpoint: DELETE /api/productos/:id**

#### ✅ Caso 1: Eliminar producto propio
- **Descripción:** Productor elimina su propio producto
- **Headers:** `Authorization: Bearer <token_productor>`
- **Request:** `DELETE /api/productos/1`
- **Resultado esperado:**
  - Código HTTP: `200 OK`
  - Response: Confirmación de eliminación
- **Estado:** ⏳ *Pendiente de ejecución*

#### ❌ Caso 2: Eliminar producto de otro productor
- **Descripción:** Productor intenta eliminar producto de otro
- **Headers:** `Authorization: Bearer <token_productor_1>`
- **Request:** `DELETE /api/productos/999`
- **Resultado esperado:**
  - Código HTTP: `403 Forbidden`
- **Estado:** ⏳ *Pendiente de ejecución*

#### ❌ Caso 3: Eliminar producto inexistente
- **Descripción:** Intentar eliminar producto que no existe
- **Headers:** `Authorization: Bearer <token_productor>`
- **Request:** `DELETE /api/productos/9999`
- **Resultado esperado:**
  - Código HTTP: `404 Not Found`
- **Estado:** ⏳ *Pendiente de ejecución*

---

---

## 📦 Pruebas de Pedidos

### **Endpoint: GET /api/pedidos**

#### ✅ Caso 1: Cliente obtiene sus pedidos
- **Descripción:** Cliente solicita lista de sus pedidos
- **Headers:** `Authorization: Bearer <token_cliente>`
- **Request:** `GET /api/pedidos`
- **Resultado esperado:**
  - Código HTTP: `200 OK`
  - Response: Array de pedidos del cliente
- **Estado:** ⏳ *Pendiente de ejecución*

#### ✅ Caso 2: Admin obtiene todos los pedidos
- **Descripción:** Admin solicita lista de todos los pedidos
- **Headers:** `Authorization: Bearer <token_admin>`
- **Request:** `GET /api/pedidos`
- **Resultado esperado:**
  - Código HTTP: `200 OK`
  - Response: Array de todos los pedidos
- **Estado:** ⏳ *Pendiente de ejecución*

#### ✅ Caso 3: Filtrar pedidos por estado
- **Descripción:** Filtrar pedidos por estado
- **Headers:** `Authorization: Bearer <token_admin>`
- **Request:** `GET /api/pedidos?estado=pendiente`
- **Resultado esperado:**
  - Código HTTP: `200 OK`
  - Response: Solo pedidos con estado "pendiente"
- **Estado:** ⏳ *Pendiente de ejecución*

#### ❌ Caso 4: Acceder sin autenticación
- **Descripción:** Intentar acceder sin token
- **Headers:** Ninguno
- **Request:** `GET /api/pedidos`
- **Resultado esperado:**
  - Código HTTP: `401 Unauthorized`
- **Estado:** ⏳ *Pendiente de ejecución*

---

### **Endpoint: GET /api/pedidos/:id**

#### ✅ Caso 1: Obtener pedido propio
- **Descripción:** Cliente obtiene detalle de su pedido
- **Headers:** `Authorization: Bearer <token_cliente>`
- **Request:** `GET /api/pedidos/1`
- **Resultado esperado:**
  - Código HTTP: `200 OK`
  - Response: Objeto con detalles del pedido
- **Estado:** ⏳ *Pendiente de ejecución*

#### ❌ Caso 2: Obtener pedido de otro usuario
- **Descripción:** Cliente intenta obtener pedido de otro
- **Headers:** `Authorization: Bearer <token_cliente_1>`
- **Request:** `GET /api/pedidos/999` (pedido de cliente_2)
- **Resultado esperado:**
  - Código HTTP: `403 Forbidden` o `404 Not Found` (para evitar revelar existencia)
- **Estado:** ⏳ *Pendiente de ejecución*

#### ❌ Caso 3: Obtener pedido inexistente
- **Descripción:** Intentar obtener pedido que no existe
- **Headers:** `Authorization: Bearer <token_admin>`
- **Request:** `GET /api/pedidos/9999`
- **Resultado esperado:**
  - Código HTTP: `404 Not Found`
  - Mensaje: "Pedido no encontrado"
- **Estado:** ⏳ *Pendiente de ejecución*

---

### **Endpoint: POST /api/pedidos**

#### ✅ Caso 1: Crear pedido válido
- **Descripción:** Cliente crea un nuevo pedido
- **Headers:** `Authorization: Bearer <token_cliente>`
- **Datos de entrada:**
  ```json
  {
    "items": [
      {
        "producto_id": 1,
        "cantidad": 2
      },
      {
        "producto_id": 2,
        "cantidad": 3
      }
    ]
  }
  ```
- **Resultado esperado:**
  - Código HTTP: `201 Created`
  - Response: Objeto del pedido creado
  - Stock de productos decrementado
- **Estado:** ⏳ *Pendiente de ejecución*

#### ❌ Caso 2: Crear pedido sin autenticación
- **Descripción:** Intentar crear pedido sin token
- **Headers:** Ninguno
- **Datos de entrada:** Válidos
- **Resultado esperado:**
  - Código HTTP: `401 Unauthorized`
- **Estado:** ⏳ *Pendiente de ejecución*

#### ❌ Caso 3: Crear pedido con stock insuficiente
- **Descripción:** Intentar pedir más cantidad que el stock disponible
- **Headers:** `Authorization: Bearer <token_cliente>`
- **Datos de entrada:**
  ```json
  {
    "items": [
      {
        "producto_id": 1,  // Stock: 10
        "cantidad": 50
      }
    ]
  }
  ```
- **Resultado esperado:**
  - Código HTTP: `400 Bad Request`
  - Mensaje: "Stock insuficiente para el producto X"
- **Estado:** ⏳ *Pendiente de ejecución*

#### ❌ Caso 4: Crear pedido con producto inexistente
- **Descripción:** Intentar pedir producto que no existe
- **Headers:** `Authorization: Bearer <token_cliente>`
- **Datos de entrada:**
  ```json
  {
    "items": [
      {
        "producto_id": 9999,
        "cantidad": 2
      }
    ]
  }
  ```
- **Resultado esperado:**
  - Código HTTP: `400 Bad Request` o `404 Not Found`
  - Mensaje: "Producto no encontrado"
- **Estado:** ⏳ *Pendiente de ejecución*

#### ❌ Caso 5: Crear pedido con cantidad inválida
- **Descripción:** Intentar pedir cantidad <= 0
- **Headers:** `Authorization: Bearer <token_cliente>`
- **Datos de entrada:**
  ```json
  {
    "items": [
      {
        "producto_id": 1,
        "cantidad": 0  // Inválido
      }
    ]
  }
  ```
- **Resultado esperado:**
  - Código HTTP: `400 Bad Request`
  - Mensaje: "La cantidad debe ser mayor que 0"
- **Estado:** ⏳ *Pendiente de ejecución*

#### ❌ Caso 6: Crear pedido con items vacío
- **Descripción:** Intentar crear pedido sin items
- **Headers:** `Authorization: Bearer <token_cliente>`
- **Datos de entrada:**
  ```json
  {
    "items": []
  }
  ```
- **Resultado esperado:**
  - Código HTTP: `400 Bad Request`
  - Mensaje: "El pedido debe contener al menos un item"
- **Estado:** ⏳ *Pendiente de ejecución*

---

### **Endpoint: PATCH /api/pedidos/:id/estado**

#### ✅ Caso 1: Admin actualiza estado de pedido
- **Descripción:** Admin cambia estado de un pedido
- **Headers:** `Authorization: Bearer <token_admin>`
- **Request:** `PATCH /api/pedidos/1/estado`
- **Datos de entrada:**
  ```json
  {
    "estado": "enviado"
  }
  ```
- **Resultado esperado:**
  - Código HTTP: `200 OK`
  - Response: Pedido con estado actualizado
- **Estado:** ⏳ *Pendiente de ejecución*

#### ❌ Caso 2: Usuario no admin intenta actualizar estado
- **Descripción:** Cliente intenta cambiar estado de pedido
- **Headers:** `Authorization: Bearer <token_cliente>`
- **Request:** `PATCH /api/pedidos/1/estado`
- **Datos de entrada:** Válidos
- **Resultado esperado:**
  - Código HTTP: `403 Forbidden`
  - Mensaje: "Solo administradores pueden actualizar el estado"
- **Estado:** ⏳ *Pendiente de ejecución*

#### ❌ Caso 3: Actualizar estado con valor inválido
- **Descripción:** Intentar cambiar a estado no permitido
- **Headers:** `Authorization: Bearer <token_admin>`
- **Request:** `PATCH /api/pedidos/1/estado`
- **Datos de entrada:**
  ```json
  {
    "estado": "entregado"  // Estado no válido
  }
  ```
- **Resultado esperado:**
  - Código HTTP: `400 Bad Request`
  - Mensaje: "Estado inválido. Opciones: pendiente, pagado, enviado, completado, cancelado"
- **Estado:** ⏳ *Pendiente de ejecución*

#### ❌ Caso 4: Actualizar estado de pedido inexistente
- **Descripción:** Intentar actualizar estado de pedido que no existe
- **Headers:** `Authorization: Bearer <token_admin>`
- **Request:** `PATCH /api/pedidos/9999/estado`
- **Datos de entrada:** Válidos
- **Resultado esperado:**
  - Código HTTP: `404 Not Found`
  - Mensaje: "Pedido no encontrado"
- **Estado:** ⏳ *Pendiente de ejecución*

---

---

## 🗺️ Pruebas de Zonas

### **Endpoint: GET /api/zonas**

#### ✅ Caso 1: Obtener todas las zonas
- **Descripción:** Listar todas las zonas geográficas
- **Request:** `GET /api/zonas`
- **Resultado esperado:**
  - Código HTTP: `200 OK`
  - Response: Array de zonas
- **Datos esperados:**
  ```json
  [
    {"id": 1, "nombre": "León"},
    {"id": 2, "nombre": "Chinandega"},
    {"id": 3, "nombre": "Carazo"},
    {"id": 4, "nombre": "Rivas"}
  ]
  ```
- **Estado:** ⏳ *Pendiente de ejecución*

---

---

## 📊 Pruebas de Métricas

### **Endpoint: GET /api/metricas**

#### ✅ Caso 1: Admin obtiene métricas
- **Descripción:** Admin solicita métricas del sistema
- **Headers:** `Authorization: Bearer <token_admin>`
- **Request:** `GET /api/metricas`
- **Resultado esperado:**
  - Código HTTP: `200 OK`
  - Response: Objeto con métricas del sistema
- **Estado:** ⏳ *Pendiente de ejecución*

#### ❌ Caso 2: Usuario no admin intenta acceder
- **Descripción:** Cliente intenta acceder a métricas
- **Headers:** `Authorization: Bearer <token_cliente>`
- **Request:** `GET /api/metricas`
- **Resultado esperado:**
  - Código HTTP: `403 Forbidden`
- **Estado:** ⏳ *Pendiente de ejecución*

#### ❌ Caso 3: Acceder sin autenticación
- **Descripción:** Intentar acceder sin token
- **Headers:** Ninguno
- **Request:** `GET /api/metricas`
- **Resultado esperado:**
  - Código HTTP: `401 Unauthorized`
- **Estado:** ⏳ *Pendiente de ejecución*

---

---

## 🔒 Pruebas de Seguridad

### Rate Limiting

#### ✅ Caso 1: Rate limiting general
- **Descripción:** Realizar más de 100 peticiones en 15 minutos desde misma IP
- **Herramienta:** Script de prueba o herramientas como Apache Bench
- **Resultado esperado:**
  - Código HTTP: `429 Too Many Requests`
  - Headers: `Retry-After` presente
- **Estado:** ⏳ *Pendiente de ejecución*

#### ✅ Caso 2: Rate limiting en login
- **Descripción:** Realizar más de 5 intentos de login en 1 minuto
- **Request:** `POST /api/auth/login` (5+ veces con credenciales inválidas)
- **Resultado esperado:**
  - Código HTTP: `429 Too Many Requests`
  - Mensaje: "Demasiados intentos de autenticación"
- **Estado:** ⏳ *Pendiente de ejecución*

### Validación de Tokens

#### ✅ Caso 1: Token válido
- **Headers:** `Authorization: Bearer <token_valido>`
- **Resultado esperado:** Acceso permitido
- **Estado:** ⏳ *Pendiente de ejecución*

#### ❌ Caso 2: Token manipulado
- **Headers:** `Authorization: Bearer <token_modificado>`
- **Resultado esperado:**
  - Código HTTP: `401 Unauthorized`
  - Mensaje: "Token inválido"
- **Estado:** ⏳ *Pendiente de ejecución*

#### ❌ Caso 3: Token de otro usuario
- **Headers:** `Authorization: Bearer <token_cliente>` (en ruta de admin)
- **Resultado esperado:**
  - Código HTTP: `403 Forbidden`
- **Estado:** ⏳ *Pendiente de ejecución*

---

---

## 📊 Resultados y Métricas

### Resumen de Pruebas

| Categoría | Total | Pasadas | Fallidas | Pendientes |
|-----------|-------|---------|----------|-----------|
| Autenticación | 15 | 0 | 0 | 15 |
| Productos | 21 | 0 | 0 | 21 |
| Pedidos | 21 | 0 | 0 | 21 |
| Usuarios | 3 | 0 | 0 | 3 |
| Zonas | 1 | 0 | 0 | 1 |
| Métricas | 3 | 0 | 0 | 3 |
| Seguridad | 5 | 0 | 0 | 5 |
| **TOTAL** | **68** | **0** | **0** | **68** |

### Porcentaje de Cumplimiento
- **0%** de pruebas ejecutadas
- **0%** de pruebas pasadas
- **0%** de pruebas fallidas

---

---

## 🐛 Bugs Encontrados

Aquí se documentarán los bugs encontrados durante las pruebas.

| ID | Endpoint | Descripción | Prioridad | Estado | Solución |
|----|----------|-------------|----------|--------|----------|
| - | - | - | - | - | - |

**Nota:** No se han encontrado bugs aún. Las pruebas están pendientes de ejecución.

---

---

## 📌 Instrucciones para Ejecutar Pruebas

### 1. Configurar entorno de pruebas
```bash
# Clonar repositorio
git clone https://github.com/Citri-Coders/Citri-Fresh.git
cd Citri-Fresh

# Instalar dependencias
npm install

# Crear base de datos de pruebas
cp .env.example .env
# Editar .env para configurar DATABASE_PATH=./db/test-citrifresh.db

# Inicializar base de datos
sqlite3 ./db/test-citrifresh.db < db/schema.sql

# Cargar datos de prueba
node scripts/seed.js

# Iniciar servidor
npm run dev
```

### 2. Ejecutar pruebas con cURL
```bash
# Ejemplo: Probar login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@citrifresh.com","password":"admin123"}'

# Ejemplo: Probar obtener productos
curl http://localhost:3000/api/productos
```

### 3. Ejecutar pruebas con Postman
1. Importar la colección `Citri-Fresh API.postman_collection.json` (si existe)
2. Configurar variable de entorno `baseUrl` = `http://localhost:3000`
3. Ejecutar la colección

### 4. Verificar resultados
- Comparar resultados reales con resultados esperados
- Documentar discrepancias en la sección "Bugs Encontrados"
- Actualizar el porcentaje de cumplimiento

---

---

## 📅 Calendario de Pruebas

| Fecha | Tareas | Responsable | Estado |
|-------|--------|-------------|--------|
| 2026-09-05 | Crear documentación | Mistral Vibe | ✅ Completo |
| 2026-09-05 | Ejecutar pruebas de autenticación | Pendiente | ⏳ |
| 2026-09-05 | Ejecutar pruebas de productos | Pendiente | ⏳ |
| 2026-09-05 | Ejecutar pruebas de pedidos | Pendiente | ⏳ |
| 2026-09-05 | Ejecutar pruebas de seguridad | Pendiente | ⏳ |
| 2026-09-05 | Documentar resultados | Pendiente | ⏳ |

---

---

## 📚 Apéndices

### A. Scripts de Prueba Automatizados

Para automatizar las pruebas, puedes usar el siguiente script de Node.js:

```javascript
// test/api.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert';
import axios from 'axios';

const baseUrl = 'http://localhost:3000';

describe('API de Autenticación', () => {
  let token = '';

  it('debe registrar un nuevo usuario', async () => {
    const response = await axios.post(`${baseUrl}/api/auth/register`, {
      nombre: 'Test User',
      email: 'test@ejemplo.com',
      password: 'test1234',
      rol: 'cliente'
    });
    assert.equal(response.status, 201);
    assert.ok(response.data.id);
  });

  it('debe iniciar sesión correctamente', async () => {
    const response = await axios.post(`${baseUrl}/api/auth/login`, {
      email: 'test@ejemplo.com',
      password: 'test1234'
    });
    assert.equal(response.status, 200);
    assert.ok(response.data.token);
    token = response.data.token;
  });

  it('debe obtener información del usuario autenticado', async () => {
    const response = await axios.get(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    assert.equal(response.status, 200);
    assert.equal(response.data.email, 'test@ejemplo.com');
  });
});
```

### B. Comandos cURL para Pruebas Rápidas

```bash
# Autenticación
# Login
curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@citrifresh.com","password":"admin123"}' | jq

# Obtener productos
curl -s http://localhost:3000/api/productos | jq

# Obtener producto por ID
curl -s http://localhost:3000/api/productos/1 | jq

# Obtener zonas
curl -s http://localhost:3000/api/zonas | jq

# Listar pedidos (requiere token)
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@citrifresh.com","password":"admin123"}' | jq -r '.token')

curl -s http://localhost:3000/api/pedidos \
  -H "Authorization: Bearer $TOKEN" | jq
```

---

---

*Documentación de pruebas para Citri-Fresh API. Mantener actualizada con los resultados de las pruebas ejecutadas.*
