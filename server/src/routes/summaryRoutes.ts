import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import SummaryController from "../controllers/SummaryController";
import multer from "multer";
import multerConfig from "../config/multer";
import { supabaseUploadMiddleware } from "../middlewares/supabaseUploadMiddleware";

const routes = Router();
const upload = multer(multerConfig);

/**
 * @swagger
 * tags:
 *   - name: Summaries
 *     description: Resumos de livros.
 */

/**
 * @swagger
 * /summaries:
 *   post:
 *     summary: Envia novo resumo.
 *     tags: [Summaries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               content:
 *                 type: string
 *               coverImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: OK
 */
routes.post("/summaries", authMiddleware, upload.single('coverImage'), supabaseUploadMiddleware, SummaryController.store);

/**
 * @swagger
 * /my-summaries:
 *   get:
 *     summary: Lista meus resumos.
 *     tags: [Summaries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
routes.get("/my-summaries", authMiddleware, SummaryController.getMySummaries);

/**
 * @swagger
 * /summaries/{summaryId}:
 *   patch:
 *     summary: Atualiza um resumo existente.
 *     tags: [Summaries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: summaryId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               coverImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: OK
 */
routes.patch("/summaries/:summaryId", authMiddleware, upload.single('coverImage'), supabaseUploadMiddleware, SummaryController.update);

/**
 * @swagger
 * /summaries/{summaryId}:
 *   delete:
 *     summary: Exclui um resumo do usuário ou admin.
 *     tags: [Summaries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: summaryId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 */
routes.delete("/summaries/:summaryId", authMiddleware, SummaryController.destroy);

export default routes;
