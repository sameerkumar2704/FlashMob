import { User } from "../models/user.model.js";
import { ApiError, asyncHandler } from "../util/aysncHandler.js";

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
  if (!isValidPassword) throw new ApiError(404, "Wrong Password");
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
      userDetail: JSON.stringify(user),
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
export { registerUser, loginUser, getCurrentUser };
