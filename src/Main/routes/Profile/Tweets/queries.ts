import { createQueryKeys } from "@lukemorales/query-key-factory";
import { addQueryParams, getData } from "../../../../util/request";
import {
  GetUserThreads,
  GetUserTweetsAndRetweets,
} from "../../../../../backend/src/api/user";
import { GetUserLikes } from "../../../../../backend/src/api/tweet";
import { QueryClient } from "@tanstack/react-query";
import { LoaderFunctionArgs } from "react-router-dom";
import { setTweet } from "../../../components/Tweet/queries";
import { PaginationQueryParamsFrontEnd } from "../../../../../backend/src/api/common";
import { timelinePageSize } from "../../../../Home/Home";
import { ThreadIDs } from "./Replies";

/* 
  Profile tweets cache is cleared on each route load to avoid layout shifts by
  background fetched new data.
  TODO: reuse the same implementation as in "Home" component
        (progressive render of cached tweets, background fetches of new tweets 
         only, rendering of new tweets on user prompt to avoid layout shifts)
*/

export const getNextPageParamTweetsAndRetweets = (
  lastPage: GetUserTweetsAndRetweets["response"]["data"]
) => {
  return lastPage?.pagination?.nextCursor;
};

export const getNextPageParamLikedTweets = (
  lastPage: GetUserLikes["response"]["data"]
) => {
  return lastPage?.pagination?.nextCursor;
};

export const getNextPageParamReplies = (
  lastPage: GetUserThreads["response"]["data"]
) => {
  return lastPage?.pagination?.nextCursor;
};

export const userTweetsKeys = createQueryKeys("userTweets", {
  tweetsOfUsername: (username: string, queryClient: QueryClient) => ({
    queryKey: [username],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      userTweetsQuery(username, pageParam, queryClient),
    contextQueries: {
      withReplies: (threadIDs: ThreadIDs | undefined = undefined) => ({
        queryKey: ["replies"],
        queryFn: ({ pageParam }: { pageParam: number }) =>
          userRepliesQuery(username, pageParam, queryClient, threadIDs),
      }),
      likedTweets: {
        queryKey: ["likedTweets"],
        queryFn: ({ pageParam }: { pageParam: number }) =>
          userLikedTweetsQuery(username, pageParam, queryClient),
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

  if (!res.ok) {
    throw new Error();
  }
  res.data?.tweetsAndRetweets.forEach((t) =>
    setTweet(t.tweet || t.retweet?.tweet!, queryClient)
  );
  return res.data;
};

const userRepliesQuery = async (
  username: string,
  pageParam: number,
  queryClient: QueryClient,
  threadIDs?: ThreadIDs
): Promise<GetUserThreads["response"]["data"]> => {
  if (!threadIDs) {
    throw new Error("threadIDs not provided");
  }
  const pagination: PaginationQueryParamsFrontEnd = {
    nextCursor: pageParam,
    pageSize: timelinePageSize,
  };

  const res = await getData<GetUserThreads["response"]>(
    "user/" + username + "/replies",
    addQueryParams([], pagination)
  );

  if (!res.ok) {
    throw new Error();
  }

  // In the case of multiple responses of the user to the same thread, show
  // the thread only once
  let uniqueThreads: NonNullable<
    GetUserThreads["response"]["data"]
  >["threads"] = [];
  res.data?.threads.forEach((thread) => {
    const rootID = thread.tweets[0].id;
    if (!threadIDs.has(rootID)) {
      threadIDs.add(thread.tweets[0].id);
      uniqueThreads.push(thread);
      thread.tweets.forEach((tweet) => setTweet(tweet, queryClient));
    }
  });
  return { threads: uniqueThreads, pagination: res.data?.pagination! };
};

const userLikedTweetsQuery = async (
  username: string,
  pageParam: number,
  queryClient: QueryClient
) => {
  const pagination: PaginationQueryParamsFrontEnd = {
    nextCursor: pageParam,
    pageSize: timelinePageSize,
  };
  const res = await getData<GetUserLikes["response"]>(
    "user/" + username + "/likes",
    addQueryParams([], pagination)
  );

  if (!res.ok) {
    throw new Error();
  }
  res.data?.likes.forEach((t) => setTweet(t.tweet, queryClient));
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
    const uniqueThreadIDs: ThreadIDs = new Set();
    const { queryKey } = userTweetsKeys
      .tweetsOfUsername(params.username!, queryClient)
      ._ctx.withReplies(uniqueThreadIDs);

    queryClient.resetQueries({ queryKey });

    await queryClient.fetchInfiniteQuery<GetUserThreads["response"]>({
      ...userTweetsKeys
        .tweetsOfUsername(params.username!, queryClient)
        ._ctx.withReplies(uniqueThreadIDs),
      initialPageParam: -1,
    });

    return uniqueThreadIDs;
  };

export const userLikedTweetsLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const { queryKey } = userTweetsKeys.tweetsOfUsername(
      params.username!,
      queryClient
    )._ctx.likedTweets;

    queryClient.resetQueries({ queryKey });

    return await queryClient.fetchInfiniteQuery<GetUserLikes["response"]>({
      ...userTweetsKeys.tweetsOfUsername(params.username!, queryClient)._ctx
        .likedTweets,
      initialPageParam: -1,
    });
  };
