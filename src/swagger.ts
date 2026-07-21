import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Lumia Products API",
      version: "1.0.0",
      description: "API REST pour la gestion du catalogue de produits (Lumia & Accessories)",
    },
    servers: [{ url: "/" }],
  },
  apis: ["./src/routes/*.ts", "./dist/routes/*.js"],
});