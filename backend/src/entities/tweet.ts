import { User } from "./user";

export type Tweet = {
  id: number;
  text: string;
  isReply: boolean;
  isRetweet: boolean;
  referencedTweetID?: number;
  views: number;
  creationDate: string;
  replyDepth: number;
  rootTweetID: number;
  usernameTags?: string[];
  author: Pick<User, "id" | "name" | "username" | "isVerified" | "avatar">;
};

export const convertQueryResultToTweet = (result: any): Tweet => {
  return {
    id: result.id,
    text: result.text,
    isReply: result.isReply,
    isRetweet: result.isRetweet,
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
