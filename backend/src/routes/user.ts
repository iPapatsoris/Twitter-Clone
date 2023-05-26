/* eslint-disable no-multi-str */
import express, { Request, Response } from "express";
import { sha256 } from "js-sha256";
import { ExtraQueryFields, NormalResponse } from "../api/common.js";
import ErrorCodes from "../api/errorCodes.js";
import { GetTweets, Thread } from "../api/tweet.js";
import {
  CreateUser,
  GetUser,
  GetUserFollowees,
  GetUserFolloweeSuggestions,
  GetUserFollowers,
  GetUsernameExists,
  GetUserThreadsAndRetweets,
  GetUserTweetsAndRetweets,
  UpdateUser,
} from "../api/user.js";
import {
  checkPermissions,
  GetUserFields,
  UpdateUserFields,
} from "../permissions.js";
import { Fields, runQuery, simpleQuery, TypedRequestQuery } from "../util.js";
import { Tweet } from "../entities/tweet.js";
import {
  getTweet,
  getTweets,
  getUniqueThreads,
  getUserRetweets,
  mergeThreadsAndRetweets,
  mergeTweetsAndRetweets,
} from "../services/tweet.js";
import {
  getUser,
  getUserCircle,
  prepareUserQuery,
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
    const optionsResult = prepareUserQuery({ fields, res });
    if (!optionsResult.ok) {
      res.send({ ok: false, errorCode: optionsResult.errorCode });
      return;
    }

    const userResult = await getUser({
      username: req.params.username,
      session: req.session,
      ...optionsResult.data!,
    });
    if (!userResult.ok) {
      res.send({ ok: false, errorCode: userResult.errorCode });
      return;
    }

    res.send({ ok: true, data: { user: userResult.data?.user! } });
  }
);

router
  .route("/:username/follow")
  .post(
    requireAuth,
    (
      req: TypedRequestQuery<{ username: string }>,
      res: Response<NormalResponse>
    ) => {
      simpleQuery(
        res,
        "INSERT INTO user_follows (followerID, followeeID) VALUES (?, (SELECT id FROM user WHERE username = ?))",
        [req.session.userID, req.params.username]
      );
    }
  )
  .delete(
    requireAuth,
    (
      req: TypedRequestQuery<{ username: string }>,
      res: Response<NormalResponse>
    ) => {
      simpleQuery(
        res,
        "DELETE FROM user_follows WHERE followerID = ? AND followeeID = (SELECT id FROM user WHERE username = ?)",
        [req.session.userID, req.params.username]
      );
    }
  );

router.get(
  "/:username/followers",
  async (
    req: TypedRequestQuery<{ username: string }, Fields<GetUserFields>>,
    res: Response<GetUserFollowers<GetUserFields>["response"]>
  ) => {
    const fields = Object.keys(req.query) as GetUserFields[];
    const optionsResult = prepareUserQuery({ fields, res });
    if (!optionsResult.ok) {
      res.send({ ok: false, errorCode: optionsResult.errorCode });
      return;
    }

    const query =
      "SELECT follower.username as username \
       FROM user_follows, user as follower, user as followee \
       WHERE followee.username = ? AND followeeID = followee.id AND \
             followerID = follower.id";

    const circleResult = await getUserCircle({
      query,
      username: req.params.username,
      optionsResult,
      session: req.session,
    });

    if (!circleResult.ok) {
      res.send({ ok: false, errorCode: circleResult.errorCode });
    }
    res.send({ ok: true, data: { followers: circleResult.data! } });
  }
);

router.get(
  "/:username/followees",
  async (
    req: TypedRequestQuery<{ username: string }, Fields<GetUserFields>>,
    res: Response<GetUserFollowees<GetUserFields>["response"]>
  ) => {
    const fields = Object.keys(req.query) as GetUserFields[];
    const optionsResult = prepareUserQuery({ fields, res });
    if (!optionsResult.ok) {
      res.send({ ok: false, errorCode: optionsResult.errorCode });
      return;
    }

    const query =
      "SELECT followee.username as username \
       FROM user_follows, user as follower, user as followee \
       WHERE follower.username = ? AND followerID = follower.id AND \
             followeeID = followee.id";

    const circleResult = await getUserCircle({
      query,
      username: req.params.username,
      optionsResult,
      session: req.session,
    });

    if (!circleResult.ok) {
      res.send({ ok: false, errorCode: circleResult.errorCode });
    }
    res.send({ ok: true, data: { followees: circleResult.data! } });
  }
);

// Normally a recommendation algorithm would be used, for simplicity we just
// return any users that the currently logged-in user not following.
router
  .route("/followees/suggestions")
  .get(
    requireAuth,
    async (
      req: Request<{}, {}, {}, Fields<GetUserFields, ExtraQueryFields>>,
      res: Response<GetUserFolloweeSuggestions<GetUserFields>["response"]>
    ) => {
      let limit = req.query.limit;
      if (limit === undefined) {
        limit = 3;
      }

      const fields = Object.keys(req.query) as GetUserFields[];

      const optionsResult = prepareUserQuery({ fields, res });
      if (!optionsResult.ok) {
        res.send({ ok: false, errorCode: optionsResult.errorCode });
        return;
      }

      const query =
        "SELECT user.id " +
        optionsResult.data?.views.join("") +
        " FROM user \
       WHERE user.id != ? AND user.id NOT IN ( \
        SELECT user_follows.followeeID \
        FROM user_follows WHERE user_follows.followerID = ?  \
       ) LIMIT ?";

      const result = await runQuery<
        NonNullable<
          GetUserFolloweeSuggestions<GetUserFields>["response"]["data"]
        >["followeeSuggestions"][0]
      >(query, [req.session.userID, req.session.userID, limit]);

      res.send({ ok: true, data: { followeeSuggestions: result } });
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
