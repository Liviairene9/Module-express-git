# Lumia Products API

API REST pour la gestion du catalogue de produits (parfums & accessoires) de **Lumia & Accessories**.

Domaine choisi : **produits** (`products`) — nom, description, prix (FCFA), catégorie, stock.

## Stack technique

- **Express** — serveur HTTP
- **TypeScript** — typage statique
- **Zod** — validation des entrées (body & query params)
- Stockage **en mémoire** via une `Map` (aucune base de données requise)

## Installation

```bash
npm install
```

## Lancer le projet

```bash
# Mode développement (rechargement auto)
npm run dev

# Build + exécution en production
npm run build
npm start
```

Par défaut le serveur écoute sur `http://localhost:3000` (modifiable via la variable d'environnement `PORT`).

Au démarrage, 3 produits de démonstration sont automatiquement créés (seed data).

## Structure du projet

```
src/
├── app.ts                    # Configuration de l'app Express (middlewares, routes)
├── server.ts                 # Point d'entrée (démarrage du serveur)
├── types/product.ts          # Types TypeScript (Product, Pagination...)
├── schemas/productSchema.ts  # Schémas de validation Zod
├── store/productStore.ts     # Stockage en mémoire (Map) + seed
├── routes/productRoutes.ts   # Endpoints CRUD /products
├── middleware/errorHandler.ts# Middleware d'erreur global + 404
└── utils/AppError.ts         # Classe d'erreur applicative + asyncHandler
```

## Modèle de données

```ts
{
  id: string;            // UUID généré automatiquement
  name: string;           // 2 à 120 caractères
  description: string;    // 5 à 1000 caractères
  price: number;           // nombre positif (en FCFA)
  category: "parfum" | "accessoire" | "sac" | "bijou" | "autre";
  stock: number;           // entier >= 0
  createdAt: string;       // ISO date, généré automatiquement
  updatedAt: string;       // ISO date, mis à jour automatiquement
}
```

## Endpoints

| Méthode | Route            | Description                          |
|---------|-------------------|--------------------------------------|
| GET     | `/products`       | Liste paginée (+ filtre catégorie)   |
| GET     | `/products/:id`   | Détail d'un produit                  |
| POST    | `/products`       | Création d'un produit                |
| PUT     | `/products/:id`   | Mise à jour (partielle) d'un produit |
| DELETE  | `/products/:id`   | Suppression d'un produit             |
| GET     | `/health`         | Vérification que l'API répond        |

---

### GET /products — Liste paginée

Query params optionnels : `page` (défaut `1`), `limit` (défaut `10`, max `100`), `category`.

```bash
curl "http://localhost:3000/products?page=1&limit=2"
```

Réponse `200 OK` :

```json
{
  "data": [
    {
      "id": "fbb67855-42a2-49a7-9503-ab342ff3ef82",
      "name": "Eau de parfum Élégance",
      "description": "Parfum floral longue tenue, 50ml",
      "price": 15000,
      "category": "parfum",
      "stock": 12,
      "createdAt": "2026-07-17T20:03:47.988Z",
      "updatedAt": "2026-07-17T20:03:47.988Z"
    }
  ],
  "pagination": { "page": 1, "limit": 2, "total": 3, "totalPages": 2 }
}
```
Filtrer par catégorie :

```bash
curl "http://localhost:3000/products?category=bijou"
```

---

### GET /products/:id — Détail

```bash
curl http://localhost:3000/products/fbb67855-42a2-49a7-9503-ab342ff3ef82
```

Réponse `200 OK` : `{ "data": { ...produit } }`

Si l'id n'existe pas → `404 Not Found` :

```json
{ "error": { "message": "Produit xxxx introuvable" } }
```

---

### POST /products — Création

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
        "name": "Bracelet argenté",
        "description": "Bracelet fantaisie argenté pour femme",
        "price": 4500,
        "category": "bijou",
        "stock": 10
      }'
```

Réponse `201 Created` : `{ "data": { ...produit créé, avec id/createdAt/updatedAt } }`

Si le corps est invalide → `400 Bad Request` :

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name":"a"}'
```

```json
{
  "error": {
    "message": "Corps de la requête invalide",
    "details": {
      "fieldErrors": {
        "name": ["Le nom doit contenir au moins 2 caractères"],
        "description": ["La description est obligatoire"],
        "price": ["Le prix est obligatoire"],
        "category": ["Required"],
        "stock": ["Le stock est obligatoire"]
      }
    }
  }
}
```

---

### PUT /products/:id — Mise à jour partielle

```bash
curl -X PUT http://localhost:3000/products/<ID> \
  -H "Content-Type: application/json" \
  -d '{"stock": 25, "price": 4800}'
```

Réponse `200 OK` : `{ "data": { ...produit mis à jour } }`

`404 Not Found` si l'id n'existe pas, `400 Bad Request` si le corps est invalide (ex : champ vide `{}`).

---

### DELETE /products/:id — Suppression

```bash
curl -X DELETE http://localhost:3000/products/<ID> -i
```

Réponse `204 No Content` (pas de corps). `404 Not Found` si l'id n'existe pas.

---

## Collection Postman

Importer directement dans Postman via **Import > Raw text**, en collant l'URL de base `http://localhost:3000` et en créant une requête par endpoint ci-dessus, ou utiliser les commandes `curl` telles quelles (Postman propose "Import > cURL").

## Gestion des erreurs

Toutes les erreurs passent par un middleware global (`src/middleware/errorHandler.ts`) et renvoient un format JSON cohérent :

```json
{ "error": { "message": "...", "details": { } } }
```

- `400` — validation Zod échouée (body ou query params)
- `404` — ressource ou route introuvable
- `500` — erreur serveur inattendue (loggée côté serveur, message générique côté client)

## Limites connues / pistes d'amélioration

- Stockage en mémoire : les données sont perdues à chaque redémarrage du serveur (à remplacer par PostgreSQL/Prisma pour la persistance).
- Pas d'authentification (à ajouter si l'API devient publique).
- Pas de tests automatisés (à ajouter avec Jest/Vitest + Supertest).
