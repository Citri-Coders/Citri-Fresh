# 🔍 Auditoría Técnica — Citri-Fresh

Revisión completa del backend, base de datos, seguridad, arquitectura y buenas prácticas.

---

## 📊 Resumen Ejecutivo

| Severidad | Cantidad | Descripción |
|-----------|----------|-------------|
| 🔴 **Crítico** | 3 | Problemas que comprometen seguridad o integridad de datos |
| 🟠 **Alto** | 5 | Bugs o fallos que pueden causar errores en producción |
| 🟡 **Medio** | 6 | Inconsistencias o malas prácticas que conviene corregir |
| 🔵 **Bajo** | 4 | Mejoras recomendadas de calidad de código |

---

## 🔴 Problemas Críticos

### 1. Google JWT no se verifica criptográficamente
**Archivo:** `server/controllers/authController.js` (líneas 205-221)
**Severidad:** 🔴 Crítica

El token JWT de Google se decodifica manualmente con `Buffer.from(parts[1], 'base64')` sin verificar la firma criptográfica. Cualquier atacante podría fabricar un JWT falso con el email de otra persona y obtener acceso a su cuenta.

```javascript
// ❌ Código actual — NO verifica la firma
const parts = credential.split('.');
const payloadJson = Buffer.from(parts[1], 'base64').toString('utf8');
const googleData = JSON.parse(payloadJson);
```

**Solución:** Usar la librería oficial `google-auth-library` para verificar el token:
```javascript
// ✅ Verificación segura
import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const ticket = await client.verifyIdToken({
  idToken: credential,
  audience: process.env.GOOGLE_CLIENT_ID,
});
const googleData = ticket.getPayload();
```

---

### 2. Códigos OTP almacenados en memoria — se pierden en producción
**Archivo:** `server/controllers/authController.js` (línea 308)
**Severidad:** 🔴 Crítica

```javascript
const codigosRecuperacionCache = new Map(); // ❌ Solo vive en RAM
```

En Vercel (serverless), cada invocación puede correr en una instancia diferente. El código OTP se genera en una instancia y el usuario lo valida en otra que **no tiene el Map**. La recuperación de contraseña **nunca funcionará en producción**.

**Solución:** Almacenar los códigos OTP en la base de datos (Turso), creando una tabla `codigos_recuperacion`:
```sql
CREATE TABLE IF NOT EXISTS codigos_recuperacion (
  email TEXT PRIMARY KEY,
  codigo TEXT NOT NULL,
  expira_en INTEGER NOT NULL,
  intentos INTEGER DEFAULT 0,
  verificado INTEGER DEFAULT 0
);
```

---

### 3. Secretos hardcodeados en el código fuente
**Archivos:**
- `server/config/auth.js` (línea 7) — JWT_SECRET fallback hardcodeado
- `server/config/auth.js` (línea 17) — `ADMIN_ACCESS_KEY` hardcodeada
- `server/routes/authRoutes.js` (línea 30) — Google Client ID hardcodeado

**Severidad:** 🔴 Crítica

```javascript
// ❌ Secretos visibles en el código fuente (que está en GitHub)
const JWT_SECRET = process.env.JWT_SECRET || "citrifresh_secret_key_super_segura_desarrollo_2026";
const ADMIN_ACCESS_KEY = process.env.ADMIN_ACCESS_KEY || "CITRI_MASTER_ADMIN_2026!";
googleClientId: process.env.GOOGLE_CLIENT_ID || "1096747808728-qs9egm..."
```

Si alguien lee el repo, puede:
- Firmar tokens JWT válidos con cualquier rol.
- Registrar cuentas admin/auditor sin autorización.

**Solución:** Eliminar todos los valores fallback y lanzar un error si la variable de entorno no existe en producción:
```javascript
if (!process.env.JWT_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET es obligatorio en producción");
}
```

---

## 🟠 Problemas Altos

### 4. `postMessage` con `targetOrigin: '*'` (XSS vulnerable)
**Archivo:** `server/routes/authRoutes.js` (líneas 51-55)
**Severidad:** 🟠 Alta

```javascript
// ❌ Cualquier ventana puede interceptar este mensaje
window.opener.postMessage({
  type: 'GOOGLE_AUTH_SUCCESS',
  access_token: accessToken,
  id_token: idToken
}, '*');  // ← debería ser el origen exacto de tu app
```

**Solución:** Reemplazar `'*'` con tu dominio:
```javascript
window.opener.postMessage({...}, 'https://tu-dominio-vercel.app');
```

---

### 5. Transacciones con Turso — `BEGIN/COMMIT/ROLLBACK` no funciona
**Archivo:** `server/models/pedidoModel.js` (líneas 9-82)
**Severidad:** 🟠 Alta

El modelo de pedidos usa `BEGIN TRANSACTION` / `COMMIT` / `ROLLBACK` directamente. Sin embargo, el wrapper de Turso (`wrapLibsqlClient`) en `server/config/db.js` ejecuta cada sentencia como una petición HTTP independiente. **Las transacciones no funcionan así con Turso** — si el `COMMIT` falla o la conexión se cae, la transacción queda en un estado inconsistente.

**Solución:** Usar `client.batch()` de Turso para agrupar operaciones atómicas, o añadir un método `transaction()` al wrapper.

---

### 6. El endpoint `/api/auth/ultimo-correo-enviado` expone códigos OTP
**Archivo:** `server/routes/authRoutes.js` (línea 69)
**Severidad:** 🟠 Alta

Este endpoint es **público** (no tiene `verifyToken`) y devuelve el último código OTP enviado incluyendo el código en texto plano y el HTML del correo. Cualquier persona puede llamar a esta ruta y obtener el código de recuperación de otro usuario.

```javascript
// ❌ Ruta pública que expone datos sensibles
router.get("/ultimo-correo-enviado", obtenerUltimoCorreo);
```

**Solución:** Eliminar esta ruta en producción o protegerla con `verifyToken` + `requireRole("admin")`.

---

### 7. `JWT_EXPIRES_IN` definido pero no se usa
**Archivo:** `server/config/auth.js` (línea 15) vs `server/controllers/authController.js` (línea 69)
**Severidad:** 🟠 Alta

Se define `JWT_EXPIRES_IN` como configuración centralizada, pero en el controlador se hardcodea `"1d"` en cada llamada a `jwt.sign`:

```javascript
// auth.js
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d"; // ← Se define

// authController.js (en register, login y googleAuth)
jwt.sign({ id, rol }, JWT_SECRET, { expiresIn: "1d" }); // ← Se ignora JWT_EXPIRES_IN
```

**Solución:** Usar `JWT_EXPIRES_IN` en lugar del string `"1d"`:
```javascript
jwt.sign({ id, rol }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
```

---

### 8. CORS demasiado permisivo en producción
**Archivo:** `server/middlewares/corsMiddleware.js` (líneas 44-47)
**Severidad:** 🟠 Alta

En producción, se permite automáticamente **cualquier** subdominio de `.vercel.app`, `.onrender.com`, `.railway.app` y `.netlify.app`:

```javascript
// ❌ Cualquier app desplegada en Vercel puede acceder a tu API
if (/\.(vercel\.app|onrender\.com|railway\.app|netlify\.app)$/i.test(origin)) {
  return callback(null, true);
}
```

Esto significa que `hacker-app.vercel.app` puede hacer peticiones a tu API con las cookies del usuario.

**Solución:** Reemplazar con tu dominio exacto de producción en `ALLOWED_ORIGINS`.

---

## 🟡 Problemas Medios

### 9. `eliminar` en productoModel borra items de pedidos sin validación
**Archivo:** `server/models/productoModel.js` (líneas 140-146)

```javascript
// ❌ Elimina la historia de pedidos sin preguntar
async eliminar(id) {
    await db.run("DELETE FROM pedidos_items WHERE producto_id = ?", [id]);
    // ...
}
```

Al eliminar un producto, se borran todos los registros históricos de pedidos que lo contenían, destruyendo la trazabilidad de las ventas.

**Solución:** Usar soft-delete (agregar columna `activo` al producto) o mantener un snapshot del nombre/precio en `pedidos_items`.

---

### 10. `findByEmail` devuelve `password_hash` y se usa en login sin filtrar
**Archivo:** `server/models/usuarioModel.js` (líneas 4-10)

El método `findByEmail` devuelve **todos los campos incluyendo `password_hash`**. Se usa tanto para login (necesita el hash) como para verificar si un email ya existe al registrar (no lo necesita). En `register` el hash se devuelve potencialmente al frontend a través del objeto `nuevoUsuario`.

**Solución:** Crear un método separado `existsByEmail` que solo devuelva `id` y `email`.

---

### 11. `eliminarUsuario` no verifica si el usuario existe antes de borrar
**Archivo:** `server/controllers/authController.js` (líneas 290-304)

No se verifica si el usuario con ese `id` existe antes de intentar eliminarlo. Si no existe, la respuesta será `200 OK` con `cambios: 0`, lo cual es confuso.

**Solución:** Verificar existencia antes de borrar y devolver `404` si no existe.

---

### 12. `sameSite: "lax"` no envía cookies en peticiones cross-origin
**Archivo:** `server/config/auth.js` (líneas 21-26)

Si tu frontend está en un dominio diferente al backend (ej: `citri-fresh.vercel.app` sirve frontend, pero la API es otra URL), las cookies con `sameSite: "lax"` **no se enviarán** en peticiones `POST`/`PUT`/`DELETE` cross-origin.

**Solución:** Si frontend y backend están en el mismo dominio, `lax` está bien. Si están en dominios distintos, considerar `sameSite: "none"` (requiere `secure: true`).

---

### 13. `initSchema` usa `fs.readFileSync` — posible fallo en Turso/Vercel
**Archivo:** `server/config/db.js` (líneas 62-67)

Cuando se conecta a Turso, `initSchema` intenta leer el archivo `schema.sql` del disco local con `fs.existsSync`. En Vercel, el archivo empaquetado puede o no estar disponible dependiendo de cómo se construya el bundle. Además, si `schema.sql` no se encuentra, cae al fallback embebido que carece del índice `idx_pedidos_fecha` presente en el archivo real.

**Solución:** Siempre usar el schema embebido o asegurar que `schema.sql` se incluya en los archivos desplegados.

---

### 14. `seed.js` tiene datos de seed duplicados con `db.js`
**Archivos:** `scripts/seed.js` vs `server/config/db.js` (líneas 155-231)

Los mismos datos de semilla (usuarios, zonas, productos) están definidos en **dos lugares diferentes** (`db.js` línea 155+ y `scripts/seed.js`). Además, las zonas no coinciden:
- `db.js`: `["León", "Chinandega", "Carazo", "Rivas", "Masaya"]` (5 zonas)
- `seed.js`: `["León", "Chinandega", "Carazo", "Rivas"]` (4 zonas, falta Masaya)

**Solución:** Centralizar el seed en un solo archivo e importarlo desde ambos puntos.

---

## 🔵 Mejoras Recomendadas

### 15. El archivo `app.js` del frontend tiene 88KB — es un monolito
**Archivo:** `src/js/app.js` — **87,947 bytes**

Todo el JavaScript del frontend está en un solo archivo gigante. Esto afecta la mantenibilidad y el rendimiento de carga.

**Recomendación:** Dividir en módulos por funcionalidad (`auth.js`, `carrito.js`, `productos.js`, `admin.js`, etc.).

---

### 16. No hay logging estructurado
Se usa `console.log` / `console.error` en todo el proyecto. En producción no hay forma de filtrar, buscar o monitorear errores eficientemente.

**Recomendación:** Adoptar una librería como `pino` o `winston` con niveles de log.

---

### 17. No hay tests automatizados
El script de test en `package.json` es un placeholder:
```json
"test": "echo \"Error: no test specified\" && exit 1"
```

**Recomendación:** Agregar al menos tests de integración para los endpoints críticos (auth, pedidos).

---

### 18. Falta validación de longitud máxima en inputs
Los middlewares de validación verifican campos vacíos pero no limitan la longitud máxima. Un usuario podría enviar un `nombre` de 10,000 caracteres que se almacenaría directamente en SQLite.

**Recomendación:** Agregar validaciones de longitud máxima (ej: `nombre` max 100 caracteres, `descripcion` max 1000, `email` max 254).

---

## 📋 Tabla de Prioridades

| # | Hallazgo | Severidad | Esfuerzo | Prioridad |
|---|----------|-----------|----------|-----------|
| 1 | Google JWT sin verificar firma | 🔴 | Medio | **Urgente** |
| 2 | OTP en memoria (no funciona en Vercel) | 🔴 | Medio | **Urgente** |
| 3 | Secretos hardcodeados en código | 🔴 | Bajo | **Urgente** |
| 6 | Endpoint público expone código OTP | 🟠 | Bajo | **Muy alta** |
| 5 | Transacciones rotas con Turso | 🟠 | Alto | **Alta** |
| 4 | `postMessage` con `*` | 🟠 | Bajo | **Alta** |
| 7 | `JWT_EXPIRES_IN` no se usa | 🟠 | Bajo | **Alta** |
| 8 | CORS wildcard en producción | 🟠 | Bajo | **Alta** |
| 9 | Eliminar producto borra historial | 🟡 | Medio | Media |
| 13 | `initSchema` con `fs` en Turso | 🟡 | Medio | Media |
| 14 | Seed duplicado e inconsistente | 🟡 | Bajo | Media |
| 12 | Cookie `sameSite` cross-origin | 🟡 | Bajo | Media |
| 10 | `password_hash` expuesto | 🟡 | Bajo | Media |
| 11 | Delete sin verificar existencia | 🟡 | Bajo | Media |
| 15 | Frontend monolito 88KB | 🔵 | Alto | Baja |
| 16 | Sin logging estructurado | 🔵 | Medio | Baja |
| 17 | Sin tests automatizados | 🔵 | Alto | Baja |
| 18 | Sin validación de longitud máxima | 🔵 | Bajo | Baja |

---

## ✅ Lo que está bien hecho

- **Arquitectura MVC clara**: Separación limpia en `routes → controllers → models → config`
- **Middlewares de validación**: Cada ruta tiene su validador dedicado
- **Rate limiting**: Bien configurado con límites diferentes para auth vs general
- **Validación de email con DNS**: El `emailValidator.js` es una implementación robusta
- **Protección por roles**: Sistema de roles bien implementado con middleware reutilizable
- **Manejo de errores global**: Middleware centralizado para errores y 404
- **Seeds de datos**: Auto-inicialización en primer arranque
- **`.gitignore` completo**: Bien estructurado, excluye `.env` y `.db`
