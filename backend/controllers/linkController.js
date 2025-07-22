const prisma = require('../prismaClient');
require('dotenv').config();
const { deleteLinkById } = require('../services/linkService');
const {
  createShortLinkService,
  getOriginalUrlService,
  getUserLinks,
  incrementClickCount,
} = require('../services/linkService');
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
  } catch (err) {
    next(err);
  }
}

// Yeni kısa link oluşturma
async function shortenUrl(req, res) {
  const { originalUrl, expires_at } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: 'originalUrl is required' });
  }

  try {
    const userId = req.user?.id || null;
    const newLink = await createShortLinkService(originalUrl, userId, expires_at);
    const shortUrl = `${process.env.BASE_URL}/${newLink.short_code}`;
    res.status(201).json({ ...newLink, short_url: shortUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Veritabanı hatası' });
  }
}

// Kısa link üzerinden yönlendirme
async function redirectToOriginalUrl(req, res) {
  const { shortCode } = req.params;

  try {
    const link = await prisma.link.findUnique({
      where: { short_code: shortCode },
    });

    if (!link) {
      return res.status(404).json({ error: 'Link bulunamadı' });
    }

    if (link.expires_at && new Date(link.expires_at) < new Date()) {
      return res.status(410).json({ error: 'Bu linkin süresi dolmuştur.' });
    }

    await incrementClickCount(shortCode);

    res.redirect(link.original_url);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Yönlendirme hatası' });
  }
}

// Link silme
async function deleteLink(req, res) {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await deleteLinkById(id, userId);
    if (result === 0) {
      return res.status(403).json({ error: 'Bu linki silme yetkiniz yok' });
    }

    res.status(200).json({ message: 'Link silindi' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Silme işlemi başarısız' });
  }
}

module.exports = {
  shortenUrl,
  redirectToOriginalUrl,
  getMyLinks,
  deleteLink,
};