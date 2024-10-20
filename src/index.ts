import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import session from "express-session";
import { openConnectionPool } from "./helper";
import router from "./router";

const app = express();

// Middleware setup
app.use(cors({ credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(compression());
app.use(
  session({
    secret: process.env.JWT_SECRET!,
    saveUninitialized: true,
    resave: true,
  })
);

// Call the openConnectionPool asynchronously and handle any potential errors
openConnectionPool()
  .then(() => {
    console.log("Database connection established");
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });

// Router setup
app.use("/", router());

// Export the app
module.exports = app;
