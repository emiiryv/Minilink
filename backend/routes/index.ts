import express from 'express';
import linkRoutes from './linkRoutes';
import authRoutes from './authRoutes';

const router = express.Router();

router.use('/links', linkRoutes);
router.use('/auth', authRoutes);

export default router;