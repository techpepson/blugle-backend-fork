import { User } from "../../Model/userDetailsModel.js";
import passport from "passport";
import LocalStrategy from "passport-local";
import bcrypt from "bcrypt";

//create the passport for the signup
passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "userName",
      passwordField: "userPassword",
      passReqToCallback: true,
    },

    async (req, userName, userPassword, done) => {
      try {
        //get user details to make sure the user does not exist in the database
        const getUserDetails = await User.findOne({ userName });
        //encrypt user password for safety
        const genSalt = 10;
        const encryptedPassword = await bcrypt.hash(userPassword, genSalt);
        //get user password
        const getUserPass = getUserDetails.userPassword;
        const comparePassword = await bcrypt.compare(userPassword, getUserPass);
        if (getUserDetails || comparePassword) {
          return done(null, false, { message: "User already exists" });
        }
        //store the user details in the database if the user does not exist
        const {
          userEmail,
          userAddress,
          userPhone,
          userFirstName,
          userLastName,
        } = req.body;

        const saveUserDetails = new User({
          userFirstName,
          userLastName,
          //store encrypted password in the database rather than the original password.
          userPassword: encryptedPassword,
          userEmail,
          userAddress,
          userPhone,
        });
        //save the user details
        await saveUserDetails.save();
        return done(null, saveUserDetails);
      } catch (error) {
        return done(error, false, { message: "Your details cannot be saved" });
      }
    }
  )
);

//sign in passport
passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "userSigninName",
      passwordField: "userSigninPassword",
      passReqToCallback: true,
    },

    async (userSigninName, userSigninPassword, done) => {
      try {
        //get user details from the database
        const user = await User.findOne({ userName: userSigninName });
        //get userPassword
        const userPass = user.userPassword;
        //check if the user is in the database
        if (!user) {
          return done(null, false, {
            message: "The username or password entered is not correct!",
          });
        }
        done(null, user);
        const decryptedPassword = await bcrypt.compare(
          userSigninPassword,
          userPass
        );
        if (decryptedPassword) {
          return done(null, user);
        } else {
          return done(null, false, {
            message: "The username or password entered is not correct!",
          });
        }
      } catch (error) {
        return done(error, false, {
          message: "There was a problem signing you in",
        });
      }
    }
  )
);
