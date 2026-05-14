import { Router } from "express";
import ReviewController from "../controllers/ReviewController";
import authMiddleware from "../middlewares/auth";

const routes = Router();

/**
 * @swagger
 * tags:
 *   - name: Reviews
 *     description: Avaliações e resenhas.
 */

/**
 * @swagger
 * /books/{slug}/reviews:
 *   get:
 *     summary: Lista avaliações de um livro.
 *     tags: [Reviews]
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
routes.get("/books/:slug/reviews", ReviewController.index);

/**
 * @swagger
 * /books/{slug}/ratings:
 *   get:
 *     summary: Estatísticas de avaliação de um livro.
 *     tags: [Reviews]
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
routes.get("/books/:slug/ratings", ReviewController.ratings);

/**
 * @swagger
 * /books/{slug}/reviews:
 *   post:
 *     summary: Cria nova avaliação.
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: OK
 */
routes.post("/books/:slug/reviews", authMiddleware, ReviewController.store);

/**
 * @swagger
 * /reviews/my:
 *   get:
 *     summary: Lista minhas avaliações.
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: OK
 */
routes.get("/reviews/my", authMiddleware, ReviewController.showMyReviews);

/**
 * @swagger
 * /reviews/{reviewId}:
 *   put:
 *     summary: Atualiza avaliação.
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 */
routes.put("/reviews/:reviewId", authMiddleware, ReviewController.update);

/**
 * @swagger
 * /reviews/{reviewId}:
 *   delete:
 *     summary: Deleta avaliação.
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 */
routes.delete("/reviews/:reviewId", authMiddleware, ReviewController.destroy);

export default routes;
