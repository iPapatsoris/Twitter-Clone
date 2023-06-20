import styles from "./TweetActions.module.scss";
import retweetIcon from "../../../../assets/icons/tweet/retweet.png";
import replyIcon from "../../../../assets/icons/tweet/reply.png";
import likeIcon from "../../../../assets/icons/tweet/like.png";
import viewsIcon from "../../../../assets/icons/tweet/views.png";
import shareIcon from "../../../../assets/icons/tweet/share.png";
import { GetTweet } from "../../../../../backend/src/api/tweet";
import Icon from "../../../../util/components/Icon/Icon";

interface TweetActionsProps {
  tweetStats: NonNullable<GetTweet["response"]["data"]>["tweet"]["stats"];
}

const TweetActions = ({ tweetStats }: TweetActionsProps) => {
  return (
    <div className={styles.TweetActions}>
      <Icon
        src={replyIcon}
        hover="primary"
        title="Reply"
        exactLeftPlacement
        text={tweetStats.totalReplies.toString()}
      />
      <Icon
        src={retweetIcon}
        hover="green"
        title="Retweet"
        text={tweetStats.totalRetweets.toString()}
      />
      <Icon
        src={likeIcon}
        hover="pink"
        title="Like"
        text={tweetStats.totalLikes.toString()}
      />
      <Icon
        src={viewsIcon}
        hover="primary"
        title="Views"
        text={tweetStats.views.toString()}
      />
      <Icon src={shareIcon} hover="primary" title="Share" />
    </div>
  );
};

export default TweetActions;
