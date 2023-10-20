/* eslint-disable no-multi-str */
import { runQuery } from "../util.js";
import {
  convertQueryResultToTweets,
  Retweet,
  Tweet,
} from "../entities/tweet.js";
import { Thread } from "../api/tweet.js";

// Get past thread conversation that current tweet responds to
export const getTweetPreviousReplies = async (
  currentUserID: number,
  isReply: boolean,
  referencedTweetID?: number,
  accumulator: Tweet[] = []
): Promise<Tweet[]> => {
  if (!isReply || !referencedTweetID) {
    return accumulator;
  }

  const parentTweet = await getTweet(referencedTweetID, currentUserID);
  accumulator.push(parentTweet);
  const { isReply: parentIsReply, referencedTweetID: parentReferencedTweetID } =
    parentTweet;

  return getTweetPreviousReplies(
    currentUserID,
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
  currentUserID: number,
  // Tweet's actual reply depth
  tweetReplyDepth: number,
  // Max reply depth to look into.
  // Pass -1 to look until the end
  maxDepth: number,
  accumulator: Tweet[] = []
): Promise<Tweet[]> => {
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

  const parentTweet = await getTweet(parentTweetID, currentUserID);
  accumulator.push(parentTweet);

  return getTweetNestedReplies(
    parentTweetID,
    currentUserID,
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

export const getTweetTags = async (tweetID: number) => {
  return await runQuery<NonNullable<Tweet["usernameTags"]>[number]>(
    "SELECT username, userID FROM tweet_tags_user, user \
     WHERE tweetID = ? AND user.id = userID",
    [tweetID]
  );
};

export const getUserRetweets = async (
  username: string,
  currentUserID: number
): Promise<Retweet[]> => {
  const query =
    "SELECT tweetID, reactionDate as retweetDate \
     FROM user_reacts_to_tweet, user \
     WHERE userID = user.id AND isRetweet = true AND user.username = ?";
  const retweets = await runQuery<{ tweetID: number; retweetDate: string }>(
    query,
    [username]
  );
  if (!retweets || !retweets.length) {
    return [];
  }
  const [retweeter] = await runQuery<Retweet["retweeter"]>(
    "SELECT id, name FROM user WHERE username = ?",
    [username]
  );
  const tweets = await Promise.all(
    retweets.map((retweet) => getTweet(retweet.tweetID, currentUserID))
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

export const getUserReactionsToTweet = async (
  tweetID: number,
  currentUserID: number
): Promise<{ isRetweet: boolean; isLike: boolean }> => {
  if (currentUserID === -1) {
    return {
      isRetweet: false,
      isLike: false,
    };
  }
  const [reaction] = await runQuery<{
    isRetweet: boolean;
    isLike: boolean;
  }>(
    "SELECT isRetweet, isLike FROM user_reacts_to_tweet \
     WHERE tweetID = ? AND userID = ?",
    [tweetID, currentUserID]
  );
  return {
    isRetweet: reaction && reaction.isRetweet,
    isLike: reaction && reaction.isLike,
  };
};

export const getTweets = async (tweetIDs: number[], currentUserID: number) =>
  await Promise.all(
    tweetIDs.map((tweetID) => getTweet(tweetID, currentUserID))
  );

export const getTweet = async (tweetID: number, currentUserID: number) => {
  const result = await runQuery<Tweet>(
    "SELECT tweet.*, username, name, avatar, isVerified \
         FROM tweet, user \
         WHERE authorID = user.id AND tweet.id = ?",
    [tweetID]
  );

  const [tweet] = convertQueryResultToTweets(result);

  const reactions = await getUserReactionsToTweet(tweet.id, currentUserID);

  tweet.usernameTags = await getTweetTags(tweet.id);
  tweet.stats = { ...tweet.stats, ...(await getTweetStats(tweet.id)) };
  tweet.isRetweeted = reactions.isRetweet;
  tweet.isLiked = reactions.isLike;

  return tweet;
};

// Merge tweets and retweets and sort by most recent first
export const mergeTweetsAndRetweets = (
  tweets: Tweet[],
  retweets: Retweet[]
) => {
  const tweetsWithoutSelfRetweets: Array<{ tweet?: Tweet; retweet?: Retweet }> =
    [];
  tweets.forEach((tweet) => {
    if (!retweets.find((retweet) => retweet.tweet.id === tweet.id)) {
      tweetsWithoutSelfRetweets.push({ tweet });
    }
  });

  const tweetsAndRetweets = tweetsWithoutSelfRetweets.concat(
    retweets.map((retweet) => ({ retweet: retweet }))
  );

  return tweetsAndRetweets.sort((a, b) => {
    const aDate = a.tweet ? a.tweet.creationDate : a.retweet?.retweetDate;
    const bDate = b.tweet ? b.tweet.creationDate : b.retweet?.retweetDate;

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

// Merge tweets, replies and retweets and sort by most recent first
export const mergeThreadsAndRetweets = (
  threads: Thread[],
  retweets: Retweet[]
) => {
  const wrappedThreads: Array<{
    thread?: Thread;
    retweet?: Retweet;
  }> = threads.map((thread) => ({
    thread,
  }));
  const threadsAndRetweets = wrappedThreads.concat(
    retweets.map((retweet) => ({ retweet: retweet }))
  );

  const getMostRecentReplyDate = (thread: Thread) =>
    thread.tweets[thread.tweets.length - 1].creationDate;

  return threadsAndRetweets.sort((a, b) => {
    const aDate = a.thread
      ? getMostRecentReplyDate(a.thread)
      : a.retweet?.retweetDate;
    const bDate = b.thread
      ? getMostRecentReplyDate(b.thread)
      : b.retweet?.retweetDate;

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

// From tweets/replies that have the same root thread ID,
// keep only one, the shallowest in the thread tree
export const getUniqueThreads = (tweets: Tweet[]) => {
  const rootTweetToLeastRecent = new Map<number, Tweet>();
  for (const tweet of tweets) {
    const rootID = tweet.isReply ? tweet.rootTweetID : tweet.id;
    const res = rootTweetToLeastRecent.get(rootID);
    if (!res || tweet.replyDepth < res.replyDepth) {
      rootTweetToLeastRecent.set(rootID, tweet);
    }
  }
  return Array.from(rootTweetToLeastRecent.values());
};

export const sort = (threads: Thread[]) =>
  threads.sort((a, b) => {
    const aDate = a.tweets[0].creationDate;
    const bDate = b.tweets[0].creationDate;

    if (aDate && bDate) {
      if (new Date(aDate) > new Date(bDate)) {
        return -1;
      } else {
        return 1;
      }
    }
    return 0;
  });
