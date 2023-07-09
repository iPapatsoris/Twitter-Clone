import { useQuery } from "@tanstack/react-query";
import { userTweetsKeys } from "./queries";
import Tweet from "../../../components/Tweet/Tweet";
import List from "../../../layouts/ContentRight/List/List";
import styles from "../Profile.module.scss";
import ShowMoreTweets from "../../../components/Tweet/ShowMoreTweets";
import { useOutletContext } from "react-router-dom";

const TweetsWithReplies = () => {
  const username: string = useOutletContext();
  const { data, isSuccess } = useQuery(
    userTweetsKeys.tweetsOfUsername(username)._ctx.withReplies
  );

  if (!isSuccess) {
    return null;
  }

  const repliesJSX: React.ReactElement[] = [];
  data.data!.threadsAndRetweets.forEach((t, threadIndex) => {
    if (t.retweet) {
      repliesJSX.push(
        <Tweet key={t.retweet.tweet.id} tweet={t.retweet.tweet} />
      );
    } else {
      t.thread?.tweets.forEach((tweet, index) => {
        if (!index) {
          const isFullThread = !t.thread?.hasMoreNestedReplies;
          repliesJSX.push(<Tweet key={tweet.id} drawReplyLine tweet={tweet} />);
          if (!isFullThread) {
            repliesJSX.push(
              <ShowMoreTweets
                direction="upward"
                replyToExpand={t.thread?.tweets[index + 1].id!}
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
              drawReplyLine={index !== t.thread?.tweets.length! - 1}
              tweet={tweet}
            />
          );
        }
      });
    }
  });

  return <List>{repliesJSX}</List>;
};

export default TweetsWithReplies;
