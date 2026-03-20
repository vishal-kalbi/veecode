import { Router } from 'express';
import { getComments, createComment, deleteComment } from '../controllers/commentController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.get('/:slug', getComments);
router.post('/:slug', auth, createComment);
router.delete('/:id', auth, deleteComment);

export default router;
