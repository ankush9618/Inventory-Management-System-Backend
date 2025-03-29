import express from "express";
import cors from "cors";
import userRouter from "./routes/user.route.js";

const app = express();

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes
app.use("/api/users", userRouter);

// Health Check Route
app.get("/", (req, res) => {
    res.status(200).json({ message: "API is running!" });
});

export { app };
