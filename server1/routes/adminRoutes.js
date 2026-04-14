import express from 'express';
import {
  createCourse,
  createFreelancer,
  deleteCourse,
  deleteFreelancer,
  deleteUser,
  getAllCourses,
  getAllFreelancers,
  getAllUsers,
  getDashboardOverview,
  getReports,
  updateCourse,
  updateFreelancer,
  updateUser,
} from '../controllers/adminController.js';
import { requireAdmin } from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.use(requireAdmin);

router.get('/overview', getDashboardOverview);
router.get('/reports', getReports);

router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.get('/courses', getAllCourses);
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

router.get('/freelancers', getAllFreelancers);
router.post('/freelancers', createFreelancer);
router.put('/freelancers/:id', updateFreelancer);
router.delete('/freelancers/:id', deleteFreelancer);

export default router;
