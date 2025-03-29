import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { COOKIE_OPTIONS } from "../constants.js";

const generateAccessAndRefreshToken = async (userId) => { //generate Access and Refresh Token and update refresh token in DB
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(400, "Unauthorized User");
        }
        const accessToken = await user.generateAccessToken(); //generating Access Token from mongoose user method
        const refreshToken = await user.generateRefreshToken(); //generating Refresh Token from mongoose user method
        user.refreshToken = refreshToken; //updating Refresh Token in DB
        await user.save({ validateBeforeSave: false }); //saving the refresh Token in DB without validation
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Error Generating Access and Refresh Token");
    }
}

const registerUser = asyncHandler(async (req, res) => { //Create a new User
    const { name, email, password, role } = req.body;
    if ([name, email, password].some(item => item.trim() === "")) { //check for the user not filling values
        throw new ApiError(400, "Please fill all fields to Proceed!")
    }
    const existingUser = await User.findOne({ email }); //Cheking the user in DB if already Exists
    if (existingUser) {
        throw new ApiError(400, "User Already Exists");
    }
    const user = await User.create({ //creating a new User
        name,
        email,
        password,
        role: role || "employee"
    });
    if (!user) {
        throw new ApiError(400, "Failed to Creating a User");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id); //generating accessToken and refreshToken

    const registeredUser = user.toJSON();
    return res
        .status(201)
        .cookie("accessToken", accessToken, COOKIE_OPTIONS)
        .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
        .json(
            new ApiResponse(201, "User Created Successfully.", registeredUser)
        )

})

const loginUser = asyncHandler(async (req, res) => { //Logging a User
    const { email, password } = req.body;
    if ([email, password].some(item => item.trim() === "")) { //Checking if user does not fill any Field
        throw new ApiError(400, "Please fill all fields to proceed!");
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(400, "User Doesn't Exists");
    }
    const verifyUser = await user.isPasswordCorrect(password); //verify the provided password is correct or not using mongoose user method
    if (!verifyUser) {
        throw new ApiError(400, "Email or Password is Incorrect");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    const verifiedUser = user.toJSON();
    return res
        .status(200)
        .cookie("accessToken", accessToken, COOKIE_OPTIONS)
        .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
        .json(
            new ApiResponse(200, "User Login Successful..", verifiedUser)
        )
})

const updateAvatar = asyncHandler(async (req, res) => { //Updating User Details
    const avatar = req.file?.avatar;
})

export {
    registerUser,
    loginUser,
    updateAvatar

};