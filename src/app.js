import express from "express";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import cooKieParser from "cookie-parser";
import productRouter from "./routes/product.route.js"
const app = express();

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cooKieParser())

// UserRoutes
app.use("/api/users", userRouter);

//Product Route
app.use("/api/products", productRouter);

// Health Check Route
app.get("/", (req, res) => {
    res.status(200).json({ message: "API is running!" });
});

export { app };
