import { Request, Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import db from '../models';
import { sendSmtpMail } from '../utils/mailer';

const { User } = db;

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      // Validação rigorosa de campos obrigatórios
      if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
        return res.status(400).json({ error: 'Nome é obrigatório, deve ter entre 2 e 100 caracteres.' });
      }

      if (!email || typeof email !== 'string' || !validateEmail(email.trim())) {
        return res.status(400).json({ error: 'E-mail válido é obrigatório.' });
      }

      if (!password || typeof password !== 'string' || password.length < 6 || password.length > 255) {
        return res.status(400).json({ error: 'Senha é obrigatória e deve ter entre 6 e 255 caracteres.' });
      }

      const trimmedName = name.trim();
      const trimmedEmail = email.trim().toLowerCase();

      // Verificar se usuário já existe
      const userExists = await User.findOne({ where: { email: trimmedEmail } });
      if (userExists) {
        return res.status(400).json({ error: 'E-mail já cadastrado.' });
      }

      // Criar usuário
      const user = await User.create({
        name: trimmedName,
        email: trimmedEmail,
        password,
        role: 'user',
      });

      const jwtSecret = process.env.APP_SECRET as string;
      if (!jwtSecret) {
        console.error('APP_SECRET não está definido');
        return res.status(500).json({ error: 'Erro interno do servidor.' });
      }

      const token = jwt.sign({ id: user.id }, jwtSecret, {
        expiresIn: '40d',
      });

      return res.status(201).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
        message: 'Registro realizado com sucesso!'
      });
    } catch (err: any) {
      console.error("ERRO NO REGISTRO DE USUÁRIO:", err);

      // Tratamento específico de erros do Sequelize
      if (err.name === 'SequelizeValidationError') {
        const messages = err.errors.map((e: any) => e.message);
        return res.status(400).json({ error: `Dados inválidos: ${messages.join(', ')}` });
      }

      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ error: 'E-mail já cadastrado.' });
      }

      return res.status(500).json({ error: 'Erro interno ao registrar usuário.' });
    }
  }

  async registerAdmin(req: Request, res: Response) {
    const { name, email, password } = req.body;

    try {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'E-mail de admin já cadastrado.' });
      }

      const user = await User.create({
        name,
        email,
        password,
        role: 'admin',
      });

      const jwtSecret = process.env.APP_SECRET as string;
      if (!jwtSecret) throw new Error('APP_SECRET não está definido');
      const token = jwt.sign({ id: user.id }, jwtSecret, {
        expiresIn: '40d',
      });

      return res.status(201).json({
        message: 'Administrador criado com sucesso!',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (err) {
      console.error("ERRO DETALHADO AO REGISTRAR ADMIN:", err);
      return res.status(500).json({ error: 'Erro ao registrar administrador.' });
    }
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ error: 'Usuário não encontrado.' });
      }

      const passwordMatch = await user.checkPassword(password);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Senha incorreta.' });
      }

      const jwtSecret = process.env.APP_SECRET as string;
      if (!jwtSecret) throw new Error('APP_SECRET não está definido');
      const token = jwt.sign({ id: user.id }, jwtSecret, {
        expiresIn: '40d',
      });

      return res.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
        message: 'Login realizado com sucesso!'
      });
    } catch (err) {
      console.error("ERRO NO LOGIN:", err);
      return res.status(500).json({ error: 'Erro ao fazer login.' });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;

    if (!email || typeof email !== 'string' || !validateEmail(email)) {
      return res.status(400).json({ error: 'Informe um e-mail válido.' });
    }

    try {
      const user = await User.findOne({ where: { email } });

      if (user) {
        const token = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

        await db.PasswordResetToken.create({
          user_id: user.id,
          token_hash: tokenHash,
          expires_at: expiresAt,
        });

        const frontendUrl = process.env.FRONTEND_URL?.replace(/\/+$/, '') ?? 'http://localhost:5173';
        const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

        const html = `
          <div style="font-family: Inter, system-ui, sans-serif; color: #111827; background: #f9fafb; padding: 24px;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 24px 80px rgba(15, 23, 42, 0.08);">
              <div style="padding: 32px; background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); color: #ffffff; text-align: center;">
                <h1 style="margin: 0; font-size: 28px; letter-spacing: -0.02em;">Papo de Livro</h1>
                <p style="margin: 8px 0 0; font-size: 16px; opacity: 0.9;">Recuperação de senha segura</p>
              </div>
              <div style="padding: 32px; color: #1f2937;">
                <h2 style="margin: 0 0 16px; font-size: 22px;">Olá, ${user.name}</h2>
                <p style="margin: 0 0 16px; line-height: 1.75;">Recebemos uma solicitação para redefinir a senha da sua conta no Papo de Livro.</p>
                <p style="margin: 0 0 16px; line-height: 1.75;">Clique no botão abaixo para criar uma nova senha. Este link expira em 1 hora.</p>
                <div style="text-align: center; margin: 24px 0;">
                  <a href="${resetUrl}" style="display: inline-block; padding: 14px 26px; border-radius: 999px; background: #2563eb; color: #ffffff; text-decoration: none; font-weight: 600;">Redefinir minha senha</a>
                </div>
                <p style="margin: 0 0 12px; line-height: 1.75;">Caso o botão não funcione, copie e cole o link abaixo no navegador:</p>
                <p style="word-break: break-all; background: #f3f4f6; padding: 16px; border-radius: 16px; font-size: 14px;">${resetUrl}</p>
                <p style="margin: 24px 0 0; line-height: 1.75; color: #6b7280;">Se você não solicitou a redefinição de senha, ignore este e-mail. Ninguém poderá alterar sua senha sem acesso a esta mensagem.</p>
              </div>
              <div style="padding: 24px; background: #f3f4f6; color: #475569; font-size: 14px;">
                <p style="margin: 0 0 8px;"><strong>Importante:</strong> Use o botão acima em até 1 hora.</p>
                <p style="margin: 0;">O link levará você diretamente à página de redefinição de senha do nosso front-end.</p>
              </div>
            </div>
          </div>
        `;

        const text = `Olá, ${user.name}

Nós recebemos um pedido para redefinir sua senha no Papo de Livro.

Use este link para criar uma nova senha (válido por 1 hora):

${resetUrl}

Se o botão não funcionar, copie e cole o link no seu navegador.

Se você não fez essa solicitação, ignore este e-mail.`;

        await sendSmtpMail({
          to: user.email,
          subject: 'Recuperação de senha - Papo de Livro',
          html,
          text,
        }).catch((sendError) => {
          console.error('Erro ao enviar e-mail de recuperação de senha:', sendError);
        });
      }

      return res.status(200).json({
        message: 'Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.',
      });
    } catch (err) {
      console.error('ERRO NO FORGOT PASSWORD:', err);
      return res.status(500).json({ error: 'Erro ao processar a solicitação.' });
    }
  }

  async resetPassword(req: Request, res: Response) {
    const { token, password } = req.body;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Token inválido ou expirado.' });
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 8 caracteres.' });
    }

    try {
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      const passwordReset = await db.PasswordResetToken.findOne({
        where: { token_hash: tokenHash },
      });

      if (
        !passwordReset ||
        passwordReset.used_at ||
        new Date(passwordReset.expires_at).getTime() < Date.now()
      ) {
        return res.status(400).json({ error: 'Token inválido ou expirado.' });
      }

      const user = await User.findByPk(passwordReset.user_id);
      if (!user) {
        return res.status(400).json({ error: 'Token inválido ou expirado.' });
      }

      user.password = password;
      await user.save();

      passwordReset.used_at = new Date();
      await passwordReset.save();

      return res.status(200).json({ message: 'Senha redefinida com sucesso.' });
    } catch (err) {
      console.error('ERRO NO RESET PASSWORD:', err);
      return res.status(500).json({ error: 'Erro ao redefinir a senha.' });
    }
  }
}

export default new AuthController();
