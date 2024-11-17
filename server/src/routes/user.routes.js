import express from "express";
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middelwares/user.middelware.js";

const userRoute = express.Router();
userRoute.route("/register").post(registerUser);
userRoute.route("/login").post(loginUser);
userRoute.route("/currentUser").get(verifyToken, getCurrentUser);
export { userRoute };
