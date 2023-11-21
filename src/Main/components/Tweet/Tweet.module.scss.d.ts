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
  readonly ShowMoreIcon: "ShowMoreIcon";
  readonly Transform: "Transform";
  readonly ReplyLine: "ReplyLine";
  readonly Wrapper: "Wrapper";
  readonly ShowMore: "ShowMore";
  readonly Info: "Info";
  readonly Subinfo: "Subinfo";
  readonly MoreIcon: "MoreIcon";
  readonly UnderlineOnHover: "UnderlineOnHover";
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
  | "ShowMoreIcon"
  | "Transform"
  | "ReplyLine"
  | "Wrapper"
  | "ShowMore"
  | "Info"
  | "Subinfo"
  | "MoreIcon"
  | "UnderlineOnHover"
  | GlobalClassNames;
