import prisma from '../prismaClient';
import { User } from '@prisma/client';

// Yeni kullanıcı oluşturur
export async function createUser(username: string, hashedPassword: string): Promise<User> {
  return await prisma.user.create({
    data: {
      username,
      password: hashedPassword
    }
  });
}

// Kullanıcıyı kullanıcı adına göre bulur
export async function findUserByUsername(username: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: {
      username
    }
  });
}
