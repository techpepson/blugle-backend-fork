//define the schema for the user details being extracted from the form
import mongoose from "mongoose";

//defining the schema for the user details
export const userDetails = mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    userPassword: {
      type: String || Number,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    userPhone: {
      type: Number,
      required: false,
    },
    userAddress: {
      type: String,
      required: true,
    },
    userRole: {
      type: String,
      default: "user",
    },
  },
  { Collection: "user-details" }
);
