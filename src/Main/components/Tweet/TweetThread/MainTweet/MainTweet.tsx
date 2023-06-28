import { Tweet } from "../../../../../../backend/src/entities/tweet";
import Icon from "../../../../../util/components/Icon/Icon";
import Profile from "../../../../routes/Profile/Profile";
import styles from "./MainTweet.module.scss";
import dotsIcon from "../../../../../assets/icons/dots.png";
import dayjs from "dayjs";
import TweetActions from "../../TweetActions/TweetActions";

interface MainTweetProps {
  tweet: Tweet;
}

const MainTweet = ({ tweet }: MainTweetProps) => {
  const showStat = (name: string, stat: number) => (
    <span>
      <span className={styles.Bold}>{stat}</span> {name}
    </span>
  );

  return (
    <div className={styles.MainTweet}>
      <div className={styles.MainInfo}>
        <Profile
          preview={{
            type: "user-list",
            username: tweet.author.username!,
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
      <div className={styles.Actions}>
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
    </div>
  );
};

export default MainTweet;
