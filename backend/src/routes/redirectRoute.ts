import express from 'express';
import { redirectToOriginalUrl } from '../controllers/linkController';

const router = express.Router();

// Public redirect route for short links
router.get('/:shortCode', redirectToOriginalUrl);

export default router;
