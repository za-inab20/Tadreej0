import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        const conStr = process.env.MONGO_URI || "mongodb://admin:admin123@ac-8ajrwq3-shard-00-00.3alxnf6.mongodb.net:27017,ac-8ajrwq3-shard-00-01.3alxnf6.mongodb.net:27017,ac-8ajrwq3-shard-00-02.3alxnf6.mongodb.net:27017/tadreej?ssl=true&replicaSet=atlas-9jpjdc-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";
        await mongoose.connect(conStr);
        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};

export default connectDB;
