import { Router } from 'express';
import { listChallenges, getChallenge } from '../controllers/challengeController.js';

const router = Router();

router.get('/', listChallenges);
router.get('/:slug', getChallenge);

export default router;
