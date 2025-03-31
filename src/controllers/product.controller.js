import { Product } from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";


const addProduct = asyncHandler(async (req, res) => { //Adding New Product
    let { productName, description, price, category } = req.body;
    if (!productName || !price) {
        throw new ApiError(400, "Product Name and Price is Required to Proceed");
    }
    const product = await Product.findOne({ name: productName });
    if (product) {
        throw new ApiError(400, "Product Already Exists");
    }
    description = description.trim() ? description : undefined;
    category = category.trim() ? category : undefined;
    const newProduct = await Product.create(
        {
            name: productName,
            description,
            price,
            category
        }
    )

    return res
        .status(201)
        .json(
            new ApiResponse(201, "Product Added Successfully", newProduct)
        )
})

const deleteProduct = asyncHandler(async (req, res) => { //Deleting New Product
    const { productId } = req.params;
    //console.log(req.params)
    if (!productId) {
        throw new ApiError(405, "Product Id is Not Valid");
    }
    const product = await Product.findByIdAndDelete(productId); //deleting the product
    if (!product) {
        throw new ApiError(403, "Failed to Delete Product")
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, "Product Deleted Successfully", product)
        )
})

const updateProduct = asyncHandler(async (req, res) => {//Updating Product Details
})


export {
    addProduct,
    deleteProduct
};