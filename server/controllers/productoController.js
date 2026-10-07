import { ProductoModel } from "../models/productoModel.js";
import { ROLES, UNIDAD_PRODUCTO_DEFAULT } from "../config/constants.js";
import { ForbiddenError, NotFoundError } from "../utils/appError.js";
import { sendSuccess } from "../utils/apiResponse.js";

// GET /api/productos
export const obtenerProductos = async (req, res, next) => {
  try {
    const { productor_id, zona } = req.query;
    const productos = await ProductoModel.obtenerTodos({ productor_id, zona });
    return sendSuccess(res, productos);
  } catch (error) {
    return next(error);
  }
};

// GET /api/productos/:id
export const obtenerProductoPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const producto = await ProductoModel.obtenerPorId(id);
    if (!producto) {
      throw new NotFoundError("Producto no encontrado");
    }
    return sendSuccess(res, producto);
  } catch (error) {
    return next(error);
  }
};

// POST /api/productos
export const crearProducto = async (req, res, next) => {
  try {
    const { nombre, descripcion, precio, unidad, stock, zona, imagen } = req.body;

    const nuevoProducto = await ProductoModel.crear({
      nombre: nombre.trim(),
      descripcion: descripcion ? descripcion.trim() : "",
      precio: Number(precio),
      unidad: unidad || UNIDAD_PRODUCTO_DEFAULT,
      stock: Number(stock),
      zona: zona ? Number(zona) : null,
      imagen: imagen || "",
      productor_id: req.user.id,
    });

    return sendSuccess(res, nuevoProducto, {
      status: 201,
      message: "Producto creado exitosamente",
    });
  } catch (error) {
    return next(error);
  }
};

// PUT /api/productos/:id
export const actualizarProducto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, unidad, stock, zona, imagen } = req.body;

    const productoExistente = await ProductoModel.obtenerPorId(id);
    if (!productoExistente) {
      throw new NotFoundError("Producto no encontrado");
    }

    // Regla de autorización: Solo el dueño del producto o un admin pueden modificarlo
    if (
      req.user.rol !== ROLES.ADMIN &&
      productoExistente.productor_id !== req.user.id
    ) {
      throw new ForbiddenError(
        "Acceso denegado: No tienes permiso para editar este producto",
      );
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
          : productoExistente.zona_id, // alias correcto del model (p.zona AS zona_id)
      imagen: imagen !== undefined ? imagen : productoExistente.imagen,
    });

    const productoActualizado = await ProductoModel.obtenerPorId(id);

    return sendSuccess(res, productoActualizado, {
      message: "Producto actualizado exitosamente",
    });
  } catch (error) {
    return next(error);
  }
};

// DELETE /api/productos/:id
export const eliminarProducto = async (req, res, next) => {
  try {
    const { id } = req.params;

    const productoExistente = await ProductoModel.obtenerPorId(id);
    if (!productoExistente) {
      throw new NotFoundError("Producto no encontrado");
    }

    // Regla de autorización: Solo el dueño del producto o un admin pueden eliminarlo
    if (
      req.user.rol !== ROLES.ADMIN &&
      productoExistente.productor_id !== req.user.id
    ) {
      throw new ForbiddenError(
        "Acceso denegado: No tienes permiso para eliminar este producto",
      );
    }

    await ProductoModel.eliminar(id);

    return sendSuccess(res, null, {
      message: "Producto eliminado exitosamente",
    });
  } catch (error) {
    return next(error);
  }
};
