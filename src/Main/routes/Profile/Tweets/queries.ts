import { createQueryKeys } from "@lukemorales/query-key-factory";
import { addQueryParams, getData } from "../../../../util/request";
import {
  GetUserThreads,
  GetUserTweetsAndRetweets,
} from "../../../../../backend/src/api/user";
import { GetTweets } from "../../../../../backend/src/api/tweet";
import { QueryClient } from "@tanstack/react-query";
import { LoaderFunctionArgs } from "react-router-dom";
import { setTweet } from "../../../components/Tweet/queries";
import { PaginationQueryParamsFrontEnd } from "../../../../../backend/src/api/common";
import { timelinePageSize } from "../../../../Home/Home";

/* 
  Profile tweets cache is cleared on each route load to avoid layout shifts by
  background fetched new data.
  TODO: reuse the same implementation as in "Home" component
        (progressive render of cached tweets, background fetches of new tweets 
         only, rendering of new tweets on user prompt to avoid layout shifts)
*/

// prettier-ignore
export const getNextPageParam = (lastPage: GetUserTweetsAndRetweets["response"]["data"] ) => {
  return lastPage?.pagination?.nextCursor;
};

export const userTweetsKeys = createQueryKeys("userTweets", {
  tweetsOfUsername: (username: string, queryClient: QueryClient) => ({
    queryKey: [username],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      userTweetsQuery(username, pageParam, queryClient),
    contextQueries: {
      withReplies: {
        queryKey: ["replies"],
        queryFn: () => userRepliesQuery(username, queryClient),
      },
      likedTweets: {
        queryKey: ["likedTweets"],
        queryFn: () => userLikedTweetsQuery(username, queryClient),
      },
    },
  }),
});

const userTweetsQuery = async (
  username: string,
  pageParam: number,
  queryClient: QueryClient
) => {
  const pagination: PaginationQueryParamsFrontEnd = {
    nextCursor: pageParam,
    pageSize: timelinePageSize,
  };
  const res = await getData<GetUserTweetsAndRetweets["response"]>(
    "user/" + username + "/tweets",
    addQueryParams([], pagination)
  );
  res.data?.tweetsAndRetweets.forEach((t) =>
    setTweet(t.tweet || t.retweet?.tweet!, queryClient)
  );

  if (!res.ok) {
    throw new Error();
  }
  return res.data;
};

const userRepliesQuery = async (username: string, queryClient: QueryClient) => {
  const res = await getData<GetUserThreads["response"]>(
    "user/" + username + "/replies"
  );

  if (!res.ok) {
    throw new Error();
  }

  res.data?.threads.forEach((thread) => {
    thread.tweets.forEach((tweet) => setTweet(tweet, queryClient));
  });
  return res.data;
};

const userLikedTweetsQuery = async (
  username: string,
  queryClient: QueryClient
) => {
  const res = await getData<GetTweets["response"]>(
    "user/" + username + "/likes"
  );

  if (!res.ok) {
    throw new Error();
  }
  res.data?.tweets.forEach((t) => setTweet(t, queryClient));
  return res.data;
};

export const userTweetsLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const queryKey = userTweetsKeys.tweetsOfUsername(
      params.username!,
      queryClient
    ).queryKey;
    queryClient.resetQueries({ queryKey });
    const res = await queryClient.fetchInfiniteQuery<
      GetUserTweetsAndRetweets["response"]
    >({
      ...userTweetsKeys.tweetsOfUsername(params.username!, queryClient),
      initialPageParam: -1,
    });
    return res;
  };

export const userRepliesLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const { queryKey, queryFn } = userTweetsKeys.tweetsOfUsername(
      params.username!,
      queryClient
    )._ctx.withReplies;

    return await queryClient.fetchQuery({ queryKey, queryFn });
  };

export const userLikedTweetsLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const { queryKey, queryFn } = userTweetsKeys.tweetsOfUsername(
      params.username!,
      queryClient
    )._ctx.likedTweets;

    return await queryClient.fetchQuery({ queryKey, queryFn });
  };
