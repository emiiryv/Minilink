"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.incrementClickCount = void 0;
exports.createShortLinkService = createShortLinkService;
exports.getOriginalUrlService = getOriginalUrlService;
exports.getUserLinks = getUserLinks;
exports.deleteLinkById = deleteLinkById;
const linkModel_1 = require("../models/linkModel");
Object.defineProperty(exports, "incrementClickCount", { enumerable: true, get: function () { return linkModel_1.incrementClickCount; } });
const generateShortCode_1 = __importDefault(require("../utils/generateShortCode"));
const cacheService_1 = require("./cacheService");
async function createShortLinkService(originalUrl, userId, expiresAt) {
    const shortCode = (0, generateShortCode_1.default)();
    const newLink = await (0, linkModel_1.createShortLink)(originalUrl, shortCode, userId, expiresAt);
    return newLink;
}
async function getOriginalUrlService(shortCode) {
    const link = await (0, linkModel_1.getLinkByShortCode)(shortCode);
    if (!link) {
        return null;
    }
    await (0, linkModel_1.incrementClickCount)(shortCode);
    return link.original_url;
}
async function getUserLinks(userId) {
    const links = await (0, linkModel_1.getLinksByUserId)(userId);
    return links.map(link => ({
        ...link,
        short_url: `http://localhost:3001/${link.short_code}`,
    }));
}
async function deleteLinkById(linkId, userId) {
    const link = await (0, linkModel_1.getLinksByUserId)(userId).then(links => links.find(l => l.id === Number(linkId)));
    if (!link)
        return 0;
    await (0, linkModel_1.deleteLink)(linkId, userId);
    // Redis cache cleanup
    await (0, cacheService_1.deleteFromCache)(link.short_code);
    return 1;
}
