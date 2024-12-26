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
  let searchQuery = req.query.search || "";
  let words = searchQuery.split(" ");
  const escapeRegex = (word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  let regexPattern = words
    .map((word) => `\\b${escapeRegex(word)}\\b`)
    .join("|");
  console.log(regexPattern);
  const excludeField = [
    "sort",
    "page",
    "limit",
    "fields",
    "products",
    "search",
  ];
  const currDate = new Date();
  currDate.setDate(currDate.getDate() - 20);
  const queryObj = { ...req.query }; // due to avoid pass by refrecnce we used spread

  excludeField.forEach((curr) => delete queryObj[curr]);
  const constr = {
    ...queryObj,
    title: { $regex: regexPattern, $options: "i" },
  };

  let query = Product.find(constr);
  if (req.query.products) {
    console.log(constr);
    query = query.where("onSale").exists(false);
    query = query.where("createdAt").lte(currDate);
  }
  if (req.query.limit) {
    query = query.limit(req.query.limit); // Ensure limit is a number
  }

  let product_list = await query;
  if (!product_list)
    throw new ApiError("Product Routes is Working Sorry ", 502);
  res.status(200).send({
    statu: "success",
    type: "all",
    list: product_list,
  });
});

const productsOnSale = asyncHandler(async (req, res) => {
  const excludeField = ["sort", "page", "limit", "fields", "products"];
  const queryObj = { ...req.query, onSale: true };
  excludeField.forEach((curr) => delete queryObj[curr]);

  const sizeOfDocument = await Product.find(queryObj).countDocuments();
  const limit = req.query?.limit ?? 1;
  const currentPage = req.query?.page ?? 1;
  let query = Product.find(queryObj);
  const skip = (currentPage - 1) * (limit || 5);
  query = query.skip(skip).limit(limit);
  const maxPages = Math.ceil(sizeOfDocument / limit);

  if (req.query.limit) {
    query = query.limit(req.query.limit); // Ensure limit is a number
  }
  let products = await query;

  if (!products) throw new ApiError("Product Routes is Working Sorry ", 502);

  res.status(200).send({
    statu: "success",
    type: "sale",
    list: products,
    maxPages,
  });
});

const newProductList = asyncHandler(async (req, res) => {
  const excludeField = ["sort", "page", "limit", "fields", "products"];
  const currDate = new Date();
  currDate.setDate(currDate.getDate() - 20);
  const queryObj = { ...req.query }; // to avoid pass by refrecnce we used spread

  excludeField.forEach((curr) => delete queryObj[curr]); // ["sort", "page", "limit", "fields", "products"]; excluding these fields

  const sizeOfDocument = await Product.find(queryObj)

    .where("createdAt")
    .gt(currDate)
    .countDocuments();
  let query = Product.find(queryObj).where("createdAt").gt(currDate);

  const limit = req.query?.limit ?? 1;
  const currentPage = req.query?.page ?? 1;

  const skip = (currentPage - 1) * (limit || 5);
  query = query.skip(skip).limit(limit);
  const maxPages = Math.ceil(sizeOfDocument / limit);

  let products = await query;

  products = products.map((curr) => ({ ...curr.toObject(), latest: true }));

  res.status(200).send({
    statu: "success",
    type: "new",
    list: products,
    maxPages,
  });
});
export { getAllProductList, productsOnSale, newProductList };
