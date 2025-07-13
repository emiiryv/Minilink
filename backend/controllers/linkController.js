

const {
  createShortLink,
  getLinkByShortCode,
  incrementClickCount,
} = require('../models/linkModel');
const generateShortCode = require('../utils/generateShortCode');

// Yeni kısa link oluşturma
async function shortenUrl(req, res) {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: 'originalUrl is required' });
  }

  const shortCode = generateShortCode();
  try {
    const newLink = await createShortLink(originalUrl, shortCode);
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
    const link = await getLinkByShortCode(shortCode);
    if (!link) {
      return res.status(404).json({ error: 'Link bulunamadı' });
    }

    await incrementClickCount(shortCode);
    res.redirect(link.original_url);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Yönlendirme hatası' });
  }
}

module.exports = {
  shortenUrl,
  redirectToOriginalUrl,
};