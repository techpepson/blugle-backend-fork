//define the schema for the user details being extracted from the form
import mongoose from "mongoose";

//defining the schema for the user details
export const userDetails = new mongoose.Schema({
  userFirstName: {
    type: String,
    required: true,
  },
  userLastName: {
    type: String,
    required: true,
  },

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
    required: true,
  },
  userAddress: {
    type: String,
    required: true,
  },
  userRole: {
    type: String,
    default: "patient",
    required: false,
  },
});

