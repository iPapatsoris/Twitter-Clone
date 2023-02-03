/* eslint-disable no-multi-str */
import express, { Request, Response } from "express";
import { sha256 } from "js-sha256";
import { currentUserID } from "../index.js";
import { NormalResponse } from "../api/common.js";
import ErrorCodes from "../api/errorCodes.js";
import { GetTweets, NestedReplies } from "../api/tweet.js";
import {
  CreateUser,
  GetUser,
  GetUserFields,
  GetUserFollowees,
  GetUserFollowers,
  GetUserRepliesAndRetweets,
  GetUserTweetsAndRetweets,
  UpdateUser,
  UpdateUserFields,
} from "../api/user.js";
import { checkPermissions } from "../permissions.js";
import {
  Fields,
  printError,
  removeArrayFields,
  simpleQuery,
  TypedRequestQuery,
} from "../util.js";
import {
  convertQueryResultToTweet,
  convertQueryResultToTweetArray,
  Tweet,
} from "../entities/tweet.js";
import {
  getTotalUserTweets,
  getTweetStats,
  getTweetTags,
  getUserRetweets,
} from "../services/tweet.js";
import { User } from "../entities/user.js";

const router = express.Router();

router
  .route("/")
  .post(
    (
      req: Request<{}, {}, CreateUser["request"]>,
      res: Response<CreateUser["response"]>
    ) => {
      const { user } = req.body;
      const hash = sha256(user.password);
      const query =
        "INSERT INTO user \
      (username, password, email, name, birthDate, joinedDate)\
      VALUES (?, ?, ?, ?, ?, NOW())";
      simpleQuery(
        res,
        query,
        [user.username, hash, user.email, user.name, user.birthDate],
        undefined,
        (error) => {
          let errorCode: number | undefined;
          if (error.code === "ER_DUP_ENTRY") {
            errorCode = ErrorCodes.UsernameAlreadyExists;
          }
          res.send({
            ok: false,
            errorCode,
          });
        }
      );
    }
  )
  .patch(
    (
      req: TypedRequestQuery<
        {},
        Fields<UpdateUserFields>,
        UpdateUser["request"]
      >,
      res: Response<UpdateUser["response"]>
    ) => {
      const fields = Object.keys(req.body);
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
      const user = req.body;
      const values = Object.values(req.body);

      const query =
        "UPDATE user SET " + preparedFields.join("") + " WHERE id = ?";
      simpleQuery(res, query, [...values, currentUserID], () =>
        res.send({ ok: true, user: user })
      );
    }
  );

router.get(
  "/:id",
  (
    req: TypedRequestQuery<{ id: string }, Fields<GetUserFields>>,
    res: Response<GetUser["response"]>
  ) => {
    const fields = Object.keys(req.query);
    // Make sure request has included some fields to query about
    if (!fields.length) {
      res.send({ ok: false, errorCode: ErrorCodes.NoFieldsSpecified });
      return;
    }

    // Allow only whitelisted fields
    if (!checkPermissions("GetUser", fields)) {
      console.log("Failed permissions test");
      res.send({ ok: false, errorCode: ErrorCodes.PermissionDenied });
      return;
    }

    // Frienship fields will be handled on a seperate queries, so remove them
    const seperateFields = removeArrayFields<typeof fields[0]>(fields, [
      "totalFollowees",
      "totalFollowers",
      "totalTweets",
    ]);

    // Set flags for seperate fields to query
    let getTotalFollowees = false;
    let getTotalFollowers = false;
    let getTotalTweets = false;
    seperateFields.forEach((field) => {
      if (field === "totalFollowees") {
        getTotalFollowees = true;
      } else if (field === "totalFollowers") {
        getTotalFollowers = true;
      } else if (field === "totalTweets") {
        getTotalTweets = true;
      }
    });

    // Adjust query fields to select
    const views = fields.map((f) => "," + f);
    const userID = req.params.id;

    // Query regular fields
    simpleQuery(
      res,
      "SELECT id" + views.join("") + " FROM user WHERE id = ?",
      [userID],
      async (result: any) => {
        let finalResult: GetUser["response"]["user"] = result[0];
        if (finalResult && getTotalTweets) {
          finalResult.totalTweets = await getTotalUserTweets(Number(userID));
        }
        if (!getTotalFollowers && !getTotalFollowees) {
          res.send({ ok: true, user: finalResult });
          return;
        }

        // Query friendship fields
        const totalFollowersQuery =
          "SELECT COUNT(*) as totalFollowers \
         FROM user_follows as friendship \
         WHERE friendship.followeeID = ?";
        const totalFolloweesQuery =
          "SELECT COUNT(*) as totalFollowees \
         FROM user_follows as friendship \
         WHERE friendship.followerID = ?";

        if (getTotalFollowers && getTotalFollowees) {
          // Query both followers and followees
          simpleQuery(res, totalFollowersQuery, [userID], (result) => {
            finalResult = {
              ...finalResult,
              ...result[0],
            };
            simpleQuery(res, totalFolloweesQuery, [userID], (result) => {
              finalResult = {
                ...finalResult,
                ...result[0],
              };
              res.send({ ok: true, user: finalResult });
            });
          });
        } else if (getTotalFollowers || getTotalFollowees) {
          // Query followers or followees
          simpleQuery(
            res,
            getTotalFollowers ? totalFollowersQuery : totalFolloweesQuery,
            [userID],
            (result) => {
              finalResult = {
                ...finalResult,
                ...result[0],
              };
              res.send({ ok: true, user: finalResult });
            }
          );
        }
      }
    );
  }
);

router
  .route("/:userID/follow")
  .post(
    (
      req: TypedRequestQuery<{ userID: string }>,
      res: Response<NormalResponse>
    ) => {
      simpleQuery(
        res,
        "INSERT INTO user_follows (followerID, followeeID) VALUES (?, ?)",
        [currentUserID, req.params.userID]
      );
    }
  )
  .delete(
    (
      req: TypedRequestQuery<{ userID: string }>,
      res: Response<NormalResponse>
    ) => {
      simpleQuery(
        res,
        "DELETE FROM user_follows WHERE followerID = ? AND followeeID = ?",
        [currentUserID, req.params.userID]
      );
    }
  );

router.get(
  "/:userID/followers",
  (
    req: TypedRequestQuery<{ userID: string }>,
    res: Response<GetUserFollowers["response"]>
  ) => {
    const { userID } = req.params;
    const query =
      "SELECT user.id as id, username, name, isVerified, avatar, bio \
       FROM user_follows, user \
       WHERE followeeID = ? AND followerID = user.id";
    const sendResult = (result: any) => {
      res.send({ ok: true, followers: result });
    };
    simpleQuery(res, query, [userID], sendResult);
  }
);

router.get(
  "/:userID/followees",
  (
    req: TypedRequestQuery<{ userID: string }>,
    res: Response<GetUserFollowees["response"]>
  ) => {
    const { userID } = req.params;
    const query =
      "SELECT user.id as id, username, name, isVerified, avatar, bio \
       FROM user_follows, user \
       WHERE followerID = ? AND followeeID = user.id";
    const sendResult = (result: any) => {
      res.send({ ok: true, followees: result });
    };
    simpleQuery(res, query, [userID], sendResult);
  }
);

// Return user's tweets and retweets
router.get(
  "/:userID/tweets",
  (
    req: TypedRequestQuery<{ userID: string }>,
    res: Response<GetUserTweetsAndRetweets["response"]>
  ) => {
    const { userID } = req.params;
    const query =
      "SELECT tweet.*, name, username, avatar, isVerified \
       FROM tweet, user \
       WHERE tweet.authorID = ? AND isReply = false AND user.id = authorID";
    const sendResult = async (tweets: Array<Tweet & Partial<User>>) => {
      const retweets = await getUserRetweets(Number(userID));
      const finalTweets: GetUserTweetsAndRetweets["response"]["tweetsAndRetweets"] =
        tweets.map((tweet) => ({
          tweet: {
            ...convertQueryResultToTweet(tweet),
            ...getTweetStats(tweet.id),
          },
        }));
      const tweetsAndRetweets = finalTweets.concat(
        retweets.map((retweet) => ({ retweet: retweet }))
      );
      tweetsAndRetweets.sort((a, b) => {
        const aDate = a.tweet ? a.tweet.creationDate : a.retweet?.retweetDate;
        const bDate = b.tweet ? b.tweet.creationDate : b.retweet?.retweetDate;
        console.log(aDate, " vs ", bDate);

        if (aDate && bDate) {
          if (new Date(aDate) > new Date(bDate)) {
            return -1;
          } else {
            return 1;
          }
        }
        return 0;
      });

      res.send({ ok: true, tweetsAndRetweets });
    };
    simpleQuery(res, query, [userID], sendResult);
  }
);

// Return user's replies and retweets
// TODO: get also tweet stats
router.get(
  "/:userID/replies",
  (
    req: TypedRequestQuery<{ userID: string }>,
    res: Response<GetUserRepliesAndRetweets["response"]>
  ) => {
    const { userID } = req.params;
    const query =
      "SELECT tweet.*, name, username, avatar, isVerified \
       FROM tweet, user \
       WHERE authorID = ? AND isReply = true \
       AND authorID = user.id";
    const sendResult = async (result: any) => {
      const replies = convertQueryResultToTweetArray(result);
      const promises: Array<Promise<NestedReplies>> = replies.map(
        (reply) =>
          new Promise((resolve, reject) => {
            const getTweet = (
              referencedTweetID: number,
              handleSuccess: (result: any) => void
            ) =>
              simpleQuery(
                res,
                "SELECT tweet.*, name, username, avatar, isVerified \
                 FROM tweet, user \
                 WHERE authorID = user.id AND tweet.id = ?",
                [referencedTweetID],
                handleSuccess,
                (error) => {
                  printError(error);
                  reject();
                }
              );
            if (!reply.referencedTweetID) {
              res.send({ ok: false });
              return;
            }
            getTweet(reply.referencedTweetID, async (result) => {
              const previousReply = convertQueryResultToTweet(result[0]);
              let originalTweet: Tweet | null = null;
              let hasMoreNestedReplies = false;
              if (previousReply.isReply && previousReply.referencedTweetID) {
                getTweet(previousReply.referencedTweetID, async (result) => {
                  originalTweet = convertQueryResultToTweet(result[0]);
                  if (originalTweet.isReply) {
                    hasMoreNestedReplies = true;
                    const query =
                      "SELECT tweet.*, name, username, avatar, isVerified \
                       FROM tweet, user \
                       WHERE tweet.id = ? AND authorID = user.id";
                    simpleQuery(
                      res,
                      query,
                      [originalTweet.rootTweetID],
                      async (result) => {
                        originalTweet = convertQueryResultToTweet(result[0]);

                        const thread = [originalTweet, previousReply, reply];
                        for (const reply of thread) {
                          reply.usernameTags = await getTweetTags(reply.id);
                        }
                        resolve({
                          nestedReplies: thread,
                          hasMoreNestedReplies,
                        });
                      }
                    );
                  } else {
                    const thread = [originalTweet, previousReply, reply];
                    for (const reply of thread) {
                      reply.usernameTags = await getTweetTags(reply.id);
                    }
                    resolve({
                      nestedReplies: [originalTweet, previousReply, reply],
                      hasMoreNestedReplies,
                    });
                  }
                });
              } else {
                const thread = [previousReply, reply];
                for (const reply of thread) {
                  reply.usernameTags = await getTweetTags(reply.id);
                }
                resolve({
                  nestedReplies: [previousReply, reply],
                  hasMoreNestedReplies,
                });
              }
            });
          })
      );
      const promiseResults = await Promise.all(promises);

      const retweets = await getUserRetweets(Number(req.params.userID));

      const finalReplies: GetUserRepliesAndRetweets["response"]["repliesAndRetweets"] =
        promiseResults.map((reply) => ({
          reply,
        }));
      const repliesAndRetweets = finalReplies.concat(
        retweets.map((retweet) => ({ retweet: retweet }))
      );

      console.log(repliesAndRetweets);

      const getMostRecentReplyDate = (thread: NestedReplies) =>
        thread.nestedReplies[thread.nestedReplies.length - 1].creationDate;

      repliesAndRetweets.sort((a, b) => {
        const aDate = a.reply
          ? getMostRecentReplyDate(a.reply)
          : a.retweet?.retweetDate;
        const bDate = b.reply
          ? getMostRecentReplyDate(b.reply)
          : b.retweet?.retweetDate;
        console.log(aDate, " vs ", bDate);

        if (aDate && bDate) {
          if (new Date(aDate) > new Date(bDate)) {
            return -1;
          } else {
            return 1;
          }
        }
        return 0;
      });
      res.send({ ok: true, repliesAndRetweets });
    };
    simpleQuery(res, query, [userID], sendResult);
  }
);

// TODO: get tweet stats, convert tweet
router.get(
  "/:userID/likes",
  (
    req: TypedRequestQuery<{ userID: string }>,
    res: Response<GetTweets["response"]>
  ) => {
    const { userID } = req.params;
    const query =
      "SELECT tweet.*, name, username, avatar, isVerified \
       FROM tweet, user_likes_tweet, user \
       WHERE userID = ? AND tweetID = tweet.id AND user.id = authorID \
       ORDER BY creationDate DESC";
    const sendResult = (result: any) => {
      res.send({ ok: true, tweets: result });
    };
    simpleQuery(res, query, [userID], sendResult);
  }
);

export default router;
