import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly CreateTweet: "CreateTweet";
  readonly BorderAround: "BorderAround";
  readonly BorderBetween: "BorderBetween";
  readonly Widgets: "Widgets";
  readonly RightContent: "RightContent";
  readonly Avatar: "Avatar";
  readonly TextArea: "TextArea";
  readonly LocationIcon: "LocationIcon";
  readonly Progress: "Progress";
  readonly PostContainer: "PostContainer";
  readonly PostButton: "PostButton";
};
export = classNames;
export type ClassNames =
  | "CreateTweet"
  | "BorderAround"
  | "BorderBetween"
  | "Widgets"
  | "RightContent"
  | "Avatar"
  | "TextArea"
  | "LocationIcon"
  | "Progress"
  | "PostContainer"
  | "PostButton"
  | GlobalClassNames;
