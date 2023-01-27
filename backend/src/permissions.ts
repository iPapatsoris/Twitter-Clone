import { GetUserFields, UpdateUserFields } from "./api/user.js";

// TODO: Add more specific type safety than Union
export const checkPermissions = (
  endpoint: "GetUser" | "UpdateUser",
  fields: string[]
) => {
  let fieldWhitelist: Array<GetUserFields | UpdateUserFields>;
  if (endpoint === "GetUser") {
    fieldWhitelist = [
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
    ];
  } else if (endpoint === "UpdateUser") {
    fieldWhitelist = [
      "name",
      "avatar",
      "coverPic",
      "isVerified",
      "bio",
      "location",
      "website",
      "birthDate",
      "email",
    ];
  }

  return fields.every((f) => fieldWhitelist.findIndex((w) => w === f) !== -1);
};
