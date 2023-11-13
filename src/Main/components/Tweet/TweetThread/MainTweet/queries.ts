import { MutateFunction } from "@tanstack/react-query";
import { SingleTweetResponse } from "../../../../../../backend/src/api/tweet";
import { patchData } from "../../../../../util/request";

export const addViewQuery: MutateFunction<
  { tweet: SingleTweetResponse["data"] },
  unknown,
  { tweetID: number }
> = async (body) => {
  const res = await patchData<SingleTweetResponse>(
    "tweet/" + body.tweetID + "/addView",
    {}
  );

  if (!res.ok) {
    throw new Error();
  }
  return { tweet: res.data };
};
