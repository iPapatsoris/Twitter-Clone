import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly MainTweet: "MainTweet";
  readonly MainInfo: "MainInfo";
  readonly Stats: "Stats";
  readonly Actions: "Actions";
  readonly MainTweetActionIcon: "MainTweetActionIcon";
};
export = classNames;
export type ClassNames =
  | "MainTweet"
  | "MainInfo"
  | "Stats"
  | "Actions"
  | "MainTweetActionIcon"
  | GlobalClassNames;
