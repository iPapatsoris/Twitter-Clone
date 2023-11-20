import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import Tweet from "../../../components/Tweet/Tweet";
import List from "../../../layouts/ContentRight/List/List";
import { useOutletContext } from "react-router-dom";
import { userTweetsKeys, getNextPageParamLikedTweets } from "./queries";
import useScrollNearBottom from "../../../../util/hooks/useScrollNearBottom";

const LikedTweets = () => {
  const username: string = useOutletContext();
  const queryClient = useQueryClient();

  const { data, isSuccess, isFetching, fetchNextPage } = useInfiniteQuery({
    ...userTweetsKeys.tweetsOfUsername(username, queryClient)._ctx.likedTweets,
    initialPageParam: -1,
    getNextPageParam: getNextPageParamLikedTweets,
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
      page!.likes.map((t) => <Tweet key={t.reactionID} tweetID={t.tweet.id} />)
    );
  }

  return <List>{tweets}</List>;
};

export default LikedTweets;
