import { NormalResponse } from "./common";

export type CreateEmailCode = {
  request: {
    email: string;
  };
  response: NormalResponse<{
    // Normally verification code is delivered to email. Here we just send it
    // back to the client to display it as a hint, for testing purposes
    code: string;
  }>;
};

export type VerifyEmailCode = {
  request: {
    email: string;
    code: string;
  };
  response: NormalResponse<{ codesMatch: boolean }>;
};

export type GetEmail = {
  response: NormalResponse<{
    emailExists: boolean;
  }>;
};
