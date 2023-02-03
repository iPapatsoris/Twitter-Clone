import { User } from "./user";

export type Tweet = {
  id: number;
  text: string;
  isReply: boolean;
  referencedTweetID?: number;
  creationDate: string;
  replyDepth: number;
  rootTweetID: number;
  usernameTags?: Array<{
    username: string;
    id: number;
  }>;
  author: Pick<User, "id" | "name" | "username" | "isVerified" | "avatar">;
  stats: {
    views: number;
    totalRetweets: number;
    totalLikes: number;
    totalReplies: number;
  };
};

export type Retweet = {
  id: number;
  retweetDate: string;
  tweet: Tweet;
  retweeter: Pick<User, "id" | "name">;
};

export const convertQueryResultToTweets = (resultArray: any[]): Tweet[] => {
  return resultArray.map((result) => ({
    id: result.id,
    text: result.text,
    isReply: result.isReply,
    referencedTweetID: result.referencedTweetID,
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
    stats: {
      views: result.views,
      totalRetweets: -1,
      totalLikes: -1,
      totalReplies: -1,
    },
  }));
};
