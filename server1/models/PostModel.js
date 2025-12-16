import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    postMsg: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: false
    },
    lng: {
        type: Number,
        required: false
    }
}, { timestamps: true });

const PostModel = mongoose.model('Post', PostSchema);

export default PostModel;