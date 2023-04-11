/* eslint-disable no-multi-str */
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import authRoutes, { authPath } from "./routes/auth.js";
import tweetRoutes from "./routes/tweet.js";
import userRoutes from "./routes/user.js";
import emailRoutes from "./routes/email.js";
import dotenv from "dotenv";
import { checkSession } from "./middleware/auth.js";

// Augment express-session with a custom SessionData object
declare module "express-session" {
  interface SessionData {
    isLoggedIn: boolean;
    userID: number;
  }
}
dotenv.config();

const port = process.env.SERVER_PORT;
const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: process.env.CLIENT_DOMAIN, credentials: true }));

export const cookieName = "session";

app.use(
  session({
    name: cookieName,
    secret: process.env.SECRET_KEY as string,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, sameSite: "lax" },
  })
);
// TODO: remove when auth is implemented
export const currentUserID = 1;

/**
 *
 * Disclaimer: This is a quick and simplified back-end mainly made to support
 * the front-end work, and does not necessarily follow correct guidelines for
 * security, performance, maintainability and structure for back-end apps.
 *
 * TODO: auth and secure routes
 */

app.use(checkSession);
app.use(authPath, authRoutes);
app.use("/user/", userRoutes);
app.use("/tweet/", tweetRoutes);
app.use("/email/", emailRoutes);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
