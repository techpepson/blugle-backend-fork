import express from "express";
import session from "express-session";
import axios from "axios";
import { User } from "../Model/userDetailsModel.js";
import { connectDB } from "../databases/dbConnect.js";
import { configDotenv } from "dotenv";
import cors from "cors";
import fs from "node:fs";
import https from "node:https";
import path from "path";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { fileURLToPath } from "node:url";
import nodemailer from "nodemailer";

export {
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
};
