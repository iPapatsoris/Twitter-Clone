import { useQuery } from "@tanstack/react-query";
import { userTweetsKeys } from "./queries";
import Tweet from "../../../components/Tweet/Tweet";
import List from "../../../layouts/ContentRight/List/List";

interface TweetsProps {
  username: string;
}

const Tweets = ({ username }: TweetsProps) => {
  const { data, isSuccess } = useQuery(
    userTweetsKeys.tweetsOfUsername(username)
  );

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
