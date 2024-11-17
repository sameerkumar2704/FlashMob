import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userModel = {
  username: { type: String, required: true },
  password: { type: String, required: true },
  phonenumber: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
};
const userSchema = mongoose.Schema(userModel, { timestamps: true });
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.isPaswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
const User = mongoose.model("ecomuser", userSchema);

export { User };
