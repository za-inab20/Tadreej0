import UserModel from '../models/UserModel.js';

export const requireAuthenticatedUser = async (req, res, next) => {
  try {
    const userEmail = req.headers['x-user-email'];

    if (!userEmail) {
      return res.status(401).json({ message: 'User identity is required' });
    }

    const user = await UserModel.findOne({ email: String(userEmail).toLowerCase().trim() });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.authUser = user;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(500).json({ message: 'Error validating user access' });
  }
};
