/* eslint-disable no-multi-str */
import express, { Request, Response } from "express";
import { currentUserID } from "../index.js";
import { NormalResponse } from "../api/common.js";
import {
  CreateTweet,
  GetTweet,
  GetTweets,
  TweetWithNestedReplies,
} from "../api/tweet.js";
import db from "../connection.js";
import { printError, simpleQuery, TypedRequestQuery } from "../util.js";
import { Tweet } from "../entities/tweet.js";

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
      db,
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
    simpleQuery(db, res, query, [tweetID]);
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
    simpleQuery(db, res, query, [tweetID], sendResult);
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
    simpleQuery(db, res, query, [tweetID], sendResult);
  }
);

// Get tweet along with its direct responses, and for each response,
// include nested responses in a depth first manner, according to the strategy
// described in getTweetNestedReplies
router.get(
  "/:tweetID",
  (
    req: TypedRequestQuery<{ tweetID: string }>,
    res: Response<GetTweet["response"]>
  ) => {
    const { tweetID } = req.params;
    let tweet = {} as Tweet;

    // Get tweet information
    const query = "SELECT * FROM tweet WHERE id = ?";
    simpleQuery(db, res, query, [tweetID], (result: any) => {
      tweet = result[0];

      // Get tweet direct replies
      const query =
        "SELECT * FROM tweet WHERE \
         isReply = true AND referencedTweetID = ?";
      simpleQuery(db, res, query, [tweetID], async (result) => {
        const replies: Tweet[] = result;

        // Get nested replies of each reply, in parallel
        const promises: Promise<void>[] = [];
        // For each reply, hold an array of replies to be filled
        const promiseResults: Tweet[][] = [];
        for (let i = 0; i < replies.length; i++) {
          promiseResults.push([]);
        }
        for (const replyIndex in replies) {
          const reply = replies[replyIndex];
          promises.push(
            // Each Promise writes at the pos of the promiseResults array
            // that belongs to it
            new Promise<void>((resolve, reject) => {
              if (reply.replyDepth) {
                // Retrieve nested replies
                getTweetNestedReplies(reply.id, promiseResults[replyIndex], {
                  resolve,
                  reject,
                });
              } else {
                // Reply has no replies
                promiseResults[replyIndex] = [];
                resolve();
              }
            })
          );
        }

        await Promise.all(promises);

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
        res.send({ ok: true, tweet, replies: finalNestedReplies });
        return;
      });
    });
  }
);

/**
 * Get tweet replies with a depth-first strategy (replies of replies).
 * If a tweet/reply has multiple direct replies, always choose to expand the one
 * with the maximum depth of replies.
 *
 * In a real world scenario, the chosen reply to expand could be based on
 * a more sophisticated algorithm to improve engagement, for example by
 * prioritizing replies with many impressions, of users with many followers,
 * or responses of the original tweet creator.
 */
const getTweetNestedReplies = (
  tweetID: number,
  accumulator: Tweet[],
  promise: {
    resolve: (value: void | PromiseLike<void>) => void;
    reject: (reason?: any) => void;
  }
) => {
  db.query(
    "SELECT * FROM tweet WHERE isReply = true AND referencedTweetID = ? \
     ORDER BY replyDepth DESC LIMIT 1",
    [tweetID],
    (error, result) => {
      if (error) {
        printError(error);
        promise.reject();
      }
      accumulator.push(result[0]);
      const { replyDepth, id } = result[0];
      if (replyDepth > 0) {
        getTweetNestedReplies(id, accumulator, { ...promise });
      } else {
        promise.resolve();
      }
    }
  );
};

// Recursively update the replyDepth field of a tweet reply thread, to take
// into account a newly posted reply at the bottom of the tree
const updateParentTweetReplyDepth = (parentID: number, newDepth: number) => {
  db.query(
    "SELECT isReply, replyDepth, referencedTweetID FROM tweet WHERE id = ?",
    [parentID],
    (error, result) => {
      if (error) {
        printError(error);
        return;
      }
      const { isReply, replyDepth, referencedTweetID } = result[0];
      if (newDepth > replyDepth) {
        db.query(
          "UPDATE tweet SET replyDepth = ? WHERE id = ?",
          [newDepth, parentID],
          (error, result) => {
            if (error) {
              printError(error);
              return;
            }
            if (isReply) {
              updateParentTweetReplyDepth(referencedTweetID, newDepth + 1);
            }
          }
        );
      }
    }
  );
};

export default router;
