/**
 * Erreur applicative typée, utilisée pour renvoyer des réponses HTTP cohérentes.
 * Toute route peut faire `throw new AppError(...)`, le middleware d'erreur
 * global se charge de formater la réponse JSON.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 500, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static notFound(message = "Ressource introuvable") {
    return new AppError(message, 404);
  }

  static badRequest(message = "Requête invalide", details?: unknown) {
    return new AppError(message, 400, details);
  }
}

/**
 * Wrapper pour les handlers async d'Express : évite d'avoir un try/catch
 * dans chaque route et transmet automatiquement les erreurs au middleware
 * global via next(err).
 */
import { NextFunction, Request, Response } from "express";

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
