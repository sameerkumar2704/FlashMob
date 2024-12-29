import express from "express";
import { verifyToken } from "../middelwares/user.middelware.js";
import {
  addingNewAddress,
  getAddress,
  updateAddress,
} from "../controllers/address.controller.js";
const addressRouter = express.Router();
addressRouter.route("/add").post(verifyToken, addingNewAddress);
addressRouter
  .route("/")
  .get(verifyToken, getAddress)
  .post(verifyToken, updateAddress);

export { addressRouter };