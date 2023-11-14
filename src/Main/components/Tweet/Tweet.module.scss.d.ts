import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Tweet: "Tweet";
  readonly WithBorder: "WithBorder";
  readonly Retweet: "Retweet";
  readonly RetweetIconWrapper: "RetweetIconWrapper";
  readonly RetweetIcon: "RetweetIcon";
  readonly TweetWrapper: "TweetWrapper";
  readonly Simple: "Simple";
  readonly Text: "Text";
  readonly Avatar: "Avatar";
  readonly ReplyLine: "ReplyLine";
  readonly ShowMoreIcon: "ShowMoreIcon";
  readonly Transform: "Transform";
  readonly Wrapper: "Wrapper";
  readonly ShowMore: "ShowMore";
  readonly Info: "Info";
  readonly Name: "Name";
  readonly Verified: "Verified";
  readonly Subinfo: "Subinfo";
  readonly MoreIcon: "MoreIcon";
};
export = classNames;
export type ClassNames =
  | "Tweet"
  | "WithBorder"
  | "Retweet"
  | "RetweetIconWrapper"
  | "RetweetIcon"
  | "TweetWrapper"
  | "Simple"
  | "Text"
  | "Avatar"
  | "ReplyLine"
  | "ShowMoreIcon"
  | "Transform"
  | "Wrapper"
  | "ShowMore"
  | "Info"
  | "Name"
  | "Verified"
  | "Subinfo"
  | "MoreIcon"
  | GlobalClassNames;
