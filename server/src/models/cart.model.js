import mongoose from "mongoose";

const cartModel = {
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "users",
  },
  product_list: [{ type: mongoose.Schema.ObjectId, ref: "products" }],
};
const cartSchema = mongoose.Schema(cartModel, { timestamps: true });
const Cart = mongoose.model("cart", cartSchema);
export { Cart };
