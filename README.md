[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Hackathon](https://img.shields.io/badge/Hackathon-2026-orange.svg)](#hackathon-2026)
[![Status](https://img.shields.io/badge/Status-Activo-brightgreen)](https://github.com/Citri-Coders/Citri-Fresh)

---

# CITRI-FRESH

> **Plataforma Digital para la Comercialización Directa de Cítricos en Nicaragua**

---

## 🏆 Hackathon 2026

**Citri-Fresh** es un proyecto desarrollado en el marco del **Hackathon 2026** por el equipo **Citri-Coders**. Nuestro propósito es digitalizar e impulsar la cadena de valor agrocomercial nicaragüense, conectando directamente a productores de cítricos (León, Masaya, Carazo, Chinandega) con compradores comerciales y consumidores finales mediante tecnología web accesible, moderna y segura.

---

## Tabla de Contenido

- [Hackathon 2026](#-hackathon-2026)
- [Descripción del Proyecto](#descripción-del-proyecto)
- [Problema que Resolvemos](#problema-que-resolvemos)
- [Nuestra Solución](#nuestra-solución)
- [Tecnologías y Herramientas Utilizadas](#tecnologías-y-herramientas-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación Rápida](#instalación-rápida)
- [Configuración](#configuración)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Contribución](#contribución)
- [Testing](#testing)
- [Despliegue](#despliegue)
- [Licencia](#licencia)
- [Contacto](#contacto)

---

## Descripción del Proyecto

Citri-Fresh es una plataforma digital innovadora diseñada para conectar directamente a los productores de cítricos en Nicaragua con los consumidores finales. Nuestro objetivo es eliminar los intermediarios en la cadena de suministro, reduciendo costos y garantizando que los agricultores reciban un precio justo por sus productos, mientras que los consumidores obtienen cítricos frescos y de alta calidad a precios accesibles.

Este proyecto nace como respuesta a los desafíos que enfrentan los pequeños y medianos productores de cítricos en el país, donde la falta de acceso a mercados directos y la dependencia de intermediarios resultan en pérdidas significativas de ingresos y desperdicio de productos.

**Evento:** Hackathon 2026  
**Equipo:** Citri-Coders  

---

## Problema que Resolvemos

La industria citrícola en Nicaragua enfrenta varios desafíos críticos:

- **Pérdidas post-cosecha:** Según la FAO, entre el 15% y 40% de la producción de frutas y hortalizas se pierde después de la cosecha debido a la falta de infraestructura adecuada y canales de distribución eficientes.
- **Intermediarios:** Los agricultores reciben solo el 30-40% del precio final de venta, ya que múltiples intermediarios incrementan el costo al consumidor.
- **Falta de acceso a mercados:** Los pequeños productores carecen de plataformas para vender directamente a consumidores o restaurantes.
- **Desperdicio de productos:** La sobreproducción y la falta de compradores resultan en pérdidas económicas para los agricultores.
- **Falta de transparencia:** Los agricultores no tienen visibilidad sobre los precios de mercado o la demanda real.

---

## Nuestra Solución

Citri-Fresh ofrece una solución integral a través de una plataforma digital que incluye:

- **Mercado en Línea:** Plataforma donde los productores pueden listar sus productos y los consumidores pueden comprarlos directamente.
- **Sistema de Gestión de Roles:**
  - **Invitado / Visitante:** Visualización de catálogo, detalles de productos e historia de la plataforma.
  - **Cliente / Comprador:** Acceso a carrito de compras con cálculos de impuestos y envío, panel de pedidos y favoritos.
  - **Productor Citrícola:** Panel del productor con métricas de ventas, inventario por zonas y formulario interactivo para registrar y publicar cosechas.
- **Autenticación y Seguridad:** Módulo de inicio de sesión y registro con diseño split-card moderno y control de acceso basado en roles.
- **Trazabilidad y Calidad:** Información de calibre, grados Brix, región de origen y certificaciones (Global GAP).

---

## Tecnologías y Herramientas Utilizadas

### Frontend
- **HTML5 Semántico:** Estructura accesible y optimizada para SEO.
- **Vanilla CSS3 Modular:** Arquitectura de estilos con Design Tokens (`variables.css`), Reset, Layout, Componentes, Navigation, Dashboard, Cart, Catalog y Auth.
- **JavaScript (ES6+):** Gestión de sesión en cliente (`CitriAuth`), filtrado reactivo de productos, preview de imágenes y micro-interacciones.
- **Google Material Symbols & Google Fonts (Kiona & Mont):** Iconografía y tipografía corporativa.

### Backend & API
- **Node.js (v18+ / v20+):** Entorno de ejecución del servidor.
- **Express.js (v4):** Framework para enrutamiento, servicio de archivos estáticos y API REST.
- **SQLite3 & Better-SQLite3:** Base de datos relacional ligera embebida con esquema relacional.
- **CORS & Dotenv:** Seguridad de orígenes permitidos y gestión de variables de entorno.

### Herramientas de Desarrollo y Diseño
- **Git & GitHub:** Control de versiones y colaboración de equipo.
- **Visual Studio Code / Antigravity IDE:** Entorno de desarrollo integrado.
- **Figma / Adobe Suite:** Diseño UI/UX, paleta de colores y manual de identidad.
- **Postman / cURL:** Pruebas y verificación de endpoints API.

---

## Estructura del Proyecto

```
citri-fresh/
├── .env.example              # Plantilla de variables de entorno
├── .gitignore                # Archivos y carpetas ignorados por Git
├── LICENSE                   # Licencia MIT del proyecto
├── README.md                 # Documentación principal del proyecto
├── package.json              # Configuración del proyecto y dependencias npm
├── package-lock.json         # Árbol de dependencias bloqueadas
├── server.js                 # Servidor principal Express
├── db/
│   └── schema.sql            # Esquema SQL de base de datos
├── design/                   # Recursos de diseño y manual de identidad
├── docs/                     # Documentación técnica adicional
├── marketing/                # Estrategia de mercado, branding y pitch
├── public/
│   └── images/               # Imágenes estáticas y favicon servidos al cliente
├── scripts/                  # Scripts de utilidades
├── server/
│   ├── models/
│   │   └── database.js       # Conexión y modelos de base de datos
│   ├── routes/
│   │   └── productos.js      # Endpoints de la API para productos
│   └── middleware/           # Middlewares del servidor
└── src/
    ├── css/
    │   ├── reset.css         # Reset de estilos
    │   ├── variables.css     # Design Tokens y variables de diseño
    │   ├── fonts.css         # Definición de fuentes locales e iconos
    │   ├── base.css          # Estilos base
    │   ├── layout.css        # Sistema de rejillas y contenedores
    │   ├── components.css    # Botones, tarjetas, inputs y badges
    │   ├── nav.css           # Barra de navegación principal y responsive
    │   ├── hero.css          # Secciones hero y portadas
    │   ├── catalog.css       # Estilos de catálogo y filtros
    │   ├── cart.css          # Estilos del carrito y checkout
    │   ├── dashboard.css     # Paneles de control y métricas
    │   ├── footer.css        # Pie de página con logotipo
    │   ├── styles.css        # Hoja de estilos global
    │   └── pages/
    │       ├── auth.css      # Estilos modernos para login y registro
    │       ├── catalogo.css  # Estilos específicos de catálogo
    │       └── home.css      # Estilos de página de inicio
    ├── img/
    │   └── auth/             # Animaciones y recursos visuales
    ├── js/
    │   ├── app.js            # Lógica global, control de sesión y roles
    │   └── pages/
    │       └── catalogo.js   # Búsqueda, filtros y paginación
    └── pages/
        ├── inicio.html           # Página principal / Landing
        ├── producto.html         # Catálogo de cítricos
        ├── detalle_producto.html # Ficha técnica y compra detallada
        ├── nosotros.html         # Misión, visión e historia
        ├── carrito.html          # Carrito de compras (Perfil Cliente)
        ├── perfil.html           # Panel de usuario / Historial (Perfil Cliente)
        ├── panel_productor.html  # Panel de gestión y métricas (Perfil Productor)
        ├── registro_cosecha.html # Formulario de publicación (Perfil Productor)
        ├── registro.html         # Formulario de registro de cuentas
        └── auth/
            └── login.html        # Inicio de sesión moderno con split-card
```

---

## Instalacion Rapida

Sigue estos pasos para configurar el proyecto localmente.

### Requisitos Previos
- Node.js (version 18 o superior)
- npm (gestor de paquetes de Node.js)
- Git
- SQLite3 (se instala automaticamente con npm)

### Pasos de Instalacion

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/Citri-Coders/Citri-Fresh.git
   ```

2. **Navega al directorio del proyecto:**
   ```bash
   cd Citri-Fresh
   ```

3. **Instala las dependencias:**
   ```bash
   npm install
   ```

4. **Configura las variables de entorno:**
   ```bash
   cp .env.example .env
   ```
   
   Edita el archivo `.env` y configura las siguientes variables:
   ```env
   PORT=3000
   JWT_SECRET=tu_clave_secreta_segura
   DATABASE_PATH=./db/citri-fresh.db
   ```

5. **Inicializa la base de datos:**
   ```bash
   sqlite3 $(cat .env | grep DATABASE_PATH | cut -d'=' -f2) < db/schema.sql
   ```
   O alternativamente:
   ```bash
   cat db/schema.sql | sqlite3 db/citri-fresh.db
   ```

6. **(Opcional) Carga datos de prueba:**
   ```bash
   node scripts/seed.js
   ```

---

## Configuracion

### Variables de Entorno

| Variable | Descripcion | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3000` |
| `JWT_SECRET` | Clave secreta para JWT | `tu_clave_secreta_segura` |
| `DATABASE_PATH` | Ruta a la base de datos SQLite | `./db/citri-fresh.db` |

### Scripts Disponibles

| Script | Descripcion |
|--------|-------------|
| `npm start` | Inicia el servidor en modo produccion |
| `npm run dev` | Inicia el servidor con recarga automatica (nodemon) |

---

## Uso

### Iniciar la Aplicacion

1. **Modo Desarrollo:**
   ```bash
   npm run dev
   ```

2. **Modo Produccion:**
   ```bash
   npm start
   ```

3. **Acceder a la aplicacion:**
   Abre tu navegador y navega a:
   ```
   http://localhost:3000
   ```

### Funcionalidades Principales

- **Registro y Autenticación:** Módulo con interfaz moderna para compradores y productores citrícolas con control de sesión `CitriAuth`.
- **Catálogo de Cítricos:** Exploración de productos con filtros por categoría (Naranjas, Limones, Mandarinas), búsqueda y tarjetas interactivas.
- **Ficha Técnica Detallada:** Visualización de calibre, grados Brix, tipo de envase y origen del cultivo.
- **Carrito de Compras (Exclusivo Compradores):** Control de acceso seguro, cálculo de subtotal, IVA (15%) y costos de envío.
- **Panel del Productor:** Visualización de métricas de rendimiento semanal, pedidos activos y estado crítico de inventario.
- **Registro y Publicación de Cosechas:** Formulario con subida y previsualización de imágenes para listar productos directamente.

---

## API Endpoints

### Autenticacion
| Metodo | Endpoint | Descripcion | Requiere Auth |
|--------|----------|-------------|---------------|
| POST | `/api/login` | Iniciar sesion y obtener JWT | No |
| POST | `/api/usuarios` | Registrar nuevo usuario | No |

### Productos
| Metodo | Endpoint | Descripcion | Requiere Auth | Rol |
|--------|----------|-------------|---------------|-----|
| GET | `/api/productos` | Listar todos los productos | No | - |
| GET | `/api/productos/:id` | Obtener producto por ID | No | - |
| POST | `/api/productos` | Crear nuevo producto | Si | Productor, Admin |

### Pedidos
| Metodo | Endpoint | Descripcion | Requiere Auth | Rol |
|--------|----------|-------------|---------------|-----|
| GET | `/api/pedidos` | Listar pedidos (todos si admin, solo propios si usuario) | Si | Todos |
| POST | `/api/pedidos` | Crear nuevo pedido | Si | Usuario |
| PUT | `/api/pedidos/:id` | Actualizar estado del pedido | Si | Admin |

### Usuarios
| Metodo | Endpoint | Descripcion | Requiere Auth | Rol |
|--------|----------|-------------|---------------|-----|
| GET | `/api/usuarios` | Listar todos los usuarios | Si | Admin |

### Zonas
| Metodo | Endpoint | Descripcion | Requiere Auth |
|--------|----------|-------------|---------------|
| GET | `/api/zonas` | Listar todas las zonas geograficas | No |

### Metricas (Admin)
| Metodo | Endpoint | Descripcion | Requiere Auth | Rol |
|--------|----------|-------------|---------------|-----|
| GET | `/api/metricas` | Obtener metricas del sistema | Si | Admin |

**Documentacion completa:** [Ver docs/api.md](docs/api.md)

---

## Contribucion

Las contribuciones son bienvenidas y apreciadas. Para contribuir a este proyecto, sigue estos pasos:

### Como Contribuir

1. **Haz un fork del repositorio:**
   Haz clic en el boton "Fork" en la parte superior derecha de la pagina del repositorio en GitHub.

2. **Clona tu fork localmente:**
   ```bash
   git clone https://github.com/TU-USUARIO/Citri-Fresh.git
   ```

3. **Crea una rama para tu funcionalidad o correccion:**
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
   o para correcciones:
   ```bash
   git checkout -b fix/descripcion-de-la-correccion
   ```

4. **Realiza commit de tus cambios:**
   ```bash
   git commit -m "Añade nueva funcionalidad: descripcion clara"
   ```

5. **Envía un Pull Request:**
   Ve a tu repositorio en GitHub, selecciona tu rama y haz clic en "Pull Request" para enviar tus cambios al repositorio principal.

### Estandares de Código

- Usa **ESLint** para el formateo de código JavaScript.
- Sigue las convenciones de **camelCase** para variables y funciones.
- Usa **PascalCase** para clases y componentes.
- Asegúrate de que tu código esté bien documentado con comentarios claros.
- Escribe pruebas unitarias para nuevas funcionalidades cuando sea posible.
- Sigue el principio **DRY** (Don't Repeat Yourself).

### Estructura de Commits

Usa mensajes de commit descriptivos y sigue el formato:
```
tipo(ambito): descripcion

Ejemplos:
- feat(api): añade endpoint GET /api/productos
- fix(auth): corrige validacion de token JWT
- docs(readme): actualiza instrucciones de instalacion
- refactor(db): mejora estructura de modelos
```

### Reportar Problemas

Si encuentras un error o tienes una sugerencia, por favor abre un **Issue** en el repositorio de GitHub:

1. Ve a la pestaña "Issues" en el repositorio.
2. Haz clic en "New Issue".
3. Proporciona una descripcion clara y detallada del problema.
4. Incluye pasos para reproducir el error, si es aplicable.
5. Agrega etiquetas apropiadas (bug, enhancement, documentation, etc.).

---

## Testing

### Testing Manual

Puedes probar la API manualmente usando herramientas como **Postman**, **Insomnia** o **cURL**:

```bash
# Ejemplo: Obtener todos los productos
curl -X GET http://localhost:3000/api/productos

# Ejemplo: Iniciar sesion
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@ejemplo.com", "password": "contraseña"}'
```

### Casos de Prueba Documentados

Para ver los casos de prueba completos, consulta:
- [docs/testing.md](docs/testing.md) - Casos de prueba detallados
- [API Documentation](docs/api.md) - Ejemplos de requests y responses

### Testing Automático

El proyecto incluye testing manual de endpoints. Para ejecutar pruebas:

1. Asegúrate de que el servidor esté en ejecución.
2. Usa las herramientas mencionadas para probar cada endpoint.
3. Documenta los resultados en [docs/testing.md](docs/testing.md).

---

## Despliegue

### Despliegue en Produccion (Oracle Cloud Free Tier)

1. **Crear instancia en Oracle Cloud:**
   - Selecciona una instancia con Ubuntu 22.04 LTS
   - Configura el firewall para permitir HTTP (80), HTTPS (443) y SSH (22)

2. **Instalar dependencias en el servidor:**
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm git sqlite3 nginx certbot python3-certbot-nginx
   ```

3. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Citri-Coders/Citri-Fresh.git
   cd Citri-Fresh
   ```

4. **Instalar dependencias del proyecto:**
   ```bash
   npm install --production
   ```

5. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   nano .env  # Edita con tus valores
   ```

6. **Inicializar la base de datos:**
   ```bash
   sqlite3 $(cat .env | grep DATABASE_PATH | cut -d'=' -f2) < db/schema.sql
   ```

7. **Configurar PM2:**
   ```bash
   npm install -g pm2
   pm2 start server.js --name citri-fresh
   pm2 save
   pm2 startup
   ```

8. **Configurar Nginx como Proxy Inverso:**
   ```bash
   sudo nano /etc/nginx/sites-available/citri-fresh
   ```
   
   Agrega la siguiente configuracion:
   ```nginx
   server {
       listen 80;
       server_name tu-dominio.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   Habilita el sitio:
   ```bash
   sudo ln -s /etc/nginx/sites-available/citri-fresh /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

9. **Configurar SSL con Let's Encrypt:**
   ```bash
   sudo certbot --nginx -d tu-dominio.com
   sudo certbot renew --dry-run
   ```

10. **Acceder a la aplicacion:**
    Abre tu navegador y navega a:
    ```
    https://tu-dominio.com
    ```

---

## Licencia

Este proyecto esta licenciado bajo la **Licencia MIT**. Esto significa que puedes usar, copiar, modificar y distribuir este software libremente, siempre y cuando incluyas el aviso de copyright original y esta declaracion de licencia en todas las copias.

Para mas detalles, consulta el archivo [LICENSE](LICENSE) en el repositorio.

---

## Contacto

Para preguntas, soporte o colaboraciones, puedes contactarnos a traves de:

- **Correo Electronico:** citricoders@gmail.com
- **GitHub:** [Citri-Coders](https://github.com/Citri-Coders)
- **Repositorio:** [Citri-Fresh](https://github.com/Citri-Coders/Citri-Fresh)

---

**Gracias por tu interes en Citri-Fresh. Juntos podemos revolucionar la comercializacion de citricos en Nicaragua.**