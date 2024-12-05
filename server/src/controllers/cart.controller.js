import { Cart } from "../models/cart.model.js";
import { asyncHandler } from "../util/aysncHandler.js";

export const addElementInCart = asyncHandler(async (req, res) => {
  const { user, product_item } = req.body;
  const user_cart = await Cart.findOne({ user });
  if (!user_cart) {
    const new_data = {
      user,
      product_list: [product_item],
    };
    await Cart.create(new_data);
  } else {
    await Cart.updateOne({ user }, { $push: { product_list: product_item } });
  }
  res.status(200).json({
    status: "sucess",
    message: "product added to cart",
  });
});

export const isPresentInCart = asyncHandler(async (req, res) => {
  const { user, product_item } = req.query;
  const product = await Cart.findOne({
    user,
    product_list: { $in: [product_item] },
  });

  res.status(200).json({
    status: "success",
    productInCart: product ? true : false,
  });
});

export const cartItemList = asyncHandler(async (req, res) => {
  const { user } = req.query;
  const { product_list } = await Cart.findOne({ user });
  return res.json({
    status: "success",
    productList: product_list,
  });
});
