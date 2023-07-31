import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Tweet: "Tweet";
  readonly WithBorder: "WithBorder";
  readonly Retweet: "Retweet";
  readonly Retweeter: "Retweeter";
  readonly RetweetIconWrapper: "RetweetIconWrapper";
  readonly RetweetIcon: "RetweetIcon";
  readonly TweetWrapper: "TweetWrapper";
  readonly Avatar: "Avatar";
  readonly ReplyLine: "ReplyLine";
  readonly ShowMoreIcon: "ShowMoreIcon";
  readonly Transform: "Transform";
  readonly Wrapper: "Wrapper";
  readonly ShowMore: "ShowMore";
  readonly Info: "Info";
  readonly Subinfo: "Subinfo";
  readonly Name: "Name";
  readonly MoreIcon: "MoreIcon";
};
export = classNames;
export type ClassNames =
  | "Tweet"
  | "WithBorder"
  | "Retweet"
  | "Retweeter"
  | "RetweetIconWrapper"
  | "RetweetIcon"
  | "TweetWrapper"
  | "Avatar"
  | "ReplyLine"
  | "ShowMoreIcon"
  | "Transform"
  | "Wrapper"
  | "ShowMore"
  | "Info"
  | "Subinfo"
  | "Name"
  | "MoreIcon"
  | GlobalClassNames;
