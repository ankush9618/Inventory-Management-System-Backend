import mongoose from "mongoose";


const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }
})

export const Customer = mongoose.model("Customer", customerSchema);