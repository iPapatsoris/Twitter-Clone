import { Response } from "./common";
export type CreateUser = {
  request: {
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
  response: Response;
};

export type UpdateUser = {
  request: Omit<CreateUser["request"], "username" | "password" | "joinedDate">;
  response: Response;
};

export type GetUser = {
  response: Response | Partial<UserFields>;
};

export type UserFields = keyof CreateUser["request"];
