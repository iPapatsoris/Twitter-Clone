import globalClassNames from "../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Sidebar: "Sidebar";
  readonly Logo: "Logo";
  readonly Icon: "Icon";
  readonly TweetButton: "TweetButton";
};
export = classNames;
