import { createQueryKeys } from "@lukemorales/query-key-factory";
import { getData } from "../../../../util/request";
import {
  ExpandTweetReplies,
  GetTweet,
} from "../../../../../backend/src/api/tweet";
import { QueryClient } from "@tanstack/react-query";
import { LoaderFunctionArgs } from "react-router-dom";

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

// On profile load from URL, fetch the full profile
export const tweetThreadLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const { queryKey, queryFn } = tweetThreadKeys.tweetID(
      parseInt(params.tweetID!)
    );

    const data = await queryClient.ensureQueryData({ queryKey, queryFn });
    return data;
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
