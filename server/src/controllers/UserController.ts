import { Request, Response } from 'express';
import db from '../models';

const { User, Message } = db;

interface AuthRequest extends Request {
  userId?: number;
}

class UserController {
  async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId as number;
      const user = await User.findByPk(userId, {
        attributes: ['id', 'name', 'email', 'role'],
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      return res.status(200).json(user);
    } catch (err) {
      console.error('Erro ao buscar perfil do usuário:', err);
      return res.status(500).json({ error: 'Erro ao carregar perfil.' });
    }
  }

  async getMyMessages(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId as number;
      const messages = await Message.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
      });

      return res.status(200).json(messages);
    } catch (err) {
      console.error('Erro ao buscar mensagens do usuário:', err);
      return res.status(500).json({ error: 'Erro ao carregar suas mensagens.' });
    }
  }

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId as number;
      const { name, email, password } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      if (email && email !== user.email) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          return res.status(400).json({ error: 'E-mail já está em uso.' });
        }
      }

      if (name) user.name = name;
      if (email) user.email = email;
      if (password) user.password = password;

      await user.save();

      return res.status(200).json({
        message: 'Perfil atualizado com sucesso.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      return res.status(500).json({ error: 'Erro ao atualizar perfil.' });
    }
  }

  async deleteProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId as number;
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      await user.destroy();
      return res.status(200).json({ message: 'Conta excluída com sucesso.' });
    } catch (err) {
      console.error('Erro ao excluir conta:', err);
      return res.status(500).json({ error: 'Erro ao excluir conta.' });
    }
  }

  async listUsers(_req: Request, res: Response) {
    try {
      const users = await User.findAll({
        attributes: ['id', 'name', 'email', 'role'],
      });

      return res.status(200).json(users);
    } catch (err) {
      console.error('Erro ao listar usuários:', err);
      return res.status(500).json({ error: 'Erro ao listar usuários.' });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { name, email, password, role } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      if (email && email !== user.email) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          return res.status(400).json({ error: 'E-mail já está em uso.' });
        }
      }

      if (name) user.name = name;
      if (email) user.email = email;
      if (password) user.password = password;
      if (role) user.role = role;

      await user.save();

      return res.status(200).json({
        message: 'Usuário atualizado com sucesso.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err);
      return res.status(500).json({ error: 'Erro ao atualizar usuário.' });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      await user.destroy();
      return res.status(200).json({ message: 'Usuário excluído com sucesso.' });
    } catch (err) {
      console.error('Erro ao excluir usuário:', err);
      return res.status(500).json({ error: 'Erro ao excluir usuário.' });
    }
  }
}

export default new UserController();
