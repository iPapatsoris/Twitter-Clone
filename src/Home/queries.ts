import { createQueryKeys } from "@lukemorales/query-key-factory";
import { addQueryParams, getData } from "../util/request";
import { GetTimeline } from "../../backend/src/api/tweet";
import { QueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { setTweet } from "../Main/components/Tweet/queries";
import ErrorCode from "../../backend/src/api/errorCodes";
import { PaginationQueryParamsFrontEnd } from "../../backend/src/api/common";
import { SetStateAction, useEffect } from "react";
import { timelinePageSize } from "./Home";

type TimelineResult = GetTimeline["response"];
const timelineGetNextPageParam = (lastPage: TimelineResult["data"]) => {
  return lastPage?.pagination?.nextCursor;
};

export const timelineKeys = createQueryKeys("timeline", {
  down: (
    queryClient: QueryClient,
    setMaxDownPageToRender?: React.Dispatch<SetStateAction<number>>
  ) => ({
    queryKey: ["down"],
    // @ts-ignore awaiting new version of "@lukemorales/query-key-factory"
    queryFn: ({ pageParam }: { pageParam: number }) =>
      downTimelineQuery(queryClient, pageParam, setMaxDownPageToRender),
  }),
  up: (queryClient: QueryClient, initialMaxID: number | undefined) => ({
    queryKey: ["up"],
    // @ts-ignore awaiting new version of "@lukemorales/query-key-factory"
    queryFn: ({ pageParam = initialMaxID }: { pageParam: number }) =>
      upTimelineQuery(queryClient, pageParam),
  }),
});

export const downTimelineQuery = async (
  queryClient: QueryClient,
  pageParam: number,
  // Sets timeline state after fetch. Optional because we do not have access to
  // it yet when query is run through the route loader.
  setMaxDownPageToRender?: React.Dispatch<SetStateAction<number>>
) => {
  const res = await timelineQuery(queryClient, pageParam, "down");

  if (setMaxDownPageToRender) {
    setMaxDownPageToRender((currentMaxPage) => currentMaxPage + 1);
  }
  return res;
};

export const upTimelineQuery = async (
  queryClient: QueryClient,
  pageParam: number
) => {
  return await timelineQuery(queryClient, pageParam, "up");
};

const timelineQuery = async (
  queryClient: QueryClient,
  pageParam: number,
  direction: "up" | "down"
) => {
  const pagination: PaginationQueryParamsFrontEnd = {
    nextCursor: pageParam,
    pageSize: timelinePageSize,
  };
  const res = await getData<GetTimeline["response"]>(
    "tweet/timeline/" + direction,
    addQueryParams([], pagination)
  );

  if (!res.ok && res.errorCode === ErrorCode.PermissionDenied) {
    throw new Error("Server session has expired, please login");
  }
  res.data?.tweetsAndRetweets.forEach((t) =>
    setTweet(t.tweet || t.retweet?.tweet!, queryClient)
  );

  return res.data;
};

export const homeLoader = (queryClient: QueryClient) => async () => {
  const { queryKey } = timelineKeys.down(queryClient);
  const data =
    queryClient.getQueryData(queryKey) ??
    (await queryClient.fetchInfiniteQuery({
      ...timelineKeys.down(queryClient),
      initialPageParam: 1,
    }));
  return data;
};

export const useDownTimelineInfiniteQuery = (
  queryClient: QueryClient,
  setMaxDownPageToRender: React.Dispatch<SetStateAction<number>>
) =>
  useInfiniteQuery({
    ...timelineKeys.down(queryClient, setMaxDownPageToRender),
    getNextPageParam: timelineGetNextPageParam,
    staleTime: Infinity,
    initialPageParam: 1,
  });

export const useUpTimelineInfiniteQuery = (
  queryClient: QueryClient,
  maxDownTweetID: number | undefined
) =>
  useInfiniteQuery({
    ...timelineKeys.up(queryClient, maxDownTweetID),
    getNextPageParam: timelineGetNextPageParam,
    staleTime: Infinity,
    enabled: maxDownTweetID !== undefined,
    initialPageParam: 1,
  });

// Periodically query for potential new tweets (up-timeline)
export const useFetchNextUpTimelinePageInterval = ({
  maxDownTweetID,
  upTimelineIsFetching,
  upTimelineFetchNextPage,
}: {
  maxDownTweetID: number | undefined;
  upTimelineIsFetching: boolean;
  upTimelineFetchNextPage: ReturnType<
    typeof useUpTimelineInfiniteQuery
  >["fetchNextPage"];
}) =>
  useEffect(() => {
    let intervalID: ReturnType<typeof setInterval> | undefined;
    if (maxDownTweetID !== undefined) {
      intervalID = setInterval(() => {
        !upTimelineIsFetching && upTimelineFetchNextPage();
      }, 10000);
    }
    return () => {
      if (intervalID !== undefined) {
        clearInterval(intervalID);
      }
    };
  }, [maxDownTweetID, upTimelineFetchNextPage, upTimelineIsFetching]);
