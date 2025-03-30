import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { COOKIE_OPTIONS } from "../constants.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/cloudinary.js";

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

const logoutUser = asyncHandler(async (req, res) => { // logout User

    return res
        .status(200)
        .clearCookie("accessToken", COOKIE_OPTIONS)
        .clearCookie("refreshToken", COOKIE_OPTIONS)
        .json(
            new ApiResponse(200, "User Logout Successfull", {})
        )

})

const updateAvatar = asyncHandler(async (req, res) => { //Updating Avatar Image
    const avatarLocalFilePath = req.file?.path;
    //console.log(req.file.path)

    if (!avatarLocalFilePath) {
        throw new ApiError(400, "Avatar Image is required to proceed");
    }
    const cloudinaryUpload = await uploadToCloudinary(avatarLocalFilePath);
    if (!cloudinaryUpload) {
        throw new ApiError(501, "Error Uploading Image to Cloud");
    }
    // const avatarUrl = req.user.avatar;
    // const cloudinaryDelete = await deleteFromCloudinary(avatarUrl);
    // if (!cloudinaryDelete) {
    //     throw new ApiError(501, "Error Deleting Image from Cloud")
    // }
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                avatar: cloudinaryUpload.url
            }
        },
        {
            new: true
        }
    ).select("-password -refreshToken");
    if (!user) {
        throw new ApiError(501, "Error Updating Avatar to Database");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Avatar Updated Successfully", user)
        )

})

export {
    registerUser,
    loginUser,
    updateAvatar,
    logoutUser
};