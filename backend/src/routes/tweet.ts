/* eslint-disable no-multi-str */
import express, { Request, Response } from "express";
import { currentUserID } from "../index.js";
import { NormalResponse } from "../api/common.js";
import { CreateTweet, GetTweets } from "../api/tweet.js";
import db from "../connection.js";
import { simpleQuery, TypedRequestQuery } from "../util.js";

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
      (authorID, text, isReply, isRetweet, referencedTweetID, views, creationDate)\
      VALUES (?, ?, ?, ?, ?, 0, NOW())";
    simpleQuery(db, res, query, [
      currentUserID,
      tweet.text,
      tweet.isReply,
      tweet.isRetweet,
      tweet.referencedTweetID,
    ]);
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
export default router;
