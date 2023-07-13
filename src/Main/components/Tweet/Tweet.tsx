import {
  Retweet,
  Tweet as TweetT,
} from "../../../../backend/src/entities/tweet";
import Icon from "../../../util/components/Icon/Icon";
import Avatar from "../../routes/Profile/ProfileFace/Avatar/Avatar";
import styles from "./Tweet.module.scss";
import verifiedIcon from "../../../assets/icons/verified.png";
import dotsIcon from "../../../assets/icons/dots-gray.png";
import retweetIcon from "../../../assets/icons/tweet/retweet.png";
import dayjs from "dayjs";
import TweetActions from "./TweetActions/TweetActions";
import { useRef, useState } from "react";
import ProfileHoverPreview from "../../routes/Profile/ProfileFace/ProfileHoverPreview";
import { useNavigate } from "react-router-dom";
import { getPagePath } from "../../../util/paths";
import { useReplyLine } from "./TweetThread/useReplyLine";

interface TweetProps {
  tweet?: TweetT;
  retweet?: Retweet;
  // Conect a tweet with its reply with a line
  drawReplyLine?: boolean;
  // Make reply line stop at current tweet and not extend to next tweet.
  // Is typically used when the next tweet is a "showMoreTweets" option.
  noLineExtension?: boolean;
}

const Tweet = ({
  tweet: tweetProp,
  retweet,
  drawReplyLine = false,
  noLineExtension = false,
}: TweetProps) => {
  const tweetRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const replyLineRef = useRef<HTMLDivElement>(null);
  const [isProfilePreviewOpen, setIsProfilePreviewOpen] = useState(false);

  const showProfilePreview = () => {
    setIsProfilePreviewOpen(true);
  };

  const navigate = useNavigate();

  useReplyLine(
    drawReplyLine,
    noLineExtension,
    tweetRef,
    avatarRef,
    replyLineRef
  );

  const tweet = tweetProp || (retweet?.tweet as TweetT);

  const visitProfile = () => {
    navigate(getPagePath("profile", tweet.author.username));
  };

  const visitTweetThread = () => {
    navigate(getPagePath("tweet", tweet.author.username, tweet.id));
  };

  const tweetBorderClass = drawReplyLine ? "" : styles.WithBorder;

  return (
    <>
      <ProfileHoverPreview
        isOpen={isProfilePreviewOpen}
        setIsOpen={setIsProfilePreviewOpen}
        targetAreaRef={tweetRef}
        username={tweet.author.username}
      />
      <div
        ref={tweetRef}
        className={[styles.Tweet, tweetBorderClass].join(" ")}
      >
        {retweet && (
          <div className={styles.Retweet} onMouseEnter={showProfilePreview}>
            <Icon
              src={retweetIcon}
              extraWrapperStyles={[styles.RetweetIconWrapper]}
              extraStyles={[styles.RetweetIcon]}
              hover="none"
            />
            <div className={[styles.Retweeter, styles.LightColor].join(" ")}>
              {retweet.retweeter.name} Retweeted
            </div>
          </div>
        )}
        <div className={styles.TweetWrapper}>
          <div
            className={styles.Avatar}
            onClick={visitProfile}
            onMouseEnter={showProfilePreview}
            ref={avatarRef}
          >
            <Avatar src={tweet.author.avatar} />
            {drawReplyLine && (
              <div className={styles.ReplyLine} ref={replyLineRef}></div>
            )}
          </div>
          <div className={styles.Wrapper}>
            <>
              <div className={styles.Info}>
                <span
                  className={styles.Name}
                  onClick={visitProfile}
                  onMouseEnter={showProfilePreview}
                >
                  {tweet.author.name}
                </span>
                {tweet.author.isVerified ? (
                  <div onMouseEnter={showProfilePreview} onClick={visitProfile}>
                    <Icon
                      src={verifiedIcon}
                      hover="none"
                      extraStyles={[styles.Verified]}
                    />
                  </div>
                ) : null}
                <div className={[styles.LightColor, styles.Subinfo].join(" ")}>
                  <span
                    onClick={visitProfile}
                    onMouseEnter={showProfilePreview}
                  >
                    @{tweet.author.username}
                  </span>
                  <span>·</span>
                  <span onClick={visitTweetThread}>
                    {dayjs(tweet.creationDate).format("MMM D, YYYY")}
                  </span>
                </div>
                <div className={styles.MoreIcon}>
                  <Icon
                    src={dotsIcon}
                    title="More"
                    alt="More options"
                    hover="primary"
                    exactVerticalPlacement
                  />
                </div>
              </div>
              <div onClick={visitTweetThread}>{tweet.text}</div>
              <TweetActions
                includeText
                bookmarkInsteadOfViews={false}
                justifyContent="space-between"
                leftAlignFirstIcon
                tweet={{
                  id: tweet.id,
                  stats: tweet.stats,
                  isLiked: tweet.isLiked,
                  isRetweeted: tweet.isRetweeted,
                  author: tweet.author,
                }}
              />
            </>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tweet;
