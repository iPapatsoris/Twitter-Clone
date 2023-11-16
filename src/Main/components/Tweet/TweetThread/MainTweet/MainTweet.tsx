import Icon from "../../../../../util/components/Icon/Icon";
import Profile from "../../../../routes/Profile/Profile";
import styles from "./MainTweet.module.scss";
import { ReactComponent as DotsIcon } from "../../../../../assets/icons/dots-gray.svg";
import dayjs from "dayjs";
import TweetActions, {
  getRefreshTweetCallback,
} from "../../TweetActions/TweetActions";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addViewQuery } from "./queries";
import { tweetKeys } from "../../queries";

interface MainTweetProps {
  tweetID: number;
  tweetThreadRef: React.RefObject<HTMLDivElement>;
}

const MainTweet = ({ tweetID, tweetThreadRef }: MainTweetProps) => {
  const queryClient = useQueryClient();
  const { mutate: addViewMutation } = useMutation({
    mutationFn: addViewQuery,
    onSuccess: getRefreshTweetCallback(queryClient),
  });

  useEffect(() => {
    addViewMutation({ tweetID });
  }, [tweetID, addViewMutation]);

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

      ref.current?.scrollIntoView();
    }
  }, [tweetThreadRef, ref, tweetID]);

  const { data, isSuccess } = useQuery(tweetKeys.tweetID(tweetID));

  if (!isSuccess) {
    return null;
  }
  const { tweet } = data;
  if (!tweet) {
    return null;
  }

  return (
    <div ref={ref} className={styles.MainTweet}>
      <div className={styles.MainInfo}>
        <Profile
          preview={{
            type: "user-list",
            username: tweet.author.username!,
            iconAction: (
              <Icon
                src={DotsIcon}
                title="More"
                hover="primary"
                noBlockMargin
                noRightMargin
                extraWrapperStyles={[styles.DotsIcon]}
              />
            ),
          }}
        />
        <div className={styles.Text}>{tweet.text}</div>
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
          tweet={{
            id: tweet.id,
            stats: tweet.stats,
            isLiked: tweet.isLiked,
            isRetweeted: tweet.isRetweeted,
            author: tweet.author,
          }}
          justifyContent="space-around"
          extraIconProps={{
            noBlockMargin: true,
            size: 23,
          }}
        />
      </div>
    </div>
  );
};

export default MainTweet;
