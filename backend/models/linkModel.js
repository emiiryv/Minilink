const db = require('../db/db');

// Yeni kısa link ekleme
async function createShortLink(originalUrl, shortCode, userId) {
  const result = await db.query(
    'INSERT INTO links (original_url, short_code, user_id) VALUES ($1, $2, $3) RETURNING *',
    [originalUrl, shortCode, userId]
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

async function getLinksByUserId(userId) {
  const result = await db.query(
    'SELECT * FROM links WHERE user_id = $1',
    [userId]
  );
  return result.rows;
}

module.exports = {
  createShortLink,
  getLinkByShortCode,
  incrementClickCount,
  getLinksByUserId,
};
