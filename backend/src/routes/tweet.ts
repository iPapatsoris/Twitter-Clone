/* eslint-disable no-multi-str */
import express, { Request, Response } from "express";
import { faker } from "@faker-js/faker";
import { NormalResponse } from "../api/common.js";
import {
  CreateTweet,
  ExpandTweetReplies,
  GetTweet,
  GetTweetParams,
  SingleTweetResponse,
  Thread,
  Trend,
  GetTrends,
} from "../api/tweet.js";
import {
  Fields,
  runInsertQuery,
  runQuery,
  shuffleArray,
  TypedRequestQuery,
} from "../util.js";
import { Tweet } from "../entities/tweet.js";
import {
  getTweet,
  getTweetNestedReplies,
  getTweetPreviousReplies,
  getTweets,
  getUserReactionsToTweet,
  getUserRetweets,
  mergeTweetsAndRetweets,
  sort,
  updateParentTweetReplyDepth,
} from "../services/tweet.js";
import { GetUserTweetsAndRetweets } from "../api/user.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  async (
    req: Request<{}, {}, CreateTweet["request"]>,
    res: Response<CreateTweet["response"]>
  ) => {
    const { tweet } = req.body;
    const currentUserID = req.session.userID!;
    let rootTweetID: number | null = null;
    if (tweet.isReply) {
      [{ rootTweetID }] = await runQuery<{ rootTweetID: number }>(
        "SELECT rootTweetID FROM tweet WHERE id = ?",
        [tweet.referencedTweetID]
      );
      if (!rootTweetID && tweet.referencedTweetID !== undefined) {
        rootTweetID = tweet.referencedTweetID;
      }
    }

    const result = await runInsertQuery<{ insertId: number }>(
      "INSERT INTO tweet \
      (authorID, text, isReply, referencedTweetID, views, \
      replyDepth, rootTweetID, creationDate)\
      VALUES (?, ?, ?, ?, 0, 0, ?, NOW())",
      [
        currentUserID,
        tweet.text,
        tweet.isReply,
        tweet.referencedTweetID,
        rootTweetID,
      ]
    );

    if (tweet.isReply && tweet.referencedTweetID !== undefined) {
      const tweetID = result.insertId;
      const [{ username }] = await runQuery<{ username: string }>(
        "SELECT username FROM user WHERE id = ?",
        [currentUserID]
      );
      updateParentTweetReplyDepth(tweet.referencedTweetID, 1);
      let { usernameTags } = await getTweet(
        tweet.referencedTweetID,
        currentUserID
      );
      if (
        usernameTags &&
        usernameTags.findIndex((tag) => tag.userID === currentUserID) === -1
      ) {
        usernameTags.push({ username, userID: currentUserID });
      } else if (!usernameTags) {
        usernameTags = [{ username, userID: currentUserID }];
      }
      await Promise.all(
        usernameTags.map((taggedUser) =>
          runQuery(
            "INSERT INTO tweet_tags_user (tweetID, userID) VALUES (?, ?)",
            [tweetID, taggedUser.userID]
          )
        )
      );
    }
    res.send({ ok: true, data: { tweetID: result.insertId } });
  }
);

router.patch(
  "/:tweetID/addView",
  async (
    req: TypedRequestQuery<{ tweetID: string }>,
    res: Response<NormalResponse>
  ) => {
    const { tweetID } = req.params;
    const currentUserID = req.session.userID || -1;
    const query =
      "UPDATE tweet \
       SET views = views + 1\
       WHERE id = ?";

    await runQuery(query, [tweetID]);
    res.send({
      ok: true,
      data: { ...(await getTweet(parseInt(tweetID), currentUserID)) },
    });
  }
);

router.post(
  "/:tweetID/retweet",
  requireAuth,
  async (
    req: TypedRequestQuery<{ tweetID: string }>,
    res: Response<NormalResponse>
  ) => {
    const { tweetID } = req.params;
    const { userID } = req.session;

    const { isLike, isRetweet } = await getUserReactionsToTweet(
      parseInt(tweetID),
      userID!
    );

    let query = "";
    if (isRetweet) {
      res.send({ ok: false });
      return;
    } else if (isLike) {
      query =
        "UPDATE user_reacts_to_tweet \
        SET isRetweet = true \
        WHERE userID = ? AND tweetID = ?";
    } else {
      query =
        "INSERT INTO user_reacts_to_tweet \
        (userID, tweetID, reactionDate, isRetweet, isLike) \
         VALUES (?, ?, NOW(), true, false)";
    }

    await runQuery(query, [userID, tweetID]);
    res.send({
      ok: true,
      data: { ...(await getTweet(parseInt(tweetID), userID!)) },
    });
  }
);

router.delete(
  "/:tweetID/retweet",
  requireAuth,
  async (
    req: TypedRequestQuery<{ tweetID: string }>,
    res: Response<NormalResponse>
  ) => {
    const { tweetID } = req.params;
    const { userID } = req.session;
    const { isLike, isRetweet } = await getUserReactionsToTweet(
      parseInt(tweetID),
      userID!
    );

    let query = "";
    if (!isRetweet) {
      res.send({ ok: false });
      return;
    } else if (isLike) {
      query =
        "UPDATE user_reacts_to_tweet \
        SET isRetweet = false \
        WHERE userID = ? AND tweetID = ?";
    } else {
      query =
        "DELETE FROM user_reacts_to_tweet \
          WHERE userID = ? AND tweetID = ?";
    }

    await runQuery(query, [userID, tweetID]);
    res.send({
      ok: true,
      data: { ...(await getTweet(parseInt(tweetID), userID!)) },
    });
  }
);

router.post(
  "/:tweetID/like",
  requireAuth,
  async (
    req: TypedRequestQuery<{ tweetID: string }>,
    res: Response<SingleTweetResponse>
  ) => {
    const { tweetID } = req.params;
    const { userID } = req.session;
    const { isLike, isRetweet } = await getUserReactionsToTweet(
      parseInt(tweetID),
      userID!
    );

    let query = "";
    if (isLike) {
      res.send({ ok: false });
      return;
    } else if (isRetweet) {
      query =
        "UPDATE user_reacts_to_tweet \
        SET isLike = true \
        WHERE userID = ? AND tweetID = ?";
    } else {
      query =
        "INSERT INTO user_reacts_to_tweet \
        (userID, tweetID, reactionDate, isRetweet, isLike) \
         VALUES (?, ?, NOW(), false, true)";
    }

    await runQuery(query, [userID, tweetID]);
    res.send({
      ok: true,
      data: { ...(await getTweet(parseInt(tweetID), userID!)) },
    });
  }
);

router.delete(
  "/:tweetID/like",
  requireAuth,
  async (
    req: TypedRequestQuery<{ tweetID: string }>,
    res: Response<SingleTweetResponse>
  ) => {
    const { tweetID } = req.params;
    const { userID } = req.session;
    const { isLike, isRetweet } = await getUserReactionsToTweet(
      parseInt(tweetID),
      userID!
    );

    let query = "";
    if (!isLike) {
      res.send({ ok: false });
      return;
    } else if (isRetweet) {
      query =
        "UPDATE user_reacts_to_tweet \
        SET isLike = false \
        WHERE userID = ? AND tweetID = ?";
    } else {
      query =
        "DELETE FROM user_reacts_to_tweet \
         WHERE userID = ? AND tweetID = ?";
    }

    await runQuery(query, [userID, tweetID]);
    res.send({
      ok: true,
      data: { ...(await getTweet(parseInt(tweetID), userID!)) },
    });
  }
);

/**
 * Get all tweets from all followees of logged in user.
 * This is an extremely simplified timeline, for testing purposes with trivial
 * datasets.
 * There is not even pagination, ALL tweets are retrieved.
 * In a real world scenario, tweet selection is fine tuned to optimize
 * engagement and is tailored to user's preferences.
 */
router.get(
  "/timeline",
  requireAuth,
  async (
    req: TypedRequestQuery<{}>,
    res: Response<GetUserTweetsAndRetweets["response"]>
  ) => {
    const currentUserID = req.session.userID || -1;
    const tweetIDs = await runQuery<{ id: number }>(
      "SELECT distinct(tweet.id) \
       FROM tweet, user_follows as friendship \
       WHERE isReply = false AND (authorID = ? OR (authorID = followeeID AND followerID = ?))",
      [currentUserID, currentUserID]
    );
    const tweets = await Promise.all(
      tweetIDs.map(({ id }) => getTweet(id, currentUserID))
    );

    const followedUsers = await runQuery<{ username: string }>(
      "SELECT user.username \
       FROM user_follows, user\
       WHERE user.id = followeeID AND followerID = ?",
      [currentUserID]
    );
    const retweets = (
      await Promise.all(
        followedUsers.map(({ username }) =>
          getUserRetweets(username, currentUserID)
        )
      )
    ).flat();

    res.send({
      ok: true,
      data: { tweetsAndRetweets: mergeTweetsAndRetweets(tweets, retweets) },
    });
  }
);

router.get(
  "/trending",
  async (req: Request, res: Response<GetTrends["response"]>) => {
    const getRandomNumber = () => faker.number.int({ min: 1000, max: 10000 });
    const trends: Array<Pick<Trend, "category" | "trend">> = [
      { category: "Music", trend: faker.music.genre() },
      { category: "Airlines", trend: faker.airline.airline().name },
      { category: "Areas", trend: faker.location.city() },
      { category: "Brands", trend: faker.company.name() },
      { trend: faker.company.buzzNoun() },
      { category: "Animals", trend: faker.animal.bird() },
      { category: "Hacking", trend: faker.hacker.noun() },
      { category: "Vehicles", trend: faker.vehicle.vehicle() },
      { category: "Animals", trend: faker.animal.snake() },
      { category: "Finance", trend: faker.finance.currency().name },
    ];
    shuffleArray(trends);

    // Prepare response
    res.send({
      ok: true,
      data: {
        trends: trends.map((trend) => ({
          ...trend,
          tweets: getRandomNumber(),
        })),
      },
    });
    return;
  }
);

/**
 * Get tweet along with its direct responses, and for each response,
 * include nested responses in a depth first manner, according to the strategy
 * described in getTweetNestedReplies. In addition, get past reply thread
 * that the tweet responds to, until the conversation starter tweet.
 */
router.get(
  "/:tweetID",
  async (
    req: TypedRequestQuery<{ tweetID: string }, Fields<GetTweetParams>>,
    res: Response<GetTweet["response"]>
  ) => {
    const currentUserID = req.session.userID || -1;
    const { tweetID } = req.params;
    let middleTweet = {} as Tweet;

    // Get tweet information
    middleTweet = await getTweet(Number(tweetID), currentUserID);
    if (!middleTweet) {
      res.send({ ok: false });
      return;
    }

    if (req.query.noThread) {
      res.send({
        ok: true,
        data: { tweet: middleTweet, replies: [], previousReplies: [] },
      });
      return;
    }

    // Get previous replies from the original tweet until the middle one
    const previousReplies: Array<Tweet> = await getTweetPreviousReplies(
      currentUserID,
      middleTweet.isReply,
      middleTweet.referencedTweetID
    );

    // Reverse previous replies to have them in chronological order
    previousReplies.reverse();

    // Get tweet direct replies
    const replyIDs = await runQuery<{ id: number }>(
      "SELECT id FROM tweet \
         WHERE isReply = true AND referencedTweetID = ?",
      [tweetID]
    );

    const replies = await getTweets(
      replyIDs.map(({ id }) => id),
      currentUserID
    );

    // Get nested replies of each reply, in parallel
    const promises: Promise<Tweet[]>[] = [];
    for (const replyIndex in replies) {
      const reply = replies[replyIndex];
      promises.push(
        getTweetNestedReplies(reply.id, currentUserID, reply.replyDepth, 1)
      );
    }

    let nestedRepliesOfReplies: Tweet[][];
    try {
      nestedRepliesOfReplies = await Promise.all<Tweet[]>(promises);
    } catch (error) {
      res.send({ ok: false });
      return;
    }

    // Prepare response
    const threads: Thread[] = [];
    for (const replyIndex in replies) {
      const reply = replies[replyIndex];
      const nestedReplies = nestedRepliesOfReplies[replyIndex];
      threads.push({
        tweets: [reply, ...nestedReplies],
        hasMoreNestedReplies: nestedReplies.length < reply.replyDepth,
      });
    }

    res.send({
      ok: true,
      data: {
        tweet: middleTweet,
        replies: sort(threads),
        previousReplies: previousReplies,
      },
    });
    return;
  }
);

router.get(
  "/:tweetID/expandRepliesDownward",
  async (
    req: TypedRequestQuery<{ tweetID: string }>,
    res: Response<ExpandTweetReplies["response"]>
  ) => {
    const currentUserID = req.session.userID || -1;
    const { tweetID } = req.params;
    let tweet = {} as Tweet;

    // Get tweet information
    tweet = await getTweet(Number(tweetID), currentUserID);
    if (!tweet) {
      res.send({ ok: false });
      return;
    }

    // Retrieve all nested replies
    let replies: Tweet[];
    try {
      replies = await getTweetNestedReplies(
        tweet.id,
        currentUserID,
        tweet.replyDepth,
        -1
      );
    } catch (error) {
      res.send({ ok: false });
      return;
    }

    // Prepare response
    res.send({
      ok: true,
      data: { replies: [tweet, ...replies] },
    });
    return;
  }
);

router.get(
  "/:tweetID/expandRepliesUpward",
  async (
    req: TypedRequestQuery<{ tweetID: string }>,
    res: Response<ExpandTweetReplies["response"]>
  ) => {
    const currentUserID = req.session.userID || -1;
    const { tweetID } = req.params;
    let tweet = {} as Tweet;

    // Get tweet information
    tweet = await getTweet(Number(tweetID), currentUserID);
    if (!tweet) {
      res.send({ ok: false });
      return;
    }

    // Retrieve previous replies
    let replies: Tweet[];
    try {
      replies = await getTweetPreviousReplies(
        currentUserID,
        tweet.isReply,
        tweet.referencedTweetID
      );
    } catch (error) {
      res.send({ ok: false });
      return;
    }

    // Put them in chronological order
    replies.reverse();

    // Prepare response
    res.send({
      ok: true,
      data: { replies: [...replies, tweet] },
    });
    return;
  }
);

export default router;
