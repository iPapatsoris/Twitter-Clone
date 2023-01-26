/* eslint-disable no-multi-str */
import express, { Request, Response } from "express";
import { sha256 } from "js-sha256";
import { currentUserID } from "../index.js";
import { NormalResponse } from "../../../api/common.js";
import ErrorCodes from "../../../api/errorCodes.js";
import { GetTweets } from "../../../api/tweet.js";
import {
  CreateUser,
  GetUser,
  GetUserFields,
  GetUserFollowees,
  GetUserFollowers,
  UpdateUser,
  UpdateUserFields,
} from "../../../api/user.js";
import db from "../connection.js";
import { checkPermissions } from "../permissions.js";
import {
  Fields,
  removeArrayFields,
  simpleQuery,
  TypedRequestQuery,
} from "../util.js";

const router = express.Router();

router
  .route("/")
  .post(
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
  )
  .patch(
    (
      req: TypedRequestQuery<
        {},
        Fields<UpdateUserFields>,
        UpdateUser["request"]
      >,
      res: Response<UpdateUser["response"]>
    ) => {
      const fields = Object.keys(req.body);
      // Make sure request has included some fields to query about
      if (!fields.length) {
        res.send({ ok: false, errorCode: ErrorCodes.NoFieldsSpecified });
        return;
      }

      // Allow only whitelisted fields
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

router.get(
  "/:id",
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

router
  .route("/:userID/follow")
  .post(
    (
      req: TypedRequestQuery<{ userID: string }>,
      res: Response<NormalResponse>
    ) => {
      simpleQuery(
        db,
        res,
        "INSERT INTO user_follows (followerID, followeeID) VALUES (?, ?)",
        [currentUserID, req.params.userID]
      );
    }
  )
  .delete(
    (
      req: TypedRequestQuery<{ userID: string }>,
      res: Response<NormalResponse>
    ) => {
      simpleQuery(
        db,
        res,
        "DELETE FROM user_follows WHERE followerID = ? AND followeeID = ?",
        [currentUserID, req.params.userID]
      );
    }
  );

router.get(
  "/:userID/followers",
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

router.get(
  "/:userID/followees",
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

router.get(
  "/:userID/tweets",
  (
    req: TypedRequestQuery<{ userID: string }>,
    res: Response<GetTweets["response"]>
  ) => {
    const { userID } = req.params;
    const query =
      "SELECT * \
       FROM tweet \
       WHERE tweet.authorID = ?";
    const sendResult = (result: any) => {
      res.send({ ok: true, tweets: result });
    };
    simpleQuery(db, res, query, [userID], sendResult);
  }
);

export default router;
