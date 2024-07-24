import express from "express";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

const app = express();

app.use(express.json());

configDotenv();

const posts = [
  {
    userName: "Dickson",
    title: "Post 1",
  },
  {
    userName: "Dickson",
    title: "Post 2",
  },
  {
    userName: "Jim",
    title: "Mr.",
  },
];

app.get("/posts", authenticateToken, (req, res) => {
  return res.json(posts.filter((post) => post.userName === req.user.name));
});

app.post("/login", (req, res) => {
  const userName = req.body.userName;
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "1h"});
  //pass access token to the client

  res.json(accessToken);
});

//create middleware function to authenticate token

function authenticateToken(req, res, next) {
  //we are going to get the token from the client's header as
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (token === null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
