const express = require('express');
const router = express.Router();
const {
  shortenUrl,
  redirectToOriginalUrl,
  getMyLinks,
} = require('../controllers/linkController');
const authenticateToken = require('../middleware/auth');

// Yeni kısa link oluşturma
router.post('/', authenticateToken, shortenUrl);

// Kullanıcının linklerini getir (korumalı)
router.get('/me', authenticateToken, getMyLinks);

// Kısa koda göre yönlendirme
router.get('/:shortCode', redirectToOriginalUrl);

module.exports = router;