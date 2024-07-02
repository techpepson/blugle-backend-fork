import express from "express";
import session from "express-session";
import passport from "passport";
import axios from "axios";
import { User } from "./Model/userDetailsModel.js";
import { connectDB } from "./databases/dbConnect.js";
import { configDotenv } from "dotenv";
import "./servers/Auth/passport-auth.js";

configDotenv();

// initialize the express app
const app = express();

// use middleware for data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//initialize the session
app.use(
  session({
    secret: "Blugle-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

//initialize passport
app.use(passport.initialize());

//passport session
app.use(passport.session());

//serialize passport user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//passport deserialization

passport.deserializeUser(async (id, done) => {
  try {
    const user = User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
//port definition

const PORT = process.env.PORT || 4000;

//connect to database
connectDB();

// define routes in the section below

//sign-in get request definition
app.post("/api/login", (req, res, next) => {
  passport.authenticate("local-login", (err, user, _) => {
    if (err) {
      return res.status(500).send("There was an error signing you in");
    }
    if (!user) {
      return res.status(400).send("User does not exist");
    }
    req.login(user, (err) => {
      if (err) {
        return res.status(500).send("There was an error signing you in");
      }
      return res.status(200).send("Sign in is successful");
    });
  })(req, res, next); // Ensure to pass req, res, and next to passport.authenticate
});

//sign-up post request definition
app.post("/api/sign-up", (req, res, next) => {
  passport.authenticate("local-signup", (err, user, _) => {
    if (err) {
      return res.status(500).send("There was an error signing you up");
    }
    if (user) {
      return res.status(400).send("User already exists");
    }
    return res.status(200).send("You have been signed up successfully");
  })(req, res, next); // Ensure to pass req, res, and next to passport.authenticate
});

//sign-out route definition
app.post("/api/logout", (req, res) => {
  //clear passport's session
  req.logout((err) => {
    if (err) {
      res.status(500).send("There was an error signing you out");
    }
    req.session.destroy((err) => {
      if (err) {
        res.status(500).send("There was an error clearing your session");
        res
          .status(400)
          .json({ message: "The requested page cannot be found." });
      }
      res.status(200).send("You have been signed out successfully");
    });
  });
});

//paystack integration route definition

app.post("/paystack/initialize-transaction", async (req, res) => {
  const { amount, email } = req.body;

  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      { amount, email, channels: ["mobile_money", "card"] },
      {
        headers: {
          Authorization: `Bearer sk_test_d510231535ea62d7708835134b7fe472798b8314`,
          "Content-Type": "application/json",
        },
      }
    );

    const payStackResponse = response.data;
    if (payStackResponse.status) {
      res.status(200).json({ data: payStackResponse.data });
    } else {
      res
        .status(400)
        .json({
          message: "Initialization failed",
          data: payStackResponse.data,
        });
    }
  } catch (error) {
    res.status(500).json({
      message: "There was an error processing your request",
      error: error.message,
    });
  }
});

//payment verification path definition

app.get("/paystack/verify/:reference", async (req, res) => {
  const { reference } = req.params;
  try {
    const responseFromFetch = await axios.get(
      `https://api.paystack.co/transaction/verify/:${reference}`,
      {
        headers: {
          Authorization: `Bearer sk_test_d510231535ea62d7708835134b7fe472798b8314`,
        },
      }
    );
    const response = responseFromFetch.data; //return everything in the data returned from the paystack API and clients can filter them as they wish
    if (responseFromFetch.status) {
      res.status(200).json({ data: response.data });
    } else {
      res.status(500).json({ message: "Verification failed", data: response });
    }
  } catch (error) {
    res.status(500).json({
      message: "There was an error processing your request",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log("Server started on port ", PORT);
});
