import { Router } from 'express';
import AuthController from '../controllers/AuthController';

const routes = Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Autenticação de usuários.
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra novo usuário comum.
 *     tags: [Auth]
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
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: OK
 */
routes.post('/register', AuthController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login de usuário.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 */
routes.post('/login', AuthController.login);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Solicita recuperação de senha.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 */
routes.post('/forgot-password', AuthController.forgotPassword);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Redefine a senha usando token de recuperação.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 */
routes.post('/reset-password', AuthController.resetPassword);

/**
 * @swagger
 * /auth/register/admin:
 *   post:
 *     summary: Registra novo administrador.
 *     tags: [Auth]
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
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: OK
 */
routes.post('/register/admin', AuthController.registerAdmin);

export default routes;
