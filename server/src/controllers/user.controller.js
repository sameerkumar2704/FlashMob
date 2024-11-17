import { User } from "../models/user.model.js";

const registerUser = async (req, res) => {
  const { username, email, password, phonenumber } = req.body;

  if (
    [email, username, password, phonenumber].some(
      (field) => field?.trim() === ""
    )
  ) {
    res.status(400).json({
      status: "failed",
      message: "All Fields Are required.",
    });
    return;
  }

  const UserExist = await User.findOne({
    $or: [{ email }, { phonenumber }],
  });
  if (UserExist) {
    res.status(409).json({
      status: "failed",
      message: "Email or Phone is already in use .",
    });
    return;
  }

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
};

const loginUser = async (req, res, next) => {
  const { phonenumber, password, email } = req.body;
  const user = await User.findOne({ $or: [{ phonenumber }, { email }] });
  if (!user) {
    res.json({ status: "failed", message: "user not found" });
    return;
  }

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
};

const getCurrentUser = async (req, res, next) => {
  const user = await User.findById(req.user._id).select(
    "-password -createdAt -updatedAt"
  );
  res.json({
    status: "sucess",
    detail: JSON.stringify(user),
  });
};
export { registerUser, loginUser, getCurrentUser };
