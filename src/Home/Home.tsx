import { useQueryClient } from "@tanstack/react-query";
import CreateTweet from "../Main/components/Tweet/CreateTweet/CreateTweet";
import {
  useDownTimelineInfiniteQuery,
  useFetchNextUpTimelinePageInterval,
  useSimulateNewTweetsInterval,
  useUpTimelineInfiniteQuery,
} from "./queries";
import Tweet from "../Main/components/Tweet/Tweet";
import List from "../Main/layouts/ContentRight/List/List";
import "react-circular-progressbar/dist/styles.css";
import useWindowDimensions from "../util/hooks/useWindowDimensions";
import { TailSpin } from "react-loader-spinner";
import styles from "./Home.module.scss";
import { ReactElement, useState } from "react";
import useScrollNearBottom from "../util/hooks/useScrollNearBottom";
import {
  useExtraTimelineTweets,
  useMaxLoadedTweetIDFromUpTimeline,
} from "./useExtraTweetsStore";
import {
  getFreshUpTimelineTweets,
  getInternalTweetID,
  getMaxDownTimelineTweetID,
  getTweetOrRetweetID,
} from "./util";
import ExpandUpTimelineButton from "./ExpandUpTimelineButton";

export const timelinePageSize = 10;

/* 
  Timeline with infinite scroll. Tweets are loaded paginated into the cache
  as we scroll down. In the case that we already have a cached
  timeline, we render it gradually as we scroll and not all at once, 
  to avoid slowdown. New tweets are also periodically fetched and cached in the 
  background, and can be loaded into the UI via user prompt.

  -------------
  |Terminology|
  -------------

  downTimeline: the timeline as we scroll down, consisting of tweets that are
                older than the first time we visited the page, sorted by most 
                recent first.
  upTimeline:   new tweets that have been created by other users after the first 
                time we visited the page, sorted by most recent first. They
                are periodically fetched and cached paginated in the background, 
                but are not loaded in the UI, unless the user prompts.

  ----------------------------
  |Scaling Optimisation todos|
  ----------------------------

  1) Include upTimeline cache entries only if they are non-empty. 
     Infinite query populates cache entries every interval regardless of if they 
     hold actual content. Over a long period of time, this could create a big 
     cache that is less performant to access, even if the traversal functions
     are optimized with early termination.   
     
  2) Gradually render upTimeline, instead of all at once, using a library like
     "react-window".
     Currently downTimeline is rendered progressively from the cache as the user 
     scrolls down, however upTimeline is rendered all at once, when the user 
     clicks the "Show x new tweets" button. Even though upTimeline is fetched
     in chunks using pagination, if the cache grows too big before being loaded 
     in the UI, too many elements will be rendered at once, which could cause 
     a slowdown. 

  3) Merge upTimeline with downTimeline and use "react-window" library for both.
     Currently, if several upTimeline tweets are loaded into the UI, and then we
     switch routes and come back to the timeline, the preloaded upTimeline ones 
     will be rendred all at once, potentially slowing down the app if they are 
     several.
  
*/
const Home = () => {
  const queryClient = useQueryClient();
  const { isSmallScreen } = useWindowDimensions();

  // For gradual rendering of the down-timeline cache
  const [maxDownPageToRender, setMaxDownPageToRender] = useState<number>(1);

  // Tweets either loaded from up-timeline cache and/or created by the user
  // through the UI
  const extraTweets = useExtraTimelineTweets();

  // Highest tweet ID that has been loaded to the UI from the up-timeline cache.
  // For determining which cached up-timeline tweets have not yet been
  // displayed to the user.
  const maxLoadedTweetIDFromUpTimeline = useMaxLoadedTweetIDFromUpTimeline();

  const {
    data: downTimelineCache,
    isSuccess: downTimelineIsSuccess,
    fetchNextPage: downTimelineFetchNextPage,
    isFetching: downTimelineIsFetching,
  } = useDownTimelineInfiniteQuery(queryClient, setMaxDownPageToRender);

  const maxDownTweetID = getMaxDownTimelineTweetID(downTimelineCache);

  const {
    data: upTimelineCache,
    isFetching: upTimelineIsFetching,
    fetchNextPage: upTimelineFetchNextPage,
  } = useUpTimelineInfiniteQuery(queryClient, maxDownTweetID);

  useFetchNextUpTimelinePageInterval({
    maxDownTweetID,
    upTimelineIsFetching,
    upTimelineFetchNextPage,
  });

  useScrollNearBottom({
    scrollHandler: () => {
      if (
        downTimelineCache &&
        maxDownPageToRender + 1 <= downTimelineCache.pages.length!
      ) {
        // We already have the next page in the cache, include it to be rendered
        setMaxDownPageToRender(maxDownPageToRender + 1);
      } else if (!downTimelineIsFetching) {
        // We don't have the next page in the cache, fetch it
        downTimelineFetchNextPage();
      }
    },
  });

  useSimulateNewTweetsInterval({
    interval: 5000,
    maxIntervals: 2,
    maxTweetsPerInterval: 5,
  });

  if (!downTimelineIsSuccess) {
    return null;
  }

  let downTimelineTweetsJSX: ReactElement[] = [];
  for (const page of downTimelineCache.pages) {
    downTimelineTweetsJSX = downTimelineTweetsJSX.concat(
      page!.tweetsAndRetweets.map((t) => (
        <Tweet
          key={getTweetOrRetweetID(t)}
          tweetID={getInternalTweetID(t)}
          retweet={t.retweet}
        />
      ))
    );
  }

  const extraTweetsJSX = extraTweets.map((t) => (
    <Tweet
      key={t.id}
      tweetID={t.retweet ? t.retweet.innerTweetID : t.id}
      retweet={t.retweet}
    />
  ));

  // Combine user created tweets and up-timeline with down-timeline.
  // Limit down-timeline results, for gradual rendering
  const renderedTweets = extraTweetsJSX.concat(
    downTimelineTweetsJSX.slice(0, maxDownPageToRender * timelinePageSize)
  );

  const freshTweets = getFreshUpTimelineTweets(
    upTimelineCache,
    maxLoadedTweetIDFromUpTimeline
  );

  return (
    <div>
      <div className="Home">
        {!isSmallScreen && <CreateTweet />}
        <List>
          {freshTweets.length > 0 ? (
            <ExpandUpTimelineButton freshTweets={freshTweets} />
          ) : null}
          {renderedTweets}
        </List>
        {downTimelineIsFetching && (
          <TailSpin
            height="30"
            width="30"
            color="var(--primary-color)"
            ariaLabel="tail-spin-loading"
            wrapperClass={styles.LoadingSpinner}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
