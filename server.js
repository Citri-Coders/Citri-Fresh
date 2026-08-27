import "dotenv/config";
import app from "./server/app.js";

const PORT = process.env.PORT ?? 3050;

app.listen(PORT, (error) => {
  if (error) throw error;
  console.log(`Servidor levantado en http://localhost:${PORT}`);
});

