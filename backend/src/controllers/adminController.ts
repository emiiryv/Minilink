import { Request, Response } from 'express';
import prisma from '../prismaClient';

// Tüm kullanıcıları getir
export async function getAllUsers(req: Request, res: Response) {
  const users = await prisma.user.findMany();
  res.json(users);
}

// Tüm linkleri getir (kullanıcı bilgisiyle birlikte)
export async function getAllLinks(req: Request, res: Response) {
  const links = await prisma.link.findMany({
    include: {
      user: {
        select: {
          id: true,
          username: true,
          is_admin: true,
        },
      },
    },
  });
  res.json(links);
}

// Belirli kullanıcının linklerini getir (redirect URL ve expires_at dahil)
export async function getUserLinks(req: Request, res: Response) {
  const userId = Number(req.params.id);

  const links = await prisma.link.findMany({
    where: { user_id: userId },
    select: {
      id: true,
      original_url: true,
      short_code: true,
      click_count: true,
      created_at: true,
      expires_at: true,
    },
  });

  const baseUrl = process.env.BASE_URL || 'http://localhost:3001';

  const enrichedLinks = links.map(link => ({
    ...link,
    redirect_url: `${baseUrl}/${link.short_code}`,
  }));

  res.json(enrichedLinks);
}

// Kullanıcı sil
export async function deleteUser(req: Request, res: Response) {
  const userId = Number(req.params.id);
  await prisma.user.delete({
    where: { id: userId },
  });
  res.json({ message: 'Kullanıcı silindi' });
}

// Link sil
export async function deleteLink(req: Request, res: Response) {
  const linkId = Number(req.params.id);
  await prisma.link.delete({
    where: { id: linkId },
  });
  res.json({ message: 'Link silindi' });
}