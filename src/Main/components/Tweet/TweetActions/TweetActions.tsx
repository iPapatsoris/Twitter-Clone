import TweetAction from "./TweetAction";
import styles from "./TweetActions.module.scss";
import retweetIcon from "../../../../assets/icons/tweet/retweet.png";
import replyIcon from "../../../../assets/icons/tweet/reply.png";
import likeIcon from "../../../../assets/icons/tweet/like.png";
import viewsIcon from "../../../../assets/icons/tweet/views.png";
import shareIcon from "../../../../assets/icons/tweet/share.png";
import Icon from "../../../../util/components/Icon/Icon";
import { GetTweet } from "../../../../../backend/src/api/tweet";

interface TweetActionsProps {
  tweetStats: NonNullable<GetTweet["response"]["data"]>["tweet"]["stats"];
}

const TweetActions = ({ tweetStats }: TweetActionsProps) => {
  return (
    <div className={styles.TweetActions}>
      <TweetAction
        icon={<Icon src={replyIcon} title="Reply" exactLeftPlacement />}
        stat={tweetStats.totalReplies}
      />
      <TweetAction
        icon={<Icon src={retweetIcon} title="Retweet" />}
        stat={tweetStats.totalRetweets}
      />
      <TweetAction
        icon={<Icon src={likeIcon} title="Like" />}
        stat={tweetStats.totalLikes}
      />
      <TweetAction
        icon={<Icon src={viewsIcon} title="Views" />}
        stat={tweetStats.views}
      />
      <TweetAction icon={<Icon src={shareIcon} title="Share" />} />
    </div>
  );
};

export default TweetActions;
