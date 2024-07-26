import { NextApiRequest, NextApiResponse } from 'next';
import { getUser, savePasswordResetToken } from '@/lib/userUtils';
import { sendResetEmail } from '@/lib/emailUtils';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;
  const user = await getUser(email);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  await savePasswordResetToken(user.email, token);

  await sendResetEmail(user.email, token);

  res.status(200).json({ message: 'Password reset email sent' });
}
