import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { getNextPageParamTweetsAndRetweets, userTweetsKeys } from "./queries";
import Tweet from "../../../components/Tweet/Tweet";
import List from "../../../layouts/ContentRight/List/List";
import { useOutletContext } from "react-router-dom";
import { getInternalTweetID, getTweetOrRetweetID } from "../../../../Home/util";
import useScrollNearBottom from "../../../../util/hooks/useScrollNearBottom";

const Tweets = () => {
  const username: string = useOutletContext();
  const queryClient = useQueryClient();
  const { data, isSuccess, isFetching, fetchNextPage } = useInfiniteQuery({
    ...userTweetsKeys.tweetsOfUsername(username, queryClient),
    initialPageParam: -1,
    getNextPageParam: getNextPageParamTweetsAndRetweets,
    staleTime: Infinity,
  });

  useScrollNearBottom({
    scrollHandler: () => {
      if (!isFetching) {
        fetchNextPage();
      }
    },
  });

  if (!isSuccess) {
    return null;
  }

  let tweets: JSX.Element[] = [];
  for (const page of data.pages) {
    tweets = tweets.concat(
      page!.tweetsAndRetweets.map((t) => (
        <Tweet
          key={getTweetOrRetweetID(t)}
          tweetID={getInternalTweetID(t)}
          retweet={t.retweet}
        />
      ))
    );
  }

  return <List>{tweets}</List>;
};

export default Tweets;
