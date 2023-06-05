import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly TweetActions: "TweetActions";
  readonly TweetAction: "TweetAction";
};
export = classNames;
export type TweetActionsNames =
  | "TweetActions"
  | "TweetAction"
  | GlobalClassNames;
