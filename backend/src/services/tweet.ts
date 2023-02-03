/* eslint-disable no-multi-str */
import db from "../connection.js";
import { printError, simpleQuery } from "../util.js";
import {
  convertQueryResultToTweet,
  Retweet,
  Tweet,
} from "../entities/tweet.js";

// Get past thread conversation that current tweet responds to
export const getTweetPreviousReplies = (
  isReply: boolean,
  referencedTweetID?: number,
  accumulator: Tweet[] = []
) => {
  return new Promise<Tweet[]>((resolve, reject) => {
    if (!isReply) {
      resolve(accumulator);
      return;
    }

    db.query(
      "SELECT tweet.*, username, name, isVerified, avatar FROM tweet, user \
       WHERE tweet.id = ? AND authorID = user.id",
      [referencedTweetID],
      (error, dbResult) => {
        if (error) {
          printError(error);
          reject();
          return;
        }
        const result = convertQueryResultToTweet(dbResult[0]);

        accumulator.push(result);
        const { isReply, referencedTweetID } = result;
        resolve(
          getTweetPreviousReplies(isReply, referencedTweetID, accumulator)
        );
      }
    );
  });
};

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
export const getTweetNestedReplies = (
  tweetID: number,
  // Tweet's actual reply depth
  tweetReplyDepth: number,
  // Max reply depth to look into.
  // Pass -1 to look until the end
  maxDepth: number,
  accumulator: Tweet[] = []
) => {
  return new Promise<Tweet[]>((resolve, reject) => {
    // Skip query if we already know that tweet has no replies
    // or if we have reached the max reply depth specified for this query
    if (tweetReplyDepth === 0 || maxDepth === 0) {
      return resolve(accumulator);
    }

    db.query(
      "SELECT tweet.*, username, name, isVerified, avatar FROM tweet, user \
       WHERE isReply = true AND referencedTweetID = ? AND user.id = authorID \
       ORDER BY replyDepth DESC LIMIT 1",
      [tweetID],
      (error, dbResult) => {
        if (error) {
          printError(error);
          reject();
          return;
        }
        const result = convertQueryResultToTweet(dbResult[0]);
        accumulator.push(result);
        const { replyDepth, id } = result;
        resolve(
          getTweetNestedReplies(
            id,
            replyDepth,
            maxDepth === -1 ? -1 : maxDepth - 1,
            accumulator
          )
        );
      }
    );
  });
};

// Recursively update the replyDepth field of a tweet reply thread, to take
// into account a newly posted reply at the bottom of the tree
export const updateParentTweetReplyDepth = (
  parentID: number,
  newDepth: number
) => {
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
          (error) => {
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

type Tags = Array<{ id: number; username: string }>;
export const getTweetTags = async (tweetID: number) => {
  return new Promise<Tags>((resolve, reject) => {
    const query =
      "SELECT username, userID FROM tweet_tags_user, user \
                 WHERE tweetID = ? AND user.id = userID";
    db.query(query, [tweetID], (error, result: Tags) => {
      if (error) {
        printError(error);
        reject();
      }
      console.log(result);

      resolve(result);
    });
  });
};

// TODO: catch inner rejected promise
export const getUserRetweets = (userID: number) => {
  const query =
    "SELECT tweet.*, retweetDate, username, name, isVerified, avatar \
       FROM tweet, user, user_retweets \
       WHERE authorID = user.id AND tweet.id = tweetID AND userID = ?";
  return new Promise<Retweet[]>((resolve, reject) => {
    db.query(query, [userID], async (error, result) => {
      if (!result || !result.length) {
        resolve([]);
      }
      const retweeter: Retweet["retweeter"] = await new Promise(
        (resolve, reject) => {
          const query = "SELECT id, name FROM user WHERE id = ?";
          db.query(query, [userID], (error, result) => {
            if (error) {
              printError(error);
              reject();
            } else if (result) {
              resolve(result[0].id);
            }
          });
        }
      );

      const retweets: Retweet[] = result.map((retweet: any) => ({
        retweeter,
        retweetDate: retweet.retweetDate,
        tweet: {
          ...convertQueryResultToTweet(retweet),
          ...getTweetStats(retweet),
        },
      }));
      for (const retweet of retweets) {
        retweet.tweet.usernameTags = await getTweetTags(retweet.tweet.id);
      }
      console.log(retweets);
      resolve(retweets);
    });
  });
};

export const getTweetStats = async (tweetID: number) => {
  const query =
    "SELECT count(*) as totalRetweets FROM user_retweets WHERE tweetID = ?";
  const totalRetweets = await new Promise<number>((resolve, reject) => {
    db.query(query, [tweetID], async (error, result) => {
      if (error) {
        printError(error);
        reject();
      } else {
        resolve(result[0].totalRetweets);
      }
    });
  });
  const totalLikes = await new Promise<number>((resolve, reject) => {
    const query =
      "SELECT count(*) as totalLikes FROM user_likes_tweet WHERE tweetID = ?";
    db.query(query, [tweetID], (error, result) => {
      if (error) {
        printError(error);
        reject();
      } else {
        resolve(result[0].totalLikes);
      }
    });
  });

  const totalReplies = await new Promise<number>((resolve, reject) => {
    const query =
      "SELECT count(*) as totalReplies FROM tweet \
       WHERE referencedTweetID = ? AND isReply = true";
    db.query(query, [tweetID], (error, result) => {
      if (error) {
        printError(error);
        reject();
      } else {
        resolve(result[0].totalReplies);
      }
    });
  });

  return { totalRetweets, totalLikes, totalReplies };
};

export const getTotalUserTweets = async (userID: number) => {
  return await new Promise<number>((resolve, reject) => {
    const query =
      "SELECT count(*) as totalTweets FROM tweet WHERE authorID = ?";
    db.query(query, [userID], (error, result) => {
      if (error) {
        printError(error);
        reject();
      } else {
        resolve(result[0].totalTweets);
      }
    });
  });
};
