// import express from "express";
// import session from "express-session";
// import passport from "passport";
// import axios from "axios";
// import { User } from "./Model/userDetailsModel.js";
// import { connectDB } from "./databases/dbConnect.js";
// import { configDotenv } from "dotenv";
// import "./servers/Auth/passport-auth.js";
// import cors from "cors";
// import fs from "node:fs";
// import https from "node:https";
// import path from "path";
// import { fileURLToPath } from "node:url";
// import LocalStrategy from "passport-local";
// configDotenv();

// // initialize the express app
// const app = express();

// //define fileName and pathName since they are not defined on ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// //define key path separately and join them
// const keyPath = path.join(__dirname, "keys", "private.key");
// const certPath = path.join(__dirname, "keys", "cert.pem");
// const PORT = process.env.PORT || 4000;
// //key and cert
// const keys = fs.readFileSync(keyPath, "utf-8");
// const certs = fs.readFileSync(certPath, "utf-8");

// // https keys and certs
// const options = {
//   key: keys,
//   cert: certs,
// };

// //create an https connection using the keys and cert generated
// const server = https.createServer(options, app);

// // use middleware for data parsing
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// //cors definition for project
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//   })
// );

// //initialize the session
// app.use(
//   session({
//     secret: "Blugle-secret",
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: false },
//   })
// );

// //initialize passport
// app.use(passport.initialize());
// app.use(passport.session());

// //serialize passport user
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// //passport deserialization
// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (error) {
//     done(error);
//   }
// });

// //connect to database
// connectDB();

// // define routes in the section below

// //sign-in post request definition
// app.post("/api/login", (req, res, next) => {
//   passport.authenticate("local-login", (err, user, info) => {
//     if (err) {
//       return res
//         .status(500)
//         .json({ message: "There was an error signing you in" });
//     }
//     if (!user) {
//       return res.json({ message: "User not found" });
//     }
//     req.login(user, (err) => {
//       if (err) {
//         return res
//           .status(500)
//           .json({ message: "There was an error signing you in" });
//       }
//       return res.status(200).redirect("/");
//     });
//   })(req, res, next); // Ensure to pass req, res, and next to passport.authenticate
// });

// //sign-up post request definition
// app.post("/api/sign-up", async (req, res, next) => {
//   const {
//     userFirstName,
//     userLastName,
//     userName,
//     userPassword,
//     userEmail,
//     userPhone,
//     userAddress,
//   } = req.body;

//   if (
//     !userFirstName ||
//     !userLastName ||
//     !userName ||
//     !userPassword ||
//     !userEmail ||
//     !userPhone ||
//     !userAddress
//   ) {
//     return res.json({ message: "All fields are required" });
//   }

//   // passport.use(
//   //   "local-signup",
//   //   new LocalStrategy(
//   //     {
//   //       usernameField: "userName",
//   //       passwordField: "userPassword",
//   //       passReqToCallback: true,
//   //     },

//   //     async (req, userName, userPassword, done) => {
//   //       try {
//   //         //get user details to make sure the user does not exist in the database
//   //         const getUserDetails = await User.findOne({ userName });

//   //         //encrypt user password for safety
//   //         const genSalt = 10;
//   //         const salt = await bcrypt.genSalt(genSalt);
//   //         const encryptedPassword = await bcrypt.hash(userPassword, salt);
//   //         //get user password
//   //         const userPass = getUserDetails?.userPassword;
//   //         const comparePassword =
//   //           userPass && (await bcrypt.compare(userPass, encryptedPassword));
//   //         if (getUserDetails || comparePassword) {
//   //           return done(null, false, { message: "User already exists" });
//   //         }

//   //         //get the user details from the request body
//   //         // const {
//   //         //   userFirstName,
//   //         //   userLastName,
//   //         //   userEmail,
//   //         //   userPhone,
//   //         //   userAddress,
//   //         // } = req.body;

//   //         const savedUserDetails = new User({
//   //           userFirstName: req.body.userFirstName,
//   //           userLastName: req.body.userLastName,
//   //           //store encrypted password in the database rather than the original password.
//   //           userPassword: encryptedPassword,
//   //           userEmail: req.body.userEmail,
//   //           userAddress: req.body.userAddress,
//   //           userPhone: req.body.userPhone,
//   //           userName,
//   //           userRole,
//   //         });
//   //         //save the user details
//   //         await savedUserDetails.save();
//   //         return done(null, savedUserDetails);
//   //       } catch (error) {
//   //         return done(error, false, {
//   //           message: "Your details cannot be saved",
//   //         });
//   //       }
//   //     }
//   //   )
//   // );
//   try {
//     const existingUser = await User.findOne({ userName });
//     if (existingUser.userEmail || existingUser.userPassword) {
//       return res.send("User already exists");
//     }

//     const newUser = new User({
//       userFirstName,
//       userLastName,
//       userName,
//       userPassword,
//       userEmail,
//       userPhone,
//       userAddress,
//     });

//     await newUser.save();

//     passport.authenticate("local", (err, user, info) => {
//       if (err) {
//         return res.status(500).json(info);
//       }
//       if (user) {
//         return res.status(200).json({
//           message: `${user.userFirstName} has signed up successfully`,
//         });
//       } else {
//         if (!user) {
//           res.send("The user was not created.");
//         }
//       }
//     })(req, res, next); // Ensure to pass req, res, and next to passport.authenticate
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// });

// //sign-out route definition
// app.get("/api/logout", (req, res) => {
//   req.logout((err) => {
//     if (err) {
//       return res
//         .status(500)
//         .json({ message: "There was an error signing you out" });
//     }
//     req.session.destroy((err) => {
//       if (err) {
//         return res
//           .status(500)
//           .json({ message: "There was an error clearing your session" });
//       }
//       return res
//         .status(200)
//         .json({ message: "You have been signed out successfully" });
//     });
//   });
// });

// //paystack integration route definition
// app.post("/paystack/initialize-transaction", async (req, res) => {
//   const { amount, email } = req.body;

//   try {
//     const response = await axios.post(
//       "https://api.paystack.co/transaction/initialize",
//       { amount, email, channels: ["mobile_money", "card"] },
//       {
//         headers: {
//           Authorization: `Bearer sk_test_d510231535ea62d7708835134b7fe472798b8314`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const payStackResponse = response.data;
//     if (payStackResponse.status) {
//       res.status(200).json({ data: payStackResponse.data });
//     } else {
//       res.status(400).json({
//         message: "Initialization failed",
//         data: payStackResponse.data,
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       message: "There was an error processing your request",
//       error: error.message,
//     });
//   }
// });

// //payment verification path definition
// app.get("/paystack/verify/:reference", async (req, res) => {
//   const { reference } = req.params;
//   try {
//     const responseFromFetch = await axios.get(
//       `https://api.paystack.co/transaction/verify/${reference}`,
//       {
//         headers: {
//           Authorization: `Bearer sk_test_d510231535ea62d7708835134b7fe472798b8314`,
//         },
//       }
//     );

//     const response = responseFromFetch.data;
//     if (responseFromFetch.status) {
//       res.status(200).json({ data: response.data });
//     } else {
//       res.status(500).json({ message: "Verification failed", data: response });
//     }
//   } catch (error) {
//     res.status(500).json({
//       message: "There was an error processing your request",
//       error: error.message,
//     });
//   }
// });

// app.listen(PORT, () => {
//   console.log("Server started on port ", PORT);
// });
