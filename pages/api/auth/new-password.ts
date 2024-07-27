import { NextApiRequest, NextApiResponse } from 'next'
import { kv } from '@vercel/kv'
import { getStringFromBuffer } from '@/lib/utils'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { token, password } = req.body

    const email = await kv.get(`reset-token:${token}`)

    if (!email) {
      return res.status(400).json({ error: 'Invalid or expired token' })
    }

    const user = await kv.hgetall(`user:${email}`)

    if (!user) {
      return res.status(400).json({ error: 'User not found' })
    }

    const salt = user.salt
    const encoder = new TextEncoder()
    const saltedPassword = encoder.encode(password + salt)
    const hashedPasswordBuffer = await crypto.subtle.digest('SHA-256', saltedPassword)
    const hashedPassword = getStringFromBuffer(hashedPasswordBuffer)

    await kv.hset(`user:${email}`, { password: hashedPassword })

    await kv.del(`reset-token:${token}`)

    return res.status(200).json({ message: 'Password has been reset' })
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
