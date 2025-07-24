import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'gizli-anahtar';

export async function registerUser(username: string, password: string): Promise<User> {
  const existingUser = await prisma.user.findUnique({
    where: { username },
  });
  if (existingUser) {
    throw { status: 400, message: 'Kullanıcı adı zaten kullanılıyor.' };
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