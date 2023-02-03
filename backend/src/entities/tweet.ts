import { User } from "./user";

export type Tweet = {
  id: number;
  text: string;
  isReply: boolean;
  referencedTweetID?: number;
  views: number;
  creationDate: string;
  replyDepth: number;
  rootTweetID: number;
  usernameTags?: Array<{
    username: string;
    id: number;
  }>;
  author: Pick<User, "id" | "name" | "username" | "isVerified" | "avatar">;
  totalRetweets?: number;
  totalLikes?: number;
};

export type Retweet = {
  id: number;
  retweetDate: string;
  tweet: Tweet;
  retweeter: Pick<User, "id" | "name">;
};

export const convertQueryResultToTweet = (result: any): Tweet => {
  return {
    id: result.id,
    text: result.text,
    isReply: result.isReply,
    referencedTweetID: result.referencedTweetID,
    views: result.views,
    creationDate: result.creationDate,
    replyDepth: result.replyDepth,
    rootTweetID: result.rootTweetID,
    usernameTags: result.usernameTags,
    author: {
      id: result.authorID,
      name: result.name,
      username: result.username,
      isVerified: result.isVerified,
      avatar: result.avatar,
    },
  };
};

export const convertQueryResultToTweetArray = (resultArray: any[]): Tweet[] => {
  return resultArray.map((result) => convertQueryResultToTweet(result));
};
