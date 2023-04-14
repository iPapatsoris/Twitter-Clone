import { Retweet, Tweet } from "../entities/tweet.js";
import { User } from "../entities/user.js";
import { NormalResponse } from "./common.js";
import { Thread } from "./tweet.js";

export type CreateUser = {
  request: {
    user: Pick<User, "name" | "username" | "password" | "birthDate" | "email">;
  };
  response: NormalResponse;
};

export type UpdateUser = {
  request: {
    user: Partial<
      Omit<
        User,
        | "username"
        | "password"
        | "joinedDate"
        | "totalFollowers"
        | "totalFollowees"
      >
    >;
  };
  response: NormalResponse<{
    user: UpdateUser["request"];
  }>;
};

export type ExposedUser = Omit<User, "password"> & {
  isFollowedByActiveUser: boolean;
};
export type GetUser<T extends keyof ExposedUser> = {
  response: NormalResponse<{
    user: Pick<ExposedUser, T>;
  }>;
};

export type CreateUserFields = keyof CreateUser["request"];
export type UpdateUserFields = keyof UpdateUser["request"];
export type GetUserFields = keyof ExposedUser;

type MiniUserInfo = Pick<
  User,
  "id" | "username" | "name" | "avatar" | "isVerified" | "bio"
>;

export type GetUserFollowees = {
  response: NormalResponse<{
    followees: MiniUserInfo[];
  }>;
};

export type GetUserFollowers = {
  response: NormalResponse<{
    followers: MiniUserInfo[];
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
