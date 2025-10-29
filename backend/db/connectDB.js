import mongoose from "mongoose";

const connectDB = async () => {
    
    const MONGO_URL = process.env.MONGO_URL;
    // console.log(MONGO_URL);
    try {
        await mongoose.connect(MONGO_URL);
        console.log("DB connected");
    } catch (error) {
        console.log(error);
    }
}
export default connectDB;