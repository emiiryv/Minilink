const express = require('express');
const router = express.Router();
const {
  shortenUrl,
  redirectToOriginalUrl,
  getMyLinks,
  deleteLink,
} = require('../controllers/linkController');
const authenticateToken = require('../middleware/auth');

// Yeni kısa link oluşturma
router.post('/', authenticateToken, shortenUrl);

// Kullanıcının linklerini getir (korumalı)
router.get('/me', authenticateToken, getMyLinks);

// Link silme (korumalı)
router.delete('/:id', authenticateToken, deleteLink);

module.exports = router;