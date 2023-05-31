import { useQuery } from "@tanstack/react-query";
import styles from "./Tweets.module.scss";
import { userTweetsKeys } from "./queries";
import Tweet from "../../../components/Tweet/Tweet";
import List from "../../../layouts/ContentRight/List/List";

interface TweetsProps {
  userID: number;
}

const Tweets = ({ userID }: TweetsProps) => {
  const { data, isSuccess } = useQuery(userTweetsKeys.userID(userID));

  if (!isSuccess) {
    return null;
  }

  const tweets = data.data!.tweetsAndRetweets.map((t) => {
    return (
      <Tweet
        key={t.tweet ? t.tweet.id : t.retweet?.tweet.id}
        tweet={t.tweet || t.retweet?.tweet!}
      />
    );
  });

  return <List>{tweets}</List>;
};

export default Tweets;
