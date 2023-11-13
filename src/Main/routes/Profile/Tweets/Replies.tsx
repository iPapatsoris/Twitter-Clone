import { useQuery } from "@tanstack/react-query";
import { userTweetsKeys } from "./queries";
import Tweet from "../../../components/Tweet/Tweet";
import List from "../../../layouts/ContentRight/List/List";
import ShowMoreTweets from "../../../components/Tweet/ShowMoreTweets";
import { useOutletContext } from "react-router-dom";

const Replies = () => {
  const username: string = useOutletContext();

  const { data, isSuccess } = useQuery(
    userTweetsKeys.tweetsOfUsername(username)._ctx.withReplies
  );

  if (!isSuccess) {
    return null;
  }

  const repliesJSX: React.ReactElement[] = [];
  data?.threads.forEach((thread, threadIndex) => {
    thread.tweets.forEach((tweet, index) => {
      if (!index) {
        const isFullThread = !thread.hasMoreNestedReplies;
        repliesJSX.push(
          <Tweet
            key={tweet.id}
            drawReplyLine={thread.tweets.length! > 1}
            tweetID={tweet.id}
          />
        );

        if (!isFullThread) {
          repliesJSX.push(
            <ShowMoreTweets
              // Is this key derived off index of data received safe?
              key={"expand " + thread.tweets[index + 1].id!}
              direction="upward"
              replyToExpand={thread.tweets[index + 1].id!}
              upwardProps={{
                username,
                threadIndex,
              }}
            />
          );
        }
      } else {
        repliesJSX.push(
          <Tweet
            key={tweet.id}
            drawReplyLine={index !== thread?.tweets.length! - 1}
            tweetID={tweet.id}
          />
        );
      }
    });
  });

  return <List>{repliesJSX}</List>;
};

export default Replies;
