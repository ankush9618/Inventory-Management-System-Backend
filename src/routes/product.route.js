import express from "express";
import { isAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import { addProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from "../controllers/product.controller.js";

const router = express.Router();

router.route("/").get(verifyJWT,getAllProducts);
router.route("/:productId").get(verifyJWT, getProduct);
router.route("/add").post(verifyJWT, isAdmin, addProduct);
router.route("/delete/:productId").delete(verifyJWT, isAdmin, deleteProduct);
router.route("/update/:productId").patch(verifyJWT, isAdmin, updateProduct);

export default router;