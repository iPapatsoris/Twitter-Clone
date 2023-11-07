import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import CreateTweet from "../Main/components/Tweet/CreateTweet/CreateTweet";
import { timelineGetNextPageParam, timelineKeys } from "./queries";
import Tweet from "../Main/components/Tweet/Tweet";
import List from "../Main/layouts/ContentRight/List/List";
import "react-circular-progressbar/dist/styles.css";
import useWindowDimensions from "../util/hooks/useWindowDimensions";
import { TailSpin } from "react-loader-spinner";
import styles from "./Home.module.scss";
import { ReactElement, useState } from "react";
import useScrollNearBottom from "../util/hooks/useScrollNearBottom";

export const timelinePageSize = 10;

/* 
  Timeline with infinite scroll. Tweets are loaded paginated into the cache
  as we scroll down. In the case that we already have a cached
  timeline, we render it gradually as we scroll and not all at once, 
  to avoid slowdown.
*/
const Home = () => {
  const queryClient = useQueryClient();
  const { isSmallScreen } = useWindowDimensions();

  const [maxPageToRender, setMaxPageToRender] = useState<number>(1);
  const [createdTweets, setCreatedTweets] = useState<number[]>([]);

  const { data, isSuccess, fetchNextPage, isFetching } = useInfiniteQuery({
    ...timelineKeys.timeline(queryClient, setMaxPageToRender),
    getNextPageParam: timelineGetNextPageParam,
  });

  useScrollNearBottom({
    scrollHandler: () => {
      console.log(data, isFetching);

      if (data && maxPageToRender + 1 <= data.pages.length!) {
        // We already have the next page in the cache, include it to be rendered
        setMaxPageToRender(maxPageToRender + 1);
      } else if (!isFetching) {
        // We don't have the next page in the cache, fetch it
        fetchNextPage();
      }
    },
  });

  if (!isSuccess) {
    return null;
  }

  let tweets: ReactElement[] = [];
  for (const page of data.pages) {
    tweets = tweets.concat(
      page.data!.tweetsAndRetweets.map((t) => (
        <Tweet
          key={t.tweet ? t.tweet.id : t.retweet?.id}
          tweetID={t.tweet ? t.tweet.id : t.retweet?.tweet.id!}
          retweet={t.retweet}
        />
      ))
    );
  }

  const createdTweetsJSX = createdTweets.map((tweetID) => (
    <Tweet key={tweetID} tweetID={tweetID} />
  ));

  const renderedTweets = createdTweetsJSX.concat(
    tweets.slice(0, maxPageToRender * timelinePageSize)
  );

  return (
    <div>
      <div className="Home">
        {!isSmallScreen && <CreateTweet setCreatedTweets={setCreatedTweets} />}
        <List>{renderedTweets}</List>
        {isFetching && (
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
