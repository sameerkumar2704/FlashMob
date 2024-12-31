import mongoose from "mongoose";
const connectDB = async () => {
  try {
    const dbref = await mongoose.connect(`${process.env.Mongoose_URL}`);

    console.log(`DB connect and Hosted at -> ${dbref.connection.host}`);
  } catch (error) {
    console.log(`Error in Connecting DB ❌ : ${error.message}`);
  }
};
export { connectDB };
