import { Retweet } from "../../../../backend/src/entities/tweet";
import Icon from "../../../util/components/Icon/Icon";
import Avatar from "../../routes/Profile/ProfileFace/Avatar/Avatar";
import styles from "./Tweet.module.scss";
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
import NameAndVerified from "../NameAndVerified/NameAndVerified";

interface TweetProps {
  tweetID: number;
  retweet?: Pick<Retweet, "retweetDate" | "retweeter">;
  // Conect a tweet with its reply with a line
  drawReplyLine?: boolean;
  // Make reply line stop at current tweet and not extend to next tweet.
  // Used when the next tweet is a "showMoreTweets" option.
  noLineExtension?: boolean;
  // Simple view that omits several subcomponents. Used in the modal that
  // responds to a tweet.
  simpleView?: boolean;
}

const Tweet = ({
  tweetID,
  retweet,
  drawReplyLine = false,
  noLineExtension = false,
  simpleView = false,
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

  if (!data || !data?.tweet) {
    return null;
  }
  const tweet = data.tweet!;

  const getProfileLink = () => getPagePath("profile", tweet.author.username);

  const getTweetThreadLink = () =>
    getPagePath("tweet", tweet.author.username, tweet.id);

  const navToTweet = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (
      !simpleView &&
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
        <div
          className={[
            styles.TweetWrapper,
            simpleView ? styles.Simple : "",
          ].join(" ")}
        >
          <Link to={getProfileLink()}>
            <div
              className={styles.Avatar}
              onMouseEnter={() => setIsHoverPopupOpen(true)}
              onMouseLeave={abortHoverPopupOpen}
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
                <Link
                  ref={nameRef}
                  to={getProfileLink()}
                  onMouseEnter={() => setIsHoverPopupOpen(true)}
                  onMouseLeave={abortHoverPopupOpen}
                >
                  <NameAndVerified
                    name={tweet.author.name}
                    isVerified={tweet.author.isVerified}
                    underlineNameOnHover
                  />
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
                    <span className={styles.UnderlineOnHover}>
                      {dayjs(tweet.creationDate).format("MMM D, YYYY")}
                    </span>
                  </Link>
                </div>
                {!simpleView && (
                  <div ref={tweetOptionsRef} className={styles.MoreIcon}>
                    <Icon
                      src={DotsIcon}
                      title="More"
                      alt="More options"
                      hover="primary"
                      noBlockMargin
                      noRightMargin
                    />
                  </div>
                )}
              </div>
              <div className={styles.Text}>{tweet.text}</div>
              {!simpleView && (
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
              )}
            </>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tweet;
