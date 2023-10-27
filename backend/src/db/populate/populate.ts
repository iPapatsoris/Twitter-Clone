/* eslint-disable no-multi-str */
import { populateCircles } from "./populateCircles.js";
import {
  getAllUserIDs,
  populateLikes,
  populateReplies,
  populateRetweets,
  populateTweets,
} from "./populateTweets.js";
import populateUsers from "./populateUsers.js";

export type PopulateOptions = {
  totalUsers: number;
  password: string;
  coverPicCategories: string[];
};

const populateOptions: PopulateOptions = {
  totalUsers: 50,
  password: "12345678",
  coverPicCategories: [
    "animals",
    "city",
    "food",
    "nature",
    "nightlife",
    "sports",
  ],
};

await populateUsers(populateOptions);
const userIDs = await getAllUserIDs();
await populateTweets(userIDs);
await populateReplies(userIDs);
await populateRetweets(userIDs);
await populateLikes(userIDs);
await populateCircles(userIDs);
console.log("Database populating finished");
