import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: [8, "Password must be Minimum of 8 Characters"]
    },
    role: {
        type: String,
        enum: ["admin", "employee"],
        default: "employee"
    }
}, { timestamps: true })


export const User = mongoose.model("User", userSchema);