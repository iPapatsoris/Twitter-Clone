import {
  InfiniteData,
  queryOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import styles from "./Tweet.module.scss";
import { ExpansionDirection, tweetThreadKeys } from "./TweetThread/queries";
import { GetUserThreads } from "../../../../backend/src/api/user";
import { userTweetsKeys } from "../../routes/Profile/Tweets/queries";
import { setTweet } from "./queries";
import { useReplyLine } from "./TweetThread/useReplyLine";
import { useRef } from "react";

interface ShowMoreTweetsProps {
  replyToExpand: number;
  direction: ExpansionDirection;
  downwardProps?: {
    originalTweetID: number;
    replyIndex: number;
  };
  upwardProps?: {
    username: string;
    threadIndex: number;
    pageIndex: number;
  };
}

const ShowMoreTweets = ({
  replyToExpand,
  direction,
  downwardProps,
  upwardProps,
}: ShowMoreTweetsProps) => {
  const { refetch } = useQuery({
    ...tweetThreadKeys.expandReply(replyToExpand, direction),
    enabled: false,
  });
  const queryClient = useQueryClient();
  const showMoreTweetsWrapperRef = useRef<HTMLDivElement>(null);
  const dotsContainerRef = useRef<HTMLDivElement>(null);
  const replyLineRef = useRef<HTMLDivElement>(null);

  useReplyLine(
    direction === "upward",
    false,
    showMoreTweetsWrapperRef,
    dotsContainerRef,
    replyLineRef
  );

  const expandReplies = async () => {
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
          tweets: [
            ...newReplies[replyIndex].tweets,
            ...expandedReplies.slice(1),
          ],
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
        >["threads"] = originalUserTweets.pages[pageIndex]!.threads.map(
          (t) => ({ ...t })
        )!;
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

  return (
    <div
      className={styles.TweetWrapper}
      ref={showMoreTweetsWrapperRef}
      onClick={expandReplies}
    >
      <div className={styles.ShowMoreIcon} ref={dotsContainerRef}>
        <div></div>
        <div></div>
        <div></div>
        <div className={styles.ReplyLine} ref={replyLineRef}></div>
      </div>
      <div className={styles.Wrapper}>
        <div className={styles.ShowMore}>Show replies</div>
      </div>
    </div>
  );
};

export default ShowMoreTweets;
