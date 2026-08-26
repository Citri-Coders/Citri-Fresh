const express = require('express');
const router = express.Router();
const db = require('../models/database');

/*
 GET /api/productos
*/
router.get('/', (req, res) => {
  const { zona, search, minPrecio, maxPrecio } = req.query;

  let sql = 'SELECT * FROM productos WHERE 1=1';
  const params = [];

  if (zona) {
    sql += ' AND zona = ?';
    params.push(zona);
  }

  if (search) {
    sql += ' AND (nombre LIKE ? OR descripcion LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  if (minPrecio && !isNaN(minPrecio)) {
    sql += ' AND precio >= ?';
    params.push(parseFloat(minPrecio));
  }

  if (maxPrecio && !isNaN(maxPrecio)) {
    sql += ' AND precio <= ?';
    params.push(parseFloat(maxPrecio));
  }

  sql += ' ORDER BY creado_en DESC';

  db.all(sql, params, (err, productos) => {
    if (err) {
      console.error('Error al obtener productos:', err.message);
      return res.status(500).json({
        exito: false,
        error: 'Error interno del servidor al consultar la lista de productos'
      });
    }

    res.status(200).json({
      exito: true,
      total: productos.length,
      datos: productos
    });
  });
});

/*
 GET /api/productos/:id
*/
router.get('/:id', (req, res) => {
  const productId = req.params.id;
  const sql = 'SELECT * FROM productos WHERE id = ?';

  db.get(sql, [productId], (err, producto) => {
    if (err) {
      console.error(`Error al obtener el producto con ID ${productId}:`, err.message);
      return res.status(500).json({
        exito: false,
        error: 'Error interno del servidor al buscar el producto'
      });
    }

    if (!producto) {
      return res.status(404).json({
        exito: false,
        error: 'Producto no encontrado en el catalogo'
      });
    }

    res.status(200).json({
      exito: true,
      datos: producto
    });
  });
});

module.exports = router;