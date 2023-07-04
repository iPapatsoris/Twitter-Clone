import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Tweet: "Tweet";
  readonly WithBorder: "WithBorder";
  readonly Avatar: "Avatar";
  readonly ReplyLine: "ReplyLine";
  readonly ShowMoreIcon: "ShowMoreIcon";
  readonly Transform: "Transform";
  readonly Wrapper: "Wrapper";
  readonly ShowMore: "ShowMore";
  readonly Info: "Info";
  readonly Subinfo: "Subinfo";
  readonly Name: "Name";
  readonly Verified: "Verified";
  readonly MoreIcon: "MoreIcon";
};
export = classNames;
export type ClassNames =
  | "Tweet"
  | "WithBorder"
  | "Avatar"
  | "ReplyLine"
  | "ShowMoreIcon"
  | "Transform"
  | "Wrapper"
  | "ShowMore"
  | "Info"
  | "Subinfo"
  | "Name"
  | "Verified"
  | "MoreIcon"
  | GlobalClassNames;
