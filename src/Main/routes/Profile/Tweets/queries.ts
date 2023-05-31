import { createQueryKeys } from "@lukemorales/query-key-factory";
import { getData } from "../../../../util/request";
import { GetUserTweetsAndRetweets } from "../../../../../backend/src/api/user";

export const userTweetsKeys = createQueryKeys("userTweets", {
  userID: (userID: number) => ({
    queryKey: [userID],
    queryFn: () => userTweetsQuery(userID),
  }),
});

const userTweetsQuery = async (userID: number) => {
  const res = await getData<GetUserTweetsAndRetweets["response"]>(
    "user/" + userID + "/tweets"
  );

  if (!res.ok) {
    throw new Error();
  }
  return res;
};
