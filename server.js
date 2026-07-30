// server.js - Punto de entrada del servidor Citri-Fresh

// 1. Cargar variables de entorno
require('dotenv').config();

// 2. Importar dependencias
const express = require('express');
const cors = require('cors');

// 3. Crear aplicación Express
const app = express();

// 4. Configuración
const PORT = process.env.PORT || 3000;

// 5. Middlewares
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
}));
app.use(express.json());
app.use(express.static('public'));

// 6. Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    mensaje: '🍊 ¡Bienvenido a Citri-Fresh!',
    version: '0.1.0',
    estado: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// 7. Ruta de salud
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 8. Iniciar servidor
app.listen(PORT, () => {
  console.log('');
  console.log('🍊 ==========================================');
  console.log('   CITRI-FRESH - Servidor Iniciado');
  console.log('🍊 ==========================================');
  console.log(`   🌐 URL:      http://localhost:${PORT}`);
  console.log(`   🔧 Entorno:  ${process.env.NODE_ENV || 'development'}`);
  console.log(`   📅 Fecha:    ${new Date().toLocaleString('es-ES')}`);
  console.log('🍊 ==========================================');
  console.log('');
});

// 9. Manejo de errores
process.on('unhandledRejection', (err) => {
  console.error('❌ Error no manejado:', err.message);
  process.exit(1);
}); 
