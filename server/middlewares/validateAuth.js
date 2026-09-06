import { validarCorreoReal } from "../utils/emailValidator.js";

export const validateRegister = async (req, res, next) => {
  const { nombre, email, password, rol } = req.body;

  if (!nombre || !email || !password) {
    return res
      .status(400)
      .json({ error: "Nombre, email y contraseña son obligatorios" });
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

  if (rol && !["cliente", "productor", "admin"].includes(rol)) {
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

  next();
};

export const validateActualizarPerfil = async (req, res, next) => {
  const { nombre, email, password_actual, password_nuevo } = req.body;

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
