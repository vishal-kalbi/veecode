import { Router } from 'express';
import { getHints, revealHint } from '../controllers/hintController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.get('/:slug', auth, getHints);
router.post('/:hintId/reveal', auth, revealHint);

export default router;
