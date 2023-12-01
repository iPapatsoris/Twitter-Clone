/* eslint-disable no-multi-str */
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import authRoutes, { authPath } from "./routes/auth.js";
import tweetRoutes from "./routes/tweet.js";
import userRoutes from "./routes/user.js";
import emailRoutes from "./routes/email.js";
import {
  SessionData as SessionDataI,
  checkSession,
} from "./middleware/auth.js";
import { buildURLBase } from "./url.js";
import dotenv from "dotenv";
import path from "path";

// Augment express-session with a custom SessionData object
declare module "express-session" {
  interface SessionData extends SessionDataI {}
}
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });

const serverPort = process.env.VITE_SERVER_PORT;
const clientPortDev = parseInt(process.env.VITE_CLIENT_PORT_DEV!);
const clientPortProd = parseInt(process.env.VITE_CLIENT_PORT_PROD!);
const clientHostname = process.env.VITE_CLIENT_HOSTNAME;

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: [
      buildURLBase({ hostname: clientHostname!, port: clientPortDev }),
      buildURLBase({ hostname: clientHostname!, port: clientPortProd }),
    ],
    credentials: true,
  })
);

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

app.listen(serverPort, () => {
  console.log(`Listening on port ${serverPort}`);
});
