import {
  createShortLink,
  getLinkByShortCode,
  incrementClickCount,
  getLinksByUserId,
  deleteLink
} from '../models/linkModel';
import generateShortCode from '../utils/generateShortCode';
import { Link } from '@prisma/client';
import { deleteFromCache } from './cacheService';

export async function createShortLinkService(
  originalUrl: string,
  userId: number | null,
  expiresAt: string | null
): Promise<Link> {
  const shortCode = generateShortCode();
  const newLink = await createShortLink(originalUrl, shortCode, userId, expiresAt);
  return newLink;
}

export async function getOriginalUrlService(shortCode: string): Promise<string | null> {
  const link = await getLinkByShortCode(shortCode);
  if (!link) {
    return null;
  }
  await incrementClickCount(shortCode);
  return link.original_url;
}

export async function getUserLinks(userId: number): Promise<(Link & { short_url: string })[]> {
  const links = await getLinksByUserId(userId);
  return links.map(link => ({
    ...link,
    short_url: `http://localhost:3001/${link.short_code}`,
  }));
}

export async function deleteLinkById(linkId: string, userId: number): Promise<number> {
  const link = await getLinksByUserId(userId).then(links =>
    links.find(l => l.id === Number(linkId))
  );

  if (!link) return 0;

  await deleteLink(linkId, userId);

  // Redis cache cleanup
  await deleteFromCache(link.short_code);

  return 1;
}

export { incrementClickCount };