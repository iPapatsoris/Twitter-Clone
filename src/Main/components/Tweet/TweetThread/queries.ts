import { createQueryKeys } from "@lukemorales/query-key-factory";
import { getData } from "../../../../util/request";
import {
  ExpandTweetReplies,
  GetTweet,
} from "../../../../../backend/src/api/tweet";
import { QueryClient } from "@tanstack/react-query";
import { LoaderFunctionArgs } from "react-router-dom";
import { GetUser } from "../../../../../backend/src/api/user";
import {
  SmallProfileRequestFields,
  profileKeys,
  smallPreviewProfileFields,
} from "../../../routes/Profile/ProfileFace/queries";
import { setTweet } from "../queries";

export type ExpansionDirection = "downward" | "upward";
export const tweetThreadKeys = createQueryKeys("tweetThread", {
  tweetID: (id: number, queryClient) => ({
    queryKey: [id],
    queryFn: () => tweetThreadQuery(id, queryClient),
  }),
  expandReply: (replyToExpand: number, direction: ExpansionDirection) => ({
    queryKey: ["expand", direction, replyToExpand],
    queryFn: () => expandTweetRepliesQuery(replyToExpand, direction),
  }),
});

const tweetThreadQuery = async (tweetID: number, queryClient: QueryClient) => {
  const res = await getData<GetTweet["response"]>("/tweet/" + tweetID);

  if (!res.ok) {
    throw new Error();
  }
  // Set tweet's author profile cache
  const tweetAuthor = res.data?.tweet.author;
  queryClient.setQueryData<
    GetUser<SmallProfileRequestFields>["response"]["data"]
  >(
    profileKeys
      .username(tweetAuthor?.username!)
      ._ctx.fields(smallPreviewProfileFields).queryKey,
    {
      user: { ...tweetAuthor!, isFollowedByActiveUser: false },
    }
  );

  const { tweet, previousReplies, replies } = res.data!;

  setTweet(tweet, queryClient);

  previousReplies.forEach((reply) => setTweet(reply, queryClient));
  replies.forEach(({ tweets }) =>
    tweets.forEach((reply) => setTweet(reply, queryClient))
  );

  return res;
};

export const tweetThreadLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const { queryKey, queryFn } = tweetThreadKeys.tweetID(
      parseInt(params.tweetID!),
      queryClient
    );

    const tweetThreadData = await queryClient.fetchQuery({
      queryKey,
      queryFn,
    });

    return tweetThreadData;
  };

const expandTweetRepliesQuery = async (
  replyToExpand: number,
  direction: ExpansionDirection
) => {
  const directionPath = direction === "downward" ? "Downward" : "Upward";
  const res = await getData<ExpandTweetReplies["response"]>(
    "tweet/" + replyToExpand + "/expandReplies" + directionPath
  );

  if (!res.ok) {
    throw new Error();
  }
  return res.data;
};
