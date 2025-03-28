import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: [1, "Quantity cannot be less than 1"],
                default: 1
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true,
        min: [0, "Price cannot be negative"]
    },
    orderStatus: {
        type: String,
        enum: ["pending", "completed", "delivered"],
        default: "pending"
    }
}, { timestamps: true })


export const Order = mongoose.model("Order", orderSchema);