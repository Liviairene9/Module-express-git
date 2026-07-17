import { Router } from "express";
import { productStore } from "../store/productStore";
import {
  createProductSchema,
  updateProductSchema,
  paginationQuerySchema,
} from "../schemas/productSchema";
import { AppError, asyncHandler } from "../utils/AppError";

export const productRouter = Router();

/**
 * GET /products
 * Liste paginée des produits, avec filtre optionnel par catégorie.
 * Query params : page (défaut 1), limit (défaut 10, max 100), category
 */
productRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const parsedQuery = paginationQuerySchema.safeParse(req.query);
    if (!parsedQuery.success) {
      throw AppError.badRequest("Paramètres de pagination invalides", parsedQuery.error.flatten());
    }
    const { page, limit, category } = parsedQuery.data;

    let all = productStore.findAll();
    if (category) {
      all = all.filter((p) => p.category === category);
    }
    // Tri stable par date de création pour une pagination cohérente.
    all.sort((a, b) => a.createdAt.localeCompare(b.createdAt));

    const total = all.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const data = all.slice(start, start + limit);

    res.status(200).json({
      data,
      pagination: { page, limit, total, totalPages },
    });
  })
);

/**
 * GET /products/:id
 * Détail d'un produit.
 */
productRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const product = productStore.findById(req.params.id);
    if (!product) {
      throw AppError.notFound(`Produit ${req.params.id} introuvable`);
    }
    res.status(200).json({ data: product });
  })
);

/**
 * POST /products
 * Création d'un produit. Corps validé via Zod.
 */
productRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const parsed = createProductSchema.safeParse(req.body);
    if (!parsed.success) {
      throw AppError.badRequest("Corps de la requête invalide", parsed.error.flatten());
    }
    const product = productStore.create(parsed.data);
    res.status(201).json({ data: product });
  })
);

/**
 * PUT /products/:id
 * Mise à jour (partielle) d'un produit. Corps validé via Zod.
 */
productRouter.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const parsed = updateProductSchema.safeParse(req.body);
    if (!parsed.success) {
      throw AppError.badRequest("Corps de la requête invalide", parsed.error.flatten());
    }

    const updated = productStore.update(req.params.id, parsed.data);
    if (!updated) {
      throw AppError.notFound(`Produit ${req.params.id} introuvable`);
    }
    res.status(200).json({ data: updated });
  })
);

/**
 * DELETE /products/:id
 * Suppression d'un produit.
 */
productRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const deleted = productStore.delete(req.params.id);
    if (!deleted) {
      throw AppError.notFound(`Produit ${req.params.id} introuvable`);
    }
    res.status(204).send();
  })
);
