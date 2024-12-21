import mongoose, { Schema } from "mongoose";

const productModel = {
  title: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  brand: { type: String, required: true },
  discount: { type: Number },
  onSale: { type: Boolean, default: false },
  model: { type: String, required: true },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "ecomusers",
    },
  ],
};

const porductSchema = mongoose.Schema(productModel, { timestamps: true });
const Product = mongoose.model("product", porductSchema);
export { Product };
