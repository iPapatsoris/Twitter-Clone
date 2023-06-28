import { useQuery } from "@tanstack/react-query";
import styles from "./TweetThread.module.scss";
import { tweetThreadKeys } from "./queries";
import { useParams } from "react-router-dom";
import MainTweet from "./MainTweet/MainTweet";
import Tweet from "../Tweet";
import List from "../../../layouts/ContentRight/List/List";

interface TweetThreadProps {}

const TweetThread = ({}: TweetThreadProps) => {
  const params = useParams();
  const { data, isSuccess } = useQuery(
    tweetThreadKeys.tweetID(parseInt(params.tweetID!))
  );

  if (!isSuccess) {
    return null;
  }
  const { tweet, replies, previousReplies } = data.data!;

  const repliesJSX: React.ReactElement[] = [];
  replies.forEach((reply) => {
    const hasNestedReplies = reply.tweets.length > 1;

    repliesJSX.push(
      <Tweet
        key={reply.tweets[0].id}
        tweet={reply.tweets[0]}
        drawReplyLine={hasNestedReplies}
      />
    );
    if (hasNestedReplies) {
      repliesJSX.push(
        <Tweet
          key={reply.tweets[1].id}
          tweet={reply.tweets[1]}
          drawReplyLine={false}
        />
      );
    }
  });

  return (
    <div className={styles.TweetThread}>
      <MainTweet tweet={tweet} />
      <div className={styles.CreateTweet}>Create tweet!</div>
      <List>{repliesJSX}</List>
    </div>
  );
};

export default TweetThread;
