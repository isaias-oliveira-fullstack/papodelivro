import { Request, Response } from 'express';
import db from '../models';

interface RequestWithFile extends Request {
  file?: Express.Multer.File;
}

const { Book, Summary, Message, User } = db;

class AdminController {

 async listPendingSummaries(req: Request, res: Response) {
    try {
      const summaries = await Summary.findAll({ 
        where: { status: 'PENDING' },
        include: [
          { 
            model: Book, 
            as: 'book', 
            attributes: ['id', 'title', 'author', 'cover_url', 'full_cover_url'] 
          },
          { model: User, as: 'user', attributes: ['name'] }
        ],
        order: [['created_at', 'ASC']],
      });

      return res.status(200).json(summaries);
    } catch (err) {
      console.error("Erro ao buscar resumos pendentes:", err);
      return res.status(500).json({ error: 'Erro ao buscar resumos pendentes.' });
    }
  }

  async listAllSummaries(req: Request, res: Response) {
    try {
      const summaries = await Summary.findAll({
        include: [
          { 
            model: Book, 
            as: 'book', 
            attributes: ['id', 'title', 'author', 'category', 'cover_url', 'full_cover_url'] 
          },
          { model: User, as: 'user', attributes: ['name'] }
        ],
        order: [['created_at', 'DESC']],
      });
      return res.status(200).json(summaries);
    } catch (err) {
      console.error("Erro ao buscar todos os resumos:", err);
      return res.status(500).json({ error: 'Erro ao buscar todos os resumos.' });
    }
  }

  async approveSummary(req: Request, res: Response) {
    try {
      const { summaryId } = req.params;
      const summary = await Summary.findByPk(summaryId);
      if (!summary) return res.status(404).json({ error: "Resumo não encontrado." });

      summary.status = 'COMPLETED';
      await summary.save();

      if (summary.book_id) {
        await Book.update({ status: 'COMPLETED' }, { where: { id: summary.book_id } });
      }

      return res.status(200).json({ message: "Resumo e livro aprovados com sucesso!" });
    } catch (error) {
      console.error("Erro ao aprovar resumo:", error);
      return res.status(500).json({ error: "Erro interno no servidor." });
    }
  }

  async rejectSummary(req: Request, res: Response) {
    const { summaryId } = req.params;
    try {
      const summary = await Summary.findByPk(summaryId);
      if (!summary) return res.status(404).json({ error: 'Resumo não encontrado.' });
      if (summary.status === 'REJECTED') return res.status(400).json({ error: 'Resumo já foi rejeitado.' });

      summary.status = 'REJECTED';
      await summary.save();
      return res.status(200).json({ message: 'Resumo rejeitado e marcado como não visível.' });
    } catch (err) {
      console.error("Erro ao rejeitar resumo:", err);
      return res.status(500).json({ error: 'Erro ao rejeitar resumo.' });
    }
  }

  async deleteSummary(req: Request, res: Response) {
    try {
      const { summaryId } = req.params;
      const summary = await Summary.findByPk(summaryId);

      if (!summary) {
        return res.status(404).json({ error: 'Resumo não encontrado.' });
      }

      await summary.destroy();
      return res.status(200).json({ message: 'Resumo excluído com sucesso.' });
    } catch (err) {
      console.error('Erro ao excluir resumo:', err);
      return res.status(500).json({ error: 'Erro ao excluir resumo.' });
    }
  }

  async updateBookCover(req: RequestWithFile, res: Response) {
    const { bookId } = req.params;
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo de imagem enviado." });
    }
    try {
      const book = await Book.findByPk(bookId);
      if (!book) {
        return res.status(404).json({ error: "Livro não encontrado." });
      }
      book.cover_url = req.file.filename;
      await book.save();
      return res.status(200).json({ message: "Capa do livro atualizada com sucesso!", cover_url: book.full_cover_url });
    } catch (error) {
      console.error("Erro ao atualizar capa do livro:", error);
      return res.status(500).json({ error: "Erro interno ao atualizar a capa do livro." });
    }
  }
}

export default new AdminController();

export {};
