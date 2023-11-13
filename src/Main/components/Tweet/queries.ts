import { createQueryKeys } from "@lukemorales/query-key-factory";
import { addQueryParams, getData } from "../../../util/request";
import { GetTweet } from "../../../../backend/src/api/tweet";
import { Tweet } from "../../../../backend/src/entities/tweet";
import { QueryClient } from "@tanstack/react-query";

export const tweetKeys = createQueryKeys("tweet", {
  tweetID: (id: number) => ({
    queryKey: [id],
    queryFn: () => getTweet(id),
  }),
});

const getTweet = async (tweetID: number) => {
  const res = await getData<GetTweet["response"]>(
    "/tweet/" + tweetID,
    addQueryParams(["noThread"])
  );
  if (!res.ok) {
    throw new Error();
  }

  return { tweet: res.data?.tweet };
};

export const setTweet = (tweet: Tweet, queryClient: QueryClient) =>
  queryClient.setQueryData<{ tweet: Tweet }>(
    tweetKeys.tweetID(tweet.id).queryKey,
    { tweet }
  );
