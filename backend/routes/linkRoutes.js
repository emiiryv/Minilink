const express = require('express');
const router = express.Router();
const {
  shortenUrl,
  redirectToOriginalUrl,
} = require('../controllers/linkController');

// Yeni kısa link oluşturma
router.post('/', shortenUrl);

// Kısa koda göre yönlendirme
router.get('/:shortCode', redirectToOriginalUrl);

module.exports = router;