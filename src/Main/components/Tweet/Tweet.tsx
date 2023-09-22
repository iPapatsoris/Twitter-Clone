import { Retweet } from "../../../../backend/src/entities/tweet";
import Icon from "../../../util/components/Icon/Icon";
import Avatar from "../../routes/Profile/ProfileFace/Avatar/Avatar";
import styles from "./Tweet.module.scss";
import { ReactComponent as VerifiedIcon } from "../../../assets/icons/verified.svg";
import { ReactComponent as DotsIcon } from "../../../assets/icons/dots-gray.svg";
import { ReactComponent as RetweetIcon } from "../../../assets/icons/tweet/retweet.svg";
import dayjs from "dayjs";
import TweetActions from "./TweetActions/TweetActions";
import { useRef } from "react";
import ProfileHoverPreview from "../../routes/Profile/ProfileFace/ProfileHoverPreview";
import { Link, useNavigate } from "react-router-dom";
import { getPagePath } from "../../../util/paths";
import { useReplyLine } from "./TweetThread/useReplyLine";
import { useQuery } from "@tanstack/react-query";
import { tweetKeys } from "./queries";
import { elementIsContainedInRefs, refsExist } from "../../../util/ref";
import { useHoverPopup } from "../../../util/hooks/useHoverPopup";

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
  const tweetOptionsRef = useRef<HTMLDivElement>(null);
  const nestedLinkRefs = [avatarRef, nameRef, usernameRef, tweetOptionsRef];

  const replyLineRef = useRef<HTMLDivElement>(null);

  const { isHoverPopupOpen, abortHoverPopupOpen, setIsHoverPopupOpen } =
    useHoverPopup();

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
        isOpen={isHoverPopupOpen}
        setIsOpen={setIsHoverPopupOpen}
        targetAreaRef={tweetRef}
        username={tweet.author.username}
      />
      <div
        ref={tweetRef}
        className={[styles.Tweet, tweetBorderClass].join(" ")}
        onClick={(e) => navToTweet(e)}
      >
        {retweet && (
          <div
            className={styles.Retweet}
            onMouseEnter={() => setIsHoverPopupOpen(true)}
            onMouseLeave={abortHoverPopupOpen}
          >
            <Icon
              src={RetweetIcon}
              extraWrapperStyles={[styles.RetweetIconWrapper]}
              size={16}
              hover="none"
            />
            <div
              className={[
                styles.SmallText,
                styles.Bold,
                styles.LightColor,
              ].join(" ")}
            >
              {retweet.retweeter.name} Retweeted
            </div>
          </div>
        )}
        <div className={styles.TweetWrapper}>
          <Link to={getProfileLink()}>
            <div
              className={styles.Avatar}
              onMouseEnter={() => setIsHoverPopupOpen(true)}
              onMouseLeave={abortHoverPopupOpen}
              ref={avatarRef}
            >
              <Avatar src={tweet.author.avatar} iconProps={{ hover: "none" }} />
              {drawReplyLine && (
                <div className={styles.ReplyLine} ref={replyLineRef}></div>
              )}
            </div>
          </Link>
          <div className={styles.Wrapper}>
            <>
              <div className={styles.Info}>
                <Link ref={nameRef} to={getProfileLink()}>
                  <div className={styles.NameAndVerified}>
                    <span
                      className={[styles.BigText, styles.Bold].join(" ")}
                      onMouseEnter={() => setIsHoverPopupOpen(true)}
                      onMouseLeave={abortHoverPopupOpen}
                    >
                      {tweet.author.name}
                    </span>
                    {tweet.author.isVerified ? (
                      <div
                        onMouseEnter={() => setIsHoverPopupOpen(true)}
                        onMouseLeave={abortHoverPopupOpen}
                      >
                        <Icon src={VerifiedIcon} hover="none" size={18} />
                      </div>
                    ) : null}
                  </div>
                </Link>
                <div className={[styles.LightColor, styles.Subinfo].join(" ")}>
                  <Link ref={usernameRef} to={getProfileLink()}>
                    <span
                      onMouseEnter={() => setIsHoverPopupOpen(true)}
                      onMouseLeave={abortHoverPopupOpen}
                    >
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
                <div ref={tweetOptionsRef} className={styles.MoreIcon}>
                  <Icon
                    src={DotsIcon}
                    title="More"
                    alt="More options"
                    hover="primary"
                    noBlockMargin
                    noLeftMargin
                    noRightMargin
                  />
                </div>
              </div>
              <div className={styles.Text}>{tweet.text}</div>
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
