import { createQueryKeys } from "@lukemorales/query-key-factory";
import { addQueryParams, getData } from "../../../util/request";
import { GetTweet } from "../../../../backend/src/api/tweet";
import { NormalResponse } from "../../../../backend/src/api/common";
import { Tweet } from "../../../../backend/src/entities/tweet";
import { QueryClient } from "@tanstack/react-query";

export const tweetKeys = createQueryKeys("tweet", {
  tweetID: (id: number) => ({
    queryKey: [id],
    queryFn: () => getTweet(id),
  }),
});

const getTweet = async (tweetID: number): Promise<NormalResponse<Tweet>> => {
  const res = await getData<GetTweet["response"]>(
    "/tweet/" + tweetID,
    addQueryParams(["noThread"])
  );
  if (!res.ok) {
    throw new Error();
  }

  return { ...res, data: res.data?.tweet };
};

export const setTweet = (tweet: Tweet, queryClient: QueryClient) =>
  queryClient.setQueryData<NormalResponse<Tweet>>(
    tweetKeys.tweetID(tweet.id).queryKey,
    { ok: true, data: tweet }
  );
