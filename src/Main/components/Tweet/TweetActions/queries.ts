import { MutateFunction } from "@tanstack/react-query";
import { deleteData, postData } from "../../../../util/request";
import { SingleTweetResponse } from "../../../../../backend/src/api/tweet";

export const likeTweetQuery: MutateFunction<
  { tweet: SingleTweetResponse["data"] },
  unknown,
  { tweetID: number }
> = async (body) => {
  const res = await postData<SingleTweetResponse>(
    "tweet/" + body.tweetID + "/like",
    {}
  );

  if (!res.ok) {
    throw new Error();
  }
  return { tweet: res.data };
};

export const unlikeTweetQuery: MutateFunction<
  { tweet: SingleTweetResponse["data"] },
  unknown,
  { tweetID: number }
> = async (body) => {
  const res = await deleteData<SingleTweetResponse>(
    "tweet/" + body.tweetID + "/like"
  );

  if (!res.ok) {
    throw new Error();
  }
  return { tweet: res.data };
};

export const retweetQuery: MutateFunction<
  { tweet: SingleTweetResponse["data"] },
  unknown,
  { tweetID: number }
> = async (body) => {
  const res = await postData<SingleTweetResponse>(
    "tweet/" + body.tweetID + "/retweet",
    {}
  );

  if (!res.ok) {
    throw new Error();
  }
  return { tweet: res.data };
};

export const undoRetweetQuery: MutateFunction<
  { tweet: SingleTweetResponse["data"] },
  unknown,
  { tweetID: number }
> = async (body) => {
  const res = await deleteData<SingleTweetResponse>(
    "tweet/" + body.tweetID + "/retweet"
  );

  if (!res.ok) {
    throw new Error();
  }
  return { tweet: res.data };
};
