import mongoose from "mongoose";

const cartModel = {
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "users",
  },
  product_list: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "products",
        required: true,
      },
      quantity: { type: Number, default: 1 },
    },
  ],
};
const cartSchema = mongoose.Schema(cartModel, { timestamps: true });
const Cart = mongoose.model("cart", cartSchema);
export { Cart };
