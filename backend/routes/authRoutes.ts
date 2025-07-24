import express, { Request, Response } from 'express';
import { register, login } from '../controllers/authController';

const router = express.Router();

// Kayıt
router.post('/register', register);

// Giriş
router.post('/login', login);

// 404 - Bulunamadı
router.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

export default router;
