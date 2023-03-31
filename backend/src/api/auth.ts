import { User } from "../entities/user";
import { NormalResponse } from "./common";

export type LoginUser = {
  request: {
    user: Pick<User, "password" | "email">;
  };
  response: NormalResponse<{
    user: Pick<User, "username" | "name" | "avatar">;
  }>;
};
