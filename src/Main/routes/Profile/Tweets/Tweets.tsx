import { useQuery } from "@tanstack/react-query";
import { userTweetsKeys } from "./queries";
import Tweet from "../../../components/Tweet/Tweet";
import List from "../../../layouts/ContentRight/List/List";
import { useOutletContext } from "react-router-dom";

const Tweets = () => {
  const username: string = useOutletContext();
  const { data, isSuccess } = useQuery(
    userTweetsKeys.tweetsOfUsername(username)
  );

  if (!isSuccess) {
    return null;
  }

  const tweets = data!.tweetsAndRetweets.map((t) => {
    return (
      <Tweet
        key={t.tweet ? t.tweet.id : t.retweet?.tweet.id}
        tweetID={t.tweet ? t.tweet.id : t.retweet?.tweet.id!}
        retweet={t.retweet}
      />
    );
  });

  return <List>{tweets}</List>;
};

export default Tweets;
