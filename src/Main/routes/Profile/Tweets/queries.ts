import { createQueryKeys } from "@lukemorales/query-key-factory";
import { getData } from "../../../../util/request";
import {
  GetUserThreads,
  GetUserTweetsAndRetweets,
} from "../../../../../backend/src/api/user";
import { GetTweets } from "../../../../../backend/src/api/tweet";
import { QueryClient } from "@tanstack/react-query";
import { LoaderFunctionArgs } from "react-router-dom";
import { setTweet } from "../../../components/Tweet/queries";

export const userTweetsKeys = createQueryKeys("userTweets", {
  tweetsOfUsername: (username: string) => ({
    queryKey: [username],
    queryFn: () => userTweetsQuery(username),
    contextQueries: {
      withReplies: {
        queryKey: ["replies"],
        queryFn: () => userRepliesQuery(username),
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
  return res.data;
};

const userRepliesQuery = async (username: string) => {
  const res = await getData<GetUserThreads["response"]>(
    "user/" + username + "/replies"
  );

  if (!res.ok) {
    throw new Error();
  }
  return res.data;
};

const userLikedTweetsQuery = async (username: string) => {
  const res = await getData<GetTweets["response"]>(
    "user/" + username + "/likes"
  );

  if (!res.ok) {
    throw new Error();
  }
  return res.data;
};

export const userTweetsLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const { queryKey, queryFn } = userTweetsKeys.tweetsOfUsername(
      params.username!
    );

    const data = await queryClient.fetchQuery({ queryKey, queryFn });
    data?.tweetsAndRetweets.forEach((t) =>
      setTweet(t.tweet || t.retweet?.tweet!, queryClient)
    );
    return data;
  };

export const userRepliesLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const { queryKey, queryFn } = userTweetsKeys.tweetsOfUsername(
      params.username!
    )._ctx.withReplies;

    const data = await queryClient.fetchQuery({ queryKey, queryFn });
    data?.threads.forEach((thread) => {
      thread.tweets.forEach((tweet) => setTweet(tweet, queryClient));
    });
    return data;
  };

export const userLikedTweetsLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const { queryKey, queryFn } = userTweetsKeys.tweetsOfUsername(
      params.username!
    )._ctx.likedTweets;

    const data = await queryClient.fetchQuery({ queryKey, queryFn });
    data?.tweets.forEach((t) => setTweet(t, queryClient));
    return data;
  };
