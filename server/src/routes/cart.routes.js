import express from "express";

import {
  addElementInCart,
  cartItemList,
  deleteItemFromCart,
  isPresentInCart,
} from "../controllers/cart.controller.js";
import { verifyToken } from "../middelwares/user.middelware.js";

const cartRouter = express.Router();
cartRouter.route("/add").post(verifyToken, addElementInCart);
cartRouter.route("/productIsPresent").get(verifyToken, isPresentInCart);
cartRouter.get("/all", verifyToken, cartItemList);
cartRouter.delete("/", verifyToken, deleteItemFromCart);
export { cartRouter };
