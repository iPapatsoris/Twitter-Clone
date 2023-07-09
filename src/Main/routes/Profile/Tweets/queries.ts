import { createQueryKeys } from "@lukemorales/query-key-factory";
import { getData } from "../../../../util/request";
import {
  GetUserThreadsAndRetweets,
  GetUserTweetsAndRetweets,
} from "../../../../../backend/src/api/user";
import { GetTweets } from "../../../../../backend/src/api/tweet";

export const userTweetsKeys = createQueryKeys("userTweets", {
  tweetsOfUsername: (username: string) => ({
    queryKey: [username],
    queryFn: () => userTweetsQuery(username),
    contextQueries: {
      withReplies: {
        queryKey: ["withReplies"],
        queryFn: () => userTweetsWithRepliesQuery(username),
      },
      likedTweets: {
        queryKey: ["likedTweets"],
        queryFn: () => userLikedTweetsQuery(username),
      },
    },
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

const userTweetsWithRepliesQuery = async (username: string) => {
  const res = await getData<GetUserThreadsAndRetweets["response"]>(
    "user/" + username + "/replies"
  );

  if (!res.ok) {
    throw new Error();
  }
  return res;
};

const userLikedTweetsQuery = async (username: string) => {
  const res = await getData<GetTweets["response"]>(
    "user/" + username + "/likes"
  );

  if (!res.ok) {
    throw new Error();
  }
  return res;
};
