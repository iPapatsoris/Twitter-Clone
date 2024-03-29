import { useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "./TweetThread.module.scss";
import { tweetThreadKeys } from "./queries";
import { useParams } from "react-router-dom";
import MainTweet from "./MainTweet/MainTweet";
import Tweet from "../Tweet";
import List from "../../../layouts/ContentRight/List/List";
import ShowMoreTweets from "../ShowMoreTweets/ShowMoreTweets";
import { useRef, useState, useLayoutEffect } from "react";
import CreateTweet from "../CreateTweet/CreateTweet";
import useWindowDimensions from "../../../../util/hooks/useWindowDimensions";

const TweetThread = () => {
  const params = useParams();
  const queryClient = useQueryClient();
  const { isSmallScreen } = useWindowDimensions();
  const { data, isSuccess } = useQuery(
    tweetThreadKeys.tweetID(parseInt(params.tweetID!), queryClient)
  );

  const ref = useRef<HTMLDivElement>(null);
  const [refExists, setRefExists] = useState(false);

  useLayoutEffect(() => {
    if (ref) {
      setRefExists(true);
    }
  }, [ref]);

  if (!isSuccess) {
    return null;
  }

  const { tweet, replies, previousReplies } = data;
  const previousRepliesJSX: React.ReactElement[] = [];

  previousReplies.forEach((reply) => {
    previousRepliesJSX.push(
      <Tweet key={reply.id} tweetID={reply.id} drawReplyLine />
    );
  });

  const repliesJSX: React.ReactElement[] = [];
  replies.forEach((reply, replyIndex) => {
    reply.tweets.forEach((nestedReply, nestedReplyIndex, array) => {
      const isFinalReply = nestedReplyIndex === reply.tweets.length - 1;
      const getKey = (id: number, isFinalReply: boolean) =>
        id.toString() + " final " + isFinalReply;
      repliesJSX.push(
        <Tweet
          key={getKey(nestedReply.id, isFinalReply)}
          tweetID={nestedReply.id}
          drawReplyLine={!isFinalReply || reply.hasMoreNestedReplies}
          noLineExtension={isFinalReply && reply.hasMoreNestedReplies}
        />
      );
      if (isFinalReply && reply.hasMoreNestedReplies) {
        repliesJSX.push(
          <ShowMoreTweets
            key={tweet.id + " " + nestedReply.id + "more"}
            direction="downward"
            replyToExpand={array[array.length - 1].id}
            downwardProps={{ originalTweetID: tweet.id, replyIndex }}
          />
        );
      }
    });
  });

  return (
    <div ref={ref} className={styles.TweetThread}>
      <List>{previousRepliesJSX}</List>
      {!refExists ? null : (
        <MainTweet tweetThreadRef={ref} tweetID={tweet.id} />
      )}
      {!isSmallScreen && <CreateTweet referencedTweetID={tweet.id} />}
      <List>{repliesJSX}</List>
    </div>
  );
};

export default TweetThread;
