import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import session from "express-session";
import { openConnectionPool } from "./helper";
import router from "./router";

// Initialize the server
const server = express();

// Middleware setup
server.use(cors({ credentials: true }));
server.use(bodyParser.json());
server.use(cookieParser());
server.use(compression());
server.use(
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
server.use("/", router());

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export the server
export default server;
