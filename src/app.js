import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import productRouter from "./routes/product.route.js";
import inventoryRouter from "./routes/inventory.routes.js";
import ApiError from "./utils/ApiError.js";

const app = express();

// --- Middlewares ---
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// --- Routes ---
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/inventory", inventoryRouter);

// Home + Health check
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/api", (req, res) => {
  res.status(200).json({ message: "API is running!" });
});

// --- Error handler (🚨 must be last) ---
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
      data: null,
    });
  }

  console.error("Unhandled Error:", err);
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    errors: [],
    data: null,
  });
});

export { app };
