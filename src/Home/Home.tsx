import { useQuery, useQueryClient } from "@tanstack/react-query";
import CreateTweet from "../Main/components/Tweet/CreateTweet/CreateTweet";
import "./Home.scss";
import { timelineKeys } from "./queries";
import Tweet from "../Main/components/Tweet/Tweet";
import List from "../Main/layouts/ContentRight/List/List";
import "react-circular-progressbar/dist/styles.css";

const Home = () => {
  const queryClient = useQueryClient();
  const { data, isSuccess } = useQuery(timelineKeys.timeline(queryClient));

  if (!isSuccess) {
    return null;
  }

  const tweets = data.data!.tweetsAndRetweets.map((t) => {
    return (
      <Tweet
        key={t.tweet ? t.tweet.id : t.retweet?.tweet.id}
        tweetID={t.tweet ? t.tweet.id : t.retweet?.tweet.id!}
        retweet={t.retweet}
      />
    );
  });

  return (
    <div>
      <div className="Home">
        <CreateTweet />
        <List>{tweets}</List>
      </div>
    </div>
  );
};

export default Home;
