import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.DB_URL}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
