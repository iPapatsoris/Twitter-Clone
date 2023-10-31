import { createQueryKeys } from "@lukemorales/query-key-factory";
import { addQueryParams, getData } from "../util/request";
import { GetTimeline } from "../../backend/src/api/tweet";
import { QueryClient } from "@tanstack/react-query";
import { setTweet } from "../Main/components/Tweet/queries";
import ErrorCode from "../../backend/src/api/errorCodes";
import { PaginationQueryParamsFrontEnd } from "../../backend/src/api/common";

type TimelineResult = GetTimeline["response"];
export const timelineGetNextPageParam = (
  lastPage: TimelineResult,
  pages: TimelineResult[]
) => {
  const { currentPage, totalPages } = lastPage.data?.pagination!;
  return currentPage === totalPages ? undefined : currentPage + 1;
};

export const timelineKeys = createQueryKeys("timeline", {
  timeline: (queryClient: QueryClient) => ({
    queryKey: ["timeline"],
    queryFn: ({ pageParam = 1 }) => timelineQuery(queryClient, pageParam),
  }),
});

const pageSize = 10;

const timelineQuery = async (queryClient: QueryClient, pageParam: any) => {
  const pagination: PaginationQueryParamsFrontEnd = {
    page: pageParam,
    pageSize,
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
