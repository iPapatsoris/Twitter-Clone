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
  readonly Avatar: "Avatar";
  readonly ReplyLine: "ReplyLine";
  readonly ShowMoreIcon: "ShowMoreIcon";
  readonly Transform: "Transform";
  readonly Wrapper: "Wrapper";
  readonly ShowMore: "ShowMore";
  readonly Info: "Info";
  readonly NameAndVerified: "NameAndVerified";
  readonly Subinfo: "Subinfo";
  readonly MoreIcon: "MoreIcon";
  readonly Text: "Text";
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
  | "Avatar"
  | "ReplyLine"
  | "ShowMoreIcon"
  | "Transform"
  | "Wrapper"
  | "ShowMore"
  | "Info"
  | "NameAndVerified"
  | "Subinfo"
  | "MoreIcon"
  | "Text"
  | GlobalClassNames;
