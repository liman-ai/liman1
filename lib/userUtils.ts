import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { users } from '@/data/users'; // Örnek kullanıcı verileri için

const writeFile = promisify(fs.writeFile);

export const getUser = async (email: string) => {
  return users.find(user => user.email === email);
};

export const savePasswordResetToken = async (email: string, token: string) => {
  const filePath = path.join(process.cwd(), 'data', 'resetTokens.json');
  const resetTokens = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  resetTokens[email] = token;
  await writeFile(filePath, JSON.stringify(resetTokens));
};
