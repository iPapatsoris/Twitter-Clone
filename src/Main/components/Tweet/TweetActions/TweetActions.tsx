import styles from "./TweetActions.module.scss";
import retweetIcon from "../../../../assets/icons/tweet/retweet.png";
import retweetActiveIcon from "../../../../assets/icons/tweet/retweet-active.png";
import replyIcon from "../../../../assets/icons/tweet/reply.png";
import likeIcon from "../../../../assets/icons/tweet/like.png";
import likedIcon from "../../../../assets/icons/tweet/liked.png";
import viewsIcon from "../../../../assets/icons/tweet/views.png";
import shareIcon from "../../../../assets/icons/tweet/share.png";
import bookmarkIcon from "../../../../assets/icons/tweet/bookmark.png";
import Icon, { IconProps } from "../../../../util/components/Icon/Icon";
import {
  QueryClient,
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Tweet } from "../../../../../backend/src/entities/tweet";
import { NormalResponse } from "../../../../../backend/src/api/common";
import {
  likeTweetQuery,
  retweetQuery,
  undoRetweetQuery,
  unlikeTweetQuery,
} from "./queries";
import { tweetKeys } from "../queries";
import { SingleTweetResponse } from "../../../../../backend/src/api/tweet";

export const getRefreshTweetCallback =
  (
    queryClient: QueryClient
  ): UseMutationOptions<
    SingleTweetResponse,
    unknown,
    { tweetID: number }
  >["onSuccess"] =>
  (resp, { tweetID }) => {
    if (resp.ok) {
      queryClient.setQueryData<NormalResponse<Tweet>>(
        tweetKeys.tweetID(tweetID).queryKey,
        { ok: true, data: resp.data }
      );
    }
  };
interface TweetActionsProps {
  includeText: boolean;
  bookmarkInsteadOfViews: boolean;
  leftAlignFirstIcon?: boolean;
  justifyContent: "space-around" | "space-between";
  extraIconProps?: Partial<IconProps>;
  tweet: Pick<Tweet, "stats" | "isLiked" | "isRetweeted" | "id" | "author">;
}

const TweetActions = ({
  includeText,
  bookmarkInsteadOfViews,
  leftAlignFirstIcon = false,
  justifyContent,
  extraIconProps = {},
  tweet,
}: TweetActionsProps) => {
  const { stats, isLiked, isRetweeted, id, author } = tweet;
  const queryClient = useQueryClient();

  const { mutate: likeTweetMutation } = useMutation(likeTweetQuery, {
    onSuccess: getRefreshTweetCallback(queryClient),
  });

  const { mutate: unlikeTweetMutation } = useMutation(unlikeTweetQuery, {
    onSuccess: getRefreshTweetCallback(queryClient),
  });

  const { mutate: retweetMutation } = useMutation(retweetQuery, {
    onSuccess: getRefreshTweetCallback(queryClient),
  });

  const { mutate: undoRetweetMutation } = useMutation(undoRetweetQuery, {
    onSuccess: getRefreshTweetCallback(queryClient),
  });

  return (
    <div
      className={[
        styles.TweetActions,
        justifyContent === "space-between"
          ? styles.SpaceBetween
          : styles.SpaceAround,
      ].join(" ")}
    >
      <Icon
        src={replyIcon}
        hover="primary"
        title="Reply"
        text={includeText ? stats.totalReplies.toString() : ""}
        // noLeftMargin={leftAlignFirstIcon}
        // noRightMargin
        noBottomMargin
        noInlineMargin
        onClick={(e) => e.stopPropagation()}
        {...extraIconProps}
      />
      <Icon
        noBottomMargin
        noInlineMargin
        src={isRetweeted ? retweetActiveIcon : retweetIcon}
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
        src={isLiked ? likedIcon : likeIcon}
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
          src={bookmarkIcon}
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
          src={viewsIcon}
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
        src={shareIcon}
        hover="primary"
        title="Share"
        {...extraIconProps}
      />
    </div>
  );
};

export default TweetActions;
