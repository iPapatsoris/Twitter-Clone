/* eslint-disable no-multi-str */
import express, { Request, Response } from "express";
import { currentUserID } from "../index.js";
import { NormalResponse } from "../../../api/common.js";
import { CreateTweet } from "../../../api/tweet.js";
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
  "/:tweetID/view",
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

export default router;
