import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { getNextPageParamReplies, userTweetsKeys } from "./queries";
import Tweet from "../../../components/Tweet/Tweet";
import List from "../../../layouts/ContentRight/List/List";
import ShowMoreTweets from "../../../components/Tweet/ShowMoreTweets";
import { useLoaderData, useOutletContext } from "react-router-dom";
import useScrollNearBottom from "../../../../util/hooks/useScrollNearBottom";
import { useRef } from "react";

export type ThreadIDs = Set<number>;
const Replies = () => {
  const username: string = useOutletContext();
  const queryClient = useQueryClient();

  const initialLoadThreadIDs = useLoaderData() as ThreadIDs;
  const uniqueThreadIDs = useRef<ThreadIDs>(initialLoadThreadIDs);

  const { data, isSuccess, isFetching, fetchNextPage } = useInfiniteQuery({
    ...userTweetsKeys
      .tweetsOfUsername(username, queryClient)
      ._ctx.withReplies(uniqueThreadIDs.current),
    initialPageParam: -1,
    getNextPageParam: getNextPageParamReplies,
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

  const repliesJSX: React.ReactElement[] = [];
  data.pages.forEach((page, pageIndex) => {
    page?.threads.forEach((thread, threadIndex) => {
      thread.tweets.forEach((tweet, index) => {
        if (!index) {
          const isFullThread = !thread.hasMoreNestedReplies;
          repliesJSX.push(
            <Tweet
              key={tweet.id}
              drawReplyLine={thread.tweets.length! > 1}
              tweetID={tweet.id}
            />
          );

          if (!isFullThread) {
            repliesJSX.push(
              <ShowMoreTweets
                key={"expand " + thread.tweets[index + 1].id!}
                direction="upward"
                replyToExpand={thread.tweets[index + 1].id!}
                upwardProps={{
                  username,
                  threadIndex,
                  pageIndex,
                }}
              />
            );
          }
        } else {
          repliesJSX.push(
            <Tweet
              key={tweet.id}
              drawReplyLine={index !== thread?.tweets.length! - 1}
              tweetID={tweet.id}
            />
          );
        }
      });
    });
  });

  return <List>{repliesJSX}</List>;
};

export default Replies;
