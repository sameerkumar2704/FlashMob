import express from "express";
import { verifyToken } from "../middelwares/user.middelware.js";
import {
  getUserOrderList,
  handlingNewOrder,
} from "../controllers/order.controller.js";
const orderRouter = express.Router();
orderRouter
  .route("/")
  .post(verifyToken, handlingNewOrder)
  .get(verifyToken, getUserOrderList);
export { orderRouter };
