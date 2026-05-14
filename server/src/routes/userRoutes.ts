import { Router } from 'express';
import multer from 'multer';
import authMiddleware from '../middlewares/auth';
import UserController from '../controllers/UserController';
import BookController from '../controllers/BookController';
import multerConfig from '../config/multer';

const router = Router();
const upload = multer(multerConfig);

// Aplicar authMiddleware APENAS para rotas que realmente precisam
// NÃO usar router.use(authMiddleware) pois afeta todas as subrotas

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Retorna os dados do usuário logado.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/users/me', authMiddleware, UserController.getProfile);

router.get('/users/me/messages', authMiddleware, UserController.getMyMessages);

/**
 * @swagger
 * /users/me/books:
 *   get:
 *     summary: Lista os livros criados pelo usuário logado.
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/users/me/books', authMiddleware, BookController.myBooks);

/**
 * @swagger
 * /users/me/books/{bookId}:
 *   get:
 *     summary: Retorna um livro do usuário logado.
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/users/me/books/:bookId', authMiddleware, BookController.getBookById);

/**
 * @swagger
 * /users/me/books:
 *   post:
 *     summary: Cria um novo livro para o usuário logado.
 *     tags: [Books]
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
 *               category:
 *                 type: string
 *               coverImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: OK
 */
router.post('/users/me/books', authMiddleware, upload.single('coverImage'), BookController.store);

/**
 * @swagger
 * /users/me/books/{bookId}:
 *   patch:
 *     summary: Atualiza um livro do usuário logado.
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
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
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               category:
 *                 type: string
 *               status:
 *                 type: string
 *               coverImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: OK
 */
router.patch('/users/me/books/:bookId', authMiddleware, upload.single('coverImage'), BookController.update);

/**
 * @swagger
 * /users/me/books/{bookId}:
 *   delete:
 *     summary: Exclui um livro do usuário logado.
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 */
router.delete('/users/me/books/:bookId', authMiddleware, BookController.destroy);

/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: Atualiza os dados do usuário logado.
 *     tags: [Users]
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
 *       200:
 *         description: OK
 */
router.patch('/users/me', authMiddleware, UserController.updateProfile);

/**
 * @swagger
 * /users/me:
 *   delete:
 *     summary: Exclui a conta do usuário logado.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: OK
 */
router.delete('/users/me', authMiddleware, UserController.deleteProfile);

export default router;
