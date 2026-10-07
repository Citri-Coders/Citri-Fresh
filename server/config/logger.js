import "dotenv/config";
import pino from "pino";

// Logger estructurado central (H16). En producción emite JSON apto para
// agregadores de logs; en desarrollo usa nivel debug por defecto.
const logger = pino({
  level:
    process.env.LOG_LEVEL ||
    (process.env.NODE_ENV === "production" ? "info" : "debug"),
});

export default logger;
