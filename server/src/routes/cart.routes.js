import express from "express";

import {
  addElementInCart,
  cartItemList,
  isPresentInCart,
} from "../controllers/cart.controller.js";
const cartRouter = express.Router();
cartRouter.route("/add").post(addElementInCart);
cartRouter.get("/productIsPresent", isPresentInCart);
cartRouter.get("/all", cartItemList);
export { cartRouter };
