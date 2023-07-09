import { useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "./Tweet.module.scss";
import { ExpansionDirection, tweetThreadKeys } from "./TweetThread/queries";
import { GetTweet } from "../../../../backend/src/api/tweet";
import { GetUserThreadsAndRetweets } from "../../../../backend/src/api/user";
import { userTweetsKeys } from "../../routes/Profile/Tweets/queries";

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
    const expandedReplies = res.data?.data?.replies;
    if (direction === "downward" && downwardProps) {
      const { originalTweetID, replyIndex } = downwardProps;
      const originalTweet = queryClient.getQueryData<GetTweet["response"]>(
        tweetThreadKeys.tweetID(originalTweetID).queryKey
      );

      if (originalTweet?.data && expandedReplies) {
        // Update tweet with full reply list
        const newReplies = [...originalTweet.data?.replies];
        newReplies[replyIndex] = {
          hasMoreNestedReplies: false,
          tweets: [
            ...newReplies[replyIndex].tweets,
            ...expandedReplies.slice(1),
          ],
        };
        queryClient.setQueryData<GetTweet["response"]>(
          tweetThreadKeys.tweetID(originalTweetID).queryKey,
          {
            ...originalTweet,
            data: { ...originalTweet.data, replies: newReplies },
          }
        );
      }
    } else if (direction === "upward" && upwardProps) {
      const { threadIndex, username } = upwardProps;
      const originalUserTweets = queryClient.getQueryData<
        GetUserThreadsAndRetweets["response"]
      >(userTweetsKeys.tweetsOfUsername(username).queryKey);

      if (originalUserTweets && expandedReplies) {
        // Update user tweets with full conversation
        const originalThread =
          originalUserTweets.data?.threadsAndRetweets[threadIndex].thread
            ?.tweets;
        const fullThread = [
          ...expandedReplies,
          originalThread![originalThread!.length - 1],
        ];
        const newThreadsAndRetweets: NonNullable<
          GetUserThreadsAndRetweets["response"]["data"]
        >["threadsAndRetweets"] = [
          ...originalUserTweets.data?.threadsAndRetweets!,
        ];
        newThreadsAndRetweets[threadIndex].thread = {
          hasMoreNestedReplies: false,
          tweets: fullThread,
        };

        queryClient.setQueryData<GetUserThreadsAndRetweets["response"]>(
          userTweetsKeys.tweetsOfUsername(username).queryKey,
          { ok: true, data: { threadsAndRetweets: newThreadsAndRetweets } }
        );
      }
    }
  };

  return (
    <div className={styles.Tweet} onClick={expandReplies}>
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
