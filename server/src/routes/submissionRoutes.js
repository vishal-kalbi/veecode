import { Router } from 'express';
import { runCode, submitCode, getSubmission, getChallengeSubmissions } from '../controllers/submissionController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.post('/run', auth, runCode);
router.post('/submit', auth, submitCode);
router.get('/:id', auth, getSubmission);
router.get('/challenge/:slug', auth, getChallengeSubmissions);

export default router;
