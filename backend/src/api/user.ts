import { Retweet, Tweet } from "../entities/tweet.js";
import { User } from "../entities/user.js";
import { NormalResponse } from "./common.js";
import { NestedReplies } from "./tweet.js";

export type CreateUser = {
  request: {
    user: Omit<User, "id" | "totalFollowers" | "totalFollowees">;
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
  response:
    | NormalResponse
    | {
        user: UpdateUser["request"];
      };
};

type GetUserParams = Partial<Omit<User, "password">>;
export type GetUser = {
  response:
    | NormalResponse
    | {
        user: GetUserParams;
      };
};

export type CreateUserFields = keyof CreateUser["request"];
export type UpdateUserFields = keyof UpdateUser["request"];
export type GetUserFields = keyof GetUserParams;

type MiniUserInfo = Pick<
  User,
  "id" | "username" | "name" | "avatar" | "isVerified" | "bio"
>;

export type GetUserFollowees = {
  response:
    | NormalResponse
    | {
        followees: MiniUserInfo[];
      };
};

export type GetUserFollowers = {
  response:
    | NormalResponse
    | {
        followers: MiniUserInfo[];
      };
};

export type GetUserRepliesAndRetweets = {
  response:
    | NormalResponse & {
        repliesAndRetweets?: Array<{
          reply?: NestedReplies;
          retweet?: Retweet;
        }>;
      };
};
