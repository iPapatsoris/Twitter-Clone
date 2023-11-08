import { create } from "zustand";

const useCreatedTweetsStore = create<{
  createdTweetIDs: number[];
  addCreatedTweetID: (tweetID: number) => void;
}>((set) => ({
  createdTweetIDs: [],
  addCreatedTweetID: (tweetID: number) =>
    set((state) => ({ createdTweetIDs: [tweetID, ...state.createdTweetIDs] })),
}));

export default useCreatedTweetsStore;
