import {
  InfiniteData,
  QueryClient,
  UseQueryResult,
  queryOptions,
} from "@tanstack/react-query";
import { ExpandTweetReplies } from "../../../../../backend/src/api/tweet";
import { setTweet } from "../queries";
import ShowMoreTweets from "./ShowMoreTweets";
import { ComponentProps } from "react";
import { tweetThreadKeys } from "../TweetThread/queries";
import { userTweetsKeys } from "../../../routes/Profile/Tweets/queries";
import { GetUserThreads } from "../../../../../backend/src/api/user";

const expandReplies = async ({
  props,
  refetch,
  queryClient,
}: {
  props: Pick<
    ComponentProps<typeof ShowMoreTweets>,
    "direction" | "downwardProps" | "upwardProps"
  >;
  queryClient: QueryClient;
  refetch: UseQueryResult<ExpandTweetReplies["response"]["data"]>["refetch"];
}) => {
  const { downwardProps, upwardProps, direction } = props;
  const res = await refetch();
  const expandedReplies = res.data?.replies!;

  expandedReplies.forEach((r) => setTweet(r, queryClient));

  if (direction === "downward" && downwardProps) {
    const { originalTweetID, replyIndex } = downwardProps;
    const options = queryOptions(
      tweetThreadKeys.tweetID(originalTweetID, queryClient)
    );
    const originalTweet = queryClient.getQueryData(options.queryKey);

    if (originalTweet && expandedReplies) {
      // Immutably update tweet with full reply list
      const newReplies = [...originalTweet.replies];
      newReplies[replyIndex] = {
        hasMoreNestedReplies: false,
        tweets: [...newReplies[replyIndex].tweets, ...expandedReplies.slice(1)],
      };
      const options = tweetThreadKeys.tweetID(originalTweetID, queryClient);
      queryClient.setQueryData(queryOptions(options).queryKey, {
        ...originalTweet,
        replies: newReplies,
      });
    }
  } else if (direction === "upward" && upwardProps) {
    const { threadIndex, pageIndex, username } = upwardProps;
    const options = userTweetsKeys
      .tweetsOfUsername(username, queryClient)
      ._ctx.withReplies();
    // TODO: why queryOptions TS doesn't work and I have to provide the type?
    const originalUserTweets = queryClient.getQueryData<
      InfiniteData<GetUserThreads["response"]["data"]>
    >(queryOptions(options).queryKey);

    if (originalUserTweets && expandedReplies) {
      // Immutably update user tweets with full conversation
      const originalThread =
        originalUserTweets.pages[pageIndex]!.threads[threadIndex].tweets;
      const fullThread = [
        ...expandedReplies,
        originalThread![originalThread!.length - 1],
      ];
      const newThreads: NonNullable<
        GetUserThreads["response"]["data"]
      >["threads"] = originalUserTweets.pages[pageIndex]!.threads.map((t) => ({
        ...t,
      }))!;
      newThreads[threadIndex] = {
        hasMoreNestedReplies: false,
        tweets: fullThread,
      };
      const queryKey = userTweetsKeys
        .tweetsOfUsername(username, queryClient)
        ._ctx.withReplies().queryKey;
      queryClient.setQueryData<
        InfiniteData<GetUserThreads["response"]["data"]>
      >(queryKey, {
        pageParams: originalUserTweets.pageParams,
        pages: originalUserTweets.pages.map((p, pIndex) => ({
          pagination: p!.pagination,
          threads: pageIndex === pIndex ? [...newThreads] : p!.threads,
        })),
      });
    }
  }
};

export default expandReplies;
