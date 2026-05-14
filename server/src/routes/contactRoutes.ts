import { Router } from "express";
import ContactController from "../controllers/ContactController";

const routes = Router();

/**
 * @swagger
 * tags:
 *   - name: Contact
 *     description: Mensagens de contato.
 */

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Envia nova mensagem de contato.
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: OK
 */
routes.post("/contact", ContactController.store);

export default routes;
