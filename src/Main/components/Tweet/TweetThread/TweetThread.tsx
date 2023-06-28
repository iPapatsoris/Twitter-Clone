import { useQuery } from "@tanstack/react-query";
import Profile from "../../../routes/Profile/Profile";
import styles from "./TweetThread.module.scss";
import { tweetThreadKeys } from "./queries";
import { useParams } from "react-router-dom";
import Icon from "../../../../util/components/Icon/Icon";
import dotsIcon from "../../../../assets/icons/dots.png";
import dayjs from "dayjs";
import TweetActions from "../TweetActions/TweetActions";
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

  const repliesJSX = replies.map((reply) => <Tweet tweet={reply.tweets[0]} />);

  return (
    <div className={styles.TweetThread}>
      <MainTweet tweet={data.data?.tweet!} />
      <div className={styles.CreateTweet}>Create tweet!</div>
      <List>{repliesJSX}</List>
    </div>
  );
};

export default TweetThread;
