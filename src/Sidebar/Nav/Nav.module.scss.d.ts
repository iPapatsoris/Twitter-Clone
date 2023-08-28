import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly NavItem: "NavItem";
  readonly Logo: "Logo";
  readonly PostTweetButton: "PostTweetButton";
};
export = classNames;
export type ClassNames =
  | "NavItem"
  | "Logo"
  | "PostTweetButton"
  | GlobalClassNames;
