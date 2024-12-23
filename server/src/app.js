import express from "express";
import { userRoute } from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import { errorController } from "./controllers/error.controller.js";
import { productRoute } from "./routes/product.routes.js";
import { cartRouter } from "./routes/cart.routes.js";

import { verifyToken } from "./middelwares/user.middelware.js";
const app = express();

app.use("/", (_, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173"); // Replace with your frontend URL
  res.header("Access-Control-Allow-Credentials", "true"); // Allow credentials
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Allow Content-Type and other headers
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(errorController);
app.use("/users", userRoute);
app.use("/product", productRoute);
app.use("/cart", cartRouter);
export { app };
