"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = getAllUsers;
exports.getAllLinks = getAllLinks;
exports.getUserLinks = getUserLinks;
exports.deleteUser = deleteUser;
exports.deleteLink = deleteLink;
exports.updateLink = updateLink;
exports.getDashboardStats = getDashboardStats;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const UpdateLinkDto_1 = require("../dto/UpdateLinkDto");
const prismaClient_1 = __importDefault(require("../prismaClient"));
// Tüm kullanıcıları getir
async function getAllUsers(req, res) {
    const users = await prismaClient_1.default.user.findMany({
        where: { is_admin: false },
    });
    res.json(users);
}
// Tüm linkleri getir (kullanıcı bilgisiyle birlikte)
async function getAllLinks(req, res) {
    const links = await prismaClient_1.default.link.findMany({
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
async function getUserLinks(req, res) {
    const userId = Number(req.params.id);
    const links = await prismaClient_1.default.link.findMany({
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
async function deleteUser(req, res) {
    const userId = Number(req.params.id);
    await prismaClient_1.default.user.delete({
        where: { id: userId },
    });
    res.json({ message: 'Kullanıcı silindi' });
}
// Link sil
async function deleteLink(req, res) {
    const linkId = Number(req.params.id);
    await prismaClient_1.default.link.delete({
        where: { id: linkId },
    });
    res.json({ message: 'Link silindi' });
}
async function updateLink(req, res) {
    const linkId = Number(req.params.id);
    try {
        const dto = (0, class_transformer_1.plainToInstance)(UpdateLinkDto_1.UpdateLinkDto, req.body);
        await (0, class_validator_1.validateOrReject)(dto);
        const dataToUpdate = {
            original_url: dto.original_url,
            short_code: dto.short_code,
        };
        if (dto.expires_at === null) {
            dataToUpdate.expires_at = null;
        }
        else if (typeof dto.expires_at === 'string' && dto.expires_at.trim() !== '') {
            dataToUpdate.expires_at = new Date(dto.expires_at);
        }
        const updatedLink = await prismaClient_1.default.link.update({
            where: { id: linkId },
            data: dataToUpdate,
        });
        res.json(updatedLink);
    }
    catch (err) {
        console.error('Link güncelleme hatası:', err);
        res.status(400).json({ error: 'Geçersiz veri. Lütfen formu kontrol edin.' });
    }
}
// Genel istatistikleri ve tarih verilerini getir
async function getDashboardStats(req, res) {
    try {
        const total_users = await prismaClient_1.default.user.count({
            where: { is_admin: false }
        });
        const total_links = await prismaClient_1.default.link.count();
        const users = await prismaClient_1.default.user.findMany({
            where: { is_admin: false },
            select: { created_at: true }
        });
        const links = await prismaClient_1.default.link.findMany({
            select: { created_at: true }
        });
        res.json({
            total_users,
            total_links,
            user_creation_dates: users.map(u => u.created_at),
            link_creation_dates: links.map(l => l.created_at)
        });
    }
    catch (err) {
        console.error('İstatistik verisi çekilemedi:', err);
        res.status(500).json({ error: 'İstatistik verisi alınamadı' });
    }
}
