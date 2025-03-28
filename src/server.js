import { app } from "./app.js";
import connectDB from "./db/index.js"; // Fixed function name
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8000;

connectDB()
    .then(() => {
        app.on("error", (err) => {
            console.error("❌ Server Error:", err);
        });

        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Connection to Database Failed:", err);
        process.exit(1);
    });
