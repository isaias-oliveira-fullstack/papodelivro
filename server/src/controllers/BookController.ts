import { Request, Response } from 'express';
import { Op, fn, col, Sequelize } from 'sequelize';
import slugify from 'slugify';
import db from '../models';

interface AuthRequest extends Request {
  userId?: number;
  file?: Express.Multer.File;
}

const { Book, Summary, User, Review } = db;

class BookController {
  async index(req: Request, res: Response) {
    try {
      const search = String(req.query.search ?? '').trim();
      const page = Math.max(Number(req.query.page ?? 1), 1);
      const limit = Math.min(Math.max(Number(req.query.limit ?? 20), 1), 100);
      const offset = (page - 1) * limit;

      const where: any = { status: 'COMPLETED' };

      if (search) {
        // Validação rigorosa para prevenir SQL injection
        if (search.length > 100) {
          return res.status(400).json({ error: 'Termo de busca muito longo.' });
        }

        // Permitir apenas caracteres seguros: letras, números, espaços, hífen, apóstrofo, parênteses
        const allowedChars = /^[a-zA-Z0-9\s\-'&()À-ÿ]+$/;
        if (!allowedChars.test(search)) {
          return res.status(400).json({ error: 'Termo de busca contém caracteres inválidos.' });
        }

        // Usar LOWER() para busca case-insensitive mais segura
        const searchLower = search.toLowerCase();
        where[Op.or] = [
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('title')), { [Op.like]: `%${searchLower}%` }),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('author')), { [Op.like]: `%${searchLower}%` }),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('category')), { [Op.like]: `%${searchLower}%` }),
        ];
      }

      const books = await Book.findAll({
        where,
        order: [['title', 'ASC']],
        limit,
        offset,
        attributes: ['id', 'title', 'author', 'category', 'slug', 'cover_url', 'full_cover_url'],
      });

      return res.json(books);
    } catch (error) {
      console.error('🔥 ERRO AO BUSCAR LIVROS:', error);
      return res.status(500).json({ error: 'Erro ao buscar livros.' });
    }
  }

  async show(req: Request, res: Response) {
    try {
      const { slug } = req.params;

      const book = await Book.findOne({
        where: { slug, status: 'COMPLETED' },
        attributes: ['id', 'title', 'author', 'category', 'slug', 'cover_url', 'full_cover_url'],
        include: [
          {
            model: Summary,
            as: 'summaries',
            where: { status: 'COMPLETED' },
            required: false,
            attributes: ['content'],
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['name'],
              },
            ],
          },
        ],
      });

      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado ou aguardando aprovação.' });
      }

      const ratingStats = await Review.findOne({
        where: { book_id: book.id },
        attributes: [
          [fn('AVG', col('rating')), 'averageRating'],
          [fn('COUNT', col('id')), 'reviewsCount'],
        ],
        raw: true,
      });

      const summaryData = book.summaries && book.summaries.length > 0 ? book.summaries[0] : null;
      const averageRating = ratingStats?.averageRating ? Number(Number(ratingStats.averageRating).toFixed(1)) : 0;
      const reviewsCount = Number(ratingStats?.reviewsCount ?? 0);

      const formattedBook = {
        id: book.id,
        title: book.title,
        author: book.author,
        category: book.category,
        slug: book.slug,
        cover_url: book.full_cover_url,
        summary: summaryData ? summaryData.content : null,
        submitted_by: summaryData && summaryData.user ? summaryData.user.name : null,
        averageRating,
        reviewsCount,
      };

      return res.json(formattedBook);
    } catch (error) {
      console.error('🔥 ERRO AO BUSCAR DETALHES DO LIVRO:', error);
      return res.status(500).json({ error: 'Erro ao buscar detalhes do livro.' });
    }
  }

  async myBooks(req: AuthRequest, res: Response) {
    try {
      const books = await Book.findAll({
        where: { user_id: req.userId },
        order: [['created_at', 'DESC']],
        attributes: ['id', 'title', 'author', 'category', 'slug', 'cover_url', 'full_cover_url', 'status'],
      });

      return res.json(books);
    } catch (error) {
      console.error('🔥 ERRO AO BUSCAR MEUS LIVROS:', error);
      return res.status(500).json({ error: 'Erro ao buscar seus livros.' });
    }
  }

  async getBookById(req: AuthRequest, res: Response) {
    try {
      const { bookId } = req.params;
      const book = await Book.findByPk(bookId, {
        attributes: ['id', 'title', 'author', 'category', 'slug', 'cover_url', 'full_cover_url', 'status', 'user_id'],
      });

      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado.' });
      }

      if (book.user_id !== req.userId) {
        const currentUser = await User.findByPk(req.userId);
        if (!currentUser || currentUser.role !== 'admin') {
          return res.status(403).json({ error: 'Ação não permitida.' });
        }
      }

      const ownSummary = await Summary.findOne({
        where: {
          book_id: book.id,
          user_id: req.userId,
        },
        order: [['created_at', 'DESC']],
        attributes: ['id', 'content', 'status'],
      });

      const latestSummary = ownSummary || await Summary.findOne({
        where: { book_id: book.id },
        order: [['created_at', 'DESC']],
        attributes: ['id', 'content', 'status', 'user_id'],
      });

      const responseData = {
        id: book.id,
        title: book.title,
        author: book.author,
        category: book.category,
        slug: book.slug,
        cover_url: book.cover_url,
        full_cover_url: book.full_cover_url,
        status: book.status,
        user_id: book.user_id,
        summary: latestSummary?.content ?? null,
        summary_id: latestSummary?.id ?? null,
        summary_status: latestSummary?.status ?? null,
      };

      return res.json(responseData);
    } catch (error) {
      console.error('🔥 ERRO AO BUSCAR LIVRO:', error);
      return res.status(500).json({ error: 'Erro ao buscar o livro.' });
    }
  }

  async store(req: AuthRequest, res: Response) {
    try {
      const { title, author, category } = req.body;
      const coverFile = req.file?.filename;

      if (!title || !author || !category) {
        return res.status(400).json({ error: 'Título, autor e categoria são obrigatórios.' });
      }

      if (!coverFile) {
        return res.status(400).json({ error: 'A imagem da capa é obrigatória.' });
      }

      const bookSlug = slugify(title, { lower: true, strict: true });
      const existingBook = await Book.findOne({ where: { slug: bookSlug } });

      if (existingBook) {
        return res.status(409).json({ error: 'Já existe um livro com esse título. Edite o livro existente ou escolha outro título.' });
      }

      const book = await Book.create({
        title,
        author,
        category,
        cover_url: coverFile,
        slug: bookSlug,
        status: 'PENDING',
        user_id: req.userId,
      });

      return res.status(201).json(book);
    } catch (error) {
      console.error('🔥 ERRO AO CRIAR LIVRO:', error);
      return res.status(500).json({ error: 'Erro ao cadastrar livro.' });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const { bookId } = req.params;
      const { title, author, category, status } = req.body;
      const book = await Book.findByPk(bookId);

      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado.' });
      }

      if (book.user_id !== req.userId) {
        const currentUser = await User.findByPk(req.userId);
        if (!currentUser || currentUser.role !== 'admin') {
          return res.status(403).json({ error: 'Ação não permitida.' });
        }
      }

      if (title && title !== book.title) {
        const newSlug = slugify(title, { lower: true, strict: true });
        const existingBook = await Book.findOne({
          where: {
            slug: newSlug,
            id: { [Op.ne]: book.id },
          },
        });

        if (existingBook) {
          return res.status(409).json({ error: 'Já existe outro livro com esse título.' });
        }

        book.title = title;
        book.slug = newSlug;
      }

      if (author) book.author = author;
      if (category) book.category = category;
      if (req.file) book.cover_url = req.file.filename;
      if (status && (await User.findByPk(req.userId))?.role === 'admin') {
        book.status = status;
      }

      await book.save();
      return res.json(book);
    } catch (error) {
      console.error('🔥 ERRO AO ATUALIZAR LIVRO:', error);
      return res.status(500).json({ error: 'Erro ao atualizar livro.' });
    }
  }

  async destroy(req: AuthRequest, res: Response) {
    try {
      const { bookId } = req.params;
      const book = await Book.findByPk(bookId);

      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado.' });
      }

      if (book.user_id !== req.userId) {
        const currentUser = await User.findByPk(req.userId);
        if (!currentUser || currentUser.role !== 'admin') {
          return res.status(403).json({ error: 'Ação não permitida.' });
        }
      }

      await book.destroy();
      return res.json({ message: 'Livro excluído com sucesso.' });
    } catch (error) {
      console.error('🔥 ERRO AO EXCLUIR LIVRO:', error);
      return res.status(500).json({ error: 'Erro ao excluir livro.' });
    }
  }

  async adminListBooks(req: AuthRequest, res: Response) {
    try {
      const books = await Book.findAll({
        order: [['created_at', 'DESC']],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email'],
          },
        ],
        attributes: ['id', 'title', 'author', 'category', 'slug', 'cover_url', 'full_cover_url', 'status', 'user_id', 'created_at'],
      });

      return res.json(books);
    } catch (error) {
      console.error('🔥 ERRO AO BUSCAR LIVROS ADMIN:', error);
      return res.status(500).json({ error: 'Erro ao buscar livros.' });
    }
  }

  async adminStore(req: AuthRequest, res: Response) {
    try {
      const { title, author, category, status, userId } = req.body;
      const coverFile = req.file?.filename;

      if (!title || !author || !category) {
        return res.status(400).json({ error: 'Título, autor e categoria são obrigatórios.' });
      }

      if (!coverFile) {
        return res.status(400).json({ error: 'A imagem da capa é obrigatória.' });
      }

      const bookSlug = slugify(title, { lower: true, strict: true });
      const existingBook = await Book.findOne({ where: { slug: bookSlug } });

      if (existingBook) {
        return res.status(409).json({ error: 'Já existe um livro com esse título.' });
      }

      const book = await Book.create({
        title,
        author,
        category,
        cover_url: coverFile,
        slug: bookSlug,
        status: status || 'COMPLETED',
        user_id: userId || req.userId,
      });

      return res.status(201).json(book);
    } catch (error) {
      console.error('🔥 ERRO AO CRIAR LIVRO ADMIN:', error);
      return res.status(500).json({ error: 'Erro ao cadastrar livro.' });
    }
  }

  async adminUpdateBook(req: AuthRequest, res: Response) {
    try {
      const { bookId } = req.params;
      const { title, author, category, status } = req.body;
      const book = await Book.findByPk(bookId);

      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado.' });
      }

      if (title && title !== book.title) {
        const newSlug = slugify(title, { lower: true, strict: true });
        const existingBook = await Book.findOne({
          where: {
            slug: newSlug,
            id: { [Op.ne]: book.id },
          },
        });

        if (existingBook) {
          return res.status(409).json({ error: 'Já existe outro livro com esse título.' });
        }

        book.title = title;
        book.slug = newSlug;
      }

      if (author) book.author = author;
      if (category) book.category = category;
      if (status) book.status = status;
      if (req.file) book.cover_url = req.file.filename;

      await book.save();
      return res.json(book);
    } catch (error) {
      console.error('🔥 ERRO AO ATUALIZAR LIVRO ADMIN:', error);
      return res.status(500).json({ error: 'Erro ao atualizar livro.' });
    }
  }

  async adminDestroyBook(req: AuthRequest, res: Response) {
    try {
      const { bookId } = req.params;
      const book = await Book.findByPk(bookId);

      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado.' });
      }

      await book.destroy();
      return res.json({ message: 'Livro excluído com sucesso.' });
    } catch (error) {
      console.error('🔥 ERRO AO EXCLUIR LIVRO ADMIN:', error);
      return res.status(500).json({ error: 'Erro ao excluir livro.' });
    }
  }

  async getUserBooks(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const uid = Number(userId);
      const books = await Book.findAll({
        where: { user_id: uid },
        order: [['created_at', 'DESC']],
      });

      return res.status(200).json(books);
    } catch (error) {
      console.error('Erro ao buscar livros do usuário:', error);
      return res.status(500).json({ error: 'Erro ao buscar livros.' });
    }
  }

  async getUserSummaries(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const uid = Number(userId);
      const Summary = require('../models').Summary;
      const summaries = await Summary.findAll({
        where: { user_id: uid },
        order: [['created_at', 'DESC']],
      });

      return res.status(200).json(summaries);
    } catch (error) {
      console.error('Erro ao buscar resumos do usuário:', error);
      return res.status(500).json({ error: 'Erro ao buscar resumos.' });
    }
  }

  async getUserReviews(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const uid = Number(userId);
      const Review = require('../models').Review;
      const reviews = await Review.findAll({
        where: { user_id: uid },
        order: [['created_at', 'DESC']],
      });

      return res.status(200).json(reviews);
    } catch (error) {
      console.error('Erro ao buscar avaliações do usuário:', error);
      return res.status(500).json({ error: 'Erro ao buscar avaliações.' });
    }
  }
}

export default new BookController();
