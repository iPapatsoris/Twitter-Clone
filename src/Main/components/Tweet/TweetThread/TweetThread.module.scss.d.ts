import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly TweetThread: "TweetThread";
  readonly CreateTweet: "CreateTweet";
};
export = classNames;
export type ClassNames = "TweetThread" | "CreateTweet" | GlobalClassNames;
