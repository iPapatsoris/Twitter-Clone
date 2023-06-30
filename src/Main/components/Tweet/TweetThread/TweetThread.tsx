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
    reply.tweets.forEach((nestedReply, index) => {
      const isFinalReply = index === reply.tweets.length - 1;
      const getKey = (id: number, isFinalReply: boolean) =>
        id.toString() + " final " + isFinalReply;
      repliesJSX.push(
        <Tweet
          key={getKey(nestedReply.id, isFinalReply)}
          tweet={nestedReply}
          drawReplyLine={!isFinalReply || reply.hasMoreNestedReplies}
          noLineExtension={isFinalReply && reply.hasMoreNestedReplies}
        />
      );
      if (isFinalReply && reply.hasMoreNestedReplies) {
        repliesJSX.push(<Tweet key={"more "} showMoreTweets />);
      }
    });
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
