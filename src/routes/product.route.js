import express from "express";
import { isAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import { addProduct, deleteProduct } from "../controllers/product.controller.js";

const router = express.Router();


router.route("/create").post(verifyJWT, isAdmin, addProduct);
router.route("/delete/:productId").delete(verifyJWT, isAdmin, deleteProduct)

export default router;