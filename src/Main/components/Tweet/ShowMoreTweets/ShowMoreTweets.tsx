import { useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "../Tweet.module.scss";
import { ExpansionDirection, tweetThreadKeys } from "../TweetThread/queries";
import { useReplyLine } from "../TweetThread/useReplyLine";
import { useRef } from "react";
import expandReplies from "./expandReplies";

interface ShowMoreTweetsProps {
  replyToExpand: number;
  direction: ExpansionDirection;
  downwardProps?: {
    originalTweetID: number;
    replyIndex: number;
  };
  upwardProps?: {
    username: string;
    threadIndex: number;
    pageIndex: number;
  };
}

const ShowMoreTweets = ({
  replyToExpand,
  direction,
  downwardProps,
  upwardProps,
}: ShowMoreTweetsProps) => {
  const { refetch } = useQuery({
    ...tweetThreadKeys.expandReply(replyToExpand, direction),
    enabled: false,
  });
  const queryClient = useQueryClient();
  const showMoreTweetsWrapperRef = useRef<HTMLDivElement>(null);
  const dotsContainerRef = useRef<HTMLDivElement>(null);
  const replyLineRef = useRef<HTMLDivElement>(null);

  useReplyLine(
    direction === "upward",
    false,
    showMoreTweetsWrapperRef,
    dotsContainerRef,
    replyLineRef
  );

  const handleClick = () =>
    expandReplies({
      props: { upwardProps, downwardProps, direction },
      refetch,
      queryClient,
    });

  return (
    <div
      className={styles.TweetWrapper}
      ref={showMoreTweetsWrapperRef}
      onClick={handleClick}
    >
      <div className={styles.ShowMoreIcon} ref={dotsContainerRef}>
        <div></div>
        <div></div>
        <div></div>
        <div className={styles.ReplyLine} ref={replyLineRef}></div>
      </div>
      <div className={styles.Wrapper}>
        <div className={styles.ShowMore}>Show replies</div>
      </div>
    </div>
  );
};

export default ShowMoreTweets;
