import { Router } from 'express';
import FavoriteController from '../controllers/FavoriteController';
import authMiddleware from '../middlewares/auth';

const routes = Router();

routes.use(authMiddleware);

/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: Lista livros favoritos do usuário autenticado.
 *     tags: [Favorites]
 *     responses:
 *       200:
 *         description: OK
 */
routes.get('/', FavoriteController.index);
routes.get('/user', FavoriteController.index);

/**
 * @swagger
 * /favorites:
 *   post:
 *     summary: Adiciona um livro aos favoritos.
 *     tags: [Favorites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               slug:
 *                 type: string
 *     responses:
 *       201:
 *         description: OK
 */
routes.post('/', FavoriteController.store);

/**
 * @swagger
 * /favorites/{slug}:
 *   delete:
 *     summary: Remove um livro dos favoritos.
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: No Content
 */
routes.delete('/:slug', FavoriteController.destroy);

export default routes;
