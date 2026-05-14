import { Router } from 'express';
import authMiddleware from '../middlewares/auth';
import PromptController from '../controllers/PromptController';

const router = Router();

/**
 * @swagger
 * /prompt:
 *   post:
 *     summary: Envia um prompt de livro para o banco de dados.
 *     tags: [Prompt]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               category:
 *                 type: string
 *               promptText:
 *                 type: string
 *     responses:
 *       201:
 *         description: Prompt salvo com sucesso.
 */
router.post('/prompt', authMiddleware, PromptController.store);

export default router;
