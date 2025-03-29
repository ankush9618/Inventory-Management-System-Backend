import express from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js"

const router = express.Router();


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/update-avatar").post(
    upload.single('avatar'),

)

export default router;