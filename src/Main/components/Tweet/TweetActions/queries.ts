import { MutateFunction } from "@tanstack/react-query";
import { deleteData, postData } from "../../../../util/request";
import { SingleTweetResponse } from "../../../../../backend/src/api/tweet";

export const likeTweetQuery: MutateFunction<
  SingleTweetResponse,
  unknown,
  { tweetID: number }
> = async (body) => {
  const res = await postData<SingleTweetResponse, "">(
    "tweet/" + body.tweetID + "/like",
    {}
  );

  if (!res.ok) {
    throw new Error();
  }
  return res;
};

export const unlikeTweetQuery: MutateFunction<
  SingleTweetResponse,
  unknown,
  { tweetID: number }
> = async (body) => {
  const res = await deleteData<SingleTweetResponse, "">(
    "tweet/" + body.tweetID + "/like"
  );

  if (!res.ok) {
    throw new Error();
  }
  return res;
};

export const retweetQuery: MutateFunction<
  SingleTweetResponse,
  unknown,
  { tweetID: number }
> = async (body) => {
  const res = await postData<SingleTweetResponse, "">(
    "tweet/" + body.tweetID + "/retweet",
    {}
  );

  if (!res.ok) {
    throw new Error();
  }
  return res;
};

export const undoRetweetQuery: MutateFunction<
  SingleTweetResponse,
  unknown,
  { tweetID: number }
> = async (body) => {
  const res = await deleteData<SingleTweetResponse, "">(
    "tweet/" + body.tweetID + "/retweet"
  );

  if (!res.ok) {
    throw new Error();
  }
  return res;
};
