import { Request, Response } from 'express';
import db from '../models';

const { Message } = db;

interface AuthRequest extends Request {
  userId?: number;
}

class PromptController {
  async store(req: AuthRequest, res: Response) {
    const { title, author, category, promptText } = req.body;

    if (!title || !author || !category || !promptText) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
      let name = 'Usuário anônimo';
      let email = 'anônimo@example.com';
      let userId = null;

      if (req.userId) {
        const user = await db.User.findByPk(req.userId);
        if (user) {
          name = user.name;
          email = user.email;
          userId = user.id;
        }
      }

      const newPrompt = await Message.create({
        name,
        email,
        subject: `Sugestão de Livro: ${title}`,
        message: `Título: ${title}\nAutor: ${author}\nCategoria: ${category}\nPrompt: ${promptText}`,
        userId,
      });

      return res.status(201).json(newPrompt);
    } catch (error) {
      console.error('Erro ao salvar prompt:', error);
      return res.status(500).json({ error: 'Falha ao salvar o prompt.' });
    }
  }
}

export default new PromptController();
