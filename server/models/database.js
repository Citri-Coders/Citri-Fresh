// Se importa la libreria better-sqlite3
const Database = require('better-sqlite3');

// Se importan modulos de node.js para el manejo de rutas de archivos y lectura del sistema
const path = require('path');
const fs = require('fs');

/* Se definen las rutas absolutas del archivo de la base de datos y del archivo sql de esquema
 __dirname apunta a la carpeta actual: server/models
 '../../db/citri_fresh.db' sube dos niveles a la raíz y entra a la carpeta db*/
const dbPath = path.join(__dirname, '../../db/citri_fresh.db');
const schemaPath = path.join(__dirname, '../../db/schema.sql');

let db;

try {
  /*FUNCION DE CONEXION
  Intenta abrir el archivo de la BD. Si no existe, better-sqlite3 lo crea automaticamente*/
  db = new Database(dbPath);
  
  // Se habilita WAL (Write-Ahead Logging) para optimizar la velocidad de lectura/escritura
  db.pragma('journal_mode = WAL');
  console.log('Conexión establecida exitosamente con la base de datos sqlite.');

  /*FUNCION DE INICIALIZACION
  Verifica si el archivo db/schema.sql existe y ejecuta sus sentencias para crear las tablas*/
  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schemaSql);
    console.log('Esquema de base de datos cargado e inicializado');
  } else {
    console.warn('No se encontro el archivo db/schema.sql');
  }

} catch (error) {
  /*MANEJO DE ERRORES DE CONEXION
  Captura cualquier fallo al intentar abrir la BD o leer el archivo sql */
  console.error('Error al conectar o inicializar la base de datos sqlite:', error.message);
  
  // Detiene la ejecucion de Node.js si la base de datos no puede inicializarse
  process.exit(1);
}

// Exportamos la instancia de la base de datos para que las rutas puedan realizar consultas
module.exports = db;