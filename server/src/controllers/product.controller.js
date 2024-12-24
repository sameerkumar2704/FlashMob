import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { ApiError, asyncHandler } from "../util/aysncHandler.js";

// product details of sepecific porduct
export const prdouctDetails = asyncHandler(async (req, res) => {
  let { productId } = req.query;
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    console.log("Bad Request");
    throw new ApiError("Invalid product ID", 400); // Bad Request
  }

  let prodcutDetails = await Product.findOne({ _id: productId });

  if (!prodcutDetails) throw new ApiError("Product Not found", 404);
  res.json({
    details: prodcutDetails,
    status: "success",
  });
});

const getAllProductList = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  let product_list = [];
  const category = req.query.category || "all"; // Default to "all" if undefined

  let query = {}; // Initialize the base query

  // Add category filter only if it's not "all"
  if (category !== "all") {
    query.category = { $in: [category] };
  }

  if (limit) {
    product_list = await Product.find(query).limit(limit);
  } else {
    product_list = await Product.find(query);
  }

  if (!product_list)
    throw new ApiError("Product Routes is Working Sorry ", 502);
  res.status(200).send(product_list);
});

const productsOnSale = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  const category = req.query.category || "all"; // Default to "all" if undefined

  let query = { onSale: true }; // Initialize the base query

  // Add category filter only if it's not "all"
  if (category !== "all") {
    query.category = { $in: [category] };
  }

  let products = null;

  if (limit) {
    products = await Product.find(query).limit(limit);
  } else {
    products = await Product.find(query);
  }

  if (!products) throw new ApiError("Product Routes is Working Sorry ", 502);

  res.status(200).send(products);
});

const newProductList = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  const currDate = new Date();
  currDate.setDate(currDate.getDate() - 20);
  let products = [];
  const category = req.query.category || "all";
  let query = {};
  if (category !== "all") {
    query.category = { $in: [category] };
  }

  if (limit) {
    products = await Product.find(query).limit(limit);
  } else {
    products = await Product.find(query);
  }

  if (!products) throw new ApiError("Product Routes is Working Sorry ", 502);
  products = products.filter((product) => {
    const diffInMs = currDate - product.createdAt;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    return diffInDays < 14;
  });

  products = products.map((curr) => ({ ...curr.toObject(), latest: true }));

  res.status(200).send(products);
});
export { getAllProductList, productsOnSale, newProductList };
