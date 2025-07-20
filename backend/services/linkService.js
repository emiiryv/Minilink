const {
  createShortLink,
  getLinkByShortCode,
  incrementClickCount,
  getLinksByUserId,
  deleteLink
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
  const links = await getLinksByUserId(userId);
  return links.map(link => ({
    ...link,
    short_url: `http://localhost:3001/${link.short_code}`,
  }));
}

async function deleteLinkById(linkId, userId) {
  return await deleteLink(linkId, userId);
}

module.exports = {
  createShortLinkService,
  getOriginalUrlService,
  getUserLinks,
  deleteLinkById,
};