import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UsuarioModel } from "../models/usuarioModel.js";

const JWT_SECRET =
  process.env.JWT_SECRET || "citrifresh_secret_key_super_segura";
const SALT_ROUNDS = 10;

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000, // 1 día
};

const CLEAR_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};

export const register = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    const existe = await UsuarioModel.findByEmail(email);
    if (existe) {
      return res
        .status(409)
        .json({ error: "El correo electrónico ya está registrado" });
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const nuevoUsuario = await UsuarioModel.create({
      nombre,
      email,
      password_hash,
      rol: rol || "cliente",
    });

    const token = jwt.sign(
      { id: nuevoUsuario.id, rol: nuevoUsuario.rol },
      JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token, COOKIE_OPTIONS);

    return res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: nuevoUsuario,
    });
  } catch (error) {
    console.error("Error en register:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await UsuarioModel.findByEmail(email);
    if (!usuario) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const esValida = await bcrypt.compare(password, usuario.password_hash);
    if (!esValida) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, COOKIE_OPTIONS);

    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", CLEAR_COOKIE_OPTIONS);
  return res.status(200).json({ message: "Sesión cerrada exitosamente" });
};

export const getMe = async (req, res) => {
  try {
    const usuario = await UsuarioModel.findById(req.user.id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    return res.status(200).json({ user: usuario });
  } catch (error) {
    console.error("Error en getMe:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
