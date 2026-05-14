import { Request, Response } from "express";
import db from "../models";
import { sendSmtpMail } from "../utils/mailer";

const { Message } = db;

class ContactController {
  async store(req: Request, res: Response) {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios." });
    }

    try {
      const newMessage = await Message.create({
        name,
        email,
        subject,
        message,
      });

      const mailTo = process.env.MAIL_TO?.trim() || process.env.MAIL_USER?.trim();
      let emailSent = false;

      if (mailTo) {
        emailSent = await sendSmtpMail({
          to: mailTo,
          from: `"Papo de Livro" <${process.env.MAIL_USER}>`,
          replyTo: `"${name}" <${email}>`,
          subject: `Nova mensagem de contato: ${subject}`,
          html: `
            <p>Você recebeu uma nova mensagem de contato.</p>
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>E-mail:</strong> ${email}</p>
            <p><strong>Assunto:</strong> ${subject}</p>
            <hr>
            <p>${message.replace(/\n/g, "<br>")}</p>
          `,
        });
      }

      return res.status(201).json({
        message: "Mensagem recebida com sucesso.",
        emailSent,
        data: newMessage,
      });
    } catch (error) {
      console.error("Erro ao salvar mensagem:", error);
      return res
        .status(500)
        .json({
          error: "Ocorreu um erro interno ao processar sua solicitação.",
        });
    }
  }
}

export default new ContactController();

