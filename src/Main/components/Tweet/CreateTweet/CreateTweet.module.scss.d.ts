import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly CreateTweet: "CreateTweet";
  readonly Avatar: "Avatar";
  readonly Widgets: "Widgets";
  readonly LocationIcon: "LocationIcon";
  readonly PostButton: "PostButton";
};
export = classNames;
export type ClassNames =
  | "CreateTweet"
  | "Avatar"
  | "Widgets"
  | "LocationIcon"
  | "PostButton"
  | GlobalClassNames;
