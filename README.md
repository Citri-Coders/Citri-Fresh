# 🍊 CITRI-FRESH

**Plataforma Digital para la Comercialización Directa de Cítricos en Nicaragua**

---

## 🌿 Descripción del Proyecto

**Citri-Fresh** es una plataforma web que conecta directamente a productores de cítricos con consumidores finales, eliminando intermediarios innecesarios.

### 🎯 Problema que Resolvemos

- 📉 15-40% de pérdida post-cosecha por intermediación excesiva (FAO)
- 💰 Productores reciben solo 30-40% del precio final
- 🛒 Consumidores pagan precios 50-100% más altos
- 📊 Falta de trazabilidad en la cadena de suministro

### 💡 Nuestra Solución

- ✅ Registro directo de productores y productos
- ✅ Catálogo en línea con información detallada
- ✅ Sistema de pedidos y gestión de inventario
- ✅ Trazabilidad completa del producto
- ✅ Conexión directa productor-consumidor

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- HTML5
- CSS3 (Grid, Flexbox)
- JavaScript (ES6+)

### Backend
- Node.js
- Express.js
- SQLite (better-sqlite3)
- JWT (autenticación)
- bcrypt (hash de contraseñas)

---

## 🚀 Instalación Rápida

```bash
# 1. Clonar repositorio
git clone https://github.com/TU-USUARIO/citri-fresh.git
cd citri-fresh

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# 4. Inicializar base de datos
npm run db:init

# 5. Iniciar servidor
npm run dev