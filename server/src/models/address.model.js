import mongoose, { Schema } from "mongoose";
const addressModel = {
  address: [
    {
      houseNo: { type: String, required: true },
      zipcode: { type: String, required: true },
      state: { type: String, required: true },
      city: { type: String, required: true },
      street: { type: String, require: true },
      isDefault: { type: Boolean, default: false },
    },
  ],
  user: { type: Schema.Types.ObjectId, ref: "addresss" },
};
const addressSchema = mongoose.Schema(addressModel, { timestamps: true });
// addressSchema.methods.updateAddress = async function (updateAddress) {
//   if (updateAddress) {
//     this.address = updateAddress;
//     return await this.save();
//   } else {
//     throw new Error("No address provided.");
//   }
// }; // getting error related MaxListeners
const address = mongoose.model("address", addressSchema);
export { address };
