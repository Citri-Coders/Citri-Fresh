// Datos de semilla centralizados: única fuente de verdad para usuarios, zonas
// y catálogo base. Usado tanto por la auto-inicialización de la BD (db.js)
// como por el script scripts/seed.js.

export const ZONAS_BASE = [
  "León",
  "Chinandega",
  "Carazo",
  "Rivas",
  "Masaya",
];

export const USUARIOS_BASE = [
  {
    nombre: "Administrador Citri-Fresh",
    email: "admin@citrifresh.com",
    pass: "admin123",
    rol: "admin",
  },
  {
    nombre: "Auditor General de Calidad",
    email: "auditor@citrifresh.com",
    pass: "auditor123",
    rol: "auditor",
  },
  {
    nombre: "Finca Cítricos San Carlos",
    email: "productor@citrifresh.com",
    pass: "productor123",
    rol: "productor",
  },
  {
    nombre: "Comprador Demo",
    email: "cliente@citrifresh.com",
    pass: "cliente123",
    rol: "cliente",
  },
];

// Catálogo base. El campo `zona` referencia el id generado por ZONAS_BASE
// (1 = León, 2 = Chinandega, 3 = Carazo, ...).
export const PRODUCTOS_BASE = [
  {
    nombre: "Naranja Valencia (Cien)",
    descripcion:
      "Naranja jugosa y dulce, ideal para consumo fresco o jugos.",
    precio: 350.0,
    unidad: "cien",
    stock: 45,
    zona: 1, // León
    imagen: "/public/images/n-comer.jpg",
  },
  {
    nombre: "Limón Criollo (Docena)",
    descripcion:
      "Limón agrio criollo de excelente calidad y alto contenido de jugo.",
    precio: 40.0,
    unidad: "docena",
    stock: 120,
    zona: 1, // León
    imagen: "/public/images/l-criollo.jpg",
  },
  {
    nombre: "Mandarina Reina (Docena)",
    descripcion:
      "Mandarina dulce de fácil pelado, cosecha fresca de temporada.",
    precio: 60.0,
    unidad: "docena",
    stock: 30,
    zona: 3, // Carazo
    imagen: "/public/images/mandarina.jpeg",
  },
];
