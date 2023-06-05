import { Tweet as TweetT } from "../../../../backend/src/entities/tweet";
import Icon from "../../../util/components/Icon/Icon";
import Avatar from "../../routes/Profile/Avatar/Avatar";
import styles from "./Tweet.module.scss";
import verifiedIcon from "../../../assets/icons/verified.png";
import dotsIcon from "../../../assets/icons/dots-gray.png";
import dayjs from "dayjs";

interface TweetProps {
  tweet: TweetT;
}

const Tweet = ({ tweet }: TweetProps) => {
  return (
    <div className={styles.Tweet}>
      <div className={styles.Avatar}>
        <Avatar src={tweet.author.avatar} />
      </div>
      <div className={styles.Wrapper}>
        <div className={styles.Info}>
          <span className={styles.Name}>{tweet.author.name}</span>
          {tweet.author.isVerified ? (
            <Icon
              src={verifiedIcon}
              hover="none"
              extraStyles={[styles.Verified]}
            />
          ) : null}
          <div className={[styles.LightColor, styles.Subinfo].join(" ")}>
            <span>@{tweet.author.username}</span>
            <span>·</span>
            <span>{dayjs(tweet.creationDate).format("MMM D, YYYY")}</span>
          </div>
          <div className={styles.MoreIcon}>
            <Icon
              src={dotsIcon}
              title="More"
              alt="More options"
              hover="primary"
              exactVerticalPlacement
              // onClick={() => setShowOptions(true)}
              // ref={iconRef}
            />
          </div>
        </div>
        <div className={styles.Content}>{tweet.text}</div>
        <div className={styles.Actions}>{}</div>
      </div>
    </div>
  );
};

export default Tweet;
