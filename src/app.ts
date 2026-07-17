import express from "express";
import { productRouter } from "./routes/productRoutes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

export function createApp() {
  const app = express();

  app.use(express.json());

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
