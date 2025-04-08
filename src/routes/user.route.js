import express from "express";
import { changeCurrentPassword, getUserDetails, isUserLoggedIn, loginUser, logoutUser, registerUser, updateAvatar } from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/update-avatar").patch(
    verifyJWT,
    upload.single('avatar'),
    updateAvatar
)
router.route("/change-password").patch(verifyJWT, changeCurrentPassword);
router.route("/details").get(verifyJWT,getUserDetails);

router.route("/login-status").get(isUserLoggedIn);

export default router;