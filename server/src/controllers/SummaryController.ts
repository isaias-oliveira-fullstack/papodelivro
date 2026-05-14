import { Request, Response } from "express";
import db from "../models";
import slugify from "slugify";

interface RequestWithFile extends Request {
  file?: Express.Multer.File;
  userId?: number;
}

const { Summary, Book, User } = db;

class SummaryController {
  
  async store(req: RequestWithFile, res: Response) {
    try {
      const { title, author, category, content, slug: providedSlug, coverUrlMock } = req.body;
      const coverImageToSave = req.file ? req.file.filename : coverUrlMock;

      if (!coverImageToSave) {
          return res.status(400).json({ error: "A imagem da capa é obrigatória." });
      }
      if (!title) {
        return res.status(400).json({ error: "O título é obrigatório." });
      }

      const bookSlug = providedSlug || slugify(title, { lower: true, strict: true });

      const [book] = await Book.findOrCreate({
        where: { slug: bookSlug },
        defaults: {
          title: title,
          author: author,
          category: category,
          cover_url: coverImageToSave,
          slug: bookSlug,
          status: 'PENDING',
          user_id: req.userId,
        }
      });

      let summarySlug = slugify(`${title || 'resumo'} ${req.userId || 'user'} ${Date.now()}`, {
        lower: true,
        strict: true,
      });
      if (!summarySlug) {
        summarySlug = `resumo-${Date.now()}`;
      }

      const summary = await Summary.create({
        slug: summarySlug,
        content: content,
        status: "PENDING",
        user_id: req.userId,
        book_id: book.id,
      });

      return res.status(201).json(summary);

    } catch (error) {
      console.error("ERRO DETALHADO AO CRIAR RESUMO:", error);
      return res.status(500).json({ error: "Erro ao cadastrar resumo." });
    }
  }

  async getMySummaries(req: RequestWithFile, res: Response) {
    try {
      const summaries = await Summary.findAll({
        where: { user_id: req.userId },
        include: [
          {
            model: Book,
            as: "book",
            attributes: ["title", "author", "category", "slug", "cover_url", "full_cover_url"],
          },
        ],
        order: [["created_at", "DESC"]],
      });

      const formattedSummaries = summaries
        .map((s: any) => {
          if (!s.book) return null;

          return {
            id: s.id,
            status: s.status,
            title: s.book.title,
            author: s.book.author,
            category: s.book.category,
            content: s.content,
            slug: s.book.slug,
            cover_url: s.book.full_cover_url,
          };
        })
        .filter((s: any) => s !== null);

      return res.status(200).json(formattedSummaries);
    } catch (error) {
      console.error("Erro ao buscar 'meus resumos':", error);
      return res.status(500).json({ error: "Erro ao buscar seus envios." });
    }
  }

  async update(req: RequestWithFile, res: Response) {
    try {
      const { summaryId } = req.params;
      const { content } = req.body;
      const summary = await Summary.findByPk(summaryId);

      if (!summary) {
        return res.status(404).json({ error: 'Resumo não encontrado.' });
      }

      if (summary.user_id !== req.userId) {
        const currentUser = await User.findByPk(req.userId);
        if (!currentUser || currentUser.role !== 'admin') {
          return res.status(403).json({ error: 'Ação não permitida.' });
        }
      }

      if (!content) {
        return res.status(400).json({ error: 'Conteúdo do resumo é obrigatório.' });
      }

      summary.content = content;

      if (req.file && summary.book_id) {
        const book = await Book.findByPk(summary.book_id);
        if (book) {
          book.cover_url = req.file.filename;
          await book.save();
        }
      }

      await summary.save();

      return res.status(200).json({ message: 'Resumo atualizado com sucesso.', summary });
    } catch (error) {
      console.error('Erro ao atualizar resumo:', error);
      return res.status(500).json({ error: 'Erro ao atualizar resumo.' });
    }
  }

  async destroy(req: RequestWithFile, res: Response) {
    try {
      const { summaryId } = req.params;
      const summary = await Summary.findByPk(summaryId);

      if (!summary) {
        return res.status(404).json({ error: 'Resumo não encontrado.' });
      }

      if (summary.user_id !== req.userId) {
        const currentUser = await User.findByPk(req.userId);
        if (!currentUser || currentUser.role !== 'admin') {
          return res.status(403).json({ error: 'Ação não permitida.' });
        }
      }

      await summary.destroy();
      return res.status(200).json({ message: 'Resumo excluído com sucesso.' });
    } catch (error) {
      console.error('Erro ao excluir resumo:', error);
      return res.status(500).json({ error: 'Erro ao excluir resumo.' });
    }
  }
}

export default new SummaryController();

