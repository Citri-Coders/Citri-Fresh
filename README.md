[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Static Badge](https://img.shields.io/badge/Status-Activo-brightgreen)](https://github.com/Citri-Coders/Citri-Fresh)

---

# CITRI-FRESH

Plataforma Digital para la Comercializacion Directa de Citricos en Nicaragua

---

## Tabla de Contenido

- [Descripcion del Proyecto](#descripcion-del-proyecto)
- [Problema que Resolvemos](#problema-que-resolvemos)
- [Nuestra Solucion](#nuestra-solucion)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalacion Rapida](#instalacion-rapida)
- [Configuracion](#configuracion)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Contribucion](#contribucion)
- [Testing](#testing)
- [Despliegue](#despliegue)
- [Licencia](#licencia)
- [Contacto](#contacto)

---

## Descripcion del Proyecto

Citri-Fresh es una plataforma digital innovadora disenada para conectar directamente a los productores de citricos en Nicaragua con los consumidores finales. Nuestro objetivo es eliminar los intermediarios en la cadena de suministro, reduciendo costos y garantizando que los agricultores reciban un precio justo por sus productos, mientras que los consumidores obtienen citricos frescos y de alta calidad a precios accesibles.

Este proyecto nace como respuesta a los desafios que enfrentan los pequeños y medianos productores de citricos en el pais, donde la falta de acceso a mercados directos y la dependencia de intermediarios resultan en perdidas significativas de ingresos y desperdicio de productos.

**Duracion del Proyecto:** 7 semanas
**Equipo:** Dev 1 (Lider + Frontend), Dev 2 (Frontend), Dev 3 (Backend), Mercadologo, Comunicadora

---

## Problema que Resolvemos

La industria citricola en Nicaragua enfrenta varios desafios criticos:

- **Perdidas post-cosecha:** Segun la FAO, entre el 15% y 40% de la produccion de frutas y hortalizas se pierde despues de la cosecha debido a la falta de infraestructura adecuada y canales de distribucion eficientes.
- **Intermediarios:** Los agricultores reciben solo el 30-40% del precio final de venta, ya que multiples intermediarios incrementan el costo al consumidor.
- **Falta de acceso a mercados:** Los pequeños productores carecen de plataformas para vender directamente a consumidores o restaurantes.
- **Desperdicio de productos:** La sobreproduccion y la falta de compradores resultan en perdidas economicas para los agricultores.
- **Falta de transparencia:** Los agricultores no tienen visibilidad sobre los precios de mercado o la demanda real.

---

## Nuestra Solucion

Citri-Fresh ofrece una solucion integral a traves de una plataforma digital que incluye:

- **Mercado en Linea:** Plataforma donde los productores pueden listar sus productos y los consumidores pueden comprarlos directamente.
- **Sistema de Pedidos:** Funcionalidad para que los consumidores realicen pedidos y los productores los gestionen de manera eficiente.
- **Pagos Seguros:** Integracion con sistemas de pago electronico para transacciones seguras y transparentes.
- **Logistica Optimizada:** Sistema de coordinacion para la entrega directa de productos desde el productor al consumidor.
- **Informacion de Mercado:** Herramientas para que los productores accedan a datos de precios y demanda en tiempo real.
- **Sistema de Roles:** Diferenciacion entre administradores, productores y usuarios finales.
- **Autenticacion Segura:** Uso de JWT y bcrypt para gestion de usuarios.

---

## Tecnologias Utilizadas

### Frontend
- **HTML5** - Estructura semantica de las paginas
- **CSS3** - Estilos y diseño responsivo
- **JavaScript (ES6+)** - Logica del lado del cliente
- **CSS Variables** - Sistema de diseño consistente

### Backend
- **Node.js v18+** - Entorno de ejecucion
- **Express.js** - Framework para API REST
- **sqlite3** - Base de datos SQLite (ligera y eficiente)
- **JWT (JSON Web Tokens)** - Autenticacion de usuarios
- **bcrypt** - Hashing seguro de contrasenias
- **express-rate-limit** - Rate limiting para seguridad

### Herramientas de Desarrollo
- **Git** - Control de versiones
- **GitHub** - Alojamiento del repositorio y colaboracion
- **PM2** - Administrador de procesos para Node.js (produccion)
- **Nginx** - Proxy inverso (produccion)
- **Certbot + Let's Encrypt** - Certificados SSL (produccion)

### Despliegue
- **Oracle Cloud Free Tier** - Hosting en la nube

---

## Estructura del Proyecto

```
Citri-Fresh/
├── .env.example              # Ejemplo de variables de entorno
├── .gitignore                # Archivos ignorados por Git
├── LICENSE                   # Licencia MIT del proyecto
├── README.md                 # Este archivo
├── db/
│   └── schema.sql            # Esquema de la base de datos SQLite
├── design/
│   ├── moodboard/            # Inspiracion visual
│   ├── logos/                # Propuestas y version final del logo
│   ├── paleta-colores.md     # Paleta de colores oficial
│   ├── tipografia.md         # Tipografias seleccionadas
│   ├── wireframes/           # Esquemas de baja fidelidad
│   ├── iconos/               # Iconos personalizados
│   └── manual/               # Manual de marca
├── docs/
│   ├── api.md                # Documentacion de endpoints API
│   └── testing.md            # Casos de prueba y testing
├── marketing/
│   ├── branding/
│   │   └── valores.md        # Valores de la marca
│   ├── investigacion-mercado.md
│   ├── analisis-competencia.md
│   ├── mision-vision.md
│   ├── concepto-marca.md
│   ├── lean-canvas.md
│   ├── buyer-personas.md
│   ├── estrategia-contenido.md
│   ├── objetivos-smart.md
│   └── pitch/
│       ├── guion.md          # Guion para presentaciones
│       └── slides/           # Diapositivas de apoyo
├── package-lock.json         # Dependencias bloqueadas
├── package.json              # Dependencias y scripts npm
├── public/
│   └── images/               # Imagenes estaticas servidas al cliente
├── scripts/
│   └── seed.js               # Script para cargar datos de prueba
├── server.js                 # Punto de entrada del servidor
└── server/
    ├── middleware/
    │   └── auth.js           # Middleware de autenticacion JWT
    ├── models/
    │   └── database.js       # Conexion y modelos de base de datos
    └── routes/
        ├── productos.js      # Rutas para productos
        ├── usuarios.js       # Rutas para usuarios
        ├── pedidos.js        # Rutas para pedidos
        ├── login.js          # Ruta de autenticacion
        └── zonas.js           # Rutas para zonas geograficas
└── src/
    ├── css/
    │   └── styles.css        # Estilos CSS principales
    ├── img/                  # Imagenes del frontend
    ├── js/
    │   └── app.js            # Logica principal del frontend
    └── pages/
        ├── login.html        # Pagina de inicio de sesion
        ├── registro.html      # Pagina de registro
        ├── catalogo.html      # Pagina principal de productos
        ├── producto-detalle.html
        ├── registro-producto.html
        └── carrito.html       # Pagina del carrito de compras
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

- **Registro y Autenticacion:** Los usuarios pueden registrarse e iniciar sesion con diferentes roles (administrador, productor, usuario).
- **Gestion de Productos:** Los productores pueden agregar, editar y eliminar sus productos con imagenes.
- **Catálogo de Productos:** Los usuarios pueden ver todos los productos disponibles con filtros por zona y busqueda.
- **Carrito de Compras:** Los usuarios pueden agregar productos al carrito y proceder al pago.
- **Sistema de Pedidos:** Los usuarios pueden realizar pedidos y los administradores pueden gestionar su estado.
- **Panel de Administracion:** Los administradores pueden ver metricas, usuarios y gestionar el sistema.

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