import express from "express";
import { userRoute } from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import { errorController } from "./controllers/error.controller.js";
import { productRoute } from "./routes/product.routes.js";
import { cartRouter } from "./routes/cart.routes.js";
import { addressRouter } from "./routes/address.routes.js";
import { orderRouter } from "./routes/order.routes.js";
const app = express();

app.use("/", (_, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://ec2-16-171-29-86.eu-north-1.compute.amazonaws.com:8080"
  ); // Replace with your frontend URL
  res.header("Access-Control-Allow-Credentials", "true"); // Allow credentials
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Allow Content-Type and other headers
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/users", userRoute);
app.use("/product", productRoute);
app.use("/cart", cartRouter);
app.use("/address", addressRouter);
app.use("/orders", orderRouter);
app.use(errorController);
export { app };
