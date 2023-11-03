import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import CreateTweet from "../Main/components/Tweet/CreateTweet/CreateTweet";
import { timelineGetNextPageParam, timelineKeys } from "./queries";
import Tweet from "../Main/components/Tweet/Tweet";
import List from "../Main/layouts/ContentRight/List/List";
import "react-circular-progressbar/dist/styles.css";
import useWindowDimensions from "../util/hooks/useWindowDimensions";
import InfiniteScroll from "react-infinite-scroll-component";
import { TailSpin } from "react-loader-spinner";
import styles from "./Home.module.scss";
import { ReactElement, useState } from "react";

export const timelinePageSize = 10;

/* 
  Timeline with infinite scroll. Tweets are loaded paginated into the cache
  as we scroll down. During each query, we update the "maxPageToRender" state,
  to render more tweets from the cache. If we change routes
  and come back to the timeline, React Query's infinite query sequentially
  refetches each page, up until the lastest page that we have seen. By using
  "maxPageToRender", we limit the rendered tweets during each step instead of 
  rendering the whole stale cache at once, which would result in noticeable
  slowdown.
*/
const Home = () => {
  const queryClient = useQueryClient();
  const { isSmallScreen } = useWindowDimensions();

  const [maxPageToRender, setMaxPageToRender] = useState<number>(1);

  const { data, isSuccess, fetchNextPage, hasNextPage } = useInfiniteQuery({
    ...timelineKeys.timeline(queryClient, setMaxPageToRender),
    getNextPageParam: timelineGetNextPageParam,
  });

  if (!isSuccess) {
    return null;
  }

  let tweets: ReactElement[] = [];
  for (const page of data.pages) {
    tweets = tweets.concat(
      page.data!.tweetsAndRetweets.map((t) => (
        <Tweet
          key={t.tweet ? t.tweet.id : t.retweet?.tweet.id}
          tweetID={t.tweet ? t.tweet.id : t.retweet?.tweet.id!}
          retweet={t.retweet}
        />
      ))
    );
  }
  const renderedTweets = tweets.slice(0, maxPageToRender * timelinePageSize);

  return (
    <div>
      <div className="Home">
        {!isSmallScreen && <CreateTweet />}
        <InfiniteScroll
          dataLength={tweets.length}
          next={() => fetchNextPage()}
          hasMore={hasNextPage!}
          hasChildren={tweets.length > 0}
          loader={
            <TailSpin
              height="30"
              width="30"
              color="var(--primary-color)"
              ariaLabel="tail-spin-loading"
              wrapperClass={styles.LoadingSpinner}
            />
          }
        >
          <List>{renderedTweets}</List>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Home;
