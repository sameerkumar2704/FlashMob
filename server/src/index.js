import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDB } from "./db/dbConnector.js";
connectDB()
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log("server running at port : " + process.env.PORT)
    );
  })
  .catch((e) => {
    console.log(`DB is not Connected !! : ${e.message}`);
  });
app.on("errror", (err) => {
  console.log("Error OCCUR in Server: ", err);
});

dotenv.config({ path: "./env" });
