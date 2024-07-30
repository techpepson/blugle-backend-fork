//establish a mongodb connection below
import mongoose from "mongoose";
import { configDotenv } from "dotenv";

//set dotenv config
configDotenv();

//connectionString defined  here
const uri = process.env.PRODUCTION_CONNECTION_STRING;

//async function to connect to the database
export const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      tls: false,
    });
    console.log("Connection to the database was successfull");
  } catch (error) {
    console.log("Error connecting to the database", error);
    process.exit(1);
  }
};
