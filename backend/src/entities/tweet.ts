export type Tweet = {
  id: number;
  authorID: number;
  text: string;
  isReply: boolean;
  isRetweet: boolean;
  referencedTweetID?: number;
  views: number;
  creationDate: string;
  replyDepth: number;
};
