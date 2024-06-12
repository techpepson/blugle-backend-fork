import express from "express";
import session from "express-session";
import passport from "passport";
import csurf from "csurf";
import bcrypt from "bcrypt";
import User from "./databases/Schemas/userDetailsSchema.js";
import connectDB from "./databases/dbConnect.js";

// initialize the express app
const app = express();

// use middleware for data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//port definition

// const PORT = process.env.PORT || 4000;

//connect to database
connectDB();

// define routes in this section
app.post("/api/post-user-details", async (req, res) => {
  try {
    // destructure the details of the body of the incoming form
    const { userName, userEmail, userPassword } = req.body;

    const hashedPassword = await bcrypt.hash(userPassword, 10);
    const saveUser = new User({
      userName,
      userEmail,
      userPassword: hashedPassword,
      userRole,
    });
    res.send("Your connection is seen");
    // save the user details to the database
    await saveUser.save();
  } catch (error) {
    //error handling definition
    console.log(error);
  }
});

app.listen(5000, () => {
  console.log("Server started on port ", 5000);
});
