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

const Home = () => {
  const queryClient = useQueryClient();
  const { isSmallScreen } = useWindowDimensions();

  const { data, isSuccess, fetchNextPage, hasNextPage } = useInfiniteQuery({
    ...timelineKeys.timeline(queryClient),
    getNextPageParam: timelineGetNextPageParam,
  });

  if (!isSuccess) {
    return null;
  }

  const tweets = data.pages.map((page) =>
    page.data!.tweetsAndRetweets.map((t) => {
      return (
        <Tweet
          key={t.tweet ? t.tweet.id : t.retweet?.tweet.id}
          tweetID={t.tweet ? t.tweet.id : t.retweet?.tweet.id!}
          retweet={t.retweet}
        />
      );
    })
  );

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
          <List>{tweets}</List>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Home;
