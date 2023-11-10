import { create } from "zustand";
import { Retweet } from "../../backend/src/entities/tweet";

type ExtraTweet = {
  id: number;
  retweet?: Pick<Retweet, "retweeter" | "retweetDate"> & {
    innerTweetID: number;
  };
};

const useExtraTimelineTweetsStore = create<{
  extraTweets: ExtraTweet[];
  maxLoadedTweetIDFromUpTimeline: number;
  actions: {
    addTweetsAtFront: (tweetsToAdd: ExtraTweet[]) => void;
    setMaxLoadedTweetIDFromUpTimeline: (tweetID: number) => void;
  };
}>((set) => ({
  extraTweets: [],
  maxLoadedTweetIDFromUpTimeline: -1,
  actions: {
    addTweetsAtFront: (tweetsToAdd: ExtraTweet[]) =>
      set((state) => ({
        extraTweets: tweetsToAdd.concat(state.extraTweets),
      })),
    setMaxLoadedTweetIDFromUpTimeline: (tweetID) =>
      set(() => ({
        maxLoadedTweetIDFromUpTimeline: tweetID,
      })),
  },
}));

export const useExtraTimelineTweets = () =>
  useExtraTimelineTweetsStore((state) => state.extraTweets);
export const useMaxLoadedTweetIDFromUpTimeline = () =>
  useExtraTimelineTweetsStore((state) => state.maxLoadedTweetIDFromUpTimeline);
export const useExtraTweetActions = () =>
  useExtraTimelineTweetsStore((state) => state.actions);
