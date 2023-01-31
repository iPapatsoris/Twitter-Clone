/* eslint-disable no-multi-str */
import express from "express";
import bodyParser from "body-parser";
import tweetRoutes from "./routes/tweet.js";
import userRoutes from "./routes/user.js";

const port = 3000;
const app = express();
app.use(bodyParser.json());
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

app.use("/user/", userRoutes);
app.use("/tweet/", tweetRoutes);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
