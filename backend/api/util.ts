import { MysqlError } from "mysql";
import { Query } from "express-serve-static-core";

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
