import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { getSession } from 'next-auth/react'

const blacklistPath = path.join(process.cwd(), 'data', 'sessionBlacklist.json')

const readBlacklist = () => {
  const jsonData = fs.readFileSync(blacklistPath, 'utf-8')
  return JSON.parse(jsonData)
}

const checkSessions = async () => {
  const blacklist = readBlacklist()
  const sessions = await getSession()

  if (sessions) {
    sessions.forEach(async (session) => {
      if (blacklist.includes(session.user.email)) {
        // Oturumu geçersiz kılma işlemini burada yapabilirsiniz
        // Bu, oturumu kapatma ve kullanıcıyı oturumdan çıkarma işlemini içerebilir
      }
    })
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Gelen isteklerin yetkilendirilmesini kontrol et
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end('Unauthorized')
  }

  await checkSessions()
  res.status(200).json({ message: 'Oturumlar kontrol edildi.' })
}
