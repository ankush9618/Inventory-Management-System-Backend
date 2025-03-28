import mongoose from "mongoose";


const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phoneNo: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    purchases: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: [1, "Quantity cannot be less then 1"]
            }
        }
    ]

}, { timestamps: true })

export const Customer = mongoose.model("Customer", customerSchema);