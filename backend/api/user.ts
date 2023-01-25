import { User } from "../entities/user";
import { Response } from "./common";

export type CreateUser = {
  request: Omit<User, "id" | "totalFollowers" | "totalFollowees">;
  response: Response;
};

export type UpdateUser = {
  request: Partial<
    Omit<
      User,
      | "username"
      | "password"
      | "joinedDate"
      | "totalFollowers"
      | "totalFollowees"
    >
  >;
  response:
    | Response
    | {
        user: UpdateUser["request"];
      };
};

export type GetUser = {
  response: Response & Partial<Omit<User, "password">>;
};

export type CreateUserFields = keyof CreateUser["request"];
export type UpdateUserFields = keyof UpdateUser["request"];
export type GetUserFields = keyof GetUser["response"];

type MiniUserInfo = Pick<
  User,
  "id" | "username" | "name" | "avatar" | "isVerified" | "bio"
>;

export type GetUserFollowees = {
  response:
    | Response
    | {
        followees: MiniUserInfo[];
      };
};

export type GetUserFollowers = {
  response:
    | Response
    | {
        followers: MiniUserInfo[];
      };
};
