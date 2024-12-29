import mongoose from "mongoose";
import { Cart } from "../models/cart.model.js";
import { ApiError, asyncHandler } from "../util/aysncHandler.js";
import { Product } from "../models/product.model.js";

export const addElementInCart = asyncHandler(async (req, res) => {
  const user = req.user;
  const { product_item, quantity } = req.body;
  const user_cart = await Cart.findOne({ user: user });
  if (!user_cart) {
    const new_data = {
      user,
      product_list: [
        {
          product: product_item,
        },
      ],
    };
    await Cart.create(new_data);
  } else {
    let prodcutPresentIncart = await Cart.findOne({
      user, // The user who owns the cart
      product_list: { $elemMatch: { product: product_item } }, // Check if product_item exists in product_list
    });
    if (prodcutPresentIncart) {
      if (req.body?.quantity) {
        await Cart.updateOne(
          { user: user, "product_list.product": product_item },
          {
            $set: { "product_list.$.quantity": req.body.quantity },
          }
        );
      } else {
        await Cart.updateOne(
          { user: user, "product_list.product": product_item }, // Find the cart for the user and check for the product
          {
            $inc: { "product_list.$.quantity": req.body.increaseQuantity }, // Increment the quantity if product is found
          }
        );
      }
    } else {
      await Cart.updateOne(
        { user },
        {
          $push: { product_list: { product: product_item, quantity: 1 } }, // Add new product if it's not found
        }
      );
    }
  }

  res.status(200).json({
    status: "sucess",
    message: "product added to cart",
  });
});

export const isPresentInCart = asyncHandler(async (req, res) => {
  const { user, product_item } = req.query;
  let product = null;

  product = await Cart.findOne({
    user, // The user who owns the cart
    product_list: { $elemMatch: { product: product_item } }, // Check if product_item exists in product_list
  });

  res.status(200).json({
    status: "success",
    productInCart: product ? true : false,
  });
});

export const cartItemList = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!mongoose.Types.ObjectId.isValid(user)) {
    throw new ApiError("Invalid user ID", 502);
  }

  let cartDoc = await Cart.findOne({ user });
  const cartList = cartDoc?.product_list ?? [];
  const productsInCart = await Promise.all(
    cartList.map(async ({ product, quantity }) => {
      const productRef = await Product.findById(product);
      const obj = productRef.toObject();
      return { ...obj, quantity };
    })
  );

  return res.json({
    status: "success",
    type: "cart",
    list: productsInCart,
  });
});

export const deleteItemFromCart = asyncHandler(async (req, res) => {
  const user = req.user;
  const productId = req.query.productId;

  const result = await Cart.updateOne(
    {
      user, // Match the user
      "product_list.product": productId, // Match product within the array
    },
    {
      $pull: { product_list: { product: productId } }, // Remove the specific product from the array
    }
  );
  return res
    .status(200)
    .json({ status: "sucess", messsage: "item removed from cart" });
});
