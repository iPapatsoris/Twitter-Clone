import TweetAction from "./TweetAction";
import styles from "./TweetActions.module.scss";
import retweetIcon from "../../../../assets/icons/tweet/retweet.png";
import replyIcon from "../../../../assets/icons/tweet/reply.png";
import likeIcon from "../../../../assets/icons/tweet/like.png";
import viewsIcon from "../../../../assets/icons/tweet/views.png";
import shareIcon from "../../../../assets/icons/tweet/share.png";
import { GetTweet } from "../../../../../backend/src/api/tweet";

interface TweetActionsProps {
  tweetStats: NonNullable<GetTweet["response"]["data"]>["tweet"]["stats"];
}

const TweetActions = ({ tweetStats }: TweetActionsProps) => {
  return (
    <div className={styles.TweetActions}>
      <TweetAction
        iconProps={{
          src: replyIcon,
          title: "Reply",
          exactLeftPlacement: true,
          hover: "primary",
        }}
        stat={tweetStats.totalReplies}
      />
      <TweetAction
        iconProps={{ src: retweetIcon, title: "Retweet", hover: "green" }}
        stat={tweetStats.totalRetweets}
      />
      <TweetAction
        iconProps={{ src: likeIcon, title: "Like", hover: "pink" }}
        stat={tweetStats.totalLikes}
      />
      <TweetAction
        iconProps={{ src: viewsIcon, title: "Views", hover: "primary" }}
        stat={tweetStats.views}
      />
      <TweetAction iconProps={{ src: shareIcon, title: "Share" }} />
    </div>
  );
};

export default TweetActions;
