import express from 'express';
import rateLimit from 'express-rate-limit';
import { redirectToOriginalUrl } from '../controllers/linkController';
import redirectLimiter from '../middleware/rateLimiter';

const router = express.Router();

// Public redirect route for short links
router.get('/:shortCode', redirectLimiter, redirectToOriginalUrl);

export default router;
