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
  GetTimeline,
  SimulateNewTweets,
} from "../api/tweet.js";
import { Fields, runQuery, shuffleArray, TypedRequestQuery } from "../util.js";
import { Tweet } from "../entities/tweet.js";
import {
  getTimeline,
  getTweet,
  getTweetNestedReplies,
  getTweetPreviousReplies,
  getTweets,
  getUserReactionsToTweet,
  insertTweet,
  insertUserReaction,
} from "../services/tweet.js";
import { requireAuth } from "../middleware/auth.js";
import { createFakeTweet } from "../db/populate/populateTweets.js";

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

    const tweetID = await insertTweet(tweet, currentUserID);
    const newTweet = await getTweet(tweetID, currentUserID);
    res.send({ ok: true, data: { tweet: newTweet } });
  }
);

router.post(
  "/timeline/simulateNewTweets",
  requireAuth,
  async (req: Request<{}, {}, SimulateNewTweets["request"]>, res: Response) => {
    const currentUserID = req.session.userID!;
    const followedUsers = await runQuery<{ id: number }>(
      "SELECT user.id \
       FROM user_follows, user\
       WHERE user.id = followeeID AND followerID = ?",
      [currentUserID]
    );

    if (!followedUsers.length) {
      res.send({ ok: true });
      return;
    }

    for (let i = 0; i < req.body.numberOfNewTweets; i++) {
      const followedUser =
        i < followedUsers.length ? followedUsers[i] : followedUsers[0];
      await insertTweet(createFakeTweet(), followedUser.id);
    }

    res.send({ ok: true });
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
    const success = await insertUserReaction(
      parseInt(tweetID),
      userID!,
      "retweet"
    );
    res.send({
      ok: success,
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
    const { isRetweet } = await getUserReactionsToTweet(
      parseInt(tweetID),
      userID!
    );

    if (!isRetweet) {
      res.send({ ok: false });
      return;
    }
    await runQuery(
      "DELETE FROM user_reacts_to_tweet \
        WHERE userID = ? AND tweetID = ? AND reaction = 'retweet'",
      [userID, tweetID]
    );
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
    const success = await insertUserReaction(
      parseInt(tweetID),
      userID!,
      "like"
    );

    res.send({
      ok: success,
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
    const { isLike } = await getUserReactionsToTweet(
      parseInt(tweetID),
      userID!
    );

    if (!isLike) {
      res.send({ ok: false });
      return;
    }
    await runQuery(
      "DELETE FROM user_reacts_to_tweet \
        WHERE userID = ? AND tweetID = ? AND reaction = 'like'",
      [userID, tweetID]
    );
    res.send({
      ok: true,
      data: { ...(await getTweet(parseInt(tweetID), userID!)) },
    });
  }
);

/**
 * Get tweets/retweets from followees of logged in user.
 * In a real world scenario, tweet selection would be fine tuned to optimize
 * engagement and tailor to user's preferences. Uses cursor based pagination
 * to retrieve tweets that are less recent than previous page (for infinite
 * scrolling).
 */
router.get(
  "/timeline/down",
  requireAuth,
  async (
    req: Request<{}, {}, {}, GetTimeline["requestQueryParams"]>,
    res: Response<GetTimeline["response"]>
  ) => {
    const cursor = parseInt(req.query.nextCursor);
    const pageSize = parseInt(req.query.pageSize);
    const currentUserID = req.session.userID || -1;

    const { pageResults, nextCursor } = await getTimeline({
      cursor,
      currentUserID,
      pageSize,
      direction: "down",
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
 * Get tweets/retweets from followees of logged in user, that are more recent
 * than given cursor.
 */
router.get(
  "/timeline/up",
  requireAuth,
  async (
    req: Request<{}, {}, {}, GetTimeline["requestQueryParams"]>,
    res: Response<GetTimeline["response"]>
  ) => {
    const cursor = parseInt(req.query.nextCursor);
    const pageSize = parseInt(req.query.pageSize);
    const currentUserID = req.session.userID || -1;

    const { pageResults, nextCursor } = await getTimeline({
      cursor,
      currentUserID,
      pageSize,
      direction: "up",
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

    const sortedThreads = threads.sort((a, b) => (a > b ? -1 : 1));

    res.send({
      ok: true,
      data: {
        tweet: middleTweet,
        replies: sortedThreads,
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
