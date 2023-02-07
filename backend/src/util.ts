import mysql, { MysqlError } from "mysql";
import { Query } from "express-serve-static-core";
import { Response } from "express";
import { NormalResponse } from "./api/common.js";
import db from "./connection.js";

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

export const simpleQuery = <T = {}>(
  resp: Response<NormalResponse<T>>,
  query: string,
  queryEscapedValues: any[],
  handleSuccess: (result: any) => void = () => resp.send({ ok: true }),
  handleError: (error: MysqlError) => void = () => resp.send({ ok: false })
) =>
  db.query(query, queryEscapedValues, (error, result) => {
    if (error) {
      printError(error);
      handleError(error);
      return;
    }
    handleSuccess(result);
  });

export const runQuery = <T>(query: string, queryEscapedValues: any[]) =>
  new Promise<T[]>((resolve, reject) => {
    db.query(query, queryEscapedValues, (error, result) => {
      if (error) {
        printError(error);
        reject(error);
        return;
      }
      resolve(result);
    });
  });
