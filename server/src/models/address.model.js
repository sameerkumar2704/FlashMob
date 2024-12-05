import mongoose, { Schema } from "mongoose";
const addressModel = {
  houseNo: { type: String, required: true },
  phoneNo: { type: String, required: true },
  pincode: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "addresss" },
};
const addressSchema = mongoose.Schema(addressModel, { timestamps: true });
const address = mongoose.model("address", addressSchema);
export { address };
