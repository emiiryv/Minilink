import { Prisma } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

/**
 * Genel hata yakalayıcı middleware.
 * Hata objesinden status ve message çıkarır, varsa stack trace'i loglar.
 */
export default function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  let status = err.status || 500;
  let message = err.message || 'Sunucu hatası';

  // Prisma hata yönetimi
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    status = 400;
    if (err.code === 'P2002') {
      message = `Bu kısa link zaten mevcut. Lütfen farklı bir short_code girin.`;
    } else {
      message = `Veritabanı hatası: ${err.message}`;
    }
  }

  // Geliştirme ortamında detaylı log
  if (process.env.NODE_ENV !== 'production') {
    console.error('Hata:', err.stack || err);
  }

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}
