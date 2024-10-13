import http from "http";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import session from "express-session";

import { openConnectionPool } from "./helper";
import router from "./router";

const app = express();
const PORT = 3000;

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

// Routing
app.use("/api/v1/", router());

const server = http.createServer(app);

server.listen(PORT, async () => {
  await openConnectionPool();
  console.log(`Server running on ${process.env.DOMAIN || ""}`);
});
