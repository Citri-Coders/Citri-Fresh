import { validarCorreoReal } from "../utils/emailValidator.js";

const LIMITES_CAMPOS = {
  nombre: 100,
  email: 254,
  password: 128,
  password_actual: 128,
  telefono: 30,
  direccion: 255,
  nombre_finca: 100,
  zona_cultivo: 100,
  capacidad_produccion: 100,
  tipos_citricos: 255,
  foto: 500,
};

// Devuelve un mensaje de error si algún campo excede su longitud máxima, o null.
const validarLongitudes = (body, campos) => {
  for (const campo of campos) {
    const valor = body[campo];
    const max = LIMITES_CAMPOS[campo];
    if (typeof valor === "string" && max && valor.length > max) {
      return `El campo '${campo}' no puede superar los ${max} caracteres`;
    }
  }
  return null;
};

export const validateRegister = async (req, res, next) => {
  const { nombre, email, password, rol } = req.body;

  if (!nombre || !email || !password) {
    return res
      .status(400)
      .json({ error: "Nombre, email y contraseña son obligatorios" });
  }

  const errorLongitud = validarLongitudes(req.body, [
    "nombre",
    "email",
    "password",
    "telefono",
    "direccion",
    "nombre_finca",
    "zona_cultivo",
    "capacidad_produccion",
    "tipos_citricos",
    "foto",
  ]);
  if (errorLongitud) {
    return res.status(400).json({ error: errorLongitud });
  }

  // Verificación profunda y real del correo (sintaxis, no-desechable y existencia de servidor MX)
  const verificacion = await validarCorreoReal(email);
  if (!verificacion.valido) {
    return res.status(400).json({ error: verificacion.error });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "La contraseña debe tener al menos 6 caracteres" });
  }

  if (rol && !["cliente", "productor", "admin", "auditor"].includes(rol)) {
    return res.status(400).json({ error: "Rol no válido" });
  }

  // Guardar correo normalizado
  req.body.email = verificacion.email;
  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Email y contraseña son obligatorios" });
  }

  const errorLongitud = validarLongitudes(req.body, ["email", "password"]);
  if (errorLongitud) {
    return res.status(400).json({ error: errorLongitud });
  }

  next();
};

export const validateActualizarPerfil = async (req, res, next) => {
  const { nombre, email, password_actual, password_nuevo } = req.body;

  const errorLongitud = validarLongitudes(req.body, [
    "nombre",
    "email",
    "password_actual",
    "password_nuevo",
    "telefono",
    "direccion",
    "foto",
  ]);
  if (errorLongitud) {
    return res.status(400).json({ error: errorLongitud });
  }

  if (nombre !== undefined && (typeof nombre !== "string" || nombre.trim() === "")) {
    return res
      .status(400)
      .json({ error: "El nombre no puede estar vacío" });
  }

  if (email !== undefined) {
    const verificacion = await validarCorreoReal(email);
    if (!verificacion.valido) {
      return res.status(400).json({ error: verificacion.error });
    }
    req.body.email = verificacion.email;
  }

  if (password_nuevo !== undefined) {
    if (!password_actual) {
      return res
        .status(400)
        .json({ error: "Debes ingresar tu contraseña actual para cambiarla" });
    }

    if (typeof password_nuevo !== "string" || password_nuevo.length < 6) {
      return res
        .status(400)
        .json({ error: "La nueva contraseña debe tener al menos 6 caracteres" });
    }
  }

  next();
};
