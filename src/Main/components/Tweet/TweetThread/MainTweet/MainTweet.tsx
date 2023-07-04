import { Tweet } from "../../../../../../backend/src/entities/tweet";
import Icon from "../../../../../util/components/Icon/Icon";
import Profile from "../../../../routes/Profile/Profile";
import styles from "./MainTweet.module.scss";
import dotsIcon from "../../../../../assets/icons/dots-gray.png";
import dayjs from "dayjs";
import TweetActions from "../../TweetActions/TweetActions";
import { useLayoutEffect, useRef } from "react";

interface MainTweetProps {
  tweet: Tweet;
  tweetThreadRef: React.RefObject<HTMLDivElement>;
}

const MainTweet = ({ tweet, tweetThreadRef }: MainTweetProps) => {
  const showStat = (name: string, stat: number) => (
    <span>
      <span className={styles.Bold}>{stat}</span> {name}
    </span>
  );

  const ref = useRef<HTMLDivElement>(null);

  // Setup a min-height for the tweet thread so that we can scroll to
  // specific tweet with it being at the top the screen
  useLayoutEffect(() => {
    if (tweetThreadRef && tweetThreadRef.current && ref && ref.current) {
      const tweetCoordinates = ref.current.getBoundingClientRect();
      tweetThreadRef.current.style.minHeight =
        "calc(" + tweetCoordinates.y + "px + " + window.scrollY + "px + 82vh)";
      ref.current?.scrollIntoView(true);
    }
  }, [tweetThreadRef, ref, tweet.id]);

  return (
    <div ref={ref} className={styles.MainTweet}>
      <div className={styles.MainInfo}>
        <Profile
          preview={{
            type: "user-list",
            username: tweet.author.username!,
            iconAction: (
              <Icon
                src={dotsIcon}
                title="More"
                hover="primary"
                exactRightPlacement
              />
            ),
          }}
        />
        <div>{tweet.text}</div>
        <div>
          <span className={styles.LightColor}>
            {dayjs(tweet.creationDate).format("h:ss A · MMM D, YYYY · ")}
          </span>
          <span className={styles.Bold}>{tweet.stats.views}</span>{" "}
          <span className={styles.LightColor}>Views</span>
        </div>
      </div>
      <div className={styles.Stats}>
        {showStat("Retweets", tweet.stats.totalRetweets)}
        {showStat("Likes", tweet.stats.totalLikes)}
        {showStat("Bookmarks", 0)}
      </div>
      <div className={styles.Actions}>
        <TweetActions
          includeText={false}
          bookmarkInsteadOfViews
          tweetStats={tweet.stats}
          justifyContent="space-around"
          extraIconProps={{
            exactVerticalPlacement: true,
            extraStyles: [styles.MainTweetActionIcon],
          }}
        />
      </div>
    </div>
  );
};

export default MainTweet;
