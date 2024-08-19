import { Appointment } from "./databases/Schemas/appointmentSchema.js";
import {
  express,
  session,
  axios,
  User,
  connectDB,
  configDotenv,
  cors,
  fs,
  https,
  path,
  jwt,
  bcrypt,
  fileURLToPath,
  nodemailer,
} from "./global/global-app-export.js";
configDotenv();

// initialize the express app
const app = express();

//define fileName and pathName since they are not defined on ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//define key path separately and join them
// const keyPath = path.join(__dirname, "keys");
// const certPath = path.join(__dirname, "keys");

//server port
const PORT = process.env.PORT || 4000;

const key = fs.readFileSync(path.resolve(process.env.KEY), "utf8");
const cert = fs.readFileSync(path.resolve(process.env.CERTIFICATE), "utf8");

// https keys and certs
const options = {
  key: key,
  cert: cert,
};

//use cors for cross origin resource sharing

//create an https connection using the keys and cert generated
const server = https.createServer(options, app);

// use middleware for data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//cors options
const corsOption = {
  origin: "https://blugle-rcdo.vercel.app", // Remove trailing slash
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Authorization", "Content-Type"], // Ensure you specify the headers if they are custom
  credentials: true, // If you need to send cookies or other credentials
};

//cors definition for project
app.use(cors(corsOption));

//initialize the session
app.use(
  session({
    secret: "Blugle-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

connectDB();

//signup api route definitions using jwt
app.post("/api/signup", async (req, res) => {
  //try-catch block to handle async function
  try {
    //get user details from the frontend
    const {
      userFirstName,
      userLastName,
      userName,
      userPassword,
      userEmail,
      userPhone,
      userAddress,
      userRole,
    } = req.body;
    //encrypt the user password with bcrypt
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const encryptedPassword = await bcrypt.hash(userPassword, salt);

    //check for existing users in the database
    const existingUser = await User.findOne({ userName });
    //conditionally check if existingUser is not null
    if (existingUser) {
      const existingPassword = existingUser.userPassword;
      //compare user password with hashed password
      const equalPasswords = await bcrypt.compare(
        userPassword,
        existingPassword
      );
      if (equalPasswords === true || existingUser.userEmail === userEmail) {
        res.status(200).json({ message: "The request was successfull" });
      }
    }

    //save new users in the database if they are not already in the system
    else {
      const newUser = new User({
        userFirstName,
        userLastName,
        userName,
        userPassword: encryptedPassword,
        userEmail,
        userPhone,
        userAddress,
        userRole,
      });
      //save the newUser data to the database
      await newUser.save();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An internal server error occured." });
  }
});

//token verification function
const verifyToken = (req, res, next) => {
  //token secret for verification
  const jwtTokenSecret = process.env.ACCESS_TOKEN_SECRET;

  //split the header of the request to get the token
  const headerToken = req.headers["Authorization"]?.split(" ")[1];

  if (!headerToken) {
    res.json({ message: "The header token is not provided" });
  }

  //verify jwt token from the client
  jwt.verify(headerToken, jwtTokenSecret, (err) => {
    if (err) {
      res
        .status(400)
        .json("There was an error encountered during the verification", err);
    }
    next();
  });
};

//post request to authenticate user login
app.post("/api/login", async (req, res) => {
  try {
    //extract user credentials from the client sign in page
    const { userEmail, userPassword } = req.body;
    //retrieve the user details from the database for comparison with entered details
    const user = await User.findOne({ userEmail });

    //check if the User object is not empty
    if (user) {
      //compare incoming password with hashed password
      const hashedPassword = user.userPassword;

      const comparePasswords = await bcrypt.compare(
        userPassword,
        hashedPassword
      );

      if (userEmail) {
        //get user email from the database
        const userDatabaseEmail = user.userEmail;
        //get user role
        const role = user.userRole;
        //jwt payload
        const jwtPayLoad = {
          userId: user._id,
          userEmails: userDatabaseEmail,
        };

        //jwt token secret
        const jwtTokenSecret = process.env.ACCESS_TOKEN_SECRET;
        //sign the user details with a jwt key
        jwt.sign(jwtPayLoad, jwtTokenSecret, (err, secretToken) => {
          if (err) {
            res.status(500).json({
              message: "There was an error generating a token for the client",
              err,
            });
          } else {
            console.log(secretToken);
            res.status(200).json({ token: secretToken, userRole: role });
          }
        });
      } else {
        res.status(401).json({ message: "User not in the system" });
      }
      //compare user details to see if it is in the database
      // if (user.userEmail !== userEmail || comparePasswords === false) {
      //   res.json({ message: "The user is not in the system" });
      //   console.log("The user is not in the system");
      // } else {
      //   console.log("Login successful");
      // }
    }
  } catch (error) {
    console.error(error);
  }
});

//handle email submission
app.post("/api/email", (req, res) => {
  const { messageSender, senderEmail, messageSubject, messageBody } = req.body;
  const transporter = nodemailer.createTransport({
    pool: true,
    service: "Gmail",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  try {
    const mailOptions = {
      from: messageSender,
      to: process.env.EMAIL_ADDRESS,
      subject: messageSubject,
      text: messageBody,
    };

    //send email to the recipient using nodemailer
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        res
          .status(500)
          .json({ message: "An error occured while sending the email", err });
      }
      res.status(200).json({ message: "Email sent successfully", info });
    });
  } catch (error) {
    console.error(error);
  }
});

//get request to retrieve all appointments
app.get("/api/appointments", async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).send("Error retrieving appointments");
  }
});

// Route to handle appointment bookings
app.post("/api/book-appointment", async (req, res) => {
  const {
    fullName,
    email,
    phone,
    appointmentDate,
    appointmentTime,
    reason,
    doctorSelected,
  } = req.body;

  try {
    const newAppointment = new Appointment({
      fullName,
      email,
      phone,
      appointmentDate,
      appointmentTime,
      reason,
      doctorSelected,
    });

    await newAppointment.save();
    res.status(201).send("Appointment booked successfully");
  } catch (error) {
    res.status(500).send("Error booking appointment");
  }
});

//get users in the system
app.get("/api/get-users", async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    if (users && users.length > 0) {
      // Filter users by userRole
      const filteredUsers = users.filter((user) => user.userRole === "patient");

      if (filteredUsers.length > 0) {
        res.status(200).json({ users: filteredUsers });
        console.log("Users retrieved successfully");
      } else {
        res.status(404).json({ message: "No patients found." });
      }
    } else {
      res.status(404).json({ message: "No users found" });
    }
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ message: "An internal server error occurred." });
  }
});
//get apppointments in the system
app.get("/api/get-appointments", async (req, res) => {
  try {
    const users = await Appointment.find(); // Fetch all users
    res.json({ users });
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ message: "An internal server error occurred." });
  }
});

// paystack integration route definition
app.post("/api/payment-initialize", async (req, res) => {
  const { userAmount, email } = req.body;
  const amount = userAmount * 100;

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

    const payStackResponse = response.data.reference;
    const authorizationUrl = payStackResponse.authorization_url;
    if (payStackResponse.status) {
      res.status(200).json(payStackResponse, authorizationUrl);
    } else {
      res.status(400).json({
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
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer sk_test_d510231535ea62d7708835134b7fe472798b8314`,
        },
      }
    );

    const response = responseFromFetch.message;
    if (responseFromFetch.status === true) {
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

//server port
server.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
