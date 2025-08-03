import express from 'express';
import {
  shortenUrl,
  redirectToOriginalUrl,
  getMyLinks,
  deleteLink,
  generateUserQrCode,
} from '../controllers/linkController';
import authenticateToken from '../middleware/auth';

const router = express.Router();

// Yeni kısa link oluşturma
router.post('/', authenticateToken, shortenUrl);

// Kullanıcının linklerini getir (korumalı)
router.get('/me', authenticateToken, getMyLinks);

// Link silme (korumalı)
router.delete('/:id', authenticateToken, deleteLink);

// Kullanıcının kendi linki için QR kod üretme
router.get('/:id/qrcode', authenticateToken, generateUserQrCode);

export default router;