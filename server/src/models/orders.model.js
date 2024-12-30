import mongoose from "mongoose";

const orderModel = {
  orderBy: { type: mongoose.Schema.ObjectId, ref: "user" },
  products: [
    {
      _id: { type: mongoose.Schema.ObjectId, ref: "product" },
      quantity: { type: String },
    },
  ],
  address: { type: mongoose.Schema.ObjectId, ref: "address" },
  amount: { type: Number },
  status: {
    type: String,
    enum: ["delivered", "in process"], // Restrict status to these values
    default: "in process", // Set a default value if not provided
  },
};
const orderSchema = mongoose.Schema(orderModel, { timestamps: true });
const Order = mongoose.model("order", orderSchema);
export { Order };
