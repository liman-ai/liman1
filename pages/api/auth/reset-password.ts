import { NextApiRequest, NextApiResponse } from 'next'
import { kv } from '@vercel/kv'
import { sendVerificationRequest } from '@/auth.config'

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
    await sendVerificationRequest({ identifier: email, url, provider: { server: '', from: process.env.EMAIL_FROM } })

    return res.status(200).json({ message: 'Password reset email sent' })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
