const {
  createShortLink,
  getLinkByShortCode,
  incrementClickCount,
  getLinksByUserId,
} = require('../models/linkModel');
const generateShortCode = require('../utils/generateShortCode');

async function createShortLinkService(originalUrl, userId) {
  const shortCode = generateShortCode();
  const newLink = await createShortLink(originalUrl, shortCode, userId);
  return newLink;
}

async function getOriginalUrlService(shortCode) {
  const link = await getLinkByShortCode(shortCode);
  if (!link) {
    return null;
  }
  await incrementClickCount(shortCode);
  return link.original_url;
}

async function getUserLinks(userId) {
  return await getLinksByUserId(userId);
}

module.exports = {
  createShortLinkService,
  getOriginalUrlService,
  getUserLinks,
};