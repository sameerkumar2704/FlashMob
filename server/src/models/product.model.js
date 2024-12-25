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

const productSchema = mongoose.Schema(productModel, { timestamps: true });
productSchema.index({ title: "text" });
const Product = mongoose.model("product", productSchema);
export { Product };
