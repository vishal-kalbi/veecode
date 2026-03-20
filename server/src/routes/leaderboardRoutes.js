import { Router } from 'express';
import { getLeaderboard, getMyRank } from '../controllers/leaderboardController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.get('/', getLeaderboard);
router.get('/me', auth, getMyRank);

export default router;
