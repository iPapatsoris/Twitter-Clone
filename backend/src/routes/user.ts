/* eslint-disable no-multi-str */
import express, { Request, Response } from "express";
import { sha256 } from "js-sha256";
import { ExtraQueryFields, NormalResponse } from "../api/common.js";
import ErrorCodes from "../api/errorCodes.js";
import { GetUserLikes, Thread } from "../api/tweet.js";
import {
  CreateUser,
  GetUser,
  GetUserFollowees,
  GetUserFolloweeSuggestions,
  GetUserFollowers,
  GetUsernameExists,
  GetUserThreads,
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
  getUserTweetsAndRetweets,
} from "../services/tweet.js";
import {
  addFollower,
  getUser,
  getUserCircle,
  getUserIDFromUsername,
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
        return;
      });

      const fields = prepareUserQuery({
        fields: ["username", "name", "avatar", "id"],
        res,
      });
      const newUser = await getUser({
        username: user.username,
        session: req.session,
        ...fields.data!,
      });

      req.session.isLoggedIn = true;
      req.session.userID = newUser.data?.user.id;

      res.send({
        ok: true,
        data: {
          user: {
            id: newUser.data?.user.id!,
            username: user.username,
            name: user.name,
            avatar: newUser.data?.user.avatar,
          },
        },
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
    async (
      req: TypedRequestQuery<{ username: string }>,
      res: Response<NormalResponse>
    ) => {
      res.send({
        ok: await addFollower({
          followeeID: await getUserIDFromUsername(req.params.username),
          followerID: req.session.userID!,
        }),
      });
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

// Return user's tweets and retweets, that are not replies
router.get(
  "/:username/tweets",
  async (
    req: Request<
      { username: string },
      {},
      {},
      GetUserTweetsAndRetweets["requestQueryParams"]
    >,
    res: Response<GetUserTweetsAndRetweets["response"]>
  ) => {
    const cursor = parseInt(req.query.nextCursor);
    const pageSize = parseInt(req.query.pageSize);
    const { username } = req.params;
    const currentUserID = req.session.userID || -1;

    const { pageResults, nextCursor } = await getUserTweetsAndRetweets({
      username,
      cursor,
      currentUserID,
      direction: "down",
      pageSize,
    });

    res.send({
      ok: true,
      data: {
        tweetsAndRetweets: pageResults,
        pagination: {
          nextCursor,
        },
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
 * If a thread has multiple tweets by the user, we want to include it only
 * once, and feature the tweet that is the closest to the root tweet of the
 * thread. However, this is not trivial to implement, due to pagination.
 * Each page guarantees uniqueness of threads within itself, but not in relation
 * to previously served pages. For that we would need to either maintain more
 * server state, or query all the records during each page request.
 * For now, we leave it to the front end to handle duplicates.
 */
router.get(
  "/:username/replies",
  async (
    req: Request<
      { username: string },
      {},
      {},
      GetUserLikes["requestQueryParams"]
    >,
    res: Response<GetUserThreads["response"]>
  ) => {
    const { username } = req.params;
    const currentUserID = req.session.userID || -1;
    const cursor = parseInt(req.query.nextCursor);
    const pageSize = parseInt(req.query.pageSize);

    const replyIDs = await runQuery<{ id: number }>(
      "SELECT tweet.id \
       FROM tweet, user \
       WHERE authorID = user.id AND user.username = ? AND isReply = true" +
        (cursor !== -1 ? " AND tweet.id <= ?" : ""),
      [username, cursor]
    );

    const replies = await getTweets(
      replyIDs.map(({ id }) => id),
      currentUserID
    );

    // Don't show a thread multiple times, if the user has multiple responses
    // within the thread
    const uniqueReplies = getUniqueThreads(replies).sort((a, b) =>
      a.id > b.id ? -1 : 1
    );

    const pageResults = uniqueReplies.slice(0, pageSize);
    let nextCursor: number | undefined;

    if (pageResults.length === pageSize && uniqueReplies.length > pageSize) {
      nextCursor = uniqueReplies[pageSize].id;
    }

    const repliesWithNested: Thread[] = await Promise.all(
      pageResults.map(async (tweet) => {
        // Tweet is a reply; get referenced tweet
        const previousReply = await getTweet(
          tweet.referencedTweetID!,
          currentUserID
        );
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
        originalTweet = await getTweet(
          previousReply.referencedTweetID,
          currentUserID
        );
        if (originalTweet.isReply) {
          // Thread has more than 3 levels of reply depth; get thread root tweet
          originalTweet = await getTweet(
            originalTweet.rootTweetID,
            currentUserID
          );
          hasMoreNestedReplies = true;
        }
        // Return 3 tweets, and whether there exist more or not
        return {
          tweets: [originalTweet, previousReply, tweet],
          hasMoreNestedReplies,
        };
      })
    );

    res.send({
      ok: true,
      data: {
        threads: repliesWithNested,
        pagination: {
          nextCursor,
        },
      },
    });
  }
);

router.get(
  "/:username/likes",
  async (
    req: Request<
      { username: string },
      {},
      {},
      GetUserLikes["requestQueryParams"]
    >,
    res: Response<GetUserLikes["response"]>
  ) => {
    const { username } = req.params;
    const currentUserID = req.session.userID || -1;
    const cursor = parseInt(req.query.nextCursor);
    const pageSize = parseInt(req.query.pageSize);
    const likeIDs = await runQuery<{ tweetID: number; reactionID: number }>(
      "SELECT tweetID, user_reacts_to_tweet.id as reactionID \
       FROM user, user_reacts_to_tweet \
       WHERE userID = user.id AND reaction = 'like' AND user.username = ?" +
        (cursor !== -1 ? " AND user_reacts_to_tweet.id <= ?" : "") +
        " ORDER BY user_reacts_to_tweet.id DESC LIMIT ?",
      cursor !== -1
        ? [username, cursor, pageSize + 1]
        : [username, pageSize + 1]
    );
    const tweets = await getTweets(
      likeIDs.map(({ tweetID }) => tweetID),
      currentUserID
    );

    const likes: NonNullable<GetUserLikes["response"]["data"]>["likes"] = [];
    for (let t = 0; t < tweets.length; t++) {
      likes.push({ tweet: tweets[t], reactionID: likeIDs[t].reactionID });
    }

    const pageResults = likes.slice(0, pageSize);
    let nextCursor: number | undefined;

    if (pageResults.length === pageSize && likes.length > pageSize) {
      nextCursor = likes[pageSize].reactionID;
    }

    res.send({
      ok: true,
      data: {
        likes: pageResults,
        pagination: {
          nextCursor,
        },
      },
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
