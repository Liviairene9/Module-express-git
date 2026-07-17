import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";

/**
 * Middleware pour les routes non trouvées (404 générique).
 * A placer APRES toutes les routes, avant le errorHandler.
 */
export function notFoundHandler(req: Request, res: Response, _next: NextFunction) {
  res.status(404).json({
    error: {
      message: `Route ${req.method} ${req.originalUrl} introuvable`,
    },
  });
}

/**
 * Middleware d'erreur global. Doit être déclaré en dernier, avec 4 arguments
 * (req, res, next, err) pour qu'Express le reconnaisse comme error handler.
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
    });
  }

  // Erreur non anticipée : log serveur + réponse générique 500 (pas de stack trace exposée).
  // eslint-disable-next-line no-console
  console.error("[Erreur non gérée]", err);
  res.status(500).json({
    error: { message: "Erreur interne du serveur" },
  });
}
