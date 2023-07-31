import globalClassNames, { ClassNames as GlobalClassNames } from "../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Sidebar: "Sidebar";
  readonly Logo: "Logo";
  readonly TweetButton: "TweetButton";
};
export = classNames;
export type ClassNames = "Sidebar" | "Logo" | "TweetButton" | GlobalClassNames;
