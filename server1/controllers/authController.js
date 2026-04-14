import bcrypt from 'bcryptjs';
import UserModel from '../models/UserModel.js';
import FreelancerModel from '../models/FreelancerModel.js';
import { sendResetEmail } from '../services/emailService.js';

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const resolveUserFreelancerStatus = (user) => {
  if ((user.accountType || 'user') !== 'freelancer') return 'not_requested';
  return user.freelancerApprovalStatus || 'pending';
};

const syncOwnedFreelancerVisibility = async (user) => {
  const shouldBePublic = user.accountType === 'freelancer' && user.freelancerApprovalStatus === 'approved';

  await FreelancerModel.updateMany(
    { ownerId: user._id },
    {
      $set: {
        ownerEmail: user.email,
        publicVisibility: shouldBePublic ? 'public' : 'private',
        verified: shouldBePublic,
      },
    }
  );
};

const buildUserResponse = (user) => ({
  _id: user._id,
  uname: user.uname,
  email: user.email,
  profilepic: user.profilepic,
  role: user.role,
  accountType: user.accountType || 'user',
  freelancerApprovalStatus: resolveUserFreelancerStatus(user),
  theme: user.theme || 'light',
  createdAt: user.createdAt,
});

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await UserModel.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.status(200).json({
      user: buildUserResponse(user),
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
};

export const register = async (req, res) => {
  try {
    const { uname, email, password, profilepic, accountType } = req.body;

    if (!uname || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const existingUser = await UserModel.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must contain at least one uppercase letter, one number, and one special character',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const normalizedAccountType = accountType === 'freelancer' ? 'freelancer' : 'user';

    const newUser = new UserModel({
      uname,
      email: normalizedEmail,
      password: hashedPassword,
      profilepic: profilepic || 'default.png',
      accountType: normalizedAccountType,
      freelancerApprovalStatus: normalizedAccountType === 'freelancer' ? 'pending' : 'not_requested',
      role: 'user',
      theme: 'light',
    });

    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await UserModel.findOne({ email: String(email).toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = generateOtp();
    user.resetOtp = otp;
    user.resetOtpExpires = new Date(Date.now() + 2 * 60 * 1000);
    await user.save();

    await sendResetEmail(user.email, otp);
    console.log(`✉️ Generated OTP for ${user.email}: ${otp}`);

    return res.status(200).json({ message: 'Reset code sent to your email' });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    return res.status(500).json({ message: 'Error sending reset code' });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const user = await UserModel.findOne({ email: String(email).toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.resetOtp || !user.resetOtpExpires) {
      return res.status(400).json({ message: 'No reset request found' });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({ message: 'Invalid code' });
    }

    if (user.resetOtpExpires < new Date()) {
      return res.status(400).json({ message: 'Code expired' });
    }

    return res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    return res.status(500).json({ message: 'Error verifying code' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await UserModel.findOne({ email: String(email).toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.resetOtp || !user.resetOtpExpires) {
      return res.status(400).json({ message: 'No reset request found' });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({ message: 'Invalid code' });
    }

    if (user.resetOtpExpires < new Date()) {
      return res.status(400).json({ message: 'Code expired' });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message: 'Password must contain at least one uppercase letter, one number, and one special character',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = null;
    user.resetOtpExpires = null;
    await user.save();

    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset Password Error:', error);
    return res.status(500).json({ message: 'Error resetting password' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { _id, uname, email, oldPassword, newPassword, profilepic, accountType, theme } = req.body;

    if (!_id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await UserModel.findById(_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (uname) user.uname = uname;
    if (profilepic) user.profilepic = profilepic;
    if (accountType && ['user', 'freelancer'].includes(accountType)) {
      user.accountType = accountType;
      user.freelancerApprovalStatus = accountType === 'freelancer'
        ? user.freelancerApprovalStatus === 'approved'
          ? 'approved'
          : 'pending'
        : 'not_requested';
    }

    if (theme && ['light', 'dark'].includes(theme)) {
      user.theme = theme;
    }

    if (email && email !== user.email) {
      const normalizedEmail = String(email).toLowerCase().trim();
      const existingUser = await UserModel.findOne({ email: normalizedEmail });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(409).json({ message: 'Email already in use' });
      }
      user.email = normalizedEmail;
    }

    if (newPassword) {
      if (!oldPassword) {
        return res.status(400).json({ message: 'Current password is required' });
      }

      const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isOldPasswordValid) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }

      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;
      if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({
          message: 'Password must contain at least one uppercase letter, one number, and one special character',
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    await user.save();
    await syncOwnedFreelancerVisibility(user);

    return res.status(200).json({
      user: buildUserResponse(user),
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    return res.status(500).json({ message: 'Error updating profile' });
  }
};
