import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  userId?: number;
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log('Auth middleware: sem Authorization header');
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  const [, token] = authHeader.split(' ');

  if (!token) {
    console.log('Auth middleware: token mal formatado', authHeader);
    return res.status(401).json({ error: 'Token mal formatado.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.APP_SECRET as string) as { id: number };
    req.userId = decoded.id;
    console.log('Auth middleware: userId set to', req.userId);
    return next();
  } catch (err: any) {
    console.error('Erro no auth middleware:', err?.message || err);
    return res.status(401).json({ error: 'Token inválido.' });
  }
};

export default authMiddleware;
