import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Tweet: "Tweet";
  readonly Avatar: "Avatar";
  readonly Wrapper: "Wrapper";
  readonly Info: "Info";
  readonly Subinfo: "Subinfo";
  readonly Name: "Name";
  readonly Verified: "Verified";
  readonly MoreIcon: "MoreIcon";
};
export = classNames;
export type TweetNames =
  | "Tweet"
  | "Avatar"
  | "Wrapper"
  | "Info"
  | "Subinfo"
  | "Name"
  | "Verified"
  | "MoreIcon"
  | GlobalClassNames;
