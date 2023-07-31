import { Retweet } from "../../../../backend/src/entities/tweet";
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
import { Link, useNavigate } from "react-router-dom";
import { getPagePath } from "../../../util/paths";
import { useReplyLine } from "./TweetThread/useReplyLine";
import { useQuery } from "@tanstack/react-query";
import { tweetKeys } from "./queries";
import { elementIsContainedInRefs, refsExist } from "../../../util/ref";

interface TweetProps {
  tweetID: number;
  retweet?: Pick<Retweet, "retweetDate" | "retweeter">;
  // Conect a tweet with its reply with a line
  drawReplyLine?: boolean;
  // Make reply line stop at current tweet and not extend to next tweet.
  // Is typically used when the next tweet is a "showMoreTweets" option.
  noLineExtension?: boolean;
}

const Tweet = ({
  tweetID,
  retweet,
  drawReplyLine = false,
  noLineExtension = false,
}: TweetProps) => {
  const tweetRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLAnchorElement>(null);
  const usernameRef = useRef<HTMLAnchorElement>(null);
  const nestedLinkRefs = [avatarRef, nameRef, usernameRef];

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

  const { data } = useQuery({
    ...tweetKeys.tweetID(tweetID),
    enabled: false,
  });

  if (!data || !data.data) {
    return null;
  }
  const tweet = data.data;

  const getProfileLink = () => getPagePath("profile", tweet.author.username);

  const getTweetThreadLink = () =>
    getPagePath("tweet", tweet.author.username, tweet.id);

  const navToTweet = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (
      refsExist(nestedLinkRefs) &&
      !elementIsContainedInRefs(e, nestedLinkRefs)
    ) {
      navigate(getPagePath("tweet", tweet.author.username, tweet.id));
    }
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
        onClick={(e) => navToTweet(e)}
      >
        {retweet && (
          <div className={styles.Retweet} onMouseEnter={showProfilePreview}>
            <Icon
              src={retweetIcon}
              extraWrapperStyles={[styles.RetweetIconWrapper]}
              size={16}
              hover="none"
            />
            <div className={[styles.Retweeter, styles.LightColor].join(" ")}>
              {retweet.retweeter.name} Retweeted
            </div>
          </div>
        )}
        <div className={styles.TweetWrapper}>
          <Link to={getProfileLink()}>
            <div
              className={styles.Avatar}
              onMouseEnter={showProfilePreview}
              ref={avatarRef}
            >
              <Avatar src={tweet.author.avatar} />
              {drawReplyLine && (
                <div className={styles.ReplyLine} ref={replyLineRef}></div>
              )}
            </div>
          </Link>
          <div className={styles.Wrapper}>
            <>
              <div className={styles.Info}>
                <Link ref={nameRef} to={getProfileLink()}>
                  <span
                    className={styles.Name}
                    onMouseEnter={showProfilePreview}
                  >
                    {tweet.author.name}
                  </span>
                  {tweet.author.isVerified ? (
                    <div onMouseEnter={showProfilePreview}>
                      <Icon src={verifiedIcon} hover="none" size={18} />
                    </div>
                  ) : null}
                </Link>
                <div className={[styles.LightColor, styles.Subinfo].join(" ")}>
                  <Link ref={usernameRef} to={getProfileLink()}>
                    <span onMouseEnter={showProfilePreview}>
                      @{tweet.author.username}
                    </span>
                  </Link>
                  <span>·</span>
                  <Link to={getTweetThreadLink()}>
                    <span>
                      {dayjs(tweet.creationDate).format("MMM D, YYYY")}
                    </span>
                  </Link>
                </div>
                <div className={styles.MoreIcon}>
                  <Icon
                    src={dotsIcon}
                    title="More"
                    alt="More options"
                    hover="primary"
                    noBlockMargin
                    noLeftMargin
                    noRightMargin
                  />
                </div>
              </div>
              <div>{tweet.text}</div>
              <TweetActions
                includeText
                bookmarkInsteadOfViews={false}
                justifyContent="space-between"
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
