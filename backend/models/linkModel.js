const db = require('../db/db');

// Yeni kısa link ekleme
async function createShortLink(originalUrl, shortCode) {
  const result = await db.query(
    'INSERT INTO links (original_url, short_code) VALUES ($1, $2) RETURNING *',
    [originalUrl, shortCode]
  );
  return result.rows[0];
}

// Kısa koda göre link bulma
async function getLinkByShortCode(shortCode) {
  const result = await db.query(
    'SELECT * FROM links WHERE short_code = $1',
    [shortCode]
  );
  return result.rows[0];
}

// Tıklama sayısını artırma
async function incrementClickCount(shortCode) {
  await db.query(
    'UPDATE links SET click_count = click_count + 1 WHERE short_code = $1',
    [shortCode]
  );
}

module.exports = {
  createShortLink,
  getLinkByShortCode,
  incrementClickCount,
};
