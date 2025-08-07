"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = errorHandler;
const client_1 = require("@prisma/client");
/**
 * Genel hata yakalayıcı middleware.
 * Hata objesinden status ve message çıkarır, varsa stack trace'i loglar.
 */
function errorHandler(err, req, res, next) {
    let status = err.status || 500;
    let message = err.message || 'Sunucu hatası';
    // Prisma hata yönetimi
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
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
