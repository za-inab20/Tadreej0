import UserModel from '../models/UserModel.js';

export const requireAdmin = async (req, res, next) => {
  try {
    const adminEmail = req.headers['x-user-email'];

    if (!adminEmail) {
      return res.status(401).json({ message: 'Admin identity is required' });
    }

    const adminUser = await UserModel.findOne({ email: String(adminEmail).toLowerCase() });

    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access only' });
    }

    req.adminUser = adminUser;
    next();
  } catch (error) {
    console.error('Admin Middleware Error:', error);
    return res.status(500).json({ message: 'Error validating admin access' });
  }
};
