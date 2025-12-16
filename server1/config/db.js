import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        const conStr = process.env.MONGO_URI || "mongodb+srv://yaqeenf22:1234@cluster0.lzckx4o.mongodb.net/Project?appName=Cluster0";
        await mongoose.connect(conStr);
        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};

export default connectDB;
