/* eslint-disable no-multi-str */
import express, { Request, Response } from "express";
import { sha256 } from "js-sha256";
import { currentUserID } from "../index.js";
import { NormalResponse } from "../api/common.js";
import ErrorCodes from "../api/errorCodes.js";
import { GetTweets, Thread } from "../api/tweet.js";
import {
  CreateUser,
  GetUser,
  GetUserFollowees,
  GetUserFollowers,
  GetUsernameExists,
  GetUserThreadsAndRetweets,
  GetUserTweetsAndRetweets,
  UpdateUser,
  UserWithExtra,
} from "../api/user.js";
import {
  checkPermissions,
  GetUserFields,
  UpdateUserFields,
} from "../permissions.js";
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
  getUniqueThreads,
  getUserRetweets,
  mergeThreadsAndRetweets,
  mergeTweetsAndRetweets,
} from "../services/tweet.js";
import {
  checkUserFollowedByActiveUser,
  usernameExists,
} from "../services/user.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router
  .route("/")
  // Add new user
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
    // Update user info
    requireAuth,
    async (
      req: TypedRequestQuery<
        {},
        Fields<UpdateUserFields>,
        UpdateUser<UpdateUserFields>["request"]
      >,
      res: Response<UpdateUser<UpdateUserFields>["response"]>
    ) => {
      const currentUserID = req.session.userID;
      const fields = Object.keys(req.query) as UpdateUserFields[];
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
      const { user } = req.body;
      const values: any = [];
      fields.forEach((key) => values.push(user[key]));

      console.log(preparedFields);
      console.log(values);

      await runQuery(
        "UPDATE user SET " + preparedFields.join("") + " WHERE id = ?",
        [...values, currentUserID]
      );
      res.send({ ok: true, data: { user: user } });
    }
  );

// TODO: move queries to services, run in parallel
router.get(
  "/:username",
  async (
    req: TypedRequestQuery<{ username: string }, Fields<GetUserFields>>,
    res: Response<GetUser<GetUserFields>["response"]>
  ) => {
    const fields = Object.keys(req.query) as GetUserFields[];
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

    // Frienship fields will be handled on seperate queries, so remove them
    const seperateFields = removeArrayFields<typeof fields[0]>(fields, [
      "totalFollowees",
      "totalFollowers",
      "totalTweets",
      "isFollowedByActiveUser",
    ]);

    // Set flags for seperate fields to query
    let getTotalFollowees = false;
    let getTotalFollowers = false;
    let getTotalTweets = false;
    let getIsFollowedByActiveUser = false;
    seperateFields.forEach((field) => {
      if (field === "totalFollowees") {
        getTotalFollowees = true;
      } else if (field === "totalFollowers") {
        getTotalFollowers = true;
      } else if (field === "totalTweets") {
        getTotalTweets = true;
      } else if (field === "isFollowedByActiveUser") {
        getIsFollowedByActiveUser = true;
      }
    });

    // Adjust query fields to select
    const views = fields.map((f) => "," + f);
    const username = req.params.username;

    // Query regular fields
    const [user] = await runQuery<Pick<UserWithExtra, GetUserFields>>(
      "SELECT id" + views.join("") + " FROM user WHERE username = ?",
      [username]
    );

    if (!user) {
      res.send({ ok: false });
      return;
    }
    const { id: userID } = user;

    if (getTotalTweets) {
      user.totalTweets = await getTotalUserTweets(Number(userID));
    }
    if (getTotalFollowers || getTotalFollowees) {
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
    }

    const activeUserID = req.session.userID;
    user.isFollowedByActiveUser = false;
    console.log(req.session);
    console.log(getIsFollowedByActiveUser);

    if (req.session.isLoggedIn && getIsFollowedByActiveUser) {
      user.isFollowedByActiveUser = await checkUserFollowedByActiveUser(
        userID,
        activeUserID!
      );
    }

    res.send({ ok: true, data: { user } });
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
  "/:username/followers",
  (
    req: TypedRequestQuery<{ username: string }>,
    res: Response<GetUserFollowers["response"]>
  ) => {
    const { username } = req.params;
    const query =
      "SELECT follower.id as id, follower.username as username, \
              follower.name as name, follower.isVerified as isVerified, \
              follower.avatar as avatar, follower.bio as bio \
       FROM user_follows, user as follower, user as followee \
       WHERE followee.username = ? AND followeeID = followee.id AND \
             followerID = follower.id";
    const sendResult = (result: any) => {
      res.send({ ok: true, data: { followers: result } });
    };
    simpleQuery(res, query, [username], sendResult);
  }
);

router.get(
  "/:username/followees",
  (
    req: TypedRequestQuery<{ username: string }>,
    res: Response<GetUserFollowees["response"]>
  ) => {
    const { username } = req.params;
    const query =
      "SELECT followee.id as id, followee.username as username, \
              followee.name as name, followee.isVerified as isVerified, \
              followee.avatar as avatar, followee.bio as bio \
       FROM user_follows, user as follower, user as followee \
       WHERE follower.username = ? AND followerID = follower.id AND \
             followeeID = followee.id";
    const sendResult = (result: any) => {
      res.send({ ok: true, data: { followees: result } });
    };
    simpleQuery(res, query, [username], sendResult);
  }
);

// Return user's tweets and retweets
// Don't include replies
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
      data: {
        tweetsAndRetweets: mergeTweetsAndRetweets(tweets, retweets),
      },
    });
  }
);

/**
 * Return user's tweets, retweets and replies.
 * For a reply, include the referenced tweets recursively, until a maximum of 3
 * tweets per thread. Mark if thread has more than 3 tweets in
 * hasMoreNestedReplies. If it has more than 3, instead of returning the 3rd
 * most recent nested reply, return the thread root tweet.
 *
 * If a thread has multiple tweets by the user, include it only
 * once. The featured tweet will be the one closest to the root tweet of the
 * thread.
 */
router.get(
  "/:userID/replies",
  async (
    req: TypedRequestQuery<{ userID: string }>,
    res: Response<GetUserThreadsAndRetweets["response"]>
  ) => {
    const { userID } = req.params;
    const replyIDs = await runQuery<{ id: number }>(
      "SELECT id \
       FROM tweet \
       WHERE authorID = ?",
      [userID]
    );

    const tweetsAndReplies = await getTweets(replyIDs.map(({ id }) => id));

    // Don't show a thread multiple times, if the user has multiple responses
    // within the thread
    const uniqueTweetsAndReplies = getUniqueThreads(tweetsAndReplies);

    const tweetsAndRepliesWithNested: Thread[] = await Promise.all(
      uniqueTweetsAndReplies.map(async (tweet) => {
        if (!tweet.isReply || !tweet.referencedTweetID) {
          // Tweet is not a reply; return 1 tweet
          return {
            tweets: [tweet],
            hasMoreNestedReplies: false,
          };
        }
        // Tweet is a reply; get referenced tweet
        const previousReply = await getTweet(tweet.referencedTweetID);
        let originalTweet: Tweet | null = null;
        let hasMoreNestedReplies = false;
        if (!previousReply.isReply || !previousReply.referencedTweetID) {
          // Referenced tweet is not a reply; return 2 tweets
          return {
            tweets: [previousReply, tweet],
            hasMoreNestedReplies,
          };
        }
        // Referenced tweet is a reply; get referenced tweet of referenced tweet
        originalTweet = await getTweet(previousReply.referencedTweetID);
        if (originalTweet.isReply) {
          // Thread has more than 3 levels of reply depth; get thread root tweet
          originalTweet = await getTweet(originalTweet.rootTweetID);
          hasMoreNestedReplies = true;
        }
        // Return 3 tweets, and whether there exist more or not
        return {
          tweets: [originalTweet, previousReply, tweet],
          hasMoreNestedReplies,
        };
      })
    );

    const retweets = await getUserRetweets(Number(req.params.userID));

    res.send({
      ok: true,
      data: {
        threadsAndRetweets: mergeThreadsAndRetweets(
          tweetsAndRepliesWithNested,
          retweets
        ),
      },
    });
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
      data: { tweets: await getTweets(tweetIDs.map(({ id }) => id)) },
    });
  }
);

router.get(
  "/usernameExists/:username",
  async (
    req: TypedRequestQuery<{ username: string }>,
    res: Response<GetUsernameExists["response"]>
  ) => {
    const { username } = req.params;

    res.send({
      ok: true,
      data: {
        usernameExists: await usernameExists(username),
      },
    });
  }
);

export default router;
