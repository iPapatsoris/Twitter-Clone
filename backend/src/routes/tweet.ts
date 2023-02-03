/* eslint-disable no-multi-str */
import express, { Request, response, Response } from "express";
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
import { convertQueryResultToTweets, Tweet } from "../entities/tweet.js";
import {
  getTweetNestedReplies,
  getTweetPreviousReplies,
  getTweetTags,
  updateParentTweetReplyDepth,
} from "../services/tweet.js";

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
      rootTweetID = await new Promise<number>((resolve, reject) => {
        const query = "SELECT rootTweetID FROM tweet WHERE id = ?";
        simpleQuery(
          res,
          query,
          [tweet.referencedTweetID],
          (result) => {
            if (result[0].rootTweetID) {
              resolve(result[0].rootTweetID);
            } else if (tweet.referencedTweetID !== undefined) {
              resolve(tweet.referencedTweetID);
            }
          },
          () => reject()
        );
      });
    }

    const query =
      "INSERT INTO tweet \
      (authorID, text, isReply, referencedTweetID, views, \
      replyDepth, rootTweetID, creationDate)\
      VALUES (?, ?, ?, ?, 0, 0, ?, NOW())";
    simpleQuery(
      res,
      query,
      [
        currentUserID,
        tweet.text,
        tweet.isReply,
        tweet.referencedTweetID,
        rootTweetID,
      ],
      (result) => {
        if (tweet.isReply && tweet.referencedTweetID !== undefined) {
          const tweetID = result.insertId;

          updateParentTweetReplyDepth(tweet.referencedTweetID, 1);
          const query = "SELECT authorID FROM tweet WHERE id = ?";
          simpleQuery(response, query, [tweet.referencedTweetID], (result) => {
            const previousReplyAuthorID: number = result[0].authorID;
            const query =
              "SELECT user.id \
               FROM tweet_tags_user, user \
               WHERE tweetID = ? AND userID = user.id";
            simpleQuery(
              res,
              query,
              [tweet.referencedTweetID],
              async (taggedUsers: { id: number }[]) => {
                if (
                  taggedUsers.findIndex(
                    (user) => user.id === previousReplyAuthorID
                  ) === -1
                ) {
                  taggedUsers.push({ id: previousReplyAuthorID });
                }
                await Promise.all(
                  taggedUsers.map(
                    (taggedUser) =>
                      new Promise<void>((resolve, reject) => {
                        const query =
                          "INSERT INTO tweet_tags_user (tweetID, userID) VALUES (?, ?)";
                        simpleQuery(
                          response,
                          query,
                          [tweetID, taggedUser.id],
                          () => resolve(),
                          () => reject()
                        );
                      })
                  )
                );
              }
            );
          });
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
// TODO: get tweets and retweets in chronological order, no replies
router.get(
  "/timeline",
  (req: TypedRequestQuery<{}>, res: Response<GetTweets["response"]>) => {
    const query =
      "SELECT tweet.*, name, username, avatar, isVerified \
       FROM tweet, user, user_follows as friendship \
       WHERE authorID = user.id AND authorID = followeeID AND followerID = ? \
       AND isReply = false";
    simpleQuery(res, query, [currentUserID], async (result: any) => {
      res.send({ ok: true, tweets: convertQueryResultToTweets(result) });
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
      "SELECT tweet.*, name, username, avatar, isVerified FROM tweet, user \
       WHERE tweet.id = ? AND authorID = user.id";
    simpleQuery(res, query, [tweetID], async (result: any) => {
      if (!result.length) {
        res.send({ ok: false });
        return;
      }
      middleTweet = convertQueryResultToTweets(result)[0];

      // Get previous replies from the original tweet until the middle one
      const previousReplies: Array<Tweet> = await getTweetPreviousReplies(
        middleTweet.isReply,
        middleTweet.referencedTweetID
      );

      // Reverse previous replies to have them in chronological order
      previousReplies.reverse();

      // Get replies user tags
      for (const previousReply of previousReplies) {
        previousReply.usernameTags = await getTweetTags(previousReply.id);
      }

      // Get middle tweet's user tags
      middleTweet.usernameTags = await getTweetTags(middleTweet.id);

      // Get tweet direct replies
      const query =
        "SELECT tweet.*, username, name, avatar, isVerified FROM tweet, user \
         WHERE isReply = true AND referencedTweetID = ? AND authorID = user.id";
      simpleQuery(res, query, [tweetID], async (dbResult) => {
        const result = convertQueryResultToTweets(dbResult);
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
        for (let i = 0; i < replies.length; i++) {
          // Tags specific to this subtree of replies.
          const reply = replies[i];
          reply.usernameTags = await getTweetTags(reply.id);
          for (const nestedReply of promiseResults[i]) {
            nestedReply.usernameTags = await getTweetTags(nestedReply.id);
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

        // Accumulate total number of retweets

        res.send({
          ok: true,
          tweet: middleTweet,
          replies: finalNestedReplies,
          previousReplies: previousReplies,
        });
        return;
      });
    });
  }
);

router.get(
  "/:tweetID/expandRepliesDownward",
  (
    req: TypedRequestQuery<{ tweetID: string }>,
    res: Response<ExpandTweetReplies["response"]>
  ) => {
    const { tweetID } = req.params;
    let tweet = {} as Tweet;

    // Get tweet information
    const query =
      "SELECT tweet.*, username, name, avatar, isVerified \
       FROM tweet, user WHERE tweet.id = ? AND user.id = authorID";
    simpleQuery(res, query, [tweetID], async (result: any) => {
      if (!result.length) {
        res.send({ ok: false });
        return;
      }
      tweet = convertQueryResultToTweets(result)[0];

      // Retrieve all nested replies
      let replies: Tweet[];
      try {
        replies = await getTweetNestedReplies(tweet.id, tweet.replyDepth, -1);
      } catch (error) {
        res.send({ ok: false });
        return;
      }

      // Get tweet and replies user tags
      tweet.usernameTags = await getTweetTags(tweet.id);
      for (const reply of replies) {
        reply.usernameTags = await getTweetTags(reply.id);
      }

      // Prepare response
      res.send({
        ok: true,
        replies: [tweet, ...replies],
      });
      return;
    });
  }
);

router.get(
  "/:tweetID/expandRepliesUpward",
  (
    req: TypedRequestQuery<{ tweetID: string }>,
    res: Response<ExpandTweetReplies["response"]>
  ) => {
    const { tweetID } = req.params;
    let tweet = {} as Tweet;

    // Get tweet information
    const query =
      "SELECT tweet.*, username, name, avatar, isVerified \
       FROM tweet, user WHERE tweet.id = ? AND user.id = authorID";
    simpleQuery(res, query, [tweetID], async (result: any) => {
      if (!result.length) {
        res.send({ ok: false });
        return;
      }
      tweet = convertQueryResultToTweets(result)[0];

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

      // Get tweet and replies user tags
      tweet.usernameTags = await getTweetTags(tweet.id);
      for (const reply of replies) {
        reply.usernameTags = await getTweetTags(reply.id);
      }

      // Prepare response
      res.send({
        ok: true,
        replies: [...replies, tweet],
      });
      return;
    });
  }
);

export default router;
