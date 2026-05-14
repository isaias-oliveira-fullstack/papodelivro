import { Router } from "express";
import BookController from "../controllers/BookController";

const routes = Router();

/**
 * @swagger
 * tags:
 *   - name: Books
 *     description: Livros e seus detalhes.
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Lista todos os livros aprovados.
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: OK
 */
routes.get("/", BookController.index);

/**
 * @swagger
 * /books/{slug}:
 *   get:
 *     summary: Detalhes de um livro por slug.
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
routes.get("/:slug", BookController.show);

export default routes;
