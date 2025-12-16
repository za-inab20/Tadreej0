import express from 'express';
import { savePost } from '../controllers/postController.js';

const router = express.Router();

router.post('/save', savePost);

export default router;
