import { createQueryKeys } from "@lukemorales/query-key-factory";
import { getData } from "../../../../util/request";
import { GetUserTweetsAndRetweets } from "../../../../../backend/src/api/user";

export const userTweetsKeys = createQueryKeys("userTweets", {
  tweetsOfUsername: (username: string) => ({
    queryKey: [username],
    queryFn: () => userTweetsQuery(username),
  }),
});

const userTweetsQuery = async (username: string) => {
  const res = await getData<GetUserTweetsAndRetweets["response"]>(
    "user/" + username + "/tweets"
  );

  if (!res.ok) {
    throw new Error();
  }
  return res;
};
