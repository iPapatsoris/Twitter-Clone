import { Tweet as TweetT } from "../../../../backend/src/entities/tweet";
import Icon from "../../../util/components/Icon/Icon";
import Avatar from "../../routes/Profile/Avatar/Avatar";
import styles from "./Tweet.module.scss";
import verifiedIcon from "../../../assets/icons/verified.png";
import dotsIcon from "../../../assets/icons/dots-gray.png";
import dayjs from "dayjs";
import TweetActions from "./TweetActions/TweetActions";
import { useEffect, useRef, useState } from "react";
import ProfileHoverPreview from "../../routes/Profile/ProfileHoverPreview";
import { useNavigate } from "react-router-dom";
import { getPagePath } from "../../../util/paths";
import { useQueryClient } from "@tanstack/react-query";
import {
  mediumPreviewProfileFields,
  profileKeys,
  smallPreviewProfileFields,
} from "../../routes/Profile/queries";
import { GetUser } from "../../../../backend/src/api/user";

interface TweetProps {
  tweet: TweetT;
}

const Tweet = ({ tweet }: TweetProps) => {
  const tweetRef = useRef<HTMLDivElement>(null);
  const [isProfilePreviewOpen, setIsProfilePreviewOpen] = useState(false);
  const onMouseEnter = () => {
    setIsProfilePreviewOpen(true);
  };
  const navigate = useNavigate();

  const visitProfile = () => {
    navigate(getPagePath("profile", tweet.author.username));
  };

  const visitTweetThread = () => {
    navigate(getPagePath("tweet", tweet.author.username, tweet.id));
  };

  return (
    <>
      <ProfileHoverPreview
        isOpen={isProfilePreviewOpen}
        setIsOpen={setIsProfilePreviewOpen}
        targetAreaRef={tweetRef}
        username={tweet.author.username}
      />
      <div className={styles.Tweet} ref={tweetRef}>
        <div
          className={styles.Avatar}
          onClick={visitProfile}
          onMouseEnter={onMouseEnter}
        >
          <Avatar src={tweet.author.avatar} />
        </div>
        <div className={styles.Wrapper}>
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
                // onClick={() => setShowOptions(true)}
                // ref={iconRef}
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
        </div>
      </div>
    </>
  );
};

export default Tweet;
