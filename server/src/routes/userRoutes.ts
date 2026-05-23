import { Router } from 'express';
import multer from 'multer';
import authMiddleware from '../middlewares/auth';
import UserController from '../controllers/UserController';
import BookController from '../controllers/BookController';
import multerConfig from '../config/multer';
import { supabaseUploadMiddleware } from '../middlewares/supabaseUploadMiddleware';

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
router.post('/users/me/books', authMiddleware, upload.single('coverImage'), supabaseUploadMiddleware, BookController.store);

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
router.patch('/users/me/books/:bookId', authMiddleware, upload.single('coverImage'), supabaseUploadMiddleware, BookController.update);

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

// Rotas Públicas para Perfil de Usuário
/**
 * @swagger
 * /users/{userId}/profile:
 *   get:
 *     summary: Retorna os dados públicos do perfil de um usuário.
 *     tags: [Users]
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
router.get('/users/:userId/profile', (req, res, next) => {
  console.log('📍 Rota getUserPublicProfile atingida:', req.params);
  next();
}, UserController.getPublicProfile);

/**
 * @swagger
 * /users/{userId}/books:
 *   get:
 *     summary: Lista os livros criados por um usuário específico.
 *     tags: [Books]
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
router.get('/users/:userId/books', BookController.getUserBooks);

/**
 * @swagger
 * /users/{userId}/summaries:
 *   get:
 *     summary: Lista os resumos criados por um usuário específico.
 *     tags: [Summaries]
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
router.get('/users/:userId/summaries', BookController.getUserSummaries);

/**
 * @swagger
 * /users/{userId}/reviews:
 *   get:
 *     summary: Lista as avaliações criadas por um usuário específico.
 *     tags: [Reviews]
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
router.get('/users/:userId/reviews', BookController.getUserReviews);

// Rotas públicas por username (ex: /users/username/isaiasoliveira/...)
router.get('/users/username/:username/profile', async (req, res) => {
  try {
    const { username } = req.params;
    const models = require('../models');
    const { User } = models;

    // Tenta busca case-insensitive direta pelo `name`
    let user = await User.findOne({
      where: { name: models.sequelize.where(models.sequelize.fn('lower', models.sequelize.col('name')), username.toLowerCase()) },
      attributes: ['id', 'name', 'email', 'role', 'createdAt'],
    });

    // Se não encontrou, busca todos e tenta normalizar (remover espaços) ou comparar com parte local do email
    if (!user) {
      const all = await User.findAll({ attributes: ['id', 'name', 'email', 'role', 'createdAt'] });
      const normalized = username.toLowerCase();
      user = all.find((u: any) => {
        const nameNorm = (u.name || '').toLowerCase().replace(/\s+/g, '');
        const emailLocal = (u.email || '').toLowerCase().split('@')[0];
        return nameNorm === normalized || emailLocal === normalized || (u.name || '').toLowerCase() === normalized;
      });
    }

    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    return res.status(200).json(user);
  } catch (err) {
    console.error('Erro ao buscar perfil público por username:', err);
    return res.status(500).json({ error: 'Erro ao carregar perfil público.' });
  }
});

router.get('/users/username/:username/books', async (req, res) => {
  try {
    const { username } = req.params;
    const models = require('../models');
    const { User, Book } = models;

    // Reutilizar lógica de busca por username
    const allUsers = await User.findAll({ attributes: ['id', 'name', 'email'] });
    const normalized = username.toLowerCase();
    const found = allUsers.find((u: any) => {
      const nameNorm = (u.name || '').toLowerCase().replace(/\s+/g, '');
      const emailLocal = (u.email || '').toLowerCase().split('@')[0];
      return nameNorm === normalized || emailLocal === normalized || (u.name || '').toLowerCase() === normalized;
    });

    if (!found) return res.status(404).json({ error: 'Usuário não encontrado.' });

    console.log('[username->books] Usuário encontrado id=', found.id, 'username=', username);
    // Usar nome da coluna do DB (underscored) para evitar incompatibilidades
    const books = await Book.findAll({ where: { user_id: found.id }, order: [['created_at', 'DESC']] });
    console.log('[username->books] livros buscados, count=', Array.isArray(books) ? books.length : 0);
    return res.status(200).json(books);
  } catch (err) {
    console.error('Erro ao buscar livros por username:', {
      message: (err as any)?.message || err,
      stack: (err as any)?.stack || null,
      params: req.params,
      query: req.query,
      headers: { authorization: req.headers.authorization },
    });
    return res.status(500).json({ error: 'Erro ao buscar livros.' });
  }
});

router.get('/users/username/:username/summaries', async (req, res) => {
  try {
    const { username } = req.params;
    const models = require('../models');
    const { User, Summary } = models;

    const allUsers = await User.findAll({ attributes: ['id', 'name', 'email'] });
    const normalized = username.toLowerCase();
    const found = allUsers.find((u: any) => {
      const nameNorm = (u.name || '').toLowerCase().replace(/\s+/g, '');
      const emailLocal = (u.email || '').toLowerCase().split('@')[0];
      return nameNorm === normalized || emailLocal === normalized || (u.name || '').toLowerCase() === normalized;
    });

    if (!found) return res.status(404).json({ error: 'Usuário não encontrado.' });
    const summaries = await Summary.findAll({ where: { user_id: found.id }, order: [['created_at', 'DESC']] });
    return res.status(200).json(summaries);
  } catch (err) {
    console.error('Erro ao buscar resumos por username:', {
      message: (err as any)?.message || err,
      stack: (err as any)?.stack || null,
      params: req.params,
    });
    return res.status(500).json({ error: 'Erro ao buscar resumos.' });
  }
});

router.get('/users/username/:username/reviews', async (req, res) => {
  try {
    const { username } = req.params;
    const models = require('../models');
    const { User, Review } = models;

    const allUsers = await User.findAll({ attributes: ['id', 'name', 'email'] });
    const normalized = username.toLowerCase();
    const found = allUsers.find((u: any) => {
      const nameNorm = (u.name || '').toLowerCase().replace(/\s+/g, '');
      const emailLocal = (u.email || '').toLowerCase().split('@')[0];
      return nameNorm === normalized || emailLocal === normalized || (u.name || '').toLowerCase() === normalized;
    });

    if (!found) return res.status(404).json({ error: 'Usuário não encontrado.' });
    const reviews = await Review.findAll({ where: { user_id: found.id }, order: [['created_at', 'DESC']] });
    return res.status(200).json(reviews);
  } catch (err) {
    console.error('Erro ao buscar avaliações por username:', {
      message: (err as any)?.message || err,
      stack: (err as any)?.stack || null,
      params: req.params,
    });
    return res.status(500).json({ error: 'Erro ao buscar avaliações.' });
  }
});

router.get('/users/username/:username/favorites', async (req, res) => {
  try {
    const { username } = req.params
    const models = require('../models')

    const { User, Favorite, Book } = models

    const allUsers = await User.findAll({
      attributes: ['id', 'name', 'email']
    })

    const normalized = username.toLowerCase()

    const found = allUsers.find((u: any) => {
      const nameNorm = (u.name || '')
        .toLowerCase()
        .replace(/\s+/g, '')

      const emailLocal = (u.email || '')
        .toLowerCase()
        .split('@')[0]

      return (
        nameNorm === normalized ||
        emailLocal === normalized ||
        (u.name || '').toLowerCase() === normalized
      )
    })

    if (!found) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      })
    }

    const favorites = await Favorite.findAll({
      where: {
        user_id: found.id
      },
      include: [
        {
          model: Book,
          as: 'book'
        }
      ],
      order: [['created_at', 'DESC']]
    })

    return res.json(favorites)
  } catch (err) {
    console.error('Erro ao buscar favoritos:', err)

    return res.status(500).json({
      error: 'Erro ao buscar favoritos'
    })
  }
})

export default router;
