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
const prismaClient_1 = __importDefault(require("../prismaClient"));
// Tüm kullanıcıları getir
async function getAllUsers(req, res) {
    const users = await prismaClient_1.default.user.findMany();
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
