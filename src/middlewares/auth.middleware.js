import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken;
    //console.log(req.cookies);
    if (!token) {
        throw new ApiError(400, "Unauthorized Access");
    }
    const veifiedToken = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    if (!veifiedToken) {
        throw new ApiError(400, "Unauthorized Token");
    }
    const user = await User.findById(veifiedToken._id).select("-password -refreshToken");
    if (!user) {
        throw new ApiError(401, "Invalid Access Token");
    }
    req.user = user;
    next();
})

export { verifyJWT }