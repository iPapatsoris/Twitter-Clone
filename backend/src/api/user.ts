import { Retweet, Tweet } from "../entities/tweet.js";
import { User } from "../entities/user.js";
import { NormalResponse } from "./common.js";
import { Thread } from "./tweet.js";
import { GetUserFields, UpdateUserFields } from "../permissions.js";

export type CreateUser = {
  request: {
    user: Pick<User, "name" | "username" | "password" | "birthDate" | "email">;
  };
  response: NormalResponse;
};

export type UpdateUser<T extends UpdateUserFields> = {
  request: {
    user: Pick<User, T>;
  };
  response: NormalResponse<{
    user: Pick<User, T>;
  }>;
};

export type UserWithExtra = User & {
  isFollowedByActiveUser: boolean;
};

export type GetUser<T extends GetUserFields> = {
  response: NormalResponse<{
    user: Pick<UserWithExtra, T>;
  }>;
};

export type CreateUserFields = keyof CreateUser["request"];

export type GetUserFollowees<T extends GetUserFields> = {
  response: NormalResponse<{
    followees: Array<Pick<UserWithExtra, T>>;
  }>;
};

export type GetUserFollowers<T extends GetUserFields> = {
  response: NormalResponse<{
    followers: Array<Pick<UserWithExtra, T>>;
  }>;
};

export type GetUserThreadsAndRetweets = {
  response: NormalResponse<{
    threadsAndRetweets: Array<{
      thread?: Thread;
      retweet?: Retweet;
    }>;
  }>;
};

export type GetUserTweetsAndRetweets = {
  response: NormalResponse<{
    tweetsAndRetweets: Array<{
      tweet?: Tweet;
      retweet?: Retweet;
    }>;
  }>;
};

export type GetUsernameExists = {
  response: NormalResponse<{ usernameExists: boolean }>;
};

export const charLimits: {
  [K in keyof Required<
    Pick<User, "name" | "bio" | "location" | "website">
  >]: number;
} = {
  name: 50,
  bio: 160,
  location: 30,
  website: 100,
};
