

const {
  createShortLink,
  getLinkByShortCode,
  incrementClickCount,
} = require('../models/linkModel');
const generateShortCode = require('../utils/generateShortCode');

async function createShortLinkService(originalUrl) {
  const shortCode = generateShortCode();
  const newLink = await createShortLink(originalUrl, shortCode);
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

module.exports = {
  createShortLinkService,
  getOriginalUrlService,
};