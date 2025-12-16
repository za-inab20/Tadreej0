import bcrypt from 'bcrypt';
import UserModel from '../models/UserModel.js';
import { sendResetEmail, generateOtp } from '../services/emailService.js';

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Remove sensitive data before sending
        const userResponse = {
            _id: user._id,
            uname: user.uname,
            email: user.email,
            profilepic: user.profilepic,
            role: user.role
        };

        return res.status(200).json({ 
            user: userResponse, 
            message: "Login successful" 
        });

    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ message: "Server error during login" });
    }
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { uname, email, password, profilepic } = req.body;

        // Validate required fields
        if (!uname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
        // Strong password validation (Server Side)
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;

if (!passwordRegex.test(password)) {
    return res.status(400).json({ 
        message: "Password must contain at least one uppercase letter, one number, and one special character" 
    });
}
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new UserModel({
            uname,
            email,
            password: hashedPassword,
            profilepic: profilepic || 'default.png'
        });

        await newUser.save();

        return res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error('Registration Error:', error);
        return res.status(500).json({ message: "Server error during registration" });
    }
};

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const otp = generateOtp();
        user.resetOtp = otp;
        user.resetOtpExpires = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
        await user.save();

        await sendResetEmail(email, otp);
        console.log(`✉️ Generated OTP for ${email}: ${otp}`);

        return res.status(200).json({ message: "Reset code sent to your email" });

    } catch (error) {
        console.error('Forgot Password Error:', error);
        return res.status(500).json({ message: "Error sending reset code" });
    }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.resetOtp || !user.resetOtpExpires) {
            return res.status(400).json({ message: "No reset request found" });
        }

        if (user.resetOtp !== otp) {
            return res.status(400).json({ message: "Invalid code" });
        }

        if (user.resetOtpExpires < new Date()) {
            return res.status(400).json({ message: "Code expired" });
        }

        return res.status(200).json({ message: "OTP verified successfully" });

    } catch (error) {
        console.error('Verify OTP Error:', error);
        return res.status(500).json({ message: "Error verifying code" });
    }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.resetOtp || !user.resetOtpExpires) {
            return res.status(400).json({ message: "No reset request found" });
        }

        if (user.resetOtp !== otp) {
            return res.status(400).json({ message: "Invalid code" });
        }

        if (user.resetOtpExpires < new Date()) {
            return res.status(400).json({ message: "Code expired" });
        }

        
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;

if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({ 
        message: "Password must contain at least one uppercase letter, one number, and one special character" 
    });
}

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = null;
        user.resetOtpExpires = null;
        await user.save();

        return res.status(200).json({ message: "Password reset successfully" });

    } catch (error) {
        console.error('Reset Password Error:', error);
        return res.status(500).json({ message: "Error resetting password" });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const { _id, uname, email, password, profilepic } = req.body;

        if (!_id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await UserModel.findById(_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update fields
        if (uname) user.uname = uname;
        if (profilepic) user.profilepic = profilepic;

        // Check if email is being changed and if it's already taken
        if (email && email !== user.email) {
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                return res.status(409).json({ message: "Email already in use" });
            }
            user.email = email;
        }

        // Update password if provided
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        await user.save();

        // Return updated user info (excluding password)
        const userResponse = {
            _id: user._id,
            uname: user.uname,
            email: user.email,
            profilepic: user.profilepic,
            role: user.role
        };

        return res.status(200).json({ 
            user: userResponse, 
            message: "Profile updated successfully" 
        });

    } catch (error) {
        console.error('Update Profile Error:', error);
        return res.status(500).json({ message: "Error updating profile" });
    }
};
