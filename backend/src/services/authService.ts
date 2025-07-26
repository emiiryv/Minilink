import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'gizli-anahtar';

const passwordSchema = z
  .string()
  .min(8, 'Şifre en az 8 karakter olmalıdır.')
  .regex(/[A-Z]/, 'Şifre en az bir büyük harf içermelidir.')
  .regex(/[a-z]/, 'Şifre en az bir küçük harf içermelidir.')
  .regex(/[0-9]/, 'Şifre en az bir rakam içermelidir.')
  .regex(/[^A-Za-z0-9]/, 'Şifre en az bir özel karakter içermelidir.');

export async function registerUser(username: string, password: string): Promise<User> {
  const existingUser = await prisma.user.findUnique({
    where: { username },
  });
  if (existingUser) {
    throw { status: 400, message: 'Kullanıcı adı zaten kullanılıyor.' };
  }

  try {
    passwordSchema.parse(password);
  } catch (err) {
    const issues = (err as z.ZodError).issues.map((i) => i.message).join(', ');
    throw { status: 400, message: `Şifre geçersiz: ${issues}` };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });
  return user;
}

export async function loginUser(username: string, password: string): Promise<{ token: string }> {
  const user = await prisma.user.findUnique({
    where: { username },
  });
  if (!user) {
    throw { status: 401, message: 'Geçersiz kullanıcı adı veya şifre.' };
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw { status: 401, message: 'Geçersiz kullanıcı adı veya şifre.' };
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, is_admin: user.is_admin },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { token };
}