const jwt = require('jsonwebtoken');

// JWT için gizli anahtar, ortam değişkeninden alınır veya varsayılan olarak 'gizli-anahtar' kullanılır
const JWT_SECRET = process.env.JWT_SECRET || 'gizli-anahtar';

function authenticateToken(req, res, next) {
  // Authorization başlığından token alınır: 'Bearer <token>' formatında beklenir
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Token yoksa yetkisiz erişim hatası döndürülür
  if (!token) {
    return res.status(401).json({ error: 'Token bulunamadı' });
  }

  // Token doğrulanır
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      // Token geçersizse erişim reddedilir
      return res.status(403).json({ error: 'Geçersiz token' });
    }
    // Doğrulanan kullanıcı bilgisi req.user içine eklenir
    req.user = user;
    next(); // middleware zincirine devam edilir
  });
}

module.exports = authenticateToken;