import { v4 as uuid } from "uuid";
import { Product } from "../types/product";

/**
 * Stockage en mémoire basé sur une Map<id, Product>.
 * Suffisant pour le développement / les tests ; à remplacer par une vraie
 * base de données (PostgreSQL, MongoDB...) en production.
 */
class ProductStore {
  private products = new Map<string, Product>();

  constructor() {
    this.seed();
  }

  private seed() {
    const now = new Date().toISOString();
    const seedData: Omit<Product, "id" | "createdAt" | "updatedAt">[] = [
      {
        name: "Eau de parfum Élégance",
        description: "Parfum floral longue tenue, 50ml",
        price: 15000,
        category: "parfum",
        stock: 12,
      },
      {
        name: "Sac à main cuir Zoé",
        description: "Sac à main simili cuir, plusieurs coloris",
        price: 22000,
        category: "sac",
        stock: 5,
      },
      {
        name: "Bracelet perles dorées",
        description: "Bracelet fantaisie ajustable",
        price: 3500,
        category: "bijou",
        stock: 20,
      },
    ];

    for (const item of seedData) {
      const id = uuid();
      this.products.set(id, { ...item, id, createdAt: now, updatedAt: now });
    }
  }

  findAll(): Product[] {
    return Array.from(this.products.values());
  }

  findById(id: string): Product | undefined {
    return this.products.get(id);
  }

  create(data: Omit<Product, "id" | "createdAt" | "updatedAt">): Product {
    const now = new Date().toISOString();
    const product: Product = { ...data, id: uuid(), createdAt: now, updatedAt: now };
    this.products.set(product.id, product);
    return product;
  }

  update(id: string, data: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>): Product | undefined {
    const existing = this.products.get(id);
    if (!existing) return undefined;

    const updated: Product = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.products.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.products.delete(id);
  }
}

// Instance unique partagée par toute l'application (singleton).
export const productStore = new ProductStore();
