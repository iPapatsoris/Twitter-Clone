import { createQueryKeys } from "@lukemorales/query-key-factory";
import { getData } from "../util/request";
import { GetTimeline } from "../../backend/src/api/tweet";
import { QueryClient } from "@tanstack/react-query";
import { setTweet } from "../Main/components/Tweet/queries";

export const timelineKeys = createQueryKeys("timeline", {
  timeline: (queryClient: QueryClient) => ({
    queryKey: ["timeline"],
    queryFn: () => timelineQuery(queryClient),
  }),
});

const timelineQuery = async (queryClient: QueryClient) => {
  const res = await getData<GetTimeline["response"]>("tweet/timeline");

  if (!res.ok) {
    throw new Error();
  }
  res.data?.tweetsAndRetweets.forEach((t) =>
    setTweet(t.tweet || t.retweet?.tweet!, queryClient)
  );

  return res;
};

export const homeLoader = (queryClient: QueryClient) => async () => {
  const { queryKey, queryFn } = timelineKeys.timeline(queryClient);
  const data = await queryClient.fetchQuery({ queryKey, queryFn });

  return data;
};
