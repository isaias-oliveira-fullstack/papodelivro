import { Request, Response } from "express";
import db from "../models";
import { sendSmtpMail } from "../utils/mailer";

const { Message } = db;

class MessageController {
  async index(req: Request, res: Response) {
    try {
      const messages = await Message.findAll({
        order: [["createdAt", "DESC"]], 
      });

      return res.json(messages);
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  }

  async destroy(req: Request, res: Response) {
    const { messageId } = req.params;
    try {
      const message = await Message.findByPk(messageId);
      if (!message) {
        return res.status(404).json({ error: "Mensagem não encontrada." });
      }
      await message.destroy();
      return res.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar mensagem:", error);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  }

  async reply(req: Request, res: Response) {
    const { messageId } = req.params;
    const { replyText } = req.body;

    if (!replyText) {
      return res.status(400).json({ error: 'O texto da resposta é obrigatório.' });
    }

    try {
      const originalMessage = await Message.findByPk(messageId);
      if (!originalMessage) {
        return res
          .status(404)
          .json({ error: "Mensagem original não encontrada." });
      }

      let emailSent = false;

      emailSent = await sendSmtpMail({
        to: originalMessage.email,
        from: `"Papo de Livro" <${process.env.MAIL_USER}>`,
        subject: `Re: ${originalMessage.subject}`,
        html: `
          <p>Olá ${originalMessage.name},</p>
          <p>Em resposta à sua mensagem:</p>
          <p><i>"${originalMessage.message}"</i></p>
          <hr>
          <p>${replyText.replace(/\n/g, "<br>")}</p>
          <br>
          <p>Atenciosamente,</p>
          <p>Equipe Papo de Livro</p>
        `,
      });

      if (!emailSent) {
        console.warn(
          'SMTP não configurado corretamente. Resposta salva sem envio de email.'
        );
      }

      originalMessage.reply = replyText;
      originalMessage.repliedAt = new Date();
      originalMessage.isRead = true;
      await originalMessage.save();

      return res.status(200).json({
        message: emailSent
          ? "Resposta enviada com sucesso!"
          : "Resposta salva com sucesso, mas o email não foi enviado porque o SMTP não está configurado.",
      });
    } catch (error) {
      console.error("Erro ao enviar email de resposta:", error);
      return res.status(500).json({ error: "Falha ao enviar a resposta." });
    }
  }
}

export default new MessageController();

