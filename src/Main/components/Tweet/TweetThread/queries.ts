import { createQueryKeys } from "@lukemorales/query-key-factory";
import { getData } from "../../../../util/request";
import { GetTweet } from "../../../../../backend/src/api/tweet";
import { QueryClient } from "@tanstack/react-query";
import { LoaderFunctionArgs } from "react-router-dom";

export const tweetThreadKeys = createQueryKeys("tweetThread", {
  tweetID: (id: number) => ({
    queryKey: [id],
    queryFn: () => tweetThreadQuery(id),
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
