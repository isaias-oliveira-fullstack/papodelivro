import { Request, Response, NextFunction } from 'express';
import db from '../models';

const { User } = db;

interface AdminRequest extends Request {
  userId?: number;
  user?: any;
}

const adminMiddleware = async (req: AdminRequest, res: Response, next: NextFunction) => {
  if (!req.userId) {
    return res.status(401).json({ error: 'Falha na autenticação. ID do usuário não encontrado.' });
  }

  try {
    const user = await User.findByPk(req.userId);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado. Requer permissão de administrador.' });
    }

    req.user = user;
    return next();
  } catch (err: any) {
    console.error('Erro interno ao verificar permissões de administrador:', err?.message || err);
    return res.status(500).json({ error: 'Erro interno ao verificar permissões de administrador.' });
  }
};

export default adminMiddleware;
