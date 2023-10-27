import { Retweet, Tweet } from "../entities/tweet.js";
import { User } from "../entities/user.js";
import { ExtraQueryFields, NormalResponse } from "./common.js";
import { Thread } from "./tweet.js";
import { GetUserFields, UpdateUserFields } from "../permissions.js";

export type CreateUser = {
  request: {
    user: Pick<User, "name" | "username" | "password" | "birthDate" | "email">;
  };
  response: NormalResponse<{
    user: Pick<User, "avatar" | "name" | "username" | "id">;
  }>;
};

export type UpdateUser<T extends UpdateUserFields> = {
  request: {
    user: Pick<User, T>;
  };
  response: NormalResponse<{
    user: Pick<User, T>;
  }>;
};

// TODO: include this in normal User entity?
export type UserWithExtra = User & {
  isFollowedByActiveUser: boolean;
};

export type UserResponse<T extends GetUserFields> = Pick<
  UserWithExtra,
  Exclude<T, keyof ExtraQueryFields>
>;

export type GetUser<T extends GetUserFields> = {
  response: NormalResponse<{
    user: UserResponse<T>;
  }>;
};

export type CreateUserFields = keyof CreateUser["request"];

export type GetUserFollowees<T extends GetUserFields> = {
  response: NormalResponse<{
    followees: UserResponse<T>[];
  }>;
};

export type GetUserFollowers<T extends GetUserFields> = {
  response: NormalResponse<{
    followers: UserResponse<T>[];
  }>;
};

export type GetUserFolloweeSuggestions<T extends GetUserFields> = {
  response: NormalResponse<{
    followeeSuggestions: UserResponse<T>[];
  }>;
};

export type GetUserThreads = {
  response: NormalResponse<{
    threads: Thread[];
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
    Pick<User, "name" | "username" | "bio" | "location" | "website">
  >]: number;
} = {
  name: 50,
  bio: 160,
  location: 50,
  website: 100,
  username: 15,
};
