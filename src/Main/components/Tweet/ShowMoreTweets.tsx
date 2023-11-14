import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "./Tweet.module.scss";
import { ExpansionDirection, tweetThreadKeys } from "./TweetThread/queries";
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
      const { threadIndex, username } = upwardProps;
      const options =
        userTweetsKeys.tweetsOfUsername(username)._ctx.withReplies;
      const originalUserTweets = queryClient.getQueryData(
        queryOptions(options).queryKey
      );

      if (originalUserTweets && expandedReplies) {
        // Immutably Update user tweets with full conversation
        const originalThread = originalUserTweets.threads[threadIndex].tweets;
        const fullThread = [
          ...expandedReplies,
          originalThread![originalThread!.length - 1],
        ];
        const newThreads: NonNullable<
          GetUserThreads["response"]["data"]
        >["threads"] = originalUserTweets.threads.map((t) => ({ ...t }))!;
        newThreads[threadIndex] = {
          hasMoreNestedReplies: false,
          tweets: fullThread,
        };
        const options =
          userTweetsKeys.tweetsOfUsername(username)._ctx.withReplies;
        queryClient.setQueryData(queryOptions(options).queryKey, {
          threads: [...newThreads],
        });
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
