import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addStock, clearStock, getAllStock, getStock, removeStock } from "../controllers/inventory.controller.js";

const router = express.Router();

router.route("/stock").get(verifyJWT, getAllStock);

router.route("/add/:productId").post(verifyJWT, addStock);

router.route("/remove/:productId").patch(verifyJWT, removeStock);

router.route("/clear/:productId").patch(verifyJWT, clearStock);

router.route("/stock/:productId").get(verifyJWT, getStock);

export default router;