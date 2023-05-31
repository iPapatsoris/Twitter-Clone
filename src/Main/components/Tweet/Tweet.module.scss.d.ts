import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Tweet: "Tweet";
  readonly Avatar: "Avatar";
  readonly Wrapper: "Wrapper";
  readonly Info: "Info";
  readonly Name: "Name";
  readonly Username: "Username";
  readonly Verified: "Verified";
  readonly MoreIcon: "MoreIcon";
};
export = classNames;
export type TweetNames =
  | "Tweet"
  | "Avatar"
  | "Wrapper"
  | "Info"
  | "Name"
  | "Username"
  | "Verified"
  | "MoreIcon"
  | GlobalClassNames;
