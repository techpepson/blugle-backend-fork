import express from "express";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

const app = express();

app.use(express.json());

configDotenv();

app.post("/login", (req, res) => {
  const userName = req.body.userName;
  const user = { name: userName };
  const accessToken = generateAccessToken(user)
  //pass access token to the client

  res.json(accessToken);
});

//function to generate accessToken

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
}

app.listen(4000, () => {
  console.log("Server started on port 4000");
});
