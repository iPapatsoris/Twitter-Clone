import globalClassNames from "../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Wrapper: "Wrapper";
  readonly Sidebar: "Sidebar";
  readonly Modal: "Modal";
  readonly TweetIconWrapper: "TweetIconWrapper";
  readonly TweetButtonWrapper: "TweetButtonWrapper";
};
export = classNames;
