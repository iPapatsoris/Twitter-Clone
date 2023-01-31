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

type NestedReplies = {
  nestedReplies: Tweet[];
  hasMoreNestedReplies: boolean;
};
export type TweetWithNestedReplies = Tweet & NestedReplies;

export type GetTweet = {
  response:
    | NormalResponse
    | {
        tweet: Tweet;
        replies: TweetWithNestedReplies[];
        previousReplies: Tweet[];
      };
};

export type ExpandTweetReplies = {
  response: NormalResponse | { replies: NestedReplies };
};

export type CreateTweetFields = keyof CreateTweet["request"]["tweet"];
