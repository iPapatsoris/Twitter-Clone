import { createQueryKeys } from "@lukemorales/query-key-factory";
import { addQueryParams, getData } from "../util/request";
import { GetTimeline } from "../../backend/src/api/tweet";
import { QueryClient } from "@tanstack/react-query";
import { setTweet } from "../Main/components/Tweet/queries";
import ErrorCode from "../../backend/src/api/errorCodes";
import { PaginationQueryParamsFrontEnd } from "../../backend/src/api/common";
import { SetStateAction } from "react";
import { timelinePageSize } from "./Home";

type TimelineResult = GetTimeline["response"];
export const timelineGetNextPageParam = (
  lastPage: TimelineResult,
  pages: TimelineResult[]
) => {
  const { currentPage, totalPages } = lastPage.data?.pagination!;
  return currentPage === totalPages ? undefined : currentPage + 1;
};

export const timelineKeys = createQueryKeys("timeline", {
  timeline: (
    queryClient: QueryClient,
    setMaxPageToRender?: React.Dispatch<SetStateAction<number>>
  ) => ({
    queryKey: ["timeline"],
    queryFn: ({ pageParam = 1 }) =>
      timelineQuery(queryClient, pageParam, setMaxPageToRender),
  }),
});

const timelineQuery = async (
  queryClient: QueryClient,
  pageParam: any,
  setMaxPageToRender?: React.Dispatch<SetStateAction<number>>
) => {
  const pagination: PaginationQueryParamsFrontEnd = {
    page: pageParam,
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

  // Update rendered timeline
  if (setMaxPageToRender) {
    setMaxPageToRender(pageParam);
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
