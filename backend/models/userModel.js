const db = require('../db/db');

// Yeni kullanıcı oluştur
async function createUser(username, hashedPassword) {
  const result = await db.query(
    'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
    [username, hashedPassword]
  );
  return result.rows[0];
}

// Kullanıcıyı kullanıcı adına göre bul
async function findUserByUsername(username) {
  const result = await db.query(
    'SELECT * FROM users WHERE username = $1',
    [username]
  );
  return result.rows[0];
}

module.exports = {
  createUser,
  findUserByUsername,
};
