const prisma = require('../prismaClient');

// Yeni kısa link ekleme
async function createShortLink(originalUrl, shortCode, userId, expiresAt) {
  return await prisma.link.create({
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
  return await prisma.link.findFirst({
    where: {
      short_code: shortCode
    }
  });
}

// Tıklama sayısını artırma
async function incrementClickCount(shortCode) {
  await prisma.link.update({
    where: {
      short_code: shortCode
    },
    data: {
      click_count: {
        increment: 1
      }
    }
  });
}

async function getLinksByUserId(userId) {
  return await prisma.link.findMany({
    where: {
      user_id: userId
    }
  });
}

async function deleteLink(linkId, userId) {
  const deleted = await prisma.link.deleteMany({
    where: {
      id: parseInt(linkId, 10),
      user_id: userId
    }
  });
  return deleted.count;
}

module.exports = {
  createShortLink,
  getLinkByShortCode,
  incrementClickCount,
  getLinksByUserId,
  deleteLink,
};
