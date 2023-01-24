import { MysqlError } from "mysql";
import { Query } from "express-serve-static-core";
import { UserFields } from "./user";

export const printError = (error: MysqlError) => {
  console.log(error.code + "\n" + error.sqlMessage + "\n" + error.sql + "\n");
};

export interface TypedRequestQuery<P, Q extends Query> extends Express.Request {
  query: Q;
  params: P;
}

export const filterResults = (filter: string[], res: any) => {
  const filtered: any = {};
  for (const fieldName of filter) {
    filtered[fieldName] = res[fieldName];
  }
  return filtered;
};

export const checkPermissions = (endpoint: "GetUser", fields: string[]) => {
  let fieldWhitelist: Array<UserFields>;
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
  }

  return fields.every((f) => fieldWhitelist.findIndex((w) => w === f) !== -1);
};
