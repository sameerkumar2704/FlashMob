import express from "express";
import {
  getAllProductList,
  newProductList,
  productsOnSale,
} from "../controllers/product.controller.js";
const productRoute = express.Router();
productRoute.route("/all").get(getAllProductList);
productRoute.route("/sale").get(productsOnSale);
productRoute.route("/new").get(newProductList);

export { productRoute };
