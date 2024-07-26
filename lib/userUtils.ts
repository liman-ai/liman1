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

export const getUserByResetToken = async (token: string) => {
  const filePath = path.join(process.cwd(), 'data', 'resetTokens.json');
  const resetTokens = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const email = Object.keys(resetTokens).find(key => resetTokens[key] === token);

  if (!email) {
    return null;
  }

  return getUser(email);
};

export const updateUserPassword = async (email: string, newPassword: string) => {
  const userIndex = users.findIndex(user => user.email === email);
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  users[userIndex].password = newPassword;
  const filePath = path.join(process.cwd(), 'data', 'users.json');
  await writeFile(filePath, JSON.stringify(users));
};
