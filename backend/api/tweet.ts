import { Tweet } from "../entities/tweet";
import { NormalResponse } from "./common";

export type CreateTweet = {
  request: {
    tweet: Omit<Tweet, "id" | "authorID" | "views" | "creationDate">;
  };
  response: NormalResponse;
};

export type GetUserTweets = {
  response:
    | NormalResponse
    | {
        userTweets: Tweet[];
      };
};

export type CreateTweetFields = keyof CreateTweet["request"]["tweet"];
