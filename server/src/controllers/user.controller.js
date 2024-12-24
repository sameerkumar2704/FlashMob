import e from "express";
import { User } from "../models/user.model.js";
import { ApiError, asyncHandler } from "../util/aysncHandler.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../util/email.js";
import crypto from "crypto";
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, phonenumber } = req.body;

  if (
    [email, username, password, phonenumber].some(
      (field) => field?.trim() === ""
    )
  )
    throw new ApiError("All Fields Are required.", 400);

  const UserExist = await User.findOne({
    $or: [{ email }, { phonenumber }],
  });
  if (UserExist) throw new ApiError("Email or Phone is already in use .", 409);

  let currUser = await User.create({
    username,
    phonenumber,
    email,
    password,
  });
  currUser = await User.findById(currUser._id).select("-password -avatar");

  res.status(200).json({
    status: "success",
  });
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { phonenumber, password, email } = req.body;
  const user = await User.findOne({ $or: [{ phonenumber }, { email }] });
  if (!user) throw new ApiError("user not found", 404);

  const isValidPassword = await user.isPaswordCorrect(password);
  if (!isValidPassword) throw new ApiError("Wrong Password", 404);
  const accesToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  const option = {
    httpOnly: true,
  };
  res
    .status(200)
    .cookie("refreshToken", refreshToken, option)
    .cookie("accessToken", accesToken, option)
    .json({
      status: "success",
      detail: JSON.stringify(user),
    });
});

const getCurrentUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select(
    "-password -createdAt -updatedAt"
  );
  res.json({
    status: "sucess",
    detail: JSON.stringify(user),
  });
});
const resetPassword = asyncHandler(async (req, res) => {
  const token = req.params.token;
  const hashToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetTokenExpire: { $gt: Date.now() },
  });
  if (!user) {
    throw new ApiError(
      "Password reset url is expired or Token is Invalid",
      404
    );
  }
  user.password = req.body.password;
  user.passwordRestToken = undefined;
  user.passwordResetTokenExpire = undefined;
  user.save();
  return res.send({
    sucess: "Success",
    message: "Password is Reset",
  });
});

const forgotPassword = asyncHandler(async (req, res, next) => {
  const email = req.body.email;
  if (!email) throw new ApiError("user id is required", 402);

  const user = await User.findOne({ email });
  if (!user) throw new ApiError("user not found", 404);
  const resetToken = user.createPasswordRestToken();
  await user.save();
  // const resetUrl = `${req.protocol}://${req.get(
  //   "host"
  // )}/user/resetPassword/${resetToken}`;
  const message = `we have recived a password reset request please use below token \n\n${resetToken} this token valid only for 5 minutes`;
  try {
    await sendEmail({
      email: email,
      subject: "Password Change Request",
      message: message,
    });
  } catch (e) {
    user.passwordRestToken = undefined;
    user.passwordResetTokenExpire = undefined;
    user.save();
    throw new ApiError(
      "There was an error in sending password reset email ",
      500
    );
  }

  res.send({
    status: "success",
    messag: "reset token send to register email email",
  });
});
const logoutUser = asyncHandler(async (req, res) => {
  // get access Token and find user from access token
  // set new access Token and refreshToken
  // remove Cookies from user

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: "" },
    },
    { new: true }
  );
  const option = {
    httpOnly: true,
  };
  res
    .status(200)
    .clearCookie("refreshToken", option)
    .clearCookie("accessToken", option)
    .json({
      status: "sucess",
      detail: JSON.stringify(user),
    });
});
const refreshAcessToken = asyncHandler(async (req, res) => {
  const refreshAccessToken = req.cookies?.refreshToken;
  console.log(refreshAccessToken);
  if (!refreshAccessToken) throw new ApiError("Access Token not Found", 404);
  let decodeToken = undefined;

  decodeToken = jwt.verify(
    refreshAccessToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user_obj = await User.findById(decodeToken._id);
  if (!user_obj) throw new ApiError(404, "User not found");
  const accesToken = await user_obj.generateAccessToken();
  const refreshToken = await user_obj.generateRefreshToken();
  user_obj.refreshToken = refreshToken;

  await user_obj.save({ validateBeforeSave: false });
  const option = {
    httpOnly: true,
  };
  res
    .cookie("refreshToken", refreshToken, option)
    .cookie("accessToken", accesToken, option)
    .json({
      status: "success",
      detail: JSON.stringify(user_obj),
    });
});
export {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  refreshAcessToken,
  forgotPassword,
  resetPassword,
};
