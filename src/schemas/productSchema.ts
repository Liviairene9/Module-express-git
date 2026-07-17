import { z } from "zod";

export const categoryEnum = z.enum(["parfum", "accessoire", "sac", "bijou", "autre"]);

/**
 * Schéma de création : tous les champs métier sont obligatoires.
 */
export const createProductSchema = z.object({
  name: z
    .string({ required_error: "Le nom est obligatoire" })
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(120, "Le nom ne peut pas dépasser 120 caractères"),
  description: z
    .string({ required_error: "La description est obligatoire" })
    .trim()
    .min(5, "La description doit contenir au moins 5 caractères")
    .max(1000, "La description ne peut pas dépasser 1000 caractères"),
  price: z
    .number({ required_error: "Le prix est obligatoire" })
    .positive("Le prix doit être un nombre positif"),
  category: categoryEnum,
  stock: z
    .number({ required_error: "Le stock est obligatoire" })
    .int("Le stock doit être un nombre entier")
    .nonnegative("Le stock ne peut pas être négatif"),
});

/**
 * Schéma de mise à jour : tous les champs sont optionnels (update partiel),
 * mais au moins un champ doit être fourni.
 */
export const updateProductSchema = createProductSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Au moins un champ doit être fourni pour la mise à jour",
  });

/**
 * Schéma de validation des query params de pagination : GET /products?page=1&limit=10
 */
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  category: categoryEnum.optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
