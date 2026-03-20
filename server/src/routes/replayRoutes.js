import { Router } from 'express';
import { saveReplay, getMyReplays, getCommunityReplays, getReplay, toggleVisibility } from '../controllers/replayController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.post('/', auth, saveReplay);
router.get('/my/:slug', auth, getMyReplays);
router.get('/community/:slug', auth, getCommunityReplays);
router.get('/:id', auth, getReplay);
router.patch('/:id/visibility', auth, toggleVisibility);

export default router;
