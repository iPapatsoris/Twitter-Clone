import { MutateFunction } from "@tanstack/react-query";
import { NormalResponse } from "../../../../../backend/src/api/common";
import { deleteData, postData } from "../../../../util/request";

export const likeTweetQuery: MutateFunction<
  NormalResponse,
  unknown,
  { id: number }
> = async (body) => {
  const res = await postData<NormalResponse, "">(
    "tweet/" + body.id + "/like",
    {}
  );

  if (!res.ok) {
    throw new Error();
  }
  return res;
};

export const unlikeTweetQuery: MutateFunction<
  NormalResponse,
  unknown,
  { id: number }
> = async (body) => {
  const res = await deleteData<NormalResponse, "">(
    "tweet/" + body.id + "/like"
  );

  if (!res.ok) {
    throw new Error();
  }
  return res;
};
