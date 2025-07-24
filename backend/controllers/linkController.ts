import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Link } from '@prisma/client';
import { deleteLinkById, createShortLinkService, getOriginalUrlService, getUserLinks, incrementClickCount } from '../services/linkService';
import { getFromCache, setToCache } from '../services/cacheService';

const prisma = new PrismaClient();
require('dotenv').config();

// Kullanıcının linklerini getir
export async function getMyLinks(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const sortField = req.query.sort === 'click_count' ? 'click_count' : 'created_at';
    const links = await prisma.link.findMany({
      where: { user_id: (req as any).user.id },
      orderBy: {
        [sortField as string]: 'desc',
      },
    });
    res.status(200).json({ links });
  } catch (err) {
    next(err);
  }
}

// Yeni kısa link oluşturma
export async function shortenUrl(req: Request, res: Response): Promise<void> {
  const { originalUrl, expires_at } = req.body;

  if (!originalUrl) {
    res.status(400).json({ error: 'originalUrl is required' });
    return;
  }

  try {
    const userId = (req as any).user?.id || null;
    const newLink = await createShortLinkService(originalUrl, userId, expires_at);
    const shortUrl = `${process.env.BASE_URL}/${newLink.short_code}`;
    res.status(201).json({ ...newLink, short_url: shortUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Veritabanı hatası' });
  }
}

// Kısa link üzerinden yönlendirme
export async function redirectToOriginalUrl(req: Request, res: Response): Promise<void> {
  const { shortCode } = req.params;

  try {
    let link: Link | null = await getFromCache(shortCode);

    if (!link) {
      link = await prisma.link.findUnique({
        where: { short_code: shortCode },
      });

      if (link) {
        await setToCache(shortCode, link, 600); // 600 seconds = 10 minutes
      }
    }

    if (!link) {
      res.status(404).json({ error: 'Link bulunamadı' });
      return;
    }

    if (link && link.expires_at && new Date(link.expires_at) < new Date()) {
      res.status(410).json({ error: 'Bu linkin süresi dolmuştur.' });
      return;
    }

    await incrementClickCount(shortCode);

    res.redirect(link.original_url);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Yönlendirme hatası' });
  }
}

// Link silme
export async function deleteLink(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const userId = (req as any).user.id;

  try {
    const result = await deleteLinkById(id, userId);
    if (result === 0) {
      res.status(403).json({ error: 'Bu linki silme yetkiniz yok' });
      return;
    }

    res.status(200).json({ message: 'Link silindi' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Silme işlemi başarısız' });
  }
}