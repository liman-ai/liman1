import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, url, from } = req.body;

    const message = {
      to: email,
      from,
      subject: `Sign in to ${new URL(url).host}`,
      text: `Sign in to ${new URL(url).host}\n\n${url}\n\n`,
      html: `<p>Sign in to <strong>${new URL(url).host}</strong></p><p><a href="${url}">Sign in</a></p>`,
    };

    transporter.sendMail(message, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Error sending email' });
      } else {
        console.log('Email sent:', info.response);
        return res.status(200).json({ message: 'Email sent' });
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
