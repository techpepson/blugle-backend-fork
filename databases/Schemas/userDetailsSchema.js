//define the schema for the user details being extracted from the form
import mongoose from "mongoose";

//defining the schema for the user details
const userDetailsS = mongoose.Schema(
  {
    userName: String,
    userPassword: Number || String,
    userEmail: String,
    userRole: String,
  },
  { Collection: "user-details" }
);

//creating a model for the schema
const User = mongoose.model("User", userDetailsS);

export default User;
