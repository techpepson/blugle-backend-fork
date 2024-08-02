import express from "express";
import twilio from "twilio";
import { config as configDotenv } from "dotenv";
import crone from "node-cron";
import { User } from "../Model/userDetailsModel";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
configDotenv();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

//setup message notification to send text messages
const alertClient = async (to, body) => {
  try {
    message = client.messages.create({
      to: to,
      body: body,
    });
    console.log("The message was sent successfully");
  } catch (error) {
    console.error(
      "There was an error sending your message, please try again",
      error
    );
  }
};

//setup cron-job to handle event scheduling

export const scheduleNotification = (hour, day, month, phone) => {
  const cronSchedule = `0 ${hour} ${day} ${month} 0`;
  try {
    crone.schedule(cronSchedule, async () => {
      await alertClient(
        phone,
        "You have an appointment with Blugle Medical Services"
      );
    });
  } catch (error) {
    console, log("An error prevented your email sending", error);
  }
};

//get user details for storage into the database
//Note how we do not make too many detches from the database since that can over-populate the sever. So we create functions and use them dynamically.
// app.post("/api/set-notification", async (req, res) => {
//   const { hour, day, month, phone } = req.body;
//   try {
//     const saveNotificationDetails = new User({ hour, day, month, phone });
//     await saveNotificationDetails.save();
//     scheduleNotification(hour, day, month, phone);
//     res.status(200).send("Congratulations, your setup is successfull");
//   } catch (error) {
//     res.status(501).send("There was an error setting up your notification");
//   }
// });
