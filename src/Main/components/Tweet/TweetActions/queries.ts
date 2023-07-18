import { MutateFunction } from "@tanstack/react-query";
import { deleteData, postData } from "../../../../util/request";
import { LikeTweet } from "../../../../../backend/src/api/tweet";

export const likeTweetQuery: MutateFunction<
  LikeTweet["response"],
  unknown,
  { id: number }
> = async (body) => {
  const res = await postData<LikeTweet["response"], "">(
    "tweet/" + body.id + "/like",
    {}
  );

  if (!res.ok) {
    throw new Error();
  }
  return res;
};

export const unlikeTweetQuery: MutateFunction<
  LikeTweet["response"],
  unknown,
  { id: number }
> = async (body) => {
  const res = await deleteData<LikeTweet["response"], "">(
    "tweet/" + body.id + "/like"
  );

  if (!res.ok) {
    throw new Error();
  }
  return res;
};
