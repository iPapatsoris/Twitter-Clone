import globalClassNames, { ClassNames as GlobalClassNames } from "../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Sidebar: "Sidebar";
  readonly Logo: "Logo";
  readonly Icon: "Icon";
  readonly TweetButton: "TweetButton";
};
export = classNames;
export type SidebarNames =
  | "Sidebar"
  | "Logo"
  | "Icon"
  | "TweetButton"
  | GlobalClassNames;
