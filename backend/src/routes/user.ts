/* eslint-disable no-multi-str */
import express, { Request, Response } from "express";
import { sha256 } from "js-sha256";
import { currentUserID } from "../index.js";
import { NormalResponse } from "../api/common.js";
import ErrorCodes from "../api/errorCodes.js";
import { GetTweets, NestedReplies } from "../api/tweet.js";
import {
  CreateUser,
  GetUser,
  GetUserFields,
  GetUserFollowees,
  GetUserFollowers,
  GetUserRepliesAndRetweets,
  GetUserTweetsAndRetweets,
  UpdateUser,
  UpdateUserFields,
} from "../api/user.js";
import { checkPermissions } from "../permissions.js";
import {
  Fields,
  removeArrayFields,
  runQuery,
  simpleQuery,
  TypedRequestQuery,
} from "../util.js";
import { Tweet } from "../entities/tweet.js";
import {
  getTotalUserTweets,
  getTweet,
  getTweets,
  getUserRetweets,
  mergeTweetsAndRetweets,
} from "../services/tweet.js";

const router = express.Router();

router
  .route("/")
  .post(
    async (
      req: Request<{}, {}, CreateUser["request"]>,
      res: Response<CreateUser["response"]>
    ) => {
      const { user } = req.body;
      const hash = sha256(user.password);
      await runQuery(
        "INSERT INTO user \
         (username, password, email, name, birthDate, joinedDate)\
         VALUES (?, ?, ?, ?, ?, NOW())",
        [user.username, hash, user.email, user.name, user.birthDate]
      ).catch((error) => {
        let errorCode: number | undefined;
        if (error.code === "ER_DUP_ENTRY") {
          errorCode = ErrorCodes.UsernameAlreadyExists;
        }
        res.send({
          ok: false,
          errorCode,
        });
      });
      res.send({
        ok: true,
      });
    }
  )
  .patch(
    async (
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

      await runQuery(
        "UPDATE user SET " + preparedFields.join("") + " WHERE id = ?",
        [...values, currentUserID]
      );
      res.send({ ok: true, user: user });
    }
  );

router.get(
  "/:id",
  async (
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
    const seperateFields = removeArrayFields<typeof fields[0]>(fields, [
      "totalFollowees",
      "totalFollowers",
      "totalTweets",
    ]);

    // Set flags for seperate fields to query
    let getTotalFollowees = false;
    let getTotalFollowers = false;
    let getTotalTweets = false;
    seperateFields.forEach((field) => {
      if (field === "totalFollowees") {
        getTotalFollowees = true;
      } else if (field === "totalFollowers") {
        getTotalFollowers = true;
      } else if (field === "totalTweets") {
        getTotalTweets = true;
      }
    });

    // Adjust query fields to select
    const views = fields.map((f) => "," + f);
    const userID = req.params.id;

    // Query regular fields
    const [user] = await runQuery<GetUser["response"]["user"]>(
      "SELECT id" + views.join("") + " FROM user WHERE id = ?",
      [userID]
    );

    if (!user) {
      res.send({ ok: false });
      return;
    }

    if (getTotalTweets) {
      user.totalTweets = await getTotalUserTweets(Number(userID));
    }
    if (!getTotalFollowers && !getTotalFollowees) {
      res.send({ ok: true, user });
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

    if (getTotalFollowees) {
      user.totalFollowees = (
        await runQuery<{ totalFollowees: number }>(totalFolloweesQuery, [
          userID,
        ])
      )[0].totalFollowees;
    }

    if (getTotalFollowers) {
      user.totalFollowers = (
        await runQuery<{ totalFollowers: number }>(totalFollowersQuery, [
          userID,
        ])
      )[0].totalFollowers;
    }
    res.send({ ok: true, user });
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
    simpleQuery(res, query, [userID], sendResult);
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
    simpleQuery(res, query, [userID], sendResult);
  }
);

// Return user's tweets and retweets
router.get(
  "/:userID/tweets",
  async (
    req: TypedRequestQuery<{ userID: string }>,
    res: Response<GetUserTweetsAndRetweets["response"]>
  ) => {
    const { userID } = req.params;
    const tweetIDs = await runQuery<{ id: number }>(
      "SELECT id \
       FROM tweet \
       WHERE tweet.authorID = ? AND isReply = false",
      [userID]
    );
    const tweets = await Promise.all(
      tweetIDs.map(async ({ id }) => getTweet(id))
    );

    const retweets = await getUserRetweets(Number(userID));
    res.send({
      ok: true,
      tweetsAndRetweets: await mergeTweetsAndRetweets(tweets, retweets),
    });
  }
);

// Return user's replies and retweets
router.get(
  "/:userID/replies",
  async (
    req: TypedRequestQuery<{ userID: string }>,
    res: Response<GetUserRepliesAndRetweets["response"]>
  ) => {
    const { userID } = req.params;
    const replyIDs = await runQuery<{ id: number }>(
      "SELECT id \
       FROM tweet \
       WHERE authorID = ? AND isReply = true",
      [userID]
    );

    const replies = await getTweets(replyIDs.map(({ id }) => id));

    const promises: Array<Promise<NestedReplies>> = replies.map(
      (reply) =>
        new Promise(async (resolve, reject) => {
          if (!reply.referencedTweetID) {
            res.send({ ok: false });
            return;
          }
          const previousReply = await getTweet(reply.referencedTweetID);
          let originalTweet: Tweet | null = null;
          let hasMoreNestedReplies = false;
          if (previousReply.isReply && previousReply.referencedTweetID) {
            originalTweet = await getTweet(previousReply.referencedTweetID);
            if (originalTweet.isReply) {
              originalTweet = await getTweet(originalTweet.rootTweetID);
              const thread = [originalTweet, previousReply, reply];
              resolve({
                nestedReplies: thread,
                hasMoreNestedReplies,
              });
            } else {
              resolve({
                nestedReplies: [originalTweet, previousReply, reply],
                hasMoreNestedReplies,
              });
            }
          } else {
            resolve({
              nestedReplies: [previousReply, reply],
              hasMoreNestedReplies,
            });
          }
        })
    );
    const promiseResults = await Promise.all(promises);
    const retweets = await getUserRetweets(Number(req.params.userID));

    const finalReplies: GetUserRepliesAndRetweets["response"]["repliesAndRetweets"] =
      promiseResults.map((reply) => ({
        reply,
      }));
    const repliesAndRetweets = finalReplies.concat(
      retweets.map((retweet) => ({ retweet: retweet }))
    );

    console.log(repliesAndRetweets);

    const getMostRecentReplyDate = (thread: NestedReplies) =>
      thread.nestedReplies[thread.nestedReplies.length - 1].creationDate;

    repliesAndRetweets.sort((a, b) => {
      const aDate = a.reply
        ? getMostRecentReplyDate(a.reply)
        : a.retweet?.retweetDate;
      const bDate = b.reply
        ? getMostRecentReplyDate(b.reply)
        : b.retweet?.retweetDate;
      console.log(aDate, " vs ", bDate);

      if (aDate && bDate) {
        if (new Date(aDate) > new Date(bDate)) {
          return -1;
        } else {
          return 1;
        }
      }
      return 0;
    });
    res.send({ ok: true, repliesAndRetweets });
  }
);

router.get(
  "/:userID/likes",
  async (
    req: TypedRequestQuery<{ userID: string }>,
    res: Response<GetTweets["response"]>
  ) => {
    const { userID } = req.params;
    const tweetIDs = await runQuery<{ id: number }>(
      "SELECT id \
       FROM tweet \
       WHERE authorID = ? AND isLike = true \
       ORDER BY reactionDate DESC",
      [userID]
    );
    res.send({
      ok: true,
      tweets: await getTweets(tweetIDs.map(({ id }) => id)),
    });
  }
);

export default router;
