import styles from "./TweetActions.module.scss";
import { ReactComponent as RetweetIcon } from "../../../../assets/icons/tweet/retweet.svg";
import { ReactComponent as RetweetActiveIcon } from "../../../../assets/icons/tweet/retweet-active.svg";
import { ReactComponent as ReplyIcon } from "../../../../assets/icons/tweet/reply.svg";
import { ReactComponent as LikeIcon } from "../../../../assets/icons/tweet/like.svg";
import { ReactComponent as LikedIcon } from "../../../../assets/icons/tweet/liked.svg";
import { ReactComponent as ViewsIcon } from "../../../../assets/icons/tweet/views.svg";
import { ReactComponent as ShareIcon } from "../../../../assets/icons/tweet/share.svg";
import { ReactComponent as BookmarkIcon } from "../../../../assets/icons/tweet/bookmark.svg";
import Icon, { IconProps } from "../../../../util/components/Icon/Icon";
import {
  QueryClient,
  UseMutationOptions,
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Tweet } from "../../../../../backend/src/entities/tweet";
import {
  likeTweetQuery,
  retweetQuery,
  undoRetweetQuery,
  unlikeTweetQuery,
} from "./queries";
import { tweetKeys } from "../queries";
import { SingleTweetResponse } from "../../../../../backend/src/api/tweet";
import { useState } from "react";
import Modal from "../../../../util/components/Modal/Modal";
import CreateTweetModal from "../../../../Sidebar/CreateTweetModal/CreateTweetModal";
import useCloseCreateTweetModal from "../CreateTweet/useCloseCreateTweetModal";

export const getRefreshTweetCallback =
  (
    queryClient: QueryClient
  ): UseMutationOptions<
    { tweet: SingleTweetResponse["data"] },
    unknown,
    { tweetID: number }
  >["onSuccess"] =>
  (res, { tweetID }) => {
    if (res.tweet) {
      const options = tweetKeys.tweetID(tweetID);
      queryClient.setQueryData(queryOptions(options).queryKey, {
        tweet: res.tweet,
      });
    }
  };
interface TweetActionsProps {
  includeText: boolean;
  bookmarkInsteadOfViews: boolean;
  justifyContent: "space-around" | "space-between";
  extraIconProps?: Partial<IconProps>;
  tweet: Pick<Tweet, "stats" | "isLiked" | "isRetweeted" | "id" | "author">;
}

const TweetActions = ({
  includeText,
  bookmarkInsteadOfViews,
  justifyContent,
  extraIconProps = {},
  tweet,
}: TweetActionsProps) => {
  const { stats, isLiked, isRetweeted, id } = tweet;
  const queryClient = useQueryClient();

  const { mutate: likeTweetMutation } = useMutation({
    mutationFn: likeTweetQuery,
    onSuccess: getRefreshTweetCallback(queryClient),
  });

  const { mutate: unlikeTweetMutation } = useMutation({
    mutationFn: unlikeTweetQuery,
    onSuccess: getRefreshTweetCallback(queryClient),
  });

  const { mutate: retweetMutation } = useMutation({
    mutationFn: retweetQuery,
    onSuccess: getRefreshTweetCallback(queryClient),
  });

  const { mutate: undoRetweetMutation } = useMutation({
    mutationFn: undoRetweetQuery,
    onSuccess: getRefreshTweetCallback(queryClient),
  });

  const [showReplyModal, setShowReplyModal] = useState(false);
  useCloseCreateTweetModal(setShowReplyModal);

  return (
    <>
      {showReplyModal && (
        <Modal extraStyles={[styles.Modal]} setIsActive={setShowReplyModal}>
          <CreateTweetModal replyingToTweetID={id} />
        </Modal>
      )}
      <div
        className={[
          styles.TweetActions,
          justifyContent === "space-between"
            ? styles.SpaceBetween
            : styles.SpaceAround,
        ].join(" ")}
      >
        <Icon
          src={ReplyIcon}
          hover="primary"
          title="Reply"
          text={includeText ? stats.totalReplies.toString() : ""}
          noBottomMargin
          noInlineMargin
          onClick={(e) => {
            e.stopPropagation();
            setShowReplyModal(true);
          }}
          {...extraIconProps}
        />
        <Icon
          noBottomMargin
          noInlineMargin
          src={isRetweeted ? RetweetActiveIcon : RetweetIcon}
          hover="green"
          title={isRetweeted ? "Undo Retweet" : "Retweet"}
          text={includeText ? stats.totalRetweets.toString() : ""}
          onClick={(e) => {
            e.stopPropagation();
            isRetweeted
              ? undoRetweetMutation({ tweetID: tweet.id })
              : retweetMutation({ tweetID: tweet.id });
          }}
          {...extraIconProps}
        />
        <Icon
          noBottomMargin
          noInlineMargin
          src={isLiked ? LikedIcon : LikeIcon}
          hover="pink"
          title={isLiked ? "Unlike" : "Like"}
          text={includeText ? stats.totalLikes.toString() : ""}
          onClick={(e) => {
            e.stopPropagation();
            isLiked
              ? unlikeTweetMutation({ tweetID: tweet.id })
              : likeTweetMutation({ tweetID: tweet.id });
          }}
          {...extraIconProps}
        />
        {bookmarkInsteadOfViews ? (
          <Icon
            noBottomMargin
            noInlineMargin
            src={BookmarkIcon}
            hover="primary"
            title="Bookmark"
            text={includeText ? stats.views.toString() : ""}
            onClick={(e) => e.stopPropagation()}
            {...extraIconProps}
          />
        ) : (
          <Icon
            noBottomMargin
            noInlineMargin
            src={ViewsIcon}
            hover="primary"
            title="Views"
            text={includeText ? stats.views.toString() : ""}
            onClick={(e) => e.stopPropagation()}
            {...extraIconProps}
          />
        )}
        <Icon
          noBottomMargin
          noInlineMargin
          onClick={(e) => e.stopPropagation()}
          src={ShareIcon}
          hover="primary"
          title="Share"
          {...extraIconProps}
        />
      </div>
    </>
  );
};

export default TweetActions;
