import globalClassNames, { ClassNames as GlobalClassNames } from "../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Sidebar: "Sidebar";
  readonly Logo: "Logo";
  readonly TweetButtonWrapper: "TweetButtonWrapper";
  readonly TweetButton: "TweetButton";
  readonly Modal: "Modal";
};
export = classNames;
export type ClassNames =
  | "Sidebar"
  | "Logo"
  | "TweetButtonWrapper"
  | "TweetButton"
  | "Modal"
  | GlobalClassNames;
