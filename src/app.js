import express from "express";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import cooKieParser from "cookie-parser";
import productRouter from "./routes/product.route.js"
import inventoryRouter from "./routes/inventory.routes.js"

const app = express();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cooKieParser())

// UserRoutes
app.use("/api/users", userRouter);

//Product Route
app.use("/api/products", productRouter);

//Inventory Router
app.use("/api/inventory", inventoryRouter);

// Health Check Route
app.get("/api", (req, res) => {
    res.status(200).json({ message: "API is running!" });
});

export { app };
