import express from "express";
import {
  forgotPassword,
  getCurrentUser,
  getUserDetails,
  loginUser,
  logoutUser,
  refreshAcessToken,
  registerUser,
  resetPassword,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middelwares/user.middelware.js";

const userRoute = express.Router();
userRoute.route("/").get(verifyToken, getUserDetails);
userRoute.route("/register").post(registerUser);
userRoute.route("/login").post(loginUser);
userRoute.route("/currentUser").get(verifyToken, getCurrentUser);
userRoute.route("/logout").get(verifyToken, logoutUser);
userRoute.route("/refreshToken").get(refreshAcessToken);
userRoute.route("/forgotPassword").post(forgotPassword);
userRoute.route("/resetPassword/:token").patch(resetPassword);
export { userRoute };
