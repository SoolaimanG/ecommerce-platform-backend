import express from "express";
import { getAccessToken } from "./helper";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { IUserRole } from "../types"; // Import your IUserRole type

const SECRET = process.env.JWT_SECRET; // Replace with your actual secret key
const TWO_HOURS_IN_SECONDS = 60 * 60 * 2;

// Middleware to allow only authenticated users
export const allowOnlyAuthenticatedUsers = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const accessToken = getAccessToken(req);

  if (!accessToken) {
    return res.status(401).json({ message: "Access token is required" });
  }

  try {
    const { role, userId, userEmail, exp } = verify(
      accessToken,
      SECRET
    ) as JwtPayload; // Ensure JwtPayload is imported from the correct module

    // Calculate the remaining time until expiration
    const currentTime = Date.now() / 1000; // Current time in seconds
    const remainingTime = exp - currentTime;

    // Check if the remaining time is less than 2 hours
    if (remainingTime < TWO_HOURS_IN_SECONDS) {
      // Create a new token
      const newToken = sign(
        { userId, userEmail, role },
        SECRET,
        { expiresIn: "2d" } // Adjust expiration time as needed
      );

      // Set the new token in the response cookie
      res.cookie("access-token", newToken, {
        maxAge: 60 * 60 * 24 * 2 * 1000, // Keep it for 2 days
        httpOnly: true,
      });
    }

    // Attach decoded user information to the request
    req.user = { role, userEmail, userId };
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: "Invalid access token" });
  }
};

// Middleware to allow only admin users
export const allowOnlyAdminsAndSuperUsers = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const user = req.user;

  if (user.role == "user") {
    return res
      .status(403)
      .json({ message: "Access denied. Admins and SuperUsers Only" });
  }

  next(); // Proceed to the next middleware/route handler
};

// Middleware to allow only superusers
export const allowOnlySuperUser = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const user: { role: IUserRole } = req.user;

  if (!user || user.role !== "superuser") {
    return res.status(403).json({ message: "Access denied. Superusers only." });
  }

  next(); // Proceed to the next middleware/route handler
};
