import { Router } from 'express';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import {
  getDashboard, getUsers, updateUserRole,
  getChallenges, createChallenge, updateChallenge, deleteChallenge,
  getTestCases, updateTestCases
} from '../controllers/adminController.js';

const router = Router();

router.use(auth, admin);

router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.get('/challenges', getChallenges);
router.post('/challenges', createChallenge);
router.put('/challenges/:id', updateChallenge);
router.delete('/challenges/:id', deleteChallenge);
router.get('/challenges/:challengeId/test-cases', getTestCases);
router.put('/challenges/:challengeId/test-cases', updateTestCases);

export default router;
