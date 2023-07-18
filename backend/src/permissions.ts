import { ExtraQueryFields, extraQueryFields } from "./api/common.js";
import { UserWithExtra } from "./api/user.js";
import { User } from "./entities/user.js";

const getUserFieldWhitelist = [
  "id",
  "username",
  "name",
  "avatar",
  "coverPic",
  "isVerified",
  "bio",
  "location",
  "website",
  "birthDate",
  "joinedDate",
  "email",
  "phone",
  "totalFollowees",
  "totalFollowers",
  "totalTweets",
  "isFollowedByActiveUser",
  ...extraQueryFields,
] as const satisfies Readonly<Array<keyof (UserWithExtra & ExtraQueryFields)>>;

const updateUserFieldWhitelist = [
  "name",
  "avatar",
  "coverPic",
  "bio",
  "location",
  "website",
  "birthDate",
] as const satisfies Readonly<Array<keyof User>>;

export type GetUserFields = (typeof getUserFieldWhitelist)[number];
export type UpdateUserFields = (typeof updateUserFieldWhitelist)[number];

export const checkPermissions = (
  endpoint: "GetUser" | "UpdateUser",
  fields: string[]
) => {
  let fieldWhitelist:
    | typeof getUserFieldWhitelist
    | typeof updateUserFieldWhitelist;

  if (endpoint === "GetUser") {
    fieldWhitelist = getUserFieldWhitelist;
  } else if (endpoint === "UpdateUser") {
    fieldWhitelist = updateUserFieldWhitelist;
  }

  return fields.every((f) => fieldWhitelist.findIndex((w) => w === f) !== -1);
};
