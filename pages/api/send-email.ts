import { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { email, url, from } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const message = {
    to: email,
    from,
    subject: `Sign in to ${new URL(url).host}`,
    text: `Sign in to ${new URL(url).host}\n\n${url}\n\n`,
    html: `<p>Sign in to <strong>${new URL(url).host}</strong></p><p><a href="${url}">Sign in</a></p>`,
  };

  try {
    await transporter.sendMail(message);
    res.status(200).json({ message: 'Email sent' });
  } catch (error) {
    res.status(500).json({ error: 'Error sending email' });
  }
}
