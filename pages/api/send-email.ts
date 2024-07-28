import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, url, from } = req.body;

  const message = {
    from: from,
    to: email,
    subject: `Sign in to ${new URL(url).host}`,
    text: `Sign in to ${new URL(url).host}\n\n${url}\n\n`,
    html: `<p>Sign in to <strong>${new URL(url).host}</strong></p><p><a href="${url}">Sign in</a></p>`,
  };

  try {
    await transporter.sendMail(message);
    res.status(200).json({ message: 'Email sent' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Error sending email' });
  }
}
