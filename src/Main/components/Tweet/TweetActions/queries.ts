import { MutateFunction } from "@tanstack/react-query";
import { deleteData, postData } from "../../../../util/request";
import { SingleTweetResponse } from "../../../../../backend/src/api/tweet";

export const likeTweetQuery: MutateFunction<
  SingleTweetResponse,
  unknown,
  { id: number }
> = async (body) => {
  const res = await postData<SingleTweetResponse, "">(
    "tweet/" + body.id + "/like",
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
  { id: number }
> = async (body) => {
  const res = await deleteData<SingleTweetResponse, "">(
    "tweet/" + body.id + "/like"
  );

  if (!res.ok) {
    throw new Error();
  }
  return res;
};

export const retweetQuery: MutateFunction<
  SingleTweetResponse,
  unknown,
  { id: number }
> = async (body) => {
  const res = await postData<SingleTweetResponse, "">(
    "tweet/" + body.id + "/retweet",
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
  { id: number }
> = async (body) => {
  const res = await deleteData<SingleTweetResponse, "">(
    "tweet/" + body.id + "/retweet"
  );

  if (!res.ok) {
    throw new Error();
  }
  return res;
};
