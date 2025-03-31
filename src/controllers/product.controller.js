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
    const { productId } = req.params;
    let { productName, description, price, category } = req.body;
    const product = await Product.findById(productId);
    if (product.name == productName && product.description == description && product.price == price && product.category == category) {
        throw new ApiError(400, "Atleast One Field Must be Modified to Update");
    }

    if (!productName && !price) {
        throw new ApiError(400, "Name and Price is required to Update");
    }
    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
            name: productName,
            description,
            price,
            category
        },
        {
            new: true
        }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Product Updated Succesfully", updatedProduct)
        )


})

const getAllProducts = asyncHandler(async (req, res) => {
    const product = await Product.find();
    if (!product) {
        throw new ApiError(400, "Something went wrong While Getting Products");
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, "Products Fetched Successfully", product)
        )
})

const getProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    if (!productId) {
        throw new ApiError(400, "Invalid Product Id")
    }
    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product Not Found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Product Fetched Successfully", product)
        )
})


export {
    addProduct,
    deleteProduct,
    updateProduct,
    getAllProducts,
    getProduct
};