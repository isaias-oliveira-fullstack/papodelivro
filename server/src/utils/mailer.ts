import nodemailer from 'nodemailer';

export const createSmtpTransporter = () => {
  const mailHost = process.env.MAIL_HOST?.trim();
  const mailPort = process.env.MAIL_PORT ? Number(process.env.MAIL_PORT) : undefined;
  const mailUser = process.env.MAIL_USER?.trim();
  const mailPass = process.env.MAIL_PASS?.trim();
  const mailSecureEnv = process.env.MAIL_SECURE?.trim();

  if (!mailHost || !mailPort || !mailUser || !mailPass) {
    return null;
  }

  let secure = mailSecureEnv ? mailSecureEnv === 'true' : mailPort === 465;

  if (mailPort === 587 && secure) {
    console.warn(
      'MAIL_SECURE=true on port 587 is incompatible with STARTTLS. Forçando secure=false.'
    );
    secure = false;
  }

  const requireTLS = mailPort === 587;

  return nodemailer.createTransport({
    host: mailHost,
    port: mailPort,
    secure,
    requireTLS,
    auth: {
      user: mailUser,
      pass: mailPass,
    },
  });
};

export type SmtpMailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
};

export const sendSmtpMail = async ({
  to,
  from,
  replyTo,
  subject,
  html,
  text,
}: SmtpMailOptions): Promise<boolean> => {
  const transporter = createSmtpTransporter();
  if (!transporter) {
    return false;
  }

  await transporter.sendMail({
    from: from ?? `"Papo de Livro" <${process.env.MAIL_USER}>`,
    to,
    replyTo,
    subject,
    html,
    text,
  });

  return true;
};
