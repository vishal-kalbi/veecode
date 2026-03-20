import { Router } from 'express';
import { requestReview, getReview } from '../controllers/reviewController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.post('/:submissionId', auth, requestReview);
router.get('/:submissionId', auth, getReview);

export default router;
