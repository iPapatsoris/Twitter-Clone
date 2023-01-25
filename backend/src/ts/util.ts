import mysql from "mysql";
import { Query } from "express-serve-static-core";
import { Response } from "express";
import { Response as NormalResponse } from "../../api/common.js";

export interface TypedRequestQuery<P, Q extends Query = {}, B = {}>
  extends Express.Request {
  query: Q;
  params: P;
  body: B;
}

export type Fields<T> = {
  fields: T[];
};

export const printError = (error: mysql.MysqlError) => {
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

// Remove specific fields from an array if they exist, and return the ones
// removed in a new array
export const removeArrayFields = <T>(array: T[], fields: T[]) => {
  const removed: T[] = [];
  for (const field of fields) {
    const index = array.findIndex((element) => element === field);
    if (index !== -1) {
      array.splice(index, 1);
      removed.push(field);
    }
  }

  return removed;
};

export const simpleQuery = <T>(
  db: mysql.Connection,
  res: Response<T | NormalResponse>,
  query: string,
  values: any[],
  sendResponse: (result: any) => void = () => res.send({ ok: true })
) =>
  db.query(query, values, (err, result) => {
    if (err) {
      printError(err);
      res.send({ ok: false });
      return;
    }
    console.log(result);
    console.log({ ...result });
    sendResponse(result);
  });

export const simpleQueryArray = (
  db: mysql.Connection,
  res: Response<any>,
  query: string,
  values: any[]
) =>
  db.query(query, values, (err, result) => {
    if (err) {
      printError(err);
      res.send({ ok: false });
      return;
    }
    res.send({ ok: true, users: result });
  });
