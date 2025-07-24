"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShortLink = createShortLink;
exports.getLinkByShortCode = getLinkByShortCode;
exports.incrementClickCount = incrementClickCount;
exports.getLinksByUserId = getLinksByUserId;
exports.deleteLink = deleteLink;
const cacheClient_1 = __importDefault(require("../utils/cacheClient"));
const prismaClient_1 = __importDefault(require("../prismaClient"));
// Yeni kısa link ekleme
async function createShortLink(originalUrl, shortCode, userId, expiresAt) {
    return await prismaClient_1.default.link.create({
        data: {
            original_url: originalUrl,
            short_code: shortCode,
            user_id: userId,
            expires_at: expiresAt ? new Date(expiresAt) : null
        }
    });
}
// Kısa koda göre link bulma
async function getLinkByShortCode(shortCode) {
    return await prismaClient_1.default.link.findFirst({
        where: {
            short_code: shortCode
        }
    });
}
// Tıklama sayısını artırma
async function incrementClickCount(shortCode) {
    await cacheClient_1.default.incr(`click:${shortCode}`);
}
async function getLinksByUserId(userId) {
    return await prismaClient_1.default.link.findMany({
        where: {
            user_id: userId
        }
    });
}
async function deleteLink(linkId, userId) {
    const deleted = await prismaClient_1.default.link.deleteMany({
        where: {
            id: parseInt(linkId, 10),
            user_id: userId
        }
    });
    return deleted.count;
}
