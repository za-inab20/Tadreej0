import express from 'express';
import {
  createMyFreelancer,
  deleteMyFreelancer,
  getCourses,
  getFreelancerById,
  getFreelancers,
  getMyFreelancers,
  updateMyFreelancer,
  addFreelancerReview,
} from '../controllers/catalogController.js';
import { requireAuthenticatedUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/my/freelancers', requireAuthenticatedUser, getMyFreelancers);
router.post('/my/freelancers', requireAuthenticatedUser, createMyFreelancer);
router.put('/my/freelancers/:id', requireAuthenticatedUser, updateMyFreelancer);
router.delete('/my/freelancers/:id', requireAuthenticatedUser, deleteMyFreelancer);

router.get('/courses', getCourses);
router.get('/freelancers', getFreelancers);
router.get('/freelancers/:id', getFreelancerById);
router.post('/freelancers/:id/review', requireAuthenticatedUser, addFreelancerReview);

export default router;
