export type Category = "parfum" | "accessoire" | "sac" | "bijou" | "autre";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // en FCFA
  category: Category;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationMeta;
}
