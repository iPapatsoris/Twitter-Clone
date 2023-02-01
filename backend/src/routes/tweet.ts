/* eslint-disable no-multi-str */
import express, { Request, Response } from "express";
import { currentUserID } from "../index.js";
import { NormalResponse } from "../api/common.js";
import {
  CreateTweet,
  ExpandTweetReplies,
  GetTweet,
  GetTweets,
  TweetWithNestedReplies,
} from "../api/tweet.js";
import { simpleQuery, TypedRequestQuery } from "../util.js";
import {
  convertQueryResultToTweet,
  convertQueryResultToTweetArray,
  Tweet,
} from "../entities/tweet.js";
import {
  getTweetNestedReplies,
  getTweetPreviousReplies,
  updateParentTweetReplyDepth,
} from "../services/tweet.js";

const router = express.Router();

router.post(
  "/",
  (
    req: Request<{}, {}, CreateTweet["request"]>,
    res: Response<CreateTweet["response"]>
  ) => {
    const { tweet } = req.body;
    const query =
      "INSERT INTO tweet \
      (authorID, text, isReply, isRetweet, referencedTweetID, views, \
      replyDepth, creationDate)\
      VALUES (?, ?, ?, ?, ?, 0, 0, NOW())";
    simpleQuery(
      res,
      query,
      [
        currentUserID,
        tweet.text,
        tweet.isReply,
        tweet.isRetweet,
        tweet.referencedTweetID,
      ],
      () => {
        if (tweet.isReply && tweet.referencedTweetID !== undefined) {
          updateParentTweetReplyDepth(tweet.referencedTweetID, 1);
        }
        res.send({ ok: true });
      }
    );
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

router.get(
  "/:tweetID/replies",
  (
    req: TypedRequestQuery<{ tweetID: string }>,
    res: Response<GetTweets["response"]>
  ) => {
    const { tweetID } = req.params;
    const query =
      "SELECT * \
       FROM tweet \
       WHERE isReply = true AND referencedTweetID = ?";
    const sendResult = (result: any) => {
      res.send({ ok: true, tweets: result });
    };
    simpleQuery(res, query, [tweetID], sendResult);
  }
);

router.get(
  "/:tweetID/retweets",
  (
    req: TypedRequestQuery<{ tweetID: string }>,
    res: Response<GetTweets["response"]>
  ) => {
    const { tweetID } = req.params;
    const query =
      "SELECT * \
       FROM tweet \
       WHERE isRetweet = true AND referencedTweetID = ?";
    const sendResult = (result: any) => {
      res.send({ ok: true, tweets: result });
    };
    simpleQuery(res, query, [tweetID], sendResult);
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
  (req: TypedRequestQuery<{}>, res: Response<GetTweets["response"]>) => {
    const query =
      "SELECT tweet.*, name, username, avatar, isVerified \
       FROM tweet, user, user_follows as friendship \
       WHERE authorID = user.id AND authorID = followeeID AND followerID = ?";
    simpleQuery(res, query, [currentUserID], async (result: any) => {
      res.send({ ok: true, tweets: convertQueryResultToTweetArray(result) });
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
  (
    req: TypedRequestQuery<{ tweetID: string }>,
    res: Response<GetTweet["response"]>
  ) => {
    const { tweetID } = req.params;
    let middleTweet = {} as Tweet;

    // Get tweet information
    const query =
      "SELECT tweet.*, name, username, avatar, isVerified FROM tweet, user WHERE tweet.id = ? AND authorID = user.id";
    simpleQuery(res, query, [tweetID], async (result: any) => {
      if (!result.length) {
        res.send({ ok: false });
        return;
      }
      middleTweet = convertQueryResultToTweet(result[0]);

      // Get previous replies from the original tweet until the middle one
      const previousReplies: Array<Tweet> = await getTweetPreviousReplies(
        middleTweet.isReply,
        middleTweet.referencedTweetID
      );

      // Reverse previous replies to have them in chronological order, and
      // accumulate username tags along the way, for each response
      const previousRepliesWithTags: Array<Tweet & { usernameTags: string[] }> =
        [];
      const usernameTagsSet = new Set<string>();
      for (let i = previousReplies.length - 1; i >= 0; i--) {
        const reply = previousReplies[i];

        previousRepliesWithTags.push({
          ...reply,
          usernameTags: Array.from(usernameTagsSet),
        });
        usernameTagsSet.add(reply.author.username);
      }

      middleTweet.usernameTags = Array.from(usernameTagsSet);
      usernameTagsSet.add(middleTweet.author.username);

      // Get tweet direct replies
      const query =
        "SELECT tweet.*, username, name, avatar, isVerified FROM tweet, user WHERE \
         isReply = true AND referencedTweetID = ? AND authorID = user.id";
      simpleQuery(res, query, [tweetID], async (dbResult) => {
        const result = convertQueryResultToTweetArray(dbResult);
        const replies: Tweet[] = result;

        // Get nested replies of each reply, in parallel
        const promises: Promise<Tweet[]>[] = [];
        for (const replyIndex in replies) {
          const reply = replies[replyIndex];
          promises.push(getTweetNestedReplies(reply.id, reply.replyDepth, 1));
        }

        let promiseResults: Tweet[][] = [];
        try {
          promiseResults = await Promise.all<Tweet[]>(promises);
        } catch (error) {
          res.send({ ok: false });
          return;
        }

        // Accumulate username tags for replies and nested replies
        // Also include past conversation tags (initialize with usernameTagsSet)
        for (let i = 0; i < replies.length; i++) {
          // Tags specific to this subtree of replies.
          const localUsernameTagsSet: Set<string> = new Set(usernameTagsSet);
          const reply = replies[i];
          reply.usernameTags = Array.from(localUsernameTagsSet);
          localUsernameTagsSet.add(reply.author.username);
          for (const nestedReply of promiseResults[i]) {
            nestedReply.usernameTags = Array.from(localUsernameTagsSet);
            localUsernameTagsSet.add(nestedReply.author.username);
          }
        }

        // Prepare response
        const finalNestedReplies: TweetWithNestedReplies[] = [];
        for (const replyIndex in replies) {
          const reply = replies[replyIndex];
          const promiseResult = promiseResults[replyIndex];
          finalNestedReplies.push({
            ...reply,
            nestedReplies: promiseResult,
            hasMoreNestedReplies: promiseResult.length < reply.replyDepth,
          });
        }

        res.send({
          ok: true,
          tweet: middleTweet,
          replies: finalNestedReplies,
          previousReplies: previousRepliesWithTags,
        });
        return;
      });
    });
  }
);

router.get(
  "/:tweetID/expandReplies",
  (
    req: TypedRequestQuery<{ tweetID: string }>,
    res: Response<ExpandTweetReplies["response"]>
  ) => {
    const { tweetID } = req.params;
    let tweet = {} as Tweet;

    // Get tweet information
    const query = "SELECT * FROM tweet WHERE id = ?";
    simpleQuery(res, query, [tweetID], async (result: any) => {
      if (!result.length) {
        res.send({ ok: false });
        return;
      }
      tweet = convertQueryResultToTweet(result[0]);

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
        replies: {
          ...tweet,
          hasMoreNestedReplies: false,
          nestedReplies: replies,
        },
      });
      return;
    });
  }
);

export default router;
