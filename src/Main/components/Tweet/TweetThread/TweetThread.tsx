import { useQuery } from "@tanstack/react-query";
import Profile from "../../../routes/Profile/Profile";
import styles from "./TweetThread.module.scss";
import { tweetThreadKeys } from "./queries";
import { useParams } from "react-router-dom";
import Icon from "../../../../util/components/Icon/Icon";
import dotsIcon from "../../../../assets/icons/dots.png";
import dayjs from "dayjs";
import TweetActions from "../TweetActions/TweetActions";

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

  const showStat = (name: string, stat: number) => (
    <span>
      <span className={styles.Bold}>{stat}</span> {name}
    </span>
  );

  return (
    <div className={styles.TweetThread}>
      <div className={styles.MainTweet}>
        <div className={styles.MainInfo}>
          <Profile
            preview={{
              type: "user-list",
              username: data.data?.tweet.author.username!,
              iconAction: (
                <Icon
                  src={dotsIcon}
                  title="More"
                  hover="primary"
                  exactRightPlacement
                />
              ),
            }}
          />
          <div>{tweet.text}</div>
          <div>
            <span className={styles.LightColor}>
              {dayjs(tweet.creationDate).format("h:ss A · MMM D, YYYY · ")}
            </span>
            <span className={styles.Bold}>{tweet.stats.views}</span>{" "}
            <span className={styles.LightColor}>Views</span>
          </div>
        </div>
        <div className={styles.Stats}>
          {showStat("Retweets", tweet.stats.totalRetweets)}
          {showStat("Likes", tweet.stats.totalLikes)}
          {showStat("Bookmarks", 0)}
        </div>
        <div>
          <TweetActions
            includeText={false}
            bookmarkInsteadOfViews
            tweetStats={tweet.stats}
            justifyContent="space-around"
            extraIconProps={{
              exactVerticalPlacement: true,
              extraStyles: [styles.MainTweetActionIcon],
            }}
          />
        </div>
        <div className={styles.CreateTweet}>Tweet your reply!</div>
      </div>
    </div>
  );
};

export default TweetThread;
