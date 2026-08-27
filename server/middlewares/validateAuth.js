export const validateRegister = (req, res, next) => {
  const { nombre, email, password, rol } = req.body;

  if (!nombre || !email || !password) {
    return res
      .status(400)
      .json({ error: "Nombre, email y contraseña son obligatorios" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ error: "Formato de correo electrónico inválido" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "La contraseña debe tener al menos 6 caracteres" });
  }

  if (rol && !["cliente", "productor", "admin"].includes(rol)) {
    return res.status(400).json({ error: "Rol no válido" });
  }

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
