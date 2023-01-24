import { MysqlError } from "mysql";
import { Query } from "express-serve-static-core";

export interface TypedRequestQuery<P, Q extends Query, B = {}>
  extends Express.Request {
  query: Q;
  params: P;
  body: B;
}

export type Fields<T> = {
  fields: T[];
};

export const printError = (error: MysqlError) => {
  console.log(error.code + "\n" + error.sqlMessage + "\n" + error.sql + "\n");
};

export const filterResults = (filter: string[], res: any) => {
  const filtered: any = {};
  for (const fieldName of filter) {
    filtered[fieldName] = res[fieldName];
  }
  return filtered;
};

export const isEmptyObject = (obj: Object) =>
  obj &&
  Object.keys(obj).length === 0 &&
  Object.getPrototypeOf(obj) === Object.prototype;
