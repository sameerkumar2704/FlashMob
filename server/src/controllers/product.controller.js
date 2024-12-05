import { Product } from "../models/product.model.js";
import { ApiError, asyncHandler } from "../util/aysncHandler.js";

// product details of sepecific porduct
export const prdouctDetails = asyncHandler(async (req, res) => {
  let { productName } = req.query;
  productName = productName.split("-").join(" ");
  const prodcutDetails = await Product.findOne({ name: productName });
  if (!prodcutDetails) throw new ApiError("Product Not found", 404);
  res.json({
    details: prodcutDetails,
    status: "success",
  });
});

const getAllProductList = asyncHandler(async (req, res, next) => {
  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  let product_list = await Product.find({}).skip(20);
  if (limit) {
    product_list = await Product.find({}).skip(20).limit(limit);
  } else {
    product_list = await Product.find({}).skip(20);
  }

  res.status(200).send(product_list);
});
const productsOnSale = asyncHandler(async (req, res, next) => {
  const product_on_sale = await Product.find({ saleOn: true });

  res.status(200).send(product_on_sale);
});

const newProductList = asyncHandler(async (req, res, next) => {
  const currDate = new Date();

  const product_list = await Product.find({});
  const new_product_list = product_list.filter((product) => {
    const diffInMs = currDate - product.postedOn;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    return diffInDays < 14;
  });
  res.status(200).send(new_product_list);
});
export { getAllProductList, productsOnSale, newProductList };
