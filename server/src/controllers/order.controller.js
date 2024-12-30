import { query } from "express";
import { Order } from "../models/orders.model.js";
import { asyncHandler } from "../util/aysncHandler.js";

export const handlingNewOrder = asyncHandler(async (req, res) => {
  const userRef = req.user;
  const query = await Order.create({
    orderBy: userRef,
    products: req.body.products,
    address: req.body.address,
    amount: req.body.amount,
  });

  return res.status(200).json({
    status: "success",
    orderId: query._id,
  });
});

export const getUserOrderList = async (req, res) => {
  const userRef = req.user;
  const limit = req.query?.limit || Number.MAX_VALUE;
  let query = {};
  if (limit !== Number.MAX_VALUE) {
    query = await Order.find({ orderBy: userRef })
      .limit(limit)
      .sort({ createdAt: "desc" });
  } else {
    query = await Order.find({ orderBy: userRef })

      .sort({ createdAt: "desc" })
      .populate("products._id");
  }

  const arr = query.map((curr) => curr.toObject());

  return res.status(200).json({
    status: "successs",
    orders: arr,
  });
};
