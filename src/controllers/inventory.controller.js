import { Inventory } from "../models/inventory.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";


const addStock = asyncHandler(async (req, res) => {//Adding Stcock Quantity
    const { productId } = req.params;
    const { stock } = req.body;
    if (!productId || stock === undefined) {
        throw new ApiError(400, "All the fields are required to proceed");
    }
    const inventory = await Inventory.findOne({ product: productId });
    if (!inventory) {
        throw new ApiError(404, "The Product does not Exist")
    }
    const quantity = inventory.stock + Number(stock);
    if (quantity < 1) {
        throw new ApiError(400, "Stock cannot be less than 1")
    }
    inventory.stock = quantity;
    await inventory.save();

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Stock Updated Successfully", inventory)
        )
})

const removeStock = asyncHandler(async (req, res) => { //Updating Stock Quantity
    const { productId } = req.params;
    const { stock } = req.body;
    if (!productId || stock === undefined) {
        throw new ApiError(400, "All the fields are required to proceed");
    }
    const inventory = await Inventory.findOne({ product: productId });
    if (!inventory) {
        throw new ApiError(404, "The Product does not Exist")
    }
    const quantity = inventory.stock - Number(stock);
    if (quantity < 0) {
        throw new ApiError(400, "Stock cannot be less than 0")
    }
    inventory.stock = quantity;
    await inventory.save();

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Stock Updated Successfully", inventory)
        )
})

const clearStock = asyncHandler(async (req, res) => { //Clearing Stock Quantity
    const { productId } = req.params;
    if (!productId) {
        throw new ApiError(400, "Select the Product to Proceed");
    }
    const inventory = await Inventory.findOne({ product: productId });
    if (!inventory) {
        throw new ApiError(404, "Product Doesn't Exist");
    }
    inventory.stock = 0;
    await inventory.save();

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Product Stock Cleared Successfully", inventory)
        )
})

const getStock = asyncHandler(async (req, res) => { //get Stock details
    const { productId } = req.params;
    if (!productId) {
        throw new ApiError(400, "Select the Product to Proceed")
    }
    const inventory = productId
        ? await Inventory.findOne({ product: productId })
        : await Inventory.find();

    if (!inventory) {
        throw new ApiError(404, "Product Doesn't Exist");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Stock Details Fetched Successfully", inventory)
        )
})



export {
    addStock,
    removeStock,
    clearStock,
    getStock
};