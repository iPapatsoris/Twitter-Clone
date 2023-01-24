import { CreateUserFields } from "../../api/user.js";

export const checkPermissions = (
  endpoint: "GetUser" | "UpdateUser",
  fields: string[]
) => {
  let fieldWhitelist: Array<CreateUserFields>;
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
