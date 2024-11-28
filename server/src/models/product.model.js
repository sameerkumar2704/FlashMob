import mongoose, { Schema } from "mongoose";

const productModel = {
  name: { type: String, required: true },
  descirption: { type: String, required: true },
  stock: { required: true, type: Number },
  rating: {
    required: true,
    type: Number,
  },
  saleOn: { type: Boolean, required: true },
  availabeToPurchaseOn: { type: String, required: true },
  color: {
    type: [String],
    default: [],
  },
  size: {
    type: [String],
    default: [],
  },
  category: {
    type: [String],
    default: [],
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  images: {
    type: [
      {
        url: String,
        alt: String,
      },
    ],
    default: [],
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "ecomusers",
    },
  ],
  postedOn: Date,
  lastUpdated: Date,
};

const porductSchema = mongoose.Schema(productModel);
const Product = mongoose.model("product", porductSchema);
export { Product };
