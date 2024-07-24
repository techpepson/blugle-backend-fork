// import { User } from "../../Model/userDetailsModel.js";
// import passport from "passport";
// import LocalStrategy from "passport-local";
// import bcrypt from "bcrypt";

// //create the passport for the signup
// passport.use(
//   "local",
//   new LocalStrategy.Strategy(
//     {
//       usernameField: "userName",
//       passwordField: "userPassword",
//       passReqToCallback: true,
//     },

//     async (req, userName, userPassword, done) => {
//       try {
//         //get user details to make sure the user does not exist in the database
//         const getUserDetails = await User.findOne({ userName });

//         //encrypt user password for safety
//         const genSalt = 10;
//         const salt = await bcrypt.genSalt(genSalt);
//         const encryptedPassword = await bcrypt.hash(userPassword, salt);
//         //get user password
//         const userPass = getUserDetails?.userPassword;
//         const comparePassword =
//           userPass && (await bcrypt.compare(userPass, encryptedPassword));
//         if (getUserDetails || comparePassword) {
//           return done(null, false, { message: "User already exists" });
//         }

//         //get the user details from the request body
//         // const {
//         //   userFirstName,
//         //   userLastName,
//         //   userEmail,
//         //   userPhone,
//         //   userAddress,
//         // } = req.body;

//         const savedUserDetails = new User({
//           userFirstName: req.body.userFirstName,
//           userLastName: req.body.userLastName,
//           //store encrypted password in the database rather than the original password.
//           userPassword: encryptedPassword,
//           userEmail: req.body.userEmail,
//           userAddress: req.body.userAddress,
//           userPhone: req.body.userPhone,
//           userName,
//           userRole,
//         });
//         //save the user details
//         await savedUserDetails.save();
//         return done(null, savedUserDetails);
//       } catch (error) {
//         return done(error, false, { message: "Your details cannot be saved" });
//       }
//     }
//   )
// );

// //sign in passport
// passport.use(
//   "local-login",
//   new LocalStrategy.Strategy(
//     {
//       usernameField: "userSigninName",
//       passwordField: "userSigninPassword",
//       passReqToCallback: true,
//     },
//     async (req, userSigninName, userSigninPassword, done) => {
//       try {
//         // Get user details from the database
//         const user = await User.findOne({ userName: userSigninName });

//         if (!user) {
//           // User not found
//           return done(null, false, { message: "User not found" });
//         }

//         // Compare the password provided with the one in the database
//         const match = await bcrypt.compare(
//           userSigninPassword,
//           user.userPassword
//         );

//         if (!match) {
//           // Password does not match
//           return done(null, false, { message: "Incorrect password" });
//         }

//         // Return the user to the passport session
//         return done(null, user);
//       } catch (error) {
//         // Error occurred
//         return done(error, false, {
//           message: "There was a problem signing you in",
//         });
//       }
//     }
//   )
// );

// //passport serialization

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (error) {
//     done(error);
//   }
// });
