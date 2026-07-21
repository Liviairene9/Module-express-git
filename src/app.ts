import express from "express";
import { productRouter } from "./routes/productRoutes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/products", productRouter);

  // 404 pour toute route non définie.
  app.use(notFoundHandler);

  // Middleware d'erreur global (doit rester en dernier).
  app.use(errorHandler);

  return app;
}
