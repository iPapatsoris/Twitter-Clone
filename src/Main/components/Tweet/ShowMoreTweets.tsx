import { useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "./Tweet.module.scss";
import { tweetThreadKeys } from "./TweetThread/queries";
import { GetTweet } from "../../../../backend/src/api/tweet";

interface ShowMoreTweetsProps {
  originalTweetID: number;
  replyIndex: number;
  replyToExpand: number;
}

const ShowMoreTweets = ({
  replyToExpand,
  originalTweetID,
  replyIndex,
}: ShowMoreTweetsProps) => {
  const { refetch } = useQuery({
    ...tweetThreadKeys.tweetID(originalTweetID)._ctx.expandReply(replyToExpand),
    enabled: false,
  });
  const queryClient = useQueryClient();

  const expandReplies = async () => {
    const res = await refetch();
    const originalTweet = queryClient.getQueryData<GetTweet["response"]>(
      tweetThreadKeys.tweetID(originalTweetID).queryKey
    );

    if (originalTweet?.data && res.data?.data) {
      // Update tweet with full reply list
      const newReplies = [...originalTweet.data?.replies];
      newReplies[replyIndex] = {
        hasMoreNestedReplies: false,
        tweets: [
          ...newReplies[replyIndex].tweets,
          ...res.data?.data?.replies.slice(1),
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
