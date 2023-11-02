import { InfiniteData, QueryClient } from "@tanstack/react-query";
import { NormalResponse } from "../../../../../backend/src/api/common";
import { Tweet } from "../../../../../backend/src/entities/tweet";
import { tweetKeys } from "../queries";
import { GetTimeline } from "../../../../../backend/src/api/tweet";
import { timelineKeys } from "../../../../Home/queries";

export const updateTimelineOnTweetCreate = ({
  data,
  queryClient,
}: {
  data: NormalResponse<{ tweet: Tweet }>;
  queryClient: QueryClient;
}) => {
  queryClient.setQueryData<NormalResponse<Tweet>>(
    tweetKeys.tweetID(data.data?.tweet.id!).queryKey,
    () => ({ ok: data.ok, data: data.data?.tweet })
  );
  const currentTimeline = queryClient.getQueryData<
    InfiniteData<GetTimeline["response"]>
  >(timelineKeys.timeline(queryClient).queryKey);
  const currentPages = currentTimeline?.pages;
  const newFirstPage: GetTimeline["response"] = {
    ...currentPages![0],
    data: {
      pagination: currentPages![0].data?.pagination!,
      tweetsAndRetweets: [
        { tweet: data.data?.tweet },
        ...currentPages![0].data?.tweetsAndRetweets!,
      ],
    },
  };
  const newPages = [
    newFirstPage,
    ...currentPages?.slice(1, currentPages.length)!,
  ];

  queryClient.setQueryData(timelineKeys.timeline(queryClient).queryKey, () => ({
    pages: newPages,
    pageParams: currentTimeline!.pageParams,
  }));
};
