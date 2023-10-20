import { useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "./Tweet.module.scss";
import { ExpansionDirection, tweetThreadKeys } from "./TweetThread/queries";
import { GetTweet } from "../../../../backend/src/api/tweet";
import { GetUserThreads } from "../../../../backend/src/api/user";
import { userTweetsKeys } from "../../routes/Profile/Tweets/queries";
import { setTweet } from "./queries";

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

  const expandReplies = async () => {
    const res = await refetch();
    const expandedReplies = res.data?.data?.replies!;

    expandedReplies.forEach((r) => setTweet(r, queryClient));

    if (direction === "downward" && downwardProps) {
      const { originalTweetID, replyIndex } = downwardProps;
      const originalTweet = queryClient.getQueryData<GetTweet["response"]>(
        tweetThreadKeys.tweetID(originalTweetID, queryClient).queryKey
      );

      if (originalTweet?.data && expandedReplies) {
        // Immutably update tweet with full reply list
        const newReplies = [...originalTweet.data?.replies];
        newReplies[replyIndex] = {
          hasMoreNestedReplies: false,
          tweets: [
            ...newReplies[replyIndex].tweets,
            ...expandedReplies.slice(1),
          ],
        };
        queryClient.setQueryData<GetTweet["response"]>(
          tweetThreadKeys.tweetID(originalTweetID, queryClient).queryKey,
          {
            ...originalTweet,
            data: { ...originalTweet.data, replies: newReplies },
          }
        );
      }
    } else if (direction === "upward" && upwardProps) {
      const { threadIndex, username } = upwardProps;
      const originalUserTweets = queryClient.getQueryData<
        GetUserThreads["response"]
      >(userTweetsKeys.tweetsOfUsername(username)._ctx.withReplies.queryKey);

      if (originalUserTweets && expandedReplies) {
        // Immutably Update user tweets with full conversation
        const originalThread =
          originalUserTweets.data?.threads[threadIndex].tweets;
        const fullThread = [
          ...expandedReplies,
          originalThread![originalThread!.length - 1],
        ];
        const newThreads: NonNullable<
          GetUserThreads["response"]["data"]
        >["threads"] = originalUserTweets.data?.threads.map((t) => ({ ...t }))!;
        newThreads[threadIndex] = {
          hasMoreNestedReplies: false,
          tweets: fullThread,
        };

        queryClient.setQueryData<GetUserThreads["response"]>(
          userTweetsKeys.tweetsOfUsername(username)._ctx.withReplies.queryKey,
          { ok: true, data: { threads: [...newThreads] } }
        );
      }
    }
  };

  return (
    <div className={styles.TweetWrapper} onClick={expandReplies}>
      <div className={styles.ShowMoreIcon}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className={styles.Wrapper}>
        <div className={styles.ShowMore}>Show replies</div>
      </div>
    </div>
  );
};

export default ShowMoreTweets;
