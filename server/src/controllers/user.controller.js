import { User } from "../models/user.model.js";
import { ApiError, asyncHandler } from "../util/aysncHandler.js";
import jwt from "jsonwebtoken";
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
  try {
    decodeToken = jwt.verify(
      refreshAccessToken,
      process.env.REFRESH_TOKEN_SECRET
    );
  } catch (e) {
    throw new ApiError(404, e.message);
  }

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
};
