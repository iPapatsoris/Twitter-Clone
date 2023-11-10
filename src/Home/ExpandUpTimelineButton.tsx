import { GetTimeline } from "../../backend/src/api/tweet";
import styles from "./Home.module.scss";
import { useExtraTweetActions } from "./useExtraTweetsStore";
import { getTweetOrRetweetID } from "./util";

interface ExpandUpTimelineButtonProps {
  freshTweets: NonNullable<
    GetTimeline["response"]["data"]
  >["tweetsAndRetweets"];
}

const ExpandUpTimelineButton = ({
  freshTweets,
}: ExpandUpTimelineButtonProps) => {
  const { addTweetsAtFront, setMaxLoadedTweetIDFromUpTimeline } =
    useExtraTweetActions();

  const onClickHandler = () => {
    const maxFreshTweet = freshTweets.length ? freshTweets[0] : null;
    let maxFreshTweetID = -1;
    if (maxFreshTweet) {
      maxFreshTweetID = maxFreshTweet.tweet
        ? maxFreshTweet.tweet.id
        : maxFreshTweet.retweet!.id;
    }
    setMaxLoadedTweetIDFromUpTimeline(maxFreshTweetID);
    addTweetsAtFront(
      freshTweets.map((t) => ({
        id: getTweetOrRetweetID(t),
        retweet: t.retweet && {
          innerTweetID: t.retweet.tweet.id,
          retweeter: t.retweet.retweeter,
          retweetDate: t.retweet.retweetDate,
        },
      }))
    );
  };

  return (
    <span
      onClick={onClickHandler}
      className={[
        styles.ExpandUpTimelineButton,
        styles.PrimaryColor,
        styles.BigText,
      ].join(" ")}
    >
      Show {freshTweets.length} new tweet{freshTweets.length > 1 && "s"}
    </span>
  );
};

export default ExpandUpTimelineButton;
