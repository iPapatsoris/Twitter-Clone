/* eslint-disable no-multi-str */
import express, { Request, Response } from "express";
import { currentUserID } from "../index.js";
import { NormalResponse } from "../api/common.js";
import {
  CreateTweet,
  ExpandTweetReplies,
  GetTweet,
  Thread,
} from "../api/tweet.js";
import { runQuery, simpleQuery, TypedRequestQuery } from "../util.js";
import { Tweet } from "../entities/tweet.js";
import {
  getTweet,
  getTweetNestedReplies,
  getTweetPreviousReplies,
  getTweets,
  getUserRetweets,
  mergeTweetsAndRetweets,
  updateParentTweetReplyDepth,
} from "../services/tweet.js";
import { GetUserTweetsAndRetweets } from "../api/user.js";

const router = express.Router();

router.post(
  "/",
  async (
    req: Request<{}, {}, CreateTweet["request"]>,
    res: Response<CreateTweet["response"]>
  ) => {
    const { tweet } = req.body;
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

    const [result] = await runQuery<{ insertId: number }>(
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
      let { usernameTags } = await getTweet(tweet.referencedTweetID);
      if (
        usernameTags &&
        usernameTags.findIndex((user) => user.id === currentUserID) === -1
      ) {
        usernameTags.push({ username, id: currentUserID });
      } else if (!usernameTags) {
        usernameTags = [{ username, id: currentUserID }];
      }
      await Promise.all(
        usernameTags.map((taggedUser) =>
          runQuery(
            "INSERT INTO tweet_tags_user (tweetID, userID) VALUES (?, ?)",
            [tweetID, taggedUser.id]
          )
        )
      );
    }
    res.send({ ok: true });
  }
);

router.patch(
  "/:tweetID/addView",
  (
    req: TypedRequestQuery<{ tweetID: string }>,
    res: Response<NormalResponse>
  ) => {
    const { tweetID } = req.params;
    const query =
      "UPDATE tweet \
       SET views = views + 1\
       WHERE id = ?";
    simpleQuery(res, query, [tweetID]);
  }
);

router.post(
  "/:tweetID/retweet",
  (
    req: TypedRequestQuery<{ tweetID: string }>,
    res: Response<NormalResponse>
  ) => {
    const query =
      "INSERT INTO user_reacts_to_tweet \
      (tweetID, userID, reactionDate, isRetweet, isLike) \
       VALUES (?, ?, NOW(), true, false)";
    simpleQuery(res, query, [req.params.tweetID, currentUserID]);
  }
);

router.post(
  "/:tweetID/like",
  (
    req: TypedRequestQuery<{ tweetID: string }>,
    res: Response<NormalResponse>
  ) => {
    const query =
      "INSERT INTO user_reacts_to_tweet \
      (tweetID, userID, reactionDate, isRetweet, isLike) \
       VALUES (?, ?, NOW(), false, true)";
    simpleQuery(res, query, [req.params.tweetID, currentUserID]);
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
  async (
    req: TypedRequestQuery<{}>,
    res: Response<GetUserTweetsAndRetweets["response"]>
  ) => {
    const tweetIDs = await runQuery<{ id: number }>(
      "SELECT id \
       FROM tweet, user_follows as friendship \
       WHERE authorID = followeeID AND followerID = ? AND isReply = false",
      [currentUserID]
    );
    const tweets = await Promise.all(tweetIDs.map(({ id }) => getTweet(id)));

    const followedUsers = await runQuery<{ id: number }>(
      "SELECT userID \
       FROM user_follows as friendship \
       WHERE userID = followeeID AND followerID = ?",
      [currentUserID]
    );
    const retweets = (
      await Promise.all(followedUsers.map(({ id }) => getUserRetweets(id)))
    ).flat();

    res.send({
      ok: true,
      data: { tweetsAndRetweets: mergeTweetsAndRetweets(tweets, retweets) },
    });
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
    req: TypedRequestQuery<{ tweetID: string }>,
    res: Response<GetTweet["response"]>
  ) => {
    const { tweetID } = req.params;
    let middleTweet = {} as Tweet;

    // Get tweet information
    middleTweet = await getTweet(Number(tweetID));
    if (!middleTweet) {
      res.send({ ok: false });
      return;
    }

    // Get previous replies from the original tweet until the middle one
    const previousReplies: Array<Tweet> = await getTweetPreviousReplies(
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

    const replies = await getTweets(replyIDs.map(({ id }) => id));

    // Get nested replies of each reply, in parallel
    const promises: Promise<Tweet[]>[] = [];
    for (const replyIndex in replies) {
      const reply = replies[replyIndex];
      promises.push(getTweetNestedReplies(reply.id, reply.replyDepth, 1));
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
        replies: threads,
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
    const { tweetID } = req.params;
    let tweet = {} as Tweet;

    // Get tweet information
    tweet = await getTweet(Number(tweetID));
    if (!tweet) {
      res.send({ ok: false });
      return;
    }

    // Retrieve all nested replies
    let replies: Tweet[];
    try {
      replies = await getTweetNestedReplies(tweet.id, tweet.replyDepth, -1);
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
    const { tweetID } = req.params;
    let tweet = {} as Tweet;

    // Get tweet information
    tweet = await getTweet(Number(tweetID));
    if (!tweet) {
      res.send({ ok: false });
      return;
    }

    // Retrieve previous replies
    let replies: Tweet[];
    try {
      replies = await getTweetPreviousReplies(
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
