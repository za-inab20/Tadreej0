import UserModel from '../models/UserModel.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  admin
export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({}).select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error('Get All Users Error:', error);
        res.status(500).json({ message: "Server error fetching users" });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  admin
export const deleteUser = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.deleteOne();
        res.status(200).json({ message: "User removed" });
    } catch (error) {
        console.error('Delete User Error:', error);
        res.status(500).json({ message: "Server error deleting user" });
    }
};
