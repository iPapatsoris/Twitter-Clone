import { Response } from "./common";

type User = {
  id: number;
  username: string;
  password: string;
  name: string;
  email: string;
  avatar: string;
  coverPic: string;
  isVerified: boolean;
  bio?: string;
  location?: string;
  website?: string;
  birthDate: string;
  joinedDate: string;
  phone: string;
};

export type CreateUser = {
  request: Omit<User, "id">;
  response: Response;
};

export type UpdateUser = {
  request: Partial<Omit<User, "username" | "password" | "joinedDate">>;
  response: Response | UpdateUser["request"];
};

export type GetUser = {
  response: Response | Partial<Omit<User, "password">>;
};

export type CreateUserFields = keyof CreateUser["request"];
export type UpdateUserFields = keyof UpdateUser["request"];
export type GetUserFields = keyof GetUser["response"];
