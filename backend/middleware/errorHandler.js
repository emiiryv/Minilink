const { Prisma } = require('@prisma/client');
/**
 * Genel hata yakalayıcı middleware.
 * Hata objesinden status ve message çıkarır, varsa stack trace'i loglar.
 * @param {Error} err - Oluşan hata
 * @param {Request} req - Express isteği
 * @param {Response} res - Express yanıtı
 * @param {Function} next - Sonraki middleware
 */
function errorHandler(err, req, res, next) {
  let status = err.status || 500;
  let message = 'Sunucu hatası';

  // Prisma hata yönetimi
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    status = 400;
    message = `Veritabanı hatası: ${err.message}`;
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

module.exports = errorHandler;
