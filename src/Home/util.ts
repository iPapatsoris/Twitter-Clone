import { InfiniteData } from "@tanstack/react-query";
import { GetTimeline } from "../../backend/src/api/tweet";

// Get most recent tweet from down-timeline
export const getMaxDownTimelineTweetID = (
  downTimelineCache: InfiniteData<GetTimeline["response"]["data"]> | undefined
) => {
  const mostRecentDownTweet = downTimelineCache?.pages[0]?.tweetsAndRetweets
    ?.length
    ? downTimelineCache.pages[0]?.tweetsAndRetweets[0]
    : null;
  return mostRecentDownTweet?.tweet
    ? getTweetOrRetweetID(mostRecentDownTweet)
    : undefined;
};

export const getTweetOrRetweetID = (
  t: NonNullable<GetTimeline["response"]["data"]>["tweetsAndRetweets"][0]
) => (t.tweet ? t.tweet.id : t.retweet!.id);

export const getInternalTweetID = (
  t: NonNullable<GetTimeline["response"]["data"]>["tweetsAndRetweets"][0]
) => (t.tweet ? t.tweet.id : t.retweet!.tweet.id);

// Get up-timeline tweets that are in the cache but have not been loaded
// in the UI yet.
export const getFreshUpTimelineTweets = (
  upTimelineCache: InfiniteData<GetTimeline["response"]["data"]> | undefined,
  maxLoadedTweetIDFromUpTimeline: number
) => {
  const freshTweets: NonNullable<
    GetTimeline["response"]["data"]
  >["tweetsAndRetweets"] = [];

  if (upTimelineCache) {
    for (
      let pageIndex = upTimelineCache?.pages.length - 1;
      pageIndex >= 0;
      pageIndex--
    ) {
      const page = upTimelineCache.pages[pageIndex]?.tweetsAndRetweets;
      if (!page) {
        continue;
      }
      for (let tIndex = page?.length - 1; tIndex >= 0; tIndex--) {
        const t = page[tIndex];
        const id = getTweetOrRetweetID(t);
        if (id <= maxLoadedTweetIDFromUpTimeline) {
          // No need to traverse the rest of the cache because we know that it
          // has already been loaded
          return freshTweets;
        }
        freshTweets.push(t);
      }
    }
  }
  return freshTweets;
};
