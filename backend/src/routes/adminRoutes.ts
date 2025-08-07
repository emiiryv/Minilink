import express from 'express';
import {
  getAllUsers,
  getAllLinks,
  getUserLinks,
  deleteUser,
  deleteLink,
  updateLink
} from '../controllers/adminController';
import auth from '../middleware/auth';
import isAdmin from '../middleware/isAdmin';

const router = express.Router();

// Auth + Admin kontrolü
router.use(auth, isAdmin);

router.get('/users', getAllUsers);
router.get('/links', getAllLinks);
router.get('/users/:id/links', getUserLinks);
router.delete('/users/:id', deleteUser);
router.delete('/links/:id', deleteLink);

router.patch('/links/:id', updateLink);

import { getDashboardStats } from '../controllers/adminController';

router.get('/stats', getDashboardStats);

export default router;