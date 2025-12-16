import PostModel from '../models/PostModel.js';

// @desc    Save a new post
// @route   POST /api/posts/save
// @access  Private (should add auth middleware later)
export const savePost = async (req, res) => {
    try {
        const { postMsg, email, lat, lng } = req.body;

        // Validate required fields
        if (!postMsg || !email) {
            return res.status(400).json({ message: "Post message and email are required" });
        }

        // Create new post
        const newPost = new PostModel({
            postMsg,
            email,
            lat: lat || null,
            lng: lng || null
        });

        await newPost.save();

        return res.status(201).json({ 
            message: "Post saved successfully",
            post: newPost 
        });

    } catch (error) {
        console.error('Save Post Error:', error);
        return res.status(500).json({ message: "Error saving post" });
    }
};
