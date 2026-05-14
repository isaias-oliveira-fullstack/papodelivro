import path from "path";
import type { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

function setupSwagger(app: Express) {
  const opts = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Papo de Livro API",
        version: "1.0.0",
        description: "Documentação interativa da API Papo de Livro",
      },
    },
    apis: [
      path.join(__dirname, "./routes/*.ts"),
      path.join(__dirname, "./routes/*.js"),
    ],
  };

  const swaggerSpec = swaggerJSDoc(opts);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("✅ Swagger configurado em /api-docs");
}

export default setupSwagger;
