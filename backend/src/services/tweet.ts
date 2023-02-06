/* eslint-disable no-multi-str */
import { runQuery } from "../util.js";
import {
  convertQueryResultToTweets,
  Retweet,
  Tweet,
} from "../entities/tweet.js";
import { currentUserID } from "../index.js";
import { GetUserTweetsAndRetweets } from "../api/user.js";

// Get past thread conversation that current tweet responds to
export const getTweetPreviousReplies = async (
  isReply: boolean,
  referencedTweetID?: number,
  accumulator: Tweet[] = []
) => {
  if (!isReply || !referencedTweetID) {
    return accumulator;
  }

  const parentTweet = await getTweet(referencedTweetID);
  accumulator.push(parentTweet);
  const { isReply: parentIsReply, referencedTweetID: parentReferencedTweetID } =
    parentTweet;

  return getTweetPreviousReplies(
    parentIsReply,
    parentReferencedTweetID,
    accumulator
  );
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
export const getTweetNestedReplies = async (
  tweetID: number,
  // Tweet's actual reply depth
  tweetReplyDepth: number,
  // Max reply depth to look into.
  // Pass -1 to look until the end
  maxDepth: number,
  accumulator: Tweet[] = []
) => {
  // Skip query if we already know that tweet has no replies
  // or if we have reached the max reply depth specified for this query
  if (tweetReplyDepth === 0 || maxDepth === 0) {
    return accumulator;
  }

  const [{ parentTweetID, parentReplyDepth }] = await runQuery<{
    parentTweetID: number;
    parentReplyDepth: number;
  }>(
    "SELECT id as parentTweetID, replyDepth as parentReplyDepth FROM tweet \
     WHERE isReply = true AND referencedTweetID = ? \
     ORDER BY replyDepth DESC LIMIT 1",
    [tweetID]
  );

  const parentTweet = await getTweet(parentTweetID);
  accumulator.push(parentTweet);

  return getTweetNestedReplies(
    parentTweetID,
    parentReplyDepth,
    maxDepth === -1 ? -1 : maxDepth - 1,
    accumulator
  );
};

// Recursively update the replyDepth field of a tweet reply thread, to take
// into account a newly posted reply at the bottom of the tree
export const updateParentTweetReplyDepth = async (
  parentID: number,
  newDepth: number
) => {
  const [{ isReply, replyDepth, referencedTweetID }] = await runQuery<{
    isReply: boolean;
    replyDepth: number;
    referencedTweetID: number;
  }>("SELECT isReply, replyDepth, referencedTweetID FROM tweet WHERE id = ?", [
    parentID,
  ]);

  if (newDepth > replyDepth) {
    await runQuery("UPDATE tweet SET replyDepth = ? WHERE id = ?", [
      newDepth,
      parentID,
    ]);
    if (isReply) {
      updateParentTweetReplyDepth(referencedTweetID, newDepth + 1);
    }
  }
};

type Tags = { id: number; username: string };
export const getTweetTags = async (tweetID: number) => {
  return await runQuery<Tags>(
    "SELECT username, userID FROM tweet_tags_user, user \
     WHERE tweetID = ? AND user.id = userID",
    [tweetID]
  );
};

export const getUserRetweets = async (userID: number): Promise<Retweet[]> => {
  const query =
    "SELECT tweetID, retweetDate \
     FROM user_reacts_to_tweet \
     WHERE userID = ? AND isRetweet = true";
  const retweets = await runQuery<{ tweetID: number; retweetDate: string }>(
    query,
    [userID]
  );
  if (!retweets || !retweets.length) {
    return [];
  }
  const [retweeter] = await runQuery<Retweet["retweeter"]>(
    "SELECT id, name FROM user WHERE id = ?",
    [userID]
  );
  const tweets = await Promise.all(
    retweets.map((retweet) => getTweet(retweet.tweetID))
  );

  return retweets.map((retweet, index) => ({
    retweeter,
    retweetDate: retweet.retweetDate,
    tweet: tweets[index],
  }));
};

export const getTweetStats = async (tweetID: number) => {
  const [[{ totalRetweets }], [{ totalLikes }], [{ totalReplies }]] =
    await Promise.all([
      runQuery<{ totalRetweets: number }>(
        "SELECT count(*) as totalRetweets FROM user_reacts_to_tweet \
         WHERE tweetID = ? AND isRetweet = true",
        [tweetID]
      ),
      runQuery<{ totalLikes: number }>(
        "SELECT count(*) as totalLikes FROM user_reacts_to_tweet \
         WHERE tweetID = ? AND isLike = true",
        [tweetID]
      ),
      runQuery<{ totalReplies: number }>(
        "SELECT count(*) as totalReplies FROM tweet \
         WHERE referencedTweetID = ? AND isReply = true",
        [tweetID]
      ),
    ]);

  return { totalRetweets, totalLikes, totalReplies };
};

export const getTotalUserTweets = async (userID: number) => {
  return (
    await runQuery<{ totalTweets: number }>(
      "SELECT count(*) as totalTweets FROM tweet WHERE authorID = ?",
      [userID]
    )
  )[0].totalTweets;
};

const getUserReactionsToTweet = async (tweetID: number) => {
  const [{ isRetweet, isLike }] = await runQuery<{
    isRetweet: boolean;
    isLike: boolean;
  }>(
    "SELECT isRetweet, isLike FROM user_reacts_to_tweet \
     WHERE tweetID = ? AND userID = ?",
    [tweetID, currentUserID]
  );
  return { isRetweet, isLike };
};

export const getTweets = async (tweetIDs: number[]) =>
  await Promise.all(tweetIDs.map((tweetID) => getTweet(tweetID)));

export const getTweet = async (tweetID: number) => {
  const result = await runQuery<Tweet>(
    "SELECT tweet.*, username, name, avatar, isVerified \
         FROM tweet, user \
         WHERE authorID = user.id, tweet.id = ?",
    [tweetID]
  );

  const [tweet] = convertQueryResultToTweets(result);

  const reactions = await getUserReactionsToTweet(tweet.id);

  tweet.usernameTags = await getTweetTags(tweet.id);
  tweet.stats = { ...tweet.stats, ...(await getTweetStats(tweet.id)) };
  tweet.isRetweeted = reactions.isRetweet;
  tweet.isLiked = reactions.isLike;

  return tweet;
};

export const mergeTweetsAndRetweets = (
  tweets: Tweet[],
  retweets: Retweet[]
) => {
  const wrappedTweets: GetUserTweetsAndRetweets["response"]["tweetsAndRetweets"] =
    tweets.map((tweet) => ({
      tweet,
    }));

  const tweetsAndRetweets = wrappedTweets.concat(
    retweets.map((retweet) => ({ retweet: retweet }))
  );

  return tweetsAndRetweets.sort((a, b) => {
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
};
