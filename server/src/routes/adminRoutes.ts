import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";
import AdminController from "../controllers/AdminController";
import BookController from "../controllers/BookController";
import MessageController from "../controllers/MessageController";
import UserController from "../controllers/UserController";
import multer from "multer";
import multerConfig from "../config/multer";
import { supabaseUploadMiddleware } from "../middlewares/supabaseUploadMiddleware";

const router = Router();
const upload = multer(multerConfig);

router.use(authMiddleware);
router.use(adminMiddleware);

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Endpoints administrativos.
 */

/**
 * @swagger
 * /admin/pending-summaries:
 *   get:
 *     summary: Lista resumos pendentes.
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/pending-summaries", AdminController.listPendingSummaries);

/**
 * @swagger
 * /admin/summaries/{summaryId}/approve:
 *   post:
 *     summary: Aprova um resumo.
 *     tags: [Admin]
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
router.post("/summaries/:summaryId/approve", AdminController.approveSummary);

/**
 * @swagger
 * /admin/summaries/{summaryId}:
 *   delete:
 *     summary: Rejeita/deleta resumo.
 *     tags: [Admin]
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
router.delete("/summaries/:summaryId", AdminController.deleteSummary);

/**
 * @swagger
 * /admin/summaries/{summaryId}/reject:
 *   post:
 *     summary: Rejeita um resumo.
 *     tags: [Admin]
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
router.post("/summaries/:summaryId/reject", AdminController.rejectSummary);

/**
 * @swagger
 * /admin/books/{bookId}/cover:
 *   patch:
 *     summary: Atualiza capa de livro.
 *     tags: [Admin]
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
 *               coverImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: OK
 */
router.patch("/books/:bookId/cover", upload.single('coverImage'), supabaseUploadMiddleware, AdminController.updateBookCover);

/**
 * @swagger
 * /admin/books:
 *   get:
 *     summary: Lista todos os livros.
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/books', BookController.adminListBooks);

/**
 * @swagger
 * /admin/books:
 *   post:
 *     summary: Cria um novo livro como administrador.
 *     tags: [Admin]
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
router.post('/books', upload.single('coverImage'), supabaseUploadMiddleware, BookController.adminStore);

/**
 * @swagger
 * /admin/books/{bookId}:
 *   get:
 *     summary: Retorna um livro pelo ID.
 *     tags: [Admin]
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
router.get('/books/:bookId', BookController.getBookById);

/**
 * @swagger
 * /admin/books/{bookId}:
 *   patch:
 *     summary: Atualiza um livro como administrador.
 *     tags: [Admin]
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
router.patch('/books/:bookId', upload.single('coverImage'), supabaseUploadMiddleware, BookController.adminUpdateBook);

/**
 * @swagger
 * /admin/books/{bookId}:
 *   delete:
 *     summary: Exclui um livro como administrador.
 *     tags: [Admin]
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
router.delete('/books/:bookId', BookController.adminDestroyBook);

/**
 * @swagger
 * /admin/all-summaries:
 *   get:
 *     summary: Lista todos os resumos.
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/all-summaries", AdminController.listAllSummaries);

/**
 * @swagger
 * /admin/messages:
 *   get:
 *     summary: Lista mensagens de contato.
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/messages", MessageController.index);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Lista todos os usuários.
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/users', UserController.listUsers);

/**
 * @swagger
 * /admin/users/{userId}:
 *   patch:
 *     summary: Atualiza os dados de um usuário.
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: userId
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
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.patch('/users/:userId', UserController.updateUser);

/**
 * @swagger
 * /admin/users/{userId}:
 *   delete:
 *     summary: Exclui um usuário.
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 */
router.delete('/users/:userId', UserController.deleteUser);

/**
 * @swagger
 * /admin/messages/{messageId}/reply:
 *   post:
 *     summary: Envia uma resposta para uma mensagem de contato.
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: messageId
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
 *               replyText:
 *                 type: string
 *     responses:
 *       200:
 *         description: Resposta enviada com sucesso.
 */
router.post("/messages/:messageId/reply", MessageController.reply);

/**
 * @swagger
 * /admin/messages/{messageId}:
 *   delete:
 *     summary: Deleta mensagem de contato.
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 */
router.delete("/messages/:messageId", MessageController.destroy);

export default router;
