import express from 'express';
import {
  getAllUsers,
  getAllLinks,
  getUserLinks,
  deleteUser,
  deleteLink
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

export default router;