import { Request, Response } from 'express';
import { fn, col } from 'sequelize';
import db from '../models';

interface AuthRequest extends Request {
  userId?: number;
}

const { Review, Book, User } = db;

class ReviewController {
  async store(req: AuthRequest, res: Response) {
    const { rating, content } = req.body;
    const { slug } = req.params;
    const userId = req.userId as number;

    try {
      if (!rating || !content) {
        return res.status(400).json({ error: 'Nota e comentário são obrigatórios.' });
      }

      const book = await Book.findOne({ where: { slug }, attributes: ['id', 'title', 'author', 'cover_url', 'full_cover_url', 'slug'] });
      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado.' });
      }

      const existingReview = await Review.findOne({
        where: { user_id: userId, book_id: book.id },
      });
      if (existingReview) {
        return res.status(409).json({ error: 'Você já avaliou este livro.' });
      }

      const review = await Review.create({
        rating,
        content,
        user_id: userId,
        book_id: book.id,
        slug: book.slug,
      });

      const user = await User.findByPk(userId, { attributes: ['id', 'name'] });

      const responseData = {
        ...review.toJSON(),
        userId: user?.id,
        user: user?.toJSON(),
        book: {
          id: book.id,
          title: book.title,
          slug: book.slug,
          cover_url: book.full_cover_url,
        },
      };

      return res.status(201).json(responseData);
    } catch (err) {
      console.error('Erro ao criar avaliação:', err);
      return res.status(500).json({ error: 'Falha ao criar a avaliação.' });
    }
  }

  async index(req: Request, res: Response) {
    const { slug } = req.params;
    try {
      const book = await Book.findOne({ where: { slug } });
      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado.' });
      }

      const reviews = await Review.findAll({
        where: { book_id: book.id },
        order: [['created_at', 'DESC']],
        include: [
          { model: User, as: 'user', attributes: ['id', 'name'] },
          {
            model: Book,
            as: 'book',
            attributes: ['id', 'title', 'cover_url', 'slug', 'full_cover_url'],
          },
        ],
      });

      const formattedReviews = reviews.map((rev) => ({
        ...rev.toJSON(),
        userId: rev.user?.id,
        book: {
          ...rev.book.toJSON(),
          cover_url: rev.book.full_cover_url,
        },
      }));

      return res.status(200).json(formattedReviews);
    } catch (err) {
      console.error('Erro ao listar avaliações:', err);
      return res.status(500).json({ error: 'Falha ao listar avaliações.' });
    }
  }

  async showMyReviews(req: AuthRequest, res: Response) {
    const userId = req.userId as number;
    console.log('showMyReviews called, userId=', userId, 'authHeader=', req.headers.authorization);

    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    try {
      const reviews = await Review.findAll({
        where: { user_id: userId },
        include: [
          {
            model: Book,
            as: 'book',
            attributes: ['id', 'title', 'cover_url', 'slug', 'full_cover_url'],
            required: false,
          },
        ],
        order: [['created_at', 'DESC']],
      });

      const formattedReviews = reviews.map((rev) => {
        const plainReview = rev.get({ plain: true }) as any;
        const book = plainReview.book ?? null;
        return {
          ...plainReview,
          userId,
          book: book
            ? {
                ...book,
                cover_url: book.full_cover_url,
              }
            : null,
        };
      });

      return res.json(formattedReviews);
    } catch (err) {
      console.error(
        'Erro ao buscar minhas avaliações:',
        err instanceof Error ? err.stack : err
      );
      return res.status(500).json({ error: 'Falha ao buscar suas avaliações.' });
    }
  }

  async update(req: AuthRequest, res: Response) {
    const { reviewId } = req.params;
    const { rating, content } = req.body;
    const userId = req.userId as number;

    try {
      const review = await Review.findByPk(reviewId);
      if (!review) {
        return res.status(404).json({ error: 'Avaliação não encontrada.' });
      }

      if (review.user_id !== userId) {
        return res.status(403).json({ error: 'Você não tem permissão para editar esta avaliação.' });
      }

      await review.update({ rating, content });

      const updatedReview = await Review.findByPk(reviewId, {
        include: [
          { model: User, as: 'user', attributes: ['id', 'name'] },
          {
            model: Book,
            as: 'book',
            attributes: ['id', 'title', 'cover_url', 'slug', 'full_cover_url'],
          },
        ],
      });

      return res.json({
        ...updatedReview?.toJSON(),
        userId,
        book: {
          ...updatedReview?.book.toJSON(),
          cover_url: updatedReview?.book.full_cover_url,
        },
      });
    } catch (err) {
      console.error('Erro ao atualizar avaliação:', err);
      return res.status(500).json({ error: 'Falha ao atualizar a avaliação.' });
    }
  }

   async destroy(req: AuthRequest, res: Response) {
    const { reviewId } = req.params;
    const userId = req.userId as number;

    try {
      const review = await Review.findByPk(reviewId);
      if (!review) {
        return res.status(404).json({ error: 'Avaliação não encontrada.' });
      }

      if (review.user_id !== userId) {
        return res.status(403).json({ error: 'Você não tem permissão para deletar esta avaliação.' });
      }

      await review.destroy();

      return res.status(204).send();
    } catch (err) {
      console.error('Erro ao deletar avaliação:', err);
      return res.status(500).json({ error: 'Falha ao deletar a avaliação.' });
    }
  }

  async ratings(req: Request, res: Response) {
    const { slug } = req.params;

    try {
      const book = await Book.findOne({ where: { slug } });
      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado.' });
      }

      const stats = await Review.findOne({
        where: { book_id: book.id },
        attributes: [
          [fn('AVG', col('rating')), 'averageRating'],
          [fn('COUNT', col('id')), 'reviewsCount'],
        ],
        raw: true,
      });

      return res.json({
        averageRating: stats?.averageRating ? Number(Number(stats.averageRating).toFixed(1)) : 0,
        reviewsCount: Number(stats?.reviewsCount ?? 0),
      });
    } catch (err) {
      console.error('Erro ao buscar estatísticas de avaliações:', err);
      return res.status(500).json({ error: 'Falha ao buscar estatísticas de avaliações.' });
    }
  }
}

export default new ReviewController();
