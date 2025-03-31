import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        default: "No description available.."
    },
    price: {
        type: Number,
        required: true,
        min: [0, "Price cannot be negative"]
    },
    category: {
        type: String,
        default: "General",
        trim: true
    }
}, { timestamps: true })

export const Product = mongoose.model("Product", productSchema);