import { getUserByEmail, updateUserByEmail } from './db'; // db bağlantı işlemleri

export async function getUser(email: string) {
  return await getUserByEmail(email);
}

export async function updateUserPassword(email: string, hashedPassword: string) {
  return await updateUserByEmail(email, { password: hashedPassword });
}
