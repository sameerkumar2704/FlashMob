import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError, asyncHandler } from "../util/aysncHandler.js";

const verifyToken = asyncHandler(async (req, res, next) => {
  const acessToken =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer", "");
  if (!acessToken) throw new ApiError("Access Token not Found", 404);
  const decodeToken = jwt.verify(acessToken, process.env.ACCESS_TOKEN_SECRET);
  const user = await User.findById(decodeToken._id);
  if (!user) throw new ApiError("User not found", 404);
  req.user = user;

  next();
});
export { verifyToken };
