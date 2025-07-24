import redisClient from '../utils/cacheClient';
import prisma from '../prismaClient';
import { Link } from '@prisma/client';

// Yeni kısa link ekleme
export async function createShortLink(
  originalUrl: string,
  shortCode: string,
  userId: number | null,
  expiresAt: string | null
): Promise<Link> {
  return await prisma.link.create({
    data: {
      original_url: originalUrl,
      short_code: shortCode,
      user_id: userId,
      expires_at: expiresAt ? new Date(expiresAt) : null
    }
  });
}

// Kısa koda göre link bulma
export async function getLinkByShortCode(shortCode: string): Promise<Link | null> {
  return await prisma.link.findFirst({
    where: {
      short_code: shortCode
    }
  });
}

// Tıklama sayısını artırma
export async function incrementClickCount(shortCode: string): Promise<void> {
  await redisClient.incr(`click:${shortCode}`);
}

export async function getLinksByUserId(userId: number): Promise<Link[]> {
  return await prisma.link.findMany({
    where: {
      user_id: userId
    }
  });
}

export async function deleteLink(linkId: string, userId: number): Promise<number> {
  const deleted = await prisma.link.deleteMany({
    where: {
      id: parseInt(linkId, 10),
      user_id: userId
    }
  });
  return deleted.count;
}
