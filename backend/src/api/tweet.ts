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

export type TweetWithNestedReplies = Tweet & {
  nestedReplies: Tweet[];
  hasMoreNestedReplies: boolean;
};

export type GetTweet = {
  response:
    | NormalResponse
    | {
        tweet: Tweet;
        replies: TweetWithNestedReplies[];
      };
};

export type ExpandTweetReplies = {
  response: NormalResponse | { replies: TweetWithNestedReplies };
};

export type CreateTweetFields = keyof CreateTweet["request"]["tweet"];
