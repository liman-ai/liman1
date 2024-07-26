import { NextApiRequest, NextApiResponse } from 'next';
import { getUserByResetToken, updateUserPassword } from '@/lib/userUtils';
import { hashPassword } from '@/lib/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { token, newPassword } = req.body;
  const user = await getUserByResetToken(token);

  if (!user) {
    return res.status(400).json({ message: 'Invalid token' });
  }

  const hashedPassword = await hashPassword(newPassword, user.salt);
  await updateUserPassword(user.email, hashedPassword);

  res.status(200).json({ message: 'Password has been reset' });
}
