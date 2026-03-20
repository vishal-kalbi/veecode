import { Router } from 'express';
import { runCode, submitCode, getSubmission, getChallengeSubmissions, getCommunitySolutions, runCustom } from '../controllers/submissionController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.post('/run', auth, runCode);
router.post('/submit', auth, submitCode);
router.post('/run-custom', auth, runCustom);
router.get('/community/:slug', auth, getCommunitySolutions);
router.get('/challenge/:slug', auth, getChallengeSubmissions);
router.get('/:id', auth, getSubmission);

export default router;
