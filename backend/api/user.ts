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
  };
  response: Response;
};

export type UserFields = keyof CreateUser["request"];
