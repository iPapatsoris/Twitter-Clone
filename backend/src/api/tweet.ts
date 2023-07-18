import { Tweet } from "../entities/tweet.js";
import { NormalResponse } from "./common";

export type CreateTweetFields = keyof CreateTweet["request"]["tweet"];
export type CreateTweet = {
  request: {
    tweet: Omit<Tweet, "id" | "authorID" | "views" | "creationDate">;
  };
  response: NormalResponse;
};

export type GetTweets = {
  response: NormalResponse<{
    tweets: Tweet[];
  }>;
};

export type Thread = {
  hasMoreNestedReplies: boolean;
  tweets: Tweet[];
};

export type GetTweet = {
  response: NormalResponse<{
    tweet: Tweet;
    replies: Thread[];
    previousReplies: Tweet[];
  }>;
};

export type ExpandTweetReplies = {
  response: NormalResponse<{ replies: Tweet[] }>;
};

export type LikeTweet = {
  response: NormalResponse<Tweet>;
};

export const getTweetParams = ["noThread"] as const;
export type GetTweetParams = (typeof getTweetParams)[number];
