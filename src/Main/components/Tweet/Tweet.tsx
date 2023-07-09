import { Tweet as TweetT } from "../../../../backend/src/entities/tweet";
import Icon from "../../../util/components/Icon/Icon";
import Avatar from "../../routes/Profile/ProfileFace/Avatar/Avatar";
import styles from "./Tweet.module.scss";
import verifiedIcon from "../../../assets/icons/verified.png";
import dotsIcon from "../../../assets/icons/dots-gray.png";
import dayjs from "dayjs";
import TweetActions from "./TweetActions/TweetActions";
import { useRef, useState } from "react";
import ProfileHoverPreview from "../../routes/Profile/ProfileFace/ProfileHoverPreview";
import { useNavigate } from "react-router-dom";
import { getPagePath } from "../../../util/paths";
import { useReplyLine } from "./TweetThread/useReplyLine";

interface TweetProps {
  tweet: TweetT;
  // Conect a tweet with its reply with a line
  drawReplyLine?: boolean;
  // Make reply line stop at current tweet and not extend to next tweet.
  // Is typically used when the next tweet is a "showMoreTweets" option.
  noLineExtension?: boolean;
}

const Tweet = ({
  tweet,
  drawReplyLine = false,
  noLineExtension = false,
}: TweetProps) => {
  const tweetRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const replyLineRef = useRef<HTMLDivElement>(null);
  const [isProfilePreviewOpen, setIsProfilePreviewOpen] = useState(false);
  const onMouseEnter = () => {
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
        className={[styles.Tweet, tweetBorderClass].join(" ")}
        ref={tweetRef}
      >
        <div
          className={styles.Avatar}
          onClick={visitProfile}
          onMouseEnter={onMouseEnter}
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
                onMouseEnter={onMouseEnter}
              >
                {tweet.author.name}
              </span>
              {tweet.author.isVerified ? (
                <div onMouseEnter={onMouseEnter} onClick={visitProfile}>
                  <Icon
                    src={verifiedIcon}
                    hover="none"
                    extraStyles={[styles.Verified]}
                  />
                </div>
              ) : null}
              <div className={[styles.LightColor, styles.Subinfo].join(" ")}>
                <span onClick={visitProfile} onMouseEnter={onMouseEnter}>
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
              tweetStats={tweet.stats}
            />
          </>
        </div>
      </div>
    </>
  );
};

export default Tweet;
