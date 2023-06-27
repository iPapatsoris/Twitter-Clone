import styles from "./TweetActions.module.scss";
import retweetIcon from "../../../../assets/icons/tweet/retweet.png";
import replyIcon from "../../../../assets/icons/tweet/reply.png";
import likeIcon from "../../../../assets/icons/tweet/like.png";
import viewsIcon from "../../../../assets/icons/tweet/views.png";
import shareIcon from "../../../../assets/icons/tweet/share.png";
import bookmarkIcon from "../../../../assets/icons/tweet/bookmark.png";
import { GetTweet } from "../../../../../backend/src/api/tweet";
import Icon, { IconProps } from "../../../../util/components/Icon/Icon";

interface TweetActionsProps {
  tweetStats: NonNullable<GetTweet["response"]["data"]>["tweet"]["stats"];
  includeText: boolean;
  bookmarkInsteadOfViews: boolean;
  leftAlignFirstIcon?: boolean;
  justifyContent: "space-around" | "space-between";
  extraIconProps?: Partial<IconProps>;
}

const TweetActions = ({
  tweetStats,
  includeText,
  bookmarkInsteadOfViews,
  leftAlignFirstIcon = false,
  justifyContent,
  extraIconProps = {},
}: TweetActionsProps) => {
  return (
    <div
      className={[
        styles.TweetActions,
        justifyContent === "space-between"
          ? styles.SpaceBetween
          : styles.SpaceAround,
      ].join(" ")}
    >
      <Icon
        src={replyIcon}
        hover="primary"
        title="Reply"
        text={includeText ? tweetStats.totalReplies.toString() : ""}
        exactLeftPlacement={leftAlignFirstIcon}
        {...extraIconProps}
      />
      <Icon
        src={retweetIcon}
        hover="green"
        title="Retweet"
        text={includeText ? tweetStats.totalRetweets.toString() : ""}
        {...extraIconProps}
      />
      <Icon
        src={likeIcon}
        hover="pink"
        title="Like"
        text={includeText ? tweetStats.totalLikes.toString() : ""}
        {...extraIconProps}
      />
      {bookmarkInsteadOfViews ? (
        <Icon
          src={bookmarkIcon}
          hover="primary"
          title="Bookmark"
          text={includeText ? tweetStats.views.toString() : ""}
          {...extraIconProps}
        />
      ) : (
        <Icon
          src={viewsIcon}
          hover="primary"
          title="Views"
          text={includeText ? tweetStats.views.toString() : ""}
          {...extraIconProps}
        />
      )}
      <Icon src={shareIcon} hover="primary" title="Share" {...extraIconProps} />
    </div>
  );
};

export default TweetActions;
