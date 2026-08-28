import { ProductoModel } from "../models/productoModel.js";

// GET /api/productos
export const obtenerProductos = async (req, res) => {
  try {
    const { productor_id, zona } = req.query;
    const productos = await ProductoModel.obtenerTodos({
      productor_id,
      zona,
    });

    return res.status(200).json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return res
      .status(500)
      .json({ error: "Error interno al obtener los productos" });
  }
};

// GET /api/productos/:id
export const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await ProductoModel.obtenerPorId(id);

    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    return res.status(200).json(producto);
  } catch (error) {
    console.error("Error al obtener producto por ID:", error);
    return res
      .status(500)
      .json({ error: "Error interno al buscar el producto" });
  }
};

// POST /api/productos
export const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, unidad, stock, zona, imagen } =
      req.body;

    const nuevoProducto = await ProductoModel.crear({
      nombre: nombre.trim(),
      descripcion: descripcion ? descripcion.trim() : "",
      precio: Number(precio),
      unidad: unidad || "unidad",
      stock: Number(stock),
      zona: zona ? Number(zona) : null,
      imagen: imagen || "",
      productor_id: req.user.id,
    });

    return res.status(201).json({
      message: "Producto creado exitosamente",
      producto: nuevoProducto,
    });
  } catch (error) {
    console.error("Error al crear producto:", error);
    return res
      .status(500)
      .json({ error: "Error interno al crear el producto" });
  }
};

// PUT /api/productos/:id
export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, unidad, stock, zona, imagen } =
      req.body;

    const productoExistente = await ProductoModel.obtenerPorId(id);

    if (!productoExistente) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Regla de autorización: Solo el dueño del producto o un admin pueden modificarlo
    if (
      req.user.rol !== "admin" &&
      productoExistente.productor_id !== req.user.id
    ) {
      return res.status(403).json({
        error: "Acceso denegado: No tienes permiso para editar este producto",
      });
    }

    await ProductoModel.actualizar(id, {
      nombre: nombre !== undefined ? nombre.trim() : productoExistente.nombre,
      descripcion:
        descripcion !== undefined
          ? descripcion.trim()
          : productoExistente.descripcion,
      precio: precio !== undefined ? Number(precio) : productoExistente.precio,
      unidad: unidad !== undefined ? unidad : productoExistente.unidad,
      stock: stock !== undefined ? Number(stock) : productoExistente.stock,
      zona:
        zona !== undefined
          ? zona
            ? Number(zona)
            : null
          : productoExistente.zona_id,
      imagen: imagen !== undefined ? imagen : productoExistente.imagen,
    });

    const productoActualizado = await ProductoModel.obtenerPorId(id);

    return res.status(200).json({
      message: "Producto actualizado exitosamente",
      producto: productoActualizado,
    });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return res
      .status(500)
      .json({ error: "Error interno al actualizar el producto" });
  }
};

// DELETE /api/productos/:id
export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const productoExistente = await ProductoModel.obtenerPorId(id);

    if (!productoExistente) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Regla de autorización: Solo el dueño del producto o un admin pueden eliminarlo
    if (
      req.user.rol !== "admin" &&
      productoExistente.productor_id !== req.user.id
    ) {
      return res.status(403).json({
        error: "Acceso denegado: No tienes permiso para eliminar este producto",
      });
    }

    await ProductoModel.eliminar(id);

    return res.status(200).json({
      message: "Producto eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return res
      .status(500)
      .json({ error: "Error interno al eliminar el producto" });
  }
};
