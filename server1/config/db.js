import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        const conStr = process.env.MONGO_URI || "mongodb+srv://admin:admin123@cluster0.3alxnf6.mongodb.net/tadreej?appName=Cluster0";
        await mongoose.connect(conStr);
        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};

export default connectDB;
