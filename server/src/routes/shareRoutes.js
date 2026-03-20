import { Router } from 'express';
import { shareSubmission, getSharedSolution } from '../controllers/shareController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.post('/', auth, shareSubmission);
router.get('/:token', getSharedSolution);

export default router;
