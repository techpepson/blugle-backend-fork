//establish a mongodb connection below
import mongoose from "mongoose";
import dotenv from "dotenv";

//connectionString defined  here
const uri = "mongodb://localhost:27017/Blugle-data";

//set dotenv config
dotenv.config();

//async function to connect to the database
const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      tls: false,
    });
    console.log("Connection to the database was successful");
  } catch (error) {
    console.log("Error connecting to the database", error);
    process.exit(1)
  }
};

export default connectDB;
