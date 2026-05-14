import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import db from '../models';

interface AuthRequest extends Request {
  userId?: number;
}

const { Book, Favorite } = db;

class FavoriteController {
  async index(req: AuthRequest, res: Response) {
    const userId = req.userId as number;

    try {
      const favorites = await Favorite.findAll({
        where: { user_id: userId },
        include: [
          {
            model: Book,
            as: 'book',
            attributes: ['id', 'title', 'author', 'category', 'slug', 'cover_url', 'full_cover_url'],
          },
        ],
        order: [['created_at', 'DESC']],
      });

      const favoriteBooks = favorites
        .map((favorite: any) => favorite.book)
        .filter((book: any) => Boolean(book))
        .map((book: any) => ({
          ...book.toJSON(),
          cover_url: book.full_cover_url,
        }));

      return res.json(favoriteBooks);
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
      return res.status(500).json({ error: 'Falha ao buscar seus favoritos.' });
    }
  }

  async store(req: AuthRequest, res: Response) {
    const { slug } = req.body;
    const userId = req.userId as number;

    if (!slug) {
      return res.status(400).json({ error: 'Slug do livro é obrigatório.' });
    }

    try {
      const book = await Book.findOne({ where: { slug } });
      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado.' });
      }

      const existingFavorite = await Favorite.findOne({
        where: { user_id: userId, book_id: book.id },
      });

      if (existingFavorite) {
        return res.status(409).json({ error: 'Livro já está nos favoritos.' });
      }

      await Favorite.create({ user_id: userId, book_id: book.id });

      const supabaseClient = supabase;
      if (supabaseClient) {
        await supabaseClient.from('favorites').insert([{ user_id: userId, book_id: book.id, book_slug: book.slug }]);
      }

      return res.status(201).json({ message: 'Livro adicionado aos favoritos.' });
    } catch (error) {
      console.error('Erro ao salvar favorito:', error);
      return res.status(500).json({ error: 'Falha ao salvar favorito.' });
    }
  }

  async destroy(req: AuthRequest, res: Response) {
    const { slug } = req.params;
    const userId = req.userId as number;

    try {
      const book = await Book.findOne({ where: { slug } });
      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado.' });
      }

      const favorite = await Favorite.findOne({
        where: { book_id: book.id, user_id: userId },
      });

      if (!favorite) {
        return res.status(404).json({ error: 'Favorito não encontrado.' });
      }

      await favorite.destroy();

      const supabaseClient = supabase;
      if (supabaseClient) {
        await supabaseClient.from('favorites').delete().match({ user_id: userId, book_id: book.id });
      }

      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      return res.status(500).json({ error: 'Falha ao remover favorito.' });
    }
  }
}

export default new FavoriteController();
