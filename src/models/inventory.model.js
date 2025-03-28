import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    stock: {
        type: Number,
        required: true,
        min: [0, "Product Quantity cannot be Negative"],
        default: 0
    }
}, { timestamps: true })

export const Inventory = mongoose.model("Inventory", inventorySchema);