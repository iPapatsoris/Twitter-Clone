import { Tweet } from "../entities/tweet.js";
import { NormalResponse } from "./common";

export type CreateTweet = {
  request: {
    tweet: Omit<Tweet, "id" | "authorID" | "views" | "creationDate">;
  };
  response: NormalResponse;
};

export type GetTweets = {
  response:
    | NormalResponse
    | {
        tweets: Tweet[];
      };
};

export type CreateTweetFields = keyof CreateTweet["request"]["tweet"];
