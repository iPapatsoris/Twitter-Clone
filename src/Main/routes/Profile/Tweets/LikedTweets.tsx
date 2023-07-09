import { useQuery } from "@tanstack/react-query";
import Tweet from "../../../components/Tweet/Tweet";
import List from "../../../layouts/ContentRight/List/List";
import { useOutletContext } from "react-router-dom";
import { userTweetsKeys } from "./queries";

const LikedTweets = () => {
  const username: string = useOutletContext();
  const { data, isSuccess } = useQuery(
    userTweetsKeys.tweetsOfUsername(username)._ctx.likedTweets
  );

  if (!isSuccess) {
    return null;
  }

  const tweets = data.data!.tweets.map((t) => {
    return <Tweet key={t.id} tweet={t} />;
  });

  return <List>{tweets}</List>;
};

export default LikedTweets;
