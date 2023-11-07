import { createQueryKeys } from "@lukemorales/query-key-factory";
import { addQueryParams, getData } from "../util/request";
import { GetTimeline } from "../../backend/src/api/tweet";
import { InfiniteData, QueryClient } from "@tanstack/react-query";
import { setTweet } from "../Main/components/Tweet/queries";
import ErrorCode from "../../backend/src/api/errorCodes";
import { PaginationQueryParamsFrontEnd } from "../../backend/src/api/common";
import { SetStateAction } from "react";
import { timelinePageSize } from "./Home";

type TimelineResult = GetTimeline["response"];
export const timelineGetNextPageParam = (
  lastPage: TimelineResult,
  pages: TimelineResult[]
) => lastPage.data?.pagination?.nextCursor;

export const timelineKeys = createQueryKeys("timeline", {
  timeline: (
    queryClient: QueryClient,
    setMaxPageToRender?: React.Dispatch<SetStateAction<number>>
  ) => ({
    queryKey: ["timeline"],
    queryFn: ({ pageParam }) =>
      timelineQuery(queryClient, pageParam, setMaxPageToRender),
  }),
});

const timelineQuery = async (
  queryClient: QueryClient,
  pageParam: any,
  setMaxPageToRender?: React.Dispatch<SetStateAction<number>>
) => {
  const pagination: PaginationQueryParamsFrontEnd = {
    nextCursor: pageParam,
    pageSize: timelinePageSize,
  };
  const res = await getData<GetTimeline["response"]>(
    "tweet/timeline",
    addQueryParams([], pagination)
  );

  if (!res.ok && res.errorCode === ErrorCode.PermissionDenied) {
    throw new Error("Server session has expired, please login");
  }
  res.data?.tweetsAndRetweets.forEach((t) =>
    setTweet(t.tweet || t.retweet?.tweet!, queryClient)
  );

  if (
    setMaxPageToRender &&
    !isBackgroundRefetch({ queryClient, data: res.data })
  ) {
    // Render more timeline only if query was initiated by the user scrolling,
    // and not through a background refetch of an already existing cache
    setMaxPageToRender((currentMaxPage) => currentMaxPage + 1);
  }

  return res;
};

export const homeLoader = (queryClient: QueryClient) => async () => {
  const { queryKey, queryFn } = timelineKeys.timeline(queryClient);
  const data =
    queryClient.getQueryData(queryKey) ??
    (await queryClient.fetchInfiniteQuery({
      queryKey,
      queryFn,
      getNextPageParam: timelineGetNextPageParam,
    }));
  return data;
};

const isBackgroundRefetch = ({
  queryClient,
  data,
}: {
  queryClient: QueryClient;
  data: GetTimeline["response"]["data"];
}) => {
  const cache = queryClient.getQueryData<InfiniteData<GetTimeline["response"]>>(
    timelineKeys.timeline(queryClient).queryKey
  );

  if (!cache || !cache.pages.length) {
    return false;
  }

  const lastCachedPage = cache.pages[cache?.pages.length - 1];
  const minCachedItem =
    lastCachedPage.data?.tweetsAndRetweets[
      lastCachedPage.data.tweetsAndRetweets.length - 1
    ];
  const minCachedID = minCachedItem?.tweet
    ? minCachedItem.tweet.id
    : minCachedItem?.retweet?.id;
  console.log(minCachedID);
  console.log(data?.pagination.nextCursor);

  const lastReveicedItem =
    data?.tweetsAndRetweets[data.tweetsAndRetweets.length - 1];
  const minReceivedID = lastReveicedItem?.tweet
    ? lastReveicedItem.tweet.id
    : lastReveicedItem?.retweet!.id;

  return minCachedID! <= minReceivedID!;
};
