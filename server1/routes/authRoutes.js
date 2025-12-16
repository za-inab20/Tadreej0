import express from 'express';
import { 
    login, 
    register, 
    forgotPassword, 
    verifyOtp, 
    resetPassword,
    updateProfile
} from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.put('/profile', updateProfile);

export default router;
