import { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'
import { kv } from '@vercel/kv'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email } = req.body

    const user = await kv.hgetall(`user:${email}`)

    if (!user) {
      return res.status(400).json({ error: 'User not found' })
    }

    const token = crypto.randomUUID()
    await kv.set(`reset-token:${token}`, email, { ex: 3600 }) // 1 saatlik geçerlilik süresi

    const url = `${process.env.NEXTAUTH_URL}/auth/new-password?token=${token}`
    const message = {
      to: email,
      from: process.env.EMAIL_FROM,
      subject: `Parola Sıfırlama`,
      text: `Parolanızı sıfırlamak için şu bağlantıyı kullanın: ${url}`,
      html: `<p>Parolanızı sıfırlamak için şu bağlantıyı kullanın: <a href="${url}">Parola Sıfırla</a></p>`,
    }

    transporter.sendMail(message, (error, info) => {
      if (error) {
        console.error('Error sending email:', error)
        return res.status(500).json({ error: 'Error sending email' })
      } else {
        console.log('Email sent:', info.response)
        return res.status(200).json({ message: 'Password reset email sent' })
      }
    })
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
