import express from 'express';
import {
  shortenUrl,
  redirectToOriginalUrl,
  getMyLinks,
  deleteLink,
} from '../controllers/linkController';
import authenticateToken from '../middleware/auth';

const router = express.Router();

// Yeni kısa link oluşturma
router.post('/', authenticateToken, shortenUrl);

// Kullanıcının linklerini getir (korumalı)
router.get('/me', authenticateToken, getMyLinks);

// Link silme (korumalı)
router.delete('/:id', authenticateToken, deleteLink);

export default router;