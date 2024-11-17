import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const verifyToken = async (req, res, next) => {
  const acessToken =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer", "");
  if (!acessToken) {
    res.json({ status: "failed", message: "sorry" });
    return;
  }
  const decodeToken = jwt.verify(acessToken, process.env.ACCESS_TOKEN_SECRET);
  const user = await User.findById(decodeToken._id);
  req.user = user;

  next();
};
export { verifyToken };
