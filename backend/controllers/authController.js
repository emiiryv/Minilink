const { registerUser, loginUser } = require('../services/authService');

// Yeni kullanıcı kaydı işlemini yöneten controller fonksiyonu
async function register(req, res, next) {
  const { username, password } = req.body;

  try {
    // Kullanıcıyı veritabanına kaydet ve başarılı olursa response dön
    const user = await registerUser(username, password);
    res.status(201).json({ message: 'Kayıt başarılı', user: { id: user.id, username: user.username } });
  } catch (err) {
    next(err); // Hata olursa error middleware'e yönlendir
  }
}

// Kullanıcı girişi işlemini yöneten controller fonksiyonu
async function login(req, res, next) {
  const { username, password } = req.body;

  try {
    // Girilen bilgileri kontrol et ve başarılıysa JWT token dön
    const result = await loginUser(username, password);
    res.json(result);
  } catch (err) {
    next(err); // Hata olursa error middleware'e yönlendir
  }
}

module.exports = {
  register,
  login,
};