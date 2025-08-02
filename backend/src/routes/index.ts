import express from 'express';
import linkRoutes from './linkRoutes';
import authRoutes from './authRoutes';
import adminRoutes from './adminRoutes';

const router = express.Router();

router.use('/links', linkRoutes);
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);

export default router;