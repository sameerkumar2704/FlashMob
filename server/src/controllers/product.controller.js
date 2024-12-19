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

const getAllProductList = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  let product_list = [];
  if (limit) {
    product_list = await Product.find({}).limit(limit);
  } else {
    product_list = await Product.find({});
  }

  res.status(200).send(product_list);
});

const productsOnSale = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  let products = [];
  if (limit) {
    products = await Product.find({ saleOn: true }).limit(limit);
  } else {
    products = await Product.find({ saleOn: true });
  }
  res.status(200).send(products);
});

const newProductList = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  const currDate = new Date();
  currDate.setDate(currDate.getDate() - 20);
  let products = [];
  if (limit) {
    products = await Product.find({}).limit(limit);
  } else {
    products = await Product.find({});
  }
  products = products.filter((product) => {
    const diffInMs = currDate - product.postedOn;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    return diffInDays < 14;
  });

  products = products.map((curr) => ({ ...curr.toObject(), latest: true }));

  res.status(200).send(products);
});
export { getAllProductList, productsOnSale, newProductList };
