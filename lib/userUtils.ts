import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');
const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

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
  await writeFile(usersFilePath, JSON.stringify(users));
};
