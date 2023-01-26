/* eslint-disable no-multi-str */
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import mysql from "mysql";
import { sha256 } from "js-sha256";
import {
  CreateUser,
  GetUser,
  GetUserFields,
  GetUserFollowees,
  GetUserFollowers,
  UpdateUser,
  UpdateUserFields,
} from "../../api/user";
import ErrorCodes from "../../api/errorCodes.js";
import {
  Fields,
  isEmptyObject,
  removeArrayFields,
  simpleQuery,
  TypedRequestQuery,
} from "./util.js";
import { NormalResponse } from "../../api/common.js";
import { checkPermissions } from "./permissions.js";
import { CreateTweet, GetUserTweets } from "../../api/tweet";

const app = express();
const port = 3000;
const host = "localhost";
const user = "root";
const database = "twitter";

const db = mysql.createConnection({
  host,
  user,
  database,
});

app.use(bodyParser.json());

db.connect((err) => {
  if (err) throw err;
  console.log("Connected!");
});

// TODO: remove when auth is implemented
const currentUserID = 1;

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
    const { user } = req.body;
    const hash = sha256(user.password);
    const query =
      "INSERT INTO user \
      (username, password, email, name, birthDate, joinedDate)\
      VALUES (?, ?, ?, ?, ?, NOW())";
    simpleQuery(
      db,
      res,
      query,
      [user.username, hash, user.email, user.name, user.birthDate],
      undefined,
      (error) => {
        let errorCode: number | undefined;
        if (error.code === "ER_DUP_ENTRY") {
          errorCode = ErrorCodes.UsernameAlreadyExists;
        }
        res.send({
          ok: false,
          errorCode,
        });
      }
    );
  }
);

app.patch(
  "/user/",
  (
    req: TypedRequestQuery<{}, Fields<UpdateUserFields>, UpdateUser["request"]>,
    res: Response<UpdateUser["response"]>
  ) => {
    // Make sure request has included some fields to query about
    if (isEmptyObject(req.body)) {
      res.send({ ok: false, errorCode: ErrorCodes.NoFieldsSpecified });
      return;
    }

    // Allow only whitelisted fields
    const fields = Object.keys(req.body);
    if (!checkPermissions("UpdateUser", fields)) {
      console.log("Failed permissions test");
      res.send({ ok: false, errorCode: ErrorCodes.PermissionDenied });
      return;
    }

    const preparedFields = fields.map((f, index) => {
      return f + " = ?" + (index !== fields.length - 1 ? "," : "");
    });
    const user = req.body;
    const values = Object.values(req.body);

    const query =
      "UPDATE user SET " + preparedFields.join("") + " WHERE id = ?";
    simpleQuery(db, res, query, [...values, currentUserID], () =>
      res.send({ ok: true, user: user })
    );
  }
);

app.get(
  "/user/:id",
  (
    req: TypedRequestQuery<{ id: string }, Fields<GetUserFields>>,
    res: Response<GetUser["response"]>
  ) => {
    const fields = Object.keys(req.query);
    // Make sure request has included some fields to query about
    if (!fields.length) {
      res.send({ ok: false, errorCode: ErrorCodes.NoFieldsSpecified });
      return;
    }

    // Allow only whitelisted fields
    if (!checkPermissions("GetUser", fields)) {
      console.log("Failed permissions test");
      res.send({ ok: false, errorCode: ErrorCodes.PermissionDenied });
      return;
    }

    // Frienship fields will be handled on a seperate queries, so remove them
    const friendshipFields = removeArrayFields<typeof fields[0]>(fields, [
      "totalFollowees",
      "totalFollowers",
    ]);

    // Set flags for friendship fields to query
    let getTotalFollowees = false;
    let getTotalFollowers = false;
    friendshipFields.forEach((field) => {
      if (field === "totalFollowees") {
        getTotalFollowees = true;
      } else if (field === "totalFollowers") {
        getTotalFollowers = true;
      }
    });

    // Adjust query fields to select
    const views = fields.map((f) => "," + f);
    const userID = req.params.id;

    let finalResult = {};

    // Query regular fields
    simpleQuery(
      db,
      res,
      "SELECT id" + views.join("") + " FROM user WHERE id = ?",
      [userID],
      (result: any) => {
        finalResult = result[0];
        if (!getTotalFollowers && !getTotalFollowees) {
          res.send({ ok: true, user: finalResult });
          return;
        }

        // Query friendship fields
        const totalFollowersQuery =
          "SELECT COUNT(*) as totalFollowers \
         FROM user_follows as friendship \
         WHERE friendship.followeeID = ?";
        const totalFolloweesQuery =
          "SELECT COUNT(*) as totalFollowees \
         FROM user_follows as friendship \
         WHERE friendship.followerID = ?";

        if (getTotalFollowers && getTotalFollowees) {
          // Query both followers and followees
          simpleQuery(db, res, totalFollowersQuery, [userID], (result) => {
            finalResult = {
              ...finalResult,
              ...result[0],
            };
            simpleQuery(db, res, totalFolloweesQuery, [userID], (result) => {
              finalResult = {
                ...finalResult,
                ...result[0],
              };
              res.send({ ok: true, user: finalResult });
            });
          });
        } else if (getTotalFollowers || getTotalFollowees) {
          // Query followers or followees
          simpleQuery(
            db,
            res,
            getTotalFollowers ? totalFollowersQuery : totalFolloweesQuery,
            [userID],
            (result) => {
              finalResult = {
                ...finalResult,
                ...result[0],
              };
              res.send({ ok: true, user: finalResult });
            }
          );
        }
      }
    );
  }
);

app.post(
  "/user/:targetID/follow",
  (
    req: TypedRequestQuery<{ targetID: string }>,
    res: Response<NormalResponse>
  ) => {
    simpleQuery(
      db,
      res,
      "INSERT INTO user_follows (followerID, followeeID) VALUES (?, ?)",
      [currentUserID, req.params.targetID]
    );
  }
);

app.delete(
  "/user/:targetID/follow",
  (
    req: TypedRequestQuery<{ targetID: string }>,
    res: Response<NormalResponse>
  ) => {
    simpleQuery(
      db,
      res,
      "DELETE FROM user_follows WHERE followerID = ? AND followeeID = ?",
      [currentUserID, req.params.targetID]
    );
  }
);

app.get(
  "/user/:userID/followers",
  (
    req: TypedRequestQuery<{ userID: string }>,
    res: Response<GetUserFollowers["response"]>
  ) => {
    const { userID } = req.params;
    const query =
      "SELECT user.id as id, username, name, isVerified, avatar, bio \
       FROM user_follows, user \
       WHERE followeeID = ? AND followerID = user.id";
    const sendResult = (result: any) => {
      res.send({ ok: true, followers: result });
    };
    simpleQuery(db, res, query, [userID], sendResult);
  }
);

app.get(
  "/user/:userID/followees",
  (
    req: TypedRequestQuery<{ userID: string }>,
    res: Response<GetUserFollowees["response"]>
  ) => {
    const { userID } = req.params;
    const query =
      "SELECT user.id as id, username, name, isVerified, avatar, bio \
       FROM user_follows, user \
       WHERE followerID = ? AND followeeID = user.id";
    const sendResult = (result: any) => {
      res.send({ ok: true, followees: result });
    };
    simpleQuery(db, res, query, [userID], sendResult);
  }
);

app.get(
  "/user/:userID/tweets",
  (
    req: TypedRequestQuery<{ userID: string }>,
    res: Response<GetUserTweets["response"]>
  ) => {
    const { userID } = req.params;
    const query =
      "SELECT * \
       FROM tweet \
       WHERE tweet.authorID = ?";
    const sendResult = (result: any) => {
      res.send({ ok: true, userTweets: result });
    };
    simpleQuery(db, res, query, [userID], sendResult);
  }
);

app.post(
  "/tweet",
  (
    req: Request<{}, {}, CreateTweet["request"]>,
    res: Response<CreateTweet["response"]>
  ) => {
    const { tweet } = req.body;
    const query =
      "INSERT INTO tweet \
      (authorID, text, isReply, isRetweet, referencedTweetID, views, creationDate)\
      VALUES (?, ?, ?, ?, ?, 0, NOW())";
    simpleQuery(db, res, query, [
      currentUserID,
      tweet.text,
      tweet.isReply,
      tweet.isRetweet,
      tweet.referencedTweetID,
    ]);
  }
);

app.patch(
  "/tweet/:tweetID/view",
  (
    req: TypedRequestQuery<{ tweetID: string }>,
    res: Response<NormalResponse>
  ) => {
    const { tweetID } = req.params;
    const query =
      "UPDATE tweet \
       SET views = views + 1\
       WHERE id = ?";
    simpleQuery(db, res, query, [tweetID]);
  }
);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
