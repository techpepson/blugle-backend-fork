//define the schema for the user details being extracted from the form
import mongoose from "mongoose";

//defining the schema for the user details
export const userDetails = new mongoose.Schema({
  userFirstName: {
    type: String,
    required: false,
  },
  userLastName: {
    type: String,
    required: false,
  },

  userName: {
    type: String,
    required: false,
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
    required: false,
  },
  userRole: {
    type: String,
    default: "patient",
    required: false,
  },
});

