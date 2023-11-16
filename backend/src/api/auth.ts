import { User } from "../entities/user";
import { NormalResponse } from "./common";

export type LoginUser = {
  request: {
    user: Pick<User, "password" | "username">;
  };
  response: NormalResponse<{
    user: Pick<User, "username" | "name" | "avatar" | "id">;
  }>;
};
