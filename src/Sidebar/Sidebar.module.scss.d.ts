import globalClassNames, { ClassNames as GlobalClassNames } from "../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Sidebar: "Sidebar";
  readonly TweetButtonWrapper: "TweetButtonWrapper";
  readonly TweetButton: "TweetButton";
  readonly Modal: "Modal";
};
export = classNames;
export type ClassNames =
  | "Sidebar"
  | "TweetButtonWrapper"
  | "TweetButton"
  | "Modal"
  | GlobalClassNames;
