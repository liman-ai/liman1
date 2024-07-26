import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { getUser, updateUserPassword } from './user-actions'; // user-actions içinde yeni fonksiyonlar tanımlanacak

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current password and new password are required' });
  }

  const user = await getUser(session.user.email);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const encoder = new TextEncoder();
  const saltedCurrentPassword = encoder.encode(currentPassword + user.salt);
  const hashedCurrentPasswordBuffer = await crypto.subtle.digest('SHA-256', saltedCurrentPassword);
  const hashedCurrentPassword = Buffer.from(hashedCurrentPasswordBuffer).toString('hex');

  if (hashedCurrentPassword !== user.password) {
    return res.status(401).json({ message: 'Incorrect current password' });
  }

  const saltedNewPassword = encoder.encode(newPassword + user.salt);
  const hashedNewPasswordBuffer = await crypto.subtle.digest('SHA-256', saltedNewPassword);
  const hashedNewPassword = Buffer.from(hashedNewPasswordBuffer).toString('hex');

  await updateUserPassword(user.email, hashedNewPassword);

  res.status(200).json({ message: 'Password updated successfully' });
}
