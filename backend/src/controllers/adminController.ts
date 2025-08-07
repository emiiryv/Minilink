import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateLinkDto } from '../dto/UpdateLinkDto';
import { Request, Response } from 'express';
import prisma from '../prismaClient';

// Tüm kullanıcıları getir
export async function getAllUsers(req: Request, res: Response) {
  const users = await prisma.user.findMany({
    where: { is_admin: false },
  });
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

export async function updateLink(req: Request, res: Response) {
  const linkId = Number(req.params.id);

  try {
    const dto = plainToInstance(UpdateLinkDto, req.body);
    await validateOrReject(dto);

    const dataToUpdate: any = {
      original_url: dto.original_url,
      short_code: dto.short_code,
    };

    if (dto.expires_at === null) {
      dataToUpdate.expires_at = null;
    } else if (typeof dto.expires_at === 'string' && dto.expires_at.trim() !== '') {
      dataToUpdate.expires_at = new Date(dto.expires_at);
    }

    const updatedLink = await prisma.link.update({
      where: { id: linkId },
      data: dataToUpdate,
    });

    res.json(updatedLink);
  } catch (err) {
    console.error('Link güncelleme hatası:', err);
    res.status(400).json({ error: 'Geçersiz veri. Lütfen formu kontrol edin.' });
  }
}
// Genel istatistikleri ve tarih verilerini getir
export async function getDashboardStats(req: Request, res: Response) {
  try {
    const total_users = await prisma.user.count({
      where: { is_admin: false }
    });

    const total_links = await prisma.link.count();

    const users = await prisma.user.findMany({
      where: { is_admin: false },
      select: { created_at: true }
    });

    const links = await prisma.link.findMany({
      select: { created_at: true }
    });

    res.json({
      total_users,
      total_links,
      user_creation_dates: users.map(u => u.created_at),
      link_creation_dates: links.map(l => l.created_at)
    });
  } catch (err) {
    console.error('İstatistik verisi çekilemedi:', err);
    res.status(500).json({ error: 'İstatistik verisi alınamadı' });
  }
}