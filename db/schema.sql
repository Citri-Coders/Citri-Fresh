--1. Activar la verificacion de claves foraneas
PRAGMA foreign_keys = ON;

-- +++++++++++++++++++++++++++
-- TABLAS INDEPENDIENTES
-- +++++++++++++++++++++++++++

--Tabla zonas
CREATE TABLE IF NOT EXISTS zonas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE
);

--Tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    rol TEXT NOT NULL DEFAULT 'cliente' CHECK (rol IN ('admin', 'productor', 'cliente')),
    creado_en TEXT NOT NULL DEFAULT (DATETIME('now'))
);

-- +++++++++++++++++++++++++++
-- TABLAS DEPENDIENTES
-- +++++++++++++++++++++++++++

--Tabla productos
CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    precio REAL NOT NULL CHECK (precio >= 0),
    unidad TEXT NOT NULL DEFAULT 'unidad',
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    zona INTEGER,
    productor_id INTEGER NOT NULL,
    imagen TEXT,
    creado_en TEXT NOT NULL DEFAULT (DATETIME('now')),
    FOREIGN KEY (zona) REFERENCES zonas(id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (productor_id) REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE
);

--Tabla pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    total REAL NOT NULL DEFAULT 0.0 CHECK (total >= 0),
    estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'pagado', 'enviado', 'completado', 'cancelado')),
    fecha TEXT NOT NULL DEFAULT (DATETIME('now')),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

--Tabla pedidos_items
CREATE TABLE IF NOT EXISTS pedidos_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pedido_id INTEGER NOT NULL,
    producto_id INTEGER NOT NULL,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario REAL NOT NULL CHECK (precio_unitario >= 0),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- +++++++++++++++++++++++++++
-- INDICES PARA OPTIMIZACION
-- +++++++++++++++++++++++++++

-- SQLite no crea indices automaticos para FKs

CREATE INDEX IF NOT EXISTS idx_productos_productor ON productos(productor_id);
CREATE INDEX IF NOT EXISTS idx_productos_zona ON productos(zona);

CREATE INDEX IF NOT EXISTS idx_pedidos_usuario ON pedidos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
CREATE INDEX IF NOT EXISTS idx_pedidos_fecha ON pedidos(fecha);

CREATE INDEX IF NOT EXISTS idx_pedidos_items_pedido ON pedidos_items(pedido_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_items_producto ON pedidos_items(producto_id);