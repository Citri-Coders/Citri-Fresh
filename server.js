import "dotenv/config";
import app from "./server/app.js";

const DEFAULT_PORT = Number(process.env.PORT) || 3000;

function startServer(port, fallbackPort = 3050) {
  const server = app.listen(port, () => {
    console.log(`Servidor levantado en http://localhost:${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      if (port !== fallbackPort) {
        console.warn(`Aviso: El puerto ${port} está ocupado. Saltando automáticamente al puerto ${fallbackPort}...`);
        startServer(fallbackPort, fallbackPort + 1);
      } else {
        console.warn(`Aviso: El puerto ${port} también está ocupado. Intentando en ${fallbackPort + 1}...`);
        startServer(fallbackPort + 1, fallbackPort + 2);
      }
    } else {
      console.error("Error al iniciar el servidor:", error);
      process.exit(1);
    }
  });
}

startServer(DEFAULT_PORT);


