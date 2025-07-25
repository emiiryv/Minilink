"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyLinks = getMyLinks;
exports.shortenUrl = shortenUrl;
exports.redirectToOriginalUrl = redirectToOriginalUrl;
exports.deleteLink = deleteLink;
const client_1 = require("@prisma/client");
const linkService_1 = require("../services/linkService");
const cacheService_1 = require("../services/cacheService");
const prisma = new client_1.PrismaClient();
require('dotenv').config();
// Kullanıcının linklerini getir
async function getMyLinks(req, res, next) {
    try {
        const sortField = req.query.sort === 'click_count' ? 'click_count' : 'created_at';
        const links = await prisma.link.findMany({
            where: { user_id: req.user.id },
            orderBy: {
                [sortField]: 'desc',
            },
        });
        res.status(200).json({ links });
    }
    catch (err) {
        next(err);
    }
}
// Yeni kısa link oluşturma
async function shortenUrl(req, res) {
    const { originalUrl, expires_at } = req.body;
    if (!originalUrl) {
        res.status(400).json({ error: 'originalUrl is required' });
        return;
    }
    try {
        const userId = req.user?.id || null;
        const newLink = await (0, linkService_1.createShortLinkService)(originalUrl, userId, expires_at);
        const shortUrl = `${process.env.BASE_URL}/${newLink.short_code}`;
        res.status(201).json({ ...newLink, short_url: shortUrl });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Veritabanı hatası' });
    }
}
// Kısa link üzerinden yönlendirme
async function redirectToOriginalUrl(req, res) {
    const { shortCode } = req.params;
    try {
        let link = await (0, cacheService_1.getFromCache)(shortCode);
        if (!link) {
            link = await prisma.link.findUnique({
                where: { short_code: shortCode },
            });
            if (link) {
                await (0, cacheService_1.setToCache)(shortCode, link, 600); // 600 seconds = 10 minutes
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
        await (0, linkService_1.incrementClickCount)(shortCode);
        res.redirect(link.original_url);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Yönlendirme hatası' });
    }
}
// Link silme
async function deleteLink(req, res) {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        const result = await (0, linkService_1.deleteLinkById)(id, userId);
        if (result === 0) {
            res.status(403).json({ error: 'Bu linki silme yetkiniz yok' });
            return;
        }
        res.status(200).json({ message: 'Link silindi' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Silme işlemi başarısız' });
    }
}
