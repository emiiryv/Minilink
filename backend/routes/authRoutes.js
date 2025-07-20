const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Kayıt
router.post('/register', register);

// Giriş
router.post('/login', login);

module.exports = router;

// Diğer tüm rotalardan sonra olmalı: 404 sayfası veya genel hata yakalama için
// 404 - Bulunamadı
router.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});
