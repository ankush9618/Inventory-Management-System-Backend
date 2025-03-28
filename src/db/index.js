import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        console.log("✅ Connected to Database Successfully. Host:", connectionInstance.connection.host);
    } catch (error) {
        console.error("❌ Error Connecting to Database:", error);
        process.exit(1);
    }
};

export default connectDB;
