import { Tweet } from "../entities/tweet.js";
import {
  NormalResponse,
  PaginationQueryParamsBackEnd,
  ResponseWithPagination,
} from "./common";
import { GetUserTweetsAndRetweets } from "./user.js";

export type CreateTweetFields = keyof CreateTweet["request"]["tweet"];
export type CreateTweet = {
  request: {
    tweet: Pick<Tweet, "text" | "isReply" | "referencedTweetID">;
  };
  response: NormalResponse<{ tweet: Tweet }>;
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

export type GetTimeline = {
  requestQueryParams: PaginationQueryParamsBackEnd;
  response: ResponseWithPagination<
    GetUserTweetsAndRetweets["response"]["data"]
  >;
};
export type SingleTweetResponse = NormalResponse<Tweet>;

export type GetTrends = {
  response: NormalResponse<{
    trends: Trend[];
  }>;
};

export type Trend = {
  trend: string;
  category?: string;
  tweets: number;
};

export const getTweetParams = ["noThread"] as const;
export type GetTweetParams = (typeof getTweetParams)[number];

export const tweetCharLimit = 280;
