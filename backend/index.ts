/* eslint-disable no-multi-str */
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import mysql from "mysql";
import { sha256 } from "js-sha256";
import { CreateUser, GetUser, UpdateUser, UserFields } from "./api/user";
import ErrorCodes from "./api/errorCodes.js";
import {
  checkPermissions,
  filterResults,
  printError,
  TypedRequestQuery,
} from "./api/util.js";
import { Fields } from "./api/common";

const app = express();
const port = 3000;
const host = "localhost";
const user = "root";
const database = "twitter";

const con = mysql.createConnection({
  host,
  user,
  database,
});

app.use(bodyParser.json());

con.connect((err) => {
  if (err) throw err;
  console.log("Connected!");
});

/**
 *
 * Disclaimer: This is a quick and simplified back-end mainly made to support
 * the front-end work, and does not necessarily follow correct guidelines for
 * security, performance and maintainability.
 *
 * GET requests can include "fields" query params to request only specific
 * fields from an entity.
 *
 * TODO:
 *  - Make SQL queries also take into account the filters; currently
 *    all fields are selected, and the filters apply only for the response
 *    over the network.
 *  - Secure endpoints; currently all users can see and modify private data,
 *    including data of others, or data that they own but should not be exposed
 *    outside of the database.
 */

app.post(
  "/user",
  (
    req: Request<{}, {}, CreateUser["request"]>,
    res: Response<CreateUser["response"]>
  ) => {
    const user = req.body;
    const hash = sha256(user.password);
    con.query(
      "INSERT INTO user \
      (username, password, email, name, birthDate, joinedDate)\
      VALUES (?, ?, ?, ?, ?, NOW())",
      [user.username, hash, user.email, user.name, user.birthDate],
      (error) => {
        if (error) {
          printError(error);
          if (error.code === "ER_DUP_ENTRY") {
            res.send({
              ok: false,
              errorCode: ErrorCodes.UsernameAlreadyExists,
            });
          }
        } else {
          console.log("Added ", user);
          res.send({ ok: true });
        }
      }
    );
    return;
  }
);

app.get(
  "/user/:id",
  (
    req: TypedRequestQuery<{ id: string }, Fields<UserFields>>,
    res: Response<GetUser["response"]>
  ) => {
    // Make sure request has included some fields to query about
    if (!req.query.fields) {
      res.send({ ok: false, errorCode: ErrorCodes.NoFieldsSpecified });
      return;
    }

    // If only a single field in included, it will not be an array by default,
    // so transform it into one
    const fields = Array.isArray(req.query.fields)
      ? req.query.fields
      : [req.query.fields];

    // Don't allow forbidden fields
    // TODO: it's safer to whitelist instead of blacklist
    const forbiddenFields: Array<UserFields> = ["password"];
    if (!checkPermissions(forbiddenFields, fields)) {
      console.log("Failed permissions test");
      res.send({ ok: false });
      return;
    }

    // Adjust query fields to select
    const views = fields.map((f) => "," + f);
    con.query(
      "SELECT id" + views.join("") + " FROM user WHERE id = ?",
      [req.params.id],
      (err, result) => {
        if (err) {
          throw err;
        }
        // const filtered = filterResults(fields, result[0]);
        // res.send(filtered);
        res.send(result[0]);
      }
    );
  }
);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
