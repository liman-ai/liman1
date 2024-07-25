// pages/api/read-json.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { readAllowedEmails, readBlacklist } from '../../lib/jsonUtils';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const allowedEmails = readAllowedEmails();
  const blacklist = readBlacklist();

  res.status(200).json({ allowedEmails, blacklist });
}
