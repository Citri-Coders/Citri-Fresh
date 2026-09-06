import { getDB } from "../config/db.js";

export const UsuarioModel = {
  async findByEmail(email) {
    const db = await getDB();
    return db.get(
      "SELECT id, nombre, email, password_hash, rol, foto, telefono, direccion, nombre_finca, zona_cultivo, capacidad_produccion, tipos_citricos, creado_en FROM usuarios WHERE email = ?",
      [email],
    );
  },

  async findById(id) {
    const db = await getDB();
    return db.get(
      "SELECT id, nombre, email, rol, foto, telefono, direccion, nombre_finca, zona_cultivo, capacidad_produccion, tipos_citricos, creado_en FROM usuarios WHERE id = ?",
      [id],
    );
  },

  async findByIdWithPassword(id) {
    const db = await getDB();
    return db.get(
      "SELECT id, nombre, email, password_hash, rol, foto, telefono, direccion, nombre_finca, zona_cultivo, capacidad_produccion, tipos_citricos, creado_en FROM usuarios WHERE id = ?",
      [id],
    );
  },

  async create({
    nombre,
    email,
    password_hash,
    rol = "cliente",
    foto = "",
    telefono = "",
    direccion = "",
    nombre_finca = "",
    zona_cultivo = "",
    capacidad_produccion = "",
    tipos_citricos = ""
  }) {
    const db = await getDB();
    const result = await db.run(
      `INSERT INTO usuarios (nombre, email, password_hash, rol, foto, telefono, direccion, nombre_finca, zona_cultivo, capacidad_produccion, tipos_citricos)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        email,
        password_hash,
        rol,
        foto,
        telefono,
        direccion,
        nombre_finca,
        zona_cultivo,
        capacidad_produccion,
        tipos_citricos
      ],
    );
    return {
      id: result.lastID,
      nombre,
      email,
      rol,
      foto,
      telefono,
      direccion,
      nombre_finca,
      zona_cultivo,
      capacidad_produccion,
      tipos_citricos
    };
  },

  async update(id, { nombre, email, password_hash, foto, telefono, direccion }) {
    const db = await getDB();

    const fields = [];
    const params = [];

    if (nombre !== undefined) {
      fields.push("nombre = ?");
      params.push(nombre);
    }
    if (email !== undefined) {
      fields.push("email = ?");
      params.push(email);
    }
    if (password_hash !== undefined && password_hash !== null) {
      fields.push("password_hash = ?");
      params.push(password_hash);
    }
    if (foto !== undefined) {
      fields.push("foto = ?");
      params.push(foto);
    }
    if (telefono !== undefined) {
      fields.push("telefono = ?");
      params.push(telefono);
    }
    if (direccion !== undefined) {
      fields.push("direccion = ?");
      params.push(direccion);
    }

    if (fields.length > 0) {
      params.push(id);
      await db.run(
        `UPDATE usuarios SET ${fields.join(", ")} WHERE id = ?`,
        params,
      );
    }

    return this.findById(id);
  },

  async obtenerTodos() {
    const db = await getDB();
    return db.all(
      "SELECT id, nombre, email, rol, creado_en FROM usuarios ORDER BY id DESC",
    );
  },

  async contar() {
    const db = await getDB();
    const row = await db.get("SELECT COUNT(*) AS total FROM usuarios");
    return row ? row.total : 0;
  },

  async eliminar(id) {
    const db = await getDB();

    // 1. Obtener los IDs de pedidos hechos por este usuario (como cliente)
    const pedidosUsuario = await db.all("SELECT id FROM pedidos WHERE usuario_id = ?", [id]);
    for (const ped of pedidosUsuario) {
      await db.run("DELETE FROM pedidos_items WHERE pedido_id = ?", [ped.id]);
    }
    await db.run("DELETE FROM pedidos WHERE usuario_id = ?", [id]);

    // 2. Si es productor, limpiar pedidos_items asociados a sus productos y luego sus productos
    const productosProductor = await db.all("SELECT id FROM productos WHERE productor_id = ?", [id]);
    for (const prod of productosProductor) {
      await db.run("DELETE FROM pedidos_items WHERE producto_id = ?", [prod.id]);
    }
    await db.run("DELETE FROM productos WHERE productor_id = ?", [id]);

    // 3. Eliminar el usuario de la base de datos
    const result = await db.run("DELETE FROM usuarios WHERE id = ?", [id]);
    return { cambios: result.changes };
  },
};
