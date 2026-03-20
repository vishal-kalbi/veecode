import { Router } from 'express';
import { getProfile, getSubmissions, getProgress } from '../controllers/userController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.get('/profile', auth, getProfile);
router.get('/submissions', auth, getSubmissions);
router.get('/progress', auth, getProgress);

export default router;
