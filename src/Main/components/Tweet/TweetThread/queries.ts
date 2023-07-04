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
} from "../../../routes/Profile/queries";

export const tweetThreadKeys = createQueryKeys("tweetThread", {
  tweetID: (id: number) => ({
    queryKey: [id],
    queryFn: () => tweetThreadQuery(id),
    contextQueries: {
      expandReply: (replyToExpand) => ({
        queryKey: ["expand", replyToExpand],
        queryFn: () => expandTweetRepliesQuery(replyToExpand),
      }),
    },
  }),
});

const tweetThreadQuery = async (tweetID: number) => {
  const res = await getData<GetTweet["response"]>("/tweet/" + tweetID);

  if (!res.ok) {
    throw new Error();
  }
  return res;
};

export const tweetThreadLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const { queryKey, queryFn } = tweetThreadKeys.tweetID(
      parseInt(params.tweetID!)
    );

    const tweetThreadData = await queryClient.ensureQueryData({
      queryKey,
      queryFn,
    });

    // Set tweet's author profile cache
    const tweetAuthor = tweetThreadData.data?.tweet.author;
    queryClient.setQueryData<GetUser<SmallProfileRequestFields>["response"]>(
      profileKeys
        .username(tweetAuthor?.username!)
        ._ctx.fields(smallPreviewProfileFields).queryKey,
      {
        ok: true,
        data: { user: { ...tweetAuthor!, isFollowedByActiveUser: false } },
      }
    );

    return tweetThreadData;
  };

const expandTweetRepliesQuery = async (replyToExpand: number) => {
  const res = await getData<ExpandTweetReplies["response"]>(
    "tweet/" + replyToExpand + "/expandRepliesDownward"
  );

  if (!res.ok) {
    throw new Error();
  }
  return res;
};
