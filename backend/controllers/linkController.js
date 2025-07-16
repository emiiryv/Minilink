const {
  createShortLinkService,
  getOriginalUrlService,
  getUserLinks,
} = require('../services/linkService');
// Kullanıcının linklerini getir
async function getMyLinks(req, res, next) {
  try {
    const links = await getUserLinks(req.user.id);
    res.json(links);
  } catch (err) {
    next(err);
  }
}

// Yeni kısa link oluşturma
async function shortenUrl(req, res) {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: 'originalUrl is required' });
  }

  try {
    const userId = req.user?.id || null;
    const newLink = await createShortLinkService(originalUrl, userId);
    res.status(201).json(newLink);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Veritabanı hatası' });
  }
}

// Kısa link üzerinden yönlendirme
async function redirectToOriginalUrl(req, res) {
  const { shortCode } = req.params;

  try {
    const originalUrl = await getOriginalUrlService(shortCode);
    if (!originalUrl) {
      return res.status(404).json({ error: 'Link bulunamadı' });
    }

    res.redirect(originalUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Yönlendirme hatası' });
  }
}

module.exports = {
  shortenUrl,
  redirectToOriginalUrl,
  getMyLinks,
};