<div align="center">

# 🍊 CITRI-FRESH
### *Ecosistema Digital para la Comercialización Directa de Cítricos en Nicaragua*

[![License: MIT](https://img.shields.io/badge/License-MIT-F59E0B.svg?style=for-the-badge&logo=opensourceinitiative&logoColor=white)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-10B981.svg?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-4.18-000000.svg?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57.svg?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000.svg?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Hackathon](https://img.shields.io/badge/Hackathon-2026-EA580C.svg?style=for-the-badge&logo=target&logoColor=white)](#-hackathon-2026)

<p align="center">
  <b>Conectando fincas agrícolas con compradores directos, eliminando intermediarios y garantizando comercio justo y trazabilidad en el campo nicaragüense.</b>
</p>

[Explorar Catálogo](https://github.com/Citri-Coders/Citri-Fresh) • [Documentación de API](#-api-endpoints) • [Instalación Local](#-instalación-rápida) • [Despliegue](#-despliegue-en-producción)

---

</div>

## 📌 Tabla de Contenidos

1. [🏆 Hackathon 2026 & Visión](#-hackathon-2026)
2. [🌱 El Problema vs Nuestra Solución](#-el-problema-vs-nuestra-solución)
3. [👥 Matriz de Roles y Accesos](#-matriz-de-roles-y-accesos)
4. [🛠️ Stack Tecnológico](#️-stack-tecnológico)
5. [📂 Arquitectura del Repositorio](#-arquitectura-del-repositorio)
6. [🚀 Instalación y Puesta en Marcha](#-instalación-y-puesta-en-marcha)
7. [📡 API REST Endpoints](#-api-endpoints)
8. [☁️ Despliegue en Producción (Vercel & Servidor Dedicado)](#-despliegue-en-producción)
9. [🔒 Seguridad, Resiliencia y PWA](#-seguridad-resiliencia-y-pwa)
10. [👥 Equipo y Contacto](#-equipo-y-contacto)

---

## 🏆 Hackathon 2026

**Citri-Fresh** nace en el marco del **Hackathon 2026**, diseñado y construido por el equipo **Citri-Coders**. Nuestro propósito fundamental es acelerar la transformación digital del sector citrícola en Nicaragua (abarcando las zonas productivas de León, Chinandega, Carazo y Rivas), proveyendo una suite tecnológica accesible tanto desde dispositivos móviles en el campo como desde centros de distribución y hogares urbanos.

```mermaid
graph LR
    Finca[👨‍🌾 Finca Citrícola] -->|Publicación directa| Plataforma[🍊 Plataforma Citri-Fresh]
    Auditor[🔍 Auditor de Calidad] -->|Inspección y Trazabilidad| Plataforma
    Plataforma -->|Precios transparentes y sin intermediarios| Comprador[🛒 Cliente / Restaurante]
    Admin[⚙️ Administrador] -->|Monitoreo y Métricas| Plataforma
```

---

## 🌱 El Problema vs Nuestra Solución

| Desafío del Sector Tradicional | Solución Citri-Fresh |
|---|---|
| **Pérdida por Intermediación:** El agricultor recibe apenas el 30% del precio final. | **Venta Directa Punto a Punto:** El productor fija su precio y retiene hasta un 85-90% del valor comercial. |
| **Opacidad y Falta de Trazabilidad:** Desconocimiento del origen, variedad y frescura. | **Ficha Técnica Citrícola:** Detalle de región de cultivo, grados Brix, calibre, fecha de corte y certificaciones (Global GAP). |
| **Pérdida Post-Cosecha:** Fruta que se pierde por falta de canales comerciales rápidos. | **Mercado y Catálogo Reactivo:** Notificación y oferta inmediata de cosechas listas para recolección. |
| **Desconexión Tecnológica:** Brecha digital en zonas rurales. | **PWA Offline-First:** Sincronización en segundo plano (`CitriSync`) cuando el productor recupera conectividad celular. |

---

## 👥 Matriz de Roles y Accesos

El sistema implementa **RBAC (Role-Based Access Control)** integral con protección dual por cookies `HttpOnly` y middleware de servidor:

```
┌─────────────────┬────────────────────────────────────────────────────────────────────────┐
│ Rol             │ Capacidades y Entorno Asignado                                         │
├─────────────────┼────────────────────────────────────────────────────────────────────────┤
│ 🛒 Cliente      │ Catálogo completo, carrito dinámico (IVA 15% + flete), historial y     │
│                 │ seguimiento de órdenes de compra en tiempo real.                       │
├─────────────────┼────────────────────────────────────────────────────────────────────────┤
│ 👨‍🌾 Productor    │ Dashboard agrícola con ingresos semanales, inventario por calibres,    │
│                 │ registro de nuevas cosechas con fotos y actualización de pedidos.      │
├─────────────────┼────────────────────────────────────────────────────────────────────────┤
│ 🔍 Auditor      │ Vista fiscalizadora en modo sólo lectura de todas las operaciones,     │
│                 │ usuarios y cosechas, con emisión y exportación de Dictamen de Calidad. │
├─────────────────┼────────────────────────────────────────────────────────────────────────┤
│ 🛡️ Administrador│ Panel maestro de métricas globales, administración de usuarios, zonas, │
│                 │ catálogo general y geolocalización de áreas productivas.               │
└─────────────────┴────────────────────────────────────────────────────────────────────────┘
```

> 💡 **Credenciales demo:** El sistema inicializa automáticamente usuarios para cada rol en bases de datos limpias para evaluación rápida por evaluadores y jurado.

---

## 🛠️ Stack Tecnológico

### Frontend (Modern Vanilla Architecture)
- **HTML5 Semántico & Accesible:** Estructura modular preparada para lectores de pantalla y optimizada para SEO.
- **Vanilla CSS3 Modular:** Design tokens (`variables.css`), grids responsivas, animaciones sutiles, micro-interacciones y tema oscuro/claro adaptable.
- **JavaScript Moderno (ESModules):** Control de estado en cliente con `CitriAuth`, sincronización de pedidos `CitriSync` y carrito reactivo.
- **PWA Ready:** Service Worker registrado para cacheo de assets estáticos y funcionamiento offline en el campo.

### Backend & API REST
- **Node.js (v18+) & Express.js (v4):** Servidor HTTP rápido y liviano estructurado bajo patrón **Controlador - Servicio - Modelo**.
- **SQLite3 & sqlite (async/await):** Base de datos relacional embebida, con soporte para inicialización en memoria/disco efímero (`/tmp`) en arquitecturas Serverless.
- **Seguridad HTTP:** `bcrypt` (10 rounds) para hashing de contraseñas, tokens JWT en cookies `HttpOnly`, `cors` adaptativo para dominios locales y de nube, y `express-rate-limit` para defensa contra fuerza bruta.

---

## 📂 Arquitectura del Repositorio

```text
citri-fresh/
├── db/
│   └── schema.sql              # Esquema DDL relacional (zonas, usuarios, productos, pedidos)
├── public/
│   └── images/                 # Favicons, iconografía y logotipos oficiales
├── scripts/
│   ├── init-db.js              # Script CLI para creación de tablas
│   └── seed.js                 # Sembrado de datos demo e índices
├── server/
│   ├── config/
│   │   └── db.js               # Conexión resiliente SQLite con migración y auto-seed
│   ├── controllers/            # Lógica de negocio (auth, productos, pedidos, zonas)
│   ├── middlewares/            # JWT auth, RBAC, rate-limiting, CORS y validaciones
│   ├── models/                 # Capa de abstracción y consultas SQL parametrizadas
│   ├── routes/                 # Enrutadores Express (/api/auth, /api/productos, etc.)
│   ├── services/               # Notificaciones y servicios complementarios
│   ├── utils/                  # Validadores de correo y generadores de hash
│   └── app.js                  # Configuración de Express, middlewares y rutas
├── src/                        # Frontend servido por Express
│   ├── css/                    # Estilos modulares organizados por componentes y páginas
│   ├── js/                     # Lógica de cliente, control de sesión y carrito
│   └── pages/                  # Vistas HTML (inicio, catálogo, perfil, productor, admin)
├── server.js                   # Punto de entrada para ejecución local (con fallback de puertos)
├── vercel.json                 # Configuración de despliegue Serverless en Vercel
├── .env.example                # Variables de entorno documentadas
└── package.json                # Dependencias y scripts de ejecución
```

---

## 🚀 Instalación y Puesta en Marcha

### Prerrequisitos
- [Node.js](https://nodejs.org/) `>= 18.0.0`
- [Git](https://git-scm.com/)

### 1. Clonar el repositorio
```bash
git clone https://github.com/Citri-Coders/Citri-Fresh.git
cd Citri-Fresh
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Variables de entorno
Copia la plantilla `.env.example` hacia `.env`:
```bash
cp .env.example .env
```
> En desarrollo local no requieres editar variables adicionales; el servidor levantará con valores por defecto seguros.

### 4. Inicializar Base de Datos (Opcional en local)
```bash
npm run db:init
npm run db:seed
```
*(Nota: El servidor cuenta con inicialización y siembra automática al primer arranque en caso de no existir la base de datos).*

### 5. Iniciar la aplicación

**Modo Desarrollo (con auto-reload):**
```bash
npm run dev
```

**Modo Producción:**
```bash
npm start
```

Visita **`http://localhost:3000`** (o el puerto alterno asignado en consola) para comenzar a explorar.

---

## 📡 API Endpoints

Todos los endpoints responden en formato JSON estándar.

### 🔐 Autenticación & Usuarios (`/api/auth`)
| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| `POST` | `/api/auth/register` | Registro de nuevos usuarios con rol cliente o productor | Público |
| `POST` | `/api/auth/login` | Autenticación con email/contraseña y cookie JWT | Público |
| `POST` | `/api/auth/logout` | Cierre de sesión y revocación de cookie | Autenticado |
| `GET` | `/api/auth/me` | Obtiene el perfil del usuario en sesión | Autenticado |
| `PUT` | `/api/auth/perfil` | Actualiza datos de perfil / datos de finca | Autenticado |
| `GET` | `/api/auth/usuarios` | Listado completo de usuarios registrados | Admin, Auditor |
| `DELETE` | `/api/auth/usuarios/:id`| Elimina un usuario del sistema | Admin |

### 🍊 Catálogo de Cítricos (`/api/productos`)
| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| `GET` | `/api/productos` | Catálogo filtrable por zona, productor y búsqueda | Público |
| `GET` | `/api/productos/:id` | Detalle técnico de un producto | Público |
| `POST` | `/api/productos` | Publicación de nueva cosecha cítrica | Productor, Admin |
| `PUT` | `/api/productos/:id` | Edición de precio, stock o datos técnicos | Productor, Admin |
| `DELETE` | `/api/productos/:id` | Baja de una cosecha del catálogo | Productor, Admin |

### 📦 Gestión de Pedidos (`/api/pedidos`)
| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| `POST` | `/api/pedidos` | Creación de pedido y cálculo de ítems | Cliente |
| `GET` | `/api/pedidos` | Pedidos del usuario (o todos si es Admin/Auditor) | Autenticado |
| `GET` | `/api/pedidos/:id` | Detalle con desglose de productos y productor | Autenticado |
| `PATCH` | `/api/pedidos/:id/estado` | Cambio de estado (`pendiente`, `pagado`, etc.) | Productor, Admin |

### 🗺️ Zonas Geográficas (`/api/zonas`)
| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| `GET` | `/api/zonas` | Zonas productivas registradas (León, Masaya, etc.) | Público |
| `POST` | `/api/zonas` | Creación de nueva zona | Admin |

---

## ☁️ Despliegue en Producción

### Despliegue Automatizado en Vercel
El repositorio incluye configuración nativa para Vercel mediante [`vercel.json`](vercel.json):
1. Vincula el repositorio de GitHub en tu dashboard de **[Vercel](https://vercel.com/)**.
2. Vercel detectará el proyecto y ejecutará [`server.js`](server.js) como Serverless Function vía `@vercel/node`.
3. La base de datos SQLite se almacena de forma aislada y resiliente en `/tmp/citrifresh.db`, auto-migrando y sembrando los usuarios demo de forma instantánea al primer arranque.

### Despliegue en Servidor Linux (VPS / Nginx / PM2)
```bash
# 1. En el servidor Linux
git clone https://github.com/Citri-Coders/Citri-Fresh.git
cd Citri-Fresh
npm install --omit=dev

# 2. Iniciar proceso en segundo plano con PM2
pm2 start server.js --name "citri-fresh"
pm2 save
pm2 startup
```

---

## 🔒 Seguridad, Resiliencia y PWA

- **Protección contra Fuerza Bruta:** Rate limiter diferenciado para el catálogo general (100 req/15min) y para los intentos de login (5 req/min).
- **Cookies Seguras:** Tokens JWT protegidos contra ataques XSS mediante banderas `HttpOnly`, `SameSite: 'lax'` y `secure` en producción.
- **Saneamiento y Validación:** Sanitización de strings, validación de contraseñas robustas y parametrización completa de consultas SQL (prevención de SQL Injections).
- **Offline Sync:** La cola local `CitriSync` almacena solicitudes cuando no hay cobertura y las sincroniza en cuanto el dispositivo recupera señal de red.

---

## 👥 Equipo y Contacto

Desarrollado con dedicación por el equipo **Citri-Coders** para el **Hackathon 2026**:

- ✉️ **Correo:** [citricoders@gmail.com](mailto:citricoders@gmail.com)
- 🐙 **Organización:** [GitHub - Citri-Coders](https://github.com/Citri-Coders)
- 📂 **Repositorio Oficial:** [Citri-Fresh](https://github.com/Citri-Coders/Citri-Fresh)

<div align="center">
  <sub>Licenciado bajo la <a href="LICENSE">Licencia MIT</a>. Hecho en Nicaragua 🇳🇮</sub>
</div>