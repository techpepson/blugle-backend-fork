import mongoose from "mongoose";
import { userDetails } from "../databases/Schemas/userDetailsSchema.js";

//creating a model for the schema
export const User = mongoose.model("user", userDetails);
