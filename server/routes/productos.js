const express = require("express");
const router = express.Router();
const db = require("../models/database");

/*
 GET /api/productos
  Descripcion: Obtiene la lista de productos con filtros opcionales
  Parametros de consulta opcionales:
   - zona: ID de la zona geografica (?zona=1)
   - search: Termino de busqueda en nombre o descripcion (?search=limon)
   - minPrecio: Precio minimo (?minPrecio=5)
   - maxPrecio: Precio maximo (?maxPrecio=50)
*/
router.get("/", (req, res) => {
  try {
    //1. Extraer query params de la URL
    const { zona, search, minPrecio, maxPrecio } = req.query;

    //2. Construir la consulta SQL dinamica
    let sql = "SELECT * FROM productos WHERE 1=1";
    const params = [];

    //Filtro opcional por zona
    if (zona) {
      sql += " AND zona = ?";
      params.push(zona);
    }

    //Filtro opcional por busqueda (nombre o descripcion)
    if (search) {
      sql += " AND (nombre LIKE ? OR descripcion LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    //Filtro opcional por precio minimo
    if (minPrecio && !isNaN(minPrecio)) {
      sql += " AND precio >= ?";
      params.push(parseFloat(minPrecio));
    }

    //Filtro opcional por precio maximo
    if (maxPrecio && !isNaN(maxPrecio)) {
      sql += " AND precio <= ?";
      params.push(parseFloat(maxPrecio));
    }

    //Ordenar resultados del mas reciente al mas antiguo
    sql += " ORDER BY creado_en DESC";

    //3. Ejecutar consulta en la base de datos SQLite
    const stmt = db.prepare(sql);
    const productos = stmt.all(...params);

    //4. Retornar JSON con la lista de productos (estado http 200 OK)
    res.status(200).json({
      exito: true,
      total: productos.length,
      datos: productos,
    });
  } catch (error) {
    //5. Manejo de errores internos del servidor (estado http 500)
    console.error("Error al obtener productos:", error.message);
    res.status(500).json({
      exito: false,
      error: "Error interno del servidor al consultar la lista de productos",
    });
  }
});

/*
 GET /api/productos/:id
 Descripcion: Obtiene los detalles de un producto especifico mediante su Id
*/
router.get("/:id", (req, res) => {
  try {
    // 1. Extraer el Id dinamico de la URL
    const productId = req.params.id;

    // 2. Preparar y ejecutar la consulta buscando un unico registro (.get)
    const sql = "SELECT * FROM productos WHERE id = ?";
    const stmt = db.prepare(sql);
    const producto = stmt.get(productId);

    // 3. Validar si el producto existe
    if (!producto) {
      return res.status(404).json({
        exito: false,
        error: "Producto no encontrado en el catalogo",
      });
    }

    // 4. Retornar el producto encontrado
    res.status(200).json({
      exito: true,
      datos: producto,
    });
  } catch (error) {
    // 5. Manejo de errores
    console.error(
      `Error al obtener el producto con ID ${req.params.id}:`,
      error.message,
    );
    res.status(500).json({
      exito: false,
      error: "Error interno del servidor al buscar el producto",
    });
  }
});
module.exports = router;
